import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function RestoreUser() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    contact: "",
    businessUnit: "",
    department: "",
    escalationEmail: "",
    file: null,
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.file) {
      alert("Please upload a file.");
      return;
    }
    alert("File submitted successfully.");
  };

  return (
    <div className="restore-user-page">
      <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className="form-container">
        <h2>Restore User</h2>

        <form onSubmit={handleSubmit} className="add-user-form">
          <label>
            User Name
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Contact Number
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Business Unit
            <input
              type="text"
              name="businessUnit"
              value={formData.businessUnit}
              onChange={handleInputChange}
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

          <label>
            Escalation Email
            <input
              type="email"
              name="escalationEmail"
              value={formData.escalationEmail}
              onChange={handleInputChange}
            />
          </label>

          {/* Custom File Upload */}
          <div className="file-submit-row">
            <div className="file-wrapper">
              <label className="file-label">Upload File</label>
              <label className="file-upload-label">
                <input
                  type="file"
                  onChange={handleFileChange}
                  required
                />
                <span className="custom-file-btn">
                  {formData.file ? formData.file.name : "Choose File"}
                </span>
              </label>
            </div>
          </div>

          <button type="submit" className="submit-btn">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
