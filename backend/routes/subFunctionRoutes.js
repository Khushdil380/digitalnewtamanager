import express from "express";
import {
  createSubFunction,
  getSubFunctions,
  deleteSubFunction,
  inviteGuest,
  uninviteGuest,
  markAttended,
  unmarkAttended,
} from "../controllers/subFunctionController.js";

const router = express.Router();

router.post("/", createSubFunction);
router.get("/wedding/:weddingId", getSubFunctions);
router.delete("/:id", deleteSubFunction);
router.patch("/:id/invite", inviteGuest);
router.patch("/:id/uninvite", uninviteGuest);
router.patch("/:id/attend", markAttended);
router.patch("/:id/unattend", unmarkAttended);

export default router;
