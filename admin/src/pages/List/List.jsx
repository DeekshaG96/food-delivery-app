import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, Search, Utensils, AlertCircle } from 'lucide-react';
import './List.css';

const List = ({ url = "http://localhost:4000" }) => {
    const [list, setList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState("");

    const fetchList = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${url}/api/food/list`);
            if (response.data.success) {
                setList(response.data.data);
            }
        } catch (error) {
            console.error("Fetch food list error:", error);
        } finally {
            setLoading(false);
        }
    };

    const removeFood = async (foodId, foodName) => {
        if (!window.confirm(`Are you sure you want to remove "${foodName}" from the menu?`)) {
            return;
        }

        try {
            const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
            if (response.data.success) {
                setNotification(`"${foodName}" was removed from the menu.`);
                await fetchList();
                setTimeout(() => setNotification(""), 4000);
            } else {
                alert(response.data.message || "Failed to remove item");
            }
        } catch (error) {
            console.error("Remove food error:", error);
            alert("Error removing item from backend");
        }
    };

    useEffect(() => {
        fetchList();
    }, []);

    const filteredList = list.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-list-page animate-fade">
            <div className="list-page-header">
                <div>
                    <h2>All Menu Dishes</h2>
                    <p>Total {list.length} dishes in your restaurant catalog</p>
                </div>

                <div className="admin-search-input">
                    <Search size={17} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search menu catalog..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        id="admin-catalog-search"
                    />
                </div>
            </div>

            {notification && (
                <div className="list-notification animate-fade">
                    <span>{notification}</span>
                </div>
            )}

            {loading ? (
                <div className="list-loading">
                    <p>Loading restaurant catalog...</p>
                </div>
            ) : filteredList.length === 0 ? (
                <div className="list-empty">
                    <Utensils size={44} className="empty-icon" />
                    <h3>No items found</h3>
                    <p>No dishes match your search query.</p>
                </div>
            ) : (
                <div className="admin-table-wrapper">
                    <div className="admin-table-header">
                        <p>Image</p>
                        <p>Name</p>
                        <p>Category</p>
                        <p>Price</p>
                        <p>Action</p>
                    </div>
                    <hr className="admin-table-divider" />

                    {filteredList.map((item) => {
                        const imgSrc = item.image.startsWith("http")
                            ? item.image
                            : `${url}/images/${item.image}`;

                        return (
                            <div key={item._id} className="admin-table-row" id={`admin-food-row-${item._id}`}>
                                <div className="admin-food-thumb">
                                    <img
                                        src={imgSrc}
                                        alt={item.name}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop&q=80";
                                        }}
                                    />
                                </div>
                                <div className="admin-food-name-col">
                                    <p className="admin-food-title">{item.name}</p>
                                    <span className="admin-food-desc-snippet">{item.description}</span>
                                </div>
                                <div>
                                    <span className="admin-cat-chip">{item.category}</span>
                                </div>
                                <p className="admin-food-price">${Number(item.price).toFixed(2)}</p>
                                <button
                                    onClick={() => removeFood(item._id, item.name)}
                                    className="admin-delete-btn"
                                    title="Delete dish from menu"
                                    id={`admin-delete-btn-${item._id}`}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default List;
