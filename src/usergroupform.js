import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function CompanyForm() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    company_name: "",
    cin: "",
    subscribers: 0,         // for backend submission
    subscribersInput: "0",  // for input display
  });
  const [file, setFile] = useState(null); // Govt Document file
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  const navigate = useNavigate();

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "subscribers") {
      setFormData((prev) => ({
        ...prev,
        subscribersInput: value,
        subscribers: value === "" ? null : Number(value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    setErrors({});
    setSuccessMsg("");
  };

  // Auto-remove success message after 5 seconds
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMsg("");

    if (!formData.company_name || !formData.cin || !file) {
      setErrors({ api: "Company Name, CIN, and Govt Document file are required" });
      return;
    }

    const payload = new FormData();
    payload.append("company_name", formData.company_name);
    payload.append("cin", formData.cin);
    payload.append("govt_document", file);
    if (formData.subscribers !== null) payload.append("subscribers", formData.subscribers);

    try {
      const response = await fetch("http://localhost:5000/form/submit", {
        method: "POST",
        body: payload,
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ api: data.error || "Failed to submit form" });
      } else {
        setSuccessMsg("✅ Company details submitted successfully!");
        setFormData({ company_name: "", cin: "", subscribers: 0, subscribersInput: "0" });
        setFile(null);
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setErrors({ api: "Failed to submit form. Please try again." });
    }
  };

  return (
    <div className="user_group">
      <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <div className="form-container">
        <h2>Company Registration</h2>

        <div
          className="messages-top"
          style={{ margin: "0 auto 1rem auto", width: "50%" }}
        >
          {errors.api && <div className="login-error">{errors.api}</div>}
          {successMsg && <div className="success-msg">{successMsg}</div>}
        </div>

        <form onSubmit={handleSubmit} className="add-user-form">
          <label>
            Company Name
            <input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleInputChange}
            />
          </label>

          <label>
            CIN
            <input
              type="text"
              name="cin"
              value={formData.cin}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Subscribers
            <input
              type="number"
              name="subscribers"
              min={0}
              value={formData.subscribersInput}
              onChange={handleInputChange}
              onFocus={() => {
                if (formData.subscribersInput === "0") {
                  setFormData((prev) => ({ ...prev, subscribersInput: "" }));
                }
              }}
              onBlur={() => {
                if (formData.subscribersInput === "") {
                  setFormData((prev) => ({ ...prev, subscribersInput: "0", subscribers: 0 }));
                }
              }}
            />
          </label>

          <div className="file-wrapper">
            <label className="file-label">Govt Document</label>
            <label className="file-upload-label">
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <span className="custom-file-btn">
                {file ? file.name : "Choose File"}
              </span>
            </label>
          </div>

          <button type="submit" className="submit-btn">Submit</button>
        </form>
      </div>
    </div>
  );
}
