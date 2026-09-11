import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
    Calendar,
    Clock,
    Users,
    Sparkles,
    CheckCircle2,
    MapPin,
    Heart,
    Phone,
    Mail,
    User,
    ChevronRight,
    Utensils,
    CalendarCheck,
    PartyPopper
} from 'lucide-react';
import { StoreContext } from '../../context/StoreContext';
import './Reservations.css';

const TIME_SLOTS = [
    { time: '12:00 PM', period: 'Lunch', badge: 'Available' },
    { time: '12:45 PM', period: 'Lunch', badge: 'Available' },
    { time: '1:30 PM', period: 'Lunch', badge: 'Popular' },
    { time: '5:30 PM', period: 'Dinner', badge: 'Available' },
    { time: '6:15 PM', period: 'Dinner', badge: 'Available' },
    { time: '7:00 PM', period: 'Dinner', badge: 'Prime Time' },
    { time: '7:45 PM', period: 'Dinner', badge: 'Few Left' },
    { time: '8:30 PM', period: 'Dinner', badge: 'Available' },
    { time: '9:15 PM', period: 'Dinner', badge: 'Available' }
];

const SEATING_AREAS = [
    {
        id: 'Maharaja Diwan',
        title: 'Maharaja Royal Diwan',
        desc: 'Regal silk cushions, antique brass lanterns, and private low-table dawat feast seating.',
        tag: 'Royal Dawat',
        icon: '👑'
    },
    {
        id: 'Dhaba Charpai Courtyard',
        title: 'Dhaba Charpai Courtyard',
        desc: 'Authentic rustic woven charpai cot seating with open tandoor aroma and colorful truck art.',
        tag: 'Rustic Dhaba',
        icon: '🪑'
    },
    {
        id: 'Bollywood Rooftop Lounge',
        title: 'Bollywood Retro Rooftop',
        desc: 'Open-air terrace with nostalgic golden era cinema murals, fairy lights, and live ambient sitar radio.',
        tag: 'Sufi & Skyline',
        icon: '🌆'
    },
    {
        id: 'Verandah Garden Patio',
        title: 'Verandah Garden Patio',
        desc: 'Al fresco fountain courtyard surrounded by fragrant night-blooming jasmine and marigolds.',
        tag: 'Jasmine Breeze',
        icon: '🌿'
    }
];

const OCCASIONS = [
    'Family Feast (Khandaani Dawat) 👨‍👩‍👧‍👦',
    'Birthday Celebration (Jashn-e-Khaas) 🎂',
    'Romantic Candlelight / Date Night 🥂',
    'Friends Reunion (Chai & Charcha) ☕',
    'Corporate & Business Dinner 💼',
    'Festive Treat & Mithai 🪔'
];

const Reservations = () => {
    const { url, userName, showToast } = useContext(StoreContext);

    // Form state
    const today = new Date().toISOString().split('T')[0];
    const defaultDate = new Date(Date.now() + 86400000).toISOString().split('T')[0]; // tomorrow

    const [guests, setGuests] = useState(2);
    const [date, setDate] = useState(defaultDate);
    const [timeSlot, setTimeSlot] = useState('7:00 PM');
    const [seatingArea, setSeatingArea] = useState('Maharaja Diwan');
    const [occasion, setOccasion] = useState('Family Feast (Khandaani Dawat) 👨‍👩‍👧‍👦');
    const [name, setName] = useState(userName || 'Rohan Sharma');
    const [email, setEmail] = useState('rohan.desi@naanstop.com');
    const [phone, setPhone] = useState('+1 (555) 234-5678');
    const [specialRequests, setSpecialRequests] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [confirmedBooking, setConfirmedBooking] = useState(null);
    const [userBookings, setUserBookings] = useState([]);
    const [activeTab, setActiveTab] = useState('book'); // 'book' | 'my-bookings'

    // Fetch user bookings when opening my-bookings tab
    const fetchUserBookings = async () => {
        try {
            const res = await axios.get(`${url}/api/reservation/user?email=${encodeURIComponent(email)}`);
            if (res.data.success) {
                setUserBookings(res.data.data);
            }
        } catch (err) {
            console.error('Failed to fetch user bookings:', err);
        }
    };

    useEffect(() => {
        if (activeTab === 'my-bookings') {
            fetchUserBookings();
        }
    }, [activeTab, email]);

    const handleSubmitReservation = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const payload = {
            name,
            email,
            phone,
            guests: Number(guests),
            date,
            timeSlot,
            seatingArea,
            specialOccasion: occasion,
            specialRequests
        };

        try {
            const res = await axios.post(`${url}/api/reservation/book`, payload);
            if (res.data.success) {
                setConfirmedBooking(res.data.data);
                showToast(`Table booked! Code: ${res.data.data.bookingCode} 🎉`, 'success');
            } else {
                showToast(res.data.message || 'Could not complete booking', 'error');
            }
        } catch (error) {
            console.error('Reservation error:', error);
            showToast('Unable to connect to reservation service', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="reservations-page animate-fade">
            {/* Breadcrumb navigation */}
            <div className="reservation-breadcrumb">
                <Link to="/" className="crumb-link">Home</Link>
                <span>/</span>
                <span className="crumb-active">Table Reservations</span>
            </div>

            {/* Header Hero Banner */}
            <div className="reservation-hero-banner">
                <div className="hero-content">
                    <span className="hero-badge">
                        <Utensils size={14} />
                        <span>NaanStop Royal Dawat Dining</span>
                    </span>
                    <h1 className="hero-title">Book an Authentic Royal Desi Dining Experience</h1>
                    <p className="hero-subtitle">
                        Reserve your preferred table at NaanStop. From the regal Maharaja Diwan to the rustic Dhaba Charpai Courtyard, enjoy legendary hospitality and fresh-from-the-tandoor delicacies.
                    </p>

                    <div className="hero-tab-toggle">
                        <button
                            type="button"
                            className={`hero-tab-btn ${activeTab === 'book' ? 'active' : ''}`}
                            onClick={() => setActiveTab('book')}
                        >
                            <Calendar size={15} />
                            <span>Reserve a Table</span>
                        </button>
                        <button
                            type="button"
                            className={`hero-tab-btn ${activeTab === 'my-bookings' ? 'active' : ''}`}
                            onClick={() => setActiveTab('my-bookings')}
                        >
                            <CalendarCheck size={15} />
                            <span>View My Bookings</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Confirmed Success State */}
            {confirmedBooking ? (
                <div className="booking-confirmation-modal animate-scale-up">
                    <div className="confirmation-card">
                        <div className="confetti-icon-wrapper">
                            <CheckCircle2 size={56} className="check-success" />
                        </div>
                        <span className="confirmed-pill">Reservation Confirmed</span>
                        <h2 className="confirmation-headline">We're Thrilled to Host You!</h2>
                        <p className="confirmation-sub">
                            A confirmation notice has been dispatched to <strong>{confirmedBooking.email}</strong>. Please present your booking code upon arrival.
                        </p>

                        <div className="booking-ticket">
                            <div className="ticket-header">
                                <div>
                                    <span className="ticket-label">Booking Code</span>
                                    <span className="ticket-code">{confirmedBooking.bookingCode}</span>
                                </div>
                                <div className="ticket-status-chip">
                                    <span className="pulsing-green-dot"></span>
                                    <span>Confirmed</span>
                                </div>
                            </div>

                            <div className="ticket-grid">
                                <div className="ticket-item">
                                    <span className="t-label">Guest of Honor</span>
                                    <span className="t-value">{confirmedBooking.name}</span>
                                </div>
                                <div className="ticket-item">
                                    <span className="t-label">Party Size</span>
                                    <span className="t-value">{confirmedBooking.guests} {confirmedBooking.guests === 1 ? 'Guest' : 'Guests'}</span>
                                </div>
                                <div className="ticket-item">
                                    <span className="t-label">Date & Time</span>
                                    <span className="t-value">{confirmedBooking.date} • {confirmedBooking.timeSlot}</span>
                                </div>
                                <div className="ticket-item">
                                    <span className="t-label">Seating Ambiance</span>
                                    <span className="t-value">{confirmedBooking.seatingArea}</span>
                                </div>
                                <div className="ticket-item full">
                                    <span className="t-label">Occasion</span>
                                    <span className="t-value">{confirmedBooking.specialOccasion}</span>
                                </div>
                                {confirmedBooking.specialRequests && (
                                    <div className="ticket-item full">
                                        <span className="t-label">Kitchen Notes</span>
                                        <span className="t-value italic">"{confirmedBooking.specialRequests}"</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="confirmation-actions">
                            <button
                                onClick={() => {
                                    setConfirmedBooking(null);
                                    setActiveTab('my-bookings');
                                }}
                                className="view-bookings-btn"
                            >
                                View My Bookings
                            </button>
                            <button
                                onClick={() => setConfirmedBooking(null)}
                                className="book-another-btn"
                            >
                                Book Another Table
                            </button>
                            <Link to="/" className="explore-menu-btn">
                                Browse Delivery Menu
                            </Link>
                        </div>
                    </div>
                </div>
            ) : activeTab === 'my-bookings' ? (
                /* My Bookings History List */
                <div className="my-bookings-container animate-fade">
                    <div className="my-bookings-header">
                        <h2>Your Active & Past Table Bookings</h2>
                        <p>Track your reservations or seat updates in real time</p>
                    </div>

                    {userBookings.length === 0 ? (
                        <div className="empty-bookings-box">
                            <Calendar size={44} className="empty-cal" />
                            <h3>No Table Reservations Yet</h3>
                            <p>You haven't booked any dining tables under {email}.</p>
                            <button onClick={() => setActiveTab('book')} className="primary-gold-btn">
                                Make Your First Reservation
                            </button>
                        </div>
                    ) : (
                        <div className="bookings-cards-grid">
                            {userBookings.map((b) => (
                                <div key={b._id} className="user-booking-card">
                                    <div className="ub-top">
                                        <span className="ub-code">{b.bookingCode}</span>
                                        <span className={`ub-status ${b.status.toLowerCase()}`}>
                                            {b.status}
                                        </span>
                                    </div>
                                    <h3 className="ub-area">{b.seatingArea}</h3>
                                    <div className="ub-meta">
                                        <p><Calendar size={15} /> {b.date}</p>
                                        <p><Clock size={15} /> {b.timeSlot}</p>
                                        <p><Users size={15} /> {b.guests} Guests</p>
                                    </div>
                                    <div className="ub-occasion">
                                        <span>Occasion: </span>
                                        <strong>{b.specialOccasion}</strong>
                                    </div>
                                    {b.specialRequests && (
                                        <p className="ub-requests">"{b.specialRequests}"</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                /* Main Table Booking Form */
                <form onSubmit={handleSubmitReservation} className="reservation-form-layout animate-fade">
                    <div className="form-main-columns">
                        {/* Left Column: Dining Details */}
                        <div className="form-section-card">
                            <h2 className="section-title">
                                <Users size={20} className="section-ico" />
                                <span>1. Select Party Size & Schedule</span>
                            </h2>

                            {/* Guest Selector */}
                            <div className="form-field-group">
                                <label className="field-label">Number of Guests</label>
                                <div className="guests-pill-selector">
                                    {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                                        <button
                                            type="button"
                                            key={num}
                                            className={`guest-pill ${guests === num ? 'selected' : ''}`}
                                            onClick={() => setGuests(num)}
                                        >
                                            {num} {num === 1 ? 'Guest' : 'Guests'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Date Picker */}
                            <div className="form-field-group">
                                <label className="field-label" htmlFor="res-date">
                                    Reservation Date
                                </label>
                                <div className="input-with-icon">
                                    <Calendar size={18} className="input-icon" />
                                    <input
                                        id="res-date"
                                        type="date"
                                        min={today}
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        required
                                        className="styled-form-input"
                                    />
                                </div>
                            </div>

                            {/* Time Slots */}
                            <div className="form-field-group">
                                <label className="field-label">Select Time Slot</label>
                                <div className="time-slots-grid">
                                    {TIME_SLOTS.map((slot) => (
                                        <button
                                            type="button"
                                            key={slot.time}
                                            className={`time-slot-card ${timeSlot === slot.time ? 'selected' : ''}`}
                                            onClick={() => setTimeSlot(slot.time)}
                                        >
                                            <span className="slot-time">{slot.time}</span>
                                            <span className={`slot-badge ${slot.badge.toLowerCase().replace(' ', '-')}`}>
                                                {slot.badge}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Middle Column: Seating Ambiance */}
                        <div className="form-section-card">
                            <h2 className="section-title">
                                <Sparkles size={20} className="section-ico" />
                                <span>2. Choose Seating Ambiance</span>
                            </h2>

                            <div className="seating-cards-stack">
                                {SEATING_AREAS.map((area) => (
                                    <div
                                        key={area.id}
                                        className={`seating-area-card ${seatingArea === area.id ? 'selected' : ''}`}
                                        onClick={() => setSeatingArea(area.id)}
                                    >
                                        <div className="area-icon-box">{area.icon}</div>
                                        <div className="area-info">
                                            <div className="area-top">
                                                <h3 className="area-title">{area.title}</h3>
                                                <span className="area-tag">{area.tag}</span>
                                            </div>
                                            <p className="area-desc">{area.desc}</p>
                                        </div>
                                        <div className="radio-check-circle">
                                            {seatingArea === area.id && <div className="radio-inner-dot" />}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Occasion Selector */}
                            <div className="form-field-group occasion-group">
                                <label className="field-label">Is this a Special Occasion?</label>
                                <div className="occasion-chips-wrap">
                                    {OCCASIONS.map((occ) => (
                                        <button
                                            type="button"
                                            key={occ}
                                            className={`occasion-chip ${occasion === occ ? 'selected' : ''}`}
                                            onClick={() => setOccasion(occ)}
                                        >
                                            {occ}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Guest Details & Confirmation */}
                        <div className="form-section-card guest-details-col">
                            <h2 className="section-title">
                                <User size={20} className="section-ico" />
                                <span>3. Contact & Final Confirmation</span>
                            </h2>

                            <div className="form-field-group">
                                <label className="field-label" htmlFor="res-name">Primary Contact Name</label>
                                <div className="input-with-icon">
                                    <User size={18} className="input-icon" />
                                    <input
                                        id="res-name"
                                        type="text"
                                        placeholder="Full Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        className="styled-form-input"
                                    />
                                </div>
                            </div>

                            <div className="form-field-group">
                                <label className="field-label" htmlFor="res-email">Confirmation Email</label>
                                <div className="input-with-icon">
                                    <Mail size={18} className="input-icon" />
                                    <input
                                        id="res-email"
                                        type="email"
                                        placeholder="Email Address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="styled-form-input"
                                    />
                                </div>
                            </div>

                            <div className="form-field-group">
                                <label className="field-label" htmlFor="res-phone">Mobile Phone Number</label>
                                <div className="input-with-icon">
                                    <Phone size={18} className="input-icon" />
                                    <input
                                        id="res-phone"
                                        type="tel"
                                        placeholder="Phone Number"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        required
                                        className="styled-form-input"
                                    />
                                </div>
                            </div>

                            <div className="form-field-group">
                                <label className="field-label" htmlFor="res-notes">
                                    Special Requests or Dietary Notes
                                </label>
                                <textarea
                                    id="res-notes"
                                    placeholder="High chair needed, wheelchair accessible table, allergies, anniversary surprise dessert..."
                                    value={specialRequests}
                                    onChange={(e) => setSpecialRequests(e.target.value)}
                                    rows={3}
                                    className="styled-form-textarea"
                                />
                            </div>

                            {/* Summary Preview Box */}
                            <div className="booking-summary-preview">
                                <div className="preview-row">
                                    <span>Date & Time</span>
                                    <strong>{date} at {timeSlot}</strong>
                                </div>
                                <div className="preview-row">
                                    <span>Guests & Area</span>
                                    <strong>{guests} Guests • {seatingArea}</strong>
                                </div>
                                <div className="preview-row">
                                    <span>Table Hold</span>
                                    <span className="hold-badge">Guaranteed Table</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="confirm-booking-submit-btn"
                                id="submit-table-booking-btn"
                            >
                                {isSubmitting ? 'Securing Your Table...' : 'Confirm Table Reservation'}
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
};

export default Reservations;
