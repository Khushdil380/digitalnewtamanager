import SubFunction from "../models/SubFunction.js";

export const createSubFunction = async (req, res) => {
  try {
    const { weddingId, name } = req.body;

    if (!weddingId || !name?.trim()) {
      return res.status(400).json({ success: false, message: "weddingId and name are required" });
    }

    // Check duplicate name for same wedding
    const existing = await SubFunction.findOne({
      weddingId,
      name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
    });
    if (existing) {
      return res.status(400).json({ success: false, message: "Function with this name already exists" });
    }

    const subFunction = new SubFunction({
      weddingId,
      name: name.trim(),
    });

    await subFunction.save();
    res.status(201).json({ success: true, subFunction });
  } catch (error) {
    console.error("Create sub-function error:", error);
    res.status(500).json({ success: false, message: "Error creating function" });
  }
};

export const getSubFunctions = async (req, res) => {
  try {
    const { weddingId } = req.params;
    if (!weddingId) {
      return res.status(400).json({ success: false, message: "weddingId is required" });
    }

    const subFunctions = await SubFunction.find({ weddingId }).sort({ createdAt: 1 }).lean();
    res.status(200).json({ success: true, subFunctions });
  } catch (error) {
    console.error("Get sub-functions error:", error);
    res.status(500).json({ success: false, message: "Error fetching functions" });
  }
};

export const deleteSubFunction = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await SubFunction.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ success: false, message: "Function not found" });
    }
    res.status(200).json({ success: true, message: "Function deleted" });
  } catch (error) {
    console.error("Delete sub-function error:", error);
    res.status(500).json({ success: false, message: "Error deleting function" });
  }
};

export const inviteGuest = async (req, res) => {
  try {
    const { id } = req.params;
    const { guestId } = req.body;

    if (!guestId) {
      return res.status(400).json({ success: false, message: "guestId is required" });
    }

    const subFunction = await SubFunction.findByIdAndUpdate(
      id,
      { $addToSet: { invitedGuests: guestId } },
      { new: true }
    );

    if (!subFunction) {
      return res.status(404).json({ success: false, message: "Function not found" });
    }

    res.status(200).json({ success: true, subFunction });
  } catch (error) {
    console.error("Invite guest error:", error);
    res.status(500).json({ success: false, message: "Error inviting guest" });
  }
};

export const uninviteGuest = async (req, res) => {
  try {
    const { id } = req.params;
    const { guestId } = req.body;

    if (!guestId) {
      return res.status(400).json({ success: false, message: "guestId is required" });
    }

    const subFunction = await SubFunction.findByIdAndUpdate(
      id,
      {
        $pull: { invitedGuests: guestId, attendedGuests: guestId },
      },
      { new: true }
    );

    if (!subFunction) {
      return res.status(404).json({ success: false, message: "Function not found" });
    }

    res.status(200).json({ success: true, subFunction });
  } catch (error) {
    console.error("Uninvite guest error:", error);
    res.status(500).json({ success: false, message: "Error removing guest" });
  }
};

export const markAttended = async (req, res) => {
  try {
    const { id } = req.params;
    const { guestId } = req.body;

    if (!guestId) {
      return res.status(400).json({ success: false, message: "guestId is required" });
    }

    const subFunction = await SubFunction.findByIdAndUpdate(
      id,
      { $addToSet: { attendedGuests: guestId } },
      { new: true }
    );

    if (!subFunction) {
      return res.status(404).json({ success: false, message: "Function not found" });
    }

    res.status(200).json({ success: true, subFunction });
  } catch (error) {
    console.error("Mark attended error:", error);
    res.status(500).json({ success: false, message: "Error marking attendance" });
  }
};

export const unmarkAttended = async (req, res) => {
  try {
    const { id } = req.params;
    const { guestId } = req.body;

    if (!guestId) {
      return res.status(400).json({ success: false, message: "guestId is required" });
    }

    const subFunction = await SubFunction.findByIdAndUpdate(
      id,
      { $pull: { attendedGuests: guestId } },
      { new: true }
    );

    if (!subFunction) {
      return res.status(404).json({ success: false, message: "Function not found" });
    }

    res.status(200).json({ success: true, subFunction });
  } catch (error) {
    console.error("Unmark attended error:", error);
    res.status(500).json({ success: false, message: "Error unmarking attendance" });
  }
};
