import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import './Toast.css';

const Toast = ({ message, type = 'success', onClose }) => {
    if (!message) return null;

    const icons = {
        success: <CheckCircle2 className="toast-icon success" size={20} />,
        error: <AlertCircle className="toast-icon error" size={20} />,
        info: <Info className="toast-icon info" size={20} />
    };

    return (
        <div className={`toast-notification toast-${type} animate-slide-in`} id="app-toast">
            <div className="toast-content">
                {icons[type] || icons.info}
                <span className="toast-text">{message}</span>
            </div>
            <button className="toast-close-btn" onClick={onClose} aria-label="Dismiss notification">
                <X size={16} />
            </button>
        </div>
    );
};

export default Toast;
