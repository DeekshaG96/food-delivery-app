import React, { useState, useContext } from 'react';
import { X, Star, Clock, Flame, Plus, Minus, Check, Sparkles, ChefHat } from 'lucide-react';
import { StoreContext } from '../../context/StoreContext';
import './FoodDetailModal.css';

const SIZES = [
    { id: 'regular', name: 'Regular', extraPrice: 0, serves: 'Serves 1', desc: 'Standard single portion' },
    { id: 'medium', name: 'Medium', extraPrice: 3.50, serves: 'Serves 2', desc: '+35% generous portion' },
    { id: 'large', name: 'Large / Family', extraPrice: 7.00, serves: 'Serves 3–4', desc: 'Family sharing size' }
];

const ADD_ONS = [
    { id: 'cheese', name: 'Extra Melted Cheese', price: 1.50 },
    { id: 'sauce', name: 'Artisan Garlic Dip', price: 0.99 },
    { id: 'avocado', name: 'Fresh Hass Avocado Slices', price: 2.00 },
    { id: 'crunch', name: 'Crispy Shallots & Herbs', price: 0.75 }
];

const SPICE_LEVELS = ['Mild 🌿', 'Medium 🌶️', 'Hot 🔥'];

const FoodDetailModal = ({ food, onClose }) => {
    const { addToCart, showToast, url } = useContext(StoreContext);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('regular');
    const [selectedSpice, setSelectedSpice] = useState('Medium 🌶️');
    const [selectedAddOns, setSelectedAddOns] = useState([]);
    const [specialNotes, setSpecialNotes] = useState('');

    if (!food) return null;

    const imageSrc = food.image.startsWith('http') ? food.image : `${url}/images/${food.image}`;

    const toggleAddOn = (addonId) => {
        setSelectedAddOns(prev =>
            prev.includes(addonId)
                ? prev.filter(id => id !== addonId)
                : [...prev, addonId]
        );
    };

    const currentSizeObj = SIZES.find(s => s.id === selectedSize) || SIZES[0];

    const addOnsTotal = selectedAddOns.reduce((sum, id) => {
        const item = ADD_ONS.find(a => a.id === id);
        return sum + (item ? item.price : 0);
    }, 0);

    const unitPrice = food.price + currentSizeObj.extraPrice + addOnsTotal;
    const finalTotal = unitPrice * quantity;

    const handleAddToCart = () => {
        const customization = {
            size: currentSizeObj.name,
            addOns: selectedAddOns.map(id => ADD_ONS.find(a => a.id === id)?.name).filter(Boolean),
            spice: selectedSpice,
            notes: specialNotes,
            unitPrice: unitPrice
        };
        addToCart(food._id, quantity, true, customization);
        const addonText = selectedAddOns.length > 0 ? ` with ${selectedAddOns.length} add-ons` : '';
        showToast(`Added ${quantity}x ${food.name} (${currentSizeObj.name})${addonText} to cart! 🍽️`, 'success');
        onClose();
    };

    return (
        <div className="modal-backdrop" onClick={onClose} id="food-detail-modal-backdrop">
            <div
                className="food-modal-container animate-scale-up"
                onClick={(e) => e.stopPropagation()}
                id="food-detail-modal"
            >
                {/* Close Button */}
                <button
                    className="modal-close-btn"
                    onClick={onClose}
                    aria-label="Close modal"
                    id="close-food-modal"
                >
                    <X size={20} />
                </button>

                {/* Top Image Banner */}
                <div className="modal-image-wrapper">
                    <img
                        src={imageSrc}
                        alt={food.name}
                        className="modal-dish-img"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=700&auto=format&fit=crop&q=80";
                        }}
                    />
                    <div className="modal-image-overlay">
                        <span className="modal-category-pill">{food.category}</span>
                        <div className="modal-rating-badge">
                            <Star size={14} fill="#ff9f1c" color="#ff9f1c" />
                            <span>4.9 (140+ reviews)</span>
                        </div>
                    </div>
                </div>

                {/* Modal Body */}
                <div className="modal-body-content">
                    <div className="modal-dish-header">
                        <div>
                            <h2 className="modal-dish-title">{food.name}</h2>
                            <div className="modal-dish-meta-row">
                                <span className="meta-pill"><Clock size={14} /> 20–30 mins</span>
                                <span className="meta-pill"><Flame size={14} /> ~450 kcal</span>
                                <span className="meta-pill highlight"><ChefHat size={14} /> Chef's Choice</span>
                            </div>
                        </div>
                        <div className="modal-dish-price">${Number(food.price).toFixed(2)}</div>
                    </div>

                    <p className="modal-dish-desc">{food.description}</p>

                    {/* Size Variation Selector (Inspired by Delivery App) */}
                    <div className="custom-section">
                        <label className="section-label">
                            <span>Select Portion Size</span>
                            <span className="optional-tag">Delivery App Variation</span>
                        </label>
                        <div className="sizes-grid">
                            {SIZES.map((s) => (
                                <button
                                    type="button"
                                    key={s.id}
                                    className={`size-card-btn ${selectedSize === s.id ? 'active' : ''}`}
                                    onClick={() => setSelectedSize(s.id)}
                                >
                                    <div className="size-card-top">
                                        <span className="size-name">{s.name}</span>
                                        <span className="size-price-diff">
                                            {s.extraPrice === 0 ? 'Standard' : `+$${s.extraPrice.toFixed(2)}`}
                                        </span>
                                    </div>
                                    <span className="size-serves">{s.serves}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Spice Level Selector */}
                    <div className="custom-section">
                        <label className="section-label">Spice Preference</label>
                        <div className="spice-pill-group">
                            {SPICE_LEVELS.map((level) => (
                                <button
                                    type="button"
                                    key={level}
                                    className={`spice-pill ${selectedSpice === level ? 'active' : ''}`}
                                    onClick={() => setSelectedSpice(level)}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Add-ons Checklist */}
                    <div className="custom-section">
                        <label className="section-label">
                            <span>Optional Add-ons</span>
                            <span className="optional-tag">Customize your taste</span>
                        </label>
                        <div className="addons-grid">
                            {ADD_ONS.map((addon) => {
                                const isChecked = selectedAddOns.includes(addon.id);
                                return (
                                    <div
                                        key={addon.id}
                                        className={`addon-card ${isChecked ? 'selected' : ''}`}
                                        onClick={() => toggleAddOn(addon.id)}
                                    >
                                        <div className="addon-checkbox">
                                            {isChecked && <Check size={14} />}
                                        </div>
                                        <span className="addon-name">{addon.name}</span>
                                        <span className="addon-price">+${addon.price.toFixed(2)}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Special Instructions */}
                    <div className="custom-section">
                        <label className="section-label">Special Cooking Instructions</label>
                        <textarea
                            className="notes-textarea"
                            placeholder="e.g. dressing on the side, extra crispy, allergy notes..."
                            value={specialNotes}
                            onChange={(e) => setSpecialNotes(e.target.value)}
                            rows={2}
                        />
                    </div>
                </div>

                {/* Modal Footer / CTA */}
                <div className="modal-footer-bar">
                    <div className="modal-quantity-control">
                        <button
                            className="qty-btn"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            disabled={quantity <= 1}
                        >
                            <Minus size={16} />
                        </button>
                        <span className="qty-display">{quantity}</span>
                        <button
                            className="qty-btn"
                            onClick={() => setQuantity(quantity + 1)}
                        >
                            <Plus size={16} />
                        </button>
                    </div>

                    <button
                        className="modal-add-cart-btn"
                        onClick={handleAddToCart}
                        id="modal-add-to-cart-submit"
                    >
                        <span>Add to Order</span>
                        <span className="total-badge">${finalTotal.toFixed(2)}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FoodDetailModal;
