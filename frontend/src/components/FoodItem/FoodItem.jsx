import React, { useContext } from 'react';
import { Plus, Minus, Star } from 'lucide-react';
import { StoreContext } from '../../context/StoreContext';
import './FoodItem.css';

const FoodItem = ({ id, name, price, description, image, category, onQuickView }) => {
    const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);

    // Resolve image URL (Unsplash external URL or local static upload)
    const imageSrc = image.startsWith("http") ? image : `${url}/images/${image}`;

    const itemCount = cartItems[id] || 0;

    const handleCardClick = () => {
        if (onQuickView) {
            onQuickView({ _id: id, id, name, price, description, image, category });
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
                <span className="food-category-tag">{category}</span>

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
                    <h3 className="food-item-title">{name}</h3>
                    <div className="rating-stars">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} fill="#ff9f1c" color="#ff9f1c" />
                        ))}
                    </div>
                </div>

                <p className="food-item-desc">{description}</p>

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
