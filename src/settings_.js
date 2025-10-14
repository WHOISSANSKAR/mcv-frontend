import React, { useState, useEffect } from "react";
import UserSidebar from "./UserSidebar";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function Settings() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    company: "",
    domain: "",
    email: "",
    department: "",
    user: "",
    newPassword: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Settings saved:", formData);
    // Add API call or logic here
  };
useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!isLoggedIn || user.usrlst_role?.toLowerCase() !== "admin") {
      navigate("/", { replace: true }); // redirect non-admins to login/home
    }
  }, [navigate]);
  return (
    <div className="settings_">
      {/* Header at top, full width */}
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* Sidebar can be fixed or overlay */}
      <UserSidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* Form fullscreen below header */}
      <div className="settings-fullscreen">
        <h2>Settings</h2>

        <form className="settings-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label>
              Company
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                required
              />
            </label>

            <label>
              Domain
              <input
                type="text"
                name="domain"
                value={formData.domain}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>

          <div className="form-row">
            <label>
              Email
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </label>

            <label>
              Department
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
              />
            </label>
          </div>

          <div className="form-row">
            <label>
              Select User
              <input
                type="text"
                name="user"
                value={formData.user}
                onChange={handleInputChange}
                placeholder="Select User"
              />
            </label>

            <label>
              New Password
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
              />
            </label>
          </div>

          <div className="form-row">
            <label>
              Confirm Password
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            </label>
          </div>

          <button type="submit" className="submit-btn">
            Confirm Password
          </button>
        </form>
      </div>
    </div>
  );
}
