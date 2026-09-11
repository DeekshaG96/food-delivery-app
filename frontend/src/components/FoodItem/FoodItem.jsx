import React, { useContext } from 'react';
import { Plus, Minus, Star, Flame, Sparkles } from 'lucide-react';
import { StoreContext } from '../../context/StoreContext';
import './FoodItem.css';

const FoodItem = ({ 
    id, 
    name, 
    price, 
    description, 
    image, 
    category, 
    isVeg: propIsVeg,
    spiceDefault,
    bestseller,
    jainAvailable,
    rawItem,
    onQuickView 
}) => {
    const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);

    // Resolve image URL (Unsplash external URL or local static upload)
    const imageSrc = image?.startsWith("http") ? image : `${url}/images/${image}`;
    const itemCount = cartItems[id] || 0;

    // Deduce veg status if not explicitly passed
    const isVeg = propIsVeg !== undefined 
        ? propIsVeg 
        : (category === 'Mithai' || category === 'Chai & Drinks' || category === 'Breads' || 
           /paneer|dal|samosa|chaat|chole|veg|pav bhaji|kulcha|naan|roti|lassi|chai|jamun|halwa|kheer|rasmalai/i.test(name));

    const handleCardClick = () => {
        if (onQuickView) {
            onQuickView({ 
                ...(rawItem || {}),
                _id: id, 
                id, 
                name, 
                price, 
                description, 
                image, 
                category,
                isVeg,
                spiceDefault: spiceDefault || "Medium",
                jainAvailable
            });
        }
    };

    return (
        <div className="food-item-card" id={`food-card-${id}`} onClick={handleCardClick}>
            <div className="food-item-img-container">
                <img
                    className="food-item-image"
                    src={imageSrc}
                    alt={name}
                    loading="lazy"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80";
                    }}
                />

                {/* Category tag */}
                <span className="food-category-tag">{category}</span>

                {/* Bestseller ribbon */}
                {bestseller && (
                    <span className="food-bestseller-badge">
                        <Sparkles size={11} /> Chef's Hit
                    </span>
                )}

                <div className="food-counter-wrapper" onClick={(e) => e.stopPropagation()}>
                    {itemCount === 0 ? (
                        <button
                            className="add-initial-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                addToCart(id);
                            }}
                            aria-label={`Add ${name} to cart`}
                            id={`add-btn-${id}`}
                        >
                            <Plus size={18} />
                        </button>
                    ) : (
                        <div className="food-item-counter animate-pop">
                            <button
                                className="counter-btn minus"
                                onClick={() => removeFromCart(id)}
                                aria-label="Decrease quantity"
                                id={`minus-btn-${id}`}
                            >
                                <Minus size={15} />
                            </button>
                            <span className="counter-value">{itemCount}</span>
                            <button
                                className="counter-btn plus"
                                onClick={() => addToCart(id)}
                                aria-label="Increase quantity"
                                id={`plus-btn-${id}`}
                            >
                                <Plus size={15} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="food-item-info">
                <div className="food-item-header">
                    <div className="title-with-badge">
                        {/* Authentic Indian FSSAI Veg / Non-Veg Indicator */}
                        <span 
                            className={`fssai-indicator ${isVeg ? 'veg' : 'non-veg'}`}
                            title={isVeg ? "100% Pure Veg" : "Contains Non-Veg"}
                        >
                            <span className="fssai-dot"></span>
                        </span>
                        <h3 className="food-item-title">{name}</h3>
                    </div>

                    <div className="rating-stars">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={13} fill="#ff9f1c" color="#ff9f1c" />
                        ))}
                    </div>
                </div>

                <p className="food-item-desc">{description}</p>

                {/* Desi Tags: Spice & Jain */}
                <div className="food-tags-row">
                    {spiceDefault && (
                        <span className="spice-indicator-badge">
                            <Flame size={12} className="spice-icon" /> {spiceDefault}
                        </span>
                    )}
                    {jainAvailable && (
                        <span className="jain-badge" title="Jain Preparation Available (No Onion/Garlic)">
                            🌱 Jain Option
                        </span>
                    )}
                </div>

                <div className="food-item-bottom">
                    <span className="food-item-price">${Number(price).toFixed(2)}</span>
                    {itemCount > 0 && (
                        <span className="in-cart-indicator">
                            {itemCount} in cart (${(price * itemCount).toFixed(2)})
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FoodItem;

