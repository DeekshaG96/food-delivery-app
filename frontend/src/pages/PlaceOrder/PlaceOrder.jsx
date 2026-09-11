import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
    ShieldCheck,
    MapPin,
    CreditCard,
    ArrowRight,
    AlertCircle,
    Store,
    Clock,
    Sparkles,
    Utensils,
    CheckCircle2
} from 'lucide-react';
import { StoreContext } from '../../context/StoreContext';
import './PlaceOrder.css';

const PlaceOrder = ({ setShowLogin }) => {
    const { getTotalCartAmount, token, food_list, cartItems, cartCustomizations, url } = useContext(StoreContext);
    const navigate = useNavigate();

    // Fulfillment & Timing states (KitchenAsty feature)
    const [orderType, setOrderType] = useState('delivery'); // 'delivery' | 'pickup' | 'dine-in'
    const [scheduleType, setScheduleType] = useState('asap'); // 'asap' | 'later'
    const [scheduledTime, setScheduledTime] = useState('7:30 PM');
    const [tableNumber, setTableNumber] = useState('Table 4');

    const [data, setData] = useState({
        firstName: "Alex",
        lastName: "Morgan",
        email: "alex.demo@tomato.com",
        street: "742 Evergreen Terrace",
        city: "Springfield",
        state: "OR",
        zipcode: "97477",
        country: "United States",
        phone: "+1-555-0199"
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    };

    const subtotal = getTotalCartAmount();
    const deliveryFee = orderType === 'delivery' ? (subtotal === 0 ? 0 : 2) : 0;
    const finalTotal = subtotal + deliveryFee;

    const onPlaceOrder = async (event) => {
        event.preventDefault();
        setErrorMessage("");

        if (!token) {
            setShowLogin(true);
            setErrorMessage("Please sign in or register to place your order.");
            return;
        }

        let orderItems = [];
        food_list.forEach((item) => {
            if (cartItems[item._id] > 0) {
                const custom = cartCustomizations[item._id] || {};
                let itemInfo = {
                    ...item,
                    quantity: cartItems[item._id],
                    size: custom.size || "Regular",
                    addOns: custom.addOns || [],
                    spice: custom.spice || "Medium 🌶️",
                    notes: custom.notes || "",
                    price: custom.unitPrice || item.price
                };
                orderItems.push(itemInfo);
            }
        });

        if (orderItems.length === 0) {
            setErrorMessage("Your cart is empty. Please add some food first.");
            navigate('/cart');
            return;
        }

        let orderData = {
            address: data,
            items: orderItems,
            amount: finalTotal,
            orderType: orderType,
            scheduledFor: scheduleType === 'asap' ? 'ASAP (25-35 mins)' : `Scheduled for ${scheduledTime}`,
            tableNumber: orderType === 'dine-in' ? tableNumber : '',
            pickupTime: orderType === 'pickup' ? (scheduleType === 'asap' ? 'Ready in 15-20 mins' : scheduledTime) : ''
        };

        try {
            setIsSubmitting(true);
            const response = await axios.post(
                `${url}/api/order/place`,
                orderData,
                { headers: { token } }
            );

            if (response.data.success) {
                const { session_url } = response.data;
                // Redirect to payment provider or simulated checkout verify url
                window.location.replace(session_url);
            } else {
                setErrorMessage(response.data.message || "Failed to initiate payment session");
            }
        } catch (error) {
            console.error("Order placement error:", error);
            setErrorMessage("An unexpected error occurred while placing your order.");
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (subtotal === 0) {
            navigate('/cart');
        }
    }, [subtotal, navigate]);

    return (
        <div className="place-order-page animate-fade">
            <div className="cart-header-breadcrumb">
                <Link to="/" className="crumb-link">Home</Link>
                <span>/</span>
                <Link to="/cart" className="crumb-link">Cart</Link>
                <span>/</span>
                <span className="crumb-active">Checkout</span>
            </div>

            <form onSubmit={onPlaceOrder} className="place-order-form">
                {/* Left Side: Fulfillment & Delivery Form */}
                <div className="place-order-left">
                    {/* Order Type Toggle (KitchenAsty feature) */}
                    <div className="fulfillment-card">
                        <label className="type-selector-label">Choose Fulfillment Option</label>
                        <div className="type-toggle-pills">
                            <button
                                type="button"
                                className={`type-pill ${orderType === 'delivery' ? 'active' : ''}`}
                                onClick={() => setOrderType('delivery')}
                                id="type-delivery-btn"
                            >
                                <span className="type-emoji">🛵</span>
                                <div className="type-pill-text">
                                    <span className="type-pill-title">Delivery</span>
                                    <span className="type-pill-sub">+$2.00 • 30–40 mins</span>
                                </div>
                            </button>

                            <button
                                type="button"
                                className={`type-pill ${orderType === 'pickup' ? 'active' : ''}`}
                                onClick={() => setOrderType('pickup')}
                                id="type-pickup-btn"
                            >
                                <span className="type-emoji">🛍️</span>
                                <div className="type-pill-text">
                                    <span className="type-pill-title">Store Pickup</span>
                                    <span className="type-pill-sub">FREE • Ready in 15m</span>
                                </div>
                            </button>

                            <button
                                type="button"
                                className={`type-pill ${orderType === 'dine-in' ? 'active' : ''}`}
                                onClick={() => setOrderType('dine-in')}
                                id="type-dinein-btn"
                            >
                                <span className="type-emoji">🍽️</span>
                                <div className="type-pill-text">
                                    <span className="type-pill-title">Dine-In Table</span>
                                    <span className="type-pill-sub">Order to Table</span>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Order Schedule Selector (KitchenAsty feature) */}
                    <div className="schedule-timing-card">
                        <div className="schedule-header">
                            <Clock size={16} className="clock-ico" />
                            <label className="type-selector-label">Timing Preference</label>
                        </div>
                        <div className="timing-toggle-row">
                            <button
                                type="button"
                                className={`timing-btn ${scheduleType === 'asap' ? 'active' : ''}`}
                                onClick={() => setScheduleType('asap')}
                            >
                                ⚡ ASAP ({orderType === 'pickup' ? '15–20 mins' : '25–35 mins'})
                            </button>
                            <button
                                type="button"
                                className={`timing-btn ${scheduleType === 'later' ? 'active' : ''}`}
                                onClick={() => setScheduleType('later')}
                            >
                                🕒 Schedule for Later
                            </button>
                        </div>

                        {scheduleType === 'later' && (
                            <div className="time-select-row animate-fade">
                                <label className="sub-field-label">Preferred Time Slot:</label>
                                <select
                                    value={scheduledTime}
                                    onChange={(e) => setScheduledTime(e.target.value)}
                                    className="scheduled-time-select"
                                >
                                    <option value="6:00 PM Today">Today at 6:00 PM</option>
                                    <option value="6:45 PM Today">Today at 6:45 PM</option>
                                    <option value="7:30 PM Today">Today at 7:30 PM</option>
                                    <option value="8:15 PM Today">Today at 8:15 PM</option>
                                    <option value="9:00 PM Today">Today at 9:00 PM</option>
                                </select>
                            </div>
                        )}
                    </div>

                    {/* Section based on orderType */}
                    {orderType === 'delivery' ? (
                        <>
                            <div className="form-section-title">
                                <MapPin size={22} className="section-icon" />
                                <div>
                                    <h2>Delivery Address</h2>
                                    <p className="form-sub">Where should we deliver your feast?</p>
                                </div>
                            </div>

                            {errorMessage && (
                                <div className="order-error-alert">
                                    <AlertCircle size={18} />
                                    <span>{errorMessage}</span>
                                </div>
                            )}

                            <div className="multi-fields">
                                <input
                                    required
                                    name="firstName"
                                    onChange={onChangeHandler}
                                    value={data.firstName}
                                    type="text"
                                    placeholder="First Name"
                                    id="order-firstname"
                                />
                                <input
                                    required
                                    name="lastName"
                                    onChange={onChangeHandler}
                                    value={data.lastName}
                                    type="text"
                                    placeholder="Last Name"
                                    id="order-lastname"
                                />
                            </div>

                            <input
                                required
                                name="email"
                                onChange={onChangeHandler}
                                value={data.email}
                                type="email"
                                placeholder="Email Address (for order updates)"
                                id="order-email"
                            />

                            <input
                                required
                                name="street"
                                onChange={onChangeHandler}
                                value={data.street}
                                type="text"
                                placeholder="Street Address & Apt / Suite"
                                id="order-street"
                            />

                            <div className="multi-fields">
                                <input
                                    required
                                    name="city"
                                    onChange={onChangeHandler}
                                    value={data.city}
                                    type="text"
                                    placeholder="City"
                                    id="order-city"
                                />
                                <input
                                    required
                                    name="state"
                                    onChange={onChangeHandler}
                                    value={data.state}
                                    type="text"
                                    placeholder="State"
                                    id="order-state"
                                />
                            </div>

                            <div className="multi-fields">
                                <input
                                    required
                                    name="zipcode"
                                    onChange={onChangeHandler}
                                    value={data.zipcode}
                                    type="text"
                                    placeholder="Zip Code"
                                    id="order-zipcode"
                                />
                                <input
                                    required
                                    name="country"
                                    onChange={onChangeHandler}
                                    value={data.country}
                                    type="text"
                                    placeholder="Country"
                                    id="order-country"
                                />
                            </div>

                            <input
                                required
                                name="phone"
                                onChange={onChangeHandler}
                                value={data.phone}
                                type="tel"
                                placeholder="Phone Number (for delivery rider)"
                                id="order-phone"
                            />
                        </>
                    ) : orderType === 'pickup' ? (
                        <div className="pickup-info-box animate-fade">
                            <div className="form-section-title">
                                <Store size={22} className="section-icon" />
                                <div>
                                    <h2>Restaurant Pickup Location</h2>
                                    <p className="form-sub">Pick up your freshly packed meal at our takeaway counter</p>
                                </div>
                            </div>

                            <div className="pickup-location-card">
                                <div className="pl-badge">Ready in 15 mins • No Delivery Fee</div>
                                <h3 className="pl-name">🍅 Tomato Culinary Flagship</h3>
                                <p className="pl-addr">120 Market Street, Gourmet Quarter, Springfield, OR</p>
                                <p className="pl-hours">Open Daily: 11:00 AM – 10:30 PM • Phone: (555) 839-2049</p>
                                <div className="pl-perk">
                                    <CheckCircle2 size={16} color="#10b981" />
                                    <span>Curbside pickup available — call when you pull into parking bay 3.</span>
                                </div>
                            </div>

                            <div className="multi-fields">
                                <input
                                    required
                                    name="firstName"
                                    onChange={onChangeHandler}
                                    value={data.firstName}
                                    type="text"
                                    placeholder="Pickup Person Name"
                                    id="order-firstname"
                                />
                                <input
                                    required
                                    name="phone"
                                    onChange={onChangeHandler}
                                    value={data.phone}
                                    type="tel"
                                    placeholder="Mobile Phone (for SMS ready alert)"
                                    id="order-phone"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="dinein-info-box animate-fade">
                            <div className="form-section-title">
                                <Utensils size={22} className="section-icon" />
                                <div>
                                    <h2>Dine-In Quick Table Ordering</h2>
                                    <p className="form-sub">Dishes will be delivered directly from the kitchen to your table</p>
                                </div>
                            </div>

                            <div className="table-select-box">
                                <label className="sub-field-label">Select Your Table Number:</label>
                                <div className="table-pills-row">
                                    {['Table 1', 'Table 2', 'Table 4', 'Table 6', 'Table 9', 'Bar 3', 'Patio 2'].map(t => (
                                        <button
                                            type="button"
                                            key={t}
                                            className={`table-pill ${tableNumber === t ? 'active' : ''}`}
                                            onClick={() => setTableNumber(t)}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="multi-fields">
                                <input
                                    required
                                    name="firstName"
                                    onChange={onChangeHandler}
                                    value={data.firstName}
                                    type="text"
                                    placeholder="Guest Name"
                                    id="order-firstname"
                                />
                                <input
                                    required
                                    name="phone"
                                    onChange={onChangeHandler}
                                    value={data.phone}
                                    type="tel"
                                    placeholder="Contact Phone"
                                    id="order-phone"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Side: Order Summary & Checkout */}
                <div className="place-order-right">
                    <div className="cart-total-card">
                        <div className="form-section-title">
                            <CreditCard size={22} className="section-icon" />
                            <div>
                                <h2>Payment & Review</h2>
                                <p className="form-sub">Instant verification & secure processing</p>
                            </div>
                        </div>

                        {/* Order Type Badge summary */}
                        <div className="order-mode-summary-pill">
                            <span className="oms-label">Fulfillment:</span>
                            <span className="oms-value">
                                {orderType === 'delivery' ? '🛵 Doorstep Delivery' : orderType === 'pickup' ? '🛍️ Store Pickup' : `🍽️ Dine-In (${tableNumber})`}
                            </span>
                        </div>

                        <div className="cart-total-details">
                            <div className="cart-line-item">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <hr />
                            <div className="cart-line-item">
                                <span>Delivery Fee</span>
                                <span>{deliveryFee === 0 ? <strong style={{ color: '#059669' }}>FREE</strong> : `$${deliveryFee.toFixed(2)}`}</span>
                            </div>
                            <hr />
                            <div className="cart-line-item grand-total">
                                <strong>Total</strong>
                                <strong>${finalTotal.toFixed(2)}</strong>
                            </div>
                        </div>

                        <div className="security-badge">
                            <ShieldCheck size={18} className="shield-icon" />
                            <span>256-Bit SSL Encrypted & Protected Checkout</span>
                        </div>

                        <button
                            type="submit"
                            className="checkout-cta-btn"
                            disabled={isSubmitting}
                            id="order-submit-btn"
                        >
                            <span>{isSubmitting ? "Processing..." : `PAY & PLACE ${orderType.toUpperCase()} ORDER`}</span>
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default PlaceOrder;
