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
    const { 
        getTotalCartAmount, 
        token, 
        food_list, 
        cartItems, 
        cartCustomizations, 
        url,
        riderTip,
        setRiderTip,
        savedAddresses,
        addLocalOrder,
        userProfile,
        setCartItems,
        showToast
    } = useContext(StoreContext);
    const navigate = useNavigate();

    // Fulfillment & Timing states (KitchenAsty feature)
    const [orderType, setOrderType] = useState('delivery'); // 'delivery' | 'pickup' | 'dine-in'
    const [scheduleType, setScheduleType] = useState('asap'); // 'asap' | 'later'
    const [scheduledTime, setScheduledTime] = useState('7:30 PM');
    const [tableNumber, setTableNumber] = useState('Table 4');
    const [paymentMode, setPaymentMode] = useState('upi'); // 'upi' | 'card' | 'cod' | 'netbanking'
    const [selectedAddressId, setSelectedAddressId] = useState(savedAddresses[0]?.id || null);

    const [data, setData] = useState({
        firstName: userProfile?.name ? userProfile.name.split(' ')[0] : "Rohan",
        lastName: userProfile?.name && userProfile.name.split(' ').length > 1 ? userProfile.name.split(' ').slice(1).join(' ') : "Sharma",
        email: userProfile?.email || "rohan.desi@naanstop.com",
        street: savedAddresses[0]?.street || "742 Evergreen Terrace",
        city: savedAddresses[0]?.city || "Springfield",
        state: savedAddresses[0]?.state || "OR",
        zipcode: savedAddresses[0]?.zipcode || "97477",
        country: "United States",
        phone: userProfile?.phone || savedAddresses[0]?.phone || "+1-555-0199"
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    };

    const handleSelectSavedAddress = (addr) => {
        setSelectedAddressId(addr.id);
        setData(prev => ({
            ...prev,
            street: addr.street,
            city: addr.city,
            state: addr.state || 'OR',
            zipcode: addr.zipcode || '97477',
            phone: addr.phone || prev.phone
        }));
        showToast(`Selected "${addr.label}" delivery address 📍`, 'info');
    };

    const subtotal = getTotalCartAmount();
    const deliveryFee = orderType === 'delivery' ? (subtotal === 0 ? 0 : 2) : 0;
    const appliedTip = orderType === 'delivery' ? (riderTip || 0) : 0;
    const finalTotal = subtotal + deliveryFee + appliedTip;

    const onPlaceOrder = async (event) => {
        event.preventDefault();
        setErrorMessage("");

        let orderItems = [];
        food_list.forEach((item) => {
            if (cartItems[item._id] > 0) {
                const custom = cartCustomizations[item._id] || {};
                let itemInfo = {
                    ...item,
                    quantity: cartItems[item._id],
                    size: custom.size || "Single Plate / Handi",
                    addOns: custom.addOns || [],
                    spice: custom.spice || "Medium 🌶️",
                    isJain: custom.isJain || false,
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

        setIsSubmitting(true);
        const orderId = `order_${Date.now()}`;
        const placedOrder = {
            _id: orderId,
            date: new Date().toISOString(),
            status: "Food Processing",
            payment: paymentMode !== 'cod',
            paymentMode: paymentMode,
            orderType: orderType,
            scheduledFor: scheduleType === 'asap' ? 'ASAP (25-35 mins)' : `Scheduled for ${scheduledTime}`,
            tableNumber: orderType === 'dine-in' ? tableNumber : null,
            pickupTime: orderType === 'pickup' ? (scheduleType === 'asap' ? 'Ready in 15-20 mins' : scheduledTime) : null,
            riderTip: appliedTip,
            etaMins: 22,
            rider: {
                name: "Raju Bhaiya",
                vehicle: "Hero Splendor • KA-01-EA-2026",
                rating: 4.9,
                deliveries: 1420,
                phone: "+91 98765 43210",
                vaccinated: true,
                status: "Preparing hot fresh pack at NaanStop Kitchen"
            },
            userId: token ? (userProfile?.email || "user_registered") : "guest_user",
            items: orderItems,
            amount: finalTotal,
            address: data
        };

        // Add to persistent local orders
        addLocalOrder(placedOrder);
        setCartItems({});

        // Background sync with backend if available
        if (token) {
            try {
                await axios.post(
                    `${url}/api/order/place`,
                    placedOrder,
                    { headers: { token }, timeout: 3000 }
                );
            } catch (error) {
                console.warn("Order saved locally; backend deferred:", error.message);
            }
        }

        showToast(`Order #${orderId.slice(-6)} placed with kitchen! Raju Bhaiya is on the way 🛵🎉`, 'success', 4000);
        setIsSubmitting(false);
        navigate('/myorders');
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

                            {savedAddresses && savedAddresses.length > 0 && (
                                <div className="saved-addr-quick-select">
                                    <span className="saqs-label">Saved Addresses:</span>
                                    <div className="saqs-pills">
                                        {savedAddresses.map((addr) => (
                                            <button
                                                key={addr.id}
                                                type="button"
                                                className={`saqs-pill ${selectedAddressId === addr.id ? 'active' : ''}`}
                                                onClick={() => handleSelectSavedAddress(addr)}
                                            >
                                                <span className="saqs-dot">{addr.tag === 'home' ? '🏠' : addr.tag === 'work' ? '🏢' : '📍'}</span>
                                                <span>{addr.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

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
                                    <p className="form-sub">Pick up your freshly packed meal at our royal takeaway counter</p>
                                </div>
                            </div>

                            <div className="pickup-location-card">
                                <div className="pl-badge">Ready in 15 mins • No Delivery Fee</div>
                                <h3 className="pl-name">🌶️ NaanStop Desi Culinary Flagship</h3>
                                <p className="pl-addr">120 Chandni Chowk Lane, Gourmet Quarter, Springfield, OR</p>
                                <p className="pl-hours">Open Daily: 11:00 AM – 11:00 PM • Tandoor Fired All Day!</p>
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

                        {/* Chai Tipping Section for Delivery */}
                        {orderType === 'delivery' && (
                            <div className="chai-tip-card">
                                <div className="chai-tip-header">
                                    <span className="tip-title">☕ Chai for Raju Bhaiya (Delivery Partner)</span>
                                    <span className="tip-sub">100% directly transferred to your rider</span>
                                </div>
                                <div className="chai-tip-pill-group">
                                    {[
                                        { val: 0, label: 'None' },
                                        { val: 1, label: '$1' },
                                        { val: 2, label: '$2 ⭐' },
                                        { val: 3, label: '$3' }
                                    ].map(t => (
                                        <button
                                            key={t.val}
                                            type="button"
                                            className={`chai-pill ${riderTip === t.val ? 'active' : ''}`}
                                            onClick={() => setRiderTip(t.val)}
                                        >
                                            {t.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Payment Mode Selector */}
                        <div className="payment-mode-section">
                            <div className="pms-header">
                                <h3>Select Payment Mode</h3>
                                <span className="pms-badge">Instant Verification</span>
                            </div>
                            <div className="payment-options-grid">
                                <button
                                    type="button"
                                    className={`payment-option-card ${paymentMode === 'upi' ? 'active' : ''}`}
                                    onClick={() => setPaymentMode('upi')}
                                    id="pay-mode-upi"
                                >
                                    <span className="pay-icon">📱</span>
                                    <div className="pay-label">
                                        <strong>UPI / Google Pay</strong>
                                        <span>GPay, PhonePe, Paytm, BHIM</span>
                                    </div>
                                    <span className="pay-radio"></span>
                                </button>

                                <button
                                    type="button"
                                    className={`payment-option-card ${paymentMode === 'card' ? 'active' : ''}`}
                                    onClick={() => setPaymentMode('card')}
                                    id="pay-mode-card"
                                >
                                    <span className="pay-icon">💳</span>
                                    <div className="pay-label">
                                        <strong>Credit / Debit Card</strong>
                                        <span>Visa, Mastercard, RuPay</span>
                                    </div>
                                    <span className="pay-radio"></span>
                                </button>

                                <button
                                    type="button"
                                    className={`payment-option-card ${paymentMode === 'cod' ? 'active' : ''}`}
                                    onClick={() => setPaymentMode('cod')}
                                    id="pay-mode-cod"
                                >
                                    <span className="pay-icon">💵</span>
                                    <div className="pay-label">
                                        <strong>Pay on Delivery</strong>
                                        <span>Cash / QR code on arrival</span>
                                    </div>
                                    <span className="pay-radio"></span>
                                </button>

                                <button
                                    type="button"
                                    className={`payment-option-card ${paymentMode === 'netbanking' ? 'active' : ''}`}
                                    onClick={() => setPaymentMode('netbanking')}
                                    id="pay-mode-netbanking"
                                >
                                    <span className="pay-icon">🏦</span>
                                    <div className="pay-label">
                                        <strong>Net Banking</strong>
                                        <span>HDFC, ICICI, SBI & others</span>
                                    </div>
                                    <span className="pay-radio"></span>
                                </button>
                            </div>
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
                            {appliedTip > 0 && (
                                <>
                                    <hr />
                                    <div className="cart-line-item" style={{ color: '#d97706', fontWeight: 600 }}>
                                        <span>Rider Chai Tip ☕</span>
                                        <span>+${appliedTip.toFixed(2)}</span>
                                    </div>
                                </>
                            )}
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
