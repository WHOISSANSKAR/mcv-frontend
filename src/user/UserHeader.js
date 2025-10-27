// Header.js
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaUser } from "react-icons/fa";

export default function UserHeader({ menuOpen, setMenuOpen }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="header">
      <div className="header-left">
        <FaBars className="hamburger-icon" onClick={() => setMenuOpen(!menuOpen)} />

        {/* Clickable logo */}
        <div
          className="logo"
          onClick={() => navigate("/user_dashboard")}
          style={{ cursor: "pointer" }}
        >
          MyComplianceView
        </div>
      </div>

      <div className="header-actions" style={{ position: "relative" }} ref={dropdownRef}>
        {/* User Button */}
        <button
          className="btn user-primary"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          style={{ display: "flex", alignItems: "center", gap: "4px" }}
        >
          <FaUser className="btnIcon" color="#fff" /> User
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div
            style={{
              position: "absolute",
              top: "110%",
              right: 0,
              background: "#fff",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              borderRadius: "6px",
              overflow: "hidden",
              zIndex: 1000,
              minWidth: "120px",
            }}
          >
            <button
              style={{
                display: "block",
                width: "100%",
                padding: "8px 12px",
                border: "none",
                background: "none",
                textAlign: "left",
                cursor: "pointer",
                fontSize: "14px",
              }}
              onClick={() => {
                localStorage.removeItem("isLoggedIn");
                window.location.reload();
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
