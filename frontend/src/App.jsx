import React, { useState, useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import LoginPopup from './components/LoginPopup/LoginPopup';
import BottomNav from './components/BottomNav/BottomNav';
import Toast from './components/Toast/Toast';
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import Verify from './pages/Verify/Verify';
import MyOrders from './pages/MyOrders/MyOrders';
import Reservations from './pages/Reservations/Reservations';
import { StoreContext } from './context/StoreContext';

import MusicPlayer from './components/MusicPlayer/MusicPlayer';
import SpinWheelModal from './components/SpinWheel/SpinWheelModal';

const App = () => {
    const [showLogin, setShowLogin] = useState(false);
    const { toast, closeToast, spinModalOpen, setSpinModalOpen, setAppliedCoupon, showToast } = useContext(StoreContext);

    return (
        <>
            {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
            <Navbar setShowLogin={setShowLogin} />
            <div className="app">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/order" element={<PlaceOrder setShowLogin={setShowLogin} />} />
                    <Route path="/verify" element={<Verify />} />
                    <Route path="/myorders" element={<MyOrders />} />
                    <Route path="/reservations" element={<Reservations />} />
                </Routes>
                <Footer />
            </div>
            <BottomNav setShowLogin={setShowLogin} />
            <MusicPlayer />
            <SpinWheelModal 
                isOpen={spinModalOpen} 
                onClose={() => setSpinModalOpen(false)} 
                onApplyCoupon={(code) => {
                    setAppliedCoupon(code);
                    showToast(`Coupon ${code} applied successfully! 🌶️🎉`, 'success');
                }}
            />
            {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
        </>
    );
};

export default App;
