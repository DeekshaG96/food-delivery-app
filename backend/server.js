import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import { dbStore } from "./config/store.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import reservationRouter from "./routes/reservationRoute.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// app config
const app = express();
const port = process.env.PORT || 4000;

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// middlewares
app.use(express.json());
app.use(cors());

// DB connection
connectDB().then(() => {
    dbStore.seedMongoIfEmpty();
});

// api endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static(uploadsDir));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/reservation", reservationRouter);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "NaanStop Food Delivery API is running successfully! 🌶️",
        endpoints: {
            foods: "/api/food/list",
            userRegister: "/api/user/register",
            userLogin: "/api/user/login",
            cart: "/api/cart/get",
            orders: "/api/order/list"
        }
    });
});

app.listen(port, () => {
    console.log(`🚀 Server started on http://localhost:${port}`);
});
