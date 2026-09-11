import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, User, LogOut, Package, ExternalLink } from 'lucide-react';
import { StoreContext } from '../../context/StoreContext';
import './Navbar.css';

const Navbar = ({ setShowLogin }) => {
    const [menu, setMenu] = useState("home");
    const [profileOpen, setProfileOpen] = useState(false);
    const { 
        getTotalCartCount, 
        token, 
        userName, 
        setToken, 
        adminUrl, 
        pureVegOnly, 
        setPureVegOnly, 
        setSpinModalOpen 
    } = useContext(StoreContext);
    const navigate = useNavigate();
    const location = useLocation();

    const logout = () => {
        setToken("");
        setProfileOpen(false);
        navigate("/");
    };

    const cartCount = getTotalCartCount();

    return (
        <header className="navbar-container">
            <div className="navbar">
                <Link to="/" className="navbar-logo">
                    <span className="logo-naan">Naan</span>
                    <span className="logo-stop">Stop</span>
                    <span className="logo-chilli">🌶️</span>
                </Link>

                <nav className="navbar-menu">
                    <Link
                        to="/"
                        onClick={() => setMenu("home")}
                        className={location.pathname === "/" && menu === "home" ? "active" : ""}
                    >
                        Home
                    </Link>
                    <a
                        href="#explore-menu"
                        onClick={() => setMenu("menu")}
                        className={menu === "menu" ? "active" : ""}
                    >
                        Desi Menu
                    </a>
                    <Link
                        to="/reservations"
                        onClick={() => setMenu("reservations")}
                        className={location.pathname === "/reservations" ? "active" : ""}
                        id="nav-reservations-link"
                    >
                        Book Table
                    </Link>
                    <a
                        href="#app-download"
                        onClick={() => setMenu("mobile-app")}
                        className={menu === "mobile-app" ? "active" : ""}
                    >
                        Mobile App
                    </a>
                    <a
                        href="#footer"
                        onClick={() => setMenu("contact-us")}
                        className={menu === "contact-us" ? "active" : ""}
                    >
                        Contact Us
                    </a>
                </nav>

                <div className="navbar-right">
                    {/* Pure Veg Switch */}
                    <button
                        type="button"
                        onClick={() => setPureVegOnly(!pureVegOnly)}
                        className={`nav-veg-toggle ${pureVegOnly ? 'active' : ''}`}
                        title="Filter Pure Veg dishes only"
                        id="nav-pure-veg-toggle"
                    >
                        <span className="veg-dot-icon">🟢</span>
                        <span className="veg-label">Veg Mode</span>
                        <span className={`veg-switch-pill ${pureVegOnly ? 'on' : ''}`}></span>
                    </button>

                    {/* Spin & Win Button */}
                    <button
                        type="button"
                        onClick={() => setSpinModalOpen(true)}
                        className="nav-spin-btn"
                        title="Spin the Chakkar of Luck for discount codes!"
                        id="nav-spin-wheel-btn"
                    >
                        <span className="spin-icon">🎡</span>
                        <span className="spin-label">Spin & Win</span>
                    </button>

                    {/* Diner Radio Trigger */}
                    <button
                        type="button"
                        onClick={() => {
                            window.dispatchEvent(new CustomEvent('open-music-player', { detail: { play: true } }));
                        }}
                        className="nav-radio-btn"
                        title="Tune into NaanStop Desi Radio & Waiting Lounge"
                        aria-label="NaanStop Diner Radio"
                        id="nav-diner-radio-btn"
                    >
                        <span className="radio-icon">🎵</span>
                        <span className="radio-label">Desi Radio</span>
                    </button>

                    {/* Switch to Admin Dashboard */}
                    <a
                        href={adminUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="admin-badge-btn"
                        title="Open Restaurant Admin Panel"
                    >
                        <span>Kitchen OS</span>
                        <ExternalLink size={13} />
                    </a>

                    {/* Cart Button with Count Badge */}
                    <Link to="/cart" className="navbar-cart-icon" id="navbar-cart-btn" aria-label="Shopping Cart">
                        <ShoppingBag size={22} />
                        {cartCount > 0 && (
                            <span className="cart-badge animate-pop">{cartCount}</span>
                        )}
                    </Link>

                    {/* Auth Area */}
                    {!token ? (
                        <button
                            onClick={() => setShowLogin(true)}
                            className="navbar-signin-btn"
                            id="navbar-signin-btn"
                        >
                            Sign In
                        </button>
                    ) : (
                        <div className="navbar-profile-wrapper">
                            <button
                                className="navbar-profile-btn"
                                onClick={() => setProfileOpen(!profileOpen)}
                                aria-label="User Profile"
                            >
                                <div className="profile-avatar">
                                    {userName ? userName.charAt(0).toUpperCase() : <User size={18} />}
                                </div>
                            </button>

                            {profileOpen && (
                                <div className="profile-dropdown animate-fade">
                                    <div className="dropdown-header">
                                        <p className="user-greeting">Signed in as</p>
                                        <p className="user-name-display">{userName || "Valued Foodie"}</p>
                                    </div>
                                    <hr className="dropdown-divider" />
                                    <button
                                        onClick={() => {
                                            setProfileOpen(false);
                                            navigate('/myorders');
                                        }}
                                        className="dropdown-item"
                                        id="nav-my-orders-btn"
                                    >
                                        <Package size={17} />
                                        <span>My Orders</span>
                                    </button>
                                    <button onClick={logout} className="dropdown-item logout" id="nav-logout-btn">
                                        <LogOut size={17} />
                                        <span>Sign Out</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
