import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaUser } from "react-icons/fa";

export default function UserHeader({ menuOpen, setMenuOpen }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const dropdownRef = useRef(null);

  // ✅ Check if logged-in user is admin
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        if (userData.usrlst_role?.toLowerCase() === "admin") {
          setIsAdmin(true);
        }
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    }
  }, []);

  // ✅ Close dropdown when clicking outside
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
          onClick={() => navigate("/user_dashboard")}
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
              minWidth: "140px",
            }}
          >

            {/* ✅ Admin Button */}
            {isAdmin && (
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
                onClick={() => navigate("/dashboard")}
              >
                Admin
              </button>
            )}

            {/* ✅ Updated Logout Logic */}
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
              onClick={async () => {
                // ✅ NEW: Backend logout API
                try {
                  await fetch("http://localhost:5000/login/logout", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                      "Content-Type": "application/json",
                    },
                  });
                } catch (err) {
                  console.error("Logout API Error:", err);
                }

                // ✅ OLD LOGIC (same as before)
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("user");
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
