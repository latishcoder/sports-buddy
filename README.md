# 🏅 Sports Buddy

A full-stack MERN application for creating and joining local sports matches.

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 18 + Vite + TailwindCSS 3   |
| Backend    | Node.js + Express.js              |
| Database   | MongoDB + Mongoose                |
| Auth       | JWT (JSON Web Tokens)             |
| HTTP       | Axios                             |

---

🚀 Live Demo

 Live Link:
👉 https://sports-buddy-git-main-latishdev-gmailcoms-projects.vercel.app/

## 📁 Project Structure

```
sports-buddy/
├── client/                   # React frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── MatchCard.jsx
│   │   │   └── Spinner.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CreateMatch.jsx
│   │   │   ├── MatchDetails.jsx
│   │   │   └── Profile.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── hooks/
│   │   │   └── useMatches.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── server/                   # Express backend
    ├── config/
    │   └── db.js
    ├── controllers/
    │   ├── authController.js
    │   └── matchController.js
    ├── middleware/
    │   └── authMiddleware.js
    ├── models/
    │   ├── User.js
    │   └── Match.js
    ├── routes/
    │   ├── authRoutes.js
    │   └── matchRoutes.js
    ├── index.js
    └── package.json
```

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js >= 18
- MongoDB (local or MongoDB Atlas)

---

### 1. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Create .env from example
cp .env.example .env
```

Edit `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/sportsbuddy
JWT_SECRET=your_super_secret_key_here
NODE_ENV=development
```

```bash
# Start development server
npm run dev

# Or production
npm start
```

Backend runs at: `http://localhost:5000`

---

### 2. Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs at: `http://localhost:5173`

The Vite dev server proxies `/api` requests to `http://localhost:5000` automatically.

---

## 🔌 API Endpoints

### Auth
| Method | Route               | Access  | Description       |
|--------|---------------------|---------|-------------------|
| POST   | /api/auth/register  | Public  | Register user     |
| POST   | /api/auth/login     | Public  | Login user        |
| GET    | /api/auth/me        | Private | Get current user  |

### Matches
| Method | Route                    | Access  | Description         |
|--------|--------------------------|---------|---------------------|
| GET    | /api/matches             | Public  | Get all matches     |
| POST   | /api/matches             | Private | Create match        |
| GET    | /api/matches/:id         | Public  | Get single match    |
| POST   | /api/matches/:id/join    | Private | Join a match        |
| POST   | /api/matches/:id/leave   | Private | Leave a match       |
| DELETE | /api/matches/:id         | Private | Delete match (creator only) |

---

## 🌟 Features

- **JWT Authentication** — Secure login/register with token stored in localStorage
- **Protected Routes** — Dashboard, Create Match, Profile require login
- **Create Matches** — Set sport, location, date/time, player count, skill level
- **Join/Leave Matches** — Real-time participant tracking
- **Sport Filtering** — Filter matches by sport on the home page
- **Dashboard** — View matches you created or joined, delete your matches
- **Profile Page** — Stats overview and sports history
- **Responsive Design** — Works on mobile, tablet, and desktop

---

## 🎨 Design

- Dark theme with green accent (`#22c55e` pitch green)
- `Barlow Condensed` display font for headings
- `DM Sans` for body text
- Custom Tailwind component classes: `.btn-primary`, `.card`, `.input-field`, `.badge`
