import React, { useContext, useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { StoreContext } from '../../context/StoreContext';
import './Verify.css';

const Verify = () => {
    const [searchParams] = useSearchParams();
    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");
    const { url, setCartItems } = useContext(StoreContext);
    const navigate = useNavigate();

    const [status, setStatus] = useState("verifying"); // verifying, success, failed
    const [message, setMessage] = useState("Verifying payment and confirming order...");

    const verifyPayment = async () => {
        try {
            const response = await axios.post(`${url}/api/order/verify`, { success, orderId });
            if (response.data.success) {
                setStatus("success");
                setMessage("Payment verified! Your order has been placed with the kitchen.");
                setCartItems({}); // Reset local cart
                setTimeout(() => {
                    navigate("/myorders");
                }, 2000);
            } else {
                setStatus("failed");
                setMessage("Payment was cancelled or could not be verified.");
                setTimeout(() => {
                    navigate("/");
                }, 3000);
            }
        } catch (error) {
            console.error("Verification error:", error);
            setStatus("failed");
            setMessage("Error connecting to payment gateway.");
        }
    };

    useEffect(() => {
        verifyPayment();
    }, []);

    return (
        <div className="verify-page animate-fade">
            <div className="verify-card">
                {status === "verifying" && (
                    <>
                        <Loader2 size={54} className="verify-spinner" />
                        <h2>Processing Payment</h2>
                        <p>{message}</p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div className="status-circle success animate-pop">
                            <CheckCircle size={54} />
                        </div>
                        <h2>Order Confirmed!</h2>
                        <p>{message}</p>
                        <button
                            onClick={() => navigate('/myorders')}
                            className="verify-redirect-btn"
                            id="view-my-orders-btn"
                        >
                            View My Orders Now
                        </button>
                    </>
                )}

                {status === "failed" && (
                    <>
                        <div className="status-circle failed animate-pop">
                            <AlertTriangle size={54} />
                        </div>
                        <h2>Payment Failed</h2>
                        <p>{message}</p>
                        <button
                            onClick={() => navigate('/')}
                            className="verify-redirect-btn"
                        >
                            Return to Home
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Verify;
