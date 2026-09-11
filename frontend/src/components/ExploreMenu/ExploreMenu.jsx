import React from 'react';
import { menu_list } from '../../assets/assets';
import './ExploreMenu.css';

const ExploreMenu = ({ category, setCategory }) => {
    return (
        <section className="explore-menu-section" id="explore-menu">
            <div className="section-header">
                <span className="section-pill">Taste the Desi Magic 🌶️</span>
                <h2 className="section-title">Explore Our Royal Desi Canteen Menu</h2>
                <p className="section-subtitle">
                    Hand-crafted authentic recipes from Old Delhi, Lucknow, Hyderabad, and Amritsar. Cooked with pure spices, slow-cooked gravies, and tandoori sizzle.
                </p>
            </div>

            <div className="explore-menu-list">
                {menu_list.map((item, index) => {
                    const isActive = category === item.menu_name;
                    return (
                        <div
                            key={index}
                            onClick={() => setCategory(prev => prev === item.menu_name ? "All" : item.menu_name)}
                            className={`explore-menu-item ${isActive ? "active" : ""}`}
                            id={`category-${item.menu_name.toLowerCase()}`}
                        >
                            <div className="menu-image-container">
                                <img
                                    src={item.menu_image}
                                    alt={item.menu_name}
                                    className="menu-item-img"
                                    loading="lazy"
                                />
                                {isActive && <div className="active-dot"></div>}
                            </div>
                            <p className="menu-item-name">{item.menu_name}</p>
                        </div>
                    );
                })}
            </div>
            <hr className="menu-divider" />
        </section>
    );
};

export default ExploreMenu;
