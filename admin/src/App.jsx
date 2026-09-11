import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import Add from './pages/Add/Add';
import List from './pages/List/List';
import Orders from './pages/Orders/Orders';
import Kanban from './pages/Kanban/Kanban';
import Reservations from './pages/Reservations/Reservations';

const App = () => {
    const url = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

    return (
        <div>
            <Navbar />
            <div className="admin-app-layout">
                <Sidebar />
                <div className="admin-content-area">
                    <Routes>
                        <Route path="/" element={<Navigate to="/kanban" replace />} />
                        <Route path="/kanban" element={<Kanban url={url} />} />
                        <Route path="/orders" element={<Orders url={url} />} />
                        <Route path="/reservations" element={<Reservations url={url} />} />
                        <Route path="/add" element={<Add url={url} />} />
                        <Route path="/list" element={<List url={url} />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default App;
