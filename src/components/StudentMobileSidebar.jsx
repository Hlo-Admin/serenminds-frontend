import React, { useState } from "react";
import "./Sidebar.css";
import { Link, useLocation } from "react-router-dom";
import {
  MdKeyboardArrowDown,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import {
  FiHome,
  FiUser,
  FiHeart,
  FiTrendingUp,
  FiCalendar,
  FiAward,
  FiSend,
  FiUsers,
  FiBell,
} from "react-icons/fi";
import { RiEmotionHappyLine } from "react-icons/ri";

const StudentMobileSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [openMood, setOpenMood] = useState(true);

  const isActive = (path) => location.pathname === path;

  const moodLinks = [
    { name: "Log Mood", path: "/student/log-mood", icon: <FiHeart /> },
    { name: "Mood History", path: "/student/mood-history", icon: <FiTrendingUp /> },
    { name: "Calendar", path: "/student/calendar", icon: <FiCalendar /> },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="sidebar-overlay"
        onClick={onClose}
        style={{ display: "block" }}
      />

      {/* Mobile Sidebar Drawer */}
      <div className={`mobile-sidebar-drawer ${isOpen ? "open" : ""}`}>
        <button
          className="sidebar-close-btn"
          onClick={onClose}
          aria-label="Close Sidebar"
          style={{ display: "block" }}
        >
          &times;
        </button>

        <div className="sidebar-header">
          <img src="/logo.png" alt="Serene Minds Logo" className="sidebar-logo" />
        </div>

        <ul className="sidebar-list">
          <li className={isActive("/student/dashboard") ? "active" : ""} onClick={onClose}>
            <FiHome className="icon" />
            <Link to="/student/dashboard">Dashboard</Link>
          </li>
          <li className={isActive("/student/profile") ? "active" : ""} onClick={onClose}>
            <FiUser className="icon" />
            <Link to="/student/profile">My Profile</Link>
          </li>
        </ul>

        {/* Mood & Emotions Section */}
        <div
          className={`master-toggle${openMood ? " open" : ""}`}
          onClick={() => setOpenMood(!openMood)}
          tabIndex={0}
          role="button"
          aria-expanded={openMood}
        >
          <RiEmotionHappyLine className="icon" />
          <span>Mood & Emotions</span>
          <span className="badge">{moodLinks.length}</span>
          <span className="arrow">
            {openMood ? (
              <MdKeyboardArrowDown />
            ) : (
              <MdOutlineKeyboardArrowRight />
            )}
          </span>
        </div>

        {openMood && (
          <ul className="sub-menu">
            {moodLinks.map((item, i) => (
              <li
                key={i}
                className={isActive(item.path) ? "active" : ""}
                onClick={onClose}
              >
                <span className="icon sub-menu-icon">{item.icon}</span>
                <Link to={item.path}>{item.name}</Link>
              </li>
            ))}
          </ul>
        )}

        {/* Other Menu Items */}
        <ul className="sidebar-list" style={{ marginTop: "16px" }}>
          <li className={isActive("/student/streaks-rewards") ? "active" : ""} onClick={onClose}>
            <FiAward className="icon" />
            <Link to="/student/streaks-rewards">Streaks & Rewards</Link>
          </li>
          <li className={isActive("/student/community") ? "active" : ""} onClick={onClose}>
            <FiUsers className="icon" />
            <Link to="/student/community">Community</Link>
          </li>
          <li className={isActive("/student/referrals") ? "active" : ""} onClick={onClose}>
            <FiSend className="icon" />
            <Link to="/student/referrals">Invite Friends</Link>
          </li>
          <li className={isActive("/student/notifications") ? "active" : ""} onClick={onClose}>
            <FiBell className="icon" />
            <Link to="/student/notifications">
              Notifications
              <span className="new-badge">2</span>
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default StudentMobileSidebar;






