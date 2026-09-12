import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { defaultFoods } from "../assets/defaultFoods";

export const StoreContext = createContext(null);

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

    const showToast = (message, type = 'success', duration = 3000) => {
        setToast({ message, type });
        setTimeout(() => {
            setToast((current) => (current?.message === message ? null : current));
        }, duration);
    };

    const closeToast = () => setToast(null);

    const addToCart = async (itemId, quantity = 1, silent = false, customization = null) => {
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
        setRiderTip
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
