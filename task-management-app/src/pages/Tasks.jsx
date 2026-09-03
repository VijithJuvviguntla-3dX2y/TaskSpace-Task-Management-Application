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

function Tasks() {

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

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("all");

  const [toast, setToast] =
    useState(null);

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
  // INITIAL LOAD + SOCKET CONNECTION
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
  // SOCKET - TASK CREATED
  // ==========================================

  useEffect(() => {

    const handleTaskCreated =
      (newTask) => {

        setTasks(
          (previousTasks) => {

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
      handleTaskCreated
    );

    return () => {

      socket.off(
        "taskCreated",
        handleTaskCreated
      );

    };

  }, []);

  // ==========================================
  // SOCKET - TASK UPDATED
  // ==========================================

  useEffect(() => {

    const handleTaskUpdated =
      (updatedTask) => {

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
  // SOCKET - TASK DELETED
  // ==========================================

  useEffect(() => {

    const handleTaskDeleted =
      (deletedTask) => {

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
  // CREATE TASK
  // ==========================================

  const handleTaskCreated =
    async (task) => {

      try {

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

        /*
         * Immediately add the task.
         *
         * Socket.IO may also send the
         * taskCreated event, so check
         * for duplicates.
         */

        if (data.task) {

          setTasks(
            (previousTasks) => {

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

        setShowForm(false);

        showToast(
          "Task created successfully!"
        );

      } catch (error) {

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
  // UPDATE STATUS
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
  // EDIT TASK
  // ==========================================

  const handleEdit =
    (task) => {

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
  // OVERDUE
  // ==========================================

  const isOverdue =
    (task) => {

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
  // UI
  // ==========================================

  return (

    <div className="app-layout">

      {/* ======================================
          SIDEBAR
      ====================================== */}

      <Sidebar />

      {/* ======================================
          MAIN CONTENT
      ====================================== */}

      <main className="main-content">

        <div className="dashboard">

          {/* ==================================
              TASKS PAGE CONTENT
          ================================== */}

          <div className="dashboard-header">

            <div>

              <p className="dashboard-greeting">
                TASKSPACE / MY TASKS
              </p>

              <h1>
                My Tasks 📋
              </h1>

              <p className="dashboard-subtitle">
                Create, organize and manage
                all your tasks.
              </p>

            </div>

            <button
              className="add-task-btn"
              onClick={() =>
                setShowForm(true)
              }
            >
              + Add Task
            </button>

          </div>

          {/* ==================================
              ERROR
          ================================== */}

          {error && (

            <div className="error-message">
              {error}
            </div>

          )}

          {/* ==================================
              CREATE TASK
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
              SEARCH + FILTER
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

            {(search ||
              filter !== "all") && (

              <button
                className="clear-filter-btn"
                onClick={
                  clearFilters
                }
              >
                CLEAR
              </button>

            )}

          </div>

          {/* ==================================
              TASK LIST
          ================================== */}

          {loading ? (

            <div className="loading">
              Loading tasks...
            </div>

          ) : filteredTasks.length === 0 ? (

            /* =================================
               EMPTY TASK STATE
            ================================= */

            <div className="no-tasks">

              <div className="no-tasks-orbit">

                <div className="orbit orbit-one" />

                <div className="orbit orbit-two" />

                <div className="orbit-dot" />

                <div className="no-tasks-icon">
                  ✓
                </div>

              </div>

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

                {tasks.length === 0 ? (

                  <button
                    className="no-tasks-action"
                    onClick={() =>
                      setShowForm(true)
                    }
                  >
                    CREATE FIRST TASK
                  </button>

                ) : (

                  <button
                    className="no-tasks-action"
                    onClick={
                      clearFilters
                    }
                  >
                    CLEAR FILTERS
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
              EDIT MODAL
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

export default Tasks;