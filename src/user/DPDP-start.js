// PDPDActStart.jsx
import React, { useState } from "react";
import UserHeader from "./UserHeader";
import UserSidebar from "./UserSidebar";

export default function DPDPstart() {
  const [menuOpen, setMenuOpen] = useState(false);

  const assessments = Array.from({ length: 10 }, (_, i) => `assessment${i + 1}`);

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", fontFamily: "'Inter', sans-serif" }}>
      <UserSidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <UserHeader menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <main
          style={{
            flex: 1,
            padding: "1rem 2rem",
            overflowY: "auto",
          }}
        >
          <h1 style={{ marginBottom: "1.5rem" }}>Assessment Score</h1>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", borderBottom: "2px solid #ccc", padding: "0.5rem" }}>Assessment</th>
                <th style={{ textAlign: "left", borderBottom: "2px solid #ccc", padding: "0.5rem" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {assessments.map((a, idx) => (
                <tr key={idx}>
                  <td style={{ borderBottom: "1px solid #eee", padding: "0.5rem" }}>{a}</td>
                  <td style={{ borderBottom: "1px solid #eee", padding: "0.5rem" }}>
                    <button
                      style={{
                        padding: "0.4rem 0.8rem",
                        backgroundColor: "#4caf50",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                      onClick={() => alert(`Starting ${a}`)}
                    >
                      Start
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
}
