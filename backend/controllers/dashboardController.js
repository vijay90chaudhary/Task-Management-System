const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Get dashboard stats
// @route   GET /api/dashboard
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    let projects;
    let tasks;

    if (isAdmin) {
      projects = await Project.find({});
      tasks = await Task.find({});
    } else {
      projects = await Project.find({
        $or: [{ owner: userId }, { members: userId }],
      });
      const projectIds = projects.map(p => p._id);
      tasks = await Task.find({ project: { $in: projectIds } });
    }

    const totalTasks = tasks.length;
    const tasksByStatus = {
      'TO DO': tasks.filter(t => t.status === 'TO DO').length,
      'IN PROGRESS': tasks.filter(t => t.status === 'IN PROGRESS').length,
      'DONE': tasks.filter(t => t.status === 'DONE').length,
    };

    const overdueTasks = tasks.filter(t => {
      return t.status !== 'DONE' && new Date(t.dueDate) < new Date();
    }).length;

    // Tasks per user (only for members of these projects)
    const tasksPerUser = {};
    tasks.forEach(t => {
      if (t.assignedTo) {
        const userIdStr = t.assignedTo.toString();
        tasksPerUser[userIdStr] = (tasksPerUser[userIdStr] || 0) + 1;
      }
    });

    res.status(200).json({
      totalTasks,
      tasksByStatus,
      overdueTasks,
      tasksPerUser,
      projectCount: projects.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };
