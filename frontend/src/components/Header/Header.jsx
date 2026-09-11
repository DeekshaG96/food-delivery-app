import React, { useContext } from 'react';
import { ArrowRight, Flame, Star, Sparkles } from 'lucide-react';
import { StoreContext } from '../../context/StoreContext';
import './Header.css';

const Header = () => {
    const { setSpinModalOpen } = useContext(StoreContext);

    return (
        <section className="header-section">
            <div className="header-card">
                <div className="header-overlay"></div>
                <div className="header-contents">
                    <div className="header-badges">
                        <span className="badge-chip">
                            <Flame size={14} color="#f59e0b" />
                            <span>100% Asli Desi Ghee</span>
                        </span>
                        <span className="badge-chip gold">
                            <Star size={14} fill="#f59e0b" color="#f59e0b" />
                            <span>4.9 ★ (15,000+ Desi Foodies)</span>
                        </span>
                    </div>

                    <h1 className="header-title">
                        Asli Desi Swad, <br />
                        <span className="highlight-text">Non-Stop Goodness! 🌶️</span>
                    </h1>

                    <p className="header-description">
                        From smoky clay-oven garlic naans to fragrant slow-dum biryanis and royal rich curries. Prepared fresh with authentic spices and delivered piping hot in 30 mins!
                    </p>

                    <div className="header-cta-group">
                        <a href="#explore-menu" className="header-cta-btn" id="header-view-menu-btn">
                            <span>Explore Desi Menu 🍛</span>
                            <ArrowRight size={18} />
                        </a>
                        <button 
                            type="button" 
                            onClick={() => setSpinModalOpen(true)}
                            className="header-spin-cta-btn"
                            id="header-spin-luck-btn"
                        >
                            <Sparkles size={16} />
                            <span>Spin for 20% Off 🎡</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Header;
