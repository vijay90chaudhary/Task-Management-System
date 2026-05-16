const express = require('express');
const router = express.Router();
const {
  getProjects,
  createProject,
  addMember,
  getProjectMembers,
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getProjects).post(protect, createProject);
router.post('/:id/members', protect, addMember);
router.get('/:id/members', protect, getProjectMembers);

module.exports = router;
