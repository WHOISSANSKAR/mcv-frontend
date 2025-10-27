import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function AddBU() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [buName, setBuName] = useState(() => {
    const saved = localStorage.getItem("customBU") || "";
    if (saved) localStorage.removeItem("customBU");
    return saved;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user.usrlst_id) {
        setError("User not found. Please login again.");
        setLoading(false);
        return;
      }

      // Only send business_unit_name and user_id; backend fetches user_group_id
      const payload = {
        business_unit_name: buName,
        user_id: user.usrlst_id,
      };

      const response = await fetch("http://localhost:5000/user/business_unit/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to add Business Unit");
      } else {
        console.log("Business Unit added:", data);
        setSuccess("Business Unit added successfully!");
        localStorage.setItem("fromAddBU", "true");
        setTimeout(() => navigate("/add-user"), 1000);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to add Business Unit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Redirect non-admin or not logged-in users
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!isLoggedIn || user.usrlst_role?.toLowerCase() !== "admin") {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="add-bu">
      <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className="form-container">
        <h2>Add Business Unit</h2>
        <form onSubmit={handleSubmit} className="add-user-form">
          <label>
            Business Unit Name
            <input
              type="text"
              value={buName}
              onChange={(e) => setBuName(e.target.value)}
              required
            />
          </label>

          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Saving..." : "Add Business Unit"}
          </button>
        </form>
      </div>
    </div>
  );
}
