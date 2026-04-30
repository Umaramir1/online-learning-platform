const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  enrollStudent,
  unenrollStudent,
  updateProgress,
  getAllEnrollments,
} = require('../controllers/enrollmentController');

router.get('/', protect, adminOnly, getAllEnrollments);
router.post('/', protect, enrollStudent);
router.delete('/:enrollmentId', protect, unenrollStudent);
router.put('/:enrollmentId/progress', protect, updateProgress);

module.exports = router;
