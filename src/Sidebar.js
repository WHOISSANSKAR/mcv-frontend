// Sidebar.jsx
import React, { useRef, useEffect } from "react";
import {
  FaTimes, FaChartLine, FaUser,
  FaBuilding, FaFileAlt, FaFolderOpen, FaCog
} from "react-icons/fa";
import "./Dashboard.css";

export default function Sidebar({ menuOpen, setMenuOpen }) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setMenuOpen]);

  return (
    <div ref={menuRef} className={`hamburger-menu ${menuOpen ? "open" : ""}`}>
      {menuOpen && <FaTimes className="close-icon" onClick={() => setMenuOpen(false)} />}
      <div className="menu-header">MyComplianceView</div>
      <ul>
        <li className="nav-item" onClick={() => (window.location.href = "/dashboard")}>
          <FaChartLine className="menu-icon" /> Dashboard
        </li>
        <li className="nav-item" onClick={() => (window.location.href = "/user")}>
          <FaUser className="menu-icon" /> Entities
        </li>
        
        <li className="nav-item" onClick={() => (window.location.href = "/General")}>
          <FaFileAlt className="menu-icon" /> Reports
        </li>
        <li className="nav-item" onClick={() => (window.location.href = "/Restore")}>
          <FaFolderOpen className="menu-icon" /> Restore and Replace
        </li>
        <li className="nav-item" onClick={() => (window.location.href = "/settings")}>
          <FaCog className="menu-icon" /> Settings
        </li>
        <li className="nav-item" onClick={() => (window.location.href = "/accounts")}>
          <FaUser className="menu-icon" /> Accounts
        </li>
      </ul>
    </div>
  );
}
