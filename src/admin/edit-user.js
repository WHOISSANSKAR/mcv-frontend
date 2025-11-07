import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function EditUser() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    contact: "",
    escalationEmail: "",
    businessUnit: "",
    businessUnitId: "",
    department: "",
    departmentId: "",
  });

  const [originalData, setOriginalData] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [deptFocused, setDeptFocused] = useState(false);
  const [unitFocused, setUnitFocused] = useState(false);

  const [businessUnits, setBusinessUnits] = useState([]);
  const [filteredBusinessUnits, setFilteredBusinessUnits] = useState([]);

  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);

  const [popup, setPopup] = useState({ visible: false, type: "", value: "" });

  const navigate = useNavigate();

  const admin = useMemo(() => JSON.parse(localStorage.getItem("user") || "{}"), []);
  const adminId = admin.usrlst_id;

  const editUserData = useMemo(
    () => JSON.parse(localStorage.getItem("editUserData") || "{}"),
    []
  );
  const editingUserId = editUserData.usrlst_id || editUserData.id;

  // ✅ restore temp saved form AND sync originalData so Save button works
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("editUserTempForm") || "{}");
    if (saved && Object.keys(saved).length > 0) {
      setFormData(saved);
      setOriginalData(saved); // ✅ This line fixes the Save button when returning from Add BU/Dept
    }
  }, []);

  useEffect(() => {
    if (!adminId || admin?.usrlst_role?.toLowerCase() !== "admin") {
      alert("Access denied");
      navigate("/", { replace: true });
    }
  }, [navigate, adminId, admin]);

  useEffect(() => {
    if (editUserData && !localStorage.getItem("editUserTempForm")) {
      const initial = {
        username: editUserData.name || "",
        email: editUserData.email || "",
        contact: editUserData.contact || "",
        escalationEmail: editUserData.escalation_mail || "",
        businessUnit: editUserData.business_unit || "",
        businessUnitId: editUserData.business_unit_id || "",
        department: editUserData.department || "",
        departmentId: editUserData.department_id || "",
      };
      setOriginalData(initial);
      setFormData(initial);
    }
  }, [editUserData]);

  useEffect(() => {
    if (!adminId) return;

    fetch(`http://localhost:5000/user/business_unit/all?user_id=${adminId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) return;
        setBusinessUnits(data);
        setFilteredBusinessUnits(data);

        const fromAddBU = localStorage.getItem("fromAddBU");
        const fromAddDept = localStorage.getItem("fromAddDept");

        if ((fromAddBU || fromAddDept) && data.length > 0) {
          localStorage.removeItem("fromAddBU");
          localStorage.removeItem("fromAddDept");
          localStorage.removeItem("customBU");
          localStorage.removeItem("customDept");
          localStorage.removeItem("selectedBusinessUnitId");
          localStorage.removeItem("page");

          const latestBU = data[0];

          setFormData((prev) => ({
            ...prev,
            businessUnit: latestBU.business_unit_name,
            businessUnitId: latestBU.usrbu_id,
            department: "",
            departmentId: "",
          }));

          fetchDepartments(latestBU.business_unit_name, !!fromAddDept);
        } else if (editUserData?.business_unit) {
          fetchDepartments(editUserData.business_unit, false);
        }
      })
      .catch((err) => console.error("BU fetch error:", err));
  }, [adminId]);

  const fetchDepartments = (buName, autoSelectLatest = false) => {
    fetch(`http://localhost:5000/user/departments/all?user_id=${adminId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) return;
        const filtered = data
          .filter((d) => d.usrbu_business_unit_name === buName)
          .sort((a, b) => b.usrdept_id - a.usrdept_id);

        setDepartments(filtered);
        setFilteredDepartments(filtered);

        if (autoSelectLatest && filtered.length > 0) {
          const latestDept = filtered[0];
          setFormData((prev) => ({
            ...prev,
            department: latestDept.usrdept_department_name,
            departmentId: latestDept.usrdept_id,
          }));
        }
      });
  };

  const handleInputChange = (e) => {
    const { name } = e.target;
    let { value } = e.target;

    if (name === "contact") value = value.replace(/\D/g, "").slice(0, 10);
    else if (name !== "email" && name !== "escalationEmail")
      value = value.replace(/\s{2,}/g, " ").replace(/^\s+/, "");

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "businessUnit") {
      setFilteredBusinessUnits(
        businessUnits.filter((b) =>
          b.business_unit_name.toLowerCase().includes(value.toLowerCase())
        )
      );
      setFormData((prev) => ({
        ...prev,
        department: "",
        departmentId: "",
        businessUnitId: "",
      }));
      setFilteredDepartments([]);
    }

    if (name === "department" && formData.businessUnit) {
      setFilteredDepartments(
        departments.filter((d) =>
          d.usrdept_department_name.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  };

  const handleSuggestionClick = (name, value) => {
    if (name === "businessUnit") {
      setFormData((prev) => ({
        ...prev,
        businessUnit: value.business_unit_name,
        businessUnitId: value.usrbu_id,
        department: "",
        departmentId: "",
      }));
      fetchDepartments(value.business_unit_name);
      setFilteredBusinessUnits([]);
      setFilteredDepartments([]);
    } else if (name === "department") {
      setFormData((prev) => ({
        ...prev,
        department: value.usrdept_department_name,
        departmentId: value.usrdept_id,
      }));
      setFilteredDepartments([]);
      setPopup({ visible: false, type: "", value: "" });
    }
  };

  const handleCustomCheck = (fieldName) => {
    const value = formData[fieldName]?.trim();
    if (!value) return;

    if (fieldName === "businessUnit") {
      const exists = businessUnits.some(
        (b) => b.business_unit_name.toLowerCase() === value.toLowerCase()
      );
      if (!exists) setPopup({ visible: true, type: "businessUnit", value });
    }

    if (fieldName === "department") {
      const exists = departments.some(
        (d) => d.usrdept_department_name.toLowerCase() === value.toLowerCase()
      );
      if (!exists && formData.businessUnit)
        setPopup({ visible: true, type: "department", value });
    }
  };

  const handlePopupYes = () => {
    localStorage.setItem("editUserTempForm", JSON.stringify(formData));

    if (popup.type === "businessUnit") {
      localStorage.setItem("customBU", popup.value);
      localStorage.setItem("fromAddBU", "true");
      localStorage.setItem("page", "3");
      navigate("/add-bu");
    } else if (popup.type === "department") {
      localStorage.setItem("customDept", popup.value);
      localStorage.setItem("fromAddDept", "true");
      localStorage.setItem("page", "3");
      navigate(`/add-department?businessUnitId=${formData.businessUnitId}`);
    }
  };

  const handlePopupNo = () => {
    if (popup.type === "businessUnit")
      setFormData((prev) => ({ ...prev, businessUnit: "", businessUnitId: "" }));
    else
      setFormData((prev) => ({ ...prev, department: "", departmentId: "" }));
    setPopup({ visible: false, type: "", value: "" });
  };

  // ✅ The ONLY change needed for Save button logic
  const isSaveEnabled =
    originalData && JSON.stringify(originalData) !== JSON.stringify(formData);

  const validateNow = () => {
    const e = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.username.trim()) e.username = "User name is required";
    if (!formData.email.trim()) e.email = "Email is required";
    else if (!emailRegex.test(formData.email)) e.email = "Invalid email";

    if (!formData.contact.trim()) e.contact = "Contact required";
    else if (formData.contact.length !== 10)
      e.contact = "Contact must be exactly 10 digits";

    if (!formData.businessUnit.trim()) e.businessUnit = "Business Unit required";
    if (!formData.department.trim()) e.department = "Department required";

    if (!formData.escalationEmail.trim())
      e.escalationEmail = "Escalation email required";
    else if (!emailRegex.test(formData.escalationEmail))
      e.escalationEmail = "Invalid escalation email";

    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    const v = validateNow();
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    try {
      const payload = {
        name: formData.username,
        contact: formData.contact,
        department: formData.department,
        escalation_mail: formData.escalationEmail,
      };

      const res = await fetch(
        `http://localhost:5000/user_update/${editingUserId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        setErrors({ api: result.error || "Failed to update user" });
        return;
      }

      setSuccessMsg("✅ User updated successfully!");

      localStorage.removeItem("editUserTempForm");
      localStorage.removeItem("fromAddBU");
      localStorage.removeItem("fromAddDept");
      localStorage.removeItem("customBU");
      localStorage.removeItem("customDept");
      localStorage.removeItem("selectedBusinessUnitId");
      localStorage.removeItem("page");
      localStorage.removeItem("editUserData");

      setTimeout(() => navigate("/user"), 800);
    } catch (err) {
      setErrors({ api: "Failed to update user" });
    }
  };

  const handleDelete = () => {
    if (window.confirm("Delete user?")) navigate("/user");
  };

  const handleBackup = () => {
    alert("Backup taken.");
  };

  return (
    <div className="edit-user">
      <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className="form-container">
        <h2>Edit User</h2>

        {errors.api && <div className="login-error">{errors.api}</div>}
        {successMsg && <div className="success-msg">{successMsg}</div>}

        <form onSubmit={handleSubmit} className="add-user-form">
          <label>
            User Name
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
            />
            {submitted && errors.username && (
              <p className="error">{errors.username}</p>
            )}
          </label>

          <label>
            E-Mail Address
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
            {submitted && errors.email && (
              <p className="error">{errors.email}</p>
            )}
          </label>

          <label>
            Contact Number
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleInputChange}
              maxLength={10}
            />
            {submitted && errors.contact && (
              <p className="error">{errors.contact}</p>
            )}
          </label>

          <label className="autocomplete">
            Business Unit
            <input
              type="text"
              name="businessUnit"
              value={formData.businessUnit}
              onChange={handleInputChange}
              autoComplete="off"
              onFocus={() => setUnitFocused(true)}
              onBlur={() => {
                setUnitFocused(false);
                handleCustomCheck("businessUnit");
              }}
            />
            {submitted && errors.businessUnit && (
              <p className="error">{errors.businessUnit}</p>
            )}
            {unitFocused && (
              <ul className="suggestions">
                {filteredBusinessUnits.length > 0 ? (
                  filteredBusinessUnits.map((unit) => (
                    <li
                      key={unit.usrbu_id}
                      onMouseDown={() =>
                        handleSuggestionClick("businessUnit", unit)
                      }
                    >
                      {unit.business_unit_name}
                    </li>
                  ))
                ) : (
                  <li className="no-suggestions">No Business Unit Found</li>
                )}
              </ul>
            )}
          </label>

          <label className="autocomplete">
            Department
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              disabled={!formData.businessUnit}
              autoComplete="off"
              onFocus={() => setDeptFocused(true)}
              onBlur={() => {
                setDeptFocused(false);
                handleCustomCheck("department");
              }}
            />
            {submitted && errors.department && (
              <p className="error">{errors.department}</p>
            )}
            {deptFocused && (
              <ul className="suggestions">
                {filteredDepartments.length > 0 ? (
                  filteredDepartments.map((dept) => (
                    <li
                      key={dept.usrdept_id}
                      onMouseDown={() =>
                        handleSuggestionClick("department", dept)
                      }
                    >
                      {dept.usrdept_department_name}
                    </li>
                  ))
                ) : (
                  <li className="no-suggestions">No Department Found</li>
                )}
              </ul>
            )}
          </label>

          <label>
            Escalation Email
            <input
              type="email"
              name="escalationEmail"
              value={formData.escalationEmail}
              onChange={handleInputChange}
            />
            {submitted && errors.escalationEmail && (
              <p className="error">{errors.escalationEmail}</p>
            )}
          </label>

          <div className="action-buttons">
            <button
              type="submit"
              className="submit-btn"
              disabled={!isSaveEnabled}
              style={{
                opacity: isSaveEnabled ? 1 : 0.5,
                cursor: isSaveEnabled ? "pointer" : "not-allowed",
              }}
            >
              Save Changes
            </button>

            <button
              type="button"
              className="submit-btn delete-btn"
              onClick={handleDelete}
            >
              Delete User
            </button>
          </div>

          <div className="backup-container">
            <button type="button" className="backup-btn" onClick={handleBackup}>
              Take Backup
            </button>
          </div>
        </form>

        {popup.visible && (
          <div className="popup-overlay">
            <div className="popup">
              <p>
                Add "{popup.value}" as a new{" "}
                {popup.type === "businessUnit" ? "Business Unit" : "Department"}?
              </p>
              <div className="popup-buttons">
                <button className="popup-yes" onClick={handlePopupYes}>
                  Yes
                </button>
                <button className="popup-no" onClick={handlePopupNo}>
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
