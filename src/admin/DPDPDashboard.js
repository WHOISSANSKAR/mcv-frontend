import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";

export default function AssessmentDashboard() {
  const [overallScore, setOverallScore] = useState(null);

  // Fetch overall assessment score
  useEffect(() => {
    fetch("http://localhost:5000/assessment/overall-score", {
      method: "GET",
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        if (data.overall_score !== undefined && data.overall_score !== null) {
          setOverallScore(Math.round(data.overall_score));
        }
      })
      .catch(err => console.error("Error fetching overall score:", err));
  }, []);

  const regulationData = [
    { name: "GDPR", value: 26 },
    { name: "CCPA", value: 14 },
    { name: "ePrivacy", value: 9 },
    { name: "PIPEDA", value: 4 }
  ];

  const readinessData = Array.from({ length: 30 }).map((_, i) => ({
    x: i * 3,
    y: Math.random() * 100
  }));

  const tableData = [
    { title: "Initech LGPD: Tier 1", progress: 62, type: "LGPD", readiness: 100, shared: "3 Customers", date: "Dec 21, 2018", version: "V3", owners: ["A"] },
    { title: "Initech LGPD: Tier 1", progress: 24, type: "LGPD", readiness: 87, shared: "2 Customers", date: "Dec 21, 2018", version: "V1", owners: ["B", "C"] },
    { title: "Initech ePrivacy: General", progress: 93, type: "LGPD", readiness: 83, shared: "All Customers", date: "Dec 21, 2018", version: "V2", owners: ["D"] },
    { title: "Initech LGPD: Tier 1", progress: 41, type: "LGPD", readiness: 79, shared: "0 Customers", date: "Dec 21, 2018", version: "V1", owners: ["E"] },
    { title: "Initech GDPR: General", progress: 63, type: "GDPR", readiness: 65, shared: "5 Customers", date: "Dec 21, 2018", version: "V3", owners: ["F"] }
  ];

  const progressColor = (p) => {
    if (p < 30) return "#F4B400";
    if (p < 60) return "#34A853";
    return "#4285F4";
  };

  return (
    <div style={{ padding: "32px", fontFamily: "Inter, sans-serif", background: "#F5F8FB" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 600, color: "#4A4A4A", margin: 0 }}>Assessment Automation</h1>

        {/* Assessment Score */}
       <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "#EEF2FF",
    padding: "8px 14px",
    borderRadius: "999px",
    border: "1px solid #C7D2FE"
  }}
>
  <span
    style={{
      fontSize: "13px",
      fontWeight: 500,
      color: "#4338CA",
      whiteSpace: "nowrap",
      flexShrink: 0   // ⭐ this is the key
    }}
  >
    Assessment Score
  </span>

  <div
    style={{
      minWidth: "44px",
      height: "36px",
      padding: "0 10px",
      borderRadius: "999px",
      background: "#4338CA",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 700,
      fontSize: "14px",
      whiteSpace: "nowrap"
    }}
  >
    {overallScore !== null ? `${overallScore}%` : "--"}
  </div>
</div>

      </div>

      {/* Top Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
        {/* Card 1 */}
        <div style={{ background: "#fff", padding: 0, borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <div style={{ height: "4px", background: "#007bff", borderTopLeftRadius: 8, borderTopRightRadius: 8 }}></div>
          <div style={{ padding: "24px" }}>
            <p style={{ color: "#9CA3AF", fontSize: "12px", marginBottom: "12px" }}>Assessments</p>
            <h2 style={{ fontSize: "40px", fontWeight: 600, margin: 0 }}>53</h2>
            <p style={{ color: "#4A4A4A", fontSize: "14px" }}>Assessments</p>
            <p style={{ color: "#6B7280", fontSize: "12px", marginTop: "8px" }}>11 of them are shared with customers</p>
          </div>
        </div>

        {/* Card 2 */}
        <div style={{ background: "#fff", padding: 0, borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <div style={{ height: "4px", background: "#007bff", borderTopLeftRadius: 8, borderTopRightRadius: 8 }}></div>
          <div style={{ padding: "24px" }}>
            <p style={{ color: "#9CA3AF", fontSize: "12px", marginBottom: "12px" }}>Assessments by Regulation Type</p>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={regulationData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={60} />
                <Tooltip />
                <Bar dataKey="value" fill="#4A90E2" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 3 */}
        <div style={{ background: "#fff", padding: 0, borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <div style={{ height: "4px", background: "#007bff", borderTopLeftRadius: 8, borderTopRightRadius: 8 }}></div>
          <div style={{ padding: "24px" }}>
            <p style={{ color: "#9CA3AF", fontSize: "12px", marginBottom: "4px" }}>Assessments</p>
            <p style={{ color: "#4A4A4A", fontSize: "15px", fontWeight: 600, marginBottom: "12px" }}>Distribution by Readiness</p>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={readinessData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="bell" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(0,0,0,0.12)" />
                    <stop offset="100%" stopColor="rgba(0,0,0,0.03)" />
                  </linearGradient>
                </defs>
                <AreaChart data={readinessData}>
                  <Area type="monotone" dataKey="y" stroke="none" fill="url(#bell)" fillOpacity={1} />
                </AreaChart>
                <XAxis dataKey="x" axisLine={false} tickLine={false} ticks={[0, 100]} tickFormatter={t => (t === 0 ? "0%" : t === 100 ? "100%" : "")} style={{ fontSize: "11px", fill: "#6B7280" }} />
                <YAxis hide />
                <Tooltip cursor={{ opacity: 0.1 }} />
                <Bar dataKey="y" fill="#3BB2EA" barSize={4} radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 4 */}
        <div style={{ background: "#fff", padding: 0, borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <div style={{ height: "4px", background: "#007bff", borderTopLeftRadius: 8, borderTopRightRadius: 8 }}></div>
          <div style={{ padding: "24px" }}>
            <p style={{ color: "#9CA3AF", fontSize: "12px", marginBottom: "12px" }}>Outstanding Requests</p>
            <h2 style={{ fontSize: "40px", fontWeight: 600, margin: 0 }}>5</h2>
            <p style={{ color: "#4A4A4A", fontSize: "14px" }}>Requests</p>
            <p style={{ color: "#6B7280", fontSize: "12px", marginTop: "8px" }}>2 of them are for new assessments</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <div style={{ padding: "20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #E5E7EB" }}>
          <div style={{ fontWeight: 600, fontSize: "16px" }}>53 Internal Assessments</div>
          <button
            onClick={() => (window.location.href = "/DPDPA_test")}
            style={{ padding: "10px 16px", background: "#4338CA", color: "#fff", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: "pointer", transition: "0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }}
            onMouseOver={e => (e.target.style.background = "#3730A3")}
            onMouseOut={e => (e.target.style.background = "#4338CA")}
          >
            Start DPDPA Assessment
          </button>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F9FAFB", textAlign: "left", fontSize: "13px", color: "#6B7280" }}>
              <th style={{ padding: "12px 20px" }}>Assessment Title</th>
              <th style={{ padding: "12px 20px" }}>Progress</th>
              <th style={{ padding: "12px 20px" }}>Type</th>
              <th style={{ padding: "12px 20px" }}>Readiness Rating</th>
              <th style={{ padding: "12px 20px" }}>Shared With</th>
              <th style={{ padding: "12px 20px" }}>Published</th>
              <th style={{ padding: "12px 20px" }}>Owners</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #E5E7EB", background: i % 2 === 0 ? "#fff" : "#F9FAFB" }}>
                <td style={{ padding: "18px 20px", fontWeight: 500 }}>{row.title}</td>
                <td style={{ padding: "18px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "80px", height: "8px", background: "#E5E7EB", borderRadius: "4px" }}>
                      <div style={{ width: `${row.progress}%`, height: "8px", borderRadius: "4px", background: progressColor(row.progress) }}></div>
                    </div>
                    <span style={{ fontSize: "14px", color: "#4A4A4A" }}>{row.progress}%</span>
                  </div>
                </td>
                <td style={{ padding: "18px 20px", fontWeight: 600 }}>{row.type}</td>
                <td style={{ padding: "18px 20px", fontWeight: 600, color: "#1D4ED8" }}>{row.readiness}%</td>
                <td style={{ padding: "18px 20px" }}>{row.shared}</td>
                <td style={{ padding: "18px 20px" }}>{row.date} <span style={{ color: "#9CA3AF" }}>{row.version}</span></td>
                <td style={{ padding: "18px 20px", display: "flex" }}>
                  {row.owners.map((o, idx) => (
                    <img key={idx} src="/user.png" alt="user" style={{ width: 28, height: 28, borderRadius: "50%", marginLeft: idx === 0 ? 0 : -10, border: "2px solid #fff", boxShadow: "0 0 2px rgba(0,0,0,0.2)" }} />
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
