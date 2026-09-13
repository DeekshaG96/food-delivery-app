import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { defaultFoods } from "../assets/defaultFoods";
import { triggerHaptic } from "../utils/haptics";
import { playAddCartPop, playCoinChime, playSecretUnlock, playSuccessChime } from "../utils/soundEffects";

export const StoreContext = createContext(null);

export const OUTLETS = [
    {
        id: "outlet_indiranagar",
        name: "NaanStop Indiranagar",
        type: "Flagship Cloud Kitchen",
        city: "Bengaluru",
        address: "100 Feet Road, HAL 2nd Stage, Indiranagar",
        distanceKm: 2.1,
        etaMins: 25,
        rating: 4.9,
        reviews: "2.4k+",
        status: "Open Now",
        badge: "Popular 🔥"
    },
    {
        id: "outlet_koramangala",
        name: "NaanStop Koramangala",
        type: "Highway Express Hub",
        city: "Bengaluru",
        address: "80 Feet Road, 4th Block, Koramangala",
        distanceKm: 4.2,
        etaMins: 32,
        rating: 4.8,
        reviews: "1.8k+",
        status: "Open Now",
        badge: "Express ⚡"
    },
    {
        id: "outlet_cyberhub",
        name: "NaanStop Cyber Hub",
        type: "Downtown Canteen",
        city: "Gurugram",
        address: "DLF Cyber Hub, Phase 2, Sector 24",
        distanceKm: 1.8,
        etaMins: 20,
        rating: 4.9,
        reviews: "3.1k+",
        status: "Open Now",
        badge: "Fastest 🚀"
    }
];

export const COMMERCIAL_FEES = {
    PLATFORM_FEE: 0.25,
    PACKAGING_FEE: 0.40,
    BASE_DELIVERY_FEE: 2.00,
    FREE_DELIVERY_THRESHOLD: 30.00
};

export const generateDeliveryPin = () => {
    return String(Math.floor(1000 + Math.random() * 9000));
};

export const calculateCommercialBill = ({
    subtotal = 0,
    orderType = 'delivery',
    riderTip = 0,
    couponDiscount = 0,
    redeemCoinsActive = false
}) => {
    const isDelivery = orderType === 'delivery';
    const packagingFee = subtotal > 0 ? COMMERCIAL_FEES.PACKAGING_FEE : 0;
    const platformFee = subtotal > 0 ? COMMERCIAL_FEES.PLATFORM_FEE : 0;
    const isFreeDelivery = subtotal >= COMMERCIAL_FEES.FREE_DELIVERY_THRESHOLD;
    const deliveryFee = (!isDelivery || subtotal === 0) ? 0 : (isFreeDelivery ? 0 : COMMERCIAL_FEES.BASE_DELIVERY_FEE);
    const appliedTip = isDelivery ? (Number(riderTip) || 0) : 0;
    const coinDiscountAmount = redeemCoinsActive ? 3.00 : 0;
    const totalDiscount = (Number(couponDiscount) || 0) + coinDiscountAmount;
    
    const gross = subtotal + packagingFee + platformFee + deliveryFee + appliedTip;
    const finalTotal = Math.max(0, gross - totalDiscount);

    return {
        subtotal: Number(subtotal.toFixed(2)),
        packagingFee: Number(packagingFee.toFixed(2)),
        platformFee: Number(platformFee.toFixed(2)),
        deliveryFee: Number(deliveryFee.toFixed(2)),
        isFreeDelivery,
        appliedTip: Number(appliedTip.toFixed(2)),
        coinDiscountAmount: Number(coinDiscountAmount.toFixed(2)),
        totalDiscount: Number(totalDiscount.toFixed(2)),
        finalTotal: Number(finalTotal.toFixed(2))
    };
};

const DEFAULT_ADDRESSES = [
    {
        id: "addr_1",
        label: "Home",
        tag: "home",
        street: "742 Evergreen Terrace, Apt 4B",
        city: "Springfield",
        state: "OR",
        zipcode: "97477",
        phone: "+1-555-0199",
        isDefault: true
    },
    {
        id: "addr_2",
        label: "Work / Office",
        tag: "work",
        street: "100 Innovation Blvd, Tech Hub Tower",
        city: "Springfield",
        state: "OR",
        zipcode: "97477",
        phone: "+1-555-0144",
        isDefault: false
    }
];

const DEFAULT_NOTIFICATIONS = [
    {
        id: "notif_welcome",
        title: "Welcome to NaanStop 🌶️",
        message: "Enjoy 20% off your first order! Use code TADKA20 or spin the Chakkar of Luck.",
        time: "Just now",
        unread: true,
        type: "promo"
    },
    {
        id: "notif_delight",
        title: "Fresh Dum Biryani Ready! 🍲",
        message: "Handi slow-cooked over charcoal dum just arrived in the kitchen. Order now for express 25-min delivery!",
        time: "15 mins ago",
        unread: true,
        type: "kitchen"
    }
];

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    const [cartCustomizations, setCartCustomizations] = useState({});
    const url = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
    const adminUrl = import.meta.env.VITE_ADMIN_URL || (typeof window !== "undefined" && window.location.hostname.includes("github.io") ? "./admin/" : "http://localhost:5174");
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [userName, setUserName] = useState(localStorage.getItem("userName") || "");
    const [food_list, setFoodList] = useState(defaultFoods);
    const [loadingFoods, setLoadingFoods] = useState(false);
    const [toast, setToast] = useState(null);
    const [pureVegOnly, setPureVegOnly] = useState(false);
    const [spinModalOpen, setSpinModalOpen] = useState(false);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [riderTip, setRiderTip] = useState(1.00);

    // NaanCoins & Viral Gamification states
    const [naanCoins, setNaanCoins] = useState(() => {
        try {
            const saved = localStorage.getItem("naanstop_coins");
            return saved ? Number(saved) : 250;
        } catch {
            return 250;
        }
    });

    const [streakDays, setStreakDays] = useState(() => {
        try {
            const saved = localStorage.getItem("naanstop_streak");
            return saved ? Number(saved) : 3;
        } catch {
            return 3;
        }
    });

    const [redeemCoinsActive, setRedeemCoinsActive] = useState(false);

    const [secretMenuUnlocked, setSecretMenuUnlocked] = useState(() => {
        try {
            return localStorage.getItem("naanstop_secret_unlocked") === "true";
        } catch {
            return false;
        }
    });

    const [soundEnabled, setSoundEnabled] = useState(() => {
        try {
            return localStorage.getItem("naanstop_sound_enabled") !== "false";
        } catch {
            return true;
        }
    });

    // Mobile specific & Google Play compliance states
    const [favorites, setFavorites] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("naanstop_favorites") || "[]");
        } catch {
            return [];
        }
    });

    const [savedAddresses, setSavedAddresses] = useState(() => {
        try {
            const saved = localStorage.getItem("naanstop_addresses");
            return saved ? JSON.parse(saved) : DEFAULT_ADDRESSES;
        } catch {
            return DEFAULT_ADDRESSES;
        }
    });

    const [notifications, setNotifications] = useState(() => {
        try {
            const saved = localStorage.getItem("naanstop_notifications");
            return saved ? JSON.parse(saved) : DEFAULT_NOTIFICATIONS;
        } catch {
            return DEFAULT_NOTIFICATIONS;
        }
    });

    const [localOrders, setLocalOrders] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("naanstop_local_orders") || "[]");
        } catch {
            return [];
        }
    });

    const [userProfile, setUserProfile] = useState(() => {
        try {
            const saved = localStorage.getItem("naanstop_profile");
            return saved ? JSON.parse(saved) : {
                name: localStorage.getItem("userName") || "Rohan Sharma",
                phone: "+1-555-0199",
                email: "rohan.desi@naanstop.com",
                isVeg: false
            };
        } catch {
            return {
                name: "Rohan Sharma",
                phone: "+1-555-0199",
                email: "rohan.desi@naanstop.com",
                isVeg: false
            };
        }
    });

    // Multi-Outlet Cloud Kitchen State
    const [selectedOutlet, setSelectedOutlet] = useState(() => {
        try {
            const savedId = localStorage.getItem("naanstop_outlet_id");
            return OUTLETS.find(o => o.id === savedId) || OUTLETS[0];
        } catch {
            return OUTLETS[0];
        }
    });
    const [outletModalOpen, setOutletModalOpen] = useState(false);

    // Delivery Partner / Fleet State (Raju Bhaiya)
    const [riderProfile, setRiderProfile] = useState(() => {
        try {
            const saved = localStorage.getItem("naanstop_rider_profile");
            return saved ? JSON.parse(saved) : {
                name: "Raju Bhaiya",
                phone: "+91 98765 43210",
                vehicle: "Hero Splendor • KA-01-EA-2026",
                rating: 4.9,
                totalDeliveries: 1428,
                isOnline: true,
                todayEarnings: 48.50,
                todayTrips: 8,
                currentLocation: "Indiranagar Hub"
            };
        } catch {
            return {
                name: "Raju Bhaiya",
                phone: "+91 98765 43210",
                vehicle: "Hero Splendor • KA-01-EA-2026",
                rating: 4.9,
                totalDeliveries: 1428,
                isOnline: true,
                todayEarnings: 48.50,
                todayTrips: 8,
                currentLocation: "Indiranagar Hub"
            };
        }
    });

    // Modal Visibility States
    const [profileModalOpen, setProfileModalOpen] = useState(false);
    const [notificationModalOpen, setNotificationModalOpen] = useState(false);
    const [helpModalOpen, setHelpModalOpen] = useState(false);
    const [legalModalOpen, setLegalModalOpen] = useState(null); // null | 'privacy' | 'terms'

    const showToast = (message, type = 'success', duration = 3000) => {
        setToast({ message, type });
        setTimeout(() => {
            setToast((current) => (current?.message === message ? null : current));
        }, duration);
    };

    const closeToast = () => setToast(null);

    const addNaanCoins = (amount, reason = "") => {
        setNaanCoins(prev => {
            const next = prev + amount;
            localStorage.setItem("naanstop_coins", String(next));
            if (soundEnabled) playCoinChime();
            triggerHaptic('success');
            showToast(`+${amount} NaanCoins earned! 🪙 ${reason ? `(${reason})` : ''}`, 'success');
            return next;
        });
    };

    const toggleRedeemCoins = () => {
        if (naanCoins < 100) {
            showToast("You need at least 100 NaanCoins to redeem $3.00 off!", "info");
            return;
        }
        triggerHaptic('selection');
        if (soundEnabled) playCoinChime();
        setRedeemCoinsActive(prev => !prev);
    };

    const unlockSecretMenu = () => {
        setSecretMenuUnlocked(true);
        localStorage.setItem("naanstop_secret_unlocked", "true");
        if (soundEnabled) playSecretUnlock();
        triggerHaptic('success');
        showToast("🌙 Secret Late-Night Dhaba Menu Unlocked!", "success", 4000);
    };

    const addToCart = async (itemId, quantity = 1, silent = false, customization = null) => {
        if (soundEnabled) {
            playAddCartPop();
        }
        triggerHaptic('light');

        if (customization) {
            setCartCustomizations((prev) => ({
                ...prev,
                [itemId]: customization
            }));
        }

        setCartItems((prev) => {
            const current = prev[itemId] || 0;
            return { ...prev, [itemId]: current + quantity };
        });

        if (!silent) {
            const dish = food_list.find(p => p._id === itemId);
            if (dish) {
                const sizeLabel = customization?.size ? ` (${customization.size})` : '';
                showToast(`Added ${dish.name}${sizeLabel} to cart! 😋`, 'success');
            }
        }

        if (token) {
            try {
                // Sync quantity additions
                for (let i = 0; i < quantity; i++) {
                    await axios.post(
                        `${url}/api/cart/add`,
                        { itemId },
                        { headers: { token } }
                    );
                }
            } catch (error) {
                console.error("Failed to sync cart add:", error);
            }
        }
    };

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => {
            if (!prev[itemId]) return prev;
            const updated = { ...prev };
            if (updated[itemId] > 1) {
                updated[itemId] -= 1;
            } else {
                delete updated[itemId];
            }
            return updated;
        });

        if (token) {
            try {
                await axios.post(
                    `${url}/api/cart/remove`,
                    { itemId },
                    { headers: { token } }
                );
            } catch (error) {
                console.error("Failed to sync cart remove:", error);
            }
        }
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                const itemInfo = food_list.find((product) => product._id === item);
                if (itemInfo) {
                    const price = cartCustomizations[item]?.unitPrice || itemInfo.price;
                    totalAmount += price * cartItems[item];
                }
            }
        }
        return totalAmount;
    };

    const getTotalCartCount = () => {
        let count = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                count += cartItems[item];
            }
        }
        return count;
    };

    const fetchFoodList = async () => {
        try {
            const response = await axios.get(`${url}/api/food/list`, { timeout: 3000 });
            if (response.data?.success && Array.isArray(response.data.data) && response.data.data.length > 0) {
                setFoodList(response.data.data);
            }
        } catch (error) {
            console.warn("Backend API unavailable, using offline food catalog:", error.message);
        } finally {
            setLoadingFoods(false);
        }
    };

    const loadCartData = async (userToken) => {
        try {
            const response = await axios.post(
                `${url}/api/cart/get`,
                {},
                { headers: { token: userToken } }
            );
            if (response.data.success && response.data.cartData) {
                setCartItems(response.data.cartData);
            }
        } catch (error) {
            console.error("Failed to load cart:", error);
        }
    };

    const handleSetToken = (newToken, name = "") => {
        setToken(newToken);
        if (newToken) {
            localStorage.setItem("token", newToken);
            if (name) {
                setUserName(name);
                localStorage.setItem("userName", name);
            }
            loadCartData(newToken);
        } else {
            localStorage.removeItem("token");
            localStorage.removeItem("userName");
            setUserName("");
            setCartItems({});
        }
    };

    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            const savedToken = localStorage.getItem("token");
            if (savedToken) {
                setToken(savedToken);
                await loadCartData(savedToken);
            }
        }
        loadData();
    }, []);

    // Favorites Management
    const toggleFavorite = (dishId) => {
        triggerHaptic('light');
        setFavorites((prev) => {
            const next = prev.includes(dishId)
                ? prev.filter(id => id !== dishId)
                : [...prev, dishId];
            localStorage.setItem("naanstop_favorites", JSON.stringify(next));
            const dish = food_list.find(f => f._id === dishId);
            if (dish) {
                if (next.includes(dishId)) {
                    showToast(`Added ${dish.name} to Favorites! ❤️`, 'success');
                } else {
                    showToast(`Removed from Favorites`, 'info');
                }
            }
            return next;
        });
    };

    // Address Management
    const saveAddress = (newAddr) => {
        setSavedAddresses((prev) => {
            const existingIndex = prev.findIndex(a => a.id === newAddr.id);
            let updated;
            if (existingIndex !== -1) {
                updated = [...prev];
                updated[existingIndex] = newAddr;
            } else {
                updated = [...prev, { ...newAddr, id: `addr_${Date.now()}` }];
            }
            localStorage.setItem("naanstop_addresses", JSON.stringify(updated));
            showToast("Address saved successfully! 📍", "success");
            return updated;
        });
    };

    const deleteAddress = (addrId) => {
        setSavedAddresses((prev) => {
            const updated = prev.filter(a => a.id !== addrId);
            localStorage.setItem("naanstop_addresses", JSON.stringify(updated));
            showToast("Address removed", "info");
            return updated;
        });
    };

    // Notification Management
    const addNotification = (notif) => {
        setNotifications((prev) => {
            const updated = [{ ...notif, id: `notif_${Date.now()}`, unread: true, time: "Just now" }, ...prev];
            localStorage.setItem("naanstop_notifications", JSON.stringify(updated));
            return updated;
        });
    };

    const markAllNotificationsRead = () => {
        setNotifications((prev) => {
            const updated = prev.map(n => ({ ...n, unread: false }));
            localStorage.setItem("naanstop_notifications", JSON.stringify(updated));
            return updated;
        });
    };

    const unreadNotificationsCount = notifications.filter(n => n.unread).length;

    // Profile Management
    const updateUserProfile = (newProfile) => {
        setUserProfile(newProfile);
        localStorage.setItem("naanstop_profile", JSON.stringify(newProfile));
        if (newProfile.name) {
            setUserName(newProfile.name);
            localStorage.setItem("userName", newProfile.name);
        }
        showToast("Profile updated! 👤", "success");
    };

    // Multi-Outlet & Rider Fleet Methods
    const handleSelectOutlet = (outlet) => {
        setSelectedOutlet(outlet);
        localStorage.setItem("naanstop_outlet_id", outlet.id);
        triggerHaptic('selection');
        showToast(`Switched outlet to ${outlet.name} 🏙️`, 'success');
        setOutletModalOpen(false);
    };

    const toggleRiderOnline = () => {
        setRiderProfile(prev => {
            const next = { ...prev, isOnline: !prev.isOnline };
            localStorage.setItem("naanstop_rider_profile", JSON.stringify(next));
            triggerHaptic('selection');
            showToast(`Rider status: ${next.isOnline ? "Online & Ready 🟢" : "Offline 🔴"}`, 'info');
            return next;
        });
    };

    const advanceRiderOrderStatus = (orderId, newStatus) => {
        triggerHaptic('light');
        updateLocalOrderStatus(orderId, newStatus);
        showToast(`Rider updated order to "${newStatus}" 🛵`, 'info');
    };

    const verifyAndCompleteDelivery = (orderId, enteredPin) => {
        const order = localOrders.find(o => o._id === orderId);
        if (!order) {
            return { success: false, message: "Order not found!" };
        }

        const expectedPin = String(order.deliveryPin || "1234");
        if (String(enteredPin).trim() !== expectedPin.trim()) {
            triggerHaptic('error');
            return { success: false, message: "Incorrect PIN! Please ask customer for the 4-digit code." };
        }

        // Correct PIN! Complete delivery!
        triggerHaptic('success');
        if (soundEnabled) {
            playSuccessChime();
        }

        const tripPayout = 4.50 + (Number(order.riderTip) || 0);

        setLocalOrders(prev => {
            const updated = prev.map(o => o._id === orderId ? {
                ...o,
                status: "Delivered",
                deliveredAt: new Date().toISOString(),
                isVerified: true
            } : o);
            localStorage.setItem("naanstop_local_orders", JSON.stringify(updated));
            return updated;
        });

        setRiderProfile(prev => {
            const updated = {
                ...prev,
                todayEarnings: Number((prev.todayEarnings + tripPayout).toFixed(2)),
                todayTrips: prev.todayTrips + 1,
                totalDeliveries: prev.totalDeliveries + 1
            };
            localStorage.setItem("naanstop_rider_profile", JSON.stringify(updated));
            return updated;
        });

        addNotification({
            title: `Order #${order._id.slice(-6)} Delivered! 🌶️🎉`,
            message: `Handover verified with PIN. Thank you for ordering from ${order.outlet?.name || "NaanStop"}!`,
            type: "order"
        });

        showToast(`Delivery verified! Earned $${tripPayout.toFixed(2)} 🎉`, 'success', 4000);
        return { success: true, message: `Delivery verified successfully! Earned $${tripPayout.toFixed(2)}` };
    };

    // Local Orders for Instant / Guest Checkout
    const addLocalOrder = (order) => {
        triggerHaptic('success');
        
        // Ensure Delivery PIN and Outlet are bound
        const finalizedOrder = {
            ...order,
            deliveryPin: order.deliveryPin || generateDeliveryPin(),
            outlet: order.outlet || selectedOutlet
        };

        // Award NaanCoins: 10 coins per $1 spent!
        const earnedCoins = Math.max(10, Math.floor((Number(finalizedOrder.amount) || 15) * 10));
        let remainingCoins = naanCoins + earnedCoins;

        if (redeemCoinsActive && naanCoins >= 100) {
            remainingCoins -= 100;
            setRedeemCoinsActive(false);
            showToast(`Redeemed 100 NaanCoins ($3.00 off)! Plus earned +${earnedCoins} new coins 🪙`, 'success', 4000);
        } else {
            showToast(`Earned +${earnedCoins} NaanCoins on this order! 🪙`, 'success');
        }

        setNaanCoins(remainingCoins);
        localStorage.setItem("naanstop_coins", String(remainingCoins));

        setLocalOrders((prev) => {
            const updated = [finalizedOrder, ...prev];
            localStorage.setItem("naanstop_local_orders", JSON.stringify(updated));
            return updated;
        });
        addNotification({
            title: `Order Placed: #${finalizedOrder._id.slice(-6)} 🛵`,
            message: `${finalizedOrder.items.length} item(s) on their way from ${finalizedOrder.outlet?.name || "NaanStop"}. Handover PIN: ${finalizedOrder.deliveryPin}`,
            type: "order"
        });
    };

    const updateLocalOrderStatus = (orderId, newStatus) => {
        setLocalOrders((prev) => {
            const updated = prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o);
            localStorage.setItem("naanstop_local_orders", JSON.stringify(updated));
            return updated;
        });
    };

    // Google Play Required: Delete Account & Clear All Data
    const clearAllUserData = () => {
        triggerHaptic('warning');
        localStorage.clear();
        setCartItems({});
        setCartCustomizations({});
        setToken("");
        setUserName("");
        setFavorites([]);
        setSavedAddresses(DEFAULT_ADDRESSES);
        setNotifications([]);
        setLocalOrders([]);
        setNaanCoins(250);
        setStreakDays(1);
        setSecretMenuUnlocked(false);
        setUserProfile({
            name: "Guest User",
            phone: "",
            email: "",
            isVeg: false
        });
        showToast("All personal data, coins, and saved orders cleared.", "info");
    };

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        cartCustomizations,
        setCartCustomizations,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        getTotalCartCount,
        url,
        adminUrl,
        token,
        userName,
        setToken: handleSetToken,
        fetchFoodList,
        loadingFoods,
        toast,
        showToast,
        closeToast,
        pureVegOnly,
        setPureVegOnly,
        spinModalOpen,
        setSpinModalOpen,
        appliedCoupon,
        setAppliedCoupon,
        riderTip,
        setRiderTip,
        // Mobile additions
        favorites,
        toggleFavorite,
        savedAddresses,
        saveAddress,
        deleteAddress,
        notifications,
        addNotification,
        markAllNotificationsRead,
        unreadNotificationsCount,
        userProfile,
        updateUserProfile,
        localOrders,
        addLocalOrder,
        updateLocalOrderStatus,
        clearAllUserData,
        profileModalOpen,
        setProfileModalOpen,
        notificationModalOpen,
        setNotificationModalOpen,
        helpModalOpen,
        setHelpModalOpen,
        legalModalOpen,
        setLegalModalOpen,
        // Viral Loyalty & Audio Additions
        naanCoins,
        streakDays,
        redeemCoinsActive,
        toggleRedeemCoins,
        addNaanCoins,
        secretMenuUnlocked,
        unlockSecretMenu,
        soundEnabled,
        setSoundEnabled,
        // Swiggy/Zomato Multi-Outlet & Fleet Additions
        OUTLETS,
        COMMERCIAL_FEES,
        calculateCommercialBill,
        generateDeliveryPin,
        selectedOutlet,
        setSelectedOutlet,
        handleSelectOutlet,
        outletModalOpen,
        setOutletModalOpen,
        riderProfile,
        setRiderProfile,
        toggleRiderOnline,
        advanceRiderOrderStatus,
        verifyAndCompleteDelivery
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
