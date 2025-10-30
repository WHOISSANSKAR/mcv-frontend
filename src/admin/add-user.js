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

  // Prevent spaces & trim all inputs dynamically
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Prevent spaces-only input
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
    
    // ✅ Added line: store page=2 before navigating
    localStorage.setItem("page", "2");
    
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
    setErrors({});
    setPopup({ visible: false, type: "", value: "" });

    // Trim all fields before validation
    const trimmedData = {};
    Object.keys(formData).forEach((key) => {
      const value = formData[key];
      trimmedData[key] = value != null && typeof value === "string" ? value.trim() : value;
    });

    // Validation: ensure no blank or spaces-only
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
      if (!trimmedData[field] || trimmedData[field].length === 0) {
        setErrors({ api: "All fields are required and cannot be blank or contain only spaces." });
        return;
      }
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

  // Auto fade messages
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
          {errors.api && (
            <div className={`login-error ${!errorVisible ? "fade-out" : ""}`}>{errors.api}</div>
          )}
          {successMsg && (
            <div className={`success-msg ${!successVisible ? "fade-out" : ""}`}>{successMsg}</div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="add-user-form">
          <label>
            Company Name
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
            />
          </label>

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
            E-Mail Address
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
              onChange={(e) => {
                const onlyDigits = e.target.value.replace(/\D/g, "");
                setFormData((prev) => ({ ...prev, contact: onlyDigits }));
              }}
            />
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

          <p className="subheading">
            If not complied in stipulated period, alert will be sent 2 days before the action date.
          </p>

          <label>
            Escalation Email
            <input
              type="email"
              name="escalationEmail"
              value={formData.escalationEmail}
              onChange={handleInputChange}
            />
          </label>

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
      </div>
    </div>
  );
}
