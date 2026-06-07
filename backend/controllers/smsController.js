import User from "../models/User.js";

export const saveSmsSettings = async (req, res) => {
  try {
    const { userId, smsApiKey, smsPhoneNumber } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: "userId is required" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { smsApiKey: smsApiKey || null, smsPhoneNumber: smsPhoneNumber || null },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "SMS settings saved",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        avatar: user.avatar,
        smsApiKey: user.smsApiKey ? "••••" + user.smsApiKey.slice(-4) : null,
        smsPhoneNumber: user.smsPhoneNumber,
      },
    });
  } catch (error) {
    console.error("Save SMS settings error:", error);
    res.status(500).json({ success: false, message: "Error saving SMS settings" });
  }
};

export const getSmsSettings = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ success: false, message: "userId is required" });
    }

    const user = await User.findById(userId).select("smsApiKey smsPhoneNumber");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      smsApiKey: user.smsApiKey ? "••••" + user.smsApiKey.slice(-4) : null,
      smsPhoneNumber: user.smsPhoneNumber,
      isConfigured: !!(user.smsApiKey && user.smsPhoneNumber),
    });
  } catch (error) {
    console.error("Get SMS settings error:", error);
    res.status(500).json({ success: false, message: "Error fetching SMS settings" });
  }
};

export const sendSms = async (req, res) => {
  try {
    const { userId, to, message } = req.body;

    if (!userId || !to || !message) {
      return res.status(400).json({ success: false, message: "userId, to, and message are required" });
    }

    const user = await User.findById(userId).select("smsApiKey smsPhoneNumber");
    if (!user || !user.smsApiKey || !user.smsPhoneNumber) {
      return res.status(400).json({ success: false, message: "SMS not configured. Please set up in Profile → SMS." });
    }

    // Format phone number — add +91 if not present (Indian numbers)
    let formattedTo = to.replace(/\D/g, "");
    if (formattedTo.length === 10) formattedTo = "+91" + formattedTo;
    else if (!formattedTo.startsWith("+")) formattedTo = "+" + formattedTo;

    const response = await fetch("https://api.httpsms.com/v1/messages/send", {
      method: "POST",
      headers: {
        "x-api-key": user.smsApiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: user.smsPhoneNumber,
        to: formattedTo,
        content: message,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      res.status(200).json({ success: true, message: "SMS sent successfully" });
    } else {
      res.status(400).json({ success: false, message: data.message || "Failed to send SMS" });
    }
  } catch (error) {
    console.error("Send SMS error:", error.message);
    res.status(500).json({ success: false, message: "Failed to send SMS" });
  }
};
