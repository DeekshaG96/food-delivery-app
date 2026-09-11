import React from 'react';
import { ArrowRight, Clock, Star } from 'lucide-react';
import './Header.css';

const Header = () => {
    return (
        <section className="header-section">
            <div className="header-card">
                <div className="header-overlay"></div>
                <div className="header-contents">
                    <div className="header-badges">
                        <span className="badge-chip">
                            <Clock size={14} />
                            <span>Fast 30-min Delivery</span>
                        </span>
                        <span className="badge-chip gold">
                            <Star size={14} fill="#ff9f1c" />
                            <span>4.9 / 5 Rated</span>
                        </span>
                    </div>

                    <h1 className="header-title">
                        Order your <br />
                        <span className="highlight-text">favourite food</span> here
                    </h1>

                    <p className="header-description">
                        Choose from a diverse menu featuring an exquisite array of dishes crafted with the finest ingredients and culinary artistry. Satisfy your cravings and elevate every mealtime today.
                    </p>

                    <a href="#explore-menu" className="header-cta-btn" id="header-view-menu-btn">
                        <span>Explore Menu</span>
                        <ArrowRight size={18} />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Header;
