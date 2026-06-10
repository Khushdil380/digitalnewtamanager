import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
const CLIENT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n");

let sheetsClient = null;

// Initialize Google Sheets client (lazy, once)
const getClient = async () => {
  if (sheetsClient) return sheetsClient;

  if (!SPREADSHEET_ID || !CLIENT_EMAIL || !PRIVATE_KEY) {
    throw new Error("Google Sheets credentials not configured");
  }

  const auth = new google.auth.JWT({
    email: CLIENT_EMAIL,
    key: PRIVATE_KEY,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  await auth.authorize();
  sheetsClient = google.sheets({ version: "v4", auth });
  return sheetsClient;
};

// Get or create a sheet tab for a wedding
const getOrCreateTab = async (sheets, tabName) => {
  const res = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  const existing = res.data.sheets.find((s) => s.properties.title === tabName);

  if (existing) return tabName;

  // Create new tab
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    resource: {
      requests: [{ addSheet: { properties: { title: tabName } } }],
    },
  });

  // Add headers
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${tabName}'!A1:K1`,
    valueInputOption: "RAW",
    resource: {
      values: [["#", "Name", "Village", "Mobile", "Tag", "Priority", "Attended", "Amount", "Payment", "Given By", "Added On"]],
    },
  });

  return tabName;
};

// Generate tab name: "Bride & Groom (User)"
const buildTabName = (brideName, groomName, userName) => {
  const name = `${brideName} & ${groomName} (${userName})`;
  // Sheet tab names max 100 chars
  return name.substring(0, 100);
};

/**
 * Sync a single guest row to the Google Sheet (background, non-blocking)
 * Called after a contribution is recorded
 */
export const syncGuestToSheet = async (guest, wedding, userName) => {
  try {
    const sheets = await getClient();
    const tabName = buildTabName(wedding.brideName, wedding.groomName, userName);
    await getOrCreateTab(sheets, tabName);

    // Check if guest row already exists (search by name + village in col B & C)
    const existing = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `'${tabName}'!B:C`,
    });

    const rows = existing.data.values || [];
    let rowIndex = -1;
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][0] === guest.name && rows[i][1] === guest.village) {
        rowIndex = i + 1; // 1-indexed for Sheets
        break;
      }
    }

    const rowData = [
      rowIndex > 0 ? rowIndex - 1 : rows.length,
      guest.name,
      guest.village,
      guest.mobileNumber || "",
      guest.tag || "",
      guest.priority || "",
      guest.attended ? "Yes" : "No",
      guest.amount || 0,
      guest.paymentType || "",
      guest.attendedBy || "",
      guest.addedOn || "",
    ];

    if (rowIndex > 0) {
      // Update existing row
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `'${tabName}'!A${rowIndex}:K${rowIndex}`,
        valueInputOption: "RAW",
        resource: { values: [rowData] },
      });
    } else {
      // Append new row
      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `'${tabName}'!A:K`,
        valueInputOption: "RAW",
        insertDataOption: "INSERT_ROWS",
        resource: { values: [rowData] },
      });
    }
  } catch (err) {
    // Silent fail — don't affect main app
    console.error("Google Sheets sync error:", err.message);
  }
};

/**
 * Full sync: writes all guests for a wedding to the sheet (used for initial sync or recovery)
 */
export const fullSyncToSheet = async (guests, wedding, userName) => {
  try {
    const sheets = await getClient();
    const tabName = buildTabName(wedding.brideName, wedding.groomName, userName);
    await getOrCreateTab(sheets, tabName);

    // Clear existing data (keep header)
    await sheets.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range: `'${tabName}'!A2:K`,
    });

    // Write all rows
    const rows = guests
      .filter((g) => !g.isDeleted)
      .map((g, i) => [
        i + 1, g.name, g.village, g.mobileNumber || "", g.tag || "",
        g.priority || "", g.attended ? "Yes" : "No", g.amount || 0,
        g.paymentType || "", g.attendedBy || "", g.addedOn || "",
      ]);

    if (rows.length > 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `'${tabName}'!A2:K${rows.length + 1}`,
        valueInputOption: "RAW",
        resource: { values: rows },
      });
    }
  } catch (err) {
    console.error("Google Sheets full sync error:", err.message);
  }
};
