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
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [filterType, setFilterType] = useState('all'); // 'all' | 'delivery' | 'pickup' | 'dine-in'
    const [alertSound, setAlertSound] = useState(true);
    const [updatingOrderId, setUpdatingOrderId] = useState(null);

    const fetchOrders = async (silent = false) => {
        try {
            if (!silent) setIsRefreshing(true);
            const response = await axios.get(`${url}/api/order/list`);
            if (response.data.success) {
                setOrders(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch admin orders:', error);
        } finally {
            setLoading(false);
            if (!silent) setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        // Auto refresh every 15 seconds for live kitchen display
        const interval = setInterval(() => {
            fetchOrders(true);
        }, 15000);
        return () => clearInterval(interval);
    }, [url]);

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            setUpdatingOrderId(orderId);
            const response = await axios.post(`${url}/api/order/status`, {
                orderId,
                status: newStatus
            });
            if (response.data.success) {
                await fetchOrders(true);
            }
        } catch (error) {
            console.error('Error updating order status:', error);
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
