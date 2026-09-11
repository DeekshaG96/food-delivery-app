import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Package, RefreshCw, CheckCircle2, Truck, Clock, MapPin, Phone, User } from 'lucide-react';
import './Orders.css';

const Orders = ({ url = "http://localhost:4000" }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [statusNotification, setStatusNotification] = useState("");

    const fetchAllOrders = async () => {
        try {
            setIsRefreshing(true);
            const response = await axios.get(`${url}/api/order/list`);
            if (response.data.success) {
                setOrders(response.data.data);
            }
        } catch (error) {
            console.error("Fetch all orders error:", error);
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    const statusHandler = async (event, orderId) => {
        const newStatus = event.target.value;
        try {
            const response = await axios.post(`${url}/api/order/status`, {
                orderId,
                status: newStatus
            });
            if (response.data.success) {
                setStatusNotification(`Order status updated to "${newStatus}"!`);
                await fetchAllOrders();
                setTimeout(() => setStatusNotification(""), 3500);
            }
        } catch (error) {
            console.error("Update status error:", error);
            alert("Failed to update order status");
        }
    };

    useEffect(() => {
        fetchAllOrders();
    }, []);

    return (
        <div className="admin-orders-page animate-fade">
            <div className="orders-page-header">
                <div>
                    <h2>Customer Order Management</h2>
                    <p>Track real-time orders and update kitchen and delivery statuses</p>
                </div>
                <button
                    onClick={fetchAllOrders}
                    className="admin-refresh-btn"
                    disabled={isRefreshing}
                    id="admin-refresh-orders-btn"
                >
                    <RefreshCw size={16} className={isRefreshing ? "spin-icon" : ""} />
                    <span>Refresh Orders</span>
                </button>
            </div>

            {statusNotification && (
                <div className="status-notification-pill animate-fade">
                    <CheckCircle2 size={16} />
                    <span>{statusNotification}</span>
                </div>
            )}

            {loading ? (
                <div className="orders-loading-state">
                    <p>Loading restaurant orders...</p>
                </div>
            ) : orders.length === 0 ? (
                <div className="orders-empty-state">
                    <Package size={48} className="empty-pkg" />
                    <h3>No orders received yet</h3>
                    <p>Customer orders placed on the frontend will appear here instantly.</p>
                </div>
            ) : (
                <div className="admin-orders-list">
                    {orders.map((order, index) => {
                        const totalItemCount = order.items.reduce((acc, curr) => acc + (curr.quantity || 1), 0);
                        const formattedDate = new Date(order.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                        });

                        return (
                            <div key={order._id || index} className="admin-order-card" id={`admin-order-${order._id}`}>
                                <div className="order-icon-box">
                                    <Package size={28} />
                                </div>

                                <div className="order-items-detail">
                                    <p className="order-food-names">
                                        {order.items.map((item, idx) => {
                                            if (idx === order.items.length - 1) {
                                                return `${item.name} x ${item.quantity}`;
                                            } else {
                                                return `${item.name} x ${item.quantity}, `;
                                            }
                                        })}
                                    </p>
                                    <div className="order-customer-info">
                                        <p className="order-customer-name">
                                            <User size={13} />
                                            <span>{order.address.firstName} {order.address.lastName}</span>
                                        </p>
                                        <p className="order-customer-address">
                                            <MapPin size={13} />
                                            <span>
                                                {order.address.street}, {order.address.city}, {order.address.state}, {order.address.zipcode}
                                            </span>
                                        </p>
                                        <p className="order-customer-phone">
                                            <Phone size={13} />
                                            <span>{order.address.phone}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="order-meta-detail">
                                    <p className="order-items-badge">Items: {totalItemCount}</p>
                                    <p className="order-price-badge">${Number(order.amount).toFixed(2)}</p>
                                    <span className="order-placed-time">{formattedDate}</span>
                                </div>

                                <div className="order-action-col">
                                    <span className={`payment-pill ${order.payment ? "paid" : "simulated"}`}>
                                        {order.payment ? "✓ Paid" : "Instant Verified"}
                                    </span>

                                    <select
                                        onChange={(e) => statusHandler(e, order._id)}
                                        value={order.status}
                                        className={`status-select ${order.status.toLowerCase().replace(/\s+/g, '-')}`}
                                        id={`status-select-${order._id}`}
                                    >
                                        <option value="Food Processing">Food Processing</option>
                                        <option value="Out for delivery">Out for delivery</option>
                                        <option value="Delivered">Delivered</option>
                                    </select>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Orders;
