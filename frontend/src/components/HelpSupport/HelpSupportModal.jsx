import React, { useState, useContext, useEffect } from 'react';
import {
    X,
    HelpCircle,
    ChevronDown,
    ChevronUp,
    Phone,
    MessageSquare,
    Mail,
    Send,
    Bot,
    User,
    Sparkles
} from 'lucide-react';
import { StoreContext } from '../../context/StoreContext';
import { registerModal, unregisterModal } from '../../utils/mobileBackHandler';
import './HelpSupportModal.css';

const FAQS = [
    {
        q: "How fast is Raju Bhaiya's delivery?",
        a: "All orders are dispatched fresh from our clay tandoor and dum handis within 12–15 minutes, and Raju Bhaiya delivers hot food to your doorstep in 25–35 minutes."
    },
    {
        q: "Is your vegetarian food strictly prepared?",
        a: "Yes! When you activate 🟢 Pure Veg Mode, our kitchen utilizes segregated pure veg cookware, oil fryers, and tandoor compartments, adhering 100% to FSSAI vegetarian standards."
    },
    {
        q: "How do I apply coupons like TADKA20 or spin prizes?",
        a: "Coupons won from the 🎡 Chakkar of Luck spin-the-wheel are automatically applied to your cart! You can also enter codes manually on the Cart page."
    },
    {
        q: "Can I request Jain friendly preparation?",
        a: "Absolutely! Dishes with the Jain badge can be toggled to 100% Jain Friendly inside the Dish Customization Modal, completely omitting onion, garlic, and root vegetables."
    },
    {
        q: "What is your cancellation and refund policy?",
        a: "You may cancel your order free of charge within 60 seconds of placement. If any dish fails to meet our high culinary standards, an instant refund or replacement will be initiated immediately."
    }
];

const HelpSupportModal = () => {
    const { helpModalOpen, setHelpModalOpen } = useContext(StoreContext);
    const [expandedFaq, setExpandedFaq] = useState(0);
    const [activeTab, setActiveTab] = useState('faq'); // 'faq' | 'chat'

    // Interactive Chat Simulation
    const [chatMessages, setChatMessages] = useState([
        { sender: 'bot', text: 'Namaste! 🙏 Welcome to NaanStop Support. How can we help you feast today?' }
    ]);
    const [inputText, setInputText] = useState('');

    useEffect(() => {
        if (helpModalOpen) {
            registerModal('help_support_modal', () => setHelpModalOpen(false));
            return () => unregisterModal('help_support_modal');
        }
    }, [helpModalOpen, setHelpModalOpen]);

    if (!helpModalOpen) return null;

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const userMsg = inputText.trim();
        setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
        setInputText('');

        setTimeout(() => {
            let botReply = "Thank you for reaching out! Our kitchen desk is on it. Raju Bhaiya is tracking your order and will contact you on your registered phone if needed.";
            const lower = userMsg.toLowerCase();
            if (lower.includes('veg') || lower.includes('jain')) {
                botReply = "All Pure Veg items are prepared with separate utensils and pure Amul ghee/oil. You can filter by 'Veg Mode' anytime on the top menu bar!";
            } else if (lower.includes('late') || lower.includes('time') || lower.includes('where')) {
                botReply = "Orders usually arrive in 25-35 minutes. You can check Raju Bhaiya's live animated GPS tracker in 'My Orders'!";
            } else if (lower.includes('refund') || lower.includes('cancel')) {
                botReply = "You can cancel within 60 seconds from 'My Orders'. For refunds, our payment gateway processes reversals within 2-4 hours.";
            } else if (lower.includes('coupon') || lower.includes('discount')) {
                botReply = "Spin the Chakkar of Luck 🎡 on our homepage to win instant coupons up to 20% off or free Makhan Lassi!";
            }

            setChatMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
        }, 600);
    };

    return (
        <div className="help-modal-backdrop animate-fade" onClick={() => setHelpModalOpen(false)}>
            <div className="help-modal-container animate-scale" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="help-modal-header">
                    <div className="help-title-block">
                        <HelpCircle size={22} className="help-icon-glow" />
                        <div>
                            <h3>NaanStop Help & Support</h3>
                            <span className="help-subtitle">24/7 Culinary & Delivery Assistance</span>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="help-close-btn"
                        onClick={() => setHelpModalOpen(false)}
                        aria-label="Close help"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="help-tabs-row">
                    <button
                        type="button"
                        className={`help-tab ${activeTab === 'faq' ? 'active' : ''}`}
                        onClick={() => setActiveTab('faq')}
                    >
                        <span>Frequently Asked Questions</span>
                    </button>
                    <button
                        type="button"
                        className={`help-tab ${activeTab === 'chat' ? 'active' : ''}`}
                        onClick={() => setActiveTab('chat')}
                    >
                        <MessageSquare size={15} />
                        <span>Live NaanStop Chat</span>
                    </button>
                </div>

                {/* Content */}
                <div className="help-modal-body">
                    {activeTab === 'faq' ? (
                        <div className="faq-container">
                            <div className="quick-contact-pills">
                                <a href="tel:+919876543210" className="quick-contact-card">
                                    <Phone size={18} className="qc-icon phone" />
                                    <div>
                                        <strong>Call Kitchen</strong>
                                        <span>+91 98765 43210</span>
                                    </div>
                                </a>
                                <a href="mailto:support@naanstop.delivery" className="quick-contact-card">
                                    <Mail size={18} className="qc-icon mail" />
                                    <div>
                                        <strong>Email Desk</strong>
                                        <span>support@naanstop.delivery</span>
                                    </div>
                                </a>
                            </div>

                            <div className="faq-accordion-list">
                                {FAQS.map((faq, index) => {
                                    const isOpen = expandedFaq === index;
                                    return (
                                        <div key={index} className={`faq-card ${isOpen ? 'open' : ''}`}>
                                            <button
                                                type="button"
                                                className="faq-question-btn"
                                                onClick={() => setExpandedFaq(isOpen ? -1 : index)}
                                            >
                                                <span>{faq.q}</span>
                                                {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                            </button>
                                            {isOpen && (
                                                <div className="faq-answer-content animate-fade">
                                                    <p>{faq.a}</p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="live-chat-container">
                            <div className="chat-messages-scroll">
                                {chatMessages.map((msg, i) => (
                                    <div key={i} className={`chat-bubble-row ${msg.sender}`}>
                                        <div className="chat-avatar">
                                            {msg.sender === 'bot' ? <Bot size={16} /> : <User size={16} />}
                                        </div>
                                        <div className="chat-bubble-text">
                                            <p>{msg.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <form onSubmit={handleSendMessage} className="chat-input-row">
                                <input
                                    type="text"
                                    placeholder="Type your question here (e.g. refund, delivery, veg)..."
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                />
                                <button type="submit" className="chat-send-btn" aria-label="Send">
                                    <Send size={16} />
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                <div className="help-modal-footer">
                    <span>Google Play Verified Support Protocol • Typical response time &lt; 2 minutes</span>
                </div>
            </div>
        </div>
    );
};

export default HelpSupportModal;
