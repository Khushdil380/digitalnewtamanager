import Contribution from "../models/Contribution.js";
import Guest from "../models/Guest.js";
import Wedding from "../models/Wedding.js";
import User from "../models/User.js";
import mongoose from "mongoose";

// Safe import — won't crash server if Google Sheets module has issues
let syncGuestToSheet = async () => {};
try {
  const sheetsModule = await import("../utils/googleSheetsSync.js");
  syncGuestToSheet = sheetsModule.syncGuestToSheet;
} catch (e) {
  console.error("Google Sheets module failed to load:", e.message);
}

export const recordContribution = async (req, res) => {
  try {
    const { weddingId, guestId, guestName, village, amount, paymentType, givenBy } = req.body;

    if (!weddingId || !guestId || !guestName || !village) {
      return res.status(400).json({ success: false, message: "weddingId, guestId, guestName, and village are required" });
    }

    // For envelope, amount defaults to 0 if not provided
    const finalAmount = paymentType === "envelope" ? (amount || 0) : (amount || 0);

    if (finalAmount < 0) {
      return res.status(400).json({ success: false, message: "Amount cannot be negative" });
    }

    const contribution = new Contribution({
      weddingId,
      guestId,
      guestName: guestName.trim(),
      village: village.trim(),
      amount: finalAmount,
      paymentType: paymentType || "cash",
      givenBy: givenBy || "personally",
    });

    // Upsert: if contribution already exists for this guest+wedding, update it
    const existing = await Contribution.findOne({ weddingId, guestId });
    if (existing) {
      existing.amount = finalAmount;
      existing.paymentType = paymentType || "cash";
      existing.givenBy = givenBy || "personally";
      await existing.save();
    } else {
      await contribution.save();
    }

    // Update guest record — mark as attended with contribution details
    const updatedGuest = await Guest.findByIdAndUpdate(guestId, {
      attended: true,
      attendedBy: givenBy || "personally",
      amount: finalAmount,
      paymentType: paymentType || "cash",
    }, { new: true });

    // Background: sync to Google Sheets (non-blocking)
    Wedding.findById(weddingId).then((wedding) => {
      if (wedding) {
        User.findById(wedding.userId).then((user) => {
          if (user && updatedGuest) {
            syncGuestToSheet(updatedGuest, wedding, user.fullName);
          }
        }).catch(() => {});
      }
    }).catch(() => {});

    res.status(201).json({
      success: true,
      message: "Contribution recorded",
      contribution,
    });
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
