import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { addFood, listFood, removeFood } from "../controllers/foodController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const foodRouter = express.Router();

// Image Storage Engine
const storage = multer.diskStorage({
    destination: path.join(__dirname, "../uploads"),
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}_${file.originalname.replace(/\s+/g, "_")}`);
    }
});

const upload = multer({ storage: storage });

foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/list", listFood);
foodRouter.post("/remove", removeFood);

export default foodRouter;
