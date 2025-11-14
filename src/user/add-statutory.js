import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserSidebar from "./UserSidebar";
import UserHeader from "./UserHeader";
import "./Dashboard.css";

export default function AddStatutory() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [countries, setCountries] = useState([]);
  const [acts, setActs] = useState([]);

  const [country, setCountry] = useState("");
  const [act, setAct] = useState("");

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // ✅ Fetch all countries from backend
  useEffect(() => {
    fetch("http://localhost:5000/compliance/countries")
      .then((res) => res.json())
      .then((data) => {
        if (data.countries && data.countries.length > 0) {
          setCountries(data.countries);
          setCountry(data.countries[0] || "");
        } else {
          setCountries([]); // no country found
        }
      })
      .catch((err) => {
        console.error(err);
        setCountries([]); // error also shows no country found
      });
  }, []);

  // ✅ Fetch acts dynamically when country changes
  useEffect(() => {
    if (!country) {
      setActs([]);
      return;
    }

    fetch(`http://localhost:5000/compliance/acts?country=${country}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.acts && data.acts.length > 0) {
          setActs(data.acts);
          setAct("");
        } else {
          setActs([]); // no act found
        }
      })
      .catch((err) => {
        console.error(err);
        setActs([]); // error also shows no act found
      });
  }, [country]);

  // ✅ Handle submit → save selected values + redirect
  const handleFilter = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!country) newErrors.country = "Country is required";
    if (!act) newErrors.act = "Act is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    localStorage.setItem("selectedCountry", country);
    localStorage.setItem("selectedAct", act);

    navigate("/statutory_info");
  };

  return (
    <div className="add-statutory">
      <UserSidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <UserHeader menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

        <main style={{ flex: 1, padding: "1rem 2rem", overflowY: "auto" }}>
          <h2>Add Statutory</h2>

          <form onSubmit={handleFilter} className="add-user-form">

            {/* ✅ Country Dropdown */}
            <label>
              Select Country
              <select
                name="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                {countries.length === 0 ? (
                  <option value="">No country found</option>
                ) : (
                  countries.map((c, i) => (
                    <option key={i} value={c}>
                      {c}
                    </option>
                  ))
                )}
              </select>
              {errors.country && <span className="error">{errors.country}</span>}
            </label>

            {/* ✅ Acts Dropdown */}
            <label>
              Select Act
              <select
                name="act"
                value={act}
                onChange={(e) => setAct(e.target.value)}
              >
                {acts.length === 0 ? (
                  <option value="">No act found</option>
                ) : (
                  <>
                    <option value="">Select</option>
                    {acts.map((a, i) => (
                      <option key={i} value={a}>
                        {a}
                      </option>
                    ))}
                  </>
                )}
              </select>
              {errors.act && <span className="error">{errors.act}</span>}
            </label>

            {/* ✅ Filter Button */}
            <label>
              <button type="submit" className="submit-btn">
                Filter
              </button>
            </label>

            {/* ✅ Not found link */}
            <label>
              <a
                href="/NotFound"
                style={{ color: "red", textDecoration: "none", paddingTop: "10px" }}
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
