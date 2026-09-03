const fs = require("fs");
const path = require("path");

const {
  getSocketIO,
} = require("../socket");

const tasksFile = path.join(
  __dirname,
  "../database/tasks.json"
);

// ==========================================
// READ TASKS
// ==========================================

const readTasks = () => {
  const data = fs.readFileSync(
    tasksFile,
    "utf8"
  );

  return JSON.parse(data);
};

// ==========================================
// WRITE TASKS
// ==========================================

const writeTasks = (tasks) => {
  fs.writeFileSync(
    tasksFile,
    JSON.stringify(tasks, null, 2)
  );
};

// ==========================================
// CREATE TASK
// ==========================================

const createTask = (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      dueDate,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Task title is required.",
      });
    }

    const tasks = readTasks();

    const newTask = {
      id: Date.now().toString(),

      userId: req.user.id,

      title: title.trim(),

      description: description
        ? description.trim()
        : "",

      status:
        status || "pending",

      priority:
        priority || "medium",

      dueDate:
        dueDate || null,

      createdAt:
        new Date().toISOString(),

      updatedAt:
        new Date().toISOString(),
    };

    tasks.push(newTask);

    writeTasks(tasks);

    // ======================================
    // SOCKET.IO - TASK CREATED
    // ======================================

    const io = getSocketIO();

    if (io) {
      io.to(
        `user_${newTask.userId}`
      ).emit(
        "taskCreated",
        newTask
      );
    }

    res.status(201).json({
      success: true,
      message:
        "Task created successfully.",
      task: newTask,
    });

  } catch (error) {
    console.error(
      "Create task error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Server error while creating task.",
    });
  }
};

// ==========================================
// GET ALL TASKS
// ==========================================

const getTasks = (req, res) => {
  try {
    const tasks = readTasks();

    const userTasks =
      tasks.filter(
        (task) =>
          task.userId ===
          req.user.id
      );

    res.json({
      success: true,
      count: userTasks.length,
      tasks: userTasks,
    });

  } catch (error) {
    console.error(
      "Get tasks error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Server error while fetching tasks.",
    });
  }
};

// ==========================================
// GET SINGLE TASK
// ==========================================

const getTask = (req, res) => {
  try {
    const tasks = readTasks();

    const task = tasks.find(
      (task) =>
        task.id ===
          req.params.id &&
        task.userId ===
          req.user.id
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message:
          "Task not found.",
      });
    }

    res.json({
      success: true,
      task,
    });

  } catch (error) {
    console.error(
      "Get task error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Server error while fetching task.",
    });
  }
};

// ==========================================
// UPDATE TASK
// ==========================================

const updateTask = (req, res) => {
  try {
    const tasks = readTasks();

    const taskIndex =
      tasks.findIndex(
        (task) =>
          task.id ===
            req.params.id &&
          task.userId ===
            req.user.id
      );

    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        message:
          "Task not found.",
      });
    }

    const oldTask =
      tasks[taskIndex];

    const updatedTask = {
      ...oldTask,

      title:
        req.body.title !==
        undefined
          ? req.body.title.trim()
          : oldTask.title,

      description:
        req.body.description !==
        undefined
          ? req.body.description.trim()
          : oldTask.description,

      status:
        req.body.status !==
        undefined
          ? req.body.status
          : oldTask.status,

      priority:
        req.body.priority !==
        undefined
          ? req.body.priority
          : oldTask.priority,

      dueDate:
        req.body.dueDate !==
        undefined
          ? req.body.dueDate
          : oldTask.dueDate,

      updatedAt:
        new Date().toISOString(),
    };

    if (!updatedTask.title) {
      return res.status(400).json({
        success: false,
        message:
          "Task title cannot be empty.",
      });
    }

    tasks[taskIndex] =
      updatedTask;

    writeTasks(tasks);

    // ======================================
    // SOCKET.IO - TASK UPDATED
    // ======================================

    const io = getSocketIO();

    if (io) {
      io.to(
        `user_${updatedTask.userId}`
      ).emit(
        "taskUpdated",
        updatedTask
      );
    }

    res.json({
      success: true,
      message:
        "Task updated successfully.",
      task: updatedTask,
    });

  } catch (error) {
    console.error(
      "Update task error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Server error while updating task.",
    });
  }
};

// ==========================================
// DELETE TASK
// ==========================================

const deleteTask = (req, res) => {
  try {
    const tasks = readTasks();

    const taskIndex =
      tasks.findIndex(
        (task) =>
          task.id ===
            req.params.id &&
          task.userId ===
            req.user.id
      );

    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        message:
          "Task not found.",
      });
    }

    // Save task before deleting
    const deletedTask =
      tasks[taskIndex];

    tasks.splice(
      taskIndex,
      1
    );

    writeTasks(tasks);

    // ======================================
    // SOCKET.IO - TASK DELETED
    // ======================================

    const io = getSocketIO();

    if (io) {
      io.to(
        `user_${deletedTask.userId}`
      ).emit(
        "taskDeleted",
        deletedTask
      );
    }

    res.json({
      success: true,
      message:
        "Task deleted successfully.",
    });

  } catch (error) {
    console.error(
      "Delete task error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Server error while deleting task.",
    });
  }
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
};