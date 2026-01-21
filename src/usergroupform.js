import React, { useState, useEffect } from "react";
import Sidebar from "./admin/Sidebar";
import { useNavigate } from "react-router-dom";
import "./admin/Dashboard.css";
import { apiFetch } from "./api_call"; // ✅ use apiFetch

export default function CompanyForm() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [formData, setFormData] = useState({
    company_name: "",
    cin: "",
    subscribers: 0,
    subscribersInput: "0",
    end_of_subscription: ""
  });

  const [file, setFile] = useState(null); // UI only
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

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

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMsg("");

    if (!formData.company_name || !formData.cin) {
      setErrors({ api: "Company Name and CIN are required" });
      return;
    }

    const payload = {
      company_name: formData.company_name,
      cin: formData.cin,
      subscribers: formData.subscribers || 2, // default 2 if empty
      govt_document: "NA", // file ignored for now
      end_of_subscription: formData.end_of_subscription || null
    };

    try {
      // ✅ replaced fetch with apiFetch
      const data = await apiFetch("/form/submit", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setSuccessMsg("✅ Company details submitted successfully!");
      setFormData({
        company_name: "",
        cin: "",
        subscribers: 0,
        subscribersInput: "0",
        end_of_subscription: ""
      });
      setFile(null);

    } catch (err) {
      console.error("Error submitting form:", err);
      setErrors({ api: err.message || "Failed to submit form. Please try again." });
    }
  };

  return (
    <div className="user_group">
      <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className="top-logo-container" style={{ padding: "1rem 2rem" }}>
        <img
          src="/logo_black.png"
          alt="MyComplianceView Logo"
          className="logo-img"
          style={{ height: "60px" }}
        />
      </div>

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
                  setFormData((prev) => ({
                    ...prev,
                    subscribersInput: "0",
                    subscribers: 2,
                  }));
                }
              }}
            />
          </label>

          <label>
            End of Subscription
            <input
              type="date"
              name="end_of_subscription"
              value={formData.end_of_subscription}
              onChange={handleInputChange}
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
