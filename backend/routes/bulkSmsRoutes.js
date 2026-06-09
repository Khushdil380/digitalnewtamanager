import express from "express";
import { getSmsLogs, sendBulkSms } from "../controllers/bulkSmsController.js";

const router = express.Router();

router.get("/logs/:weddingId", getSmsLogs);
router.post("/send-bulk", sendBulkSms);

export default router;
