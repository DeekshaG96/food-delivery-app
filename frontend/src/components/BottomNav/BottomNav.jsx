import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Utensils, ShoppingBag, Package, User } from 'lucide-react';
import { StoreContext } from '../../context/StoreContext';
import './BottomNav.css';

const BottomNav = ({ setShowLogin }) => {
    const { getTotalCartCount, token, userName, setProfileModalOpen } = useContext(StoreContext);
    const navigate = useNavigate();
    const location = useLocation();

    const cartCount = getTotalCartCount();

    const handleProfileClick = () => {
        setProfileModalOpen(true);
    };

    const scrollToMenu = () => {
        if (location.pathname !== '/') {
            navigate('/');
            setTimeout(() => {
                const el = document.getElementById('explore-menu');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            const el = document.getElementById('explore-menu');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className="bottom-nav-bar" id="mobile-bottom-nav">
            <button
                className={`nav-tab-item ${location.pathname === '/' ? 'active' : ''}`}
                onClick={() => navigate('/')}
                id="bottom-nav-home"
            >
                <Home size={20} />
                <span>Home</span>
            </button>

            <button
                className="nav-tab-item"
                onClick={scrollToMenu}
                id="bottom-nav-menu"
            >
                <Utensils size={20} />
                <span>Menu</span>
            </button>

            <button
                className={`nav-tab-item ${location.pathname === '/cart' ? 'active' : ''}`}
                onClick={() => navigate('/cart')}
                id="bottom-nav-cart"
            >
                <div className="tab-icon-wrapper">
                    <ShoppingBag size={20} />
                    {cartCount > 0 && (
                        <span className="tab-badge" id="bottom-cart-badge">{cartCount}</span>
                    )}
                </div>
                <span>Cart</span>
            </button>

            <button
                className={`nav-tab-item ${location.pathname === '/myorders' ? 'active' : ''}`}
                onClick={() => navigate('/myorders')}
                id="bottom-nav-orders"
            >
                <Package size={20} />
                <span>Orders</span>
            </button>

            <button
                className="nav-tab-item"
                onClick={handleProfileClick}
                id="bottom-nav-profile"
            >
                <div className="tab-avatar-wrapper">
                    {token ? (
                        <div className="tab-user-avatar">
                            {userName ? userName.charAt(0).toUpperCase() : 'U'}
                        </div>
                    ) : (
                        <User size={20} />
                    )}
                </div>
                <span>{token ? 'Profile' : 'Sign In'}</span>
            </button>
        </nav>
    );
};

export default BottomNav;
