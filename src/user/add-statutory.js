import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserSidebar from "./UserSidebar";
import UserHeader from "./UserHeader";
import { apiFetch } from "../api_call"; // ✅ centralized API
import "./Dashboard.css";

export default function AddStatutory() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [countries, setCountries] = useState([]);
  const [acts, setActs] = useState([]);

  const [country, setCountry] = useState("");
  const [act, setAct] = useState("");

  const [errors, setErrors] = useState({});
  const [errorVisible, setErrorVisible] = useState(false);
  const navigate = useNavigate();

  // / ERROR fade-out effects
  useEffect(() => {
    if (errors.api) {
      setErrorVisible(true);
      const timer = setTimeout(() => setErrorVisible(false), 4500);
      const removeTimer = setTimeout(() => setErrors({}), 1000);
      return () => {
        clearTimeout(timer);
        clearTimeout(removeTimer);
      };
    }
  }, [errors.api]);

  // Fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const data = await apiFetch("/compliance/countries");
        if (data.countries && data.countries.length > 0) {
          setCountries(data.countries);
          setCountry(data.countries[0] || "");
        } else {
          setCountries([]);
        }
      } catch (err) {
        console.error(err);
        setCountries([]);
      }
    };
    fetchCountries();
  }, []);

  // Fetch acts after country change
  useEffect(() => {
    if (!country) {
      setActs([]);
      return;
    }

    const fetchActs = async () => {
      try {
        const data = await apiFetch(`/compliance/acts?country=${country}`);
        if (data.acts && data.acts.length > 0) {
          setActs(data.acts);
          setAct("");
        } else {
          setActs([]);
        }
      } catch (err) {
        console.error(err);
        setActs([]);
      }
    };

    fetchActs();
  }, [country]);

  const handleFilter = (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = {};
    if (!country) newErrors.api = "Country is required";
    if (!act) newErrors.api = "Act is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    localStorage.setItem("selectedCountry", country);
    localStorage.setItem("selectedAct", act);

    setTimeout(() => {
      navigate("/statutory_info");
    }, 800);
  };

  return (
    <div className="add-statutory">
      <UserSidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <UserHeader menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

        <main style={{ flex: 1, padding: "1rem 2rem", overflowY: "auto" }}>
          <h2>Add Statutory</h2>

          {/* SAME MESSAGE UI AS AddUser */}
         <div
  className="messages-top"
  style={{
    margin: "0 auto 1rem auto",
    width: "50%",
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
  }}
>
  {errors.api && (
    <div className={`login-error ${!errorVisible ? "fade-out" : ""}`}>
      {errors.api}
    </div>
  )}
</div>


          <form onSubmit={handleFilter} className="add-user-form">
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
            </label>

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
            </label>

            <label>
              <button type="submit" className="submit-btn">
                Filter
              </button>
            </label>

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
