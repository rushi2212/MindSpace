import Task from "../models/Task.js";

export const getTasks = async (req, res) => {
  const { userId } = req.params;
  const tasks = await Task.find({ userId });
  res.json(tasks);
};

export const addTask = async (req, res) => {
  const { userId, text } = req.body;
  const newTask = await Task.create({ userId, text });
  res.json(newTask);
};

export const toggleTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  task.completed = !task.completed;
  await task.save();
  res.json(task);
};

export const deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};
