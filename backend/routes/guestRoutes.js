import express from "express";
import {
  createGuest,
  addGuestOnWeddingDay,
  getGuestsByWeddingId,
  updateGuest,
  markCardDistributed,
  deleteGuest,
  sendGuestListEmail,
} from "../controllers/guestController.js";

const router = express.Router();

router.post("/create", createGuest);
router.post("/wedding-day/:weddingId", addGuestOnWeddingDay);
router.post("/send-email", sendGuestListEmail);
router.get("/wedding/:weddingId", getGuestsByWeddingId);
router.put("/:guestId", updateGuest);
router.patch("/:guestId/card", markCardDistributed);
router.delete("/:guestId", deleteGuest);

export default router;
