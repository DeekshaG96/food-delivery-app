import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer" id="footer">
            <div className="footer-content">
                <div className="footer-col-main">
                    <div className="footer-logo">
                        <span className="logo-tomato">NaanStop</span>
                        <span className="logo-dot" style={{ color: '#ef4444' }}>🌶️</span>
                    </div>
                    <p className="footer-bio">
                        NaanStop is your royal destination for authentic Dum Biryanis, velvety handi curries, and smoking-hot tandoori breads. <em>Ghar Ka Pyaar, Dhaba Ka Swad</em> — non-stop goodness delivered with pure desi ghee and fiery whole spices!
                    </p>
                    <div className="footer-social-icons">
                        <span className="social-icon">📱</span>
                        <span className="social-icon">💬</span>
                        <span className="social-icon">📸</span>
                        <span className="social-icon">🌶️</span>
                    </div>
                </div>

                <div className="footer-col">
                    <h4 className="footer-col-title">ROYAL CANTEEN</h4>
                    <ul className="footer-links">
                        <li><a href="#explore-menu">Desi Menu</a></li>
                        <li><a href="/reservations">Table Dawat</a></li>
                        <li><a href="/myorders">Raju Bhaiya Tracker</a></li>
                        <li><a href="#spin">Spin & Win Coupons</a></li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h4 className="footer-col-title">GET IN TOUCH</h4>
                    <ul className="footer-links">
                        <li>📞 +1 (555) NAAN-STOP</li>
                        <li>✉️ swad@naanstop.com</li>
                        <li>📍 120 Chandni Chowk Lane, Gourmet Quarter</li>
                        <li>⏰ Tandoors Fired Daily: 11:00 AM – 11:00 PM</li>
                    </ul>
                </div>
            </div>

            <hr className="footer-separator" />

            <div className="footer-bottom">
                <p className="footer-copyright">
                    Copyright 2026 © NaanStop 🌶️ • Modern Desi Canteen & Express Delivery. Built with React & Node.js
                </p>
                <div className="footer-legal-links">
                    <a href="#terms">Terms</a>
                    <span>•</span>
                    <a href="#cookies">Cookies</a>
                    <span>•</span>
                    <a href="#security">Security</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
