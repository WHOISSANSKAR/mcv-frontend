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

  const [originalName, setOriginalName] = useState(""); // store original BU name
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

  // Load BU name + ID from localStorage
  useEffect(() => {
    const buName = localStorage.getItem("editBusinessUnitName") || "";
    const buId = localStorage.getItem("editBusinessUnitId") || "";

    setFormData({
      businessUnitName: buName,
      businessUnitId: buId,
    });

    setOriginalName(buName); // store original name for comparison
  }, []);

  // Input handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Check if BU name changed and is not empty
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
      const response = await fetch(
        `http://localhost:5000/user/business_unit/edit`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            usrbu_id: formData.businessUnitId,
            business_unit_name: formData.businessUnitName,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErrors({ api: data.error || "Something went wrong!" });
        return;
      }

      setSuccessMsg("✅ Business Unit updated successfully!");
      setOriginalName(formData.businessUnitName); // reset original name
      setTimeout(() => navigate("/BusinessUnit"), 1500);
    } catch (err) {
      setErrors({ api: "Network error. Please try again." });
      console.error(err);
    }
  };

  // Delete BU
  const handleDelete = async () => {
    if (!formData.businessUnitId) return;
    if (!window.confirm("Are you sure you want to delete this Business Unit?"))
      return;

    try {
      const response = await fetch(
        `http://localhost:5000/user/business_unit/delete/${formData.businessUnitId}`,
        { method: "DELETE" }
      );
      const data = await response.json();

      if (!response.ok) {
        setErrors({ api: data.error || "Could not delete Business Unit." });
        return;
      }

      setSuccessMsg("✅ Business Unit deleted successfully!");
      setTimeout(() => navigate("/BusinessUnit"), 1500);
    } catch (err) {
      setErrors({ api: "Network error. Please try again." });
      console.error(err);
    }
  };

  // Backup BU
  const handleBackup = () => {
    if (!formData.businessUnitName) return;
    alert(`✅ Backup taken for: ${formData.businessUnitName}`);
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

        <div
          className="messages-top"
          style={{ margin: "0 auto 1rem auto", width: "50%" }}
        >
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
            <button
              type="submit"
              className="submit-btn"
              disabled={!isChanged} // disabled until change made
            >
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

         
        </form>
      </div>
    </div>
  );
}
