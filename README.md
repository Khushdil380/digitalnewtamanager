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

### 💰 Contribution Recording (Wedding Day)
- Autocomplete name and village from guest list
- Record amount with payment type: **Cash**, **UPI**, or **Envelope**
- Track whether given **Personally** or **By Someone**
- Auto-marks attendance when contribution is recorded
- Unknown guests auto-added to list

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

### 🔄 Keep-Alive
- Daily cron job pings the backend to keep MongoDB Atlas M0 active

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, CSS Variables, React Router v7 |
| Backend | Node.js, Express |
| Database | MongoDB Atlas |
| Auth | JWT + OTP via Nodemailer (Gmail) |
| PDF | jsPDF + jspdf-autotable |
| QR Code | qrcode.react |
| Deployment | Vercel (frontend + backend separately) |

---

## Project Structure

```
digitalnewtamanager/
├── backend/
│   ├── controllers/          # Auth, Wedding, Guest, Contribution
│   ├── models/               # User, Wedding, Guest, Contribution, OTP
│   ├── routes/               # Express route definitions
│   ├── utils/                # Email service, helpers
│   └── server.js
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── AuthModal/    # Login, Register, OTP, Forgot, Reset
│       │   ├── common/       # Modal, Button, InputField, ThemeSwitcher, AnimatedBackground
│       │   ├── Dashboard/    # DashboardHeader
│       │   ├── Event/        # ContributionForm, QRCodeSection, WeddingWishesHeader
│       │   ├── Guest/        # GuestList, GuestCard, GuestFilters, GuestExport, GuestAddForm
│       │   ├── Profile/      # ProfileModal, ProfileDropdown, ProfileTabs, AvatarSelector
│       │   └── Wedding/      # WeddingCard, WeddingList, WeddingModal
│       ├── pages/            # Landing, Dashboard, WeddingEventPage, ThankYouPage
│       ├── styles/           # Organized mirrors component structure
│       └── utils/            # api.js (centralized axios), formatDate.js
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
PORT=5000
NODE_ENV=development
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_SERVICE=gmail
FRONTEND_URL=http://localhost:3000
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
- Live: [digitalnewtamanager.vercel.app](https://digitalnewtamanager.vercel.app/)
