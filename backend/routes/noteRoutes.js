import express from "express";
import {
  createNote,
  getNotesByWeddingId,
  updateNote,
  deleteNote,
} from "../controllers/noteController.js";

const router = express.Router();

router.post("/", createNote);
router.get("/:weddingId", getNotesByWeddingId);
router.put("/:noteId", updateNote);
router.delete("/:noteId", deleteNote);

export default router;
