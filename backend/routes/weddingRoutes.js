import express from "express";
import {
  createWedding,
  getWeddingById,
  getWeddingsByUserId,
  getWeddingEventData,
  updateWedding,
  deleteWedding,
} from "../controllers/weddingController.js";

const router = express.Router();

router.post("/create", createWedding);
router.get("/user/:userId", getWeddingsByUserId);
router.get("/:weddingId/event-data", getWeddingEventData);
router.get("/:weddingId", getWeddingById);
router.put("/:weddingId", updateWedding);
router.delete("/:weddingId", deleteWedding);

export default router;
