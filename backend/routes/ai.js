import express from "express";
import {
  chatWithAI,
  generateArt,
  aiHealth,
} from "../controllers/aiController.js";
const router = express.Router();

router.post("/chat", chatWithAI);
router.post("/art", generateArt);
router.get("/health", aiHealth);

export default router;
