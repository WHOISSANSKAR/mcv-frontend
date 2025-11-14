import React, { useState, useEffect } from "react";
import Sidebar from "./admin/Sidebar";
import { useNavigate } from "react-router-dom";
import "./admin/Dashboard.css";

export default function AddAdminForm() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    company_name: "",
    subscribers: 2,
    subscribersInput: "2",
    department: "",
    business_unit: "",
    escalation_mail: "",
  });

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

    const required = [
      "name",
      "email",
      "contact",
      "company_name",
      "department",
      "business_unit",
    ];

    for (const field of required) {
      if (!formData[field]) {
        setErrors({ api: "All required fields must be filled" });
        return;
      }
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      contact: formData.contact,
      company_name: formData.company_name,
      subscribers: formData.subscribers || 2,
      department: formData.department,
      business_unit: formData.business_unit,
      escalation_mail: formData.escalation_mail || "",
    };

    try {
      const response = await fetch("http://localhost:5000/user/add_admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ api: data.error || "Failed to add admin" });
      } else {
        setSuccessMsg("✅ Admin created successfully!");

        setFormData({
          name: "",
          email: "",
          contact: "",
          company_name: "",
          subscribers: 2,
          subscribersInput: "2",
          department: "",
          business_unit: "",
          escalation_mail: "",
        });
      }
    } catch (err) {
      console.error("Error submitting admin:", err);
      setErrors({ api: "Failed to submit form. Please try again." });
    }
  };

  return (
    <div className="user_group">
      <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* ✅ Replaced Header with Logo */}
      <div className="top-logo-container" style={{ padding: "1rem 2rem" }}>
        <img
          src="/logo_black.png"
          alt="MyComplianceView Logo"
          className="logo-img"
          style={{ height: "60px" }}
        />
      </div>

      <div className="form-container">
        <h2>Add Admin</h2>

        <div className="messages-top" style={{ margin: "0 auto 1rem auto", width: "50%" }}>
          {errors.api && <div className="login-error">{errors.api}</div>}
          {successMsg && <div className="success-msg">{successMsg}</div>}
        </div>

        <form onSubmit={handleSubmit} className="add-user-form">

          <label>
            Name*
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
          </label>

          <label>
            Email*
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
          </label>

          <label>
            Contact*
            <input type="text" name="contact" value={formData.contact} onChange={handleInputChange} />
          </label>

          <label>
            Company Name*
            <input type="text" name="company_name" value={formData.company_name} onChange={handleInputChange} />
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
                if (formData.subscribersInput === "2") {
                  setFormData((prev) => ({ ...prev, subscribersInput: "" }));
                }
              }}
              onBlur={() => {
                if (formData.subscribersInput === "") {
                  setFormData((prev) => ({ ...prev, subscribersInput: "2", subscribers: 2 }));
                }
              }}
            />
          </label>

          <label>
            Department*
            <input type="text" name="department" value={formData.department} onChange={handleInputChange} />
          </label>

          <label>
            Business Unit*
            <input type="text" name="business_unit" value={formData.business_unit} onChange={handleInputChange} />
          </label>

          <label>
            Escalation Email
            <input
              type="email"
              name="escalation_mail"
              value={formData.escalation_mail}
              onChange={handleInputChange}
            />
          </label>

          <button type="submit" className="submit-btn">Submit</button>
        </form>
      </div>
    </div>
  );
}
