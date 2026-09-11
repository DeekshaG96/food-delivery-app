import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer" id="footer">
            <div className="footer-content">
                <div className="footer-col-main">
                    <div className="footer-logo">
                        <span className="logo-tomato">Tomato</span>
                        <span className="logo-dot">.</span>
                    </div>
                    <p className="footer-bio">
                        Tomato is your destination for fast, piping hot, and flavorful culinary deliveries. From authentic Mediterranean salads to artisan pasta and indulgent desserts, we bring the city's finest kitchens straight to your doorstep.
                    </p>
                    <div className="footer-social-icons">
                        <span className="social-icon">📱</span>
                        <span className="social-icon">💬</span>
                        <span className="social-icon">📸</span>
                        <span className="social-icon">🐦</span>
                    </div>
                </div>

                <div className="footer-col">
                    <h4 className="footer-col-title">COMPANY</h4>
                    <ul className="footer-links">
                        <li><a href="#explore-menu">Home</a></li>
                        <li><a href="#about">About us</a></li>
                        <li><a href="#delivery">Fast Delivery</a></li>
                        <li><a href="#privacy">Privacy policy</a></li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h4 className="footer-col-title">GET IN TOUCH</h4>
                    <ul className="footer-links">
                        <li>📞 +1-212-456-7890</li>
                        <li>✉️ contact@tomato.com</li>
                        <li>📍 742 Evergreen Terrace, Foodie City</li>
                        <li>⏰ 24/7 Delivery Available</li>
                    </ul>
                </div>
            </div>

            <hr className="footer-separator" />

            <div className="footer-bottom">
                <p className="footer-copyright">
                    Copyright 2026 © Tomato.com - All Rights Reserved. Built with React & Node.js
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
