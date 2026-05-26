# 💍 DigitalNewtaManager

A full-stack web application to digitally manage the traditional Indian wedding guest and contribution (Newta) system.

**Live:** [digitalnewtamanager.vercel.app](https://digitalnewtamanager.vercel.app/)

## What it does

In Indian weddings, guests arrive and offer monetary contributions which are recorded in a physical register. This app digitizes that entire workflow:

- Create and manage multiple weddings
- Maintain invited guest lists with categories and priorities
- Record contributions on the wedding day (cash, UPI, envelope)
- Track attendance — who came personally vs sent via someone
- Generate UPI QR codes for digital payments
- Export guest lists as PDF, CSV, or text
- Send guest list to email

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, CSS (custom), React Router |
| Backend | Node.js, Express |
| Database | MongoDB Atlas |
| Email | Nodemailer (Gmail) |
| Deployment | Vercel (frontend + backend separately) |
| PDF | jsPDF + jspdf-autotable |
| QR Code | qrcode.react |

## Features

- 🔐 Email/OTP based authentication with forgot password
- 💒 Multiple wedding management per account
- 👥 Guest list with search, sort, group, and filter
- 💰 Contribution recording (cash / UPI / envelope)
- 📱 QR code generation for UPI payments (30s auto-reset)
- 📥 Export: PDF, Text, CSV, Email
- 🎨 Three wedding themes (Red, Pink, Purple)
- 📱 Fully responsive (Desktop + Mobile)
- ✨ Animated wedding-themed background

## Project Structure

```
├── backend/
│   ├── controllers/     # Route handlers
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── utils/           # Email service, helpers
│   └── server.js        # Express app
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthModal/    # Login, Register, OTP, Forgot/Reset
│   │   │   ├── common/       # Modal, Button, InputField, ThemeSwitcher
│   │   │   ├── Dashboard/    # Header
│   │   │   ├── Event/        # Contribution form, QR, Wishes header
│   │   │   ├── Guest/        # List, Card, Filters, Export, Add form
│   │   │   ├── Profile/      # Modal, Dropdown, Tabs, Avatar
│   │   │   └── Wedding/      # Card, List, Modal
│   │   ├── pages/            # Landing, Dashboard, WeddingEvent, ThankYou
│   │   ├── styles/           # Organized by feature (mirrors components)
│   │   └── utils/            # Centralized API, date formatter
│   └── public/
```

## Local Setup

```bash
# Backend
cd backend
npm install
cp .env.example .env   # Add your MongoDB URI, JWT secret, email credentials
npm run dev

# Frontend
cd frontend
npm install
npm start
```

Frontend runs on `http://localhost:3000`, backend on `http://localhost:5000`.

## Environment Variables

**Backend (.env):**
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
EMAIL_USER=your_gmail
EMAIL_PASSWORD=your_app_password
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env):**
```
REACT_APP_API_URL=http://localhost:5000
```

## Author

**Khushdil Ansari** — [GitHub](https://github.com/Khushdil380)
