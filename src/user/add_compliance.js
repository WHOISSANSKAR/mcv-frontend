import React, { useState, useEffect } from "react";
import UserSidebar from "./UserSidebar";
import UserHeader from "./UserHeader";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function AddSelf() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    regcmp_compliance_id: "",
    regcmp_act: "",
    regcmp_particular: "",
    regcmp_description: "",
    regcmp_long_description: "",
    regcmp_title: "",
    regcmp_start_date: "",
    regcmp_end_date: "",
    regcmp_action_date: "",
    regcmp_reminder_days: 1,
    regcmp_escalation_email: "",
    regcmp_escalation_reminder_days: "",
    regcmp_status: "Upcoming",
    regcmp_approvers_email: "",
  });

  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [apiError, setApiError] = useState("");

  const toInputDate = (value) => {
    if (!value) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const d = new Date(value);
    return isNaN(d) ? "" : d.toISOString().split("T")[0];
  };

  useEffect(() => {
    const savedRow = localStorage.getItem("selectedComplianceRow");
    if (!savedRow) return;
    const row = JSON.parse(savedRow);

    setFormData((prev) => ({
      ...prev,
      regcmp_compliance_id: row.complianceId || "",
      regcmp_act: row.act || "",
      regcmp_particular: row.particular || "",
      regcmp_description: row.description || "",
      regcmp_long_description: row.longDescription || "",
      regcmp_title: row.particular || "",
      regcmp_start_date: toInputDate(row.startDate),
      regcmp_action_date: toInputDate(row.actionDate),
      regcmp_end_date: toInputDate(row.endDate),
    }));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors({});
    setSuccessMsg("");
    setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.regcmp_particular) newErrors.regcmp_particular = "Name required";
    if (!formData.regcmp_start_date) newErrors.regcmp_start_date = "Start Date required";
    if (!formData.regcmp_end_date) newErrors.regcmp_end_date = "End Date required";
    if (!formData.regcmp_action_date) newErrors.regcmp_action_date = "Action Date required";
    if (!formData.regcmp_approvers_email) newErrors.regcmp_approvers_email = "Approvers Email required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      ...formData,
      regcmp_reminder_days: parseInt(formData.regcmp_reminder_days) || 0,
      regcmp_escalation_reminder_days: parseInt(formData.regcmp_escalation_reminder_days) || 0,
    };

    try {
      const res = await fetch("http://localhost:5000/compliance/add/regulatory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.status === 201) {
        setSuccessMsg("✅ Compliance created successfully!");
        setFormData({
          regcmp_compliance_id: "",
          regcmp_act: "",
          regcmp_particular: "",
          regcmp_description: "",
          regcmp_long_description: "",
          regcmp_title: "",
          regcmp_start_date: "",
          regcmp_end_date: "",
          regcmp_action_date: "",
          regcmp_reminder_days: 1,
          regcmp_escalation_email: "",
          regcmp_escalation_reminder_days: "",
          regcmp_status: "Upcoming",
          regcmp_approvers_email: "",
        });
        navigate("/statutory_info");
      } else {
        setApiError(data.error || "Something went wrong");
      }
    } catch (err) {
      setApiError(err.message);
    }
  };

  return (
    <div className="add_compliance">
      <UserSidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <UserHeader menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className="form-container">
        <h2>Add Regulatory Compliance</h2>
        <form onSubmit={handleSubmit} className="add-user-form">
          <label>
            Compliance ID
            <input type="text" name="regcmp_compliance_id" value={formData.regcmp_compliance_id} readOnly />
          </label>

          <label>
            Act
            <input type="text" name="regcmp_act" value={formData.regcmp_act} onChange={handleInputChange} />
          </label>

          <label>
            Compliance Particular / Name *
            <input type="text" name="regcmp_particular" value={formData.regcmp_particular} onChange={handleInputChange} />
            {errors.regcmp_particular && <span className="error">{errors.regcmp_particular}</span>}
          </label>

          <label>
            Description
            <input type="text" name="regcmp_description" value={formData.regcmp_description} onChange={handleInputChange} />
          </label>

          <label>
            Long Description
            <input type="text" name="regcmp_long_description" value={formData.regcmp_long_description} onChange={handleInputChange} />
          </label>

          <label>
            Title
            <input type="text" name="regcmp_title" value={formData.regcmp_title} onChange={handleInputChange} />
          </label>

          <label>
            Start Date *
            <input type="date" name="regcmp_start_date" value={formData.regcmp_start_date} onChange={handleInputChange} />
            {errors.regcmp_start_date && <span className="error">{errors.regcmp_start_date}</span>}
          </label>

          <label>
            End Date *
            <input type="date" name="regcmp_end_date" value={formData.regcmp_end_date} onChange={handleInputChange} />
            {errors.regcmp_end_date && <span className="error">{errors.regcmp_end_date}</span>}
          </label>

          <label>
            Action Date *
            <input type="date" name="regcmp_action_date" value={formData.regcmp_action_date} onChange={handleInputChange} />
            {errors.regcmp_action_date && <span className="error">{errors.regcmp_action_date}</span>}
          </label>

          <label>
            Approvers Email *
            <input type="email" name="regcmp_approvers_email" value={formData.regcmp_approvers_email} onChange={handleInputChange} placeholder="Comma-separated emails" />
            {errors.regcmp_approvers_email && <span className="error">{errors.regcmp_approvers_email}</span>}
          </label>

          <label>
            Escalation Email
            <input type="email" name="regcmp_escalation_email" value={formData.regcmp_escalation_email} onChange={handleInputChange} />
          </label>

          <div style={{ display: "flex", gap: "10px" }}>
            <label style={{ flex: 1 }}>
              Reminder Days
              <input type="number" name="regcmp_reminder_days" value={formData.regcmp_reminder_days} onChange={handleInputChange} style={{ width: "60px" }} />
            </label>

            <label style={{ flex: 1 }}>
              Escalation Reminder Days
              <input type="number" name="regcmp_escalation_reminder_days" value={formData.regcmp_escalation_reminder_days} onChange={handleInputChange} style={{ width: "60px" }} />
            </label>
          </div>

          {successMsg && <span className="success-msg">{successMsg}</span>}
          {apiError && <span className="error">{apiError}</span>}

          <button type="submit" className="submit-btn">Create Compliance</button>
        </form>
      </div>
    </div>
  );
}
