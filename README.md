# NaanStop Food Delivery

NaanStop is a full-stack food delivery demo for Indian food ordering, table reservations, and kitchen operations.

It includes:

- Customer web app with menu browsing, cart, checkout, reservations, and order tracking
- Admin dashboard with orders, reservations, menu management, and a kitchen Kanban board
- Express API with JWT authentication, MongoDB Atlas support, and local JSON fallback storage
- Capacitor Android project for private testing and hackathon demos

## Live Demo

- Customer app: https://naanstop-customer.vercel.app
- Admin dashboard: https://naanstop-admin-khaki.vercel.app
- Backend API: https://naanstop-backend-weoh.onrender.com

The demo backend runs on Render's free plan and may take a few seconds to wake after inactivity.

## Tech Stack

- React 18 and Vite
- Node.js and Express
- MongoDB Atlas with local JSON fallback
- JWT and bcryptjs authentication
- Capacitor Android
- Vercel for the web apps
- Render for the API

## Project Structure

```text
food-delivery-app/
├── frontend/    Customer React app and Capacitor Android project
├── admin/       Kitchen OS React app
├── backend/     Express API and persistence layer
├── archive/     Food image dataset and source material
└── README.md
```

## Requirements

- Node.js 18 or newer
- npm 9 or newer
- MongoDB Atlas account for hosted persistence (optional for local development)

## Local Setup

Install dependencies:

```bash
npm install
npm --prefix backend install
npm --prefix frontend install
npm --prefix admin install
```

Create `backend/.env`:

```env
PORT=4000
JWT_SECRET="replace_with_a_long_random_secret"
MONGO_URI=""
STRIPE_SECRET_KEY=""
FRONTEND_URL="http://localhost:5173"
```

`MONGO_URI` is optional. When it is empty, the backend uses `backend/data/db.json`. `STRIPE_SECRET_KEY` is also optional; an empty value enables simulated checkout.

Do not commit `.env` files or share their contents.

## Run Locally

Start each service in a separate terminal:

```bash
npm run server
npm run client
npm run admin
```

Open:

- Customer app: http://localhost:5173
- Admin dashboard: http://localhost:5174
- API: http://localhost:4000

## Environment Variables

### Backend

| Variable | Purpose |
| --- | --- |
| `PORT` | API port; Render supplies its own port in deployment |
| `JWT_SECRET` | Secret used to sign login tokens |
| `MONGO_URI` | MongoDB Atlas connection string; optional locally |
| `STRIPE_SECRET_KEY` | Stripe secret key; optional for simulated checkout |
| `FRONTEND_URL` | Customer app URL used for checkout redirects |

### Frontend and Admin

```env
VITE_BACKEND_URL=https://naanstop-backend-weoh.onrender.com
```

The admin app can also use:

```env
VITE_FRONTEND_URL=https://naanstop-customer.vercel.app
```

## API Overview

| Area | Main endpoints |
| --- | --- |
| Food | `GET /api/food/list`, `POST /api/food/add`, `POST /api/food/remove` |
| Users | `POST /api/user/register`, `POST /api/user/login` |
| Cart | `POST /api/cart/add`, `POST /api/cart/remove`, `POST /api/cart/get` |
| Orders | `POST /api/order/place`, `POST /api/order/userorders`, `GET /api/order/list`, `POST /api/order/status` |
| Reservations | `POST /api/reservation/book`, `GET /api/reservation/list`, `POST /api/reservation/status` |

## Testing and Builds

Run the backend integration suite:

```bash
node backend/verify_features.mjs
```

Build both web apps:

```bash
npm --prefix frontend run build
npm --prefix admin run build
```

The integration suite covers reservations, customized orders, pickup and dine-in flows, and kitchen order-stage transitions.

## Deployment

### Backend on Render

Use these settings:

```text
Root directory: backend
Build command: npm install
Start command: node server.js
```

Set `JWT_SECRET`, `MONGO_URI`, `STRIPE_SECRET_KEY` if needed, and `FRONTEND_URL` in Render's environment settings.

### Customer app on Vercel

```text
Root directory: frontend
Build command: npm run build
Output directory: dist
```

Set `VITE_BACKEND_URL` to the Render backend URL.

### Admin app on Vercel

```text
Root directory: admin
Build command: npm run build
Output directory: dist
```

Set `VITE_BACKEND_URL` and `VITE_FRONTEND_URL`.

## Android Demo

The customer app has a Capacitor project in `frontend/android`.

```bash
cd frontend
npm run build
npx cap sync android
npx cap open android
```

In Android Studio, use **Build > Generate Signed Bundle / APK**, choose **Android App Bundle**, and select the release variant. Keep the signing keystore and passwords outside the repository.

The Android app is intended for private testing and hackathon demos. Configure Stripe, monitoring, push notifications, and stronger production security before accepting real customer traffic.

## License

This project is provided for learning, portfolio, and hackathon use.
