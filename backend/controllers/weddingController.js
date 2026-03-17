import Wedding from "../models/Wedding.js";

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
