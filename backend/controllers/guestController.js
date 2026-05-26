import Guest from "../models/Guest.js";

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

    const guests = await Guest.find({ weddingId }).lean().sort({ createdAt: -1 });
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

    const guest = await Guest.findByIdAndDelete(guestId);
    if (!guest) {
      return res.status(404).json({ success: false, message: "Guest not found" });
    }

    res.status(200).json({ success: true, message: "Guest deleted" });
  } catch (error) {
    console.error("Delete guest error:", error);
    res.status(500).json({ success: false, message: "Error deleting guest" });
  }
};
