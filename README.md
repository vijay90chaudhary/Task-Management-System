# SyncroTask - Team Task Management System

SyncroTask is a professional, collaborative task management application built with the MERN stack and Tailwind CSS. It features a premium glassmorphism UI, role-based access control, and real-time-like dashboard statistics.

## Features

- **User Authentication**: Secure signup and login with role selection (Admin/Member).
- **Project Management**: Create projects, add team members, and track project-wide tasks.
- **Kanban Board**: Drag-and-drop-style task management with status transitions.
- **Dashboard**: High-level overview of total tasks, status distribution, and overdue items.
- **Role-Based Access**: 
  - **Admins**: Can create projects, add members, and manage all tasks.
  - **Members**: Can view assigned projects and update task statuses.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Lucide React, Framer Motion.
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, Bcrypt.
- **Deployment**: Railway.

## Setup Instructions

### Prerequisites
- Node.js installed.
- MongoDB (Local or Atlas) connection string.

### Backend Setup
1. Navigate to `backend/`.
2. Install dependencies: `npm install`.
3. Create a `.env` file based on the template:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   ```
4. Start the server: `npm run dev`.

### Frontend Setup
1. Navigate to `frontend/`.
2. Install dependencies: `npm install`.
3. Start the development server: `npm run dev`.
4. Open `http://localhost:5173` in your browser.

## Deployment to Railway

1. Push the code to a GitHub repository.
2. Link the repository to Railway.
3. Add the environment variables in Railway's dashboard (MONGO_URI, JWT_SECRET, etc.).
4. Railway will automatically detect the subdirectories and deploy. (Note: You may need to configure the root directory or deploy backend/frontend separately).

## License
MIT
