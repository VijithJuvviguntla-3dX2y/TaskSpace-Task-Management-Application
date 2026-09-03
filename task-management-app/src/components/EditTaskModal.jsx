import { useEffect, useState } from "react";

function EditTaskModal({
  task,
  onSave,
  onClose,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  const [status, setStatus] =
    useState("pending");

  const [priority, setPriority] =
    useState("medium");

  const [dueDate, setDueDate] =
    useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setStatus(task.status || "pending");
      setPriority(task.priority || "medium");

      setDueDate(
        task.dueDate
          ? task.dueDate.split("T")[0]
          : ""
      );
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    onSave(task.id, {
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      dueDate: dueDate || null,
    });
  };

  if (!task) {
    return null;
  }

  return (
    <div className="modal-overlay">

      <div className="edit-modal">

        <div className="modal-header">

          <h2>Edit Task</h2>

          <button
            className="close-btn"
            onClick={onClose}
          >
            ×
          </button>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label>Task Title</label>

            <input
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              required
            />

          </div>

          <div className="form-group">

            <label>Description</label>

            <textarea
              rows="4"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
            />

          </div>

          <div className="form-row">

            <div className="form-group">

              <label>Status</label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
              >
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

            <div className="form-group">

              <label>Priority</label>

              <select
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value)
                }
              >
                <option value="low">
                  Low
                </option>

                <option value="medium">
                  Medium
                </option>

                <option value="high">
                  High
                </option>

              </select>

            </div>

          </div>

          <div className="form-group">

            <label>Due Date</label>

            <input
              type="date"
              value={dueDate}
              onChange={(e) =>
                setDueDate(e.target.value)
              }
            />

          </div>

          <div className="modal-actions">

            <button
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>

            <button type="submit">
              Save Changes
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default EditTaskModal;