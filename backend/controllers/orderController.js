import Stripe from "stripe";
import { dbStore } from "../config/store.js";

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

// Placing user order from frontend
export const placeOrder = async (req, res) => {
    const frontend_url = process.env.FRONTEND_URL || "http://localhost:5173";

    try {
        const { userId, items, amount, address, orderType, scheduledFor, tableNumber, pickupTime, riderTip } = req.body;
        if (!items || items.length === 0) {
            return res.json({ success: false, message: "Cart is empty" });
        }

        const newOrder = await dbStore.createOrder({
            userId,
            items,
            amount,
            address,
            orderType: orderType || "delivery",
            scheduledFor: scheduledFor || "ASAP",
            tableNumber: tableNumber || null,
            pickupTime: pickupTime || null,
            riderTip: Number(riderTip) || 0,
            payment: false,
            status: "Food Processing"
        });

        // Clear user's cart in DB
        await dbStore.updateUserCart(userId, {});

        // If valid Stripe Secret Key is present, create Stripe Checkout Session
        if (stripe && process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes("your_key")) {
            const line_items = items.map((item) => ({
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.name
                    },
                    unit_amount: Math.round(item.price * 100)
                },
                quantity: item.quantity
            }));

            line_items.push({
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: "Delivery Charges"
                    },
                    unit_amount: 2 * 100
                },
                quantity: 1
            });

            const session = await stripe.checkout.sessions.create({
                line_items,
                mode: "payment",
                success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
                cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`
            });

            return res.json({ success: true, session_url: session.url, orderId: newOrder._id });
        }

        // Seamless Dev / Simulated Checkout Mode
        // Returns direct instant verification url for testing without requiring Stripe API account setup
        const simulatedUrl = `${frontend_url}/verify?success=true&orderId=${newOrder._id}&mode=simulated`;
        res.json({
            success: true,
            session_url: simulatedUrl,
            orderId: newOrder._id,
            message: "Order placed in instant checkout mode"
        });
    } catch (error) {
        console.error("Place order error:", error);
        res.json({ success: false, message: "Error placing order" });
    }
};

// Verifying order payment
export const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success === "true" || success === true) {
            await dbStore.updateOrderPayment(orderId, true);
            res.json({ success: true, message: "Payment Verified & Order Confirmed" });
        } else {
            await dbStore.deleteOrder(orderId);
            res.json({ success: false, message: "Payment Failed, Order Cancelled" });
        }
    } catch (error) {
        console.error("Verify order error:", error);
        res.json({ success: false, message: "Error verifying order" });
    }
};

// User orders for frontend
export const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        const orders = await dbStore.getUserOrders(userId);
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error("User orders error:", error);
        res.json({ success: false, message: "Error fetching user orders" });
    }
};

// Listing orders for admin panel
export const listOrders = async (req, res) => {
    try {
        const orders = await dbStore.getAllOrders();
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error("List orders error:", error);
        res.json({ success: false, message: "Error fetching admin orders" });
    }
};

// API for updating order status (admin)
export const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        await dbStore.updateOrderStatus(orderId, status);
        res.json({ success: true, message: "Status Updated Successfully" });
    } catch (error) {
        console.error("Update status error:", error);
        res.json({ success: false, message: "Error updating order status" });
    }
};
