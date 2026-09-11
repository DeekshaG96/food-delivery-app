import { dbStore } from "../config/store.js";

// Add items to user cart
export const addToCart = async (req, res) => {
    try {
        const { userId, itemId } = req.body;
        if (!userId || !itemId) {
            return res.json({ success: false, message: "Missing userId or itemId" });
        }

        const userData = await dbStore.findUserById(userId);
        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }

        let cartData = userData.cartData ? { ...userData.cartData } : {};
        if (!cartData[itemId]) {
            cartData[itemId] = 1;
        } else {
            cartData[itemId] += 1;
        }

        await dbStore.updateUserCart(userId, cartData);
        res.json({ success: true, message: "Added To Cart", cartData });
    } catch (error) {
        console.error("Add to cart error:", error);
        res.json({ success: false, message: "Error adding to cart" });
    }
};

// Remove items from user cart
export const removeFromCart = async (req, res) => {
    try {
        const { userId, itemId } = req.body;
        if (!userId || !itemId) {
            return res.json({ success: false, message: "Missing userId or itemId" });
        }

        const userData = await dbStore.findUserById(userId);
        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }

        let cartData = userData.cartData ? { ...userData.cartData } : {};
        if (cartData[itemId] > 0) {
            cartData[itemId] -= 1;
            if (cartData[itemId] === 0) {
                delete cartData[itemId];
            }
        }

        await dbStore.updateUserCart(userId, cartData);
        res.json({ success: true, message: "Removed From Cart", cartData });
    } catch (error) {
        console.error("Remove from cart error:", error);
        res.json({ success: false, message: "Error removing from cart" });
    }
};

// Fetch user cart data
export const getCart = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.json({ success: false, message: "Missing userId" });
        }

        const userData = await dbStore.findUserById(userId);
        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({ success: true, cartData: userData.cartData || {} });
    } catch (error) {
        console.error("Get cart error:", error);
        res.json({ success: false, message: "Error getting cart" });
    }
};
