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

    console.log("Email to replace:", email);
    console.log("Replace with user:", selectedUser);
    console.log("Uploaded file:", file);

    alert(
      "User replaced successfully! MyComplianceView will be notified via email."
    );
    navigate("/"); // redirect after submit
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
            Restore & Replace User
          </h2>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Replace Email */}
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

            {/* Select User */}
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

            {/* File Upload + Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                {/* File Upload */}
                <div style={{ flex: 1 }}>
                  <label className="file-label" style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>
                    Upload File
                  </label>
                  <label
                    className="file-upload-label"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "10px",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      cursor: "pointer",
                      backgroundColor: "#f9f9f9",
                      fontSize: "14px",
                    }}
                  >
                    <input
                      type="file"
                      onChange={(e) => setFile(e.target.files[0])}
                      required
                      style={{ display: "none" }}
                    />
                    <span className="custom-file-btn">{file ? file.name : "Choose File"}</span>
                  </label>
                </div>

                {/* Buttons */}
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="submit"
                    disabled={!consentChecked}
                    style={{
                      padding: "10px 20px",
                      backgroundColor: consentChecked ? "#280b81d2" : "#a5a7d6ff",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      cursor: consentChecked ? "pointer" : "not-allowed",
                      fontWeight: "bold",
                    }}
                  >
                    Replace
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/restore_user")}
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#1d096dff",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    Restore
                  </button>
                </div>
              </div>

              {/* Consent Checkbox */}
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

              {/* Note */}
              <p style={{ fontStyle: "italic", color: "#555", fontSize: "13px" }}>
                Note: When a user is replaced, MyComplianceView will be notified via email.
              </p>
            </div>
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
                  I am solely responsible for any loss of data. I am replacing this
                  user myself and it is my duty to check if all the data is present.
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
