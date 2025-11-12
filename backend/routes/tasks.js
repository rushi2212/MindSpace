import express from "express";
import {
  getTasks,
  addTask,
  toggleTask,
  deleteTask,
} from "../controllers/taskController.js";
const router = express.Router();

router.get("/:userId", getTasks);
router.post("/", addTask);
router.put("/:id", toggleTask);
router.delete("/:id", deleteTask);

export default router;
