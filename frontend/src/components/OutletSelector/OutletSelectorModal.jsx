import React, { useContext } from 'react';
import { X, Store, MapPin, Clock, Star, CheckCircle2, ChevronRight, Sparkles, Navigation } from 'lucide-react';
import { StoreContext } from '../../context/StoreContext';
import './OutletSelectorModal.css';

const OutletSelectorModal = () => {
    const { 
        OUTLETS = [], 
        selectedOutlet, 
        handleSelectOutlet, 
        outletModalOpen, 
        setOutletModalOpen 
    } = useContext(StoreContext);

    if (!outletModalOpen) return null;

    return (
        <div className="outlet-modal-overlay" onClick={() => setOutletModalOpen(false)}>
            <div className="outlet-modal-card" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="outlet-modal-header">
                    <div className="outlet-modal-title-group">
                        <div className="outlet-icon-badge">
                            <Store size={22} className="outlet-icon" />
                        </div>
                        <div>
                            <h3>Select NaanStop Cloud Kitchen</h3>
                            <p>Choose an outlet near you for fastest delivery & hot tandoori packs</p>
                        </div>
                    </div>
                    <button 
                        className="outlet-close-btn" 
                        onClick={() => setOutletModalOpen(false)}
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Outlets List */}
                <div className="outlet-list">
                    {OUTLETS.map((outlet) => {
                        const isSelected = selectedOutlet?.id === outlet.id;
                        return (
                            <div 
                                key={outlet.id} 
                                className={`outlet-item-card ${isSelected ? 'selected' : ''}`}
                                onClick={() => handleSelectOutlet(outlet)}
                            >
                                <div className="outlet-card-top">
                                    <div className="outlet-main-info">
                                        <div className="outlet-name-row">
                                            <h4>{outlet.name}</h4>
                                            <span className="outlet-badge">{outlet.badge}</span>
                                        </div>
                                        <span className="outlet-type-tag">{outlet.type}</span>
                                    </div>
                                    {isSelected && (
                                        <div className="outlet-selected-chip">
                                            <CheckCircle2 size={16} /> Selected
                                        </div>
                                    )}
                                </div>

                                <div className="outlet-address-row">
                                    <MapPin size={15} className="outlet-pin-icon" />
                                    <span>{outlet.address}, {outlet.city}</span>
                                </div>

                                <div className="outlet-meta-footer">
                                    <div className="outlet-stat-pill">
                                        <Clock size={14} />
                                        <span><strong>{outlet.etaMins} mins</strong> delivery</span>
                                    </div>
                                    <div className="outlet-stat-pill">
                                        <Navigation size={14} />
                                        <span><strong>{outlet.distanceKm} km</strong> away</span>
                                    </div>
                                    <div className="outlet-stat-pill rating">
                                        <Star size={14} fill="#f59e0b" color="#f59e0b" />
                                        <span><strong>{outlet.rating}</strong> ({outlet.reviews})</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer info */}
                <div className="outlet-modal-footer">
                    <Sparkles size={16} className="sparkle-hint" />
                    <span>All outlets follow strict 5-star FSSAI hygiene & 100% contactless dispatch.</span>
                </div>
            </div>
        </div>
    );
};

export default OutletSelectorModal;
