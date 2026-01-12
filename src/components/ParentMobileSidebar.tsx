import React from "react";
import "./Sidebar.css";
import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiBarChart2,
  FiCalendar,
  FiBell,
  FiUser,
} from "react-icons/fi";

interface ParentMobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const ParentMobileSidebar: React.FC<ParentMobileSidebarProps> = ({
  isOpen,
  onClose,
}) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
          style={{ display: "block" }}
        />
      )}
      <div
        className={`sidebar enhanced-sidebar mobile${isOpen ? " open" : ""}`}
      >
        <button
          className="sidebar-close-btn"
          onClick={onClose}
          aria-label="Close Sidebar"
        >
          &times;
        </button>
        <div className="sidebar-header">
          <img src="/logo.png" alt="Serene Minds Logo" className="sidebar-logo" />
        </div>

        <ul className="sidebar-list">
          <li className={isActive("/parent/dashboard") ? "active" : ""} onClick={onClose}>
            <FiHome className="icon" />
            <Link to="/parent/dashboard">Dashboard</Link>
          </li>
          <li className={isActive("/parent/children") || location.pathname.startsWith("/parent/children/") ? "active" : ""} onClick={onClose}>
            <FiUsers className="icon" />
            <Link to="/parent/children">My Children</Link>
          </li>
          <li className={isActive("/parent/reports") ? "active" : ""} onClick={onClose}>
            <FiBarChart2 className="icon" />
            <Link to="/parent/reports">Reports & Analytics</Link>
          </li>
          <li className={isActive("/parent/calendar") ? "active" : ""} onClick={onClose}>
            <FiCalendar className="icon" />
            <Link to="/parent/calendar">Calendar & Events</Link>
          </li>
          <li className={isActive("/parent/notifications") ? "active" : ""} onClick={onClose}>
            <FiBell className="icon" />
            <Link to="/parent/notifications">
              Notifications
              <span className="new-badge">3</span>
            </Link>
          </li>
          <li className={isActive("/parent/profile") ? "active" : ""} onClick={onClose}>
            <FiUser className="icon" />
            <Link to="/parent/profile">My Profile</Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default ParentMobileSidebar;

