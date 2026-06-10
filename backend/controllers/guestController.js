import Guest from "../models/Guest.js";
import Wedding from "../models/Wedding.js";
import User from "../models/User.js";
import Contribution from "../models/Contribution.js";
import { syncGuestToSheet, removeGuestFromSheet } from "../utils/googleSheetsSync.js";
import { sendOtpEmail } from "../utils/emailService.js";
import nodemailer from "nodemailer";

// Background helper: sync guest to sheet silently
const backgroundSync = (guest, weddingId) => {
  Wedding.findById(weddingId).then((wedding) => {
    if (!wedding) return;
    User.findById(wedding.userId).then((user) => {
      if (user) syncGuestToSheet(guest, wedding, user.fullName);
    }).catch(() => {});
  }).catch(() => {});
};

export const createGuest = async (req, res) => {
  try {
    const { userId, weddingId, name, village, mobileNumber, tag, priority } = req.body;

    if (!userId || !weddingId || !name || !village) {
      return res.status(400).json({ success: false, message: "userId, weddingId, name, and village are required" });
    }

    const guest = new Guest({
      userId, weddingId,
      name: name.trim(),
      village: village.trim(),
      mobileNumber: mobileNumber ? mobileNumber.trim() : null,
      tag: tag || "other",
      priority: priority || 3,
      addedOn: "earlier",
    });

    await guest.save();
    backgroundSync(guest, weddingId);
    res.status(201).json({ success: true, message: "Guest added successfully", guest });
  } catch (error) {
    console.error("Create guest error:", error);
    res.status(500).json({ success: false, message: "Error creating guest" });
  }
};

export const addGuestOnWeddingDay = async (req, res) => {
  try {
    const { userId, weddingId, name, village } = req.body;

    if (!userId || !weddingId || !name || !village) {
      return res.status(400).json({ success: false, message: "userId, weddingId, name, and village are required" });
    }

    const guest = new Guest({
      userId, weddingId,
      name: name.trim(),
      village: village.trim(),
      addedOn: "wedding",
    });

    await guest.save();
    backgroundSync(guest, weddingId);
    res.status(201).json({ success: true, message: "Guest added on wedding day", guest });
  } catch (error) {
    console.error("Add guest on wedding day error:", error);
    res.status(500).json({ success: false, message: "Error adding guest" });
  }
};

export const getGuestsByWeddingId = async (req, res) => {
  try {
    const { weddingId } = req.params;
    if (!weddingId) {
      return res.status(400).json({ success: false, message: "weddingId is required" });
    }

    const guests = await Guest.find({ weddingId })
      .select("name village mobileNumber tag priority addedOn attended attendedBy amount paymentType isDeleted createdAt")
      .lean()
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, guests });
  } catch (error) {
    console.error("Get guests error:", error);
    res.status(500).json({ success: false, message: "Error fetching guests" });
  }
};

export const updateGuest = async (req, res) => {
  try {
    const { guestId } = req.params;
    const { name, village, mobileNumber, tag, priority } = req.body;

    if (!guestId) {
      return res.status(400).json({ success: false, message: "guestId is required" });
    }

    const guest = await Guest.findById(guestId);
    if (!guest) {
      return res.status(404).json({ success: false, message: "Guest not found" });
    }

    if (name) guest.name = name.trim();
    if (village) guest.village = village.trim();
    if (mobileNumber !== undefined) guest.mobileNumber = mobileNumber ? mobileNumber.trim() : null;
    if (tag) guest.tag = tag;
    if (priority !== undefined) guest.priority = priority;

    await guest.save();
    backgroundSync(guest, guest.weddingId);
    res.status(200).json({ success: true, message: "Guest updated", guest });
  } catch (error) {
    console.error("Update guest error:", error);
    res.status(500).json({ success: false, message: "Error updating guest" });
  }
};

export const deleteGuest = async (req, res) => {
  try {
    const { guestId } = req.params;
    if (!guestId) {
      return res.status(400).json({ success: false, message: "guestId is required" });
    }

    const guest = await Guest.findById(guestId);
    if (!guest) {
      return res.status(404).json({ success: false, message: "Guest not found" });
    }

    // Soft delete — mark as deleted, don't remove from DB
    guest.isDeleted = true;
    guest.attended = false;
    guest.amount = 0;
    guest.paymentType = null;
    guest.attendedBy = null;
    await guest.save();

    // Background: remove from Google Sheet
    Wedding.findById(guest.weddingId).then((wedding) => {
      if (!wedding) return;
      User.findById(wedding.userId).then((user) => {
        if (user) removeGuestFromSheet(guest, wedding, user.fullName);
      }).catch(() => {});
    }).catch(() => {});

    // Delete associated contribution records so stats stay accurate
    await Contribution.deleteMany({ guestId });

    res.status(200).json({ success: true, message: "Guest deleted" });
  } catch (error) {
    console.error("Delete guest error:", error);
    res.status(500).json({ success: false, message: "Error deleting guest" });
  }
};

export const sendGuestListEmail = async (req, res) => {
  try {
    const { weddingId, guestListText, totalGuests } = req.body;

    if (!weddingId || !guestListText) {
      return res.status(400).json({ success: false, message: "weddingId and guest list are required" });
    }

    const guest = await Guest.findOne({ weddingId }).select("userId");
    if (!guest) return res.status(404).json({ success: false, message: "No guests found" });

    const user = await User.findById(guest.userId).select("email fullName");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD },
    });

    await transporter.sendMail({
      from: `"DigitalNewtaManager" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `Guest List (${totalGuests} guests) - DigitalNewtaManager`,
      text: `Hi ${user.fullName},\n\nHere is your guest list:\n\n${guestListText}\n\nTotal: ${totalGuests} guests\n\n— DigitalNewtaManager`,
    });

    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Send email error:", error);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
};
