import React, { useState, useEffect } from "react";
import Sidebar from "./admin/Sidebar";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "./api_call"; // ✅ centralized API call
import "./admin/Dashboard.css";

export default function AddAdminForm() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

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
  const [errorVisible, setErrorVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMsg("");

    // ✅ Trim all fields
    const trimmedData = {};
    Object.keys(formData).forEach((key) => {
      trimmedData[key] =
        formData[key] != null && typeof formData[key] === "string"
          ? formData[key].trim()
          : formData[key];
    });

    // ✅ Required fields
    const required = ["name", "email", "contact", "company_name", "department", "business_unit"];
    for (const field of required) {
      if (!trimmedData[field]) {
        setErrors({ api: "All required fields must be filled" });
        return;
      }
    }

    // ✅ Payload
    const payload = {
      name: trimmedData.name,
      email: trimmedData.email,
      contact: trimmedData.contact,
      company_name: trimmedData.company_name,
      subscribers: trimmedData.subscribers || 2,
      department: trimmedData.department,
      business_unit: trimmedData.business_unit,
      escalation_mail: trimmedData.escalation_mail || "",
    };

    try {
      await apiFetch("/user/add_admin", {
        method: "POST",
        body: JSON.stringify(payload),
      });

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
    } catch (err) {
      console.error("Error submitting admin:", err);
      setErrors({ api: err.message || "Failed to submit form. Please try again." });
    }
  };

  // ✅ Auto-hide errors
  useEffect(() => {
    if (errors.api) {
      setErrorVisible(true);
      const timer = setTimeout(() => setErrorVisible(false), 4500);
      const removeTimer = setTimeout(() => setErrors({}), 5000);
      return () => {
        clearTimeout(timer);
        clearTimeout(removeTimer);
      };
    }
  }, [errors.api]);

  // ✅ Auto-hide success
  useEffect(() => {
    if (successMsg) {
      setSuccessVisible(true);
      const timer = setTimeout(() => setSuccessVisible(false), 4500);
      const removeTimer = setTimeout(() => setSuccessMsg(""), 5000);
      return () => {
        clearTimeout(timer);
        clearTimeout(removeTimer);
      };
    }
  }, [successMsg]);

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
        <h2>Add Admin</h2>

        <div className="messages-top" style={{ margin: "0 auto 1rem auto", width: "50%" }}>
          {errors.api && <div className={`login-error ${!errorVisible ? "fade-out" : ""}`}>{errors.api}</div>}
          {successMsg && <div className={`success-msg ${!successVisible ? "fade-out" : ""}`}>{successMsg}</div>}
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
                if (formData.subscribersInput === "2") setFormData((prev) => ({ ...prev, subscribersInput: "" }));
              }}
              onBlur={() => {
                if (formData.subscribersInput === "") setFormData((prev) => ({ ...prev, subscribersInput: "2", subscribers: 2 }));
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
            <input type="email" name="escalation_mail" value={formData.escalation_mail} onChange={handleInputChange} />
          </label>

          <button type="submit" className="submit-btn">Submit</button>
        </form>
      </div>
    </div>
  );
}
