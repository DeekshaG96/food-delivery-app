import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart, Tag, CheckCircle, Sparkles, Coins, Flame } from 'lucide-react';
import { StoreContext } from '../../context/StoreContext';
import { triggerHaptic } from '../../utils/haptics';
import './Cart.css';

const RECOMMENDED_PAIRINGS = [
    {
        _id: "food_pair_naan",
        name: "Garlic Butter Naan",
        price: 3.50,
        category: "Breads",
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&auto=format&fit=crop&q=80"
    },
    {
        _id: "food_pair_rice",
        name: "Dum Jeera Rice",
        price: 4.00,
        category: "Rice",
        image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300&auto=format&fit=crop&q=80"
    },
    {
        _id: "food_pair_raita",
        name: "Chilled Boondi Raita",
        price: 2.50,
        category: "Sides",
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&auto=format&fit=crop&q=80"
    },
    {
        _id: "food_pair_lassi",
        name: "Mango Kesar Lassi",
        price: 3.50,
        category: "Beverages",
        image: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=300&auto=format&fit=crop&q=80"
    },
    {
        _id: "food_pair_jamun",
        name: "Hot Gulab Jamun (2 pcs)",
        price: 3.50,
        category: "Mithai",
        image: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=300&auto=format&fit=crop&q=80"
    }
];

const Cart = () => {
    const { 
        cartItems, 
        food_list, 
        removeFromCart, 
        addToCart, 
        getTotalCartAmount, 
        url, 
        showToast,
        appliedCoupon,
        setAppliedCoupon,
        setSpinModalOpen,
        naanCoins,
        streakDays,
        redeemCoinsActive,
        toggleRedeemCoins
    } = useContext(StoreContext);

    const navigate = useNavigate();
    const [promoCode, setPromoCode] = useState(appliedCoupon?.code || "");
    const [appliedDiscount, setAppliedDiscount] = useState(appliedCoupon ? appliedCoupon.discount || 0 : 0);
    const [promoMessage, setPromoMessage] = useState(
        appliedCoupon ? `Applied from Spin Wheel: ${appliedCoupon.label || appliedCoupon.code}` : ""
    );

    const subtotal = getTotalCartAmount();
    const deliveryFee = subtotal === 0 ? 0 : (appliedDiscount === -1 ? 0 : 2); // -1 = free shipping
    const discountAmount = appliedDiscount > 0 ? Math.min(appliedDiscount, subtotal) : 0;
    const coinsDiscount = (redeemCoinsActive && naanCoins >= 100) ? 3.00 : 0;
    const finalTotal = Math.max(0, subtotal + deliveryFee - discountAmount - coinsDiscount);

    const handleApplyPromo = (codeToApply) => {
        const code = (codeToApply || promoCode).trim().toUpperCase();
        if (code === "TADKA20" || code === "TOMATO20") {
            const disc = Math.round(subtotal * 0.2);
            setAppliedDiscount(disc);
            setPromoMessage("Tadka 20% OFF applied! 🔥");
            setAppliedCoupon({ code, discount: disc, label: "20% Tadka Discount" });
            showToast("Promo TADKA20 applied: 20% off! 🌶️", "success");
        } else if (code === "FREELASSI") {
            setAppliedDiscount(4.50);
            setPromoMessage("Free Mango Lassi Voucher Applied ($4.50 OFF)! 🥭");
            setAppliedCoupon({ code, discount: 4.50, label: "Free Mango Lassi" });
            showToast("Promo FREELASSI applied: $4.50 off! 🥭", "success");
        } else if (code === "CHAI5") {
            setAppliedDiscount(5.00);
            setPromoMessage("Chai Lover Special: $5.00 OFF! ☕");
            setAppliedCoupon({ code, discount: 5.00, label: "$5 Chai Discount" });
            showToast("Promo CHAI5 applied: $5.00 off! ☕", "success");
        } else if (code === "DESIFREE" || code === "FREESHIP") {
            setAppliedDiscount(-1);
            setPromoMessage("Desi Express: FREE DELIVERY Applied! 🛵");
            setAppliedCoupon({ code, discount: -1, label: "Free Delivery" });
            showToast("Promo applied: Free Delivery! 🛵", "success");
        } else if (code === "MAKHAN10" || code === "WELCOME10") {
            const disc = code === "WELCOME10" ? 10 : Math.round(subtotal * 0.1);
            setAppliedDiscount(disc);
            setPromoMessage(`${code === "WELCOME10" ? "$10" : "10%"} Makhan Discount applied! 🧈`);
            setAppliedCoupon({ code, discount: disc, label: `${disc} Discount` });
            showToast(`Promo ${code} applied successfully! 🧈`, "success");
        } else if (code === "GULABJAMUN") {
            setAppliedDiscount(3.99);
            setPromoMessage("Free Shahi Gulab Jamun Treat ($3.99 OFF)! 🍯");
            setAppliedCoupon({ code, discount: 3.99, label: "Free Gulab Jamun" });
            showToast("Promo GULABJAMUN applied: $3.99 off! 🍯", "success");
        } else {
            setAppliedDiscount(0);
            setPromoMessage("Invalid promo code. Try spinning the wheel or use TADKA20 / CHAI5 / DESIFREE!");
            showToast("Invalid promo code. Try TADKA20 or DESIFREE", "error");
        }
    };

    const handleQuickAddPairing = (pairing) => {
        triggerHaptic('light');
        addToCart(pairing._id, 1, false, {
            size: 'Regular',
            spice: 'Medium',
            unitPrice: pairing.price
        });
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

                    {/* Smart Desi Pairings & Quick-Add Strip */}
                    <div className="cart-pairings-shelf">
                        <div className="pairings-header">
                            <div className="pairings-title-row">
                                <span className="pairings-badge">Chef's Pairings</span>
                                <h3>Complete Your Dawat! 🫓</h3>
                            </div>
                            <p className="pairings-sub">Pair your curries & biryanis with fresh tandoori breads, jeera rice & cooling raitas</p>
                        </div>
                        <div className="pairings-scroll-cards">
                            {RECOMMENDED_PAIRINGS.map(p => (
                                <div key={p._id} className="pairing-mini-card">
                                    <img src={p.image} alt={p.name} className="pairing-thumb" />
                                    <div className="pairing-info">
                                        <strong className="pairing-name">{p.name}</strong>
                                        <span className="pairing-price">${p.price.toFixed(2)}</span>
                                    </div>
                                    <button 
                                        type="button" 
                                        className="pairing-add-btn"
                                        onClick={() => handleQuickAddPairing(p)}
                                    >
                                        <Plus size={13} /> Add
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="cart-bottom-section">
                        {/* Promo Code & NaanCoins Box */}
                        <div className="cart-promocode-card">
                            {/* NaanCoins Rewards & Daily Streak Wallet */}
                            <div className="naancoins-wallet-card">
                                <div className="nc-card-header">
                                    <div className="nc-coin-avatar">🪙</div>
                                    <div>
                                        <div className="nc-title-row">
                                            <h4>NaanCoins Rewards</h4>
                                            <span className="nc-streak-pill">🔥 {streakDays}-Day Streak!</span>
                                        </div>
                                        <p className="nc-sub">Your Balance: <strong>{naanCoins} NaanCoins</strong></p>
                                    </div>
                                </div>
                                <div className="nc-redemption-row">
                                    <div className="nc-perk-desc">
                                        <span>Redeem 100 Coins for $3.00 OFF</span>
                                    </div>
                                    <button
                                        type="button"
                                        className={`nc-redeem-toggle-btn ${redeemCoinsActive ? 'active' : ''}`}
                                        onClick={toggleRedeemCoins}
                                        disabled={naanCoins < 100}
                                        id="redeem-coins-btn"
                                    >
                                        {redeemCoinsActive ? '✓ $3.00 Off Applied' : 'Use 100 Coins ($3 Off)'}
                                    </button>
                                </div>
                            </div>

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
                                <span className="tag-label">Desi Offer Codes:</span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPromoCode("TADKA20");
                                        handleApplyPromo("TADKA20");
                                    }}
                                    className="promo-chip highlight-chip"
                                >
                                    🌶️ TADKA20 (20% OFF)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPromoCode("FREELASSI");
                                        handleApplyPromo("FREELASSI");
                                    }}
                                    className="promo-chip"
                                >
                                    🥭 FREELASSI ($4.50 off)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPromoCode("DESIFREE");
                                        handleApplyPromo("DESIFREE");
                                    }}
                                    className="promo-chip"
                                >
                                    🛵 DESIFREE (Free delivery)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPromoCode("CHAI5");
                                        handleApplyPromo("CHAI5");
                                    }}
                                    className="promo-chip"
                                >
                                    ☕ CHAI5 ($5 off)
                                </button>
                            </div>

                            {/* Lucky Wheel Promo CTA */}
                            <div className="cart-wheel-cta" onClick={() => setSpinModalOpen(true)}>
                                <span className="wheel-spin-emoji">🎡</span>
                                <div className="wheel-cta-text">
                                    <strong>Chakkar of Luck: Spin & Win!</strong>
                                    <span>Spin the royal wheel to win instant discounts up to 20% off.</span>
                                </div>
                                <span className="wheel-cta-btn">Spin Now</span>
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
                                {coinsDiscount > 0 && (
                                    <>
                                        <hr />
                                        <div className="cart-line-item coins-discount">
                                            <span>🪙 NaanCoins (100 coins)</span>
                                            <span>-$3.00</span>
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
