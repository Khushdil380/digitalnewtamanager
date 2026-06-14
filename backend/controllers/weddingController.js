import Wedding from "../models/Wedding.js";
import Guest from "../models/Guest.js";
import Contribution from "../models/Contribution.js";
import User from "../models/User.js";
import mongoose from "mongoose";
import { createSheetForWedding } from "../utils/googleSheetsSync.js";

export const createWedding = async (req, res) => {
  try {
    const { userId, brideName, groomName, date, venue } = req.body;

    if (!userId || !brideName || !groomName || !date || !venue) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const wedding = new Wedding({
      userId,
      brideName,
      groomName,
      date: new Date(date),
      venue,
    });

    await wedding.save();

    // Background: create Google Sheet tab for this wedding
    User.findById(userId).then((user) => {
      if (user) createSheetForWedding(wedding, user.fullName);
    }).catch(() => {});

    res.status(201).json({
      message: "Wedding created successfully",
      wedding: {
        id: wedding._id,
        brideName: wedding.brideName,
        groomName: wedding.groomName,
        date: wedding.date,
        venue: wedding.venue,
        totalGuestsInvited: wedding.totalGuestsInvited,
        totalGuestsAttended: wedding.totalGuestsAttended,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create wedding",
      error: error.message,
    });
  }
};

export const getWeddingById = async (req, res) => {
  try {
    const { weddingId } = req.params;

    if (!weddingId) {
      return res.status(400).json({ message: "Wedding ID is required" });
    }

    const wedding = await Wedding.findById(weddingId);

    if (!wedding) {
      return res.status(404).json({ message: "Wedding not found" });
    }

    res.status(200).json({
      message: "Wedding fetched successfully",
      wedding: {
        id: wedding._id,
        brideName: wedding.brideName,
        groomName: wedding.groomName,
        date: wedding.date,
        venue: wedding.venue,
        totalGuestsInvited: wedding.totalGuestsInvited,
        totalGuestsAttended: wedding.totalGuestsAttended,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch wedding",
      error: error.message,
    });
  }
};

export const getWeddingsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const weddings = await Wedding.find({ userId }).sort({ date: -1 });

    res.status(200).json({
      message: "Weddings fetched successfully",
      weddings: weddings.map((w) => ({
        id: w._id,
        brideName: w.brideName,
        groomName: w.groomName,
        date: w.date,
        venue: w.venue,
        totalGuestsInvited: w.totalGuestsInvited,
        totalGuestsAttended: w.totalGuestsAttended,
      })),
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch weddings",
      error: error.message,
    });
  }
};

export const updateWedding = async (req, res) => {
  try {
    const { weddingId } = req.params;
    const { brideName, groomName, date, venue } = req.body;

    if (!weddingId) {
      return res.status(400).json({ message: "Wedding ID is required" });
    }

    const updateData = {};
    if (brideName) updateData.brideName = brideName;
    if (groomName) updateData.groomName = groomName;
    if (date) updateData.date = new Date(date);
    if (venue) updateData.venue = venue;
    updateData.updatedAt = new Date();

    const wedding = await Wedding.findByIdAndUpdate(weddingId, updateData, {
      new: true,
    });

    if (!wedding) {
      return res.status(404).json({ message: "Wedding not found" });
    }

    res.status(200).json({
      message: "Wedding updated successfully",
      wedding: {
        id: wedding._id,
        brideName: wedding.brideName,
        groomName: wedding.groomName,
        date: wedding.date,
        venue: wedding.venue,
        totalGuestsInvited: wedding.totalGuestsInvited,
        totalGuestsAttended: wedding.totalGuestsAttended,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update wedding",
      error: error.message,
    });
  }
};

export const deleteWedding = async (req, res) => {
  try {
    const { weddingId } = req.params;

    if (!weddingId) {
      return res.status(400).json({ message: "Wedding ID is required" });
    }

    const wedding = await Wedding.findByIdAndDelete(weddingId);

    if (!wedding) {
      return res.status(404).json({ message: "Wedding not found" });
    }

    res.status(200).json({
      message: "Wedding deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete wedding",
      error: error.message,
    });
  }
};

/**
 * Single endpoint: returns wedding + contribution stats + guest count
 * Reduces 3 API calls to 1 for the wedding event page
 */
export const getWeddingEventData = async (req, res) => {
  try {
    const { weddingId } = req.params;

    if (!weddingId) {
      return res.status(400).json({ message: "Wedding ID is required" });
    }

    const objectId = new mongoose.Types.ObjectId(weddingId);

    const [wedding, statsResult, guests] = await Promise.all([
      Wedding.findById(weddingId),
      Contribution.aggregate([
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
      ]),
      Guest.countDocuments({ weddingId: objectId, isDeleted: { $ne: true } }),
    ]);

    if (!wedding) {
      return res.status(404).json({ message: "Wedding not found" });
    }

    const stats = statsResult[0] || {
      totalContributions: 0, totalAmount: 0, cashCount: 0,
      upiCount: 0, envelopeCount: 0, personalCount: 0, bySomeoneCount: 0,
    };

    res.status(200).json({
      wedding: {
        id: wedding._id,
        brideName: wedding.brideName,
        groomName: wedding.groomName,
        date: wedding.date,
        venue: wedding.venue,
      },
      stats,
      totalGuests: guests,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch wedding data", error: error.message });
  }
};
