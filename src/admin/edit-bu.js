import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { apiFetch } from "../api_call";

export default function EditBu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ businessUnitName: "", businessUnitId: "" });
  const [originalName, setOriginalName] = useState("");
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [errorVisible, setErrorVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user.usrlst_id;

  // Admin authentication
  useEffect(() => {
    if (!userId || user?.usrlst_role?.toLowerCase() !== "admin") {
      alert("Access denied. Only admins can edit business units.");
      navigate("/", { replace: true });
    }
  }, [navigate, userId, user]);

  // Load BU from localStorage
  useEffect(() => {
    const buName = localStorage.getItem("editBusinessUnitName") || "";
    const buId = localStorage.getItem("editBusinessUnitId") || "";

    setFormData({ businessUnitName: buName, businessUnitId: buId });
    setOriginalName(buName);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isChanged =
    formData.businessUnitName.trim() !== originalName.trim() &&
    formData.businessUnitName.trim() !== "";

  // Save Changes
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.businessUnitName.trim()) {
      setErrors({ api: "Business Unit name cannot be blank." });
      return;
    }

    try {
      await apiFetch("/user/business_unit/edit", {
        method: "PUT",
        body: JSON.stringify({
          usrbu_id: formData.businessUnitId,
          business_unit_name: formData.businessUnitName,
        }),
      });

      setSuccessMsg("✅ Business Unit updated successfully!");
      setOriginalName(formData.businessUnitName);
      setTimeout(() => navigate("/BusinessUnit"), 1500);
    } catch (err) {
      setErrors({ api: err.message || "Failed to update Business Unit." });
      console.error(err);
    }
  };

  // Delete BU
  const handleDelete = async () => {
    if (!formData.businessUnitId) return;
    if (!window.confirm("Are you sure you want to delete this Business Unit?")) return;

    try {
      await apiFetch(`/user/business_unit/delete/${formData.businessUnitId}`, {
        method: "DELETE",
      });

      setSuccessMsg("✅ Business Unit deleted successfully!");
      setTimeout(() => navigate("/BusinessUnit"), 1500);
    } catch (err) {
      setErrors({ api: err.message || "Failed to delete Business Unit." });
      console.error(err);
    }
  };

  // Auto-hide error
  useEffect(() => {
    if (errors.api) {
      setErrorVisible(true);
      const timer = setTimeout(() => setErrorVisible(false), 4500);
      const clearTimer = setTimeout(() => setErrors({}), 5000);
      return () => {
        clearTimeout(timer);
        clearTimeout(clearTimer);
      };
    }
  }, [errors.api]);

  // Auto-hide success
  useEffect(() => {
    if (successMsg) {
      setSuccessVisible(true);
      const timer = setTimeout(() => setSuccessVisible(false), 4500);
      const clearTimer = setTimeout(() => setSuccessMsg(""), 5000);
      return () => {
        clearTimeout(timer);
        clearTimeout(clearTimer);
      };
    }
  }, [successMsg]);

  return (
    <div className="edit-bu">
      <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className="form-container">
        <h2>Edit Business Unit</h2>

        <div className="messages-top" style={{ margin: "0 auto 1rem auto", width: "50%" }}>
          {errors.api && <div className={`login-error ${!errorVisible ? "fade-out" : ""}`}>{errors.api}</div>}
          {successMsg && <div className={`success-msg ${!successVisible ? "fade-out" : ""}`}>{successMsg}</div>}
        </div>

        <form onSubmit={handleSubmit} className="add-user-form">
          <label>
            Business Unit Name
            <input
              type="text"
              name="businessUnitName"
              value={formData.businessUnitName}
              onChange={handleInputChange}
              autoComplete="off"
            />
          </label>

          <div className="action-buttons">
            <button type="submit" className="submit-btn" disabled={!isChanged}>
              Save Changes
            </button>
            <button type="button" className="submit-btn delete-btn" onClick={handleDelete}>
              Delete Unit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
