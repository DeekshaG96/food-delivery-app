import React, { useState } from 'react';
import axios from 'axios';
import { UploadCloud, CheckCircle, AlertCircle } from 'lucide-react';
import './Add.css';

const Add = ({ url = "http://localhost:4000" }) => {
    const [image, setImage] = useState(false);
    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        category: "Salad"
    });
    const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setStatusMessage({ type: "", text: "" });

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price", Number(data.price));
        formData.append("category", data.category);
        if (image) {
            formData.append("image", image);
        }

        try {
            const response = await axios.post(`${url}/api/food/add`, formData);
            if (response.data.success) {
                setData({
                    name: "",
                    description: "",
                    price: "",
                    category: "Salad"
                });
                setImage(false);
                setStatusMessage({ type: "success", text: "Food item successfully added to live menu!" });
            } else {
                setStatusMessage({ type: "error", text: response.data.message || "Failed to add food" });
            }
        } catch (error) {
            console.error("Add food error:", error);
            setStatusMessage({ type: "error", text: "Server error occurred while adding food item." });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="admin-add-page animate-fade">
            <div className="page-header">
                <h2>Add New Food Dish</h2>
                <p>Upload fresh creations to your restaurant catalog</p>
            </div>

            {statusMessage.text && (
                <div className={`status-banner ${statusMessage.type}`}>
                    {statusMessage.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    <span>{statusMessage.text}</span>
                </div>
            )}

            <form className="add-food-form" onSubmit={onSubmitHandler}>
                <div className="form-group upload-area">
                    <label>Upload Dish Image</label>
                    <label htmlFor="image" className="image-upload-box" id="admin-upload-box">
                        {image ? (
                            <img
                                src={URL.createObjectURL(image)}
                                alt="Preview"
                                className="upload-preview-img"
                            />
                        ) : (
                            <div className="upload-placeholder">
                                <UploadCloud size={40} className="upload-icon" />
                                <p className="upload-text">Click or drag image here</p>
                                <span className="upload-hint">PNG, JPG, WEBP (Max 5MB)</span>
                            </div>
                        )}
                    </label>
                    <input
                        onChange={(e) => setImage(e.target.files[0])}
                        type="file"
                        id="image"
                        hidden
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="food-name">Product Name</label>
                    <input
                        onChange={onChangeHandler}
                        value={data.name}
                        type="text"
                        name="name"
                        placeholder="e.g. Truffle Mushroom Risotto"
                        required
                        id="food-name"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="food-desc">Product Description</label>
                    <textarea
                        onChange={onChangeHandler}
                        value={data.description}
                        name="description"
                        rows="4"
                        placeholder="Detailed flavor profile, fresh ingredients, and dietary details..."
                        required
                        id="food-desc"
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="food-category">Product Category</label>
                        <select
                            onChange={onChangeHandler}
                            name="category"
                            value={data.category}
                            id="food-category"
                        >
                            <option value="Salad">Salad</option>
                            <option value="Rolls">Rolls</option>
                            <option value="Deserts">Deserts</option>
                            <option value="Sandwich">Sandwich</option>
                            <option value="Cake">Cake</option>
                            <option value="Pure Veg">Pure Veg</option>
                            <option value="Pasta">Pasta</option>
                            <option value="Noodles">Noodles</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="food-price">Product Price ($ USD)</label>
                        <input
                            onChange={onChangeHandler}
                            value={data.price}
                            type="number"
                            name="price"
                            placeholder="e.g. 18.50"
                            step="0.5"
                            required
                            id="food-price"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="add-submit-btn"
                    disabled={isSubmitting}
                    id="admin-add-submit-btn"
                >
                    {isSubmitting ? "Adding Dish..." : "ADD TO MENU"}
                </button>
            </form>
        </div>
    );
};

export default Add;
