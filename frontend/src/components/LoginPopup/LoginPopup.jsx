import React, { useState, useContext } from 'react';
import axios from 'axios';
import { X, Mail, Lock, User, Sparkles } from 'lucide-react';
import { StoreContext } from '../../context/StoreContext';
import './LoginPopup.css';

const LoginPopup = ({ setShowLogin }) => {
    const { url, setToken } = useContext(StoreContext);
    const [currState, setCurrState] = useState("Login");
    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
        setErrorMessage("");
    };

    const onLogin = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setErrorMessage("");

        let endpoint = currState === "Login" ? `${url}/api/user/login` : `${url}/api/user/register`;

        try {
            const response = await axios.post(endpoint, data);
            if (response.data.success) {
                setToken(response.data.token, response.data.user?.name || data.name || "Customer");
                setShowLogin(false);
            } else {
                setErrorMessage(response.data.message || "Authentication failed");
            }
        } catch (error) {
            console.error("Auth error:", error);
            setErrorMessage("Server error. Please ensure backend is running.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Quick demo login convenience for instant review
    const handleDemoLogin = async () => {
        setIsSubmitting(true);
        try {
            // Auto register/login demo user
            const demoData = {
                name: "Alex Morgan",
                email: "alex.demo@tomato.com",
                password: "password123"
            };
            let res = await axios.post(`${url}/api/user/login`, {
                email: demoData.email,
                password: demoData.password
            });
            if (!res.data.success) {
                // Register if not existing
                res = await axios.post(`${url}/api/user/register`, demoData);
            }
            if (res.data.success) {
                setToken(res.data.token, res.data.user?.name || demoData.name);
                setShowLogin(false);
            } else {
                setErrorMessage(res.data.message);
            }
        } catch (err) {
            console.error("Demo login error:", err);
            setErrorMessage("Could not connect to backend server.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="login-popup-overlay">
            <div className="login-popup-container animate-fade">
                <div className="login-popup-header">
                    <div>
                        <h2 className="popup-title">{currState}</h2>
                        <p className="popup-subtitle">
                            {currState === "Login" ? "Welcome back! Good food awaits." : "Join thousands of food lovers today."}
                        </p>
                    </div>
                    <button
                        onClick={() => setShowLogin(false)}
                        className="popup-close-btn"
                        id="close-login-popup"
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </div>

                {errorMessage && (
                    <div className="auth-error-badge">
                        <span>⚠️ {errorMessage}</span>
                    </div>
                )}

                <form onSubmit={onLogin} className="login-popup-form">
                    <div className="form-fields">
                        {currState === "Sign Up" && (
                            <div className="input-group">
                                <User size={18} className="input-icon" />
                                <input
                                    name="name"
                                    onChange={onChangeHandler}
                                    value={data.name}
                                    type="text"
                                    placeholder="Your Full Name"
                                    required
                                    id="signup-name-input"
                                />
                            </div>
                        )}

                        <div className="input-group">
                            <Mail size={18} className="input-icon" />
                            <input
                                name="email"
                                onChange={onChangeHandler}
                                value={data.email}
                                type="email"
                                placeholder="Email address"
                                required
                                id="login-email-input"
                            />
                        </div>

                        <div className="input-group">
                            <Lock size={18} className="input-icon" />
                            <input
                                name="password"
                                onChange={onChangeHandler}
                                value={data.password}
                                type="password"
                                placeholder="Password (min. 6 characters)"
                                required
                                id="login-password-input"
                            />
                        </div>
                    </div>

                    <div className="login-popup-condition">
                        <input type="checkbox" required defaultChecked id="terms-checkbox" />
                        <label htmlFor="terms-checkbox">
                            By continuing, I agree to the <a href="#terms">Terms of Service</a> & <a href="#privacy">Privacy Policy</a>.
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="auth-submit-btn"
                        disabled={isSubmitting}
                        id="auth-submit-btn"
                    >
                        {isSubmitting ? "Please wait..." : currState === "Sign Up" ? "Create Account" : "Sign In"}
                    </button>
                </form>

                {/* Instant 1-Click Demo Login */}
                <button
                    type="button"
                    onClick={handleDemoLogin}
                    disabled={isSubmitting}
                    className="demo-login-btn"
                    id="demo-login-btn"
                >
                    <Sparkles size={16} />
                    <span>Instant 1-Click Demo Login</span>
                </button>

                <div className="auth-toggle-footer">
                    {currState === "Login" ? (
                        <p>
                            Don't have an account?{" "}
                            <span onClick={() => { setCurrState("Sign Up"); setErrorMessage(""); }}>
                                Sign up now
                            </span>
                        </p>
                    ) : (
                        <p>
                            Already have an account?{" "}
                            <span onClick={() => { setCurrState("Login"); setErrorMessage(""); }}>
                                Login here
                            </span>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginPopup;
