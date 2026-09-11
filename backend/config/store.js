import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { isMongoConnected } from "./db.js";
import foodModel from "../models/foodModel.js";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, "../data/db.json");

// Ensure data folder exists
const dataDir = path.join(__dirname, "../data");
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Initial food seed items with high-quality descriptions and categories
export const initialFoodList = [
    {
        name: "Greek Salad",
        image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80",
        price: 12,
        description: "Fresh Mediterranean salad with crisp romaine, kalamata olives, feta cheese, and red onions.",
        category: "Salad"
    },
    {
        name: "Veg Salad",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80",
        price: 10,
        description: "Farm-fresh vegetables, crunchy bell peppers, cucumbers, and a zesty lemon-herb vinaigrette.",
        category: "Salad"
    },
    {
        name: "Clover Salad",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80",
        price: 14,
        description: "Tender microgreens, toasted pumpkin seeds, avocado slices, and honey mustard dressing.",
        category: "Salad"
    },
    {
        name: "Chicken Salad",
        image: "https://images.unsplash.com/photo-1547496502-affa22d38842?w=600&auto=format&fit=crop&q=80",
        price: 18,
        description: "Grilled herb chicken breast over mixed greens, cherry tomatoes, and shaved parmesan.",
        category: "Salad"
    },
    {
        name: "Lasagna Rolls",
        image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&auto=format&fit=crop&q=80",
        price: 16,
        description: "Al dente pasta sheets rolled with ricotta, mozzarella, fresh basil, and marinara sauce.",
        category: "Rolls"
    },
    {
        name: "Peri Peri Rolls",
        image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80",
        price: 14,
        description: "Spicy peri peri marinated vegetables and paneer wrapped in warm flaky flatbread.",
        category: "Rolls"
    },
    {
        name: "Chicken Rolls",
        image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80",
        price: 19,
        description: "Tender tandoori chicken tikka rolled with mint chutney, crisp slaw, and pickled onions.",
        category: "Rolls"
    },
    {
        name: "Veggie Spring Rolls",
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80",
        price: 11,
        description: "Golden crispy fried rolls stuffed with seasoned cabbage, carrots, and sweet chili dip.",
        category: "Rolls"
    },
    {
        name: "Ripple Ice Cream",
        image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop&q=80",
        price: 9,
        description: "Velvety vanilla bean gelato swirled with rich dark raspberry reduction.",
        category: "Deserts"
    },
    {
        name: "Fruit Ice Cream",
        image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=600&auto=format&fit=crop&q=80",
        price: 11,
        description: "Handcrafted ice cream blended with passion fruit, mango chunks, and strawberry coulis.",
        category: "Deserts"
    },
    {
        name: "Jar Ice Cream",
        image: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=600&auto=format&fit=crop&q=80",
        price: 10,
        description: "Layered Belgian chocolate ganache, crunchy biscuit crumble, and hazelnut cream in a mason jar.",
        category: "Deserts"
    },
    {
        name: "Vanilla Ice Cream",
        image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=600&auto=format&fit=crop&q=80",
        price: 8,
        description: "Classic Madagascar double cream vanilla with roasted almond flakes and caramel drizzle.",
        category: "Deserts"
    },
    {
        name: "Chicken Sandwich",
        image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80",
        price: 15,
        description: "Buttermilk fried chicken breast, chipotle aioli, crunchy pickles, on toasted brioche.",
        category: "Sandwich"
    },
    {
        name: "Vegan Sandwich",
        image: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&auto=format&fit=crop&q=80",
        price: 13,
        description: "Avocado smash, heirloom tomatoes, roasted red peppers, and hummus on sourdough.",
        category: "Sandwich"
    },
    {
        name: "Grilled Sandwich",
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80",
        price: 12,
        description: "Triple melted cheddar, smoked provolone, and caramelized onions on golden sourdough.",
        category: "Sandwich"
    },
    {
        name: "Bread Sandwich",
        image: "https://images.unsplash.com/photo-1553909489-cd47e0907980?w=600&auto=format&fit=crop&q=80",
        price: 14,
        description: "Smoked turkey, crispy bacon, aged swiss, butter lettuce, and garlic dijonnaise.",
        category: "Sandwich"
    },
    {
        name: "Cup Cake",
        image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=600&auto=format&fit=crop&q=80",
        price: 7,
        description: "Moist red velvet cupcake topped with smooth vanilla cream cheese frosting.",
        category: "Cake"
    },
    {
        name: "Vegan Cake",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80",
        price: 16,
        description: "Rich dark chocolate fudge cake made with pure cocoa and coconut cream.",
        category: "Cake"
    },
    {
        name: "Butterscotch Cake",
        image: "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=600&auto=format&fit=crop&q=80",
        price: 20,
        description: "Fluffy golden sponge layered with crunchy butterscotch praline and caramel glaze.",
        category: "Cake"
    },
    {
        name: "Sliced Cake",
        image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&auto=format&fit=crop&q=80",
        price: 9,
        description: "New York style baked cheesecake served with wild berry compote.",
        category: "Cake"
    },
    {
        name: "Garlic Mushroom",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80",
        price: 14,
        description: "Button mushrooms sautéed in garlic herb butter, white wine, and fresh parsley.",
        category: "Pure Veg"
    },
    {
        name: "Fried Cauliflower",
        image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop&q=80",
        price: 13,
        description: "Crisp battered cauliflower florets tossed in honey-sesame sriracha glaze.",
        category: "Pure Veg"
    },
    {
        name: "Mix Veg Pulao",
        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80",
        price: 15,
        description: "Fragrant basmati rice cooked with whole spices, garden vegetables, and saffron.",
        category: "Pure Veg"
    },
    {
        name: "Rice Zucchini",
        image: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=600&auto=format&fit=crop&q=80",
        price: 14,
        description: "Creamy risotto with charred zucchini ribbons, lemon zest, and toasted pine nuts.",
        category: "Pure Veg"
    },
    {
        name: "Cheese Pasta",
        image: "https://images.unsplash.com/photo-1621996346565-e3d5d6281699?w=600&auto=format&fit=crop&q=80",
        price: 17,
        description: "Rigatoni smothered in a rich four-cheese truffle sauce with a golden crumb crust.",
        category: "Pasta"
    },
    {
        name: "Tomato Pasta",
        image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&auto=format&fit=crop&q=80",
        price: 15,
        description: "Penne tossed in San Marzano tomato pomodoro sauce, fresh basil, and extra virgin olive oil.",
        category: "Pasta"
    },
    {
        name: "Creamy Pasta",
        image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=600&auto=format&fit=crop&q=80",
        price: 18,
        description: "Fettuccine in garlic-parmesan cream sauce with sautéed forest mushrooms.",
        category: "Pasta"
    },
    {
        name: "Chicken Pasta",
        image: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=600&auto=format&fit=crop&q=80",
        price: 20,
        description: "Grilled Cajun spiced chicken with penne in a sun-dried tomato cream sauce.",
        category: "Pasta"
    },
    {
        name: "Butter Noodles",
        image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80",
        price: 13,
        description: "Hand-pulled egg noodles tossed in browned butter, chives, and cracked black pepper.",
        category: "Noodles"
    },
    {
        name: "Veg Noodles",
        image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80",
        price: 14,
        description: "Wok-tossed noodles with shredded cabbage, bell peppers, scallions, and soy-ginger glaze.",
        category: "Noodles"
    },
    {
        name: "Somen Noodles",
        image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop&q=80",
        price: 16,
        description: "Chilled Japanese somen noodles served with savory dipping dashi broth and ginger.",
        category: "Noodles"
    },
    {
        name: "Cooked Noodles",
        image: "https://images.unsplash.com/photo-1552611052-33e04de081de?w=600&auto=format&fit=crop&q=80",
        price: 17,
        description: "Spicy garlic chili noodles topped with soft-boiled ramen egg and toasted sesame.",
        category: "Noodles"
    }
];

const sampleReservations = [
    {
        _id: "res_sample_1",
        bookingCode: "RES-8421",
        name: "Sophia Martinez",
        email: "alex.demo@tomato.com",
        phone: "+1-555-0144",
        guests: 4,
        date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        timeSlot: "7:00 PM",
        seatingArea: "Garden Patio",
        specialOccasion: "Anniversary",
        specialRequests: "Window/garden side table if possible please.",
        status: "Confirmed",
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
        _id: "res_sample_2",
        bookingCode: "RES-5912",
        name: "David Chen",
        email: "david.c@example.com",
        phone: "+1-555-0182",
        guests: 2,
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        timeSlot: "8:30 PM",
        seatingArea: "Rooftop Lounge",
        specialOccasion: "Date Night",
        specialRequests: "Quiet corner table.",
        status: "Confirmed",
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
    }
];

function readDB() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const raw = fs.readFileSync(DATA_FILE, "utf-8");
            const parsed = JSON.parse(raw);
            if (!parsed.reservations || parsed.reservations.length === 0) {
                parsed.reservations = sampleReservations;
                writeDB(parsed);
            }
            return parsed;
        }
    } catch (e) {
        console.error("Error reading db.json, reinitializing:", e.message);
    }
    const initial = {
        foods: initialFoodList.map((item, idx) => ({
            _id: "food_" + (idx + 1),
            ...item
        })),
        users: [],
        orders: [],
        reservations: sampleReservations
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2));
    return initial;
}

function writeDB(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export const dbStore = {
    // Foods
    getFoods: async () => {
        if (isMongoConnected) {
            return await foodModel.find({});
        }
        const db = readDB();
        return db.foods;
    },
    addFood: async (foodData) => {
        if (isMongoConnected) {
            const food = new foodModel(foodData);
            return await food.save();
        }
        const db = readDB();
        const newFood = {
            _id: "food_" + Date.now(),
            ...foodData
        };
        db.foods.push(newFood);
        writeDB(db);
        return newFood;
    },
    removeFood: async (id) => {
        if (isMongoConnected) {
            return await foodModel.findByIdAndDelete(id);
        }
        const db = readDB();
        const index = db.foods.findIndex(f => f._id === id);
        if (index !== -1) {
            const removed = db.foods.splice(index, 1)[0];
            writeDB(db);
            return removed;
        }
        return null;
    },
    getFoodById: async (id) => {
        if (isMongoConnected) {
            return await foodModel.findById(id);
        }
        const db = readDB();
        return db.foods.find(f => f._id === id) || null;
    },

    // Users
    findUserByEmail: async (email) => {
        if (isMongoConnected) {
            return await userModel.findOne({ email });
        }
        const db = readDB();
        return db.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
    },
    findUserById: async (id) => {
        if (isMongoConnected) {
            return await userModel.findById(id);
        }
        const db = readDB();
        return db.users.find(u => u._id === id) || null;
    },
    createUser: async (userData) => {
        if (isMongoConnected) {
            const user = new userModel(userData);
            return await user.save();
        }
        const db = readDB();
        const newUser = {
            _id: "user_" + Date.now(),
            cartData: {},
            ...userData
        };
        db.users.push(newUser);
        writeDB(db);
        return newUser;
    },
    updateUserCart: async (userId, cartData) => {
        if (isMongoConnected) {
            return await userModel.findByIdAndUpdate(userId, { cartData }, { new: true });
        }
        const db = readDB();
        const user = db.users.find(u => u._id === userId);
        if (user) {
            user.cartData = cartData;
            writeDB(db);
            return user;
        }
        return null;
    },

    // Orders
    createOrder: async (orderData) => {
        if (isMongoConnected) {
            const order = new orderModel(orderData);
            return await order.save();
        }
        const db = readDB();
        const newOrder = {
            _id: "order_" + Date.now(),
            date: new Date().toISOString(),
            status: "Food Processing",
            payment: false,
            orderType: orderData.orderType || "delivery",
            scheduledFor: orderData.scheduledFor || "ASAP",
            tableNumber: orderData.tableNumber || "",
            pickupTime: orderData.pickupTime || "",
            ...orderData
        };
        db.orders.push(newOrder);
        writeDB(db);
        return newOrder;
    },
    updateOrderStatus: async (orderId, status) => {
        if (isMongoConnected) {
            return await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
        }
        const db = readDB();
        const order = db.orders.find(o => o._id === orderId);
        if (order) {
            order.status = status;
            writeDB(db);
            return order;
        }
        return null;
    },
    updateOrderPayment: async (orderId, payment) => {
        if (isMongoConnected) {
            return await orderModel.findByIdAndUpdate(orderId, { payment }, { new: true });
        }
        const db = readDB();
        const order = db.orders.find(o => o._id === orderId);
        if (order) {
            order.payment = payment;
            writeDB(db);
            return order;
        }
        return null;
    },
    getUserOrders: async (userId) => {
        if (isMongoConnected) {
            return await orderModel.find({ userId }).sort({ date: -1 });
        }
        const db = readDB();
        return db.orders.filter(o => o.userId === userId).reverse();
    },
    getAllOrders: async () => {
        if (isMongoConnected) {
            return await orderModel.find({}).sort({ date: -1 });
        }
        const db = readDB();
        return [...db.orders].reverse();
    },
    deleteOrder: async (orderId) => {
        if (isMongoConnected) {
            return await orderModel.findByIdAndDelete(orderId);
        }
        const db = readDB();
        const index = db.orders.findIndex(o => o._id === orderId);
        if (index !== -1) {
            const removed = db.orders.splice(index, 1)[0];
            writeDB(db);
            return removed;
        }
        return null;
    },

    // Reservations (KitchenAsty feature)
    createReservation: async (resData) => {
        const db = readDB();
        db.reservations = db.reservations || [];
        const newRes = {
            _id: "res_" + Date.now(),
            bookingCode: "RES-" + Math.floor(1000 + Math.random() * 9000),
            createdAt: new Date().toISOString(),
            status: "Confirmed",
            ...resData
        };
        db.reservations.push(newRes);
        writeDB(db);
        return newRes;
    },
    getAllReservations: async () => {
        const db = readDB();
        db.reservations = db.reservations || [];
        return [...db.reservations].reverse();
    },
    getUserReservations: async (email) => {
        const db = readDB();
        db.reservations = db.reservations || [];
        if (!email) return [];
        return db.reservations.filter(r => r.email?.toLowerCase() === email.toLowerCase()).reverse();
    },
    updateReservationStatus: async (resId, status) => {
        const db = readDB();
        db.reservations = db.reservations || [];
        const res = db.reservations.find(r => r._id === resId);
        if (res) {
            res.status = status;
            writeDB(db);
            return res;
        }
        return null;
    },

    // Seeding mongo if connected and empty
    seedMongoIfEmpty: async () => {
        if (isMongoConnected) {
            const count = await foodModel.countDocuments();
            if (count === 0) {
                console.log("Seeding MongoDB with initial food items...");
                await foodModel.insertMany(initialFoodList);
                console.log("MongoDB seeded successfully!");
            }
        }
    }
};

// Initialize file on module load
readDB();
