import Guest from "../models/Guest.js";

export const createGuest = async (req, res) => {
  try {
    const { userId, weddingId, name, village, mobileNumber, tag, priority } =
      req.body;

    if (!userId || !weddingId || !name || !village) {
      return res.status(400).json({
        success: false,
        message: "userId, weddingId, name, and village are required",
      });
    }

    const guest = new Guest({
      userId,
      weddingId,
      name: name.trim(),
      village: village.trim(),
      mobileNumber: mobileNumber ? mobileNumber.trim() : null,
      tag: tag || "other",
      priority: priority || 3,
      addedOn: "beforeWedding", // Default for guests added before wedding
    });

    await guest.save();

    res.status(201).json({
      success: true,
      message: "Guest added successfully",
      guest: {
        _id: guest._id,
        name: guest.name,
        village: guest.village,
        mobileNumber: guest.mobileNumber,
        tag: guest.tag,
        priority: guest.priority,
        addedOn: guest.addedOn,
        invitedStatus: guest.invitedStatus,
        attendedStatus: guest.attendedStatus,
        contributionAmount: guest.contributionAmount,
        contributionType: guest.contributionType,
        givenBy: guest.givenBy,
      },
    });
  } catch (error) {
    console.error("Create guest error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error creating guest", error });
  }
};

export const addGuestOnWeddingDay = async (req, res) => {
  try {
    const { userId, weddingId, name, village } = req.body;

    if (!userId || !weddingId || !name || !village) {
      return res.status(400).json({
        success: false,
        message: "userId, weddingId, name, and village are required",
      });
    }

    const guest = new Guest({
      userId,
      weddingId,
      name: name.trim(),
      village: village.trim(),
      mobileNumber: null,
      tag: "other", // Default for wedding day guests
      priority: 3, // Low priority for wedding day guests
      addedOn: "onWeddingDay", // Mark as added on wedding day
      invitedStatus: false, // Not formally invited
      attendedStatus: true, // Already attending (physically present)
    });

    await guest.save();

    res.status(201).json({
      success: true,
      message: "Guest added on wedding day successfully",
      guest: {
        _id: guest._id,
        name: guest.name,
        village: guest.village,
        tag: guest.tag,
        priority: guest.priority,
        addedOn: guest.addedOn,
        attendedStatus: guest.attendedStatus,
      },
    });
  } catch (error) {
    console.error("Add guest on wedding day error:", error);
    res.status(500).json({
      success: false,
      message: "Error adding guest on wedding day",
      error: error.message,
    });
  }
};

export const getGuestsByWeddingId = async (req, res) => {
  try {
    const { weddingId } = req.params;

    if (!weddingId) {
      return res
        .status(400)
        .json({ success: false, message: "weddingId is required" });
    }

    // Use lean() for read-only queries - much faster for large datasets
    const guests = await Guest.find({ weddingId })
      .lean()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      guests: guests,
    });
  } catch (error) {
    console.error("Get guests error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching guests", error });
  }
};

export const updateGuest = async (req, res) => {
  try {
    const { guestId } = req.params;
    const {
      name,
      village,
      mobileNumber,
      tag,
      priority,
      attendedStatus,
      contributionAmount,
      contributionType,
      givenBy,
    } = req.body;

    if (!guestId) {
      return res
        .status(400)
        .json({ success: false, message: "guestId is required" });
    }

    const guest = await Guest.findById(guestId);

    if (!guest) {
      return res
        .status(404)
        .json({ success: false, message: "Guest not found" });
    }

    if (name) guest.name = name.trim();
    if (village) guest.village = village.trim();
    if (mobileNumber !== undefined)
      guest.mobileNumber = mobileNumber ? mobileNumber.trim() : null;
    if (tag) guest.tag = tag;
    if (priority !== undefined) guest.priority = priority;
    if (attendedStatus !== undefined) guest.attendedStatus = attendedStatus;

    // Update contribution fields
    if (contributionAmount !== undefined) {
      guest.contributionAmount = Math.max(0, contributionAmount);
      // Auto-mark as attended if amount is given
      if (contributionAmount > 0) {
        guest.attendedStatus = true;
      }
    }
    if (contributionType) guest.contributionType = contributionType;
    if (givenBy !== undefined) guest.givenBy = givenBy ? givenBy.trim() : null;

    await guest.save();

    res.status(200).json({
      success: true,
      message: "Guest updated successfully",
      guest: {
        _id: guest._id,
        name: guest.name,
        village: guest.village,
        mobileNumber: guest.mobileNumber,
        tag: guest.tag,
        priority: guest.priority,
        attendedStatus: guest.attendedStatus,
        contributionAmount: guest.contributionAmount,
        contributionType: guest.contributionType,
        givenBy: guest.givenBy,
      },
    });
  } catch (error) {
    console.error("Update guest error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error updating guest", error });
  }
};

export const deleteGuest = async (req, res) => {
  try {
    const { guestId } = req.params;

    if (!guestId) {
      return res
        .status(400)
        .json({ success: false, message: "guestId is required" });
    }

    const guest = await Guest.findByIdAndDelete(guestId);

    if (!guest) {
      return res
        .status(404)
        .json({ success: false, message: "Guest not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Guest deleted successfully" });
  } catch (error) {
    console.error("Delete guest error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error deleting guest", error });
  }
};

export const recordContribution = async (req, res) => {
  try {
    const { guestId } = req.params;
    const { contributionAmount, contributionType } = req.body;

    if (!guestId) {
      return res
        .status(400)
        .json({ success: false, message: "guestId is required" });
    }

    const guest = await Guest.findById(guestId);

    if (!guest) {
      return res
        .status(404)
        .json({ success: false, message: "Guest not found" });
    }

    if (contributionAmount !== undefined)
      guest.contributionAmount = contributionAmount;
    if (contributionType) guest.contributionType = contributionType;

    await guest.save();

    res.status(200).json({
      success: true,
      message: "Contribution recorded successfully",
      guest: {
        _id: guest._id,
        name: guest.name,
        contributionAmount: guest.contributionAmount,
        contributionType: guest.contributionType,
      },
    });
  } catch (error) {
    console.error("Record contribution error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error recording contribution", error });
  }
};
