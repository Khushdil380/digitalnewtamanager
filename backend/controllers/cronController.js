import Wedding from "../models/Wedding.js";
import Guest from "../models/Guest.js";
import User from "../models/User.js";
import { sendPostWeddingSummary } from "../utils/postWeddingEmail.js";

/**
 * Cron job: runs daily at ~10 PM IST
 * Finds weddings that happened yesterday and sends summary email to the owner
 */
export const postWeddingSummaryJob = async (req, res) => {
  try {
    // Get yesterday's date range (IST)
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istNow = new Date(now.getTime() + istOffset);

    const yesterday = new Date(istNow);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const yesterdayEnd = new Date(yesterday);
    yesterdayEnd.setHours(23, 59, 59, 999);

    // Convert back to UTC for DB query
    const startUTC = new Date(yesterday.getTime() - istOffset);
    const endUTC = new Date(yesterdayEnd.getTime() - istOffset);

    // Find weddings from yesterday that haven't been emailed yet
    const weddings = await Wedding.find({
      date: { $gte: startUTC, $lte: endUTC },
      summaryEmailSent: { $ne: true },
    });

    if (weddings.length === 0) {
      return res.json({ message: "No weddings to process", count: 0 });
    }

    let sentCount = 0;

    for (const wedding of weddings) {
      try {
        const [user, guests] = await Promise.all([
          User.findById(wedding.userId),
          Guest.find({ weddingId: wedding._id }),
        ]);

        if (!user || !user.email) continue;

        await sendPostWeddingSummary(user.email, user.fullName, wedding, guests);

        // Mark as sent
        wedding.summaryEmailSent = true;
        await wedding.save();
        sentCount++;
      } catch (err) {
        console.error(`Failed to send summary for wedding ${wedding._id}:`, err.message);
      }
    }

    res.json({ message: "Post-wedding summary job completed", sentCount, total: weddings.length });
  } catch (error) {
    console.error("Cron job error:", error.message);
    res.status(500).json({ message: "Cron job failed", error: error.message });
  }
};
