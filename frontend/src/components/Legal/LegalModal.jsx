import React, { useContext, useEffect } from 'react';
import { X, Shield, FileText, CheckCircle } from 'lucide-react';
import { StoreContext } from '../../context/StoreContext';
import { registerModal, unregisterModal } from '../../utils/mobileBackHandler';
import './LegalModal.css';

const LegalModal = () => {
    const { legalModalOpen, setLegalModalOpen } = useContext(StoreContext);

    useEffect(() => {
        if (legalModalOpen) {
            registerModal('legal_modal', () => setLegalModalOpen(null));
            return () => unregisterModal('legal_modal');
        }
    }, [legalModalOpen, setLegalModalOpen]);

    if (!legalModalOpen) return null;

    const isPrivacy = legalModalOpen === 'privacy';

    return (
        <div className="legal-modal-backdrop animate-fade" onClick={() => setLegalModalOpen(null)}>
            <div className="legal-modal-container animate-scale" onClick={(e) => e.stopPropagation()}>
                <div className="legal-modal-header">
                    <div className="legal-title-block">
                        {isPrivacy ? <Shield size={22} className="legal-icon shield" /> : <FileText size={22} className="legal-icon doc" />}
                        <div>
                            <h3>{isPrivacy ? 'Privacy Policy' : 'Terms of Service & Refund Policy'}</h3>
                            <span className="legal-subtitle">Google Play Certified Compliance • Effective September 2026</span>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="legal-close-btn"
                        onClick={() => setLegalModalOpen(null)}
                        aria-label="Close legal modal"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="legal-modal-body">
                    {isPrivacy ? (
                        <div className="legal-text-content">
                            <section>
                                <h4>1. Information We Collect</h4>
                                <p>
                                    NaanStop ("we", "us", or "our") collects information solely to facilitate culinary ordering and express delivery services. This includes:
                                </p>
                                <ul>
                                    <li><strong>Personal Identity:</strong> Name, phone number, and optional email address provided during account creation or guest checkout.</li>
                                    <li><strong>Delivery Information:</strong> Physical delivery addresses, apartment numbers, and drop-off instructions.</li>
                                    <li><strong>Order History:</strong> Dish selections, portion customizations, dietary preferences (such as Pure Veg or Jain), and transaction records.</li>
                                </ul>
                            </section>

                            <section>
                                <h4>2. How We Use Your Data</h4>
                                <p>
                                    Your information is utilized strictly to:
                                </p>
                                <ul>
                                    <li>Transmit prep specifications to the NaanStop Kitchen OS.</li>
                                    <li>Enable dispatch and live route navigation for our designated delivery hero (Raju Bhaiya).</li>
                                    <li>Retain order history locally on your device for fast re-ordering.</li>
                                    <li>Deliver in-app order status alerts and promotional discounts.</li>
                                </ul>
                            </section>

                            <section>
                                <h4>3. Third-Party Data Sharing</h4>
                                <p>
                                    We <strong>never</strong> sell, rent, or monetize your personal information to third-party data brokers or marketing agencies. Necessary address details are shared only with the active delivery partner for the duration of the delivery journey.
                                </p>
                            </section>

                            <section>
                                <h4>4. Google Play Data Safety & Deletion Rights</h4>
                                <p>
                                    In strict accordance with Google Play Developer Policies, all users maintain complete sovereignty over their data. You can delete your saved addresses, favorites, and complete order history at any moment by tapping <strong>"Delete Account & Erase All Data"</strong> within the Profile section.
                                </p>
                            </section>

                            <section>
                                <h4>5. Data Security & Encryption</h4>
                                <p>
                                    All communications between the NaanStop client and our backend services are encrypted via modern TLS 1.3 protocol. Sensitive payment details are processed through PCI-DSS Level 1 certified payment gateways and are never stored in plain text on our servers.
                                </p>
                            </section>
                        </div>
                    ) : (
                        <div className="legal-text-content">
                            <section>
                                <h4>1. Acceptance of Terms</h4>
                                <p>
                                    By accessing or placing an order via the NaanStop mobile application or web store, you agree to be bound by these culinary terms, conditions, and applicable food delivery regulations.
                                </p>
                            </section>

                            <section>
                                <h4>2. Food Safety & FSSAI Standards</h4>
                                <p>
                                    NaanStop adheres to the strictest hygiene standards. Vegetarian dishes prepared under 🟢 <strong>Pure Veg Mode</strong> are made with segregated utensils, fryers, and tandoors to eliminate cross-contact.
                                </p>
                            </section>

                            <section>
                                <h4>3. Order Cancellation Window</h4>
                                <p>
                                    Due to the express nature of our kitchen preparation, customers may cancel placed orders free of charge within <strong>60 seconds</strong> of placement. Once kitchen tandoor cooking has commenced, cancellations may incur a nominal ingredient preparation fee.
                                </p>
                            </section>

                            <section>
                                <h4>4. Refund Policy</h4>
                                <p>
                                    If an order arrives damaged, incorrect, or does not meet our verified quality standards:
                                </p>
                                <ul>
                                    <li>A full or partial refund or immediate dish replacement will be authorized by kitchen support.</li>
                                    <li>Digital payments (UPI, Cards, NetBanking) will be refunded to the original payment source within 2–4 business hours.</li>
                                </ul>
                            </section>

                            <section>
                                <h4>5. Delivery Partner Courtesies</h4>
                                <p>
                                    Our delivery partners (like Raju Bhaiya) strive to bring your food hot and fresh. Tipping is voluntary and 100% of tips go directly to the rider.
                                </p>
                            </section>
                        </div>
                    )}
                </div>

                <div className="legal-modal-footer">
                    <button
                        type="button"
                        className="legal-ack-btn"
                        onClick={() => setLegalModalOpen(null)}
                    >
                        <CheckCircle size={16} />
                        <span>I Understand & Agree</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LegalModal;
