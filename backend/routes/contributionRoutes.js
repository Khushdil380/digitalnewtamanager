import express from "express";
import {
  recordContribution,
  getContributionsByWedding,
  updateContribution,
  deleteContribution,
} from "../controllers/contributionController.js";

const router = express.Router();

router.post("/record", recordContribution);
router.get("/wedding/:weddingId", getContributionsByWedding);
router.put("/:contributionId", updateContribution);
router.delete("/:contributionId", deleteContribution);

export default router;
