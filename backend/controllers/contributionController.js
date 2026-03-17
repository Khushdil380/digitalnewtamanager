import Contribution from "../models/Contribution.js";
import Guest from "../models/Guest.js";

export const recordContribution = async (req, res) => {
  try {
    const {
      weddingId,
      guestId,
      guestName,
      village,
      amount,
      type,
      givenPersonally,
      givenBy,
    } = req.body;

    // Validation
    if (
      !weddingId ||
      !guestId ||
      !guestName ||
      !village ||
      amount === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "weddingId, guestId, guestName, village, and amount are required",
      });
    }

    if (amount < 0) {
      return res.status(400).json({
        success: false,
        message: "Amount cannot be negative",
      });
    }

    // Record contribution - if amount is recorded, guest is automatically marked as attended
    const contribution = new Contribution({
      weddingId,
      guestId,
      guestName: guestName.trim(),
      village: village.trim(),
      amount,
      type: type || "cash",
      givenPersonally: givenPersonally !== false,
      givenBy: !givenPersonally && givenBy ? givenBy.trim() : null,
      attended: true, // Automatically mark as attended when contribution is recorded
    });

    await contribution.save();

    // Update guest with contribution details
    const updateData = {
      attendedStatus: true,
      contributionAmount: amount,
      contributionType: type || "cash",
      givenBy: !givenPersonally && givenBy ? givenBy.trim() : null,
    };

    await Guest.findByIdAndUpdate(guestId, updateData);

    res.status(201).json({
      success: true,
      message: "Contribution recorded successfully",
      contribution: {
        _id: contribution._id,
        guestName: contribution.guestName,
        village: contribution.village,
        amount: contribution.amount,
        type: contribution.type,
        givenPersonally: contribution.givenPersonally,
        attended: contribution.attended,
      },
    });
  } catch (error) {
    console.error("Record contribution error:", error);
    res.status(500).json({
      success: false,
      message: "Error recording contribution",
      error: error.message,
    });
  }
};

export const getContributionsByWedding = async (req, res) => {
  try {
    const { weddingId } = req.params;

    if (!weddingId) {
      return res.status(400).json({
        success: false,
        message: "weddingId is required",
      });
    }

    const contributions = await Contribution.find({ weddingId })
      .lean()
      .sort({ createdAt: -1 });

    const stats = {
      totalContributions: contributions.length,
      totalAmount: contributions.reduce((sum, c) => sum + c.amount, 0),
      cashCount: contributions.filter((c) => c.type === "cash").length,
      onlineCount: contributions.filter((c) => c.type === "upi").length,
      personalCount: contributions.filter((c) => c.givenPersonally).length,
      throughOthersCount: contributions.filter((c) => !c.givenPersonally)
        .length,
    };

    res.status(200).json({
      success: true,
      contributions,
      stats,
    });
  } catch (error) {
    console.error("Get contributions error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching contributions",
      error: error.message,
    });
  }
};

export const updateContribution = async (req, res) => {
  try {
    const { contributionId } = req.params;
    const { amount, type, givenPersonally, givenBy, description, attended } =
      req.body;

    if (!contributionId) {
      return res.status(400).json({
        success: false,
        message: "contributionId is required",
      });
    }

    const contribution = await Contribution.findById(contributionId);

    if (!contribution) {
      return res.status(404).json({
        success: false,
        message: "Contribution not found",
      });
    }

    if (amount !== undefined) {
      if (amount < 0) {
        return res.status(400).json({
          success: false,
          message: "Amount cannot be negative",
        });
      }
      contribution.amount = amount;
    }

    if (type) contribution.type = type;
    if (givenPersonally !== undefined)
      contribution.givenPersonally = givenPersonally;
    if (givenBy !== undefined)
      contribution.givenBy = givenBy ? givenBy.trim() : null;
    if (description !== undefined)
      contribution.description = description ? description.trim() : null;
    if (attended !== undefined) contribution.attended = attended;

    await contribution.save();

    // Sync guest record with updated contribution details
    const updateData = {};
    if (amount !== undefined) {
      updateData.contributionAmount = amount;
      // Auto-mark as attended if amount is given
      if (amount > 0) {
        updateData.attendedStatus = true;
      }
    }
    if (type) updateData.contributionType = type;
    if (givenBy !== undefined)
      updateData.givenBy = givenBy ? givenBy.trim() : null;

    if (Object.keys(updateData).length > 0) {
      await Guest.findByIdAndUpdate(contribution.guestId, updateData);
    }

    res.status(200).json({
      success: true,
      message: "Contribution updated successfully",
      contribution,
    });
  } catch (error) {
    console.error("Update contribution error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating contribution",
      error: error.message,
    });
  }
};

export const deleteContribution = async (req, res) => {
  try {
    const { contributionId } = req.params;

    if (!contributionId) {
      return res.status(400).json({
        success: false,
        message: "contributionId is required",
      });
    }

    const contribution = await Contribution.findByIdAndDelete(contributionId);

    if (!contribution) {
      return res.status(404).json({
        success: false,
        message: "Contribution not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Contribution deleted successfully",
    });
  } catch (error) {
    console.error("Delete contribution error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting contribution",
      error: error.message,
    });
  }
};
