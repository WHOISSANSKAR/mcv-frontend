import React, { useState, useEffect } from "react";
import UserSidebar from "./UserSidebar";
import UserHeader from "./UserHeader";
import "./Dashboard.css";

export default function NotFound() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    act: "",
    complianceName: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [errorVisible, setErrorVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setSuccessMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.act) newErrors.act = "Act is required";
    if (!formData.complianceName)
      newErrors.complianceName = "Compliance Name is required";
    if (!formData.description)
      newErrors.description = "Description is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors({});
      setSuccessMsg("");

      const response = await fetch("http://127.0.0.1:5000/form/submit_", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrors({ api: result.error || "Failed to submit form" });
        return;
      }

      setSuccessMsg("✅ " + result.message);
      setFormData({ act: "", complianceName: "", description: "" });
    } catch (error) {
      console.error("Submission error:", error);
      setErrors({ api: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  // Auto-hide error
  useEffect(() => {
    if (errors.api) {
      setErrorVisible(true);
      const timer = setTimeout(() => setErrorVisible(false), 4500);
      const clearTimer = setTimeout(() => setErrors({}), 5000);
      return () => {
        clearTimeout(timer);
        clearTimeout(clearTimer);
      };
    }
  }, [errors.api]);

  // Auto-hide success
  useEffect(() => {
    if (successMsg) {
      setSuccessVisible(true);
      const timer = setTimeout(() => setSuccessVisible(false), 4500);
      const clearTimer = setTimeout(() => setSuccessMsg(""), 5000);
      return () => {
        clearTimeout(timer);
        clearTimeout(clearTimer);
      };
    }
  }, [successMsg]);

  return (
    <div className="not-found-page">
      <UserSidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <UserHeader menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <main style={{ flex: 1, padding: "1rem 2rem", overflowY: "auto" }}>
          <h2>Add Compliance</h2>

          {/* Messages */}
          <div
            className="messages-top"
            style={{ margin: "0 auto 1rem auto", width: "50%" }}
          >
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

          <form className="add-user-form" onSubmit={handleSubmit}>
            <label>
              Act
              <input
                type="text"
                name="act"
                value={formData.act}
                onChange={handleInputChange}
              />
              {errors.act && <span className="error">{errors.act}</span>}
            </label>

            <label>
              Compliance Name
              <input
                type="text"
                name="complianceName"
                value={formData.complianceName}
                onChange={handleInputChange}
              />
              {errors.complianceName && (
                <span className="error">{errors.complianceName}</span>
              )}
            </label>

            <label className="full-width">
              Description
              <textarea
                name="description"
                rows="5"
                value={formData.description}
                onChange={handleInputChange}
              />
              {errors.description && (
                <span className="error">{errors.description}</span>
              )}
            </label>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
