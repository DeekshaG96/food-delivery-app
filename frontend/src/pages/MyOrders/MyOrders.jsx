import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
    Music
} from 'lucide-react';
import { StoreContext } from '../../context/StoreContext';
import './MyOrders.css';

const STEPS = [
    { key: 'placed', label: 'Order Placed', icon: FileText },
    { key: 'Food Processing', label: 'Kitchen Preparing', icon: ChefHat },
    { key: 'Out for delivery', label: 'Out for Delivery', icon: Truck },
    { key: 'Delivered', label: 'Delivered', icon: CheckCircle2 }
];

const MyOrders = () => {
    const { url, token, showToast } = useContext(StoreContext);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);
    const [receiptOrder, setReceiptOrder] = useState(null);

    const fetchOrders = async (silent = false) => {
        if (!token) return;
        try {
            if (!silent) setIsRefreshing(true);
            const response = await axios.post(
                `${url}/api/order/userorders`,
                {},
                { headers: { token } }
            );
            if (response.data.success) {
                setData(response.data.data);
            }
        } catch (error) {
            console.error("Fetch orders error:", error);
        } finally {
            setLoading(false);
            if (!silent) setIsRefreshing(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token]);

    const getStepIndex = (status) => {
        if (status === 'Delivered') return 3;
        if (status === 'Out for delivery') return 2;
        return 1; // Food Processing
    };

    const handleAdvanceStatus = async (orderId, currentStatus) => {
        let nextStatus = 'Food Processing';
        if (currentStatus === 'Food Processing') nextStatus = 'Out for delivery';
        else if (currentStatus === 'Out for delivery') nextStatus = 'Delivered';
        else if (currentStatus === 'Delivered') nextStatus = 'Food Processing';

        try {
            setUpdatingId(orderId);
            const res = await axios.post(`${url}/api/order/status`, {
                orderId,
                status: nextStatus
            });
            if (res.data.success) {
                showToast(`Order status updated to "${nextStatus}"! 🛵`, 'success');
                await fetchOrders(true);
            }
        } catch (error) {
            showToast('Failed to update status', 'error');
        } finally {
            setUpdatingId(null);
        }
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
                    <p className="my-orders-sub">Monitor live kitchen preparations, delivery milestones, and order customization receipts</p>
                </div>
                <button
                    onClick={() => fetchOrders(false)}
                    className="refresh-orders-btn"
                    disabled={isRefreshing}
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
                    <p>You haven't placed any delicious orders with us yet. Let's find something appetizing.</p>
                    <Link to="/" className="cart-explore-btn">
                        Order Food Now
                    </Link>
                </div>
            ) : (
                <div className="my-orders-container">
                    {data.map((order, index) => {
                        const totalItemCount = order.items.reduce((acc, curr) => acc + (curr.quantity || 1), 0);
                        const formattedDate = new Date(order.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                        });
                        const currentStepIdx = getStepIndex(order.status);
                        const orderType = order.orderType || 'delivery';

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
                                                <span className="order-num-label">Order #{String(order._id).slice(-6).toUpperCase()}</span>
                                                <span className={`order-type-chip ${orderType}`}>
                                                    {orderType === 'delivery' ? '🛵 Delivery' : orderType === 'pickup' ? '🛍️ Store Pickup' : `🍽️ Dine-In (${order.tableNumber || 'Table'})`}
                                                </span>
                                            </div>
                                            <span className="order-date-text">
                                                {formattedDate} {order.scheduledFor ? `• ${order.scheduledFor}` : ''}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="order-header-right">
                                        <span className="order-total-price">${Number(order.amount).toFixed(2)}</span>
                                        <span className={`order-status-pill ${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
                                            <span className="pulsing-status-dot"></span>
                                            <span>{order.status}</span>
                                        </span>
                                    </div>
                                </div>

                                {/* Order Items Summary */}
                                <div className="order-dishes-summary">
                                    <span className="dishes-list-label">Dishes:</span>
                                    <span className="dishes-list-content">
                                        {order.items.map((item, idx) => (
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
                                                    <Clock size={12} /> ETA: ~{order.etaMins || 22} mins • Hot Bag Secured
                                                </span>
                                            </div>
                                        </div>
                                        <div className="rider-chai-action-col">
                                            <button 
                                                type="button" 
                                                className="rider-chai-tip-cta"
                                                onClick={() => showToast("Chai tip sent to Raju Bhaiya! Dhanyawad! ☕", "success")}
                                                title="Send chai tip to Raju Bhaiya"
                                            >
                                                <span>Tip Chai ☕</span>
                                                <span className="chai-amt">${order.riderTip ? order.riderTip.toFixed(2) : '1.00'}</span>
                                            </button>
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
                                        <button
                                            onClick={() => setReceiptOrder(order)}
                                            className="view-receipt-btn"
                                            title="View detailed receipt breakdown with sizes & customizations"
                                        >
                                            <Receipt size={14} />
                                            <span>View Receipt</span>
                                        </button>

                                        <button
                                            onClick={() => handleAdvanceStatus(order._id, order.status)}
                                            className="advance-stage-btn"
                                            disabled={updatingId === order._id}
                                            title="Simulate order progressing to next delivery milestone"
                                            id={`simulate-btn-${order._id}`}
                                        >
                                            <Zap size={14} />
                                            <span>{updatingId === order._id ? 'Updating...' : 'Simulate Next Stage'}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Detailed Order Receipt Modal (Delivery App inspired) */}
            {receiptOrder && (
                <div className="receipt-modal-backdrop" onClick={() => setReceiptOrder(null)}>
                    <div className="receipt-modal-container animate-scale-up" onClick={(e) => e.stopPropagation()}>
                        <div className="receipt-header">
                            <div>
                                <span className="receipt-sub-tag">Order Receipt & Details</span>
                                <h2>Order #{String(receiptOrder._id).slice(-6).toUpperCase()}</h2>
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
                                <span className="rmb-value status-badge">{receiptOrder.status}</span>
                            </div>
                            <div className="rmb-item">
                                <span className="rmb-label">Fulfillment</span>
                                <span className="rmb-value">
                                    {receiptOrder.orderType === 'delivery' ? '🛵 Delivery' : receiptOrder.orderType === 'pickup' ? '🛍️ Store Pickup' : `🍽️ Dine-In`}
                                </span>
                            </div>
                            <div className="rmb-item">
                                <span className="rmb-label">Schedule</span>
                                <span className="rmb-value">{receiptOrder.scheduledFor || 'ASAP'}</span>
                            </div>
                        </div>

                        {/* Items Breakdown */}
                        <div className="receipt-items-section">
                            <h3>Items Ordered ({receiptOrder.items.length})</h3>
                            <div className="receipt-items-list">
                                {receiptOrder.items.map((it, idx) => (
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
                            <div className="rps-row">
                                <span>Subtotal</span>
                                <span>${(receiptOrder.amount - (receiptOrder.orderType === 'delivery' ? 2 : 0)).toFixed(2)}</span>
                            </div>
                            <div className="rps-row">
                                <span>Fulfillment Fee</span>
                                <span>{receiptOrder.orderType === 'delivery' ? '$2.00' : 'FREE $0.00'}</span>
                            </div>
                            <div className="rps-row total">
                                <strong>Total Paid</strong>
                                <strong>${Number(receiptOrder.amount).toFixed(2)}</strong>
                            </div>
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
        </div>
    );
};

export default MyOrders;
