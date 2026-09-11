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

// Authentic Desi Canteen & Modern Indian Culinary Seed Items
export const initialFoodList = [
    // Biryani & Rice
    {
        name: "Dum Hyderabadi Chicken Biryani",
        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80",
        price: 18,
        description: "Fragrant basmati rice slow-cooked on dum with marinated chicken, saffron, mint, and fried onions. Served with spiced salan & burani raita.",
        category: "Biryani",
        isVeg: false,
        spiceDefault: "Desi Teekha",
        bestseller: true,
        jainAvailable: false
    },
    {
        name: "Lucknowi Shahi Paneer Biryani",
        image: "https://images.unsplash.com/photo-1642821373181-696a54913e9a?w=600&auto=format&fit=crop&q=80",
        price: 16,
        description: "Royal Awadhi style dum biryani layered with marinated Malai Paneer cubes, caramelized onions, kewra water, and rose petals.",
        category: "Biryani",
        isVeg: true,
        spiceDefault: "Medium",
        bestseller: true,
        jainAvailable: true
    },
    {
        name: "Kolkata Mutton Biryani with Aloo",
        image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&auto=format&fit=crop&q=80",
        price: 22,
        description: "Subtly spiced royal biryani with succulent bone-in goat meat, golden saffron potatoes, and boiled egg.",
        category: "Biryani",
        isVeg: false,
        spiceDefault: "Medium",
        bestseller: false,
        jainAvailable: false
    },
    {
        name: "Subz Tarkari Dum Biryani",
        image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600&auto=format&fit=crop&q=80",
        price: 14,
        description: "Garden fresh carrots, baby potatoes, green peas, and French beans infused with whole spices and saffron basmati rice.",
        category: "Biryani",
        isVeg: true,
        spiceDefault: "Mild",
        bestseller: false,
        jainAvailable: true
    },

    // Royal Curries
    {
        name: "Old Delhi Butter Chicken (Murgh Makhani)",
        image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop&q=80",
        price: 19,
        description: "Tender tandoori chicken simmered in a velvety, satin-smooth tomato makhani gravy enriched with butter and dried fenugreek.",
        category: "Curries",
        isVeg: false,
        spiceDefault: "Medium",
        bestseller: true,
        jainAvailable: false
    },
    {
        name: "Paneer Tikka Butter Masala",
        image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80",
        price: 16,
        description: "Charcoal-grilled cottage cheese cubes cooked in a spiced tomato-cashew sauce with bell peppers and aromatic garam masala.",
        category: "Curries",
        isVeg: true,
        spiceDefault: "Medium",
        bestseller: true,
        jainAvailable: true
    },
    {
        name: "Dhaba Style Dal Makhani (Slow-Cooked)",
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80",
        price: 14,
        description: "Black lentils slow-cooked overnight over live charcoal, finished with churned white makhan, fresh cream, and smoky tadka.",
        category: "Curries",
        isVeg: true,
        spiceDefault: "Mild",
        bestseller: true,
        jainAvailable: true
    },
    {
        name: "Kadhai Chicken Lazeez",
        image: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=600&auto=format&fit=crop&q=80",
        price: 18,
        description: "Boneless chicken tossed in an iron kadhai with freshly pounded coriander seeds, Kashmiri chilies, and crunchy capsicum.",
        category: "Curries",
        isVeg: false,
        spiceDefault: "Desi Teekha",
        bestseller: false,
        jainAvailable: false
    },
    {
        name: "Palak Paneer with Desi Ghee Tadka",
        image: "https://images.unsplash.com/photo-1589647363585-f4a7d3877b10?w=600&auto=format&fit=crop&q=80",
        price: 15,
        description: "Fresh baby spinach pureed with garlic and green chilies, topped with soft paneer cubes and a tempering of pure cumin ghee.",
        category: "Curries",
        isVeg: true,
        spiceDefault: "Medium",
        bestseller: false,
        jainAvailable: true
    },
    {
        name: "Amritsari Pindi Chole",
        image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80",
        price: 13,
        description: "Dark, rustic chickpeas boiled with whole black tea leaves, tossed in anardana (pomegranate seed) masala and ginger juliennes.",
        category: "Curries",
        isVeg: true,
        spiceDefault: "Desi Teekha",
        bestseller: false,
        jainAvailable: true
    },

    // Tandoor & Kebabs
    {
        name: "Angaara Tandoori Chicken Tikka",
        image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80",
        price: 17,
        description: "Juicy chicken thighs marinated in hung curd, Kashmiri deghi mirch, and mustard oil, roasted to smoky perfection in clay oven.",
        category: "Tandoor",
        isVeg: false,
        spiceDefault: "Desi Teekha",
        bestseller: true,
        jainAvailable: false
    },
    {
        name: "Tandoori Malai Paneer Tikka",
        image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&auto=format&fit=crop&q=80",
        price: 15,
        description: "Soft paneer cubes marinated in rich cardamom cream, cashew paste, and mild white pepper, grilled over glowing charcoal.",
        category: "Tandoor",
        isVeg: true,
        spiceDefault: "Mild",
        bestseller: true,
        jainAvailable: true
    },
    {
        name: "Bhatti Murgh Tikka (Smoky Fiery)",
        image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80",
        price: 18,
        description: "Robust Punjabi roadside bhatti style chicken skewers loaded with black peppercorn, roasted cloves, and fiery chili glaze.",
        category: "Tandoor",
        isVeg: false,
        spiceDefault: "Bhut Jolokia",
        bestseller: false,
        jainAvailable: false
    },
    {
        name: "Achari Tandoori Soya Chaap",
        image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80",
        price: 14,
        description: "Soybean chaap rolls marinated in tangy pickling spices, lemon juice, and roasted cumin. Vegan high-protein favorite.",
        category: "Tandoor",
        isVeg: true,
        spiceDefault: "Medium",
        bestseller: false,
        jainAvailable: false
    },

    // Naan & Breads
    {
        name: "Garlic Butter Naan",
        image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80",
        price: 4.5,
        description: "Fluffy leavened flatbread brushed with crushed roasted garlic, fresh coriander leaves, and molten Amul butter.",
        category: "Breads",
        isVeg: true,
        spiceDefault: "Mild",
        bestseller: true,
        jainAvailable: false
    },
    {
        name: "Cheese Chilli Garlic Naan",
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80",
        price: 5.5,
        description: "Fresh tandoori naan stuffed with melted mozzarella cheese, chopped green chilies, and roasted garlic slivers.",
        category: "Breads",
        isVeg: true,
        spiceDefault: "Medium",
        bestseller: true,
        jainAvailable: false
    },
    {
        name: "Amritsari Aloo Pyaaz Kulcha",
        image: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=600&auto=format&fit=crop&q=80",
        price: 6.0,
        description: "Crispy layered kulcha stuffed with spiced mashed potatoes, onions, carom seeds (ajwain), and a huge dollop of butter.",
        category: "Breads",
        isVeg: true,
        spiceDefault: "Medium",
        bestseller: false,
        jainAvailable: false
    },
    {
        name: "Flaky Laccha Paratha (Desi Ghee)",
        image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=600&auto=format&fit=crop&q=80",
        price: 4.0,
        description: "Multi-layered whole wheat flatbread made with pure cow ghee and cooked to crispy, flaky perfection.",
        category: "Breads",
        isVeg: true,
        spiceDefault: "Mild",
        bestseller: false,
        jainAvailable: true
    },
    {
        name: "Tandoori Roti Basket (3 Pcs)",
        image: "https://images.unsplash.com/photo-1505253758473-96b3015f240a?w=600&auto=format&fit=crop&q=80",
        price: 5.0,
        description: "Traditional whole wheat unleavened bread baked crisp inside clay tandoor. Served hot with or without butter.",
        category: "Breads",
        isVeg: true,
        spiceDefault: "Mild",
        bestseller: false,
        jainAvailable: true
    },

    // Street Chaat & Starters
    {
        name: "Purani Dilli Dahi Puri Bombs (6 Pcs)",
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80",
        price: 9.5,
        description: "Crisp semolina puris stuffed with boiled potato, chickpeas, chilled sweet yoghurt, tamarind chutney, and fine sev.",
        category: "Street Chaat",
        isVeg: true,
        spiceDefault: "Mild",
        bestseller: true,
        jainAvailable: true
    },
    {
        name: "Samosa Chaat Dhamaka",
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80",
        price: 8.5,
        description: "Golden flaky Punjabi samosas crushed over spiced Amritsari chole, drizzled with mint chutney and pomegranate jewels.",
        category: "Street Chaat",
        isVeg: true,
        spiceDefault: "Medium",
        bestseller: true,
        jainAvailable: false
    },
    {
        name: "Mumbai Pav Bhaji with Extra Makhan",
        image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600&auto=format&fit=crop&q=80",
        price: 11.0,
        description: "Spicy mashed vegetable curry cooked on a large iron tava with special pav bhaji masala, served with 2 butter-toasted pavs.",
        category: "Street Chaat",
        isVeg: true,
        spiceDefault: "Medium",
        bestseller: true,
        jainAvailable: true
    },
    {
        name: "Crispy Kurkure Paneer Pakora",
        image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&auto=format&fit=crop&q=80",
        price: 10.0,
        description: "Thick slabs of malai paneer stuffed with spicy mint chutney, dipped in spiced chickpea batter and deep-fried golden.",
        category: "Street Chaat",
        isVeg: true,
        spiceDefault: "Medium",
        bestseller: false,
        jainAvailable: true
    },

    // Chai & Beverages
    {
        name: "Tapri Adrak Masala Chai Flask (Serves 2)",
        image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80",
        price: 6.0,
        description: "Piping hot Assam tea brewed with crushed ginger, green cardamom, cinnamon, cloves, and whole milk.",
        category: "Chai & Drinks",
        isVeg: true,
        spiceDefault: "Mild",
        bestseller: true,
        jainAvailable: true
    },
    {
        name: "Kesari Alphonso Mango Lassi",
        image: "https://images.unsplash.com/photo-1546173159-315724a31696?w=600&auto=format&fit=crop&q=80",
        price: 6.5,
        description: "Thick creamy churned yoghurt drink blended with 100% Ratnagiri Alphonso mango pulp, saffron strands, and crushed pistachios.",
        category: "Chai & Drinks",
        isVeg: true,
        spiceDefault: "Mild",
        bestseller: true,
        jainAvailable: true
    },
    {
        name: "Delhi Shahi Rose Falooda",
        image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80",
        price: 7.5,
        description: "Chilled rose milk layered with sabja basil seeds, vermicelli falooda noodles, rabdi, and a scoop of vanilla ice cream.",
        category: "Chai & Drinks",
        isVeg: true,
        spiceDefault: "Mild",
        bestseller: false,
        jainAvailable: true
    },
    {
        name: "Kala Khatta Masala Shikanji",
        image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80",
        price: 4.5,
        description: "Zesty street-style lemonade with black salt (kala namak), roasted cumin, fresh mint, and sparkling soda.",
        category: "Chai & Drinks",
        isVeg: true,
        spiceDefault: "Mild",
        bestseller: false,
        jainAvailable: true
    },

    // Mithai & Desserts
    {
        name: "Hot Gulab Jamun with Shahi Rabdi (2 Pcs)",
        image: "https://images.unsplash.com/photo-1589119908995-c6837fa14d48?w=600&auto=format&fit=crop&q=80",
        price: 8.0,
        description: "Soft melt-in-the-mouth khoya dumplings soaked in rose cardamom sugar syrup, served warm over chilled saffron rabdi.",
        category: "Mithai",
        isVeg: true,
        spiceDefault: "Mild",
        bestseller: true,
        jainAvailable: true
    },
    {
        name: "Kesar Pista Rasmalai Tres Leches",
        image: "https://images.unsplash.com/photo-1505253758473-96b3015f240a?w=600&auto=format&fit=crop&q=80",
        price: 9.0,
        description: "Spongy cottage cheese discs steeped in saffron pistachio flavored thickened milk, topped with silver vark and rose petals.",
        category: "Mithai",
        isVeg: true,
        spiceDefault: "Mild",
        bestseller: true,
        jainAvailable: true
    },
    {
        name: "Matka Kesar Kulfi with Falooda",
        image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=600&auto=format&fit=crop&q=80",
        price: 7.0,
        description: "Slow-reduced milk ice cream flavored with saffron and crushed almonds, served in a traditional earthen clay matka.",
        category: "Mithai",
        isVeg: true,
        spiceDefault: "Mild",
        bestseller: false,
        jainAvailable: true
    },
    {
        name: "Desi Ghee Moong Dal Halwa",
        image: "https://images.unsplash.com/photo-1589119908995-c6837fa14d48?w=600&auto=format&fit=crop&q=80",
        price: 7.5,
        description: "Rich winter delicacy made by slow-roasting yellow lentils in generous desi ghee, infused with green cardamom and toasted cashews.",
        category: "Mithai",
        isVeg: true,
        spiceDefault: "Mild",
        bestseller: false,
        jainAvailable: true
    }
];

const sampleReservations = [
    {
        _id: "res_sample_1",
        bookingCode: "RES-8421",
        name: "Kabir Sharma",
        email: "alex.demo@tomato.com",
        phone: "+1-555-0144",
        guests: 4,
        date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        timeSlot: "7:00 PM",
        seatingArea: "Maharaja Royal Diwan",
        specialOccasion: "Family Milap",
        specialRequests: "Charcoal burner table for hot naans please.",
        status: "Confirmed",
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
        _id: "res_sample_2",
        bookingCode: "RES-5912",
        name: "Priya Malhotra",
        email: "priya.m@example.com",
        phone: "+1-555-0182",
        guests: 2,
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        timeSlot: "8:30 PM",
        seatingArea: "Bollywood Rooftop Lounge",
        specialOccasion: "Shaadi Afterparty",
        specialRequests: "Cozy corner table with live acoustic view.",
        status: "Confirmed",
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
    }
];

function readDB() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const raw = fs.readFileSync(DATA_FILE, "utf-8");
            const parsed = JSON.parse(raw);
            let updated = false;

            // Migrate foods to Desi menu if still containing old salads or empty
            if (!parsed.foods || parsed.foods.length === 0 || !parsed.foods.some(f => f.category === "Biryani")) {
                parsed.foods = initialFoodList.map((item, idx) => ({
                    _id: "food_" + (idx + 1),
                    ...item
                }));
                updated = true;
            }

            if (!parsed.reservations || parsed.reservations.length === 0) {
                parsed.reservations = sampleReservations;
                updated = true;
            }

            if (updated) {
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

    // Orders with Live Delivery Hero & Rider Details
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
            riderTip: Number(orderData.riderTip) || 0,
            etaMins: 18,
            rider: {
                name: "Raju Bhaiya",
                vehicle: "Hero Splendor • KA-01-EA-2026",
                rating: 4.9,
                deliveries: 1420,
                phone: "+91 98765 43210",
                vaccinated: true,
                status: "On the way with hot food!"
            },
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

    // Reservations (KitchenAsty feature with Desi Ambiances)
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
