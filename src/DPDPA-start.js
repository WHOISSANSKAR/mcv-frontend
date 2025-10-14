// DPDPAStart.jsx
import React, { useState } from "react";
import UserHeader from "./UserHeader";
import UserSidebar from "./UserSidebar";

export default function DPDPAStart() {
  const [menuOpen, setMenuOpen] = useState(false);

  // State for all radio inputs
  const [formData, setFormData] = useState({});

  const handleChange = (section, index, value) => {
    setFormData((prev) => ({
      ...prev,
      [`${section}${index}`]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("DPDPA Form Data:", formData);
    alert("Form submitted! Check console for data.");
  };

  const governanceAspects = [
    "Readiness of privacy by design policy",
    "Readiness of Risk Identification and Mitigation strategies",
    "Readiness of awareness process for employees (Wrt. Compliance Requirement)",
    "Readiness of embedded Privacy in Data Life Cycle",
    "Readiness of Process to conduct Data Protection Impact Assessment",
    "Readiness of Reporting and Analysis of DPIA",
    "Readiness of Process of Risk Mitigation using Technology and Safeguards",
    "Readiness of Process to Review Security Safeguards",
    "Readiness of process of Audit by Data Auditors",
    "Readiness of Grievance Redressal Mechanism",
    "Readiness of Breach Response Procedure",
    "Readiness and review of Insurance coverage of Data Breach, if any",
    "Readiness to Update Board Members for Impact Analysis",
    "Appointment of Data Protection Officer (According the Legal Requirement)",
  ];

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <UserSidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <UserHeader menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <main
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "1rem 2rem",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <h1>DPDPA Assessment</h1>
          <form
            className="form-grid"
            style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
            onSubmit={handleSubmit}
          >
            {/* Legal Scope */}
            <AssessmentSection
              title="Legal Scope"
              section="ls"
              aspects={[
                "Identification of personal data which is processed",
                "Identification of data processing activities exempted under the law.",
                "Identification of data processing activity which takes place in India",
                "Identification of Data Processing outside India where Indian citizen are involved.",
                "Identification of personal data which departments are processing",
                "Identification of Data Types such as ‘personal data’, ‘sensitive personal data’, ‘critical personal data’ and ‘non-personal data’.",
              ]}
              formData={formData}
              handleChange={handleChange}
            />

            {/* Governance */}
            <AssessmentSection
              title="Governance"
              section="g"
              aspects={governanceAspects}
              formData={formData}
              handleChange={handleChange}
            />

            {/* Processing */}
            <AssessmentSection
              title="Processing"
              section="p"
              aspects={[
                "Readiness of the Process to get Consent (According to the Act)",
                "Identification of Process Notices",
                "Readiness of the Notices according to the PDPA Compliance",
                "Readiness of the data collection processes",
              ]}
              formData={formData}
              handleChange={handleChange}
            />

            {/* Data Location */}
            <AssessmentSection
              title="Data Location"
              section="d"
              aspects={[
                "Identification of data Store locations",
                "Identification of local store location of sensitive personal data.",
              ]}
              formData={formData}
              handleChange={handleChange}
            />

            <div className="form-group full-width">
              <button
                type="submit"
                className="confirm-btn"
                style={{
                  padding: "0.6rem 1.2rem",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: "#4caf50",
                  color: "#fff",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Submit
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

// Reusable Assessment Section Component
const AssessmentSection = ({ title, section, aspects, formData, handleChange }) => {
  return (
    <div className="assessment-section" style={{ marginBottom: "1.5rem" }}>
      <h3 className="section-title">{title}</h3>
      <table
        className="assessment-table data-table"
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th style={thStyle}>Aspect</th>
            <th style={thStyle}>Yes</th>
            <th style={thStyle}>No</th>
          </tr>
        </thead>
        <tbody>
          {aspects.map((aspect, idx) => (
            <tr key={idx}>
              <td data-label="Aspect" style={tdStyle}>{aspect}</td>
              <td data-label="Yes" style={tdStyle}>
                <input
                  type="radio"
                  name={`${section}${idx + 1}`}
                  value="Yes"
                  checked={formData[`${section}${idx + 1}`] === "Yes"}
                  onChange={() => handleChange(section, idx + 1, "Yes")}
                />
              </td>
              <td data-label="No" style={tdStyle}>
                <input
                  type="radio"
                  name={`${section}${idx + 1}`}
                  value="No"
                  checked={formData[`${section}${idx + 1}`] === "No"}
                  onChange={() => handleChange(section, idx + 1, "No")}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const thStyle = {
  border: "1px solid #ccc",
  padding: "8px",
  textAlign: "left",
  backgroundColor: "#f5f5f5",
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: "8px",
};
