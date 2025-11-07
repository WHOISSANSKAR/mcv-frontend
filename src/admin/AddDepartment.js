import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();

  // ✅ Get BU ID: from URL (Edit User) OR from localStorage (Add User)
  const queryParams = new URLSearchParams(location.search);
  const businessUnitId =
    queryParams.get("businessUnitId") || localStorage.getItem("selectedBU") || "";

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

      const payload = {
        department_name: departmentName.trim(),
        business_unit_id: Number(businessUnitId),
        user_id: Number(user.usrlst_id),
      };

      if (!payload.department_name) {
        setError("Department name cannot be blank.");
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:5000/user/departments/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to add department");
      } else {
        setSuccess("Department added successfully!");

        const page = String(localStorage.getItem("page") || "");

        // Flag to refill dropdown when returning
        if (page === "2" || page === "3") {
          localStorage.setItem("fromAddDept", "true");
        }

        setTimeout(() => {
          if (page === "1") navigate("/department");
          else if (page === "2") navigate("/add-user");
          else if (page === "3") navigate("/edit-user");
          else navigate("/dashboard");

          localStorage.removeItem("page");
          localStorage.removeItem("customDept");
        }, 900);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to add department. Please try again.");
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
