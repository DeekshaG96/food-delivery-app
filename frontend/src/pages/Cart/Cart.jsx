import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart, Tag, CheckCircle } from 'lucide-react';
import { StoreContext } from '../../context/StoreContext';
import './Cart.css';

const Cart = () => {
    const { cartItems, food_list, removeFromCart, addToCart, getTotalCartAmount, url, showToast } = useContext(StoreContext);
    const navigate = useNavigate();
    const [promoCode, setPromoCode] = useState("");
    const [appliedDiscount, setAppliedDiscount] = useState(0);
    const [promoMessage, setPromoMessage] = useState("");

    const subtotal = getTotalCartAmount();
    const deliveryFee = subtotal === 0 ? 0 : (appliedDiscount === -1 ? 0 : 2); // -1 = free shipping
    const discountAmount = appliedDiscount > 0 ? Math.min(appliedDiscount, subtotal) : 0;
    const finalTotal = Math.max(0, subtotal + deliveryFee - discountAmount);

    const handleApplyPromo = (codeToApply) => {
        const code = (codeToApply || promoCode).trim().toUpperCase();
        if (code === "WELCOME10") {
            setAppliedDiscount(10);
            setPromoMessage("Promo code applied: $10.00 OFF!");
            showToast("Promo WELCOME10 applied: $10 off! 🎉", "success");
        } else if (code === "FREESHIP") {
            setAppliedDiscount(-1);
            setPromoMessage("Promo code applied: FREE DELIVERY!");
            showToast("Promo FREESHIP applied: Free Delivery! 🚚", "success");
        } else if (code === "TOMATO20") {
            setAppliedDiscount(Math.round(subtotal * 0.2));
            setPromoMessage("Promo code applied: 20% OFF!");
            showToast("Promo TOMATO20 applied: 20% off! 🍅", "success");
        } else {
            setAppliedDiscount(0);
            setPromoMessage("Invalid promo code. Try WELCOME10 or FREESHIP");
            showToast("Invalid promo code. Try WELCOME10 or FREESHIP", "error");
        }
    };

    const hasItems = Object.values(cartItems).some(qty => qty > 0);

    return (
        <div className="cart-page animate-fade">
            <div className="cart-header-breadcrumb">
                <Link to="/" className="crumb-link">Home</Link>
                <span>/</span>
                <span className="crumb-active">Shopping Cart</span>
            </div>

            {!hasItems ? (
                <div className="cart-empty-state">
                    <div className="empty-cart-circle">
                        <ShoppingCart size={48} />
                    </div>
                    <h2>Your cart is hungry!</h2>
                    <p>You haven't added any dishes to your cart yet. Explore our mouthwatering menu to satisfy your cravings.</p>
                    <Link to="/" className="cart-explore-btn">
                        Browse Menu
                    </Link>
                </div>
            ) : (
                <>
                    <h1 className="cart-title">Your Order Summary</h1>

                    <div className="cart-table-wrapper">
                        <div className="cart-table-header">
                            <p>Dish</p>
                            <p>Title</p>
                            <p>Price</p>
                            <p>Quantity</p>
                            <p>Total</p>
                            <p>Action</p>
                        </div>
                        <hr className="cart-hr" />

                        {food_list.map((item) => {
                            if (cartItems[item._id] > 0) {
                                const imgSrc = item.image.startsWith("http")
                                    ? item.image
                                    : `${url}/images/${item.image}`;
                                return (
                                    <div key={item._id} className="cart-table-row">
                                        <div className="cart-item-thumbnail">
                                            <img
                                                src={imgSrc}
                                                alt={item.name}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop&q=80";
                                                }}
                                            />
                                        </div>
                                        <div className="cart-item-name-col">
                                            <p className="cart-item-title">{item.name}</p>
                                            <span className="cart-item-cat">{item.category}</span>
                                        </div>
                                        <p className="cart-item-price">${Number(item.price).toFixed(2)}</p>
                                        <div className="cart-quantity-stepper">
                                            <button
                                                onClick={() => removeFromCart(item._id)}
                                                className="cart-qty-btn"
                                                id={`cart-minus-${item._id}`}
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="cart-qty-num">{cartItems[item._id]}</span>
                                            <button
                                                onClick={() => addToCart(item._id)}
                                                className="cart-qty-btn"
                                                id={`cart-plus-${item._id}`}
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                        <p className="cart-item-total">
                                            ${(item.price * cartItems[item._id]).toFixed(2)}
                                        </p>
                                        <button
                                            onClick={() => {
                                                // Remove all quantity of this item
                                                const qty = cartItems[item._id];
                                                for (let i = 0; i < qty; i++) {
                                                    removeFromCart(item._id);
                                                }
                                            }}
                                            className="cart-remove-icon-btn"
                                            title="Remove item"
                                            id={`cart-remove-${item._id}`}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </div>

                    <div className="cart-bottom-section">
                        {/* Promo Code Box */}
                        <div className="cart-promocode-card">
                            <div className="promo-header">
                                <Tag size={18} className="promo-icon" />
                                <h3>Have a promo code?</h3>
                            </div>
                            <p className="promo-sub">Enter your voucher code to receive instant savings.</p>
                            <div className="cart-promocode-input">
                                <input
                                    type="text"
                                    placeholder="e.g. WELCOME10"
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value)}
                                    id="promo-input"
                                />
                                <button
                                    onClick={() => handleApplyPromo()}
                                    id="apply-promo-btn"
                                >
                                    Apply
                                </button>
                            </div>
                            {promoMessage && (
                                <p className={`promo-message ${appliedDiscount !== 0 ? "success" : "error"}`}>
                                    {appliedDiscount !== 0 ? <CheckCircle size={14} /> : null}
                                    {promoMessage}
                                </p>
                            )}

                            <div className="quick-promo-tags">
                                <span className="tag-label">Try test codes:</span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPromoCode("WELCOME10");
                                        handleApplyPromo("WELCOME10");
                                    }}
                                    className="promo-chip"
                                >
                                    WELCOME10 ($10 off)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPromoCode("FREESHIP");
                                        handleApplyPromo("FREESHIP");
                                    }}
                                    className="promo-chip"
                                >
                                    FREESHIP (Free delivery)
                                </button>
                            </div>
                        </div>

                        {/* Cart Totals Card */}
                        <div className="cart-total-card">
                            <h2>Cart Totals</h2>
                            <div className="cart-total-details">
                                <div className="cart-line-item">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <hr />
                                <div className="cart-line-item">
                                    <span>Delivery Fee</span>
                                    <span>
                                        {deliveryFee === 0 ? (
                                            <span className="free-text">FREE</span>
                                        ) : (
                                            `$${deliveryFee.toFixed(2)}`
                                        )}
                                    </span>
                                </div>
                                {discountAmount > 0 && (
                                    <>
                                        <hr />
                                        <div className="cart-line-item discount">
                                            <span>Promo Discount</span>
                                            <span>-${discountAmount.toFixed(2)}</span>
                                        </div>
                                    </>
                                )}
                                <hr />
                                <div className="cart-line-item grand-total">
                                    <strong>Total Amount</strong>
                                    <strong>${finalTotal.toFixed(2)}</strong>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate('/order')}
                                className="checkout-cta-btn"
                                id="cart-proceed-checkout-btn"
                            >
                                <span>PROCEED TO CHECKOUT</span>
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
