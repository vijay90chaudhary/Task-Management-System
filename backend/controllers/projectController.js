const Project = require('../models/Project');
const User = require('../models/User');

// @desc    Get all projects for a user
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'ADMIN') {
      projects = await Project.find({}).populate('owner', 'name email');
    } else {
      projects = await Project.find({ members: req.user.id }).populate('owner', 'name email');
    }
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).json({ message: 'Please add all fields' });
  }

  try {
    const project = await Project.create({
      name,
      description,
      owner: req.user.id,
      members: [req.user.id], // Owner is also a member
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add member to project
// @route   POST /api/projects/:id/members
// @access  Private/Admin
const addMember = async (req, res) => {
  const { email } = req.body;

  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Only owner can add members
    if (project.owner.toString() !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const userToAdd = await User.findOne({ email });
    if (!userToAdd) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (project.members.includes(userToAdd._id)) {
      return res.status(400).json({ message: 'User already a member' });
    }

    project.members.push(userToAdd._id);
    await project.save();

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get project members
// @route   GET /api/projects/:id/members
// @access  Private
const getProjectMembers = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('members', 'name email role');
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json(project.members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProjects,
  createProject,
  addMember,
  getProjectMembers,
};
