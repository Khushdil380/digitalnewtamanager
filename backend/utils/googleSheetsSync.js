import { GoogleAuth } from "google-auth-library";
import dotenv from "dotenv";

dotenv.config();

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
const CLIENT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n");
const SHEETS_BASE = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}`;

let authClient = null;

// Get authenticated client (lazy init)
const getAuth = async () => {
  if (authClient) return authClient;
  if (!SPREADSHEET_ID || !CLIENT_EMAIL || !PRIVATE_KEY) return null;

  const auth = new GoogleAuth({
    credentials: { client_email: CLIENT_EMAIL, private_key: PRIVATE_KEY },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  authClient = await auth.getClient();
  return authClient;
};

// Make authenticated request to Sheets API
const sheetsRequest = async (url, method = "GET", body = null) => {
  const client = await getAuth();
  if (!client) return null;

  const options = { url, method };
  if (body) {
    options.data = body;
    options.headers = { "Content-Type": "application/json" };
  }
  return client.request(options);
};

// Get or create a sheet tab for a wedding
const getOrCreateTab = async (tabName) => {
  const res = await sheetsRequest(SHEETS_BASE);
  const sheets = res.data.sheets || [];
  const existing = sheets.find((s) => s.properties.title === tabName);
  if (existing) return;

  // Create new tab
  await sheetsRequest(`${SHEETS_BASE}:batchUpdate`, "POST", {
    requests: [{ addSheet: { properties: { title: tabName } } }],
  });

  // Add headers
  const range = encodeURIComponent(`'${tabName}'!A1:K1`);
  await sheetsRequest(
    `${SHEETS_BASE}/values/${range}?valueInputOption=RAW`,
    "PUT",
    { values: [["#", "Name", "Village", "Mobile", "Tag", "Priority", "Attended", "Amount", "Payment", "Given By", "Added On"]] }
  );
};

// Generate tab name
const buildTabName = (brideName, groomName, userName) => {
  return `${brideName} & ${groomName} (${userName})`.substring(0, 100);
};

/**
 * Sync a single guest row to the sheet (called after contribution is recorded)
 */
export const syncGuestToSheet = async (guest, wedding, userName) => {
  try {
    const tabName = buildTabName(wedding.brideName, wedding.groomName, userName);
    await getOrCreateTab(tabName);

    // Get existing rows to find if guest exists
    const range = encodeURIComponent(`'${tabName}'!B:C`);
    const res = await sheetsRequest(`${SHEETS_BASE}/values/${range}`);
    const rows = res?.data?.values || [];

    let rowIndex = -1;
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][0] === guest.name && rows[i][1] === guest.village) {
        rowIndex = i + 1;
        break;
      }
    }

    const rowData = [[
      rowIndex > 0 ? rowIndex - 1 : rows.length,
      guest.name, guest.village, guest.mobileNumber || "", guest.tag || "",
      guest.priority || "", guest.attended ? "Yes" : "No", guest.amount || 0,
      guest.paymentType || "", guest.attendedBy || "", guest.addedOn || "",
    ]];

    if (rowIndex > 0) {
      const updateRange = encodeURIComponent(`'${tabName}'!A${rowIndex}:K${rowIndex}`);
      await sheetsRequest(`${SHEETS_BASE}/values/${updateRange}?valueInputOption=RAW`, "PUT", { values: rowData });
    } else {
      const appendRange = encodeURIComponent(`'${tabName}'!A:K`);
      await sheetsRequest(`${SHEETS_BASE}/values/${appendRange}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, "POST", { values: rowData });
    }
  } catch (err) {
    console.error("Google Sheets sync error:", err.message);
  }
};

/**
 * Remove a guest row from the sheet (called on soft delete)
 */
export const removeGuestFromSheet = async (guest, wedding, userName) => {
  try {
    const tabName = buildTabName(wedding.brideName, wedding.groomName, userName);

    // Get all rows to find the guest
    const range = encodeURIComponent(`'${tabName}'!B:C`);
    const res = await sheetsRequest(`${SHEETS_BASE}/values/${range}`);
    const rows = res?.data?.values || [];

    let rowIndex = -1;
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][0] === guest.name && rows[i][1] === guest.village) {
        rowIndex = i + 1;
        break;
      }
    }

    if (rowIndex < 0) return;

    // Get sheet ID for the tab
    const spreadsheet = await sheetsRequest(SHEETS_BASE);
    const sheet = spreadsheet.data.sheets.find((s) => s.properties.title === tabName);
    if (!sheet) return;

    // Delete the row
    await sheetsRequest(`${SHEETS_BASE}:batchUpdate`, "POST", {
      requests: [{
        deleteDimension: {
          range: {
            sheetId: sheet.properties.sheetId,
            dimension: "ROWS",
            startIndex: rowIndex - 1,
            endIndex: rowIndex,
          },
        },
      }],
    });
  } catch (err) {
    console.error("Google Sheets remove error:", err.message);
  }
};

/**
 * Full sync: writes all guests for a wedding to the sheet
 */
export const fullSyncToSheet = async (guests, wedding, userName) => {
  try {
    const tabName = buildTabName(wedding.brideName, wedding.groomName, userName);
    await getOrCreateTab(tabName);

    // Clear existing data (keep header)
    const clearRange = encodeURIComponent(`'${tabName}'!A2:K`);
    await sheetsRequest(`${SHEETS_BASE}/values/${clearRange}:clear`, "POST");

    // Write all rows
    const activeGuests = guests.filter((g) => !g.isDeleted);
    if (activeGuests.length === 0) return;

    const rows = activeGuests.map((g, i) => [
      i + 1, g.name, g.village, g.mobileNumber || "", g.tag || "",
      g.priority || "", g.attended ? "Yes" : "No", g.amount || 0,
      g.paymentType || "", g.attendedBy || "", g.addedOn || "",
    ]);

    const updateRange = encodeURIComponent(`'${tabName}'!A2:K${rows.length + 1}`);
    await sheetsRequest(`${SHEETS_BASE}/values/${updateRange}?valueInputOption=RAW`, "PUT", { values: rows });
  } catch (err) {
    console.error("Google Sheets full sync error:", err.message);
  }
};
