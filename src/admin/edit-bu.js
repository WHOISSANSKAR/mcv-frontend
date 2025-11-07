// edit-bu.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function EditBu() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [formData, setFormData] = useState({
    businessUnitName: "",
    businessUnitId: "",
  });

  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user.usrlst_id;

  // ✅ Admin authentication
  useEffect(() => {
    if (!userId || user?.usrlst_role?.toLowerCase() !== "admin") {
      alert("Access denied. Only admins can edit business units.");
      navigate("/", { replace: true });
    }
  }, [navigate, userId, user]);

  // ✅ Load BU name + ID stored from the BusinessUnit page
  useEffect(() => {
    const buName = localStorage.getItem("editBusinessUnitName") || "";
    const buId = localStorage.getItem("editBusinessUnitId") || "";

    setFormData({
      businessUnitName: buName,
      businessUnitId: buId,
    });
  }, []);

  // ✅ Input handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Save Changes
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Updated Business Unit:", formData);

    setSuccessMsg("✅ Business Unit updated successfully!");

    setTimeout(() => navigate("/BusinessUnit"), 1200);
  };

  // ✅ Delete BU
  const handleDelete = () => {
    console.log("Business Unit deleted:", formData.businessUnitName);
    navigate("/BusinessUnit");
  };

  // ✅ Backup BU
  const handleBackup = () => {
    console.log("Backup taken for:", formData.businessUnitName);
    alert("✅ Backup taken!");
  };

  return (
    <div className="edit-bu">
      <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className="form-container">
        <h2>Edit Business Unit</h2>

        <form onSubmit={handleSubmit} className="add-user-form">

          <label>
            Business Unit Name
            <input
              type="text"
              name="businessUnitName"
              value={formData.businessUnitName}
              onChange={handleInputChange}
            />
          </label>

          {errors.api && <div className="login-error">{errors.api}</div>}
          {successMsg && <div className="success-msg">{successMsg}</div>}

          <div className="action-buttons">
            <button type="submit" className="submit-btn">
              Save Changes
            </button>
            <button
              type="button"
              className="submit-btn delete-btn"
              onClick={handleDelete}
            >
              Delete Unit
            </button>
          </div>

          <div className="backup-container">
            <button type="button" className="backup-btn" onClick={handleBackup}>
              Take Backup
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
