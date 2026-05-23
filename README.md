# Git Collaboration Platform

A full-stack Git-style code collaboration platform built with the MERN stack. The application allows users to create repositories, manage branches, upload files, track commits, create pull requests, manage issues, and collaborate in real time.

## Features

### Authentication & User Management

* User registration and login
* Secure authentication using JWT
* Protected routes
* Profile management
* Change password functionality

### Repository Management

* Create and manage repositories
* Add collaborators
* Branch creation and switching
* Repository dashboard
* File management system

### Version Control Features

* Commit tracking
* Pull request creation and management
* Issue tracking system
* Comment sections for collaboration
* Real-time notifications using sockets

### Frontend Features

* Responsive UI built with React
* Routing with React Router
* State management using Zustand
* Form handling with React Hook Form
* Toast notifications
* Modern UI with Tailwind CSS

---

# Tech Stack

## Frontend

* React
* Vite
* Tailwind CSS
* React Router DOM
* Axios
* Zustand
* React Hook Form
* Socket.IO Client

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Socket.IO
* Multer
* Cloudinary

---

# Project Structure
## Collaboration

```bash
Git_Project/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── sockets/
│   ├── utils/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── store/
│   └── package.json
│
└── README.md
```

---

# Installation

## 1. Clone the Repository

```bash
git clone https://github.com/SaiSriman6/Git_code_collaboration_platform.git
cd Git_code_collaboration_platform
```

---

## 2. Backend Setup

```bash
cd backend
npm install
```

### Create `.env` File

Create a `.env` file inside the backend folder and add the following variables:

```env
PORT=your_port
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLIENT_URL=your_frontend_url
```

### Run Backend

```bash
npm start
```

---

## 3. Frontend Setup

```bash
cd frontend
npm install
```

### Create `.env` File

```env
VITE_API_URL=your_backend_api_url
VITE_SOCKET_URL=your_socket_server_url
```

### Run Frontend

```bash
npm run dev
```

---

# API Modules

The backend contains APIs for:

* Authentication
* Repository management
* Branch management
* Commits
* Pull requests
* Issues
* Comments
* File uploads
* Notifications

---

# Real-Time Features

The application uses Socket.IO for:

* Live notifications
* Real-time collaboration updates
* Instant activity tracking

---

# Future Improvements

* Merge conflict handling
* Repository starring system
* Commit history visualization
* Code review enhancements
* Team workspaces
* Activity analytics

---

# Author

Developed as a full-stack MERN project for learning and collaboration purposes.
