import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserHeader from "./UserHeader";
import UserSidebar from "./UserSidebar";

const API_BASE = "http://localhost:5000";

export default function DPDPtest() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [assessments, setAssessments] = useState([]);
  const navigate = useNavigate();

  /* ================= FETCH ASSESSMENTS ================= */
  useEffect(() => {
    fetch(`${API_BASE}/assessment/list`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAssessments(data);
        }
      })
      .catch((err) => {
        console.error("Assessment API Error:", err);
      });
  }, []);

  /* ================= DOWNLOAD ================= */
  const handleDownload = (assessmentName) => {
    const link = document.createElement("a");
    link.href = `${API_BASE}/assessment/download/${encodeURIComponent(
      assessmentName
    )}`;
    link.download = `${assessmentName}.csv`;
    link.click();

    localStorage.setItem("currentAssessment", assessmentName);
  };

  /* ================= UPLOAD ================= */
  const handleFileUpload = (event, assessmentName) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== "text/csv") {
      alert("Only CSV files are allowed");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    fetch(
      `${API_BASE}/assessment/upload/${encodeURIComponent(assessmentName)}`,
      {
        method: "POST",
        body: formData,
        credentials: "include",
      }
    )
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw data;
        alert(`Uploaded successfully! Score: ${data.score}%`);
      })
      .catch((err) => {
        alert(err.error || "Upload failed");
      });
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "Inter, sans-serif",
        background: "#f4f6f8",
      }}
    >
      <UserSidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <UserHeader menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

        <main style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
          <h1
            style={{
              marginBottom: "2rem",
              fontSize: "1.8rem",
              fontWeight: "700",
              color: "#222",
            }}
          >
            Assessments
          </h1>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: "20px",
            }}
          >
            {assessments.map((a, idx) => (
              <div
                key={idx}
                style={{
                  background: "#fff",
                  padding: "1.5rem",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.2rem",
                    marginBottom: "1rem",
                    fontWeight: "600",
                    color: "#333",
                  }}
                >
                  {a.dpdpas_assessment_name}
                </h3>

                <button
                  onClick={() =>
                    handleDownload(a.dpdpas_assessment_name)
                  }
                  style={{
                    padding: "0.6rem",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    background: "#1A1744",
                    color: "#fff",
                    fontWeight: "600",
                    marginBottom: "0.7rem",
                    fontSize: "16px",
                  }}
                >
                  Download
                </button>

                <label
                  style={{
                    padding: "0.6rem",
                    borderRadius: "8px",
                    cursor: "pointer",
                    background: "#4E0562",
                    color: "#fff",
                    textAlign: "center",
                    fontWeight: "600",
                  }}
                >
                  Upload
                  <input
                    type="file"
                    accept=".csv"
                    style={{ display: "none" }}
                    onChange={(e) =>
                      handleFileUpload(
                        e,
                        a.dpdpas_assessment_name
                      )
                    }
                  />
                </label>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
