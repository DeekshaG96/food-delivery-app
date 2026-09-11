# 🍅 Tomato - Full Stack Food Delivery & Restaurant Platform

A modern, full-stack, production-grade food delivery and restaurant management application built with **React 18 (Vite)**, **Node.js**, **Express**, and a dedicated **Restaurant Admin Panel**.

Enhanced with architectural and UI patterns inspired by [KitchenAsty](https://github.com/mighty840/kitchenasty) (self-hosted restaurant management, table reservations, and live Kitchen Display System) and [delivery_app](https://github.com/CaioQuirinoMedeiros/delivery_app) (portion sizing, add-on customization, and itemized receipt breakdown).

---

## 🌟 Key Features

### 🛒 Customer Web App (`frontend/` - Port 5173)
- **Visual Design**: Sleek glassmorphism, Outfit & Inter typography, responsive layouts, and rich micro-interactions.
- **Hero & Explore Menu**: Dynamic categories (Salad, Rolls, Deserts, Sandwich, Cake, Pure Veg, Pasta, Noodles) with instant keyword search.
- **Portion Sizing & Customization** *(from delivery_app)*:
  - Portion size selection cards (`Regular`, `Medium +$3.50`, `Large/Family +$7.00`).
  - Spice levels, customizable add-ons, and chef cooking notes.
  - Dynamic price recalculation across shopping cart and subtotal.
- **Order Fulfillment & Scheduling** *(from delivery_app & KitchenAsty)*:
  - 🛵 **Delivery**: Standard door-to-door delivery.
  - 🛍️ **Store Pickup**: Free pickup with $0 delivery charge applied dynamically.
  - 🍽️ **Dine-In Table Ordering**: Direct table ordering with table number.
  - 🕒 **Scheduling**: Choose between ⚡ *ASAP* or 🕒 *Schedule for Later* with dedicated time slots.
- **Table Reservation System** *(from KitchenAsty)*:
  - Online booking with party size, date, time slots, and special occasion tags.
  - 4 seating ambiances: *Indoor Cozy*, *Garden Patio*, *Rooftop Lounge*, and *Chef's Booth*.
  - Instant ticket confirmation with generated booking code (`RES-xxxx`).
  - "View My Bookings" customer reservation history.
- **Shopping Cart & Checkout**:
  - Itemized quantity controls, promo code engine (`WELCOME10`, `FREESHIP`), and full contact form.
  - Stripe integration with instant simulation mode for zero-configuration local testing.
- **Itemized Receipt Breakdown Modal** *(from delivery_app)*:
  - In "My Orders", view detailed receipts displaying portion sizes, add-ons, chef cooking notes, and fulfillment destination.

---

### 🛠️ Restaurant Admin Panel (`admin/` - Port 5174)
- **Kitchen Display System (KDS) Live Kanban** *(from KitchenAsty)*:
  - 4-column live workflow board: `New Orders` ➔ `In Kitchen` ➔ `Ready` ➔ `Completed`.
  - Urgency timers, fulfillment method tags, ticket item checklists, and 1-click status progression buttons.
- **Table Reservations Manager** *(from KitchenAsty)*:
  - 4 KPI metric cards: *Total Bookings*, *Confirmed*, *Seated*, and *Today's Guests*.
  - Searchable reservations table with status filtering (`All`, `Confirmed`, `Seated`, `Cancelled`).
  - One-click action controls to `Seat Guests`, `Confirm`, or `Cancel`.
- **Menu Catalog Management**:
  - Add dishes with photo upload, title, description, category, and price.
  - Searchable dish list with quick deletion.
- **Standard Orders Management**:
  - Real-time orders listing with address details and manual status overrides.

---

### ⚡ Backend API Service (`backend/` - Port 4000)
- **RESTful Endpoints**:
  - **Reservations**: `/api/reservation/book`, `/api/reservation/list`, `/api/reservation/user`, `/api/reservation/status`
  - **Orders & Fulfillment**: `/api/order/place`, `/api/order/verify`, `/api/order/userorders`, `/api/order/list`, `/api/order/status`
  - **Menu**: `/api/food/add`, `/api/food/list`, `/api/food/remove`
  - **User & Auth**: `/api/user/register`, `/api/user/login`
  - **Cart**: `/api/cart/add`, `/api/cart/remove`, `/api/cart/get`
- **Dual Data Layer**:
  - Supports MongoDB Atlas via `MONGO_URI`.
  - Resilient zero-config fallback to local file store (`data/db.json`) for instant out-of-the-box local operation.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- npm

### 2. Start Backend API (Port 4000)
```bash
cd backend
npm install
npm run dev
```

### 3. Start Customer Web App (Port 5173)
```bash
cd frontend
npm install
npm run dev
```

### 4. Start Restaurant Admin (Port 5174)
```bash
cd admin
npm install
npm run dev
```

---

## 🧪 Testing & Verification

Run the automated full-stack integration test suite:
```bash
cd backend
node verify_features.mjs
```
*Validates 24/24 tests covering table reservation creation, booking code generation, status updates, fulfillment methods, portion sizing, cooking notes, and KDS Kanban transitions.*

---

## 🔑 Environment Variables (`backend/.env`)

```env
PORT=4000
JWT_SECRET="food_delivery_super_secret_jwt_key_2026"
MONGO_URI="" # Optional: MongoDB Atlas URI (leave empty for local JSON storage mode)
STRIPE_SECRET_KEY="" # Optional: Stripe Secret Key (leave empty for simulated checkout mode)
FRONTEND_URL="http://localhost:5173"
```
