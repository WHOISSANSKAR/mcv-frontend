// ManageSelf.jsx
import React, { useState, useEffect } from "react";
import UserSidebar from "./UserSidebar";
import UserHeader from "./UserHeader";
import "./Dashboard.css";

export default function ManageSelf() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [compliances, setCompliances] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const mockData = [
      {
        compliance: "Test",
        start_date: "01-07-2025",
        action_date: "02-07-2025",
        end_date: "16-07-2025",
        reminder: "1 Days",
        status: "Approved",
        approver_email: "kunalmanocha@pseudoteam.com",
      },
    ];
    setCompliances(mockData);
  }, []);

  return (
    <div className="edit-compliance">
      <UserSidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <UserHeader menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

        <main style={{ flex: 1, padding: "1rem 2rem", overflowY: "auto" }}>
          <header>
            <h2>Edit Compliance</h2>
          </header>

          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>COMPLIANCE</th>
                  <th>START DATE</th>
                  <th>ACTION DATE</th>
                  <th>END DATE</th>
                  <th>REM. BEFORE</th>
                  <th>STATUS</th>
                  <th>APPROVER’S EMAIL</th>
                  <th>ATTACHMENT</th>
                  <th>ACTION</th>
                  <th>EDIT</th>
                </tr>
              </thead>
              <tbody>
                {compliances.map((item, index) => (
                  <tr key={index}>
                    <td>{item.compliance}</td>
                    <td>{item.start_date}</td>
                    <td>{item.action_date}</td>
                    <td>{item.end_date}</td>
                    <td>{item.reminder}</td>
                    <td style={{ color: "green", fontWeight: "500" }}>
                      {item.status}
                    </td>
                   <td>{item.approver_email}</td>

                    <td>
                      <div className="file-wrapper">
                        
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
                    </td>
                    <td>
                      <button className="action-btn primary">✔</button>
                    </td>
                    <td>
                      <button className="action-btn edit">✎</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ textAlign: "center", marginTop: "25px" }}>
           <button type="submit" className="submit-btn" style={{ width: "95%" }}>
  Delete All
</button>

          </div>
        </main>
      </div>
    </div>
  );
}
