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
  FiTrendingUp,
} from "react-icons/fi";

const ParentSidebar: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="sidebar enhanced-sidebar">
      <div className="sidebar-header">
        <img src="/logo.png" alt="Serene Minds Logo" className="sidebar-logo" />
      </div>

      <ul className="sidebar-list">
        <li className={isActive("/parent/dashboard") ? "active" : ""}>
          <FiHome className="icon" />
          <Link to="/parent/dashboard">Dashboard</Link>
        </li>
        <li className={isActive("/parent/children") || location.pathname.startsWith("/parent/children/") ? "active" : ""}>
          <FiUsers className="icon" />
          <Link to="/parent/children">My Children</Link>
        </li>
        <li className={isActive("/parent/reports") ? "active" : ""}>
          <FiBarChart2 className="icon" />
          <Link to="/parent/reports">Reports & Analytics</Link>
        </li>
        <li className={isActive("/parent/calendar") ? "active" : ""}>
          <FiCalendar className="icon" />
          <Link to="/parent/calendar">Calendar & Events</Link>
        </li>
        <li className={isActive("/parent/notifications") ? "active" : ""}>
          <FiBell className="icon" />
          <Link to="/parent/notifications">
            Notifications
            <span className="new-badge">3</span>
          </Link>
        </li>
        <li className={isActive("/parent/profile") ? "active" : ""}>
          <FiUser className="icon" />
          <Link to="/parent/profile">My Profile</Link>
        </li>
      </ul>
    </div>
  );
};

export default ParentSidebar;

