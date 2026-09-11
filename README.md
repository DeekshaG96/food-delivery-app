<div align="center">

# 🌶️ NaanStop — Modern Desi Canteen & Express Delivery

### *"Ghar Ka Pyaar, Dhaba Ka Swad • Non-Stop Goodness!"*

An enterprise-ready, full-stack Desi food delivery, table reservation, and kitchen operations platform built with **React 18 (Vite)**, **Node.js**, **Express**, and **Modern Vanilla CSS**.

[![React](https://img.shields.io/badge/Frontend-React%2018%20(Vite)-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2F%20Express-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![JavaScript](https://img.shields.io/badge/Language-JavaScript%20(ESM)-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen)](https://github.com/DeekshaG96/food-delivery-app)
[![Tests](https://img.shields.io/badge/Tests-24%2F24%20Passing-success)](https://github.com/DeekshaG96/food-delivery-app)

<p align="center">
  <a href="#-key-features">Key Features</a> •
  <a href="#-the-naanstop-experience">The NaanStop Vibe</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-project-architecture">Architecture</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-api-documentation">API Docs</a> •
  <a href="#-testing--verification">Testing</a> •
  <a href="#-acknowledgements">Acknowledgements</a>
</p>

</div>

---

## 📖 Overview

**NaanStop 🌶️** is a vibrant, modern full-stack culinary application that blends high-energy Indian dhaba culture with sleek, state-of-the-art digital dining. Combining royal dawat feasts with fast-casual street food, NaanStop solves the entire food journey—from interactive dish exploration to live kitchen prep, gamified discounts, and delivery partner tracking.

Synthesizing proven architectural patterns from:
- **[KitchenAsty](https://github.com/mighty840/kitchenasty)**: Self-hosted table reservations and real-time Kitchen Display System (KDS) Kanban.
- **[delivery_app](https://github.com/CaioQuirinoMedeiros/delivery_app)**: Portion sizing (`Single Plate / Handi`, `Dhaba Sharing`, `Royal Dawat`), spice customizations, add-ons, and itemized receipts.
- **NaanStop Royal Innovations**: Gamified **Chakkar of Luck 🎡**, **Raju Bhaiya 🛵** live tracker with chai tipping, 1-click **🟢 Pure Veg Mode**, and offline **Web Audio Desi Diner Radio**.

---

## 🌟 Key Features

### 🛒 Customer Web Portal (`frontend/` — Port 5173)

#### 1. 🍛 Royal Desi Menu & Pure Veg Mode
* **7 Curated Indian Categories**: *Biryani*, *Curries*, *Tandoor*, *Breads*, *Street Chaat*, *Chai & Drinks*, and *Mithai*.
* **Authentic FSSAI Badges**: Distinctive green square/dot (🟢 Pure Veg) and red square/dot (🔴 Non-Veg) indicators on every dish card and modal.
* **1-Click 🟢 Veg Mode**: Instant navbar toggle switch filtering out all non-veg items with active visual alerts.
* **Desi Spice Meter (Teekhapan)**: Choose between *Mild (Creamy) 🌿*, *Medium (Ghar Ka Tadka) 🌶️*, *Desi Teekha (Dhaba Style) 🌶️🌶️*, and *Bhut Jolokia Fire 🌶️🌶️🌶️*.
* **🌱 Jain-Friendly Option**: 1-click toggle for satvik preparation (cooked without onions or garlic in dedicated cookware).
* **Desi Sidekicks & Add-Ons**: Extra dollops of Amul Makhan, chilled boondi raita, sirka pickled onions, crispy papad, and piping hot garlic naan.

#### 2. 🎡 "Chakkar of Luck" (Gamified Spin-the-Wheel)
* Interactive SVG/Canvas lucky wheel modal with vibrant Indian festive colors.
* Procedural Web Audio API sound synthesis: realistic mechanical wheel ticks and celebratory fanfare chords.
* Instant coupon rewards:
  * `TADKA20`: 20% OFF subtotal
  * `FREELASSI`: Free Chilled Mango Lassi ($4.50 value)
  * `CHAI5`: $5.00 OFF for chai lovers
  * `DESIFREE`: Free Express Delivery waiver
  * `MAKHAN10`: 10% OFF Makhan discount
  * `GULABJAMUN`: Free Shahi Gulab Jamun treat ($3.99 value)
* 1-click "Apply Coupon Directly to Cart" with clipboard copy fallback.

#### 3. 🛵 "Raju Bhaiya" Live Delivery Hero & Chai Tipping
* Customer order tracking cards displaying your assigned delivery hero:
  * **Raju Bhaiya** (4.9 ★, 1,420+ safe deliveries)
  * **Vehicle**: Hero Splendor (`KA-03-HA-7788`)
  * **Live ETA Countdown**: Real-time arrival estimation with insulated hot-bag guarantee.
* **Chai Tipping**: 1-click tipping (*"Bhaiya ki Chai ke liye"* $1, $2, or $3) with 100% direct attribution to the rider.

#### 4. 🪑 Themed Desi Table Reservations
* **Maharaja Royal Diwan 👑**: Regal silk cushions, antique brass lanterns, and low-table dawat feast seating.
* **Dhaba Charpai Courtyard 🪑**: Authentic woven charpai cots, open tandoor aromas, and truck art aesthetic.
* **Bollywood Retro Rooftop 🌆**: Open-air terrace with nostalgic golden era cinema murals and panoramic skyline views.
* **Verandah Garden Patio 🌿**: Al fresco fountain courtyard surrounded by night-blooming jasmine and marigolds.
* Instant `RES-xxxx` confirmation code, email notification dispatch, and personal reservation history.

#### 5. 📻 NaanStop Desi Diner Radio & Waiting Lounge
* In-app audio player featuring 3 procedural ambient stations (100% offline Web Audio API):
  * 🎸 *Bollywood Acoustic Chill* (Romantic nylon guitar & mellow chords)
  * 🌧️ *Tapri Chai & Monsoon Rain* (Raindrop ambience & gentle lofi piano)
  * 🌅 *Highway Dhaba Sunset* (Ethereal tanpura pads & sitar undertones)
* Plus classic cafe lofi channels, dancing soundwave equalizer, and spinning vinyl disc animation.

---

### 🛠️ Kitchen OS & Admin Dashboard (`admin/` — Port 5174)

* **Live Kitchen Display System (KDS) Kanban**:
  * 4 live workflow lanes: **New Orders** ➔ **In Kitchen** ➔ **Ready** ➔ **Completed**.
  * Prep urgency timers, order-type badges (`Delivery`, `Store Pickup`, `Dine-In`), and itemized portion breakdowns.
  * 1-click stage progression buttons (`Start Prep ➔`, `Ready for Pickup ➔`, `Complete ➔`).
* **Table Reservations Desk**:
  * KPI metric cards: *Total Bookings*, *Confirmed*, *Seated*, and *Today's Guests*.
  * Operational actions: `Seat Guests`, `Confirm`, and `Cancel`.
* **Menu Catalog & Inventory Manager**:
  * Add new Desi dishes with image upload, category assignment, spice defaults, and pricing.
  * Searchable menu catalog with instant deletion.

---

### ⚡ Resilient Backend Service (`backend/` — Port 4000)

* **Dual Storage Engine**:
  * Production ready with **MongoDB Atlas** (`MONGO_URI`).
  * **Zero-Config Local Fallback**: Automatically persists to local store (`data/db.json`) if MongoDB URI is absent.
* **JWT Authentication**: User registration, login, token verification, and instant 1-click demo accounts.
* **Rider & Tip Attribution**: Persists assigned delivery rider profiles, ETA countdowns, and chai tip amounts across order lifecycles.
* **Stripe & Simulated Checkout**: Live Stripe checkout sessions with graceful local simulation fallback.

---

## 💻 Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend App** | React 18, Vite | Customer web portal (SPA) |
| **Admin Dashboard**| React 18, Vite | Kitchen OS, live KDS Kanban, reservations manager |
| **Styling** | Vanilla CSS (CSS3 Tokens) | Warm saffron & tandoori palette, glassmorphism, responsive |
| **Audio Engine** | Web Audio API | Procedural synthesizers for lucky wheel & Desi radio stations |
| **State Management** | React Context API | Cart calculation, veg filter, promo codes, rider tips |
| **Backend API** | Node.js, Express.js (ESM) | REST API, route controllers, error handling middleware |
| **Database** | MongoDB Atlas / Local JSON | Hybrid dual persistence architecture |
| **Auth & Security** | JWT, bcryptjs | Stateless auth & salted password hashing |
| **Testing** | Node.js Test Runner | 24 automated full-stack integration assertions |

---

## 📁 Project Architecture

```
food-delivery-app/
├── admin/                      # NaanStop Kitchen OS & Admin React App
│   ├── src/
│   │   ├── components/         # Navbar, Sidebar
│   │   ├── pages/
│   │   │   ├── Add/            # Add dish to catalog
│   │   │   ├── List/           # Search & manage dishes
│   │   │   ├── Orders/         # Order dispatch list
│   │   │   ├── Kanban/         # Live Kitchen Display System (KDS)
│   │   │   └── Reservations/   # Table reservations manager
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── vite.config.js
├── backend/                    # Express REST API Service
│   ├── config/
│   │   ├── db.js               # MongoDB Mongoose connector
│   │   └── store.js            # Dual storage & seed catalog (Desi menu)
│   ├── controllers/            # food, user, cart, order, reservation controllers
│   ├── middleware/             # JWT auth middleware
│   ├── models/                 # Mongoose schemas (Food, User, Order, Reservation)
│   ├── routes/                 # Express routers
│   ├── data/                   # Fallback database store (db.json)
│   ├── verify_features.mjs     # 24-test integration test runner
│   └── server.js               # Server entry point
├── frontend/                   # NaanStop Customer React App
│   ├── src/
│   │   ├── assets/             # Menu definitions, high-res Indian food photos
│   │   ├── components/
│   │   │   ├── Navbar/         # Logo, 🟢 Veg toggle, 🎡 Spin button, cart badge
│   │   │   ├── Header/         # Hero banner, CTAs
│   │   │   ├── ExploreMenu/    # Category slider
│   │   │   ├── FoodDisplay/    # Food grid, instant search, sort, veg alert banner
│   │   │   ├── FoodItem/       # FSSAI indicator, spice badge, bestseller ribbon
│   │   │   ├── FoodDetailModal/# Portion sizing, Desi spices, Jain prep, add-ons
│   │   │   ├── SpinWheel/      # Chakkar of Luck interactive modal & Web Audio sound
│   │   │   ├── MusicPlayer/    # NaanStop Diner Radio (Bollywood / Dhaba stations)
│   │   │   └── Footer/         # Brand story, address, contact
│   │   ├── context/            # StoreContext (cart, coupons, veg mode, rider tips)
│   │   ├── utils/
│   │   │   ├── musicEngine.js  # Web Audio sound synthesis engine
│   │   │   └── spinWheel.js    # Lucky wheel physics and audio fanfare
│   │   ├── pages/
│   │   │   ├── Home/           # Landing page
│   │   │   ├── Cart/           # Dynamic cart, Desi promo codes, spin CTA
│   │   │   ├── PlaceOrder/     # Address form, delivery/pickup/dine-in, Chai tip
│   │   │   ├── MyOrders/       # Live milestone stepper, Raju Bhaiya tracker, receipt
│   │   │   └── Reservations/   # Maharaja Diwan / Charpai courtyard table booking
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── vite.config.js
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 1. Clone the Repository
```bash
git clone https://github.com/DeekshaG96/food-delivery-app.git
cd food-delivery-app
```

### 2. Configure Environment Variables
Create a `.env` file in `backend/`:
```bash
cp backend/.env.example backend/.env
```

```env
PORT=4000
JWT_SECRET="naanstop_super_secret_jwt_key_2026"
MONGO_URI=""           # Optional: MongoDB Atlas URI (leave blank for local store)
STRIPE_SECRET_KEY=""   # Optional: Stripe Secret Key (leave blank for simulated checkout)
FRONTEND_URL="http://localhost:5173"
```

### 3. Install Dependencies
```bash
# Backend
cd backend && npm install

# Frontend Customer App
cd ../frontend && npm install

# Admin Panel
cd ../admin && npm install
```

### 4. Run Development Servers
```bash
# Terminal 1 — Backend (Port 4000)
npm --prefix backend run dev

# Terminal 2 — Customer Frontend (Port 5173)
npm --prefix frontend run dev

# Terminal 3 — Admin Panel (Port 5174)
npm --prefix admin run dev
```

Visit:
- **Customer Store**: [http://localhost:5173](http://localhost:5173)
- **Admin & KDS Dashboard**: [http://localhost:5174](http://localhost:5174)
- **Backend API**: [http://localhost:4000](http://localhost:4000)

---

## 📡 API Documentation

### Table Reservations (`/api/reservation`)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/reservation/book` | Book a table reservation (generates `RES-xxxx`) | No |
| `GET` | `/api/reservation/list` | Retrieve all reservations for admin view | No |
| `GET` | `/api/reservation/user?email=...` | Retrieve reservations for a specific user | No |
| `POST` | `/api/reservation/status` | Update reservation status (`Confirmed`, `Seated`, `Cancelled`) | No |

### Orders & Fulfillment (`/api/order`)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/order/place` | Place an order (attaches Raju Bhaiya rider profile & chai tip) | Token |
| `POST` | `/api/order/verify` | Verify payment status (Stripe or Simulated) | No |
| `POST` | `/api/order/userorders` | Fetch orders placed by authenticated user | Token |
| `GET` | `/api/order/list` | Fetch all orders for admin monitor & KDS Kanban | No |
| `POST` | `/api/order/status` | Update order stage (`Food Processing`, `Out for delivery`, `Delivered`)| No |

### Food & Catalog (`/api/food`)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/food/list` | Retrieve complete Desi menu catalog | No |
| `POST` | `/api/food/add` | Upload image and create new dish item | No |
| `POST` | `/api/food/remove` | Delete dish item from catalog | No |

---

## 🧪 Testing & Verification

Run the automated integration test suite:

```bash
cd backend
node verify_features.mjs
```

### Verified Scenarios (24/24 Passing)
- [x] **Table Booking**: Creation, unique `RES-xxxx` code generation, and initial `Confirmed` status.
- [x] **Admin Reservation Management**: Full listing, seating area retention, and status transitions to `Seated`.
- [x] **Customer Reservation Lookup**: Filter reservations by customer email.
- [x] **Store Pickup Fulfillment**: Placement with portion sizes, add-ons, notes, and $0 fee.
- [x] **Dine-In Table Fulfillment**: Placement with table assignment (`Table 4`), portion size, and cooking notes.
- [x] **KDS Kanban Progression**: Retrieval of order types and progression from `New Orders` ➔ `In Kitchen` ➔ `Ready` ➔ `Completed`.

---

## 🛡️ Production Build

Both the Customer Store and the Admin Dashboard compile cleanly with **0 errors**:

```bash
# Customer Frontend Build
npm --prefix frontend run build

# Kitchen OS Admin Build
npm --prefix admin run build
```

---

## 💖 Acknowledgements

- [KitchenAsty](https://github.com/mighty840/kitchenasty) — Self-hosted table reservations and kitchen display system architecture.
- [delivery_app](https://github.com/CaioQuirinoMedeiros/delivery_app) — Portion sizing, add-on customization, and itemized receipt model.
- [GreatStack](https://www.youtube.com/@GreatStackDev) — Full-stack MERN food delivery foundation.
- [Unsplash](https://unsplash.com/) — High-definition Indian food imagery.

---

<div align="center">
  <sub>Built with ❤️ by Deeksha Ganesh • Star ⭐ this repository if you loved the NaanStop experience!</sub>
</div>
