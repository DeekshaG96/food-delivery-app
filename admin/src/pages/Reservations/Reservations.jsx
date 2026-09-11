import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Calendar,
    Users,
    Clock,
    Sparkles,
    CheckCircle2,
    XCircle,
    UserCheck,
    RefreshCw,
    Search,
    Phone,
    Mail,
    AlertCircle
} from 'lucide-react';
import './Reservations.css';

const Reservations = ({ url }) => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [actionId, setActionId] = useState(null);

    const fetchReservations = async (silent = false) => {
        try {
            if (!silent) setIsRefreshing(true);
            const res = await axios.get(`${url}/api/reservation/list`);
            if (res.data.success) {
                setReservations(res.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch reservations:', error);
        } finally {
            setLoading(false);
            if (!silent) setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, [url]);

    const handleUpdateStatus = async (resId, newStatus) => {
        try {
            setActionId(resId);
            const res = await axios.post(`${url}/api/reservation/status`, {
                resId,
                status: newStatus
            });
            if (res.data.success) {
                await fetchReservations(true);
            }
        } catch (error) {
            console.error('Error updating status:', error);
        } finally {
            setActionId(null);
        }
    };

    // Derived statistics
    const totalCount = reservations.length;
    const confirmedCount = reservations.filter(r => r.status === 'Confirmed').length;
    const seatedCount = reservations.filter(r => r.status === 'Seated').length;
    const totalGuests = reservations.reduce((sum, r) => sum + (Number(r.guests) || 2), 0);

    // Filtered reservations
    const filteredReservations = reservations.filter(r => {
        const matchesStatus = filterStatus === 'all' || r.status.toLowerCase() === filterStatus.toLowerCase();
        const matchesSearch =
            r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.bookingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.phone.includes(searchTerm) ||
            r.seatingArea.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    return (
        <div className="admin-reservations-page animate-fade">
            {/* Header */}
            <div className="reservations-header">
                <div>
                    <h1 className="res-title">Table Reservations Management</h1>
                    <p className="res-sub">
                        Manage dining room bookings, guest seatings, and special requests (KitchenAsty)
                    </p>
                </div>

                <button
                    onClick={() => fetchReservations(false)}
                    className="res-refresh-btn"
                    disabled={isRefreshing}
                >
                    <RefreshCw size={15} className={isRefreshing ? 'spin-icon' : ''} />
                    <span>Refresh Bookings</span>
                </button>
            </div>

            {/* Metrics Row */}
            <div className="res-metrics-grid">
                <div className="res-metric-card">
                    <div className="metric-icon total"><Calendar size={20} /></div>
                    <div>
                        <span className="metric-label">Total Bookings</span>
                        <h3 className="metric-val">{totalCount}</h3>
                    </div>
                </div>

                <div className="res-metric-card">
                    <div className="metric-icon confirmed"><CheckCircle2 size={20} /></div>
                    <div>
                        <span className="metric-label">Confirmed Upcoming</span>
                        <h3 className="metric-val">{confirmedCount}</h3>
                    </div>
                </div>

                <div className="res-metric-card">
                    <div className="metric-icon seated"><UserCheck size={20} /></div>
                    <div>
                        <span className="metric-label">Seated In Dining Room</span>
                        <h3 className="metric-val">{seatedCount}</h3>
                    </div>
                </div>

                <div className="res-metric-card">
                    <div className="metric-icon guests"><Users size={20} /></div>
                    <div>
                        <span className="metric-label">Expected Covers / Guests</span>
                        <h3 className="metric-val">{totalGuests}</h3>
                    </div>
                </div>
            </div>

            {/* Filter Toolbar */}
            <div className="res-filter-bar">
                <div className="res-status-tabs">
                    {['all', 'confirmed', 'seated', 'cancelled'].map(tab => (
                        <button
                            key={tab}
                            className={`res-tab-btn ${filterStatus === tab ? 'active' : ''}`}
                            onClick={() => setFilterStatus(tab)}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                <div className="res-search-input-box">
                    <Search size={16} className="search-ico" />
                    <input
                        type="text"
                        placeholder="Search guest name, code, or area..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="res-search-input"
                    />
                </div>
            </div>

            {loading ? (
                <div className="res-loading-state">
                    <div className="res-spinner"></div>
                    <p>Loading table reservations...</p>
                </div>
            ) : filteredReservations.length === 0 ? (
                <div className="res-empty-state">
                    <Calendar size={48} className="empty-ico" />
                    <h3>No Reservations Found</h3>
                    <p>No table bookings match your current filter criteria.</p>
                </div>
            ) : (
                /* Cards Grid */
                <div className="reservations-cards-grid">
                    {filteredReservations.map((res) => (
                        <div key={res._id} className="admin-res-card" id={`res-card-${res._id}`}>
                            <div className="card-top-bar">
                                <div className="code-wrap">
                                    <span className="res-code">{res.bookingCode}</span>
                                    <span className={`res-status-pill ${res.status.toLowerCase()}`}>
                                        {res.status}
                                    </span>
                                </div>
                                <span className="res-area-badge">{res.seatingArea}</span>
                            </div>

                            <div className="guest-info-section">
                                <h3 className="guest-name">{res.name}</h3>
                                <div className="guest-contacts">
                                    <span className="contact-item"><Phone size={13} /> {res.phone}</span>
                                    <span className="contact-item"><Mail size={13} /> {res.email}</span>
                                </div>
                            </div>

                            <div className="booking-details-grid">
                                <div className="bd-item">
                                    <span className="bd-lbl">Date</span>
                                    <span className="bd-val"><Calendar size={13} /> {res.date}</span>
                                </div>
                                <div className="bd-item">
                                    <span className="bd-lbl">Time Slot</span>
                                    <span className="bd-val"><Clock size={13} /> {res.timeSlot}</span>
                                </div>
                                <div className="bd-item">
                                    <span className="bd-lbl">Party Size</span>
                                    <span className="bd-val"><Users size={13} /> {res.guests} Guests</span>
                                </div>
                                <div className="bd-item">
                                    <span className="bd-lbl">Occasion</span>
                                    <span className="bd-val">{res.specialOccasion || 'Casual'}</span>
                                </div>
                            </div>

                            {res.specialRequests && (
                                <div className="special-notes-box">
                                    <span className="notes-lbl">Notes:</span>
                                    <p className="notes-text">"{res.specialRequests}"</p>
                                </div>
                            )}

                            {/* Actions Bar */}
                            <div className="res-actions-bar">
                                {res.status !== 'Seated' && (
                                    <button
                                        onClick={() => handleUpdateStatus(res._id, 'Seated')}
                                        className="res-action-btn seat"
                                        disabled={actionId === res._id}
                                    >
                                        <UserCheck size={14} />
                                        <span>Seat Guests</span>
                                    </button>
                                )}

                                {res.status !== 'Confirmed' && (
                                    <button
                                        onClick={() => handleUpdateStatus(res._id, 'Confirmed')}
                                        className="res-action-btn confirm"
                                        disabled={actionId === res._id}
                                    >
                                        <CheckCircle2 size={14} />
                                        <span>Confirm</span>
                                    </button>
                                )}

                                {res.status !== 'Cancelled' && (
                                    <button
                                        onClick={() => handleUpdateStatus(res._id, 'Cancelled')}
                                        className="res-action-btn cancel"
                                        disabled={actionId === res._id}
                                    >
                                        <XCircle size={14} />
                                        <span>Cancel</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Reservations;
