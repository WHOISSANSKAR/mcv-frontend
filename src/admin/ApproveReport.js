import React, { useEffect, useState, useRef } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function ApproveReport() {
  const [rowData, setRowData] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const cardRef = useRef();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("approveReportData") || "{}");
    setRowData(data);
  }, []);

  if (!rowData) return <div style={{ padding: "20px" }}>Loading...</div>;

  // Print only the card using CSS media query
  const handlePrint = () => {
    window.print();
  };

  // Download attachment (static file in public folder)
  const downloadAttachment = () => {
    const fileUrl = "/sample.pdf"; // Replace with your file path
    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", "sexy.pdf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="Approved">
      <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* Heading + Buttons */}
      <div
        className="headSection"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div className="compliance-score">Approved Report</div>
        <div className="rightGroup" style={{ display: "flex", gap: "10px" }}>
          <button
            className="action-btn primary"
            onClick={handlePrint}
            style={{ padding: "6px 14px", minWidth: "80px" }}
          >
            Print
          </button>
          <button
            className="action-btn primary"
            onClick={downloadAttachment}
            style={{ padding: "6px 14px", minWidth: "180px" }}
          >
            Download Attachment
          </button>
        </div>
      </div>

      {/* Card displaying all info */}
      <div
        ref={cardRef}
        className="print-card"
        style={{
          padding: "20px",
          backgroundColor: "#fff",
          border: "1px solid #ddd",
          borderRadius: "8px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          width: "95%",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        {Object.entries(rowData).map(([key, value], index) => (
          <div
            key={index}
            style={{
              display: "flex",
              padding: "8px 0",
              borderBottom:
                index < Object.entries(rowData).length - 1 ? "1px solid #eee" : "none",
            }}
          >
            <div style={{ width: "30%", fontWeight: "600", textTransform: "capitalize" }}>
              {key.replace(/([A-Z])/g, " $1")}
            </div>
            <div style={{ width: "70%", wordBreak: "break-word" }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Print-only CSS */}
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .print-card, .print-card * {
              visibility: visible;
            }
            .print-card {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              box-shadow: none;
            }
          }
        `}
      </style>
    </div>
  );
}
