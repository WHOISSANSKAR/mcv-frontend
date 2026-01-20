// RestoreReplace.js
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useNavigate } from "react-router-dom";

export default function RestoreReplace() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [file, setFile] = useState(null);
  const [consentChecked, setConsentChecked] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!consentChecked) {
      alert("You must accept the consent to proceed.");
      return;
    }

    alert("User replaced successfully! MyComplianceView will be notified.");
    navigate("/");
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!isLoggedIn || user.usrlst_role?.toLowerCase() !== "admin") {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div style={{ flex: 1 }}>
        <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

        <div
          style={{
            maxWidth: "600px",
            margin: "40px auto",
            padding: "30px",
            backgroundColor: "#fff",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            borderRadius: "10px",
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: "25px", color: "#333" }}>
            Replace User
          </h2>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            
            {/* Replace */}
            <label style={{ display: "flex", flexDirection: "column", fontWeight: "bold" }}>
              Replace
              <input
                type="email"
                placeholder="Email ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  marginTop: "5px",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                }}
              />
            </label>

            {/* With */}
            <label style={{ display: "flex", flexDirection: "column", fontWeight: "bold" }}>
              With
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                required
                style={{
                  marginTop: "5px",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                }}
              >
                <option value="">Select User</option>
                <option value="user1">User 1</option>
                <option value="user2">User 2</option>
              </select>
            </label>

            {/* Upload Block */}
            <label
              className="file-label"
              style={{
                display: "block",
                fontWeight: "bold",
                marginBottom: "5px",
                width: "100% !important",
              }}
            >
              Upload File
            </label>

            <div
              style={{
                width: "100% !important",
                backgroundColor: "#fff !important",
                border: "0 !important",
                margin: "0 !important",
                padding: "0 !important",
                display: "flex !important",
                justifyContent: "center !important",
                alignItems: "center !important",
              }}
            >
              <label
                className="file-upload-label"
                style={{
                  display: "flex !important",
                  alignItems: "center !important",
                  justifyContent: "center !important",
                  padding: "10px !important",
                  border: "1px solid #ccc !important",
                  borderRadius: "5px !important",
                  cursor: "pointer !important",
                  backgroundColor: "#f9f9f9 !important",
                  fontSize: "14px !important",
                  width: "100% !important",
                  textAlign: "center !important",
                  marginLeft: "0 !important",
                  boxSizing: "border-box !important",
                }}
              >
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  required
                  style={{ display: "none !important" }}
                />
                <span className="custom-file-btn">
                  {file ? file.name : "Choose File"}
                </span>
              </label>
            </div>

            {/* Consent */}
            <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px" }}>
              <input
                type="checkbox"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
              />
              Accept the{" "}
              <span
                style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
                onClick={() => setShowModal(true)}
              >
                consent
              </span>
            </label>

            {/* Replace Button */}
            <button
              type="submit"
              disabled={!consentChecked}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: consentChecked ? "#280b81" : "#a5a7d6",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: consentChecked ? "pointer" : "not-allowed",
                fontWeight: "bold",
              }}
            >
              Replace User
            </button>

            {/* Restore Link - Updated Hover */}
            <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
              <span
                onClick={() => navigate("/restore_user")}
                style={{
                  color: "#1d096d",
                  textDecoration: "underline",
                  cursor: "pointer",
                  fontWeight: "bold",
                  marginTop: "5px",
                  transition: "all 0.2s ease-in-out",
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = "#4a32a8";
                  e.target.style.transform = "translateX(4px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = "#1d096d";
                  e.target.style.transform = "translateX(0)";
                }}
              >
                Restore User →
              </span>
            </div>

            <p style={{ fontStyle: "italic", color: "#555", fontSize: "13px" }}>
              Note: When a user is replaced, MyComplianceView will be notified via email.
            </p>
          </form>

          {/* Consent Modal */}
          {showModal && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
              }}
            >
              <div
                style={{
                  backgroundColor: "#fff",
                  padding: "20px",
                  borderRadius: "10px",
                  maxWidth: "400px",
                  textAlign: "center",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                }}
              >
                <p style={{ marginBottom: "20px", fontSize: "14px", color: "#333" }}>
                  I am solely responsible for any loss of data and must ensure the replacement is correct.
                </p>

                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#2196F3",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
