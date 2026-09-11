import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";
import { dbStore } from "../config/store.js";

const JWT_SECRET = process.env.JWT_SECRET || "food_delivery_super_secret_jwt_key_2026";

const createToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET, { expiresIn: "7d" });
};

// Login user
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.json({ success: false, message: "Please provide email and password" });
        }

        const user = await dbStore.findUserByEmail(email);
        if (!user) {
            return res.json({ success: false, message: "User doesn't exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const token = createToken(user._id);
        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.json({ success: false, message: "Error logging in" });
    }
};

// Register user
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.json({ success: false, message: "Please fill all fields" });
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email address" });
        }

        // Validate strong password
        if (password.length < 6) {
            return res.json({ success: false, message: "Password must be at least 6 characters" });
        }

        // Check if user already exists
        const exists = await dbStore.findUserByEmail(email);
        if (exists) {
            return res.json({ success: false, message: "User already exists with this email" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await dbStore.createUser({
            name,
            email,
            password: hashedPassword,
            cartData: {}
        });

        const token = createToken(newUser._id);
        res.json({
            success: true,
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });
    } catch (error) {
        console.error("Register error:", error);
        res.json({ success: false, message: "Error registering user" });
    }
};
