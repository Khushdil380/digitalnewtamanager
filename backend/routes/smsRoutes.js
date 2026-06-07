import express from "express";
import { saveSmsSettings, getSmsSettings, sendSms } from "../controllers/smsController.js";

const router = express.Router();

router.post("/settings", saveSmsSettings);
router.get("/settings/:userId", getSmsSettings);
router.post("/send", sendSms);

export default router;
