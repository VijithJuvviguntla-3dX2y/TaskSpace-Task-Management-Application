import {
  useEffect,
  useState,
} from "react";

import TaskCard from "../components/TaskCard";
import Toast from "../components/Toast";
import Sidebar from "../components/Sidebar";

import { apiRequest } from "../api";
import socket from "../socket";

function Completed() {

  // ==========================================
  // STATE
  // ==========================================

  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

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
  // FETCH COMPLETED TASKS
  // ==========================================

  const fetchTasks = async () => {

    try {

      setLoading(true);
      setError("");

      const data =
        await apiRequest("/tasks");

      const completed =
        (data.tasks || []).filter(
          (task) =>
            task.status ===
            "completed"
        );

      setTasks(completed);

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
  // TASK CREATED
  // ==========================================

  useEffect(() => {

    const handleTaskCreated =
      (newTask) => {

        if (
          newTask.status !==
          "completed"
        ) {
          return;
        }

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
  // TASK UPDATED
  // ==========================================

  useEffect(() => {

    const handleTaskUpdated =
      (updatedTask) => {

        setTasks(
          (previousTasks) => {

            if (
              updatedTask.status ===
              "completed"
            ) {

              const exists =
                previousTasks.some(
                  (task) =>
                    task.id ===
                    updatedTask.id
                );

              if (exists) {

                return previousTasks.map(
                  (task) =>
                    task.id ===
                    updatedTask.id
                      ? updatedTask
                      : task
                );

              }

              return [
                ...previousTasks,
                updatedTask,
              ];

            }

            return previousTasks.filter(
              (task) =>
                task.id !==
                updatedTask.id
            );

          }
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
  // TASK DELETED
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
  // DELETE COMPLETED TASK
  // ==========================================

  const handleDelete =
    async (id) => {

      const confirmed =
        window.confirm(
          "Are you sure you want to delete this completed task?"
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
          "Completed task deleted successfully!"
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
  // SEARCH
  // ==========================================

  const filteredTasks =
    tasks.filter(
      (task) =>
        task.title
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

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
              COMPLETED PAGE CONTENT
          ================================== */}

          <div className="dashboard-header">

            <div>

              <p className="dashboard-greeting">
                TASKSPACE / COMPLETED
              </p>

              <h1>
                Completed Tasks ✓
              </h1>

              <p className="dashboard-subtitle">
                Review everything you've
                successfully completed.
              </p>

            </div>

            <div className="completed-counter">

              <span>
                COMPLETED
              </span>

              <strong>
                {tasks.length}
              </strong>

            </div>

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
              SEARCH
          ================================== */}

          <div className="task-controls">

            <input
              type="search"
              placeholder="Search completed tasks..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

          </div>

          {/* ==================================
              CONTENT
          ================================== */}

          {loading ? (

            <div className="loading">
              Loading completed tasks...
            </div>

          ) : filteredTasks.length === 0 ? (

            <div className="no-tasks completed-empty">

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
                  TASKSPACE / COMPLETE
                </span>

                <h2>
                  NOTHING
                  <br />
                  HERE.
                </h2>

                <p>

                  {tasks.length === 0
                    ? "Complete a task and it will appear here."
                    : "No completed tasks match your search."
                  }

                </p>

              </div>

            </div>

          ) : (

            <div className="tasks-container">

              {filteredTasks.map(
                (task) => (

                  <TaskCard
                    key={task.id}

                    task={task}

                    onDelete={
                      handleDelete
                    }

                    onStatusChange={() => {}}

                    onEdit={() => {}}

                    isOverdue={false}
                  />

                )
              )}

            </div>

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

export default Completed;
