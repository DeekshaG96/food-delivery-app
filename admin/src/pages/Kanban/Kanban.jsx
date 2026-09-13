import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    ChefHat,
    Clock,
    Truck,
    PackageCheck,
    RefreshCw,
    Bell,
    CheckCircle2,
    Store,
    MapPin,
    Utensils,
    Sparkles,
    AlertCircle,
    ArrowRight,
    ArrowLeft
} from 'lucide-react';
import { defaultOrders } from '../../assets/defaultAdminData';
import './Kanban.css';

const COLUMNS = [
    {
        id: 'new',
        title: 'New Orders',
        statusKey: 'Food Processing',
        icon: Bell,
        color: '#f59e0b',
        bgColor: '#fffbeb',
        borderColor: '#fde68a'
    },
    {
        id: 'kitchen',
        title: 'In Kitchen / Prep',
        statusKey: 'In Kitchen',
        icon: ChefHat,
        color: '#3b82f6',
        bgColor: '#eff6ff',
        borderColor: '#bfdbfe'
    },
    {
        id: 'ready',
        title: 'Ready for Pickup / Rider',
        statusKey: 'Out for delivery',
        icon: Truck,
        color: '#8b5cf6',
        bgColor: '#f5f3ff',
        borderColor: '#ddd6fe'
    },
    {
        id: 'completed',
        title: 'Completed',
        statusKey: 'Delivered',
        icon: CheckCircle2,
        color: '#10b981',
        bgColor: '#f0fdf4',
        borderColor: '#bbf7d0'
    }
];

const Kanban = ({ url }) => {
    const [orders, setOrders] = useState(defaultOrders);
    const [loading, setLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [filterType, setFilterType] = useState('all'); // 'all' | 'delivery' | 'pickup' | 'dine-in'
    const [alertSound, setAlertSound] = useState(true);
    const [updatingOrderId, setUpdatingOrderId] = useState(null);

    const fetchOrders = async (silent = false) => {
        try {
            if (!silent) setIsRefreshing(true);
            let combined = [];

            // 1. Read persistent local orders placed by customers / updated by riders
            try {
                const storedLocal = localStorage.getItem('naanstop_local_orders');
                if (storedLocal) {
                    const parsed = JSON.parse(storedLocal);
                    if (Array.isArray(parsed)) {
                        combined = parsed;
                    }
                }
            } catch (err) {
                console.warn('Error reading local orders in Kitchen Kanban:', err);
            }

            // 2. Fetch server orders if backend is active
            try {
                const response = await axios.get(`${url}/api/order/list`, { timeout: 3000 });
                if (response.data?.success && Array.isArray(response.data.data)) {
                    response.data.data.forEach((srv) => {
                        if (!combined.some(o => o._id === srv._id)) {
                            combined.push(srv);
                        }
                    });
                }
            } catch (error) {
                // Backend offline is expected on static deployment
            }

            // 3. Fallback or merge demo orders if list is empty
            if (combined.length === 0) {
                combined = [...defaultOrders];
            } else {
                defaultOrders.forEach((def) => {
                    if (!combined.some(o => o._id === def._id)) {
                        combined.push(def);
                    }
                });
            }

            // Sort newest first
            combined.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
            setOrders(combined);
        } catch (error) {
            console.warn('Live API unavailable for Kanban, using offline data:', error.message);
        } finally {
            setLoading(false);
            if (!silent) setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        // Auto refresh every 10 seconds for live kitchen display
        const interval = setInterval(() => {
            fetchOrders(true);
        }, 10000);

        const handleStorageSync = () => {
            fetchOrders(true);
        };
        window.addEventListener('storage', handleStorageSync);
        window.addEventListener('naanstop_order_updated', handleStorageSync);

        return () => {
            clearInterval(interval);
            window.removeEventListener('storage', handleStorageSync);
            window.removeEventListener('naanstop_order_updated', handleStorageSync);
        };
    }, [url]);

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            setUpdatingOrderId(orderId);
            // Optimistically update local state so UI is instantly responsive
            setOrders((prev) =>
                prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
            );

            // Synchronize with persistent local storage so Customer App & Rider View update reactively!
            try {
                const storedLocal = localStorage.getItem('naanstop_local_orders');
                if (storedLocal) {
                    const parsed = JSON.parse(storedLocal);
                    const updated = parsed.map((o) =>
                        o._id === orderId ? { ...o, status: newStatus } : o
                    );
                    localStorage.setItem('naanstop_local_orders', JSON.stringify(updated));
                    window.dispatchEvent(new Event('storage'));
                }
            } catch (err) {
                console.warn('Failed to sync Kanban order status to localStorage:', err);
            }

            await axios.post(`${url}/api/order/status`, {
                orderId,
                status: newStatus
            }, { timeout: 3000 });
        } catch (error) {
            console.warn('Backend status sync note:', error.message);
        } finally {
            setUpdatingOrderId(null);
        }
    };

    // Filter orders by type
    const filteredOrders = orders.filter((o) => {
        if (filterType === 'all') return true;
        return (o.orderType || 'delivery') === filterType;
    });

    // Helper to bucket orders into columns
    const getColumnOrders = (column) => {
        return filteredOrders.filter((order) => {
            const st = order.status || 'Food Processing';
            if (column.id === 'new') {
                return st === 'Food Processing' || st === 'Order Placed' || st === 'Pending';
            }
            if (column.id === 'kitchen') {
                return st === 'In Kitchen' || st === 'Cooking';
            }
            if (column.id === 'ready') {
                return st === 'Out for delivery' || st === 'Ready for Pickup';
            }
            if (column.id === 'completed') {
                return st === 'Delivered' || st === 'Completed';
            }
            return false;
        });
    };

    // Elapsed time calculation
    const getElapsedTime = (dateString) => {
        const diffMs = Date.now() - new Date(dateString).getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        if (diffMins < 1) return 'Just now';
        if (diffMins === 1) return '1 min ago';
        if (diffMins < 60) return `${diffMins} mins ago`;
        const diffHours = Math.floor(diffMins / 60);
        return `${diffHours}h ${diffMins % 60}m ago`;
    };

    return (
        <div className="kitchen-kanban-page animate-fade">
            {/* Top Toolbar */}
            <div className="kanban-top-bar">
                <div className="kanban-title-area">
                    <div className="kanban-logo-badge">
                        <ChefHat size={22} />
                    </div>
                    <div>
                        <h1 className="kanban-title">Kitchen Display System (KDS)</h1>
                        <p className="kanban-sub">
                            Live Kanban board inspired by KitchenAsty • Real-time status progression
                        </p>
                    </div>
                </div>

                <div className="kanban-controls">
                    {/* Filter Type Pills */}
                    <div className="type-filter-group">
                        <button
                            className={`k-filter-btn ${filterType === 'all' ? 'active' : ''}`}
                            onClick={() => setFilterType('all')}
                        >
                            All ({orders.length})
                        </button>
                        <button
                            className={`k-filter-btn ${filterType === 'delivery' ? 'active' : ''}`}
                            onClick={() => setFilterType('delivery')}
                        >
                            🛵 Delivery
                        </button>
                        <button
                            className={`k-filter-btn ${filterType === 'pickup' ? 'active' : ''}`}
                            onClick={() => setFilterType('pickup')}
                        >
                            🛍️ Pickup
                        </button>
                        <button
                            className={`k-filter-btn ${filterType === 'dine-in' ? 'active' : ''}`}
                            onClick={() => setFilterType('dine-in')}
                        >
                            🍽️ Dine-In
                        </button>
                    </div>

                    <button
                        onClick={() => fetchOrders(false)}
                        className="kanban-refresh-btn"
                        disabled={isRefreshing}
                        title="Refresh live orders"
                    >
                        <RefreshCw size={15} className={isRefreshing ? 'spin-icon' : ''} />
                        <span>Refresh</span>
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="kanban-loading">
                    <div className="kanban-spinner"></div>
                    <p>Loading live kitchen orders...</p>
                </div>
            ) : (
                /* Kanban Columns Grid */
                <div className="kanban-board-grid">
                    {COLUMNS.map((column) => {
                        const colOrders = getColumnOrders(column);
                        const ColIcon = column.icon;

                        return (
                            <div key={column.id} className="kanban-column" id={`col-${column.id}`}>
                                {/* Column Header */}
                                <div
                                    className="kanban-col-header"
                                    style={{
                                        background: column.bgColor,
                                        borderColor: column.borderColor,
                                        color: column.color
                                    }}
                                >
                                    <div className="col-header-left">
                                        <ColIcon size={18} />
                                        <span className="col-title">{column.title}</span>
                                    </div>
                                    <span
                                        className="col-count-badge"
                                        style={{ background: column.color, color: '#ffffff' }}
                                    >
                                        {colOrders.length}
                                    </span>
                                </div>

                                {/* Orders Stack */}
                                <div className="kanban-cards-stack">
                                    {colOrders.length === 0 ? (
                                        <div className="kanban-empty-col">
                                            <span>No orders in this stage</span>
                                        </div>
                                    ) : (
                                        colOrders.map((order) => {
                                            const orderType = order.orderType || 'delivery';
                                            const elapsed = getElapsedTime(order.date);
                                            const isUrgent = Date.now() - new Date(order.date).getTime() > 20 * 60 * 1000;

                                            return (
                                                <div
                                                    key={order._id}
                                                    className={`kanban-ticket-card ${isUrgent ? 'urgent' : ''}`}
                                                    id={`ticket-${order._id}`}
                                                >
                                                    {/* Ticket Top */}
                                                    <div className="ticket-top-row">
                                                        <div className="ticket-id-tag">
                                                            #{String(order._id).slice(-6).toUpperCase()}
                                                        </div>
                                                        <span className={`ticket-type-pill ${orderType}`}>
                                                            {orderType === 'delivery' ? '🛵 Delivery' : orderType === 'pickup' ? '🛍️ Pickup' : `🍽️ ${order.tableNumber || 'Dine-In'}`}
                                                        </span>
                                                        <div className={`ticket-timer ${isUrgent ? 'urgent' : ''}`}>
                                                            <Clock size={12} />
                                                            <span>{elapsed}</span>
                                                        </div>
                                                    </div>

                                                    {/* Outlet and Security PIN Badges */}
                                                    {(order.outlet || order.deliveryPin || order.rider) && (
                                                        <div className="ticket-meta-badges">
                                                            {order.outlet && (
                                                                <span className="t-outlet-badge" title="Fulfilling Cloud Kitchen Outlet">
                                                                    📍 {order.outlet.name}
                                                                </span>
                                                            )}
                                                            {order.deliveryPin && (
                                                                <span className="t-pin-badge" title="4-Digit Secure Handover Code">
                                                                    PIN: <strong>{order.deliveryPin}</strong>
                                                                </span>
                                                            )}
                                                            {order.rider && (
                                                                <span className="t-rider-badge" title="Assigned Delivery Rider">
                                                                    🛵 {order.rider.name}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Scheduled Time if applicable */}
                                                    {order.scheduledFor && order.scheduledFor !== 'ASAP (25-35 mins)' && (
                                                        <div className="ticket-scheduled-banner">
                                                            <span>🕒 {order.scheduledFor}</span>
                                                        </div>
                                                    )}

                                                    {/* Items Checklist */}
                                                    <div className="ticket-items-list">
                                                        {order.items.map((it, idx) => (
                                                            <div key={idx} className="ticket-item-row">
                                                                <span className="t-qty">{it.quantity || 1}×</span>
                                                                <div className="t-item-content">
                                                                    <div className="t-item-name">
                                                                        <span>{it.name}</span>
                                                                        {it.size && (
                                                                            <span className="t-size-pill">{it.size}</span>
                                                                        )}
                                                                    </div>
                                                                    {it.spice && (
                                                                        <span className="t-spice">{it.spice}</span>
                                                                    )}
                                                                    {it.addOns && it.addOns.length > 0 && (
                                                                        <span className="t-addons">+ {it.addOns.join(', ')}</span>
                                                                    )}
                                                                    {it.notes && (
                                                                        <span className="t-notes">"{it.notes}"</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Customer Destination Info */}
                                                    <div className="ticket-customer-info">
                                                        {orderType === 'delivery' && order.address ? (
                                                            <p className="t-addr">
                                                                <MapPin size={12} /> {order.address.firstName || 'Guest'} • {order.address.street}, {order.address.city}
                                                            </p>
                                                        ) : orderType === 'pickup' ? (
                                                            <p className="t-addr">
                                                                <Store size={12} /> Pickup Counter ({order.address?.firstName || 'Customer'})
                                                            </p>
                                                        ) : (
                                                            <p className="t-addr">
                                                                <Utensils size={12} /> Serve to Table {order.tableNumber || '4'}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Action Buttons: 1-Click Status Progression */}
                                                    <div className="ticket-actions-row">
                                                        {column.id === 'new' && (
                                                            <button
                                                                onClick={() => handleUpdateStatus(order._id, 'In Kitchen')}
                                                                className="ticket-move-btn prep"
                                                                disabled={updatingOrderId === order._id}
                                                            >
                                                                <span>Start Prep 👨‍🍳</span>
                                                                <ArrowRight size={14} />
                                                            </button>
                                                        )}

                                                        {column.id === 'kitchen' && (
                                                            <div className="btn-duo">
                                                                <button
                                                                    onClick={() => handleUpdateStatus(order._id, 'Food Processing')}
                                                                    className="ticket-back-btn"
                                                                    title="Move back to New"
                                                                >
                                                                    <ArrowLeft size={13} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleUpdateStatus(order._id, 'Out for delivery')}
                                                                    className="ticket-move-btn ready"
                                                                    disabled={updatingOrderId === order._id}
                                                                >
                                                                    <span>Mark Ready 📦</span>
                                                                    <ArrowRight size={14} />
                                                                </button>
                                                            </div>
                                                        )}

                                                        {column.id === 'ready' && (
                                                            <div className="btn-duo">
                                                                <button
                                                                    onClick={() => handleUpdateStatus(order._id, 'In Kitchen')}
                                                                    className="ticket-back-btn"
                                                                    title="Move back to Kitchen"
                                                                >
                                                                    <ArrowLeft size={13} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleUpdateStatus(order._id, 'Delivered')}
                                                                    className="ticket-move-btn complete"
                                                                    disabled={updatingOrderId === order._id}
                                                                >
                                                                    <span>Complete Order ✅</span>
                                                                </button>
                                                            </div>
                                                        )}

                                                        {column.id === 'completed' && (
                                                            <div className="ticket-completed-flag">
                                                                <CheckCircle2 size={15} color="#10b981" />
                                                                <span>Delivered / Completed</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Kanban;
