import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Package,
    RefreshCw,
    Clock,
    CheckCircle2,
    Truck,
    ChefHat,
    FileText,
    ChevronRight,
    Zap,
    Receipt,
    X,
    Store,
    Utensils,
    MapPin,
    Flame,
    Sparkles,
    Headphones,
    Music,
    RotateCcw,
    Star,
    PhoneCall,
    MessageSquare,
    AlertCircle,
    Navigation,
    ShieldCheck
} from 'lucide-react';
import { StoreContext } from '../../context/StoreContext';
import { triggerHaptic } from '../../utils/haptics';
import './MyOrders.css';

const STEPS = [
    { key: 'placed', label: 'Order Placed', icon: FileText },
    { key: 'Food Processing', label: 'Kitchen Preparing', icon: ChefHat },
    { key: 'Out for delivery', label: 'Out for Delivery', icon: Truck },
    { key: 'Delivered', label: 'Delivered', icon: CheckCircle2 }
];

const RATING_TAGS = [
    "Piping Hot ♨️",
    "Super Fast ⚡",
    "Bursting with Flavor 🌶️",
    "Crispy Naans 🫓",
    "Spill-proof Pack 📦",
    "Polite Rider 🛵"
];

const MyOrders = () => {
    const {
        url,
        token,
        showToast,
        localOrders = [],
        updateLocalOrderStatus,
        addToCart,
        food_list,
        setHelpModalOpen
    } = useContext(StoreContext);

    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);
    const [receiptOrder, setReceiptOrder] = useState(null);
    
    // Rating Modal State
    const [ratingOrder, setRatingOrder] = useState(null);
    const [starRating, setStarRating] = useState(5);
    const [selectedTags, setSelectedTags] = useState(["Piping Hot ♨️", "Super Fast ⚡"]);
    const [ratingNotes, setRatingNotes] = useState("");

    const fetchOrders = async (silent = false) => {
        let serverOrders = [];
        if (token) {
            try {
                if (!silent) setIsRefreshing(true);
                const response = await axios.post(
                    `${url}/api/order/userorders`,
                    {},
                    { headers: { token } }
                );
                if (response.data && response.data.success && Array.isArray(response.data.data)) {
                    serverOrders = response.data.data;
                }
            } catch (error) {
                console.warn("Could not fetch remote orders, relying on persistent local orders:", error);
            }
        }

        // Merge serverOrders and localOrders (deduplicate by _id)
        const combined = [...localOrders];
        serverOrders.forEach(srvOrder => {
            const exists = combined.some(o => o._id === srvOrder._id);
            if (!exists) {
                combined.push(srvOrder);
            }
        });

        // Sort latest first
        combined.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

        setData(combined);
        setLoading(false);
        if (!silent) setIsRefreshing(false);
    };

    useEffect(() => {
        fetchOrders();
    }, [token, localOrders]);

    const getStepIndex = (status) => {
        if (status === 'Delivered') return 3;
        if (status === 'Out for delivery') return 2;
        if (status === 'Food Processing') return 1;
        return 0; // placed
    };

    const handleAdvanceStatus = async (orderId, currentStatus) => {
        triggerHaptic('light');
        let nextStatus = 'Food Processing';
        if (currentStatus === 'placed') nextStatus = 'Food Processing';
        else if (currentStatus === 'Food Processing') nextStatus = 'Out for delivery';
        else if (currentStatus === 'Out for delivery') nextStatus = 'Delivered';
        else if (currentStatus === 'Delivered') nextStatus = 'Food Processing';

        setUpdatingId(orderId);

        // Update in context & local storage immediately
        if (updateLocalOrderStatus) {
            updateLocalOrderStatus(orderId, nextStatus);
        }

        // Also update local state
        setData(prev => prev.map(o => o._id === orderId ? { ...o, status: nextStatus } : o));

        if (token) {
            try {
                await axios.post(`${url}/api/order/status`, {
                    orderId,
                    status: nextStatus
                });
            } catch (error) {
                console.warn("Remote status update skipped, maintained locally:", error.message);
            }
        }

        showToast(`Order status updated to "${nextStatus}"! 🛵`, 'success');
        setUpdatingId(null);
    };

    const handleReorder = (order) => {
        triggerHaptic('success');
        if (!order.items || order.items.length === 0) return;

        order.items.forEach(it => {
            const matchedFood = food_list.find(f => f._id === it._id || f.name === it.name) || it;
            addToCart(matchedFood._id || it._id, it.quantity || 1, true, {
                size: it.size || 'Regular',
                spice: it.spice || 'Medium',
                addOns: it.addOns || [],
                unitPrice: it.price || matchedFood.price || 12
            });
        });

        showToast(`Added ${order.items.length} item(s) from this order back to your cart! 🛍️`, 'success');
        navigate('/cart');
    };

    const handleOpenRating = (order) => {
        triggerHaptic('selection');
        setRatingOrder(order);
        setStarRating(5);
        setSelectedTags(["Piping Hot ♨️", "Super Fast ⚡"]);
        setRatingNotes("");
    };

    const handleSubmitRating = () => {
        triggerHaptic('success');
        const existingRatings = JSON.parse(localStorage.getItem('naanstop_ratings') || '{}');
        existingRatings[ratingOrder._id] = {
            stars: starRating,
            tags: selectedTags,
            notes: ratingNotes,
            date: new Date().toISOString()
        };
        localStorage.setItem('naanstop_ratings', JSON.stringify(existingRatings));

        showToast(`Thank you! Rated ${starRating} ⭐. Raju Bhaiya and kitchen notified!`, 'success');
        setRatingOrder(null);
    };

    const toggleRatingTag = (tag) => {
        triggerHaptic('light');
        setSelectedTags(prev => 
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    return (
        <div className="my-orders-page animate-fade">
            <div className="cart-header-breadcrumb">
                <Link to="/" className="crumb-link">Home</Link>
                <span>/</span>
                <span className="crumb-active">My Orders</span>
            </div>

            <div className="orders-top-bar">
                <div>
                    <h1 className="my-orders-title">Order History & Live Tracking</h1>
                    <p className="my-orders-sub">Monitor live kitchen preparations, Raju Bhaiya's delivery bike, and instant digital receipts</p>
                </div>
                <button
                    onClick={() => fetchOrders(false)}
                    className="refresh-orders-btn"
                    disabled={isRefreshing}
                    id="refresh-orders-btn"
                >
                    <RefreshCw size={16} className={isRefreshing ? "spin-icon" : ""} />
                    <span>Refresh Status</span>
                </button>
            </div>

            {/* Waiting for Food Music Callout Banner */}
            <div className="waiting-music-banner">
                <div className="music-banner-left">
                    <div className="music-banner-avatar">
                        <Headphones size={24} />
                    </div>
                    <div>
                        <div className="music-banner-tag">
                            <span>🌶️ NaanStop Radio</span>
                            <span className="live-dot-pulse">● LIVE DESI AMBIENCE</span>
                        </div>
                        <h3 className="music-banner-title">Waiting for your tandoori feast? Tune into Desi vibes</h3>
                        <p className="music-banner-desc">
                            Enjoy soothing Bollywood acoustic guitar, tapri chai monsoon rain, and highway dhaba lofi while Raju Bhaiya speeds to your doorstep!
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => {
                        window.dispatchEvent(new CustomEvent('open-music-player', { detail: { play: true } }));
                    }}
                    className="music-banner-cta"
                    id="play-waiting-music-btn"
                >
                    <Music size={16} />
                    <span>Play Desi Beats 🎵</span>
                </button>
            </div>

            {loading ? (
                <div className="orders-loading">
                    <div className="orders-spinner"></div>
                    <p>Loading your orders...</p>
                </div>
            ) : data.length === 0 ? (
                <div className="orders-empty-state">
                    <div className="empty-package-circle">
                        <Package size={46} />
                    </div>
                    <h2>No orders yet!</h2>
                    <p>You haven't placed any delicious orders with us yet. Let's find something appetizing from the kitchen.</p>
                    <Link to="/" className="cart-explore-btn">
                        Order Food Now
                    </Link>
                </div>
            ) : (
                <div className="my-orders-container">
                    {data.map((order, index) => {
                        const totalItemCount = (order.items || []).reduce((acc, curr) => acc + (curr.quantity || 1), 0);
                        const formattedDate = order.date ? new Date(order.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                        }) : "Just now";
                        const currentStepIdx = getStepIndex(order.status);
                        const orderType = order.orderType || 'delivery';
                        const isDelivered = order.status === 'Delivered';
                        const isLiveOnRoad = order.status === 'Out for delivery';

                        return (
                            <div key={order._id || index} className="my-orders-order-card" id={`order-card-${order._id}`}>
                                {/* Order Card Header */}
                                <div className="order-card-header">
                                    <div className="order-id-group">
                                        <div className="order-parcel-avatar">
                                            <Package size={22} />
                                        </div>
                                        <div>
                                            <div className="order-num-row">
                                                <span className="order-num-label">Order #{String(order._id || 'NS8890').slice(-6).toUpperCase()}</span>
                                                <span className={`order-type-chip ${orderType}`}>
                                                    {orderType === 'delivery' ? '🛵 Express Delivery' : orderType === 'pickup' ? '🛍️ Store Pickup' : `🍽️ Dine-In (${order.tableNumber || 'Table'})`}
                                                </span>
                                                {order.outlet && (
                                                    <span className="order-outlet-chip" title="Fulfilling Cloud Kitchen Hub">
                                                        📍 {order.outlet.name}
                                                    </span>
                                                )}
                                                {order.paymentMethod && (
                                                    <span className="order-paymethod-chip">
                                                        {order.paymentMethod === 'upi' ? '⚡ UPI / GPay' : order.paymentMethod === 'cod' ? '💵 COD' : '💳 Card'}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="order-date-text">
                                                {formattedDate} {order.scheduledFor ? `• ${order.scheduledFor}` : ''}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="order-header-right">
                                        <span className="order-total-price">${Number(order.amount || 0).toFixed(2)}</span>
                                        <span className={`order-status-pill ${(order.status || 'placed').toLowerCase().replace(/\s+/g, '-')}`}>
                                            <span className="pulsing-status-dot"></span>
                                            <span>{order.status || 'Placed'}</span>
                                        </span>
                                    </div>
                                </div>

                                {/* Order Items Summary */}
                                <div className="order-dishes-summary">
                                    <span className="dishes-list-label">Dishes ({totalItemCount}):</span>
                                    <span className="dishes-list-content">
                                        {(order.items || []).map((item, idx) => (
                                            <span key={idx} className="order-item-tag">
                                                {item.name} {item.size && item.size !== 'Regular' ? `(${item.size})` : ''} × {item.quantity || 1}
                                            </span>
                                        ))}
                                    </span>
                                </div>

                                {/* Visual Milestone Stepper */}
                                <div className="order-milestone-stepper">
                                    <div className="stepper-track-bar">
                                        <div
                                            className="stepper-progress-fill"
                                            style={{ width: `${(currentStepIdx / (STEPS.length - 1)) * 100}%` }}
                                        />
                                    </div>
                                    <div className="stepper-steps-wrapper">
                                        {STEPS.map((step, sIdx) => {
                                            const isDone = sIdx <= currentStepIdx;
                                            const isCurrent = sIdx === currentStepIdx;
                                            const StepIcon = step.icon;

                                            return (
                                                <div
                                                    key={step.key}
                                                    className={`stepper-node ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}
                                                >
                                                    <div className="stepper-node-circle">
                                                        <StepIcon size={14} />
                                                    </div>
                                                    <span className="stepper-node-label">{step.label}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Animated Live Route Map Simulator Card for active delivery */}
                                {orderType === 'delivery' && !isDelivered && (
                                    <div className="live-route-simulator-card">
                                        <div className="route-card-header">
                                            <div className="route-header-title">
                                                <span className="route-radar-dot"></span>
                                                <strong>Live GPS Telemetry</strong>
                                                <span className="route-speed-pill">34 km/h • On Schedule</span>
                                            </div>
                                            <span className="route-eta-countdown">
                                                <Clock size={13} /> {isLiveOnRoad ? 'Arriving in ~14 mins' : 'Kitchen preparing fresh'}
                                            </span>
                                        </div>

                                        {/* Road Animation Graphic */}
                                        <div className="route-visual-highway">
                                            <div className="route-point kitchen">
                                                <div className="point-icon-box">🍲</div>
                                                <span className="point-label">NaanStop Kitchen</span>
                                            </div>

                                            <div className="route-road-track">
                                                <div className="road-dashed-line"></div>
                                                <div 
                                                    className={`road-delivery-bike ${isLiveOnRoad ? 'bike-moving' : 'bike-stationary'}`}
                                                    style={{ left: isLiveOnRoad ? '60%' : '18%' }}
                                                >
                                                    <span className="bike-icon">🛵</span>
                                                    <span className="bike-driver-tag">Raju Bhaiya</span>
                                                </div>
                                            </div>

                                            <div className="route-point destination">
                                                <div className="point-icon-box">📍</div>
                                                <span className="point-label">Your Doorstep</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Delivery Partner Live Tracker Card (Raju Bhaiya) */}
                                {orderType === 'delivery' && (
                                    <div className="rider-tracking-card">
                                        <div className="rider-avatar-col">
                                            <div className="rider-avatar-ring">
                                                <span className="rider-avatar-emoji">🛵</span>
                                                <span className="rider-live-pulse" title="Live on GPS"></span>
                                            </div>
                                        </div>
                                        <div className="rider-details-col">
                                            <div className="rider-name-row">
                                                <h4 className="rider-name">{order.rider?.name || "Raju Bhaiya"}</h4>
                                                <span className="rider-vehicle-pill">{order.rider?.vehicle || "Hero Splendor • KA-03-HA-7788"}</span>
                                            </div>
                                            <div className="rider-metrics-row">
                                                <span className="rider-rating">⭐ {order.rider?.rating || 4.9} ({order.rider?.trips || "1,420"} deliveries)</span>
                                                <span className="rider-eta-badge">
                                                    <Clock size={12} /> {isDelivered ? 'Delivered with hot bag' : `ETA: ~${order.etaMins || (isLiveOnRoad ? 14 : 25)} mins`}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="rider-contact-actions">
                                            <a 
                                                href="tel:+919876543210" 
                                                className="rider-call-btn"
                                                title="Call Raju Bhaiya directly"
                                                onClick={() => triggerHaptic('selection')}
                                            >
                                                <PhoneCall size={13} />
                                                <span>Call Raju</span>
                                            </a>
                                            <button 
                                                type="button" 
                                                className="rider-chai-tip-cta"
                                                onClick={() => {
                                                    triggerHaptic('success');
                                                    showToast("Chai tip ($1.50) sent to Raju Bhaiya! Dhanyawad! ☕", "success");
                                                }}
                                                title="Send chai tip to Raju Bhaiya"
                                            >
                                                <span>Tip Chai ☕</span>
                                                <span className="chai-amt">${order.riderTip ? Number(order.riderTip).toFixed(2) : '1.50'}</span>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Doorstep Handover 4-Digit Security PIN (Swiggy / Zomato Handover OTP) */}
                                {orderType === 'delivery' && (
                                    <div className={`doorstep-pin-card ${isDelivered ? 'verified' : 'pending'}`}>
                                        <div className="doorstep-pin-left">
                                            <div className="doorstep-pin-shield">
                                                <ShieldCheck size={22} />
                                            </div>
                                            <div className="doorstep-pin-info">
                                                <div className="doorstep-pin-header">
                                                    <span className="doorstep-pin-title">🔐 Doorstep Handover PIN</span>
                                                    <span className={`doorstep-pin-badge ${isDelivered ? 'verified' : 'active'}`}>
                                                        {isDelivered ? '✓ Handover Verified' : 'Share with Rider at Doorstep'}
                                                    </span>
                                                </div>
                                                <p className="doorstep-pin-hint">
                                                    {isDelivered
                                                        ? 'Delivery successfully completed and verified via secure 4-digit handover code.'
                                                        : 'Share this confidential 4-digit code with Raju Bhaiya when receiving your order to verify handover.'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="doorstep-pin-right">
                                            <div className="doorstep-pin-digits" title="4-Digit Secure Verification PIN">
                                                {String(order.deliveryPin || '7310').split('').map((digit, dIdx) => (
                                                    <span key={dIdx} className="pin-digit-box">{digit}</span>
                                                ))}
                                            </div>
                                            {!isDelivered && (
                                                <Link to="/rider" className="doorstep-rider-switch-link" title="Open Delivery Partner Console">
                                                    <span>Open Rider Console 🛵</span>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Order Card Footer */}
                                <div className="order-card-footer">
                                    <div className="order-address-snippet">
                                        {orderType === 'delivery' ? (
                                            <span><MapPin size={14} /> Deliver to: {order.address ? `${order.address.street || ''}, ${order.address.city || ''}` : 'Home Address'}</span>
                                        ) : orderType === 'pickup' ? (
                                            <span><Store size={14} /> Pickup at: NaanStop Flagship, 120 Chandni Chowk Lane (Counter)</span>
                                        ) : (
                                            <span><Utensils size={14} /> Royal Dine-In to: {order.tableNumber || 'Table 4'}</span>
                                        )}
                                    </div>

                                    <div className="card-footer-buttons">
                                        {/* Reorder Button */}
                                        <button
                                            onClick={() => handleReorder(order)}
                                            className="reorder-action-btn"
                                            title="Add items from this order back into your cart"
                                        >
                                            <RotateCcw size={14} />
                                            <span>Order Again</span>
                                        </button>

                                        {/* Rate Meal Button (Delivered or Placed) */}
                                        <button
                                            onClick={() => handleOpenRating(order)}
                                            className="rate-meal-btn"
                                            title="Rate dishes & delivery experience"
                                        >
                                            <Star size={14} />
                                            <span>Rate Meal</span>
                                        </button>

                                        {/* View Receipt */}
                                        <button
                                            onClick={() => setReceiptOrder(order)}
                                            className="view-receipt-btn"
                                            title="View detailed receipt breakdown with sizes & customizations"
                                        >
                                            <Receipt size={14} />
                                            <span>Receipt</span>
                                        </button>

                                        {/* Simulate Next Stage */}
                                        <button
                                            onClick={() => handleAdvanceStatus(order._id, order.status)}
                                            className="advance-stage-btn"
                                            disabled={updatingId === order._id}
                                            title="Advance order milestone (Placed -> Processing -> Out for delivery -> Delivered)"
                                            id={`simulate-btn-${order._id}`}
                                        >
                                            <Zap size={14} />
                                            <span>{updatingId === order._id ? 'Updating...' : 'Next Stage ⚡'}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Detailed Order Receipt Modal */}
            {receiptOrder && (
                <div className="receipt-modal-backdrop" onClick={() => setReceiptOrder(null)}>
                    <div className="receipt-modal-container animate-scale-up" onClick={(e) => e.stopPropagation()}>
                        <div className="receipt-header">
                            <div>
                                <span className="receipt-sub-tag">Order Receipt & Details</span>
                                <h2>Order #{String(receiptOrder._id || 'NS8890').slice(-6).toUpperCase()}</h2>
                            </div>
                            <button
                                className="receipt-close-btn"
                                onClick={() => setReceiptOrder(null)}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="receipt-meta-banner">
                            <div className="rmb-item">
                                <span className="rmb-label">Status</span>
                                <span className="rmb-value status-badge">{receiptOrder.status || 'Placed'}</span>
                            </div>
                            <div className="rmb-item">
                                <span className="rmb-label">Fulfillment</span>
                                <span className="rmb-value">
                                    {receiptOrder.orderType === 'delivery' ? '🛵 Delivery' : receiptOrder.orderType === 'pickup' ? '🛍️ Pickup' : `🍽️ Dine-In`}
                                </span>
                            </div>
                            <div className="rmb-item">
                                <span className="rmb-label">Payment</span>
                                <span className="rmb-value">
                                    {receiptOrder.paymentMethod ? receiptOrder.paymentMethod.toUpperCase() : 'PAID'}
                                </span>
                            </div>
                        </div>

                        {/* Items Breakdown */}
                        <div className="receipt-items-section">
                            <h3>Items Ordered ({(receiptOrder.items || []).length})</h3>
                            <div className="receipt-items-list">
                                {(receiptOrder.items || []).map((it, idx) => (
                                    <div key={idx} className="receipt-item-row">
                                        <div className="item-row-left">
                                            <span className="item-qty-badge">{it.quantity || 1}x</span>
                                            <div>
                                                <div className="item-name-row">
                                                    <span className="it-name">{it.name}</span>
                                                    {it.size && (
                                                        <span className="it-size-badge">{it.size}</span>
                                                    )}
                                                </div>
                                                {it.spice && (
                                                    <span className="it-spice-tag">{it.spice}</span>
                                                )}
                                                {it.addOns && it.addOns.length > 0 && (
                                                    <div className="it-addons-row">
                                                        <Sparkles size={12} />
                                                        <span>{it.addOns.join(', ')}</span>
                                                    </div>
                                                )}
                                                {it.notes && (
                                                    <p className="it-notes-text">"{it.notes}"</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="item-row-right">
                                            <span className="it-price">${(Number(it.price || 0) * Number(it.quantity || 1)).toFixed(2)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Pricing Summary */}
                        <div className="receipt-pricing-summary">
                            {receiptOrder.billDetails ? (
                                <>
                                    <div className="rps-row">
                                        <span>Item Total</span>
                                        <span>${Number(receiptOrder.billDetails.subtotal || 0).toFixed(2)}</span>
                                    </div>
                                    {receiptOrder.billDetails.packagingFee > 0 && (
                                        <div className="rps-row">
                                            <span>Packaging Fee 🥡</span>
                                            <span>${Number(receiptOrder.billDetails.packagingFee).toFixed(2)}</span>
                                        </div>
                                    )}
                                    {receiptOrder.billDetails.platformFee > 0 && (
                                        <div className="rps-row">
                                            <span>Platform Fee ⚡</span>
                                            <span>${Number(receiptOrder.billDetails.platformFee).toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="rps-row">
                                        <span>Delivery Partner Fee 🛵</span>
                                        <span>{receiptOrder.billDetails.deliveryFee === 0 ? 'FREE' : `$${Number(receiptOrder.billDetails.deliveryFee).toFixed(2)}`}</span>
                                    </div>
                                    {receiptOrder.billDetails.discount > 0 && (
                                        <div className="rps-row" style={{ color: '#059669' }}>
                                            <span>Promo Discount 🎟️</span>
                                            <span>-${Number(receiptOrder.billDetails.discount).toFixed(2)}</span>
                                        </div>
                                    )}
                                    {receiptOrder.billDetails.coinsDeduction > 0 && (
                                        <div className="rps-row" style={{ color: '#059669' }}>
                                            <span>NaanCoins Redeemed 🪙</span>
                                            <span>-${Number(receiptOrder.billDetails.coinsDeduction).toFixed(2)}</span>
                                        </div>
                                    )}
                                    {receiptOrder.billDetails.appliedTip > 0 && (
                                        <div className="rps-row" style={{ color: '#d97706', fontWeight: 600 }}>
                                            <span>Rider Chai Tip ☕</span>
                                            <span>+${Number(receiptOrder.billDetails.appliedTip).toFixed(2)}</span>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    <div className="rps-row">
                                        <span>Subtotal</span>
                                        <span>${(Math.max(0, (receiptOrder.amount || 0) - (receiptOrder.orderType === 'delivery' ? 2 : 0))).toFixed(2)}</span>
                                    </div>
                                    <div className="rps-row">
                                        <span>Fulfillment Fee</span>
                                        <span>{receiptOrder.orderType === 'delivery' ? '$2.00' : 'FREE $0.00'}</span>
                                    </div>
                                </>
                            )}
                            <div className="rps-row total">
                                <strong>Total Paid</strong>
                                <strong>${Number(receiptOrder.amount || 0).toFixed(2)}</strong>
                            </div>
                            {receiptOrder.outlet && (
                                <div style={{ marginTop: '10px', fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span>📍 Fulfilling Hub:</span>
                                    <strong style={{ color: '#0f172a' }}>{receiptOrder.outlet.name} ({receiptOrder.outlet.city})</strong>
                                </div>
                            )}
                        </div>

                        {/* Delivery or Pickup destination */}
                        <div className="receipt-destination-box">
                            <h4>{receiptOrder.orderType === 'delivery' ? 'Delivery Address' : receiptOrder.orderType === 'pickup' ? 'Pickup Store' : 'Dine-In Location'}</h4>
                            <p>
                                {receiptOrder.orderType === 'delivery' && receiptOrder.address ? (
                                    `${receiptOrder.address.firstName || ''} ${receiptOrder.address.lastName || ''}, ${receiptOrder.address.street || ''}, ${receiptOrder.address.city || ''}, ${receiptOrder.address.state || ''} ${receiptOrder.address.zipcode || ''} • Tel: ${receiptOrder.address.phone || ''}`
                                ) : receiptOrder.orderType === 'pickup' ? (
                                    'NaanStop Desi Culinary Flagship: 120 Chandni Chowk Lane, Gourmet Quarter • Contact: (555) 839-2049'
                                ) : (
                                    `Table: ${receiptOrder.tableNumber || 'Table 4'} (Server will deliver dishes directly to table)`
                                )}
                            </p>
                        </div>

                        <div className="receipt-modal-actions">
                            <button
                                onClick={() => setReceiptOrder(null)}
                                className="close-receipt-btn"
                            >
                                Close Receipt
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Rate Meal Modal */}
            {ratingOrder && (
                <div className="receipt-modal-backdrop" onClick={() => setRatingOrder(null)}>
                    <div className="rating-modal-container animate-scale-up" onClick={(e) => e.stopPropagation()}>
                        <div className="rating-modal-header">
                            <div>
                                <span className="rating-badge-tag">Customer Feedback</span>
                                <h3>Rate Your Experience</h3>
                                <p className="rating-sub">Order #{String(ratingOrder._id || 'NS8890').slice(-6).toUpperCase()}</p>
                            </div>
                            <button className="receipt-close-btn" onClick={() => setRatingOrder(null)}>
                                <X size={20} />
                            </button>
                        </div>

                        {/* Star Selection */}
                        <div className="rating-stars-row">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className={`star-select-btn ${star <= starRating ? 'active' : ''}`}
                                    onClick={() => {
                                        triggerHaptic('light');
                                        setStarRating(star);
                                    }}
                                >
                                    <Star size={32} fill={star <= starRating ? '#f59e0b' : 'none'} color={star <= starRating ? '#f59e0b' : '#cbd5e1'} />
                                </button>
                            ))}
                        </div>
                        <p className="star-rating-label">
                            {starRating === 5 ? "Outstanding! Lazeez! 🌟🌟🌟🌟🌟" :
                             starRating === 4 ? "Very Delicious & Fresh! 😋" :
                             starRating === 3 ? "Good, met expectations 👍" :
                             starRating === 2 ? "Could be better 😕" : "Not satisfied 😞"}
                        </p>

                        {/* Compliment Tags */}
                        <div className="rating-tags-section">
                            <label>What did you love most?</label>
                            <div className="rating-tags-grid">
                                {RATING_TAGS.map((tag) => (
                                    <button
                                        key={tag}
                                        type="button"
                                        className={`tag-pill-btn ${selectedTags.includes(tag) ? 'selected' : ''}`}
                                        onClick={() => toggleRatingTag(tag)}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="rating-notes-section">
                            <label>Kitchen & Rider note (optional):</label>
                            <textarea
                                rows={3}
                                placeholder="E.g. Butter chicken was exceptional, Raju delivered piping hot..."
                                value={ratingNotes}
                                onChange={(e) => setRatingNotes(e.target.value)}
                            />
                        </div>

                        <button 
                            type="button" 
                            className="submit-rating-btn"
                            onClick={handleSubmitRating}
                        >
                            Submit Feedback ⭐
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyOrders;
