import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api_call"; // ✅ works for pages in src/admin or src/user
import "./Dashboard.css";

export default function AddUser() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [formData, setFormData] = useState({
    company: "",
    username: "",
    department: "",
    departmentId: "",
    email: "",
    contact: "",
    escalationEmail: "",
    businessUnit: "",
    businessUnitId: "",
  });

  const [deptFocused, setDeptFocused] = useState(false);
  const [unitFocused, setUnitFocused] = useState(false);
  const [popup, setPopup] = useState({ visible: false, type: "", value: "" });
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [errorVisible, setErrorVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);

  const [businessUnits, setBusinessUnits] = useState([]);
  const [filteredBusinessUnits, setFilteredBusinessUnits] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);

  const navigate = useNavigate();

  let user = null;
  let userId = null;
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      if (parsed?.usrlst_id) {
        user = parsed;
        userId = parsed.usrlst_id;
      }
    }
  } catch (err) {
    console.warn("Invalid user in localStorage:", err);
  }

  if (!userId) {
    alert("You must be logged in to access this page.");
    window.location.href = "/";
  }

  useEffect(() => {
    if (!userId) navigate("/", { replace: true });
    else if (user?.usrlst_role?.toLowerCase() !== "admin") {
      alert("Access denied. Only admins can add users.");
      navigate("/", { replace: true });
    }
  }, [navigate, userId, user]);

  // Restore saved form
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("addUserForm") || "{}");
    setFormData((prev) => ({ ...prev, ...saved }));
  }, []);

  // Auto-save form
  useEffect(() => {
    const fieldsToSave = ["company", "username", "email", "contact", "escalationEmail"];
    const toStore = {};
    fieldsToSave.forEach((key) => {
      if (formData[key]) toStore[key] = formData[key];
    });
    localStorage.setItem("addUserForm", JSON.stringify(toStore));
  }, [formData]);

  // Clear storage on unload
  useEffect(() => {
    const clearStorage = () => localStorage.removeItem("addUserForm");
    window.addEventListener("beforeunload", clearStorage);
    return () => window.removeEventListener("beforeunload", clearStorage);
  }, []);

  // Fetch Business Units
  useEffect(() => {
    if (!userId) return;

    async function getBusinessUnits() {
      try {
        const data = await apiFetch(`/user/business_unit/all?user_id=${userId}`);
        if (Array.isArray(data)) {
          setBusinessUnits(data);
          setFilteredBusinessUnits(data);

          const fromAddBU = localStorage.getItem("fromAddBU");
          const fromAddDept = localStorage.getItem("fromAddDept");

          if ((fromAddBU || fromAddDept) && data.length > 0) {
            ["fromAddBU", "fromAddDept", "customBU", "customDept", "selectedBusinessUnitId"].forEach(
              (key) => localStorage.removeItem(key)
            );

            const latestBU = data[0];

            setFormData((prev) => ({
              ...prev,
              businessUnit: latestBU.business_unit_name,
              businessUnitId: latestBU.usrbu_id,
            }));

            // Also fetch departments
            fetchDepartments(latestBU.business_unit_name, fromAddDept);
          }
        }
      } catch (err) {
        console.error("Error fetching business units:", err);
      }
    }

    getBusinessUnits();
  }, [userId]);

  const fetchDepartments = async (buName, autoSelectDept = false) => {
    if (!buName) return;

    try {
      const data = await apiFetch("/user/departments/all");
      if (Array.isArray(data)) {
        const filtered = data
          .filter((d) => d.usrbu_business_unit_name === buName)
          .sort((a, b) => b.usrdept_id - a.usrdept_id);

        setDepartments(filtered);
        setFilteredDepartments(filtered);

        if (autoSelectDept && filtered.length > 0) {
          const latestDept = filtered[0];
          setFormData((prev) => ({
            ...prev,
            department: latestDept.usrdept_department_name,
            departmentId: latestDept.usrdept_id,
          }));
        }
      } else {
        setDepartments([]);
        setFilteredDepartments([]);
      }
    } catch (err) {
      console.error("Error fetching departments:", err);
      setDepartments([]);
      setFilteredDepartments([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (value.trim() === "" && value !== "") return;

    setSuccessMsg("");
    setErrors({});
    const cleanValue = value.replace(/\s{2,}/g, " ").trimStart();
    setFormData((prev) => ({ ...prev, [name]: cleanValue }));

    if (name === "businessUnit") {
      setFilteredBusinessUnits(
        businessUnits.filter((b) =>
          b.business_unit_name.toLowerCase().includes(cleanValue.toLowerCase())
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
          d.usrdept_department_name.toLowerCase().includes(cleanValue.toLowerCase())
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
      localStorage.setItem("selectedBusinessUnitId", value.usrbu_id);
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

  const handleCustomCheck = (name) => {
    const value = formData[name]?.trim();
    if (!value) return;
    if (name === "businessUnit") {
      const exists = businessUnits.some(
        (b) => b.business_unit_name.toLowerCase() === value.toLowerCase()
      );
      if (!exists && formData.businessUnitId === "") {
        setPopup({ visible: true, type: "businessUnit", value });
      }
    } else if (name === "department") {
      const exists = departments.some(
        (d) => d.usrdept_department_name.toLowerCase() === value.toLowerCase()
      );
      if (!exists && formData.businessUnit) {
        setPopup({ visible: true, type: "department", value });
      }
    }
  };

  const handlePopupYes = () => {
    if (popup.type === "businessUnit") {
      localStorage.setItem("customBU", popup.value);
      localStorage.setItem("fromAddBU", "true");
      localStorage.setItem("page", "2");
      localStorage.setItem("BUpage", "2");
      navigate("/add-bu");
    } else if (popup.type === "department") {
      localStorage.setItem("customDept", popup.value);
      localStorage.setItem("fromAddDept", "true");
      localStorage.setItem("page", "2");
      navigate(`/add-department?businessUnitId=${formData.businessUnitId}`);
    }
  };

  const handlePopupNo = () => {
    if (popup.type === "businessUnit")
      setFormData((prev) => ({ ...prev, businessUnit: "", businessUnitId: "" }));
    else if (popup.type === "department")
      setFormData((prev) => ({ ...prev, department: "", departmentId: "" }));
    setPopup({ visible: false, type: "", value: "" });
  };

  const handleFocus = (name) => {
    if (name === "businessUnit") {
      setUnitFocused(true);
      if (!formData.businessUnit) setFilteredBusinessUnits(businessUnits);
    } else if (name === "department") {
      setDeptFocused(true);
      if (formData.businessUnit && !formData.department) setFilteredDepartments(departments);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrors({});
    setPopup({ visible: false, type: "", value: "" });

    // Trim data
    const trimmedData = {};
    Object.keys(formData).forEach((key) => {
      const value = formData[key];
      trimmedData[key] = value != null && typeof value === "string" ? value.trim() : value;
    });

    // Validation
    const requiredFields = [
      "company",
      "username",
      "email",
      "contact",
      "businessUnit",
      "department",
      "escalationEmail",
    ];
    for (const field of requiredFields) {
      if (!trimmedData[field]) {
        setErrors({ api: "All fields are required and cannot be blank or spaces." });
        return;
      }
    }

    if (trimmedData.contact.length !== 10) {
      setErrors({ api: "Contact number must be exactly 10 digits." });
      return;
    }

    localStorage.removeItem("addUserForm");

    try {
      const payload = {
        user_id: Number(userId),
        name: trimmedData.username,
        email: trimmedData.email,
        contact: trimmedData.contact,
        role: "user",
        department: trimmedData.department,
        business_unit: trimmedData.businessUnit,
        escalation_mail: trimmedData.escalationEmail,
        company_name: trimmedData.company,
      };

      await apiFetch("/user/add", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setSuccessMsg("✅ User added successfully!");
      setFormData({
        company: "",
        username: "",
        department: "",
        departmentId: "",
        email: "",
        contact: "",
        escalationEmail: "",
        businessUnit: "",
        businessUnitId: "",
      });
    } catch (err) {
      console.error("Error adding user:", err);
      setErrors({ api: err.message || "Failed to add user. Please try again." });
    }
  };

  // Auto-hide messages
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
    <div className="add-user">
      <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <div className="form-container">
        <h2>Add User</h2>

        <div className="messages-top" style={{ margin: "0 auto 1rem auto", width: "50%" }}>
          {errors.api && <div className={`login-error ${!errorVisible ? "fade-out" : ""}`}>{errors.api}</div>}
          {successMsg && <div className={`success-msg ${!successVisible ? "fade-out" : ""}`}>{successMsg}</div>}
        </div>

        <form onSubmit={handleSubmit} className="add-user-form">
          <label>
            Company Name
            <input type="text" name="company" value={formData.company} onChange={handleInputChange} />
          </label>

          <label>
            User Name
            <input type="text" name="username" value={formData.username} onChange={handleInputChange} />
          </label>

          <label>
            E-Mail Address
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
          </label>

          <label>
            Contact Number
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={(e) => {
                const onlyDigits = e.target.value.replace(/\D/g, "").slice(0, 10);
                setFormData((prev) => ({ ...prev, contact: onlyDigits }));
                if (onlyDigits.length === 10) setErrors((prev) => ({ ...prev, contact: "" }));
              }}
              onBlur={() => {
                if (formData.contact.length > 0 && formData.contact.length < 10) {
                  setErrors((prev) => ({ ...prev, contact: "Contact number must be exactly 10 digits." }));
                }
              }}
              maxLength={10}
            />
            {errors.contact && <p style={{ color: "red", fontSize: "14px" }}>{errors.contact}</p>}
          </label>

          {/* Business Unit */}
          <label className="autocomplete">
            Business Unit
            <input
              type="text"
              name="businessUnit"
              value={formData.businessUnit}
              onChange={handleInputChange}
              autoComplete="off"
              onFocus={() => handleFocus("businessUnit")}
              onBlur={() => {
                setUnitFocused(false);
                handleCustomCheck("businessUnit");
              }}
            />
            {unitFocused && (
              <ul className="suggestions">
                {filteredBusinessUnits.length > 0 ? (
                  filteredBusinessUnits.map((unit) => (
                    <li key={unit.usrbu_id} onMouseDown={() => handleSuggestionClick("businessUnit", unit)}>
                      {unit.business_unit_name}
                    </li>
                  ))
                ) : (
                  <li className="no-suggestions">No Business Unit Found</li>
                )}
              </ul>
            )}
          </label>

          {/* Department */}
          <label className="autocomplete">
            Department
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              autoComplete="off"
              disabled={!formData.businessUnit}
              placeholder={!formData.businessUnit ? "Select Business Unit first" : ""}
              onFocus={() => handleFocus("department")}
              onBlur={() => {
                setDeptFocused(false);
                handleCustomCheck("department");
              }}
            />
            {deptFocused && (
              <ul className="suggestions">
                {filteredDepartments.length > 0 ? (
                  filteredDepartments.map((dept) => (
                    <li key={dept.usrdept_id} onMouseDown={() => handleSuggestionClick("department", dept)}>
                      {dept.usrdept_department_name}
                    </li>
                  ))
                ) : (
                  <li className="no-suggestions">No Department Found</li>
                )}
              </ul>
            )}
          </label>

          <p className="subheading">
            If not complied in stipulated period, alert will be sent 2 days before the action date.
          </p>

          <label>
            Escalation Email
            <input type="email" name="escalationEmail" value={formData.escalationEmail} onChange={handleInputChange} />
          </label>

          <button type="submit" className="submit-btn">
            Add User
          </button>
        </form>

        {/* Popup */}
        {popup.visible && (
          <div className="popup-overlay">
            <div className="popup">
              <p>
                Do you want to add "{popup.value}" as a new {popup.type === "businessUnit" ? "Business Unit" : "Department"}?
              </p>
              <div className="popup-buttons">
                <button className="popup-yes" onClick={handlePopupYes}>Yes</button>
                <button className="popup-no" onClick={handlePopupNo}>No</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
