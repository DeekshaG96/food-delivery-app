import React from 'react';
import { Smartphone, Download } from 'lucide-react';
import './AppDownload.css';

const AppDownload = () => {
    return (
        <section className="app-download-section" id="app-download">
            <div className="app-download-card">
                <div className="app-download-content">
                    <span className="download-pill">Mobile Ordering</span>
                    <h2 className="download-title">For Better Experience <br />Download Tomato App</h2>
                    <p className="download-subtitle">
                        Get live order tracking, exclusive flash discounts, and ultra-fast one-tap reordering on iOS and Android.
                    </p>
                    <div className="download-platforms">
                        <button className="platform-btn apple" onClick={() => alert("Tomato Mobile App coming soon to App Store!")}>
                            <div className="platform-icon">🍎</div>
                            <div className="platform-text">
                                <small>Download on the</small>
                                <strong>App Store</strong>
                            </div>
                        </button>
                        <button className="platform-btn google" onClick={() => alert("Tomato Mobile App coming soon to Google Play!")}>
                            <div className="platform-icon">▶️</div>
                            <div className="platform-text">
                                <small>GET IT ON</small>
                                <strong>Google Play</strong>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AppDownload;
