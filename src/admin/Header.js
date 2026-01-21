import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaUser } from "react-icons/fa";
import { apiFetch } from "../api_call"; // ✅ centralized API helper

export default function Header({ menuOpen, setMenuOpen }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // ---------------- LOGOUT ----------------
  const handleLogout = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      // Use centralized apiFetch for consistency
      await apiFetch("/login/logout", "POST", {
        email: user?.usrlst_email,
        department_id: user?.usrlst_department_id,
      });
    } catch (error) {
      console.error("Logout API Error:", error);
    }

    // ✅ Clear frontend session
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");

    // ✅ Redirect to login
    navigate("/login");
  };

  // ---------------- CLOSE DROPDOWN ON OUTSIDE CLICK ----------------
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
        <FaBars
          className="hamburger-icon"
          onClick={() => setMenuOpen(!menuOpen)}
        />

        <div
          className="logo"
          onClick={() => navigate("/dashboard")}
          style={{ cursor: "pointer" }}
        >
          MyComplianceView
        </div>
      </div>

      <div
        className="header-actions"
        style={{ position: "relative" }}
        ref={dropdownRef}
      >
        <button
          className="btn user-primary"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          style={{ display: "flex", alignItems: "center", gap: "4px" }}
        >
          <FaUser className="btnIcon" color="#fff" /> User
        </button>

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
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
