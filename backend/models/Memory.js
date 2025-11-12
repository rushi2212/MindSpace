import mongoose from "mongoose";

const memorySchema = new mongoose.Schema({
  userId: String,
  messages: [
    {
      role: String,
      text: String,
    },
  ],
});

export default mongoose.model("Memory", memorySchema);
