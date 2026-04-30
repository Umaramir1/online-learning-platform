const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudentEnrollments,
} = require('../controllers/studentController');

router.get('/', protect, adminOnly, getAllStudents);
router.get('/:id', protect, getStudentById);
router.put('/:id', protect, updateStudent);
router.delete('/:id', protect, adminOnly, deleteStudent);
router.get('/:id/enrollments', protect, getStudentEnrollments);

module.exports = router;
