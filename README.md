<div align="center">

# 🍅 Tomato — Full-Stack Food Delivery & Restaurant Management Platform

An enterprise-ready, full-stack food delivery, table reservation, and kitchen operations platform built with **React 18 (Vite)**, **Node.js**, **Express**, and **Modern Vanilla CSS**.

[![React](https://img.shields.io/badge/Frontend-React%2018%20(Vite)-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2F%20Express-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![JavaScript](https://img.shields.io/badge/Language-JavaScript%20(ESM)-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen)](https://github.com/DeekshaG96/food-delivery-app)
[![Tests](https://img.shields.io/badge/Tests-24%2F24%20Passing-success)](https://github.com/DeekshaG96/food-delivery-app)

<p align="center">
  <a href="#-key-features">Key Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-project-architecture">Architecture</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-api-documentation">API Docs</a> •
  <a href="#-testing--verification">Testing</a> •
  <a href="#-credits--acknowledgements">Credits</a>
</p>

</div>

---

## 📖 Overview

**Tomato** is an end-to-end food service application that combines modern customer ordering experiences with real-time restaurant operational tooling. Inspired by and synthesizing best patterns from:
- **[KitchenAsty](https://github.com/mighty840/kitchenasty)**: Self-hosted restaurant table reservation booking and live Kitchen Display System (KDS) Kanban board.
- **[delivery_app](https://github.com/CaioQuirinoMedeiros/delivery_app)**: Portion sizing (`Regular`, `Medium`, `Large`), customizable add-ons, chef cooking notes, and itemized receipt breakdown.
- **GreatStack**: MERN food delivery core architecture.

---

## 🌟 Key Features

### 🛒 Customer Web Application (`frontend/` — Port 5173)
* **Responsive Visual Design**: Modern glassmorphism aesthetic, Outfit & Inter typography, responsive layouts, and fluid micro-interactions.
* **Menu Discovery**: 8 dynamic food categories (Salad, Rolls, Deserts, Sandwich, Cake, Pure Veg, Pasta, Noodles) with active category pills and real-time keyword search.
* **Portion Sizing & Customization**:
  * 3 portion sizes: **Regular**, **Medium (+$3.50)**, **Large/Family (+$7.00)**.
  * Spice levels, optional add-ons, and chef cooking notes.
  * Dynamic subtotal and cart price calculation reflecting selected portion deltas.
* **Multi-Channel Order Fulfillment**:
  * 🛵 **Delivery**: Standard address delivery with automatic delivery fee.
  * 🛍️ **Store Pickup**: Self-pickup option with dynamic **$0.00** delivery fee waiver.
  * 🍽️ **Dine-In Table Ordering**: Direct dine-in ordering with table number assignment.
* **Order Scheduling**:
  * ⚡ **ASAP**: Immediate kitchen preparation.
  * 🕒 **Schedule for Later**: Time-slot picker for scheduled delivery or pickup.
* **Table Reservation System**:
  * Party size selector (1 to 10+ guests), calendar date picker, and service time slots.
  * 4 ambiance seating options: *Indoor Cozy*, *Garden Patio*, *Rooftop Lounge*, *Chef's Booth*.
  * Instant reservation confirmation ticket with unique code (`RES-xxxx`).
  * "View My Bookings" personal reservation history.
* **Shopping Cart & Checkout**:
  * Real-time item quantity steppers, promo code discount engine (`WELCOME10`, `FREESHIP`), and delivery details validation.
  * Resilient payment integration (Stripe Checkout with instant local simulation fallback).
* **Live Order Tracking & Receipt Breakdown**:
  * Stage-by-stage status: 🟡 *Food Processing* ➔ 🔵 *Out for Delivery / Ready* ➔ 🟢 *Delivered*.
  * Dedicated **Receipt Breakdown Modal** showing item portion sizes, add-ons, cooking notes, and fulfillment method.
* **Tomato Diner Radio & Food Waiting Music Lounge** 🎧:
  * In-app audio player featuring 4 ambient kitchen & dining stations:
    * ☕ *Cozy Kitchen Lofi* (Mellow Rhodes piano & chillhop vinyl grooves)
    * 🍕 *Trattoria Acoustic Serenade* (Warm Mediterranean nylon guitar fingerpicking)
    * 🌧️ *Rainy Cafe Piano* (Nostalgic piano keys with soothing rain ambience)
    * 🌆 *Midnight Tokyo Ramen* (Neo-soul synth pads & late-night chillhop bass)
  * Procedural Web Audio API sound synthesis (100% offline, zero external audio dependencies).
  * Rotating vinyl record turntable animation, dancing equalizer soundwave visualizer, station selector, and volume slider.
  * Embedded directly on "My Orders" order tracking page and globally accessible via the navigation bar.

---

### 🛠️ Restaurant Admin Dashboard (`admin/` — Port 5174)
* **Live Kitchen Display System (KDS) Kanban**:
  * 4 live workflow columns: **New Orders** ➔ **In Kitchen** ➔ **Ready** ➔ **Completed**.
  * Urgency timers, order-type tags (`Delivery`, `Store Pickup`, `Dine-In`), and itemized preparation checklists.
  * One-click stage progression buttons (`Start Prep ➔`, `Ready for Pickup ➔`, `Complete ➔`).
* **Table Reservations Management**:
  * 4 real-time KPI metric cards: *Total Bookings*, *Confirmed*, *Seated*, *Today's Guests*.
  * Searchable reservations table with status filtering tabs (`All`, `Confirmed`, `Seated`, `Cancelled`).
  * One-click operational actions: `Seat Guests`, `Confirm`, and `Cancel`.
* **Menu Catalog Management**:
  * Add new dishes with image file upload, category selection, description, and base pricing.
  * Searchable menu catalog with quick deletion.
* **Order Dispatch Monitor**:
  * Full list view of all orders, delivery addresses, order timestamps, and manual status override controls.

---

### ⚡ Resilient Backend Service (`backend/` — Port 4000)
* **RESTful JSON API**: Clean route/controller architecture for foods, users, cart, orders, and reservations.
* **Dual Storage Engine**:
  * Production ready with **MongoDB Atlas** (`MONGO_URI`).
  * **Zero-Config Local Fallback**: When no MongoDB URI is supplied, automatically operates via a local file store (`data/db.json`), ensuring instant out-of-the-box local development.
* **JWT Authentication**: Secure user registration, login, token verification, and 1-click instant demo mode.
* **Stripe & Simulated Checkout**: Live Stripe payment sessions with automatic graceful fallback to instant simulation.

---

## 💻 Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend App** | React 18, Vite | Customer web portal (SPA) |
| **Admin Dashboard**| React 18, Vite | Restaurant operational management & KDS |
| **Styling** | Vanilla CSS (BEM / Custom Tokens) | Glassmorphism, animations, responsive design |
| **State Management** | React Context API | Dynamic cart calculations, user auth, toast notifications |
| **Backend Framework**| Node.js, Express.js (ESM) | REST API, route handlers, error middleware |
| **Database** | MongoDB Atlas / Local JSON Engine | Hybrid dual persistence layer |
| **Authentication** | JSON Web Tokens (JWT), bcryptjs | Secure password hashing and stateless auth |
| **Payments** | Stripe API | Online card payments & checkout sessions |
| **Testing** | Node.js Test Runner / Fetch Suite | 24 automated full-stack integration assertions |

---

## 📁 Project Architecture

```
food-delivery-app/
├── admin/                      # Restaurant Admin React Application
│   ├── src/
│   │   ├── components/         # Navbar, Sidebar
│   │   ├── pages/
│   │   │   ├── Add/            # Add dish to catalog
│   │   │   ├── List/           # Search & manage dishes
│   │   │   ├── Orders/         # Order dispatch list
│   │   │   ├── Kanban/         # Live Kitchen Display System (KDS)
│   │   │   └── Reservations/   # Table reservations manager
│   │   ├── App.jsx             # Admin route definitions
│   │   └── main.jsx
│   └── vite.config.js
├── backend/                    # Express REST API Service
│   ├── config/
│   │   ├── db.js               # MongoDB Mongoose connection
│   │   └── store.js            # Resilient data layer (Atlas + Local JSON fallback)
│   ├── controllers/            # food, user, cart, order, reservation controllers
│   ├── middleware/             # JWT auth middleware
│   ├── models/                 # Mongoose schemas (Food, User, Order, Reservation)
│   ├── routes/                 # Express routers
│   ├── data/                   # Seed & fallback database store (db.json)
│   ├── verify_features.mjs     # 24-test automated integration suite
│   └── server.js               # Express application entry point
├── frontend/                   # Customer React Application
│   ├── src/
│   │   ├── assets/             # Icons, illustrations, sample dishes
│   │   ├── components/         # Navbar, FoodDetailModal, FoodDisplay, Footer, etc.
│   │   ├── context/            # StoreContext (cart, portion deltas, user state)
│   │   ├── pages/
│   │   │   ├── Home/           # Hero, category browser, food item grid
│   │   │   ├── Cart/           # Dynamic cart, portion deltas, promo codes
│   │   │   ├── PlaceOrder/     # Fulfillment selector, scheduling, checkout form
│   │   │   ├── MyOrders/       # Order tracking & itemized receipt modal
│   │   │   ├── Reservations/   # Table booking page & booking history
│   │   │   └── Verify/         # Payment verification landing
│   │   ├── App.jsx             # Customer route definitions
│   │   └── main.jsx
│   └── vite.config.js
├── .gitignore                  # Git ignore rules
├── package.json                # Root package scripts
└── README.md                   # Project documentation
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
Create a `.env` file in `backend/` (or copy from `.env.example`):
```bash
cp backend/.env.example backend/.env
```

```env
PORT=4000
JWT_SECRET="food_delivery_super_secret_jwt_key_2026"
MONGO_URI=""           # Optional: MongoDB Atlas URI (leave blank for zero-config local storage)
STRIPE_SECRET_KEY=""   # Optional: Stripe Secret Key (leave blank for simulated checkout)
FRONTEND_URL="http://localhost:5173"
```

### 3. Install Dependencies
Run in three separate terminals (or from each directory):

```bash
# Terminal 1 — Backend
cd backend
npm install

# Terminal 2 — Customer Frontend
cd frontend
npm install

# Terminal 3 — Admin Panel
cd admin
npm install
```

### 4. Run Development Servers

| Application | Command | URL |
| :--- | :--- | :--- |
| **Backend API** | `npm --prefix backend run dev` | `http://localhost:4000` |
| **Customer App** | `npm --prefix frontend run dev` | `http://localhost:5173` |
| **Admin Dashboard** | `npm --prefix admin run dev` | `http://localhost:5174` |

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
| `POST` | `/api/order/place` | Place an order (supports delivery, pickup, dine-in, customizations) | Bearer / Token |
| `POST` | `/api/order/verify` | Verify payment status (Stripe or Simulated) | No |
| `POST` | `/api/order/userorders` | Fetch orders placed by authenticated user | Bearer / Token |
| `GET` | `/api/order/list` | Fetch all orders for admin monitor & KDS Kanban | No |
| `POST` | `/api/order/status` | Update order stage (`Food Processing`, `Out for delivery`, `Delivered`)| No |

### Food & Menu (`/api/food`)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/food/list` | Retrieve complete menu catalog | No |
| `POST` | `/api/food/add` | Upload image and create new dish item | No |
| `POST` | `/api/food/remove` | Delete dish item from catalog | No |

### User Authentication (`/api/user`)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/user/register` | Register new user account | No |
| `POST` | `/api/user/login` | Authenticate user & return JWT token | No |

---

## 🧪 Testing & Verification

The backend includes a comprehensive integration test suite verifying all major business flows:

```bash
cd backend
node verify_features.mjs
```

### Verified Scenarios (24/24 Passing)
- [x] **Table Booking**: Creation, payload validation, unique `RES-xxxx` code generation, and initial `Confirmed` status.
- [x] **Admin Reservation Management**: Full listing, seating area retention, and status transitions to `Seated`.
- [x] **Customer Reservation Lookup**: Filter reservations by customer email.
- [x] **Store Pickup Fulfillment**: Placement with portion sizes (Medium +$3.50), add-ons, notes, and $0 fee.
- [x] **Dine-In Table Fulfillment**: Placement with table assignment (`Table 4`), portion size (Large +$7.00), and cooking notes.
- [x] **KDS Kanban Progression**: Retrieval of order types and progression from `New Orders` ➔ `In Kitchen` ➔ `Ready` ➔ `Completed`.

---

## 🛡️ Production Build

To validate production builds:

```bash
# Customer Frontend
cd frontend
npm run build

# Restaurant Admin
cd admin
npm run build
```

Both bundles compile with **0 errors** using Vite's tree-shaking and minification pipeline.

---

## 🤝 Contributing

1. Fork the repository (`https://github.com/DeekshaG96/food-delivery-app/fork`)
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 💖 Acknowledgements & Inspirations

- [KitchenAsty](https://github.com/mighty840/kitchenasty) — Self-hosted table reservations and kitchen display system architecture.
- [delivery_app](https://github.com/CaioQuirinoMedeiros/delivery_app) — Portion sizing, add-on customization, and itemized receipt model.
- [GreatStack](https://www.youtube.com/@GreatStackDev) — Original full-stack food delivery tutorial foundation.
- [Unsplash](https://unsplash.com/) — Food imagery assets.

---

<div align="center">
  <sub>Built with ❤️ by Deeksha Ganesh • Star ⭐ this repository if you found it useful!</sub>
</div>
