// edit-dept.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function EditDept() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [formData, setFormData] = useState({
    departmentName: "",
    departmentId: "",
  });

  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user.usrlst_id;

  // ✅ Admin Auth
  useEffect(() => {
    if (!userId || user?.usrlst_role?.toLowerCase() !== "admin") {
      alert("Access denied.");
      navigate("/", { replace: true });
    }
  }, [navigate, userId, user]);

  // ✅ Load saved Department info
  useEffect(() => {
    setFormData({
      departmentName: localStorage.getItem("editDeptName") || "",
      departmentId: localStorage.getItem("editDeptId") || "",
    });
  }, []);

  // ✅ Handle Input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Save Changes
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Department:", formData);

    setSuccessMsg("✅ Department updated successfully!");

    setTimeout(() => navigate("/department"), 1200);
  };

  // ✅ Delete Department
  const handleDelete = () => {
    console.log("Department deleted:", formData.departmentName);
    navigate("/department");
  };

  // ✅ Backup
  const handleBackup = () => {
    console.log("Backup taken for:", formData.departmentName);
    alert("✅ Backup taken!");
  };

  return (
    <div className="edit-bu">
      <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className="form-container">
        <h2>Edit Department</h2>

        <form onSubmit={handleSubmit} className="add-user-form">

          <label>
            Department Name
            <input
              type="text"
              name="departmentName"
              value={formData.departmentName}
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
              Delete Department
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
