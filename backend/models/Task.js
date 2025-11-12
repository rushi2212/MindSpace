import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  userId: String,
  text: String,
  completed: { type: Boolean, default: false },
});

export default mongoose.model("Task", taskSchema);
