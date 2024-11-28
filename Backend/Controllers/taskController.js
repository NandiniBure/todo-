const Task = require("../models/Task");

// Create task
exports.createTask = async (req, res) => {
  const { title, startTime, endTime, priority, status } = req.body;

  try {
    // Validate required fields
    if (!title || !startTime || !priority || !status) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }

    // Create new task
    const task = await Task.create({
      title,
      startTime,
      endTime,
      priority,
      status,
      userId: req.user.id, // Assuming req.user.id is populated by authentication middleware
    });

    res.status(201).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get tasks
exports.getTasks = async (req, res) => {
  const { priority, status, sortBy, order } = req.query; // Filters and sorting from query params

  try {
    // Query conditions
    const filter = { userId: req.user.id }; // Fetch tasks only for the authenticated user
    if (priority) filter.priority = priority;
    if (status) filter.status = status;

    // Sorting
    const sortOptions = {};
    if (sortBy) sortOptions[sortBy] = order === "desc" ? -1 : 1;

    // Fetch tasks
    const tasks = await Task.find(filter).sort(sortOptions);

    res.status(200).json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  const { id } = req.params; // Task ID from the URL
  const { title, startTime, endTime, priority, status } = req.body;

  try {
    // Find and update the task
    const task = await Task.findOneAndUpdate(
      { _id: id, userId: req.user.id }, // Match the task with user ID for security
      { title, startTime, endTime, priority, status },
      { new: true, runValidators: true } // Return updated task and validate fields
    );

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found." });
    }

    res.status(200).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  const { id } = req.params; // Task ID from the URL

  try {
    // Find and delete the task
    const task = await Task.findOneAndDelete({ _id: id, userId: req.user.id });

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found." });
    }

    res
      .status(200)
      .json({ success: true, message: "Task deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch all tasks for the user
    const tasks = await Task.find({ userId });

    // Total tasks
    const totalTasks = tasks.length;

    // Tasks Completed
    const completedTasks = tasks.filter(
      (task) => task.status === "finished"
    ).length;

    // Calculate the completed tasks percentage
    const tasksCompletedPercentage = totalTasks
      ? (completedTasks / totalTasks) * 100
      : 0;

    // Pending Task Summary
    const pendingTasks = tasks.filter((task) => task.status === "pending");

    // Calculate total time elapsed and estimated time for pending tasks
    const totalTimeLapsed = pendingTasks.reduce((acc, task) => {
      if (task.startTime && task.endTime) {
        // Calculate time difference in minutes if both start and end times exist
        const timeElapsed =
          (new Date(task.endTime) - new Date(task.startTime)) / 60000;
        return acc + timeElapsed;
      }
      return acc;
    }, 0);

    // Estimate total time left for pending tasks based on your business logic
    // If you don't have an estimated time field, you may need to define how to estimate it.
    const totalTimeLeft = pendingTasks.reduce((acc, task) => {
      // You could define a default estimated time or another logic here
      const estimatedTime = task.estimatedTime || 60; // Assuming 60 minutes as a default estimate if not available
      return acc + estimatedTime;
    }, 0);

    const pendingTaskSummary = {
      totalPendingTasks: pendingTasks.length,
      totalTimeLapsed,
      totalTimeLeft,
    };

    // Task Priority Summary
    const taskPrioritySummary = {};
    tasks.forEach((task) => {
      const priority = task.priority || 3; // Default priority if not defined (e.g., 3 is "Medium")
      if (!taskPrioritySummary[priority]) {
        taskPrioritySummary[priority] = {
          pending: 0,
          timeLapsed: 0,
          timeLeft: 0,
        };
      }
      if (task.status === "pending") {
        taskPrioritySummary[priority].pending += 1;
        if (task.startTime && task.endTime) {
          const timeElapsed =
            (new Date(task.endTime) - new Date(task.startTime)) / 60000;
          taskPrioritySummary[priority].timeLapsed += timeElapsed;
        }
        taskPrioritySummary[priority].timeLeft += task.estimatedTime || 60; // Default to 60 minutes if estimatedTime is missing
      }
    });

    // Average Time Per Task (based only on completed tasks)
    const completedTimeLapsed = tasks
      .filter((task) => task.status === "finished")
      .reduce((acc, task) => {
        if (task.startTime && task.endTime) {
          const timeElapsed =
            (new Date(task.endTime) - new Date(task.startTime)) / 60000;
          return acc + timeElapsed;
        }
        return acc;
      }, 0);

    const avgTimePerTask = completedTasks
      ? completedTimeLapsed / completedTasks
      : 0;

    // Return dashboard stats
    res.json({
      totalTasks,
      completedPercentage: tasksCompletedPercentage.toFixed(2),
      avgTimePerTask: avgTimePerTask.toFixed(2),
      pendingTaskSummary,
      taskPrioritySummary,
    });
  } catch (error) {
    console.error("Error calculating dashboard stats:", error);
    res.status(500).json({ message: "Failed to calculate stats" });
  }
};