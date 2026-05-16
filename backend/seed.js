const mongoose = require('mongoose');
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');

const userId = '6a0817fdfbd2b65c4d7cb8a9';

const seedData = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/taskmanager');
    console.log('Connected to DB');

    // Clear existing projects and tasks for this user
    await Project.deleteMany({});
    await Task.deleteMany({});
    console.log('Cleared existing projects and tasks');

    // Project 1: Neon Synthwave UI Design
    const uiProject = await Project.create({
      name: 'Project Orion: UI Redesign',
      description: 'Creating a futuristic, synthwave-inspired user interface for the next-gen web platform. Heavy use of glassmorphism and neon accents.',
      owner: userId,
      members: [userId]
    });

    await Task.create([
      {
        title: 'Design Dark Mode Color Palette',
        description: 'Select deep purples, neon pinks, and cyan blues for the primary palette.',
        status: 'DONE',
        priority: 'HIGH',
        dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        project: uiProject._id,
        assignedTo: userId,
        createdBy: userId
      },
      {
        title: 'Implement Glassmorphism Components',
        description: 'Build reusable React components with backdrop-filter blur and semi-transparent backgrounds.',
        status: 'IN PROGRESS',
        priority: 'HIGH',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // In 2 days
        project: uiProject._id,
        assignedTo: userId,
        createdBy: userId
      },
      {
        title: 'Animate Micro-interactions',
        description: 'Use Framer Motion to add subtle hover effects and page transition animations.',
        status: 'TO DO',
        priority: 'MEDIUM',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        project: uiProject._id,
        assignedTo: userId,
        createdBy: userId
      }
    ]);

    // Project 2: Quantum Algorithm Research
    const quantumProject = await Project.create({
      name: 'Quantum Algorithm Simulation',
      description: "Researching and simulating Shor's algorithm on a classic computing cluster.",
      owner: userId,
      members: [userId]
    });

    await Task.create([
      {
        title: 'Set up Qiskit Environment',
        description: "Install and configure IBM's Qiskit SDK for Python.",
        status: 'DONE',
        priority: 'MEDIUM',
        dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        project: quantumProject._id,
        assignedTo: userId,
        createdBy: userId
      },
      {
        title: 'Draft Whitepaper on Findings',
        description: 'Summarize the initial simulation results and error rates.',
        status: 'IN PROGRESS',
        priority: 'HIGH',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        project: quantumProject._id,
        assignedTo: userId,
        createdBy: userId
      },
      {
        title: 'Optimize State Vector Simulator',
        description: 'Refactor the simulation loop to utilize multi-threading for faster processing.',
        status: 'TO DO',
        priority: 'LOW',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        project: quantumProject._id,
        assignedTo: userId,
        createdBy: userId
      }
    ]);

    // Project 3: Cyberpunk Game Environment
    const gameProject = await Project.create({
      name: 'Cyberpunk Cityscape Assets',
      description: 'Modeling and texturing 3D assets for the new open-world cyberpunk RPG.',
      owner: userId,
      members: [userId]
    });

    await Task.create([
      {
        title: 'Model Neon Signs',
        description: 'Create various holographic and neon signs for the commercial district.',
        status: 'DONE',
        priority: 'LOW',
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        project: gameProject._id,
        assignedTo: userId,
        createdBy: userId
      },
      {
        title: 'Texture Flying Vehicles',
        description: 'Apply grunge and metallic textures to the commuter hover-cars.',
        status: 'TO DO',
        priority: 'MEDIUM',
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Overdue
        project: gameProject._id,
        assignedTo: userId,
        createdBy: userId
      },
      {
        title: 'Bake Lighting for Alleyways',
        description: 'Set up volumetric fog and bake indirect lighting for the lower city sectors.',
        status: 'TO DO',
        priority: 'HIGH',
        dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        project: gameProject._id,
        assignedTo: userId,
        createdBy: userId
      }
    ]);

    console.log('Creative data seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
