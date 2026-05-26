import express from "express";
import {
  createGuest,
  addGuestOnWeddingDay,
  getGuestsByWeddingId,
  updateGuest,
  deleteGuest,
} from "../controllers/guestController.js";

const router = express.Router();

router.post("/create", createGuest);
router.post("/wedding-day/:weddingId", addGuestOnWeddingDay);
router.get("/wedding/:weddingId", getGuestsByWeddingId);
router.put("/:guestId", updateGuest);
router.delete("/:guestId", deleteGuest);

export default router;
