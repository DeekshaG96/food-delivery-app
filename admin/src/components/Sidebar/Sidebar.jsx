import React from 'react';
import { NavLink } from 'react-router-dom';
import { PlusCircle, List, PackageCheck, ChefHat, CalendarCheck } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
    return (
        <aside className="admin-sidebar">
            <div className="sidebar-options">
                <NavLink
                    to="/kanban"
                    className={({ isActive }) => `sidebar-option ${isActive ? "active" : ""}`}
                    id="admin-nav-kanban"
                >
                    <ChefHat size={20} />
                    <span>Kitchen Display</span>
                </NavLink>

                <NavLink
                    to="/orders"
                    className={({ isActive }) => `sidebar-option ${isActive ? "active" : ""}`}
                    id="admin-nav-orders"
                >
                    <PackageCheck size={20} />
                    <span>Orders List</span>
                </NavLink>

                <NavLink
                    to="/reservations"
                    className={({ isActive }) => `sidebar-option ${isActive ? "active" : ""}`}
                    id="admin-nav-reservations"
                >
                    <CalendarCheck size={20} />
                    <span>Reservations</span>
                </NavLink>

                <NavLink
                    to="/add"
                    className={({ isActive }) => `sidebar-option ${isActive ? "active" : ""}`}
                    id="admin-nav-add"
                >
                    <PlusCircle size={20} />
                    <span>Add Items</span>
                </NavLink>

                <NavLink
                    to="/list"
                    className={({ isActive }) => `sidebar-option ${isActive ? "active" : ""}`}
                    id="admin-nav-list"
                >
                    <List size={20} />
                    <span>List Items</span>
                </NavLink>
            </div>
        </aside>
    );
};

export default Sidebar;
