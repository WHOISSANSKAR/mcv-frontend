import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserSidebar from "./UserSidebar";
import UserHeader from "./UserHeader";
import "./Dashboard.css";

export default function AddStatutory() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [country, setCountry] = useState("India");
  const [act, setAct] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleFilter = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!country) newErrors.country = "Country is required";
    if (!act) newErrors.act = "Act is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Get the selected option’s display text (e.g. "EPF ACT")
      const selectedActText = e.target.act.options[e.target.act.selectedIndex].text;

      // Save exact name to localStorage
      localStorage.setItem("selectedAct", selectedActText);

      // Redirect to statutory_info
      setTimeout(() => {
        navigate("/statutory_info");
      }, 700);
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
                <option value="factories">FACTORIES ACT</option>
                <option value="epf">EPF ACT</option>
                <option value="esi">ESI ACT</option>
                <option value="contract_labour">CONTRACT LABOUR ACT</option>
                <option value="wages">PAYMENT OF WAGES ACT</option>
                <option value="bonus">PAYMENT OF BONUS ACT</option>
                <option value="gst">GST ACT</option>
                <option value="income_tax">INCOME TAX ACT</option>
                <option value="companies">COMPANIES ACT</option>
                <option value="fema">FEMA ACT</option>
                <option value="employment_exchange">EMPLOYMENT EXCHANGE ACT</option>
                <option value="maternity">MATERNITY BENEFIT ACT</option>
              </select>
              {errors.act && <span className="error">{errors.act}</span>}
            </label>

            <label>
              <button type="submit" className="submit-btn">
                Filter
              </button>
            </label>

            <label>
              <a
                href="/NotFound"
                style={{
                  color: "red",
                  textDecoration: "none",
                  paddingTop: "10px",
                }}
              >
                Compliance not found?
              </a>
            </label>
          </form>
        </main>
      </div>
    </div>
  );
}
