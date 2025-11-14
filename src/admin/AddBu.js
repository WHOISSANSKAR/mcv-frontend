import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function AddBU() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [buName, setBuName] = useState(() => {
    const saved = localStorage.getItem("customBU") || "";
    if (saved) localStorage.removeItem("customBU");
    return saved;
  });
  const [loading, setLoading] = useState(false);

  // ✅ Success/Error states like AddUser
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [errorVisible, setErrorVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccessMsg("");

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user.usrlst_id) {
        setErrors({ api: "User not found. Please login again." });
        setLoading(false);
        return;
      }

      const payload = {
        business_unit_name: buName.trim(),
        user_id: user.usrlst_id,
      };

      if (!payload.business_unit_name) {
        setErrors({ api: "Business Unit name cannot be blank." });
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:5000/user/business_unit/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ api: data.error || "Failed to add Business Unit" });
      } else {
        setSuccessMsg("✅ Business Unit added successfully!");
        setBuName("");

        const page = String(localStorage.getItem("page") || "");

        if (page === "2") {
          localStorage.setItem("fromAddBU", "true");
        }

        // ✅ Redirect after success
        setTimeout(() => {
          const buPage = localStorage.getItem("BUpage");

          if (buPage === "1") navigate("/add-department");
          else if (buPage === "2") navigate("/add-user");
          else if (buPage === "3") navigate("/edit-user");
          else {
            if (page === "1") navigate("/BusinessUnit");
            else if (page === "2") navigate("/add-user");
            else if (page === "3") navigate("/edit-user");
            else navigate("/dashboard");
          }

          localStorage.removeItem("page");
          localStorage.removeItem("BUpage");
        }, 1000);
      }
    } catch (err) {
      console.error(err);
      setErrors({ api: "Failed to add Business Unit. Please try again." });
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

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!isLoggedIn || user.usrlst_role?.toLowerCase() !== "admin") {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="add-bu">
      <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className="form-container">
        <h2>Add Business Unit</h2>

        {/* ✅ Unified success/error message div */}
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
          <label>
            Business Unit Name
            <input
              type="text"
              value={buName}
              onChange={(e) => setBuName(e.target.value)}
              required
            />
          </label>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Saving..." : "Add Business Unit"}
          </button>
        </form>
      </div>
    </div>
  );
}
