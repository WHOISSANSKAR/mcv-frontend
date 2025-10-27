import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function AddDepartment() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [departmentName, setDepartmentName] = useState(() => {
    const saved = localStorage.getItem("customDept") || "";
    if (saved) localStorage.removeItem("customDept");
    return saved;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const businessUnitId = localStorage.getItem("selectedBusinessUnitId");

      if (!user.usrlst_id || !businessUnitId) {
        setError("User or Business Unit not found. Please login again.");
        setLoading(false);
        return;
      }

      const payload = {
        business_unit_id: parseInt(businessUnitId),
        user_id: parseInt(user.usrlst_id),
        department_name: departmentName,
      };

      const response = await fetch("http://localhost:5000/user/departments/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      // Handle API failure messages in styled error div
      if (!response.ok) {
        setError(data.error || "Failed to add Department. Please try again.");
      } else if (data && data.status === "error") {
        setError(data.message || "Failed to add Department.");
      } else {
        console.log("Department added:", data);
        setSuccess("Department added successfully!");
        localStorage.setItem("fromAddDept", "true");
        setTimeout(() => navigate("/add-user"), 1000);
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!isLoggedIn || user.usrlst_role?.toLowerCase() !== "admin") {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="add-department">
      <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className="form-container">
        <h2>Add Department</h2>
        <form onSubmit={handleSubmit} className="add-user-form">
          <label>
            Department Name
            <input
              type="text"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              required
            />
          </label>

          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Saving..." : "Add Department"}
          </button>
        </form>
      </div>
    </div>
  );
}
