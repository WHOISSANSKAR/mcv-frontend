// NotFound.jsx
import React, { useState } from "react";
import UserSidebar from "./UserSidebar";
import UserHeader from "./UserHeader";
import "./Dashboard.css";

export default function NotFound() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    act: "",
    complianceName: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setSuccessMsg("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.act) newErrors.act = "Act is required";
    if (!formData.complianceName) newErrors.complianceName = "Compliance Name is required";
    if (!formData.description) newErrors.description = "Description is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // TODO: replace with API submission
    console.log("Form submitted:", formData);
    setSuccessMsg("✅ Compliance created successfully!");
    setFormData({ act: "", complianceName: "", description: "" });
  };

  return (
    <div className="not-found-page">
      <UserSidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <UserHeader menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <main style={{ flex: 1, padding: "1rem 2rem", overflowY: "auto" }}>
          <h2>Add Compliance</h2>
          <form className="add-user-form" onSubmit={handleSubmit}>
            <label>
              Act
              <input
                type="text"
                name="act"
                value={formData.act}
                onChange={handleInputChange}
              />
              {errors.act && <span className="error">{errors.act}</span>}
            </label>

            <label>
              Compliance Name
              <input
                type="text"
                name="complianceName"
                value={formData.complianceName}
                onChange={handleInputChange}
              />
              {errors.complianceName && <span className="error">{errors.complianceName}</span>}
            </label>

            <label className="full-width">
              Description
              <textarea
                name="description"
                rows="5"
                value={formData.description}
                onChange={handleInputChange}
              />
              {errors.description && <span className="error">{errors.description}</span>}
            </label>

            {successMsg && <span className="success-msg">{successMsg}</span>}

            <button type="submit" className="submit-btn">
              Create
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
