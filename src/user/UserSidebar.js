// Sidebar.jsx
import React, { useRef, useEffect } from "react";
import "./Dashboard.css";

export default function UserSidebar({ menuOpen, setMenuOpen }) {
  const menuRef = useRef(null);

  // Close sidebar if clicked outside
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
      {menuOpen && (
        <div className="close-icon" onClick={() => setMenuOpen(false)}>
          ×
        </div>
      )}
      <div className="menu-header">MyComplianceView</div>
      <ul>
        <li className="nav-item">
          <span onClick={() => (window.location.href = "/user_dashboard")}>
            Dashboard
          </span>
        </li>

        {/* Compliance Dropdown */}
        <li className="nav-item has-dropdown">
          <span>Compliance</span>
          <ul className="dropdown-content">
            <li className="sub-dropdown">
              <span>Add</span>
              <ul className="sub-dropdown-content">
                <li onClick={() => (window.location.href = "/add-statutory")}>Statutory</li>
                <li onClick={() => (window.location.href = "/add-self")}>Self</li>
                <li onClick={() => (window.location.href = "/add-dc")}>DC Sustainability</li>
                <li onClick={() => (window.location.href = "/add-geo")}>Geo-Spatial</li>
                <li onClick={() => (window.location.href = "/add-dpdp")}>DPDP Act</li>
                <li onClick={() => (window.location.href = "/add-cyber")}>Cyber Resilience</li>
                <li onClick={() => (window.location.href = "/add-notices")}>Notices</li>
              </ul>
            </li>
            <li className="sub-dropdown">
              <span>Manage</span>
              <ul className="sub-dropdown-content">
                <li onClick={() => (window.location.href = "/manage-statutory")}>Statutory</li>
                <li onClick={() => (window.location.href = "/manage-self")}>Self</li>
                <li onClick={() => (window.location.href = "/manage-dc")}>DC Sustainability</li>
                <li onClick={() => (window.location.href = "/manage-geo")}>Geo-Spatial</li>
                <li onClick={() => (window.location.href = "/manage-dpdp")}>DPDP Act</li>
                <li onClick={() => (window.location.href = "/manage-cyber")}>Cyber Resilience</li>
                <li onClick={() => (window.location.href = "/manage-notices")}>Notices</li>
              </ul>
            </li>
          </ul>
        </li>

        {/* Reports Dropdown */}
        <li className="nav-item has-dropdown">
          <span>Reports</span>
          <ul className="dropdown-content">
            <li onClick={() => (window.location.href = "/general_")}>General Report</li>
            <li onClick={() => (window.location.href = "/report_")}>Report</li>
          </ul>
        </li>

        {/* Assessments Dropdown */}
        <li className="nav-item has-dropdown">
          <span>Assessments</span>
          <ul className="dropdown-content">
            <li className="sub-dropdown">
              <span>DPDPA</span>
              <ul className="sub-dropdown-content">
                <li onClick={() => (window.location.href = "/DPDPA-start")}>Start</li>
                <li onClick={() => (window.location.href = "/DPDPA-view")}>View</li>
              </ul>
            </li>
            <li className="sub-dropdown">
              <span>DPDP Act</span>
              <ul className="sub-dropdown-content">
                <li onClick={() => (window.location.href = "/DPDP-start")}>Start</li>
                <li onClick={() => (window.location.href = "/DPDP-view")}>View</li>
              </ul>
            </li>
          </ul>
        </li>

        {/* General Dropdown */}
        <li className="nav-item has-dropdown">
          <span>General</span>
          <ul className="dropdown-content">
            <li onClick={() => (window.location.href = "/outofoffice")}>Out of Office</li>
            <li onClick={() => (window.location.href = "/tns")}>Terms & Services</li>
            <li onClick={() => (window.location.href = "/settings_")}>Settings</li>
          </ul>
        </li>
      </ul>
    </div>
  );
}
