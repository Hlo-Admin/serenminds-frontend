import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Topbar.css";
import {
  FiSearch,
  FiFilter,
  FiBell,
  FiUser,
  FiLogOut,
} from "react-icons/fi";

const Topbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="topbar">
      <button
        className="topbar-menu-btn"
        onClick={onMenuClick}
        aria-label="Open Sidebar"
      >
        <span className="topbar-menu-icon">&#9776;</span>
      </button>
      <div className="topbar-logo-mobile">
        <img
          src="/logo.png"
          alt="Serene Minds Logo"
          className="topbar-logo-img"
        />
      </div>
      <div className="topbar-search topbar-hide-mobile">
        <FiSearch className="search-icon" />
        <input className="search-input" type="text" placeholder="Search" />
        <button className="filter-btn">
          <FiFilter />
        </button>
      </div>
      <div className="topbar-right">
        <span className="lang topbar-hide-mobile">English</span>
        <span className="notif topbar-hide-mobile">
          <FiBell />
        </span>
        <div className="user-info" onClick={toggleDropdown}>
          <span className="user-avatar">
            <FiUser />
          </span>
          {showDropdown && (
            <div className="user-dropdown">
              <div className="user-dropdown-header">
                <span className="user-name">{user?.name || "User"}</span>
                <span className="user-role">{user?.role || "User"}</span>
              </div>
              <div className="dropdown-item" onClick={handleLogout}>
                <FiLogOut />
                <span>Logout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
