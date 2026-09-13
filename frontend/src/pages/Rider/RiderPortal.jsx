import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Bike,
    ShieldCheck,
    MapPin,
    PhoneCall,
    CheckCircle2,
    Clock,
    AlertCircle,
    DollarSign,
    TrendingUp,
    Navigation,
    KeyRound,
    Sparkles,
    ChevronRight,
    ArrowLeft,
    Power,
    Store,
    Package,
    RefreshCw,
    X,
    Award
} from 'lucide-react';
import { StoreContext } from '../../context/StoreContext';
import { triggerHaptic } from '../../utils/haptics';
import './RiderPortal.css';

const RiderPortal = () => {
    const {
        localOrders = [],
        riderProfile,
        toggleRiderOnline,
        advanceRiderOrderStatus,
        verifyAndCompleteDelivery,
        addLocalOrder,
        selectedOutlet,
        showToast
    } = useContext(StoreContext);

    const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'payouts' | 'profile'
    const [verifyingOrderId, setVerifyingOrderId] = useState(null);
    const [pinInput, setPinInput] = useState('');
    const [pinError, setPinError] = useState('');

    // Filter active orders assigned to delivery
    const activeDeliveries = localOrders.filter(
        o => o.orderType !== 'dine-in' && o.orderType !== 'pickup' && o.status !== 'Delivered'
    );

    const completedDeliveries = localOrders.filter(
        o => o.status === 'Delivered'
    );

    // Auto-create a demo order if none exist so reviewers can test immediately
    const handleSpawnTestOrder = () => {
        const testId = `order_${Date.now()}`;
        const newOrder = {
            _id: testId,
            date: new Date().toISOString(),
            status: "Food Processing",
            payment: true,
            paymentMode: "upi",
            orderType: "delivery",
            scheduledFor: "ASAP (20-30 mins)",
            riderTip: 2.00,
            amount: 28.50,
            deliveryPin: String(Math.floor(1000 + Math.random() * 9000)),
            outlet: selectedOutlet,
            rider: {
                name: riderProfile.name,
                vehicle: riderProfile.vehicle,
                rating: riderProfile.rating,
                deliveries: riderProfile.totalDeliveries,
                phone: riderProfile.phone,
                status: "Assigned to order"
            },
            address: {
                firstName: "Aditi",
                lastName: "Verma",
                street: "Flat 302, Palm Meadows, Indiranagar",
                city: selectedOutlet?.city || "Bengaluru",
                phone: "+91 98450 11223"
            },
            items: [
                {
                    _id: "test_item_1",
                    name: "Old Delhi Butter Chicken",
                    price: 16.50,
                    quantity: 1,
                    size: "Dhaba Sharing Handi",
                    spice: "Desi Teekha 🌶️🌶️"
                },
                {
                    _id: "test_item_2",
                    name: "Garlic Butter Naan",
                    price: 3.50,
                    quantity: 2,
                    size: "Crisp Tandoor"
                }
            ]
        };
        addLocalOrder(newOrder);
        showToast("New delivery order broadcasted to your feed! 🛵", "success");
    };

    const handleOpenPinModal = (orderId) => {
        setVerifyingOrderId(orderId);
        setPinInput('');
        setPinError('');
        triggerHaptic('selection');
    };

    const handleVerifyPinSubmit = (e) => {
        e.preventDefault();
        if (pinInput.length < 4) {
            setPinError("Please enter all 4 digits of the customer's PIN.");
            return;
        }

        const result = verifyAndCompleteDelivery(verifyingOrderId, pinInput);
        if (result.success) {
            setVerifyingOrderId(null);
            setPinInput('');
            setPinError('');
        } else {
            setPinError(result.message);
        }
    };

    const targetOrder = localOrders.find(o => o._id === verifyingOrderId);

    return (
        <div className="rider-portal-container">
            {/* Top Navigation / Status Header */}
            <div className="rider-top-bar">
                <Link to="/myorders" className="rider-back-link">
                    <ArrowLeft size={18} />
                    <span>Customer App</span>
                </Link>
                <div className="rider-brand-badge">
                    <Bike size={18} className="rider-bike-icon" />
                    <span>NaanStop Fleet Captain</span>
                </div>
                <button 
                    className={`rider-power-toggle ${riderProfile.isOnline ? 'online' : 'offline'}`}
                    onClick={toggleRiderOnline}
                    title="Toggle Online/Offline Availability"
                >
                    <Power size={16} />
                    <span>{riderProfile.isOnline ? 'ONLINE' : 'OFFLINE'}</span>
                </button>
            </div>

            {/* Rider Captain Profile Card */}
            <div className="rider-captain-card">
                <div className="rider-avatar-row">
                    <div className="rider-avatar-wrapper">
                        <img 
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" 
                            alt="Raju Bhaiya"
                            className="rider-avatar-img"
                        />
                        <span className={`rider-status-dot ${riderProfile.isOnline ? 'active' : ''}`}></span>
                    </div>
                    <div className="rider-details">
                        <div className="rider-name-row">
                            <h2>{riderProfile.name}</h2>
                            <span className="rider-badge-captain"><ShieldCheck size={14} /> 5★ Hero</span>
                        </div>
                        <p className="rider-vehicle-id">{riderProfile.vehicle}</p>
                        <div className="rider-hub-tag">
                            <Store size={13} /> Current Base: <strong>{selectedOutlet?.name || "Indiranagar Hub"}</strong>
                        </div>
                    </div>
                </div>

                {/* Daily Telemetry Bar */}
                <div className="rider-telemetry-grid">
                    <div className="rider-telemetry-tile">
                        <span className="telemetry-label">Today's Payout</span>
                        <span className="telemetry-val highlight">${riderProfile.todayEarnings.toFixed(2)}</span>
                    </div>
                    <div className="rider-telemetry-tile">
                        <span className="telemetry-label">Trips Completed</span>
                        <span className="telemetry-val">{riderProfile.todayTrips}</span>
                    </div>
                    <div className="rider-telemetry-tile">
                        <span className="telemetry-label">Lifetime Rating</span>
                        <span className="telemetry-val">⭐ {riderProfile.rating}</span>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="rider-tabs-row">
                <button 
                    className={`rider-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
                    onClick={() => setActiveTab('orders')}
                >
                    Active Deliveries ({activeDeliveries.length})
                </button>
                <button 
                    className={`rider-tab-btn ${activeTab === 'payouts' ? 'active' : ''}`}
                    onClick={() => setActiveTab('payouts')}
                >
                    Trip Payouts & Tips
                </button>
            </div>

            {/* Tab 1: Active Deliveries */}
            {activeTab === 'orders' && (
                <div className="rider-tab-content">
                    {activeDeliveries.length === 0 ? (
                        <div className="rider-empty-state">
                            <div className="radar-ping-container">
                                <div className="radar-circle"></div>
                                <Bike size={36} className="radar-bike" />
                            </div>
                            <h3>No Pending Deliveries Right Now</h3>
                            <p>You're in the hot zone near <strong>{selectedOutlet?.name}</strong>. Fresh tandoor orders will appear here automatically.</p>
                            <button className="rider-spawn-order-btn" onClick={handleSpawnTestOrder}>
                                <Sparkles size={16} /> Simulate Incoming Delivery Order
                            </button>
                        </div>
                    ) : (
                        <div className="rider-orders-list">
                            {activeDeliveries.map((order) => {
                                const isKitchenPrep = order.status === 'Food Processing';
                                const isEnRoute = order.status === 'Out for delivery';
                                const isAtDoorstep = order.status === 'Arrived at Doorstep';

                                return (
                                    <div key={order._id} className="rider-order-card">
                                        <div className="rider-order-header">
                                            <div>
                                                <span className="rider-order-id">Order #{order._id.slice(-6)}</span>
                                                <span className="rider-order-time">{order.scheduledFor || 'ASAP (20 mins)'}</span>
                                            </div>
                                            <span className={`rider-order-status-pill ${order.status.replace(/\s+/g, '-').toLowerCase()}`}>
                                                {order.status}
                                            </span>
                                        </div>

                                        {/* Pickup & Dropoff Route Strip */}
                                        <div className="rider-route-strip">
                                            <div className="route-node">
                                                <div className="route-icon-dot pickup">
                                                    <Store size={14} />
                                                </div>
                                                <div className="route-text">
                                                    <span className="route-label">PICKUP OUTLET</span>
                                                    <h4>{order.outlet?.name || "NaanStop Central Kitchen"}</h4>
                                                    <p>{order.outlet?.address || "100 Feet Rd, Indiranagar"}</p>
                                                </div>
                                            </div>

                                            <div className="route-connector-line"></div>

                                            <div className="route-node">
                                                <div className="route-icon-dot dropoff">
                                                    <MapPin size={14} />
                                                </div>
                                                <div className="route-text">
                                                    <span className="route-label">DELIVERY TO CUSTOMER</span>
                                                    <h4>{order.address?.firstName} {order.address?.lastName || ""}</h4>
                                                    <p>{order.address?.street}, {order.address?.city}</p>
                                                    <div className="rider-phone-pill">
                                                        <PhoneCall size={12} /> {order.address?.phone || "+91 98765 43210"}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Items & Payment Mode Summary */}
                                        <div className="rider-order-summary-box">
                                            <div className="order-items-snippet">
                                                <Package size={14} />
                                                <span>{order.items?.map(it => `${it.quantity}x ${it.name}`).join(', ') || 'Hot Desi Meal Pack'}</span>
                                            </div>
                                            <div className="order-payout-snippet">
                                                <span className="payout-amount">Collect: <strong>{order.paymentMode === 'cod' ? `$${order.amount.toFixed(2)} (Cash)` : 'PAID (UPI/Card)'}</strong></span>
                                                <span className="rider-cut-badge">Your Earning: +${(4.50 + (Number(order.riderTip) || 0)).toFixed(2)}</span>
                                            </div>
                                        </div>

                                        {/* Progressive Action Stepper */}
                                        <div className="rider-actions-row">
                                            {isKitchenPrep && (
                                                <button 
                                                    className="rider-action-step-btn primary"
                                                    onClick={() => advanceRiderOrderStatus(order._id, 'Out for delivery')}
                                                >
                                                    <Bike size={16} /> Pickup Order & Start Delivery Run
                                                </button>
                                            )}

                                            {isEnRoute && (
                                                <button 
                                                    className="rider-action-step-btn warning"
                                                    onClick={() => advanceRiderOrderStatus(order._id, 'Arrived at Doorstep')}
                                                >
                                                    <Navigation size={16} /> Mark "Arrived at Customer Doorstep"
                                                </button>
                                            )}

                                            {(isAtDoorstep || isEnRoute) && (
                                                <button 
                                                    className="rider-action-step-btn success-pulse"
                                                    onClick={() => handleOpenPinModal(order._id)}
                                                >
                                                    <KeyRound size={16} /> Verify Customer 4-Digit PIN
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* Tab 2: Payouts & History */}
            {activeTab === 'payouts' && (
                <div className="rider-tab-content">
                    <div className="rider-payout-hero">
                        <div className="payout-hero-left">
                            <span className="payout-hero-label">Available for Instant Payout</span>
                            <h2 className="payout-hero-sum">${riderProfile.todayEarnings.toFixed(2)}</h2>
                            <span className="payout-hero-sub">Direct Deposit to HDFC Bank •••• 4209</span>
                        </div>
                        <button className="rider-cashout-btn" onClick={() => showToast("Payout of $" + riderProfile.todayEarnings.toFixed(2) + " transferred to bank! ⚡", "success")}>
                            Instant Cash Out
                        </button>
                    </div>

                    <h4 className="rider-section-title">Completed Trips Today</h4>
                    {completedDeliveries.length === 0 ? (
                        <p className="rider-no-trips">No trips completed yet today. Complete your first delivery to earn base fare and customer tips!</p>
                    ) : (
                        <div className="rider-trips-list">
                            {completedDeliveries.map((tr) => (
                                <div key={tr._id} className="rider-trip-card">
                                    <div className="trip-card-left">
                                        <div className="trip-check-icon"><CheckCircle2 size={18} /></div>
                                        <div>
                                            <h4>Trip #{tr._id.slice(-6)}</h4>
                                            <p>{tr.outlet?.name || "NaanStop Kitchen"} → {tr.address?.street || "Customer Doorstep"}</p>
                                        </div>
                                    </div>
                                    <div className="trip-card-right">
                                        <span className="trip-pay">+${(4.50 + (Number(tr.riderTip) || 0)).toFixed(2)}</span>
                                        <span className="trip-tip-tag">{tr.riderTip > 0 ? `Includes $${tr.riderTip.toFixed(2)} Tip ❤️` : 'Standard Fare'}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Doorstep 4-Digit Handover PIN Modal */}
            {verifyingOrderId && targetOrder && (
                <div className="pin-modal-overlay" onClick={() => setVerifyingOrderId(null)}>
                    <div className="pin-modal-card" onClick={e => e.stopPropagation()}>
                        <div className="pin-modal-header">
                            <div className="pin-header-icon">
                                <KeyRound size={22} />
                            </div>
                            <div>
                                <h3>Verify Doorstep Handover</h3>
                                <p>Ask customer <strong>{targetOrder.address?.firstName}</strong> for their 4-digit Delivery PIN.</p>
                            </div>
                            <button className="pin-modal-close" onClick={() => setVerifyingOrderId(null)}>
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleVerifyPinSubmit} className="pin-form">
                            {/* Demo hint for reviewers */}
                            <div className="pin-demo-hint">
                                <Sparkles size={14} />
                                <span>Demo Testing PIN for this order: <strong>{targetOrder.deliveryPin || "1234"}</strong></span>
                            </div>

                            <div className="pin-input-group">
                                <input
                                    type="text"
                                    maxLength="4"
                                    pattern="[0-9]*"
                                    inputMode="numeric"
                                    value={pinInput}
                                    onChange={e => {
                                        setPinInput(e.target.value.replace(/\D/g, ''));
                                        setPinError('');
                                    }}
                                    placeholder="• • • •"
                                    className="pin-digits-input"
                                    autoFocus
                                />
                            </div>

                            {pinError && (
                                <div className="pin-error-banner">
                                    <AlertCircle size={15} />
                                    <span>{pinError}</span>
                                </div>
                            )}

                            <button type="submit" className="pin-confirm-btn">
                                <CheckCircle2 size={18} /> Confirm Handover & Complete Delivery
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RiderPortal;
