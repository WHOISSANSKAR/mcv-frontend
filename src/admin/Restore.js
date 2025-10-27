// RestoreReplace.js
import React, { useState,useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function RestoreReplace() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email to replace:", email);
    console.log("Replace with user:", selectedUser);
    console.log("Uploaded file:", file);
    // Call API here to handle restore/replace
    navigate("/"); // redirect after submit
  };
useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!isLoggedIn || user.usrlst_role?.toLowerCase() !== "admin") {
      navigate("/", { replace: true }); // redirect non-admins to login/home
    }
  }, [navigate]);
  return (
    <div className="Restore">
      <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className="restore-fullscreen">
  <h2 className="form-heading">Restore And Replace</h2>
  <form className="restore-form" onSubmit={handleSubmit}>
    {/* Replace Email */}
    <label>
      Replace
      <input
        type="email"
        placeholder="Email ID"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
    </label>

    {/* Select User */}
    <label>
      With
      <select
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.target.value)}
        required
      >
        <option value="">Select User</option>
        <option value="user1">User 1</option>
        <option value="user2">User 2</option>
      </select>
    </label>

    {/* File Upload + Submit Row */}
    <div className="file-submit-row">
      <div className="file-wrapper">
        <label className="file-label">Upload File</label>
        <label className="file-upload-label">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
          <span className="custom-file-btn">{file ? file.name : "Choose File"}</span>
        </label>
      </div>

      <button type="submit" className="submit-btn">
        Restore
      </button>
    </div>
  </form>
</div>

    </div>
  );
}
