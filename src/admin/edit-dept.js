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
  const [errorVisible, setErrorVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);

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

    if (!formData.departmentName.trim()) {
      setErrors({ api: "Department name cannot be blank." });
      return;
    }

    console.log("Updated Department:", formData);
    setSuccessMsg("✅ Department updated successfully!");

    setTimeout(() => navigate("/department"), 1200);
  };

  // ✅ Delete Department
  const handleDelete = () => {
    if (!formData.departmentName) return;
    console.log("Department deleted:", formData.departmentName);
    setSuccessMsg("✅ Department deleted successfully!");
    setTimeout(() => navigate("/department"), 1000);
  };

  // ✅ Backup
  const handleBackup = () => {
    if (!formData.departmentName) return;
    console.log("Backup taken for:", formData.departmentName);
    alert("✅ Backup taken!");
  };

  // ✅ Auto-hide error
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

  // ✅ Auto-hide success
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
    <div className="edit-dept">
      <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className="form-container">
        <h2>Edit Department</h2>

        {/* ✅ Unified top messages */}
        <div className="messages-top" style={{ margin: "0 auto 1rem auto", width: "50%" }}>
          {errors.api && (
            <div className={`login-error ${!errorVisible ? "fade-out" : ""}`}>
              {errors.api}
            </div>
          )}
          {successMsg && (
            <div className={`success-msg ${!successVisible ? "fade-out" : ""}`}>
              {successMsg}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="add-user-form">
          <label>
            Department Name
            <input
              type="text"
              name="departmentName"
              value={formData.departmentName}
              onChange={handleInputChange}
              autoComplete="off"
            />
          </label>

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

         
        </form>
      </div>
    </div>
  );
}
