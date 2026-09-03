# 🚀 TaskSpace — Task Management Application

**TaskSpace** is a full-stack task management application designed to help users create, organize, track, and manage their daily tasks efficiently.

The application provides a modern interactive dashboard with task statistics, task filtering, search functionality, status management, authentication, real-time updates, and a responsive user interface.

---

## 📌 Project Overview

TaskSpace is built as a full-stack web application using **React.js** for the frontend and **Node.js + Express.js** for the backend.

The application allows authenticated users to:

* Create new tasks
* View existing tasks
* Edit task details
* Delete tasks
* Change task status
* Track completed and pending tasks
* Search and filter tasks
* Identify overdue tasks
* Receive real-time task updates
* Manage account and application settings
* Logout securely

Instead of using MongoDB, the current version uses **JSON files for data storage**, making the project simple to set up and suitable for learning and demonstration purposes.

---

## ✨ Features

### 🔐 Authentication

* User registration
* User login
* JWT-based authentication
* Protected task routes
* Token-based authorization
* Logout functionality

### 📝 Task Management

Users can:

* Create tasks
* Edit tasks
* Delete tasks
* View task details
* Set task descriptions
* Set task priorities
* Set due dates
* Change task status

### 📊 Task Dashboard

The dashboard provides an overview of the user's tasks through:

* Total Tasks
* Pending Tasks
* In Progress Tasks
* Completed Tasks
* Overdue Task Detection

### 🔎 Search & Filtering

Tasks can be:

* Searched by title/content
* Filtered based on status
* Organized according to their current state

### ⚡ Real-Time Updates

TaskSpace uses **Socket.IO** to provide real-time updates.

When a task is:

* Created
* Updated
* Deleted

the dashboard can automatically reflect the change without requiring a manual page refresh.

### 🎨 Interactive UI

The application uses a modern dark-themed interface featuring:

* Black-based background
* Purple accents
* Light-blue highlights
* White typography
* Interactive mouse-following background effects
* Animated empty states
* Hover effects
* Interactive task cards
* Modern dashboard components

### ⚙️ Settings

The Settings page provides:

* User/account information
* Notification settings
* Real-time update settings
* Application information
* Logout functionality

---

## 🛠️ Tech Stack

### Frontend

| Technology       | Purpose                 |
| ---------------- | ----------------------- |
| React.js         | User interface          |
| React Router     | Page navigation         |
| CSS3             | Styling and animations  |
| Socket.IO Client | Real-time communication |
| JavaScript       | Application logic       |

### Backend

| Technology | Purpose                 |
| ---------- | ----------------------- |
| Node.js    | Runtime environment     |
| Express.js | REST API                |
| JWT        | Authentication          |
| Socket.IO  | Real-time communication |
| dotenv     | Environment variables   |
| CORS       | Cross-origin requests   |

### Database

The current project uses a simple JSON-based storage system:

```text
backend/database/
├── users.json
└── tasks.json
```

This avoids the need for an external database during development.

---

## 📂 Project Structure

```text
task-management-app/
│
├── backend/
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   │
│   ├── database/
│   │   ├── users.json
│   │   └── tasks.json
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   │
│   ├── server.js
│   ├── socket.js
│   ├── package.json
│   └── .env
│
├── public/
│
├── src/
│   │
│   ├── components/
│   │   ├── EditTaskModal.jsx
│   │   ├── Sidebar.jsx
│   │   ├── TaskCard.jsx
│   │   ├── TaskForm.jsx
│   │   └── Toast.jsx
│   │
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Tasks.jsx
│   │   ├── Completed.jsx
│   │   └── Settings.jsx
│   │
│   ├── api.js
│   ├── socket.js
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
└── README.md
```

---

## 🖥️ Application Pages

### Dashboard

The main dashboard provides:

* Task statistics
* Task search
* Task filtering
* Task creation
* Task cards
* Task editing
* Task deletion
* Status management
* Overdue detection
* Real-time updates

### My Tasks

Displays the user's tasks and allows them to manage their active tasks.

### Completed

Provides a dedicated view for completed tasks.

### Settings

Allows users to manage:

* Profile information
* Notification preferences
* Real-time settings
* Account settings
* Logout

---

## 🔄 Application Flow

```text
                 ┌──────────────┐
                 │    User      │
                 └──────┬───────┘
                        │
                        ▼
                ┌───────────────┐
                │ React Frontend│
                └───────┬───────┘
                        │
              REST API  │  Socket.IO
                        │
                        ▼
                ┌───────────────┐
                │ Express Server │
                └───────┬───────┘
                        │
              ┌─────────┴─────────┐
              ▼                   ▼
       ┌─────────────┐     ┌─────────────┐
       │ JWT Auth    │     │ Task API    │
       └─────────────┘     └──────┬──────┘
                                  │
                                  ▼
                         ┌────────────────┐
                         │  JSON Storage  │
                         │ users.json     │
                         │ tasks.json     │
                         └────────────────┘
```

---

# ⚙️ Installation & Setup

## 1. Clone the Repository

```bash
git clone https://github.com/your-username/task-management-app.git
```

Move into the project directory:

```bash
cd task-management-app
```

---

## 2. Install Frontend Dependencies

From the project root:

```bash
npm install
```

---

## 3. Install Backend Dependencies

Move into the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Return to the project root:

```bash
cd ..
```

---

## 4. Configure Environment Variables

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
JWT_SECRET=your_super_secret_key
```

### ⚠️ Important

Do not upload your actual `.env` file to GitHub.

Add this to `.gitignore`:

```text
.env
node_modules/
```

---

# ▶️ Running the Application

The frontend and backend need to run separately.

## Start the Backend

Open a terminal:

```bash
cd backend
npm start
```

The backend will run on:

```text
http://localhost:5000
```

---

## Start the Frontend

Open another terminal:

```bash
npm run dev
```

The React application will normally be available at:

```text
http://localhost:5173
```

---

# 🔑 Authentication

TaskSpace uses **JSON Web Tokens (JWT)** for authentication.

### Registration

```text
POST /api/auth/register
```

### Login

```text
POST /api/auth/login
```

After successful login, the JWT token is stored on the frontend and used when making protected API requests.

---

# 📡 API Endpoints

## Authentication

| Method | Endpoint             | Description         |
| ------ | -------------------- | ------------------- |
| POST   | `/api/auth/register` | Register a new user |
| POST   | `/api/auth/login`    | Login user          |

## Tasks

| Method | Endpoint         | Description      |
| ------ | ---------------- | ---------------- |
| GET    | `/api/tasks`     | Get user's tasks |
| POST   | `/api/tasks`     | Create a task    |
| PUT    | `/api/tasks/:id` | Update a task    |
| DELETE | `/api/tasks/:id` | Delete a task    |

Protected endpoints require a valid JWT token.

---

# ⚡ Real-Time Communication

TaskSpace uses Socket.IO for real-time task synchronization.

The following events are supported:

```text
taskCreated
taskUpdated
taskDeleted
```

This allows connected clients to receive task changes immediately.

---

# 📊 Task Status

Tasks can have one of the following statuses:

```text
Pending
In Progress
Completed
```

The dashboard calculates statistics based on the current task status.

---

# 🚨 Overdue Tasks

A task is considered overdue when:

* It has a due date
* Its due date has passed
* Its status is not `completed`

This allows users to quickly identify tasks that require attention.

---

# 🔍 Search & Filter

The dashboard provides task discovery through:

### Search

Users can search tasks using text.

### Filter

Tasks can be filtered based on their status:

```text
All
Pending
In Progress
Completed
```

---

# 🎨 UI/UX

TaskSpace follows a modern dark visual design.

### Design characteristics

* 🖤 Black primary background
* 🟣 Purple visual accents
* 🔵 Light-blue highlights
* ⚪ White typography
* ✨ Smooth hover animations
* 🖱️ Mouse-responsive background
* 📦 Interactive cards
* 🎯 Clear visual hierarchy

The goal is to create a dashboard that feels modern, interactive, and easy to navigate.

---

# 🧪 Testing

The API can be tested using tools such as:

* Postman
* Thunder Client
* Browser
* REST clients

Example:

```text
GET http://localhost:5000/api/tasks
```

For protected routes, include:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

---

# 🔒 Security Notes

This project is intended primarily for learning and demonstration.

For production deployment, additional security improvements should be implemented, including:

* Password hashing
* Stronger JWT configuration
* Input validation
* Rate limiting
* Secure HTTP headers
* Production database
* HTTPS
* Better error handling
* Secure cookie/session strategy

---

# 🚧 Future Improvements

Possible future improvements include:

* [ ] MongoDB/PostgreSQL database integration
* [ ] Drag-and-drop task organization
* [ ] Task categories
* [ ] Task tags
* [ ] Task attachments
* [ ] Calendar view
* [ ] Email notifications
* [ ] Advanced analytics
* [ ] Dark/light theme customization
* [ ] Team collaboration
* [ ] Task assignment
* [ ] Role-based access control
* [ ] Deployment to a cloud platform
* [ ] Automated testing
* [ ] Progressive Web App support

---

# 🎯 Learning Objectives

This project demonstrates practical implementation of:

* React component development
* React state management
* React Router
* REST API development
* Express.js
* Node.js
* JWT authentication
* CRUD operations
* JSON-based data persistence
* Socket.IO
* Real-time communication
* Frontend-backend integration
* API authorization
* Responsive UI design
* Interactive CSS animations

---

# 🤝 Contributing

Contributions are welcome.

To contribute:

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature/new-feature
```

3. Make your changes
4. Commit your changes

```bash
git commit -m "Add new feature"
```

5. Push the branch

```bash
git push origin feature/new-feature
```

6. Create a Pull Request

---

# 📄 License

This project is created for educational and development purposes.

You can add a specific open-source license such as the MIT License if you plan to distribute the project publicly.

---

# 👨‍💻 Author

**Vijith Juvviguntla**

Computer Science Engineering Student

---

## ⭐ Support

If you found this project useful, consider giving the repository a ⭐ on GitHub!

---

**TaskSpace — Organize. Track. Complete. 🚀**
