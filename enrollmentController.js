const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Student = require('../models/Student');

// @desc    Enroll a student in a course
// @route   POST /api/enrollments
// @access  Private
const enrollStudent = async (req, res) => {
  try {
    const { courseId } = req.body;
    const studentId = req.student._id;

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({ student: studentId, course: courseId });
    if (existingEnrollment) {
      return res.status(400).json({ success: false, message: 'Already enrolled in this course' });
    }

    // Create enrollment record
    const enrollment = await Enrollment.create({ student: studentId, course: courseId });

    // Add course to student's enrolledCourses array
    await Student.findByIdAndUpdate(studentId, {
      $addToSet: { enrolledCourses: courseId },
    });

    // Add student to course's enrolledStudents array
    await Course.findByIdAndUpdate(courseId, {
      $addToSet: { enrolledStudents: studentId },
    });

    const populated = await enrollment.populate([
      { path: 'course', select: 'title instructor category level thumbnail duration' },
      { path: 'student', select: 'name email' },
    ]);

    res.status(201).json({
      success: true,
      message: `Successfully enrolled in "${course.title}"`,
      data: populated,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Already enrolled in this course' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Unenroll a student from a course
// @route   DELETE /api/enrollments/:enrollmentId
// @access  Private
const unenrollStudent = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.enrollmentId);

    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }

    // Ensure the student owns this enrollment
    if (enrollment.student.toString() !== req.student._id.toString() && req.student.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to unenroll' });
    }

    // Remove course from student's enrolledCourses
    await Student.findByIdAndUpdate(enrollment.student, {
      $pull: { enrolledCourses: enrollment.course },
    });

    // Remove student from course's enrolledStudents
    await Course.findByIdAndUpdate(enrollment.course, {
      $pull: { enrolledStudents: enrollment.student },
    });

    await enrollment.deleteOne();

    res.json({ success: true, message: 'Successfully unenrolled from course' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update enrollment progress
// @route   PUT /api/enrollments/:enrollmentId/progress
// @access  Private
const updateProgress = async (req, res) => {
  try {
    const { progress, completedLessons, status } = req.body;

    const enrollment = await Enrollment.findByIdAndUpdate(
      req.params.enrollmentId,
      { progress, completedLessons, status },
      { new: true }
    ).populate('course', 'title instructor category level thumbnail');

    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }

    res.json({ success: true, message: 'Progress updated', data: enrollment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all enrollments (admin)
// @route   GET /api/enrollments
// @access  Private/Admin
const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('student', 'name email')
      .populate('course', 'title category level instructor')
      .sort({ enrolledAt: -1 });

    res.json({ success: true, count: enrollments.length, data: enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { enrollStudent, unenrollStudent, updateProgress, getAllEnrollments };
