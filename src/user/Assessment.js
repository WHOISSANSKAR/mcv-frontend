// Assessment.jsx
import React, { useState } from "react";
import UserSidebar from "./UserSidebar";
import UserHeader from "./UserHeader";
import "./Dashboard.css";

export default function Assessment() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newYear, setNewYear] = useState(new Date().getFullYear());
  const [file, setFile] = useState(null);
  const [rows, setRows] = useState([
    {
      id: 1,
      year: "2025",
      file: "sample.pdf",
      status: "Pending",
    },
  ]);

  const assessmentName = localStorage.getItem("currentAssessment") || "Assessment";

  const handleAddRow = () => {
    if (!newYear || !file) return alert("Please select year and choose a file");
    const newRow = {
      id: rows.length + 1,
      year: newYear,
      file: file.name,
      status: "Pending",
    };
    setRows([...rows, newRow]);
    setNewYear(new Date().getFullYear());
    setFile(null);
    setShowForm(false);
  };

  const handleDelete = (id) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleExportCSV = () => {
    const csvRows = [
      ["Assessment id", "Year", "File", "Status"],
      ...rows.map((row) => [row.id, row.year, row.file, row.status]),
    ];
    const csvContent =
      "data:text/csv;charset=utf-8," +
      csvRows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${assessmentName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 20 }, (_, i) => currentYear - i);

  return (
    <div className="general_">
      <UserSidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <UserHeader menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className="headSection">
        <div className="compliance-score">{assessmentName}</div>
        <div className="rightGroup">
          <div className="buttonGroup">
            <button
              className="action-btn primary"
              onClick={handleExportCSV}
            >
              Export
            </button>
            <button
              className="action-btn primary"
              onClick={() => setShowForm(true)}
            >
              + Add Row
            </button>
          </div>
        </div>
      </div>

      <table className="data-table" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Assessment id</th>
            <th>Year</th>
            <th>File</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.year}</td>
              <td>
                <a href={`/${row.file}`} target="_blank" rel="noopener noreferrer">
                  {row.file}
                </a>
              </td>
              <td>{row.status}</td>
              <td>
                <button
                  className="action-btn"
                  style={{ backgroundColor: "#ff4d4f", color: "#fff" }}
                  onClick={() => handleDelete(row.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Row Modal */}
      {showForm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "1.5rem",
              borderRadius: "8px",
              width: "320px",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <h3>Add New Row</h3>

            {/* Year Input as Scroll */}
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                fontWeight: 500,
              }}
            >
              Year
              <select
                value={newYear}
                onChange={(e) => setNewYear(e.target.value)}
                style={{
                  padding: "8px",
                  marginTop: "5px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                }}
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </label>

            {/* File Upload */}
            <div className="file-submit-row">
              <div className="file-wrapper">
                <label className="file-label">Upload File</label>
                <label className="file-upload-label">
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    required
                  />
                  <span className="custom-file-btn">
                    {file ? file.name : "Choose File"}
                  </span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                style={{ marginRight: "5px" }}
                className="action-btn primary"
                onClick={handleAddRow}
              >
                Upload
              </button>
              <button
                className="action-btn secondary"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
