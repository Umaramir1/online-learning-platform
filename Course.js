const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: 2000,
    },
    instructor: {
      type: String,
      required: [true, 'Instructor name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Web Development',
        'Data Science',
        'Mobile Development',
        'UI/UX Design',
        'Machine Learning',
        'Cybersecurity',
        'Cloud Computing',
        'DevOps',
        'Blockchain',
        'Other',
      ],
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    price: {
      type: Number,
      default: 0,
      min: 0,
    },
    duration: {
      type: String,
      default: '0 hours',
    },
    thumbnail: {
      type: String,
      default: '',
    },
    tags: [{ type: String }],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    enrolledStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
      },
    ],
    lessons: [
      {
        title: { type: String, required: true },
        content: { type: String },
        duration: { type: String },
        order: { type: Number },
      },
    ],
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Virtual for enrollment count
courseSchema.virtual('enrollmentCount').get(function () {
  return this.enrolledStudents.length;
});

courseSchema.set('toJSON', { virtuals: true });
courseSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Course', courseSchema);
