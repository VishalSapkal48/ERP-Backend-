const Task = require('../models/TaskSchema');

// Get all tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate('employeeId', 'name');
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tasks', error: error.message });
  }
};

// Create a task
exports.createTask = async (req, res) => {
  try {
    const { title, type, dueDate, time, priority, employeeId } = req.body;
    const taskData = { title, type, dueDate, priority, employeeId };
    if (type === 'Meeting') {
      taskData.time = time;
    }
    const task = new Task(taskData);
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create task', error: error.message });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, type, dueDate, time, priority, status, employeeId } = req.body;
    const taskData = { title, type, dueDate, priority, status, employeeId };
    if (type === 'Meeting') {
      taskData.time = time;
    } else {
      taskData.time = null; // Clear time if not a Meeting
    }
    const task = await Task.findByIdAndUpdate(id, taskData, { new: true });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update task', error: error.message });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete task', error: error.message });
  }
};