import React, { useContext, useEffect } from 'react';
import { X, Bell, CheckCheck, Sparkles, Truck, Utensils, Tag } from 'lucide-react';
import { StoreContext } from '../../context/StoreContext';
import { registerModal, unregisterModal } from '../../utils/mobileBackHandler';
import './NotificationCenter.css';

const NotificationCenter = () => {
    const {
        notifications,
        markAllNotificationsRead,
        notificationModalOpen,
        setNotificationModalOpen,
        unreadNotificationsCount
    } = useContext(StoreContext);

    useEffect(() => {
        if (notificationModalOpen) {
            registerModal('notification_center', () => setNotificationModalOpen(false));
            return () => unregisterModal('notification_center');
        }
    }, [notificationModalOpen, setNotificationModalOpen]);

    if (!notificationModalOpen) return null;

    const getIcon = (type) => {
        switch (type) {
            case 'order':
                return <Truck size={20} className="notif-type-icon order" />;
            case 'promo':
                return <Tag size={20} className="notif-type-icon promo" />;
            case 'kitchen':
                return <Utensils size={20} className="notif-type-icon kitchen" />;
            default:
                return <Sparkles size={20} className="notif-type-icon default" />;
        }
    };

    return (
        <div className="notif-drawer-backdrop animate-fade" onClick={() => setNotificationModalOpen(false)}>
            <div className="notif-drawer-container animate-slide-left" onClick={(e) => e.stopPropagation()}>
                <div className="notif-header">
                    <div className="notif-header-title">
                        <Bell size={20} className="bell-glow" />
                        <h3>Notifications</h3>
                        {unreadNotificationsCount > 0 && (
                            <span className="notif-unread-count">{unreadNotificationsCount} new</span>
                        )}
                    </div>
                    <div className="notif-header-actions">
                        {unreadNotificationsCount > 0 && (
                            <button
                                type="button"
                                className="mark-read-btn"
                                onClick={markAllNotificationsRead}
                                title="Mark all as read"
                            >
                                <CheckCheck size={16} />
                                <span>Mark read</span>
                            </button>
                        )}
                        <button
                            type="button"
                            className="notif-close-btn"
                            onClick={() => setNotificationModalOpen(false)}
                            aria-label="Close notifications"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="notif-body">
                    {notifications.length === 0 ? (
                        <div className="notif-empty-state">
                            <Bell size={48} className="empty-bell" />
                            <h4>No Notifications Yet</h4>
                            <p>We'll notify you here about hot dishes, Raju Bhaiya's arrival, and festival rewards!</p>
                        </div>
                    ) : (
                        <div className="notif-list">
                            {notifications.map((item) => (
                                <div
                                    key={item.id}
                                    className={`notif-card ${item.unread ? 'unread' : ''}`}
                                >
                                    <div className="notif-icon-col">
                                        {getIcon(item.type)}
                                    </div>
                                    <div className="notif-content-col">
                                        <div className="notif-title-row">
                                            <h4>{item.title}</h4>
                                            <span className="notif-time">{item.time}</span>
                                        </div>
                                        <p className="notif-message">{item.message}</p>
                                    </div>
                                    {item.unread && <span className="notif-dot"></span>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="notif-footer">
                    <span>NaanStop Express Alerts • Certified Google Play Build</span>
                </div>
            </div>
        </div>
    );
};

export default NotificationCenter;
