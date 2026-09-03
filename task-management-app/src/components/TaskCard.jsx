function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  isOverdue,
}) {
  return (
    <div className="task-card">

      {/* ======================================
          TASK HEADER
      ====================================== */}

      <div className="task-card-header">

        <div>

          <h3>
            {task.title}
          </h3>

          {task.description && (
            <p>
              {task.description}
            </p>
          )}

        </div>

        {/* Priority */}

        <span
          className={`priority priority-${task.priority}`}
        >
          {task.priority}
        </span>

      </div>


      {/* ======================================
          TASK INFORMATION
      ====================================== */}

      <div className="task-card-info">

        {/* Status */}

        <span>
          Status:{" "}
          <strong>
            {task.status}
          </strong>
        </span>


        {/* Due Date / Overdue */}

        {task.dueDate && (
          <span
            className={
              isOverdue
                ? "overdue"
                : ""
            }
          >
            {isOverdue
              ? "⚠️ Overdue: "
              : "Due: "}

            {new Date(
              task.dueDate
            ).toLocaleDateString()}
          </span>
        )}

      </div>


      {/* ======================================
          TASK ACTIONS
      ====================================== */}

      <div className="task-card-actions">

        {/* Status */}

        <select
          value={task.status}
          onChange={(e) =>
            onStatusChange(
              task.id,
              e.target.value
            )
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


        {/* Edit */}

        <button
          type="button"
          onClick={() => {

            console.log(
              "Edit clicked:",
              task
            );

            onEdit(task);

          }}
        >
          Edit
        </button>


        {/* Delete */}

        <button
          type="button"
          className="delete-btn"
          onClick={() =>
            onDelete(task.id)
          }
        >
          Delete
        </button>

      </div>

    </div>
  );
}

export default TaskCard;