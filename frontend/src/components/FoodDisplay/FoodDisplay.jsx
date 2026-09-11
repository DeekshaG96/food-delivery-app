import React, { useContext, useState, useMemo } from 'react';
import { Search, UtensilsCrossed, SlidersHorizontal, ArrowUpDown, Sparkles, Leaf, DollarSign } from 'lucide-react';
import { StoreContext } from '../../context/StoreContext';
import FoodItem from '../FoodItem/FoodItem';
import FoodDetailModal from '../FoodDetailModal/FoodDetailModal';
import './FoodDisplay.css';

const DIET_FILTERS = [
    { id: 'all', label: 'All Dishes' },
    { id: 'veg', label: '🌿 Vegetarian', icon: Leaf },
    { id: 'under15', label: '🏷️ Under $15', icon: DollarSign },
    { id: 'popular', label: '⭐ Top Rated', icon: Sparkles }
];

const FoodDisplay = ({ category }) => {
    const { food_list, loadingFoods } = useContext(StoreContext);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("featured");
    const [dietFilter, setDietFilter] = useState("all");
    const [selectedFoodForModal, setSelectedFoodForModal] = useState(null);

    // Process foods with category, diet filter, search, and sorting
    const processedFoods = useMemo(() => {
        let items = food_list.filter(item => {
            const matchesCategory = category === "All" || item.category === category;
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  item.description.toLowerCase().includes(searchQuery.toLowerCase());

            let matchesDiet = true;
            if (dietFilter === 'veg') {
                const vegCategories = ['Salad', 'Pure Veg', 'Pasta', 'Deserts', 'Cake'];
                matchesDiet = vegCategories.includes(item.category) ||
                              item.name.toLowerCase().includes('veg') ||
                              item.description.toLowerCase().includes('vegetable');
            } else if (dietFilter === 'under15') {
                matchesDiet = item.price < 15;
            } else if (dietFilter === 'popular') {
                // Featured popular items
                matchesDiet = item.price >= 14 || item.category === 'Salad' || item.category === 'Pasta';
            }

            return matchesCategory && matchesSearch && matchesDiet;
        });

        // Sorting logic
        if (sortBy === 'price-asc') {
            items.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-desc') {
            items.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'name-asc') {
            items.sort((a, b) => a.name.localeCompare(b.name));
        }

        return items;
    }, [food_list, category, searchQuery, dietFilter, sortBy]);

    return (
        <section className="food-display-section" id="food-display">
            {/* Quick-view / Customization Modal */}
            {selectedFoodForModal && (
                <FoodDetailModal
                    food={selectedFoodForModal}
                    onClose={() => setSelectedFoodForModal(null)}
                />
            )}

            <div className="food-display-top">
                <div className="display-headings">
                    <h2 className="food-display-title">
                        {category === "All" ? "Top dishes near you" : `${category} Specialties`}
                    </h2>
                    <p className="food-display-subtitle">
                        Showing {processedFoods.length} handcrafted culinary delights • Click any dish to customize
                    </p>
                </div>

                {/* Instant Search Box */}
                <div className="search-box-container">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search dishes, ingredients, or flavors..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                        id="dish-search-input"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="clear-search-btn"
                            aria-label="Clear search"
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>

            {/* Filter & Sorting Toolbar */}
            <div className="menu-filter-toolbar">
                <div className="diet-filter-chips">
                    {DIET_FILTERS.map(f => (
                        <button
                            key={f.id}
                            className={`diet-chip ${dietFilter === f.id ? 'active' : ''}`}
                            onClick={() => setDietFilter(f.id)}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                <div className="sorting-control">
                    <ArrowUpDown size={15} className="sort-icon" />
                    <label htmlFor="sort-select" className="sort-label">Sort by:</label>
                    <select
                        id="sort-select"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="sort-dropdown"
                    >
                        <option value="featured">Featured Picks</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="name-asc">Alphabetical (A-Z)</option>
                    </select>
                </div>
            </div>

            {loadingFoods ? (
                <div className="food-loading-grid">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="food-skeleton-card">
                            <div className="skeleton-img"></div>
                            <div className="skeleton-line full"></div>
                            <div className="skeleton-line half"></div>
                            <div className="skeleton-line short"></div>
                        </div>
                    ))}
                </div>
            ) : processedFoods.length === 0 ? (
                <div className="no-foods-found">
                    <UtensilsCrossed size={48} className="empty-icon" />
                    <h3>No culinary creations match your filters</h3>
                    <p>Try resetting the search query or changing your dietary preferences.</p>
                    <button
                        className="reset-filters-btn"
                        onClick={() => {
                            setSearchQuery("");
                            setDietFilter("all");
                            setSortBy("featured");
                        }}
                    >
                        Reset All Filters
                    </button>
                </div>
            ) : (
                <div className="food-display-list">
                    {processedFoods.map((item) => (
                        <FoodItem
                            key={item._id}
                            id={item._id}
                            name={item.name}
                            description={item.description}
                            price={item.price}
                            image={item.image}
                            category={item.category}
                            onQuickView={(foodObj) => setSelectedFoodForModal(foodObj)}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default FoodDisplay;
