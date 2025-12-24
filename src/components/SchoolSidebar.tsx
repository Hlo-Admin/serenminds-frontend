import React from "react";
import "./Sidebar.css";
import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiBook,
  FiUserCheck,
  FiCalendar,
  FiBell,
  FiFileText,
  FiTrendingUp,
} from "react-icons/fi";

const SchoolSidebar: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="sidebar enhanced-sidebar">
      <div className="sidebar-header">
        <img src="/logo.png" alt="Serene Minds Logo" className="sidebar-logo" />
      </div>

      <ul className="sidebar-list">
        <li className={isActive("/school/dashboard") ? "active" : ""}>
          <FiHome className="icon" />
          <Link to="/school/dashboard">Dashboard</Link>
        </li>
        <li className={isActive("/school/overview") ? "active" : ""}>
          <FiTrendingUp className="icon" />
          <Link to="/school/overview">Overview</Link>
        </li>
        <li className={isActive("/school/students") ? "active" : ""}>
          <FiUsers className="icon" />
          <Link to="/school/students">All Students</Link>
        </li>
        <li className={isActive("/school/academics/classes") ? "active" : ""}>
          <FiBook className="icon" />
          <Link to="/school/academics/classes">Classes</Link>
        </li>
        <li className={isActive("/school/academics/divisions") ? "active" : ""}>
          <FiBook className="icon" />
          <Link to="/school/academics/divisions">Divisions</Link>
        </li>
        <li className={isActive("/school/academics/academic-year") ? "active" : ""}>
          <FiBook className="icon" />
          <Link to="/school/academics/academic-year">Academic Year</Link>
        </li>
        <li className={isActive("/school/teachers") ? "active" : ""}>
          <FiUserCheck className="icon" />
          <Link to="/school/teachers">Teachers & Staff</Link>
        </li>
        <li className={isActive("/school/calendar") ? "active" : ""}>
          <FiCalendar className="icon" />
          <Link to="/school/calendar">Calendar & Events</Link>
        </li>
        <li className={isActive("/school/notifications") ? "active" : ""}>
          <FiBell className="icon" />
          <Link to="/school/notifications">
            Notifications
            <span className="new-badge">3</span>
          </Link>
        </li>
        <li className={isActive("/school/documents") ? "active" : ""}>
          <FiFileText className="icon" />
          <Link to="/school/documents">Documents</Link>
        </li>
      </ul>
    </div>
  );
};

export default SchoolSidebar;
