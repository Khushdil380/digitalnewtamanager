# 💍 DigitalNewtaManager

> Digitizing the age-old Indian wedding tradition of *Newta* — tracking guests, contributions, and attendance for every celebration.

**🌐 Live Demo:** [digitalnewtamanager.vercel.app](https://digitalnewtamanager.vercel.app/)

---

## What is the Newta System?

In Indian weddings — especially in rural and middle-class families — a designated person sits with a register on the wedding day. As each guest arrives, they offer a monetary contribution (called *Newta*), which is recorded by hand. Some guests send their contribution via someone else; others bring an envelope. This tradition of mutual giving and record-keeping has been done on paper for generations.

**DigitalNewtaManager** brings this entire workflow online.

---

## Features

### 🔐 Authentication
- Register with OTP email verification
- Login / Forgot password / Reset password
- Session persistence with JWT

### 💒 Wedding Management
- Create multiple weddings (for family, cousins, etc.)
- Store bride & groom names, venue, and date
- View invited vs attended guest counts per wedding

### 👥 Guest Management
- Add guests before the wedding with name, village, mobile, category, and priority
- Full search (matches anywhere in name, village, or mobile)
- Sort by: name, priority, village, attendance, amount, payment type, date added
- Group by: village, category, priority
- Guests added on wedding day are automatically labeled "Wedding Day"
- **Duplicate detection** — warns when same name + village already exists, with "Add Anyway" (numbered) or "Edit Name" options
- **Name suggestions** — shows existing guest names while typing for quick reference
- **Soft delete** — deleted guests are not permanently removed; shown in a collapsible section for reference. Excluded from stats, suggestions, and counts

### 📬 Card Distribution Tracking
- Track which guests have received their invitation card
- Mark/unmark card distribution from Guest List modal or Wedding Card header
- Instant UI feedback — no waiting for API response
- Only available before the wedding day (auto-disabled after)
- Filter guests by: Card Distributed / No Card Yet
- Shows on desktop guest cards (📬/📭 icon)

### 📰 Google Sheets Live Sync
- All guest data auto-syncs to a Google Sheet in the background
- Each wedding gets its own tab (e.g., "Priya & Rohit (Khushdil)")
- Syncs on: guest add, update, delete, contribution, card distribution
- New sheet tab auto-created when a new wedding is added
- Silent, non-blocking — never affects site speed

### 📧 Automatic Post-Wedding Email
- Day after the wedding (10 PM IST), an automatic email is sent to the user
- Contains congratulations message + full guest data
- Attachments: PDF, CSV, and Text file
- One-time send — never duplicates

### ⏰ Digital Clock
- 12-hour format digital clock on the wedding event page header
- Desktop only, uses Orbitron font for authentic digital look
- Fixed width digits — no jitter on time changes

### 💰 Contribution Recording (Wedding Day)
- **Only allowed on or after the wedding date** — shows date message if attempted earlier
- Autocomplete name and village from guest list
- Record amount with payment type: **Cash**, **UPI**, or **Envelope**
- Track whether given **Personally** or **By Someone**
- Auto-marks attendance when contribution is recorded
- Unknown guests auto-added to list
- **Already-contributed warning** — popup when recording for a guest who already contributed, with "Update Amount" (final total) or "Cancel"

### 📝 Notes (per wedding)
- Add, edit, and delete notes for any wedding
- Accessible via Notes icon in the wedding event page header
- Title + description with timestamps
- Confirmation prompt before deleting
- Scrollable list inside a fixed-height modal

### 📊 Attendance Progress Bar
- Animated horizontal bar showing real-time attended/total percentage
- Updates live after each contribution
- Positioned below the contribution form and QR section

### 🎉 Celebration Burst
- Emoji rain animation (🎉💰🎊💵✨🪙💸🥳) on successful contribution
- Toggle ON/OFF from Profile dropdown
- Stored in localStorage for persistence

### 💬 SMS Thank You (httpSMS)
- Auto-send custom thank you message to guests after contribution
- Uses your Android phone as SMS gateway via [httpSMS](https://httpsms.com)
- Setup: Profile → SMS tab with step-by-step instructions
- Custom message editor with `{name}` placeholder for guest name
- SMS ON/OFF toggle on wedding day page (only activates if configured)
- Sent message counter badge for tracking daily 100 SMS limit
- Only sends when: toggle ON + attended personally + guest has mobile number

### 📨 Bulk SMS (Card Distribution / Reminder / Custom)
- Send bulk messages from the Guest List (📨 icon in stats bar)
- Three message types: Card Distribution (one-time only), Reminder (repeatable), Custom (repeatable)
- Default Hindi templates with editable placeholders
- Select recipients: All / by Tag / individual / search
- Duplicate tracking: Card messages blocked if already sent to that guest
- Sent indicators (📨⏰✍️) shown per guest in recipient list
- Alphabetically sorted recipients with search

### 📲 QR Code (UPI Payments)
- Default QR links to a beautiful animated thank-you page for the couple
- Set your UPI ID once — it persists across sessions
- Generate amount-specific QR codes that auto-revert after 30 seconds
- Shows countdown timer and UPI ID below the code

### 📥 Export Guest List
- **PDF** — formatted table with wedding header and website footer
- **CSV / Excel** — opens directly in Excel or Google Sheets
- **Text** — plain readable format
- **Email** — sends to your registered email

### 🎨 UI
- Three wedding themes: Redish, Pink, Purple
- Animated wedding background (hearts, rings, flowers, doves)
- Fully responsive — Desktop and Mobile
- Transparent backgrounds let animation show through
- Landing page with Portfolio, GitHub, and Help links

### 🔄 Keep-Alive
- Daily cron job pings the backend to keep MongoDB Atlas M0 active

### 🔒 Security
- Auto-logout after 2 hours of inactivity
- JWT-based session management

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, CSS Variables, React Router v7 |
| Backend | Node.js, Express |
| Database | MongoDB Atlas |
| Auth | JWT + OTP via Nodemailer (Gmail) |
| SMS | httpSMS (Android gateway API) |
| PDF | jsPDF + jspdf-autotable |
| QR Code | qrcode.react |
| Deployment | Vercel (frontend + backend separately) |

---

## Project Structure

```
digitalnewtamanager/
├── backend/
│   ├── controllers/          # Auth, Profile, Wedding, Guest, Contribution, Note, SMS, BulkSms, Cron
│   ├── middleware/           # Auth middleware (JWT verification)
│   ├── models/               # User, Wedding, Guest, Contribution, OTP, Note, SmsLog
│   ├── routes/               # Express route definitions
│   ├── utils/                # Email service, helpers, postWeddingEmail, googleSheetsSync
│   └── server.js
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── AuthModal/    # Login, Register, OTP, Forgot, Reset
│       │   ├── BulkSms/     # BulkSmsModal, RecipientSelector, MessageTemplates
│       │   ├── Calculator/   # Calculator widget
│       │   ├── Celebration/  # CelebrationBurst (emoji rain)
│       │   ├── common/       # Modal, Button, InputField, ThemeSwitcher, AnimatedBackground
│       │   ├── Dashboard/    # DashboardHeader
│       │   ├── Event/        # ContributionForm, QRCodeSection, WeddingWishesHeader, DigitalClock
│       │   ├── Guest/        # GuestList, GuestCard, GuestFilters, GuestExport, GuestAddForm, CardDistributionModal
│       │   ├── HowToUse/     # HeroSection, StepsSection, FeaturesSection, TipsSection
│       │   ├── Notes/        # NotesModal, NoteList, NoteCard
│       │   ├── Profile/      # ProfileModal, ProfileDropdown, ProfileTabs (Personal, Email, Password, SMS)
│       │   ├── Progress/     # AttendanceBar
│       │   └── Wedding/      # WeddingCard, WeddingList, WeddingModal
│       ├── pages/            # Landing, Dashboard, WeddingEventPage, ThankYouPage, HowToUsePage
│       ├── styles/           # Organized mirrors component structure
│       └── utils/            # api.js (centralized axios with retry), formatDate.js
```

---

## Local Development

```bash
# Clone
git clone https://github.com/Khushdil380/digitalnewtamanager.git
cd digitalnewtamanager

# Backend
cd backend
npm install
# Create .env (see below)
npm run dev        # runs on http://localhost:5000

# Frontend (new terminal)
cd frontend
npm install
npm start          # runs on http://localhost:3000
```

### Backend `.env`
```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/digitalnewtamanager
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=24h
PORT=5000
NODE_ENV=development
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_SERVICE=gmail
FRONTEND_URL=http://localhost:3000

# Google Sheets Sync (optional)
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
```

### Frontend `.env`
```env
REACT_APP_API_URL=http://localhost:5000
```

---

## Guest Data Fields

| Field | Description |
|-------|-------------|
| Name * | Full name |
| Village * | City or village |
| Mobile | 10-digit number (optional) |
| Category | Friend / Family / Relative / Neighbour / Other |
| Priority | 1 High / 2 Mid / 3 Low |
| Card Distributed | Yes / No (default: No) |
| Attended | Auto-set when contribution is recorded |
| Attended By | Personally / By Someone |
| Amount | Contribution amount |
| Payment Type | Cash / UPI / Envelope |
| Added On | Earlier (from guest form) / Wedding (added on wedding day) |
| Date | Auto-saved timestamp |

---

## Author

Built by **Khushdil Ansari**

- GitHub: [@Khushdil380](https://github.com/Khushdil380)
- Portfolio: [khushdil-ansari-portfolio-frontend.vercel.app](https://khushdil-ansari-portfolio-frontend.vercel.app)
- Live: [digitalnewtamanager.vercel.app](https://digitalnewtamanager.vercel.app/)
