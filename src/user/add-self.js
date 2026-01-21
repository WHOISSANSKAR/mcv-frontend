import React, { useState } from "react";
import UserSidebar from "./UserSidebar";
import UserHeader from "./UserHeader";
import { apiFetch } from "../api_call"; // ✅ centralized API
import "./Dashboard.css";

export default function AddSelf() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    compliance_id: "",
    compliance_name: "",
    start_date: "",
    end_date: "",
    comply_by: "",
    description: "",
    repeat_type: "months",
    repeat_months: 1,
    repeat_days: "",
    reminder_days: 1,
    add_escalation: false,
    escalation_email: "",
    escalation_reminder_days: "",
  });

  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setSuccessMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.compliance_name) newErrors.compliance_name = "Compliance Name is required";
    if (!formData.start_date) newErrors.start_date = "Start Date is required";
    if (!formData.end_date) newErrors.end_date = "End Date is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const data = await apiFetch("/compliance/add", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cmplst_compliance_key: formData.compliance_id,
          cmplst_country: "India",
          cmplst_act: formData.compliance_name,
          cmplst_particular: formData.compliance_name,
          cmplst_start_date: formData.start_date,
          cmplst_end_date: formData.end_date,
          cmplst_action_date: formData.comply_by,
          cmplst_description: formData.description,
        }),
      });

      setSuccessMsg("✅ Compliance created successfully!");
      console.log("API Success:", data);

      // optionally reset form
      setFormData((prev) => ({
        ...prev,
        compliance_name: "",
        start_date: "",
        end_date: "",
        comply_by: "",
        description: "",
      }));
    } catch (error) {
      console.error("API Error:", error);
      setSuccessMsg("❌ " + (error?.message || "Failed to create compliance"));
    }
  }

  return (
    <div className="add-user">
      <UserSidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <UserHeader menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <div className="form-container">
        <h2>Add Compliance</h2>
        <form onSubmit={handleSubmit} className="add-user-form">
          <label>
            Compliance ID
            <input type="text" name="compliance_id" value={formData.compliance_id} readOnly />
          </label>

          <label>
            Compliance Name
            <input type="text" name="compliance_name" value={formData.compliance_name} onChange={handleInputChange} />
            {errors.compliance_name && <span className="error">{errors.compliance_name}</span>}
          </label>

          <label>
            Start Date
            <input type="date" name="start_date" value={formData.start_date} onChange={handleInputChange} />
            {errors.start_date && <span className="error">{errors.start_date}</span>}
          </label>

          <label>
            End Date
            <input type="date" name="end_date" value={formData.end_date} onChange={handleInputChange} />
            {errors.end_date && <span className="error">{errors.end_date}</span>}
          </label>

          <label>
            Comply By
            <input type="date" name="comply_by" value={formData.comply_by} onChange={handleInputChange} />
          </label>

          <label>
            Description
            <textarea name="description" value={formData.description} onChange={handleInputChange}></textarea>
          </label>

          <label className="autocomplete">
            Repeat Type
            <div>
              <input type="radio" name="repeat_type" value="months" checked={formData.repeat_type === "months"} onChange={handleInputChange} />
              <input type="number" name="repeat_months" value={formData.repeat_months} min="1" style={{ width: "60px" }} onChange={handleInputChange} /> Months
            </div>
            <div>
              <input type="radio" name="repeat_type" value="days" checked={formData.repeat_type === "days"} onChange={handleInputChange} />
              <input type="number" name="repeat_days" value={formData.repeat_days} style={{ width: "60px" }} onChange={handleInputChange} /> Days
            </div>
            <div>
              <input type="radio" name="repeat_type" value="none" checked={formData.repeat_type === "none"} onChange={handleInputChange} /> Do Not Repeat
            </div>
          </label>

          <label>
            Reminder Days
            <input type="number" name="reminder_days" value={formData.reminder_days} min="1" style={{ width: "60px" }} onChange={handleInputChange} /> Days Prior to Action Dates
          </label>

          <label>
            <input type="checkbox" name="add_escalation" checked={formData.add_escalation} onChange={handleInputChange} /> Add Escalation
          </label>

          <label>
            Escalation Email
            <input type="email" name="escalation_email" value={formData.escalation_email} onChange={handleInputChange} readOnly={!formData.add_escalation} />
          </label>

          <label>
            Reminder of Escalation Email
            <input type="number" name="escalation_reminder_days" value={formData.escalation_reminder_days} style={{ width: "60px" }} onChange={handleInputChange} /> Days Prior to Action Dates
          </label>

          {successMsg && <span className="success-msg">{successMsg}</span>}
          <button type="submit" className="submit-btn">Create Compliance</button>
        </form>
      </div>
    </div>
  );
}
