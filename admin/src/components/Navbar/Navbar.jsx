import React from 'react';
import { ExternalLink, ShieldAlert } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
    return (
        <header className="admin-navbar">
            <div className="admin-brand">
                <span className="brand-name">NaanStop</span>
                <span className="brand-dot" style={{ color: '#ef4444' }}>🌶️</span>
                <span className="admin-pill">Kitchen OS & Admin</span>
            </div>

            <div className="admin-navbar-right">
                <a
                    href="http://localhost:5173"
                    target="_blank"
                    rel="noreferrer"
                    className="view-store-btn"
                    title="Open Customer Food Ordering Website"
                    id="view-store-btn"
                >
                    <span>View Customer Store</span>
                    <ExternalLink size={14} />
                </a>

                <div className="admin-avatar">
                    <span>👑 Admin</span>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
