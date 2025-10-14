import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
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
      if (parsed && parsed.usrlst_id && !isNaN(parsed.usrlst_id)) {
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

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("addUserForm") || "{}");
    setFormData((prev) => ({ ...prev, ...saved }));
  }, []);

  useEffect(() => {
    const fieldsToSave = ["company", "username", "email", "contact", "escalationEmail"];
    const toStore = {};
    fieldsToSave.forEach((key) => {
      if (formData[key]) toStore[key] = formData[key];
    });
    localStorage.setItem("addUserForm", JSON.stringify(toStore));
  }, [formData]);

  useEffect(() => {
    const clearStorage = () => localStorage.removeItem("addUserForm");
    window.addEventListener("beforeunload", clearStorage);
    return () => window.removeEventListener("beforeunload", clearStorage);
  }, []);

  useEffect(() => {
    if (!userId) return;
    fetch(`http://localhost:5000/user/business_unit/all?user_id=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setBusinessUnits(data);
          setFilteredBusinessUnits(data);

          const fromAddBU = localStorage.getItem("fromAddBU");
          const fromAddDept = localStorage.getItem("fromAddDept");

          if ((fromAddBU || fromAddDept) && data.length > 0) {
            localStorage.removeItem("fromAddBU");
            localStorage.removeItem("fromAddDept");

            const latestBU = data[0];
            setFormData((prev) => ({
              ...prev,
              businessUnit: latestBU.business_unit_name,
              businessUnitId: latestBU.usrbu_id,
            }));
            localStorage.setItem("selectedBusinessUnitId", latestBU.usrbu_id);

            fetchDepartments(latestBU.business_unit_name, fromAddDept);
          }
        }
      })
      .catch((err) => console.error("Error fetching business units:", err));
  }, [userId]);

  const fetchDepartments = (buName, autoSelectDept = false) => {
    if (!userId || !buName) return;
    fetch(`http://localhost:5000/user/departments/all?user_id=${userId}`)
      .then((res) => res.json())
      .then((data) => {
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
      })
      .catch((err) => console.error("Error fetching departments:", err));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSuccessMsg("");
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

    setErrors((prev) => ({ ...prev, [name]: "" }));
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
    const value = formData[name]?.trim?.();
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
      navigate("/add-bu");
    } else if (popup.type === "department") {
      localStorage.setItem("customDept", popup.value);
      localStorage.setItem("fromAddDept", "true");
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
    setPopup({ visible: false, type: "", value: "" });

    if (
      formData.businessUnit &&
      !businessUnits.some(
        (b) => b.business_unit_name.toLowerCase() === formData.businessUnit.toLowerCase()
      ) &&
      formData.businessUnitId === ""
    ) {
      return setPopup({ visible: true, type: "businessUnit", value: formData.businessUnit });
    }

    if (
      formData.department &&
      !departments.some(
        (d) => d.usrdept_department_name.toLowerCase() === formData.department.toLowerCase()
      )
    ) {
      return setPopup({ visible: true, type: "department", value: formData.department });
    }

    const trimmedData = {};
    Object.keys(formData).forEach((key) => {
      const value = formData[key];
      trimmedData[key] = value != null && typeof value === "string" ? value.trim() : value;
    });

    const newErrors = {};
    if (!trimmedData.company) newErrors.company = "Company Name is required";
    if (!trimmedData.username) newErrors.username = "User Name is required";
    if (!trimmedData.email) newErrors.email = "Email is required";
    if (!trimmedData.contact) newErrors.contact = "Contact Number is required";
    if (!trimmedData.businessUnit) newErrors.businessUnit = "Business Unit is required";
    if (!trimmedData.department) newErrors.department = "Department is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
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
        escalation_mail: trimmedData.escalationEmail || "",
        company_name: trimmedData.company,
      };

      const response = await fetch("http://localhost:5000/user/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ api: data.error || "Failed to add user" });
      } else {
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
      }
    } catch (err) {
      console.error("Error adding user:", err);
      setErrors({ api: "Failed to add user. Please try again." });
    }
  };

  return (
    <div className="add-user">
      <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <div className="form-container">
        <h2>Add User</h2>
        <form onSubmit={handleSubmit} className="add-user-form">
          <label>
            Company Name
            <input type="text" name="company" value={formData.company} onChange={handleInputChange} />
            {errors.company && <div className="login-error">{errors.company}</div>}
          </label>

          <label>
            User Name
            <input type="text" name="username" value={formData.username} onChange={handleInputChange} />
            {errors.username && <div className="login-error">{errors.username}</div>}
          </label>

          <label>
            E-Mail Address
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
            {errors.email && <div className="login-error">{errors.email}</div>}
          </label>

          <label>
            Contact Number
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={(e) => {
                const onlyDigits = e.target.value.replace(/\D/g, "");
                setFormData((prev) => ({ ...prev, contact: onlyDigits }));
              }}
            />
            {errors.contact && <div className="login-error">{errors.contact}</div>}
          </label>

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
            {errors.businessUnit && <div className="login-error">{errors.businessUnit}</div>}
            {unitFocused && filteredBusinessUnits.length > 0 && (
              <ul className="suggestions">
                {filteredBusinessUnits.map((unit) => (
                  <li key={unit.usrbu_id} onMouseDown={() => handleSuggestionClick("businessUnit", unit)}>
                    {unit.business_unit_name}
                  </li>
                ))}
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
              autoComplete="off"
              disabled={!formData.businessUnit}
              placeholder={!formData.businessUnit ? "Select Business Unit first" : ""}
              onFocus={() => handleFocus("department")}
              onBlur={() => {
                setDeptFocused(false);
                handleCustomCheck("department");
              }}
            />
            {errors.department && <div className="login-error">{errors.department}</div>}
            {deptFocused && filteredDepartments.length > 0 && (
              <ul className="suggestions">
                {filteredDepartments.map((dept) => (
                  <li key={dept.usrdept_id} onMouseDown={() => handleSuggestionClick("department", dept)}>
                    {dept.usrdept_department_name}
                  </li>
                ))}
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

          {errors.api && <div className="login-error">{errors.api}</div>}
          {successMsg && <div className="success-msg">{successMsg}</div>}

          <button type="submit" className="submit-btn">
            Add User
          </button>
        </form>

        {popup.visible && (
          <div className="popup-overlay">
            <div className="popup">
              <p>
                Do you want to add "{popup.value}" as a new{" "}
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

        <style>{`
          .autocomplete { position: relative; display: block; margin-bottom: 1.5rem; }
          .autocomplete input { width: 100%; padding: 8px; box-sizing: border-box; border-radius: 6px; border: 1px solid #ccc; font-size: 1rem; }
          .suggestions { position: absolute; top: 100%; left: 0; right: 0; border: 1px solid #ccc; border-top: none; background: white; list-style: none; margin: 0; padding: 0; max-height: 150px; overflow-y: auto; z-index: 1000; }
          .suggestions li { padding: 8px; cursor: pointer; }
          .suggestions li:hover { background: #f0f0f0; }
          label { position: relative; font-weight: 500; display: block; margin-bottom: 0.5rem; }

          

          .popup-overlay { position: fixed; top:0; left:0; right:0; bottom:0; background: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center; z-index: 2000; animation: fadeIn 0.2s ease-in-out; }
          .popup { background:#fff; padding: 2rem 2.5rem; border-radius:12px; max-width:400px; width:90%; text-align:center; box-shadow:0 10px 25px rgba(0,0,0,0.2); animation: slideUp 0.25s ease-out; }
          .popup p { font-size:1.1rem; margin-bottom:1.5rem; color:#333; }
          .popup-buttons { display:flex; justify-content:space-between; gap:1rem; }
          .popup-buttons button { flex:1; padding:0.6rem 0; font-size:1rem; font-weight:500; border:none; border-radius:6px; cursor:pointer; transition: all 0.2s ease-in-out; }
          .popup-yes { background-color:#4caf50; color:#fff; }
          .popup-yes:hover { background-color:#43a047; }
          .popup-no { background-color:#f44336; color:#fff; }
          .popup-no:hover { background-color:#e53935; }
          @keyframes fadeIn { from {opacity:0;} to {opacity:1;} }
          @keyframes slideUp { from {transform:translateY(20px); opacity:0;} to {transform:translateY(0); opacity:1;} }
        `}</style>
      </div>
    </div>
  );
}
