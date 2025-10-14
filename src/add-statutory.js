// AddStatutory.jsx
import React, { useState } from "react";
import UserSidebar from "./UserSidebar";
import UserHeader from "./UserHeader";
import "./Dashboard.css";

export default function AddStatutory() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [country, setCountry] = useState("India");
  const [act, setAct] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errors, setErrors] = useState({});

  const handleFilter = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!country) newErrors.country = "Country is required";
    if (!act) newErrors.act = "Act is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setSuccessMsg("✅ Filter applied successfully!");
      console.log("Filter clicked with:", { country, act });
      // Add filter logic here
    } else {
      setSuccessMsg("");
    }
  };

  return (
    <div className="add-statutory">
      <UserSidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <UserHeader menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <main style={{ flex: 1, padding: "1rem 2rem", overflowY: "auto" }}>
          <h2>Add Statutory</h2>
          <form onSubmit={handleFilter} className="add-user-form">
            <label>
              Select Country
              <select
                name="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="India">India</option>
                {/* Add more countries if needed */}
              </select>
              {errors.country && <span className="error">{errors.country}</span>}
            </label>

            <label>
              Select Act
              <select
                name="act"
                value={act}
                onChange={(e) => setAct(e.target.value)}
              >
                <option value="">Select</option>
                <option value="Act 1">Act 1</option>
                <option value="Act 2">Act 2</option>
                <option value="Act 3">Act 3</option>
              </select>
              {errors.act && <span className="error">{errors.act}</span>}
            </label>

            {successMsg && <span className="success-msg">{successMsg}</span>}

            <label>
              <button type="submit" className="submit-btn">
                Filter
              </button>
            </label>

            <label>
              <a href="/NotFound" style={{ color: "red", textDecoration: "none" , paddingTop: "10px"}}>
                Compliance not found?
              </a>
            </label>
          </form>
        </main>
      </div>
    </div>
  );
}
