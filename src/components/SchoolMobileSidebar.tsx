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

interface SchoolMobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SchoolMobileSidebar: React.FC<SchoolMobileSidebarProps> = ({
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
          <li className={isActive("/school/dashboard") ? "active" : ""} onClick={onClose}>
            <FiHome className="icon" />
            <Link to="/school/dashboard">Dashboard</Link>
          </li>
          <li className={isActive("/school/overview") ? "active" : ""} onClick={onClose}>
            <FiTrendingUp className="icon" />
            <Link to="/school/overview">Overview</Link>
          </li>
          <li className={isActive("/school/students") ? "active" : ""} onClick={onClose}>
            <FiUsers className="icon" />
            <Link to="/school/students">All Students</Link>
          </li>
          <li className={isActive("/school/academics/classes") ? "active" : ""} onClick={onClose}>
            <FiBook className="icon" />
            <Link to="/school/academics/classes">Classes</Link>
          </li>
          <li className={isActive("/school/academics/divisions") ? "active" : ""} onClick={onClose}>
            <FiBook className="icon" />
            <Link to="/school/academics/divisions">Divisions</Link>
          </li>
          <li className={isActive("/school/academics/academic-year") ? "active" : ""} onClick={onClose}>
            <FiBook className="icon" />
            <Link to="/school/academics/academic-year">Academic Year</Link>
          </li>
          <li className={isActive("/school/teachers") ? "active" : ""} onClick={onClose}>
            <FiUserCheck className="icon" />
            <Link to="/school/teachers">Teachers & Staff</Link>
          </li>
          <li className={isActive("/school/calendar") ? "active" : ""} onClick={onClose}>
            <FiCalendar className="icon" />
            <Link to="/school/calendar">Calendar & Events</Link>
          </li>
          <li className={isActive("/school/notifications") ? "active" : ""} onClick={onClose}>
            <FiBell className="icon" />
            <Link to="/school/notifications">
              Notifications
              <span className="new-badge">3</span>
            </Link>
          </li>
          <li className={isActive("/school/documents") ? "active" : ""} onClick={onClose}>
            <FiFileText className="icon" />
            <Link to="/school/documents">Documents</Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default SchoolMobileSidebar;
