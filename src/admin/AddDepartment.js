import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useNavigate, useLocation } from "react-router-dom";
import "./Dashboard.css";

export default function AddDepartment() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [departmentName, setDepartmentName] = useState(() => {
    const saved = localStorage.getItem("customDept") || "";
    if (saved) localStorage.removeItem("customDept");
    return saved;
  });

  const [businessUnit, setBusinessUnit] = useState("");
  const [businessUnitId, setBusinessUnitId] = useState("");
  const [businessUnitLocked, setBusinessUnitLocked] = useState(false);

  const [businessUnits, setBusinessUnits] = useState([]);
  const [filteredBusinessUnits, setFilteredBusinessUnits] = useState([]);
  const [unitFocused, setUnitFocused] = useState(false);

  const [popup, setPopup] = useState({ visible: false, value: "" });
  const [loading, setLoading] = useState(false);

  // ✅ Unified error/success states like AddUser
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [errorVisible, setErrorVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user.usrlst_id;

  const queryParams = new URLSearchParams(location.search);
  const buIdFromURL = queryParams.get("businessUnitId") || "";

  // ✅ Fetch Business Units
  useEffect(() => {
    if (!userId) {
      navigate("/", { replace: true });
      return;
    }

    fetch(`http://localhost:5000/user/business_unit/all?user_id=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) return;

        setBusinessUnits(data);
        setFilteredBusinessUnits(data);

        const fromAddBU = localStorage.getItem("fromAddBU") === "true";

        if (fromAddBU && data.length > 0) {
          const topBU = data[0];

          setBusinessUnit(topBU.business_unit_name);
          setBusinessUnitId(topBU.usrbu_id);
          return;
        }

        if (buIdFromURL) {
          const chosen = data.find((u) => u.usrbu_id == buIdFromURL);
          if (chosen) {
            setBusinessUnit(chosen.business_unit_name);
            setBusinessUnitId(chosen.usrbu_id);
            setBusinessUnitLocked(true);
          }
        }
      })
      .catch((err) => console.error("Error fetching BU:", err));
  }, []);

  // Clear localStorage flags after BU autofill
  useEffect(() => {
    if (businessUnit && localStorage.getItem("fromAddBU") === "true") {
      localStorage.removeItem("fromAddBU");
      localStorage.removeItem("customBU");
      localStorage.removeItem("selectedBusinessUnitId");
      localStorage.removeItem("BUpage");
    }
  }, [businessUnit]);

  const handleBUInput = (e) => {
    if (businessUnitLocked) return;

    const val = e.target.value;
    setBusinessUnit(val);
    setBusinessUnitId("");

    setFilteredBusinessUnits(
      businessUnits.filter((b) =>
        b.business_unit_name.toLowerCase().includes(val.toLowerCase())
      )
    );
  };

  const handleSuggestionClick = (unit) => {
    if (businessUnitLocked) return;

    setBusinessUnit(unit.business_unit_name);
    setBusinessUnitId(unit.usrbu_id);
    setFilteredBusinessUnits([]);
  };

  const handleCustomBU = () => {
    if (businessUnitLocked) return;
    if (!businessUnit.trim()) return;

    const exists = businessUnits.some(
      (b) => b.business_unit_name.toLowerCase() === businessUnit.toLowerCase()
    );

    if (!exists && businessUnitId === "") {
      setPopup({ visible: true, value: businessUnit });
    }
  };

  const handlePopupYes = () => {
    localStorage.setItem("customBU", popup.value);
    localStorage.setItem("fromAddBU", "true");
    localStorage.setItem("page", "3");
    localStorage.setItem("BUpage", "1");
    navigate("/add-bu");
  };

  const handlePopupNo = () => {
    setBusinessUnit("");
    setBusinessUnitId("");
    setPopup({ visible: false, value: "" });
  };

  // ✅ Submit with unified error/success
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMsg("");

    if (!businessUnitId) {
      setErrors({ api: "Please select a Business Unit from the list." });
      return;
    }
    if (!departmentName.trim()) {
      setErrors({ api: "Department name cannot be blank." });
      return;
    }

    setLoading(true);

    const payload = {
      department_name: departmentName.trim(),
      business_unit_id: Number(businessUnitId),
      user_id: Number(userId),
      user_group_id: Number(user.usrlst_user_group_id),
    };

    try {
      const response = await fetch("http://localhost:5000/user/departments/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ api: data.error || "Failed to add department" });
      } else {
        setSuccessMsg("✅ Department added successfully!");
        setDepartmentName("");

        const page = localStorage.getItem("page") || "";
        if (page === "2" || page === "3") {
          localStorage.setItem("fromAddDept", "true");
        }

        setTimeout(() => {
          if (page === "1") navigate("/department");
          else if (page === "2") navigate("/add-user");
          else if (page === "3") navigate("/edit-user");
          else navigate("/dashboard");

          localStorage.removeItem("page");
          localStorage.removeItem("customDept");
        }, 900);
      }
    } catch (err) {
      console.error(err);
      setErrors({ api: "Failed to add department. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Auto-hide error messages
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

  // ✅ Auto-hide success messages
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
    <div className="add-department">
      <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className="form-container">
        <h2>Add Department</h2>

        {/* ✅ Unified success/error messages */}
        <div className="messages-top" style={{ margin: "0 auto 1rem auto", width: "50%" }}>
          {errors.api && (
            <div className={`login-error ${!errorVisible ? "fade-out" : ""}`}>
              {errors.api}
            </div>
          )}
          {successMsg && (
            <div className={`success-msg ${!successVisible ? "fade-out" : ""}`}>
              {successMsg}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="add-user-form">
          {/* Business Unit */}
          <label className="autocomplete">
            Business Unit
            <input
              type="text"
              value={businessUnit}
              disabled={businessUnitLocked}
              onChange={handleBUInput}
              onFocus={() => !businessUnitLocked && setUnitFocused(true)}
              onBlur={() => {
                setUnitFocused(false);
                handleCustomBU();
              }}
              autoComplete="off"
            />
            {!businessUnitLocked && unitFocused && (
              <ul className="suggestions">
                {filteredBusinessUnits.length > 0 ? (
                  filteredBusinessUnits.map((unit) => (
                    <li
                      key={unit.usrbu_id}
                      onMouseDown={() => handleSuggestionClick(unit)}
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

          {/* Department Name */}
          <label className="autocomplete">
            Department Name
            <input
              type="text"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              autoComplete="off"
              required
            />
          </label>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Saving..." : "Add Department"}
          </button>
        </form>

        {popup.visible && !businessUnitLocked && (
          <div className="popup-overlay">
            <div className="popup">
              <p>Do you want to add "{popup.value}" as a new Business Unit?</p>
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
