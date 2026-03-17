# DigitalNewtaManager

A comprehensive web application for managing wedding guests and monetary contributions (Newta System).

## Project Structure

```
digitalnewtamanager/
├── frontend/                 # React Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── AnimatedBackground.js
│   │   │   ├── ThemeSwitcher.js
│   │   │   └── Button.js
│   │   ├── pages/           # Page components
│   │   │   └── Landing.js
│   │   ├── styles/          # CSS files
│   │   │   ├── index.css
│   │   │   ├── AnimatedBackground.css
│   │   │   ├── ThemeSwitcher.css
│   │   │   ├── Button.css
│   │   │   └── Landing.css
│   │   ├── assets/          # Images and assets
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── .gitignore
│
├── backend/                  # Node.js Backend
│   ├── models/              # Mongoose models
│   │   └── User.js
│   ├── routes/              # API routes
│   │   └── authRoutes.js
│   ├── controllers/         # Request handlers
│   │   └── authController.js
│   ├── middleware/          # Custom middleware
│   │   └── authMiddleware.js
│   ├── utils/               # Utility functions
│   │   ├── emailService.js
│   │   └── helpers.js
│   ├── server.js
│   ├── .env
│   ├── package.json
│   └── .gitignore
│
├── .gitignore
└── README.md
```

## Technology Stack

- **Frontend**: React, HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Email**: Nodemailer with Gmail
- **Authentication**: JWT

## Features Implemented (Phase 1)

✓ Project setup with modular structure
✓ Animated background with wedding theme elements
✓ Theme switcher (Light & Dark mode)
✓ Reusable Button component with multiple variants
✓ Landing page with title, subtitle, and CTA button
✓ Responsive design for desktop and mobile
✓ Backend authentication structure
✓ User model and database schema

## Setup Instructions

### Frontend

```bash
cd frontend
npm install
npm start
```

### Backend

```bash
cd backend
npm install
npm start
```

## Environment Variables

**Backend (.env)**

- MONGODB_URI
- JWT_SECRET
- EMAIL_USER
- EMAIL_PASSWORD
- FRONTEND_URL
- PORT

## Color Theme

- **Primary Red**: #C41E3A
- **Primary Pink**: #E75480
- **Primary Purple**: #9B2C7A

## Phases

- **Phase 1**: ✓ Landing page & Theme switcher (COMPLETED)
- **Phase 2**: Login/Register with OTP verification (IN PROGRESS)
- **Phase 3**: Wedding creation and management
- **Phase 4**: Guest management and invitation tracking
- **Phase 5**: Attendance and contribution tracking
