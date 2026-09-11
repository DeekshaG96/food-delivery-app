import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dbStore } from "../config/store.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Add food item
export const addFood = async (req, res) => {
    try {
        let image_filename = req.file ? req.file.filename : "food_default.png";

        const { name, description, price, category } = req.body;
        if (!name || !price || !category) {
            return res.json({ success: false, message: "Missing required fields" });
        }

        const food = await dbStore.addFood({
            name,
            description: description || "Freshly prepared delicious dish.",
            price: Number(price),
            category,
            image: image_filename
        });

        res.json({ success: true, message: "Food Added Successfully", data: food });
    } catch (error) {
        console.error("Add food error:", error);
        res.json({ success: false, message: "Error adding food" });
    }
};

// All food list
export const listFood = async (req, res) => {
    try {
        const foods = await dbStore.getFoods();
        res.json({ success: true, data: foods });
    } catch (error) {
        console.error("List food error:", error);
        res.json({ success: false, message: "Error fetching food list" });
    }
};

// Remove food item
export const removeFood = async (req, res) => {
    try {
        const { id } = req.body;
        const food = await dbStore.getFoodById(id);
        if (!food) {
            return res.json({ success: false, message: "Food item not found" });
        }

        // Remove image if uploaded (don't delete if it's default starter asset)
        if (food.image && !food.image.startsWith("food_") && !food.image.startsWith("seed_")) {
            const filePath = path.join(__dirname, "../uploads", food.image);
            if (fs.existsSync(filePath)) {
                fs.unlink(filePath, () => {});
            }
        }

        await dbStore.removeFood(id);
        res.json({ success: true, message: "Food Removed" });
    } catch (error) {
        console.error("Remove food error:", error);
        res.json({ success: false, message: "Error removing food" });
    }
};
