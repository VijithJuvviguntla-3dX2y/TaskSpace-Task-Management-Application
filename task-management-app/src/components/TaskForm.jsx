import { useState } from "react";

function TaskForm({
  onTaskCreated,
  onCancel,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  const [priority, setPriority] =
    useState("medium");

  const [dueDate, setDueDate] =
    useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    const task = {
      title: title.trim(),
      description: description.trim(),
      priority,
      status: "pending",
      dueDate: dueDate || null,
    };

    onTaskCreated(task);

    setTitle("");
    setDescription("");
    setPriority("medium");
    setDueDate("");
  };

  return (
    <form
      className="task-form"
      onSubmit={handleSubmit}
    >

      {/* =====================================
          FORM HEADER
      ===================================== */}

      <div className="task-form-header">

        {/* =================================
            FUTURISTIC TASK ICON
        ================================= */}

        <div className="create-task-visual">

          <div className="create-task-icon">

            <div className="document-fold"></div>

            <div className="document-line line-one"></div>

            <div className="document-line line-two"></div>

            <div className="document-line line-three"></div>

            <span className="create-task-plus">
              +
            </span>

          </div>

          {/* Floating particles */}

          <span className="create-task-spark spark-one"></span>

          <span className="create-task-spark spark-two"></span>

          <span className="create-task-spark spark-three"></span>

          <span className="create-task-spark spark-four"></span>

        </div>


        {/* =================================
            HEADER TEXT
        ================================= */}

        <div className="task-form-heading">

          <span className="task-form-label">
            TASKSPACE / CREATE
          </span>

          <h2>
            Create New Task
          </h2>

          <p>
            Add a new task and keep your
            workflow moving.
          </p>

        </div>


        {/* =================================
            STATUS
        ================================= */}

        <div className="task-form-status">

          <span className="status-dot"></span>

          NEW TASK

        </div>

      </div>


      {/* =====================================
          FORM BODY
      ===================================== */}

      <div className="task-form-body">

        {/* ===================================
            TASK TITLE
        =================================== */}

        <div className="form-group form-group-full">

          <label htmlFor="task-title">
            TASK TITLE
          </label>

          <div className="input-wrapper">

            <span className="input-number">
              01
            </span>

            <input
              id="task-title"
              type="text"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              required
            />

          </div>

        </div>


        {/* ===================================
            DESCRIPTION
        =================================== */}

        <div className="form-group form-group-full">

          <label htmlFor="task-description">
            DESCRIPTION
          </label>

          <div className="input-wrapper textarea-wrapper">

            <span className="input-number">
              02
            </span>

            <textarea
              id="task-description"
              placeholder="Add some details about this task..."
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              rows="4"
            />

          </div>

        </div>


        {/* ===================================
            PRIORITY
        =================================== */}

        <div className="form-group">

          <label htmlFor="task-priority">
            PRIORITY
          </label>

          <div className="input-wrapper select-wrapper">

            <span className="input-number">
              03
            </span>

            <select
              id="task-priority"
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value)
              }
            >

              <option value="low">
                Low Priority
              </option>

              <option value="medium">
                Medium Priority
              </option>

              <option value="high">
                High Priority
              </option>

            </select>

          </div>

        </div>


        {/* ===================================
            DUE DATE
        =================================== */}

        <div className="form-group">

          <label htmlFor="task-due-date">
            DUE DATE
          </label>

          <div className="input-wrapper">

            <span className="input-number">
              04
            </span>

            <input
              id="task-due-date"
              type="date"
              value={dueDate}
              onChange={(e) =>
                setDueDate(e.target.value)
              }
            />

          </div>

        </div>

      </div>


      {/* =====================================
          FORM FOOTER
      ===================================== */}

      <div className="task-form-footer">

        <div className="task-form-hint">

          <span className="hint-symbol">
            +
          </span>

          <span>
            Your task will start as pending.
          </span>

        </div>


        <div className="task-form-actions">

          {/* CANCEL */}

          <button
            type="button"
            className="task-form-cancel"
            onClick={onCancel}
          >

            <span>
              ×
            </span>

            Cancel

          </button>


          {/* CREATE */}

          <button
            type="submit"
            className="task-form-submit"
          >

            <span>
              +
            </span>

            Create Task

          </button>

        </div>

      </div>

    </form>
  );
}

export default TaskForm;