import React, { useContext, useState, useEffect } from 'react';
import {
    X,
    User,
    Phone,
    Mail,
    MapPin,
    Plus,
    Trash2,
    Heart,
    Shield,
    HelpCircle,
    FileText,
    LogOut,
    AlertTriangle,
    Save,
    CheckCircle2
} from 'lucide-react';
import { StoreContext } from '../../context/StoreContext';
import { registerModal, unregisterModal } from '../../utils/mobileBackHandler';
import './ProfileModal.css';

const ProfileModal = () => {
    const {
        profileModalOpen,
        setProfileModalOpen,
        userProfile,
        updateUserProfile,
        savedAddresses,
        saveAddress,
        deleteAddress,
        favorites,
        pureVegOnly,
        setPureVegOnly,
        clearAllUserData,
        setHelpModalOpen,
        setLegalModalOpen,
        token,
        setToken,
        showToast
    } = useContext(StoreContext);

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(userProfile.name || '');
    const [phone, setPhone] = useState(userProfile.phone || '');
    const [email, setEmail] = useState(userProfile.email || '');

    // Add address form state
    const [showAddAddress, setShowAddAddress] = useState(false);
    const [newAddrLabel, setNewAddrLabel] = useState('Home');
    const [newAddrStreet, setNewAddrStreet] = useState('');
    const [newAddrCity, setNewAddrCity] = useState('Springfield');
    const [newAddrPhone, setNewAddrPhone] = useState('');

    // Delete account confirmation
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

    useEffect(() => {
        if (profileModalOpen) {
            registerModal('profile_modal', () => {
                if (confirmDeleteOpen) setConfirmDeleteOpen(false);
                else setProfileModalOpen(false);
            });
            return () => unregisterModal('profile_modal');
        }
    }, [profileModalOpen, confirmDeleteOpen, setProfileModalOpen]);

    useEffect(() => {
        setName(userProfile.name || '');
        setPhone(userProfile.phone || '');
        setEmail(userProfile.email || '');
    }, [userProfile]);

    if (!profileModalOpen) return null;

    const handleSaveProfile = (e) => {
        e.preventDefault();
        updateUserProfile({
            ...userProfile,
            name,
            phone,
            email
        });
        setIsEditing(false);
    };

    const handleAddAddress = (e) => {
        e.preventDefault();
        if (!newAddrStreet.trim()) {
            showToast('Please enter your street address', 'error');
            return;
        }
        saveAddress({
            label: newAddrLabel,
            tag: newAddrLabel.toLowerCase(),
            street: newAddrStreet,
            city: newAddrCity,
            state: 'OR',
            zipcode: '97477',
            phone: newAddrPhone || phone || '+1-555-0199',
            isDefault: savedAddresses.length === 0
        });
        setNewAddrStreet('');
        setShowAddAddress(false);
    };

    const handleExecuteDeleteAccount = () => {
        clearAllUserData();
        setConfirmDeleteOpen(false);
        setProfileModalOpen(false);
    };

    return (
        <div className="profile-drawer-backdrop animate-fade" onClick={() => setProfileModalOpen(false)}>
            <div className="profile-drawer-container animate-slide-left" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="profile-header">
                    <div className="profile-avatar-row">
                        <div className="profile-avatar-circle">
                            {name ? name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="profile-info-block">
                            <h3>{name || 'Guest Gourmet'}</h3>
                            <span className="profile-badge">👑 NaanStop Foodie</span>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="profile-close-btn"
                        onClick={() => setProfileModalOpen(false)}
                        aria-label="Close profile"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="profile-body">
                    {/* User Details Section */}
                    <div className="profile-card-section">
                        <div className="section-title-row">
                            <h4>Personal Details</h4>
                            <button
                                type="button"
                                className="edit-toggle-btn"
                                onClick={() => setIsEditing(!isEditing)}
                            >
                                {isEditing ? 'Cancel' : 'Edit'}
                            </button>
                        </div>

                        {isEditing ? (
                            <form onSubmit={handleSaveProfile} className="profile-edit-form">
                                <div className="profile-input-group">
                                    <label>Full Name</label>
                                    <div className="input-with-icon">
                                        <User size={16} />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="profile-input-group">
                                    <label>Phone Number</label>
                                    <div className="input-with-icon">
                                        <Phone size={16} />
                                        <input
                                            type="text"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="profile-input-group">
                                    <label>Email Address</label>
                                    <div className="input-with-icon">
                                        <Mail size={16} />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="save-profile-btn">
                                    <Save size={16} />
                                    <span>Save Profile</span>
                                </button>
                            </form>
                        ) : (
                            <div className="profile-details-display">
                                <div className="detail-row">
                                    <User size={15} className="detail-icon" />
                                    <span>{name || 'Not set'}</span>
                                </div>
                                <div className="detail-row">
                                    <Phone size={15} className="detail-icon" />
                                    <span>{phone || 'Not set'}</span>
                                </div>
                                <div className="detail-row">
                                    <Mail size={15} className="detail-icon" />
                                    <span>{email || 'Not set'}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Saved Addresses Section */}
                    <div className="profile-card-section">
                        <div className="section-title-row">
                            <h4>Saved Delivery Addresses</h4>
                            <button
                                type="button"
                                className="add-addr-toggle-btn"
                                onClick={() => setShowAddAddress(!showAddAddress)}
                            >
                                <Plus size={14} />
                                <span>Add New</span>
                            </button>
                        </div>

                        {showAddAddress && (
                            <form onSubmit={handleAddAddress} className="add-address-form animate-fade">
                                <div className="address-label-selector">
                                    {['Home', 'Work', 'Other'].map(lbl => (
                                        <button
                                            key={lbl}
                                            type="button"
                                            className={`label-pill ${newAddrLabel === lbl ? 'active' : ''}`}
                                            onClick={() => setNewAddrLabel(lbl)}
                                        >
                                            {lbl}
                                        </button>
                                    ))}
                                </div>
                                <input
                                    type="text"
                                    placeholder="Street Address, Apt / Suite / Floor"
                                    value={newAddrStreet}
                                    onChange={(e) => setNewAddrStreet(e.target.value)}
                                    className="addr-text-input"
                                    required
                                />
                                <div className="addr-row-inputs">
                                    <input
                                        type="text"
                                        placeholder="City"
                                        value={newAddrCity}
                                        onChange={(e) => setNewAddrCity(e.target.value)}
                                        className="addr-text-input half"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Contact Phone"
                                        value={newAddrPhone}
                                        onChange={(e) => setNewAddrPhone(e.target.value)}
                                        className="addr-text-input half"
                                    />
                                </div>
                                <div className="addr-form-actions">
                                    <button type="submit" className="save-addr-btn">Save Address</button>
                                    <button type="button" onClick={() => setShowAddAddress(false)} className="cancel-addr-btn">Cancel</button>
                                </div>
                            </form>
                        )}

                        <div className="addresses-list">
                            {savedAddresses.map((addr) => (
                                <div key={addr.id} className="address-card">
                                    <div className="addr-card-left">
                                        <MapPin size={18} className="addr-pin-icon" />
                                        <div className="addr-details">
                                            <div className="addr-tag-title">
                                                <strong>{addr.label}</strong>
                                                {addr.isDefault && <span className="default-pill">Default</span>}
                                            </div>
                                            <p className="addr-line">{addr.street}, {addr.city}</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => deleteAddress(addr.id)}
                                        className="delete-addr-btn"
                                        title="Delete address"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Preferences & Shortcuts */}
                    <div className="profile-card-section">
                        <h4>Preferences & Favorites</h4>
                        <div className="pref-row">
                            <div className="pref-label-group">
                                <strong>🟢 Pure Veg Mode by Default</strong>
                                <span>Always filter non-vegetarian delicacies</span>
                            </div>
                            <button
                                type="button"
                                className={`pref-toggle-btn ${pureVegOnly ? 'active' : ''}`}
                                onClick={() => setPureVegOnly(!pureVegOnly)}
                            >
                                <span className="toggle-thumb"></span>
                            </button>
                        </div>
                        <div className="favorites-counter-row">
                            <div className="fav-count-left">
                                <Heart size={16} className="fav-heart-icon" />
                                <span>Saved Favorites</span>
                            </div>
                            <span className="fav-badge">{favorites.length} dishes</span>
                        </div>
                    </div>

                    {/* Support & Legal (Google Play Compliant) */}
                    <div className="profile-card-section">
                        <h4>Support & Compliance</h4>
                        <button
                            type="button"
                            className="menu-link-btn"
                            onClick={() => {
                                setProfileModalOpen(false);
                                setHelpModalOpen(true);
                            }}
                        >
                            <HelpCircle size={18} />
                            <span>Help & Customer Support</span>
                        </button>
                        <button
                            type="button"
                            className="menu-link-btn"
                            onClick={() => {
                                setProfileModalOpen(false);
                                setLegalModalOpen('privacy');
                            }}
                        >
                            <Shield size={18} />
                            <span>Privacy Policy (Google Play Certified)</span>
                        </button>
                        <button
                            type="button"
                            className="menu-link-btn"
                            onClick={() => {
                                setProfileModalOpen(false);
                                setLegalModalOpen('terms');
                            }}
                        >
                            <FileText size={18} />
                            <span>Terms of Service & Refund Policy</span>
                        </button>
                    </div>

                    {/* Google Play Mandatory Requirement: Account & Data Deletion */}
                    <div className="profile-card-section danger-zone">
                        <h4>Data & Account Management</h4>
                        <p className="danger-desc">
                            In compliance with Google Play Store User Data policies, you can permanently delete your account, addresses, and saved order history at any time.
                        </p>
                        {confirmDeleteOpen ? (
                            <div className="confirm-delete-box animate-fade">
                                <AlertTriangle size={24} className="warn-icon" />
                                <p><strong>Are you absolutely sure?</strong> All saved addresses, favorites, and placed order records will be permanently erased.</p>
                                <div className="confirm-btn-row">
                                    <button
                                        type="button"
                                        className="confirm-erase-btn"
                                        onClick={handleExecuteDeleteAccount}
                                    >
                                        Yes, Clear All My Data
                                    </button>
                                    <button
                                        type="button"
                                        className="cancel-erase-btn"
                                        onClick={() => setConfirmDeleteOpen(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                type="button"
                                className="delete-account-btn"
                                onClick={() => setConfirmDeleteOpen(true)}
                            >
                                <Trash2 size={16} />
                                <span>Delete Account & Erase All Data</span>
                            </button>
                        )}
                    </div>
                </div>

                <div className="profile-footer">
                    <span className="app-version-tag">NaanStop App v1.0.0 (Build 100) • Google Play Store Release</span>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;
