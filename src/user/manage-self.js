import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserSidebar from "./UserSidebar";
import UserHeader from "./UserHeader";
import "./Dashboard.css";

export default function ManageSelf() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [compliances, setCompliances] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch compliance data here (replace with your API)
    const mockData = [
      {
        comp_id: "REGSTFACTORIES01",
        compliance: "REFER TO STATE RULES 1",
        start_date: "01-04-2025",
        end_date: "31-03-2026",
      },
      // Add more items if needed
    ];
    setCompliances(mockData);
  }, []);

  return (
    <div className="manage-self">
      <UserSidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <UserHeader menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <main style={{ flex: 1, padding: "1rem 2rem", overflowY: "auto" }}>
          <header>
            <h2>Manage Compliance</h2>
          </header>

          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Comp_ID</th>
                  <th>Compliance</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {compliances.map((item, index) => (
                  <tr key={index}>
                    <td className="bold" data-label="Comp_ID">
                      {item.comp_id}
                    </td>
                    <td data-label="Compliance">{item.compliance}</td>
                    <td data-label="Start Date">{item.start_date}</td>
                    <td data-label="End Date">{item.end_date}</td>
                    <td data-label="Action">
                      <button
                        className="edit-btn"
                        onClick={() => navigate("/edit-compliance")}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
