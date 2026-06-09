import User from "../models/User.js";
import Guest from "../models/Guest.js";
import SmsLog from "../models/SmsLog.js";

export const getSmsLogs = async (req, res) => {
  try {
    const { weddingId } = req.params;
    if (!weddingId) return res.status(400).json({ success: false, message: "weddingId required" });

    const logs = await SmsLog.find({ weddingId }).select("guestId messageType createdAt").lean();
    res.status(200).json({ success: true, logs });
  } catch (error) {
    console.error("Get SMS logs error:", error);
    res.status(500).json({ success: false, message: "Error fetching SMS logs" });
  }
};

export const sendBulkSms = async (req, res) => {
  try {
    const { userId, weddingId, guestIds, messageType, message } = req.body;

    if (!userId || !weddingId || !guestIds || !messageType || !message) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    const user = await User.findById(userId).select("smsApiKey smsPhoneNumber");
    if (!user || !user.smsApiKey || !user.smsPhoneNumber) {
      return res.status(400).json({ success: false, message: "SMS not configured" });
    }

    // Get guests with mobile numbers
    const guests = await Guest.find({ _id: { $in: guestIds }, mobileNumber: { $ne: null } })
      .select("name mobileNumber")
      .lean();

    // Check already sent logs for this type
    const existingLogs = await SmsLog.find({
      weddingId,
      guestId: { $in: guestIds },
      messageType,
    }).select("guestId").lean();

    const alreadySent = new Set(existingLogs.map((l) => l.guestId.toString()));

    let sentCount = 0;
    let skippedCount = 0;
    const errors = [];

    for (const guest of guests) {
      if (alreadySent.has(guest._id.toString())) {
        skippedCount++;
        continue;
      }

      let formattedTo = guest.mobileNumber.replace(/\D/g, "");
      if (formattedTo.length === 10) formattedTo = "+91" + formattedTo;
      else if (!formattedTo.startsWith("+")) formattedTo = "+" + formattedTo;

      const personalizedMsg = message.replace(/\{name\}/g, guest.name);

      try {
        const response = await fetch("https://api.httpsms.com/v1/messages/send", {
          method: "POST",
          headers: { "x-api-key": user.smsApiKey, "Content-Type": "application/json" },
          body: JSON.stringify({ from: user.smsPhoneNumber, to: formattedTo, content: personalizedMsg }),
        });

        if (response.ok) {
          await SmsLog.create({ weddingId, guestId: guest._id, messageType, message: personalizedMsg, phoneNumber: formattedTo });
          sentCount++;
        } else {
          errors.push(guest.name);
        }
      } catch (err) {
        errors.push(guest.name);
      }
    }

    res.status(200).json({
      success: true,
      message: `Sent: ${sentCount}, Skipped (already sent): ${skippedCount}, Failed: ${errors.length}`,
      sentCount,
      skippedCount,
      failedNames: errors,
    });
  } catch (error) {
    console.error("Bulk SMS error:", error);
    res.status(500).json({ success: false, message: "Error sending bulk SMS" });
  }
};
