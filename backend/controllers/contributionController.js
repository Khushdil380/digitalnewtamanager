import Contribution from "../models/Contribution.js";
import Guest from "../models/Guest.js";
import Wedding from "../models/Wedding.js";
import User from "../models/User.js";
import mongoose from "mongoose";
import { syncGuestToSheet } from "../utils/googleSheetsSync.js";

export const recordContribution = async (req, res) => {
  try {
    const { weddingId, guestId, guestName, village, amount, paymentType, givenBy } = req.body;

    if (!weddingId || !guestId || !guestName || !village) {
      return res.status(400).json({ success: false, message: "weddingId, guestId, guestName, and village are required" });
    }

    const finalAmount = paymentType === "envelope" ? (amount || 0) : (amount || 0);

    if (finalAmount < 0) {
      return res.status(400).json({ success: false, message: "Amount cannot be negative" });
    }

    const pay = paymentType || "cash";
    const given = givenBy || "personally";

    // Run contribution upsert and guest update in parallel for speed
    const [contributionResult, updatedGuest] = await Promise.all([
      // Atomic upsert — single DB call instead of findOne + save
      Contribution.findOneAndUpdate(
        { weddingId, guestId },
        {
          $set: {
            guestName: guestName.trim(),
            village: village.trim(),
            amount: finalAmount,
            paymentType: pay,
            givenBy: given,
          },
          $setOnInsert: { weddingId, guestId },
        },
        { upsert: true, new: true }
      ),
      // Update guest record simultaneously
      Guest.findByIdAndUpdate(guestId, {
        attended: true,
        attendedBy: given,
        amount: finalAmount,
        paymentType: pay,
      }, { new: true }),
    ]);

    // Respond immediately — everything critical is done
    res.status(201).json({
      success: true,
      message: "Contribution recorded",
      contribution: contributionResult,
    });

    // Background: sync to Google Sheets (non-blocking, after response sent)
    if (updatedGuest) {
      Wedding.findById(weddingId).then((wedding) => {
        if (wedding) {
          User.findById(wedding.userId).then((user) => {
            if (user) syncGuestToSheet(updatedGuest, wedding, user.fullName);
          }).catch(() => {});
        }
      }).catch(() => {});
    }
  } catch (error) {
    console.error("Record contribution error:", error);
    res.status(500).json({ success: false, message: "Error recording contribution" });
  }
};

export const getContributionsByWedding = async (req, res) => {
  try {
    const { weddingId } = req.params;
    if (!weddingId) {
      return res.status(400).json({ success: false, message: "weddingId is required" });
    }

    const objectId = new mongoose.Types.ObjectId(weddingId);

    const statsResult = await Contribution.aggregate([
      { $match: { weddingId: objectId } },
      {
        $group: {
          _id: null,
          totalContributions: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
          cashCount: { $sum: { $cond: [{ $eq: ["$paymentType", "cash"] }, 1, 0] } },
          upiCount: { $sum: { $cond: [{ $eq: ["$paymentType", "upi"] }, 1, 0] } },
          envelopeCount: { $sum: { $cond: [{ $eq: ["$paymentType", "envelope"] }, 1, 0] } },
          personalCount: { $sum: { $cond: [{ $eq: ["$givenBy", "personally"] }, 1, 0] } },
          bySomeoneCount: { $sum: { $cond: [{ $eq: ["$givenBy", "someone"] }, 1, 0] } },
        },
      },
    ]);

    const stats = statsResult[0] || {
      totalContributions: 0,
      totalAmount: 0,
      cashCount: 0,
      upiCount: 0,
      envelopeCount: 0,
      personalCount: 0,
      bySomeoneCount: 0,
    };

    res.status(200).json({ success: true, stats });
  } catch (error) {
    console.error("Get contributions error:", error);
    res.status(500).json({ success: false, message: "Error fetching contributions" });
  }
};

export const updateContribution = async (req, res) => {
  try {
    const { contributionId } = req.params;
    const { amount, paymentType, givenBy } = req.body;

    if (!contributionId) {
      return res.status(400).json({ success: false, message: "contributionId is required" });
    }

    const contribution = await Contribution.findById(contributionId);
    if (!contribution) {
      return res.status(404).json({ success: false, message: "Contribution not found" });
    }

    if (amount !== undefined) contribution.amount = Math.max(0, amount);
    if (paymentType) contribution.paymentType = paymentType;
    if (givenBy) contribution.givenBy = givenBy;

    await contribution.save();

    // Sync guest record
    await Guest.findByIdAndUpdate(contribution.guestId, {
      amount: contribution.amount,
      paymentType: contribution.paymentType,
      attendedBy: contribution.givenBy,
    });

    res.status(200).json({ success: true, message: "Contribution updated", contribution });
  } catch (error) {
    console.error("Update contribution error:", error);
    res.status(500).json({ success: false, message: "Error updating contribution" });
  }
};

export const deleteContribution = async (req, res) => {
  try {
    const { contributionId } = req.params;
    if (!contributionId) {
      return res.status(400).json({ success: false, message: "contributionId is required" });
    }

    const contribution = await Contribution.findByIdAndDelete(contributionId);
    if (!contribution) {
      return res.status(404).json({ success: false, message: "Contribution not found" });
    }

    res.status(200).json({ success: true, message: "Contribution deleted" });
  } catch (error) {
    console.error("Delete contribution error:", error);
    res.status(500).json({ success: false, message: "Error deleting contribution" });
  }
};
