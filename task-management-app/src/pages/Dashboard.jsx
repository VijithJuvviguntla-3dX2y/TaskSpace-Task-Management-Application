import {
  useEffect,
  useState,
} from "react";

import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import EditTaskModal from "../components/EditTaskModal";
import Toast from "../components/Toast";
import Sidebar from "../components/Sidebar";

import { apiRequest } from "../api";
import socket from "../socket";

function Dashboard() {

  // ==========================================
  // STATE
  // ==========================================

  const [tasks, setTasks] = useState([]);

  const [showForm, setShowForm] =
    useState(false);

  const [editingTask, setEditingTask] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [filter, setFilter] =
    useState("all");

  const [search, setSearch] =
    useState("");

  const [toast, setToast] =
    useState(null);

  // ==========================================
  // INTERACTIVE BACKGROUND
  // ==========================================

  const [mousePosition, setMousePosition] =
    useState({
      x: 50,
      y: 50,
    });

  // ==========================================
  // USER
  // ==========================================

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // ==========================================
  // MOUSE MOVEMENT
  // ==========================================

  useEffect(() => {

    const handleMouseMove = (event) => {

      setMousePosition({
        x:
          (event.clientX /
            window.innerWidth) *
          100,

        y:
          (event.clientY /
            window.innerHeight) *
          100,
      });

    };

    window.addEventListener(
      "mousemove",
      handleMouseMove
    );

    return () => {

      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );

    };

  }, []);

  // ==========================================
  // TOAST
  // ==========================================

  const showToast = (
    message,
    type = "success"
  ) => {

    setToast({
      message,
      type,
    });

    setTimeout(() => {
      setToast(null);
    }, 3000);

  };

  // ==========================================
  // FETCH TASKS
  // ==========================================

  const fetchTasks = async () => {

    try {

      setLoading(true);
      setError("");

      const data =
        await apiRequest("/tasks");

      setTasks(
        data.tasks || []
      );

    } catch (error) {

      console.error(
        "Fetch tasks error:",
        error
      );

      setError(
        error.message
      );

      showToast(
        error.message,
        "error"
      );

    } finally {

      setLoading(false);

    }

  };

  // ==========================================
  // SOCKET.IO CONNECTION
  // ==========================================

  useEffect(() => {

    fetchTasks();

    const token =
      localStorage.getItem("token");

    if (!token) {
      return;
    }

    socket.auth = {
      token,
    };

    socket.connect();

    return () => {

      socket.disconnect();

    };

  }, []);

  // ==========================================
  // SOCKET.IO - TASK CREATED
  // ==========================================

  useEffect(() => {

    /*
     * IMPORTANT:
     *
     * This listener ONLY receives tasks
     * from Socket.IO.
     *
     * It must NEVER make a POST request.
     *
     * Task creation is handled separately
     * by handleTaskCreated().
     */

    const handleSocketTaskCreated =
      (newTask) => {

        console.log(
          "Socket received new task:",
          newTask
        );

        setTasks(
          (previousTasks) => {

            // Prevent duplicate tasks.
            //
            // The POST request may already have
            // added this task to the dashboard.
            const exists =
              previousTasks.some(
                (task) =>
                  task.id ===
                  newTask.id
              );

            if (exists) {
              return previousTasks;
            }

            return [
              ...previousTasks,
              newTask,
            ];

          }
        );

      };

    socket.on(
      "taskCreated",
      handleSocketTaskCreated
    );

    return () => {

      socket.off(
        "taskCreated",
        handleSocketTaskCreated
      );

    };

  }, []);

  // ==========================================
  // SOCKET.IO - TASK UPDATED
  // ==========================================

  useEffect(() => {

    const handleTaskUpdated =
      (updatedTask) => {

        console.log(
          "Socket received updated task:",
          updatedTask
        );

        setTasks(
          (previousTasks) =>
            previousTasks.map(
              (task) =>
                task.id ===
                updatedTask.id
                  ? updatedTask
                  : task
            )
        );

      };

    socket.on(
      "taskUpdated",
      handleTaskUpdated
    );

    return () => {

      socket.off(
        "taskUpdated",
        handleTaskUpdated
      );

    };

  }, []);

  // ==========================================
  // SOCKET.IO - TASK DELETED
  // ==========================================

  useEffect(() => {

    const handleTaskDeleted =
      (deletedTask) => {

        console.log(
          "Socket received deleted task:",
          deletedTask
        );

        setTasks(
          (previousTasks) =>
            previousTasks.filter(
              (task) =>
                task.id !==
                deletedTask.id
            )
        );

      };

    socket.on(
      "taskDeleted",
      handleTaskDeleted
    );

    return () => {

      socket.off(
        "taskDeleted",
        handleTaskDeleted
      );

    };

  }, []);

  // ==========================================
  // TASK STATISTICS
  // ==========================================

  const totalTasks =
    tasks.length;

  const pendingTasks =
    tasks.filter(
      (task) =>
        task.status ===
        "pending"
    ).length;

  const inProgressTasks =
    tasks.filter(
      (task) =>
        task.status ===
        "in-progress"
    ).length;

  const completedTasks =
    tasks.filter(
      (task) =>
        task.status ===
        "completed"
    ).length;

  // ==========================================
  // OVERDUE CHECK
  // ==========================================

  const isOverdue = (
    task
  ) => {

    if (!task.dueDate) {
      return false;
    }

    if (
      task.status ===
      "completed"
    ) {
      return false;
    }

    const today =
      new Date();

    today.setHours(
      0,
      0,
      0,
      0
    );

    const dueDate =
      new Date(
        task.dueDate
      );

    dueDate.setHours(
      0,
      0,
      0,
      0
    );

    return (
      dueDate.getTime() <
      today.getTime()
    );

  };

  // ==========================================
  // CREATE TASK
  // ==========================================

  const handleTaskCreated =
    async (task) => {

      try {

        console.log(
          "Creating task:",
          task
        );

        /*
         * Send task to backend.
         */

        const data =
          await apiRequest(
            "/tasks",
            {
              method: "POST",

              body:
                JSON.stringify(
                  task
                ),
            }
          );

        console.log(
          "Task created by server:",
          data.task
        );

        // ======================================
        // IMMEDIATELY ADD TASK TO DASHBOARD
        // ======================================

        if (data.task) {

          setTasks(
            (previousTasks) => {

              /*
               * Prevent duplicate task.
               *
               * Socket.IO may also send the
               * exact same task.
               */

              const exists =
                previousTasks.some(
                  (existingTask) =>
                    existingTask.id ===
                    data.task.id
                );

              if (exists) {
                return previousTasks;
              }

              return [
                ...previousTasks,
                data.task,
              ];

            }
          );

        }

        // ======================================
        // CLOSE CREATE TASK FORM
        // ======================================

        setShowForm(false);

        // ======================================
        // SUCCESS NOTIFICATION
        // ======================================

        showToast(
          "Task created successfully!"
        );

      } catch (error) {

        console.error(
          "Create task error:",
          error
        );

        setError(
          error.message
        );

        showToast(
          error.message,
          "error"
        );

      }

    };

  // ==========================================
  // UPDATE TASK STATUS
  // ==========================================

  const handleStatusChange =
    async (
      id,
      status
    ) => {

      try {

        const data =
          await apiRequest(
            `/tasks/${id}`,
            {
              method: "PUT",

              body:
                JSON.stringify({
                  status,
                }),
            }
          );

        setTasks(
          (previousTasks) =>
            previousTasks.map(
              (task) =>
                task.id === id
                  ? data.task
                  : task
            )
        );

        if (
          status ===
          "completed"
        ) {

          showToast(
            "🎉 Task completed successfully!"
          );

        }

      } catch (error) {

        console.error(
          "Status update error:",
          error
        );

        setError(
          error.message
        );

        showToast(
          error.message,
          "error"
        );

      }

    };

  // ==========================================
  // DELETE TASK
  // ==========================================

  const handleDelete =
    async (id) => {

      const confirmed =
        window.confirm(
          "Are you sure you want to delete this task?"
        );

      if (!confirmed) {
        return;
      }

      try {

        await apiRequest(
          `/tasks/${id}`,
          {
            method: "DELETE",
          }
        );

        setTasks(
          (previousTasks) =>
            previousTasks.filter(
              (task) =>
                task.id !== id
            )
        );

        showToast(
          "Task deleted successfully!"
        );

      } catch (error) {

        console.error(
          "Delete task error:",
          error
        );

        setError(
          error.message
        );

        showToast(
          error.message,
          "error"
        );

      }

    };

  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================

  const handleEdit =
    (task) => {

      console.log(
        "Editing task:",
        task
      );

      setEditingTask(task);

    };

  // ==========================================
  // SAVE EDITED TASK
  // ==========================================

  const handleSaveEdit =
    async (
      id,
      updatedData
    ) => {

      try {

        const data =
          await apiRequest(
            `/tasks/${id}`,
            {
              method: "PUT",

              body:
                JSON.stringify(
                  updatedData
                ),
            }
          );

        setTasks(
          (previousTasks) =>
            previousTasks.map(
              (task) =>
                task.id === id
                  ? data.task
                  : task
            )
        );

        setEditingTask(null);

        showToast(
          "Task updated successfully!"
        );

      } catch (error) {

        console.error(
          "Edit task error:",
          error
        );

        setError(
          error.message
        );

        showToast(
          error.message,
          "error"
        );

      }

    };

  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  const clearFilters = () => {

    setSearch("");

    setFilter("all");

  };

  // ==========================================
  // FILTER TASKS
  // ==========================================

  const filteredTasks =
    tasks.filter(
      (task) => {

        const matchesFilter =
          filter === "all" ||
          task.status ===
            filter;

        const matchesSearch =
          task.title
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            );

        return (
          matchesFilter &&
          matchesSearch
        );

      }
    );

  // ==========================================
  // DASHBOARD UI
  // ==========================================

  return (

    <div
      className="app-layout"
      style={{
        "--mouse-x":
          `${mousePosition.x}%`,

        "--mouse-y":
          `${mousePosition.y}%`,
      }}
    >

      {/* ====================================
          INTERACTIVE BACKGROUND
      ==================================== */}

      <div className="interactive-background">

        <div className="background-grid" />

        <div
          className="background-glow purple-glow"
        />

        <div
          className="background-glow blue-glow"
        />

        <div className="mouse-glow" />

      </div>

      {/* ====================================
          SIDEBAR
      ==================================== */}

      <Sidebar />

      {/* ====================================
          MAIN CONTENT
      ==================================== */}

      <main className="main-content">

        <div className="dashboard">

          {/* ==================================
              DASHBOARD HERO HEADER
          ================================== */}

          <div className="dashboard-header">

            <div className="dashboard-hero">

              {/* =================================
                  EYEBROW
              ================================= */}

              <div className="dashboard-eyebrow">

                <span className="eyebrow-dot"></span>

                <span>
                  TASKSPACE / PERSONAL WORKSPACE
                </span>

                <span className="eyebrow-line"></span>

                <span className="eyebrow-live">
                  LIVE
                </span>

              </div>

              {/* =================================
                  GREETING
              ================================= */}

              <p className="dashboard-greeting">

                Welcome back{" "}

                <span>
                  👋
                </span>

              </p>

              {/* =================================
                  TITLE
              ================================= */}

              <h1 className="dashboard-title">

                <span>
                  Your
                </span>{" "}

                <span className="title-glow">
                  Task Dashboard
                </span>

              </h1>

              {/* =================================
                  SUBTITLE
              ================================= */}

              <p className="dashboard-subtitle">

                <span className="subtitle-symbol">
                  ✦
                </span>

                Stay organized. Build momentum.

                <span className="subtitle-highlight">
                  Get things done.
                </span>

              </p>

            </div>

            {/* =================================
                ADD TASK BUTTON
            ================================= */}

            <button
              className="add-task-btn"
              onClick={() =>
                setShowForm(true)
              }
            >

              <span className="add-task-icon">
                +
              </span>

              <span>
                Add Task
              </span>

              <span className="add-task-arrow">
                →
              </span>

            </button>

          </div>

          {/* ==================================
              STATISTICS
          ================================== */}

          <div className="stats-grid">

            <div className="stat-card">

              <span>
                Total Tasks
              </span>

              <strong>
                {totalTasks}
              </strong>

            </div>

            <div className="stat-card">

              <span>
                Pending
              </span>

              <strong>
                {pendingTasks}
              </strong>

            </div>

            <div className="stat-card">

              <span>
                In Progress
              </span>

              <strong>
                {inProgressTasks}
              </strong>

            </div>

            <div className="stat-card">

              <span>
                Completed
              </span>

              <strong>
                {completedTasks}
              </strong>

            </div>

          </div>

          {/* ==================================
              ERROR MESSAGE
          ================================== */}

          {error && (

            <div className="error-message">

              {error}

            </div>

          )}

          {/* ==================================
              CREATE TASK FORM
          ================================== */}

          {showForm && (

            <TaskForm
              onTaskCreated={
                handleTaskCreated
              }

              onCancel={() =>
                setShowForm(false)
              }
            />

          )}

          {/* ==================================
              SEARCH & FILTER
          ================================== */}

          <div className="task-controls">

            <input
              type="search"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

            <select
              value={filter}
              onChange={(e) =>
                setFilter(
                  e.target.value
                )
              }
            >

              <option value="all">
                All Tasks
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="in-progress">
                In Progress
              </option>

              <option value="completed">
                Completed
              </option>

            </select>

          </div>

          {/* ==================================
              TASK CONTENT
          ================================== */}

          {loading ? (

            <div className="loading">

              Loading tasks...

            </div>

          ) : filteredTasks.length === 0 ? (

            /* =================================
               INTERACTIVE EMPTY STATE
            ================================= */

            <div className="no-tasks">

              {/* =================================
                  ORBIT ANIMATION
              ================================= */}

              <div className="no-tasks-orbit">

                <div className="orbit orbit-one">
                </div>

                <div className="orbit orbit-two">
                </div>

                <div className="orbit-dot">
                </div>

                <div className="no-tasks-icon">
                  ✓
                </div>

              </div>

              {/* =================================
                  EMPTY STATE CONTENT
              ================================= */}

              <div className="no-tasks-content">

                <span className="no-tasks-label">
                  TASKSPACE / EMPTY
                </span>

                <h2>

                  NO TASKS

                  <br />

                  FOUND.

                </h2>

                <p>

                  {tasks.length === 0

                    ? "You haven't created any tasks yet. Start by adding your first task."

                    : "There are no tasks matching your current search or filter."

                  }

                </p>

                {/* =================================
                    CLEAR FILTERS
                ================================= */}

                {tasks.length > 0 && (

                  <button
                    className="no-tasks-action"
                    onClick={
                      clearFilters
                    }
                  >

                    CLEAR FILTERS

                  </button>

                )}

                {/* =================================
                    CREATE FIRST TASK
                ================================= */}

                {tasks.length === 0 && (

                  <button
                    className="no-tasks-action"
                    onClick={() =>
                      setShowForm(true)
                    }
                  >

                    CREATE FIRST TASK

                  </button>

                )}

              </div>

            </div>

          ) : (

            /* =================================
               TASKS CONTAINER
            ================================= */

            <div className="tasks-container">

              {filteredTasks.map(
                (task) => (

                  <TaskCard
                    key={task.id}

                    task={task}

                    onEdit={
                      handleEdit
                    }

                    onDelete={
                      handleDelete
                    }

                    onStatusChange={
                      handleStatusChange
                    }

                    isOverdue={
                      isOverdue(task)
                    }

                  />

                )
              )}

            </div>

          )}

          {/* ==================================
              EDIT TASK MODAL
          ================================== */}

          {editingTask && (

            <EditTaskModal
              task={editingTask}

              onSave={
                handleSaveEdit
              }

              onClose={() =>
                setEditingTask(null)
              }
            />

          )}

          {/* ==================================
              TOAST
          ================================== */}

          {toast && (

            <Toast
              message={
                toast.message
              }

              type={
                toast.type
              }

              onClose={() =>
                setToast(null)
              }

            />

          )}

        </div>

      </main>

    </div>

  );

}

export default Dashboard;