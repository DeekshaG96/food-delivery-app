import mongoose from "mongoose";

export let isMongoConnected = false;

export const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        console.log("ℹ️  No MONGO_URI provided in .env. Running in resilient local JSON storage mode.");
        return;
    }

    try {
        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 4000
        });
        isMongoConnected = true;
        console.log("✅ MongoDB Connected Successfully");
    } catch (error) {
        console.warn("⚠️  MongoDB connection failed, falling back to resilient local storage mode:", error.message);
        isMongoConnected = false;
    }
};
