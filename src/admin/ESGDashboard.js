
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Doughnut, Pie, Line, Bar } from "react-chartjs-2";
import "./ESGDashboard.css";

// register chart.js bits
ChartJS.register(
  ArcElement,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

// --- Data & Colors ---
const RISK_COLORS = ["#254326ff", "#507427ff", "#258130ff", "#20b622ff", "#2e9833ff"];
const RISK_LABELS = ["Low", "Medium", "Negligible", "High", "Severe"];
const RISK_DATA = [188, 183, 79, 50, 16];

const CONTROVERSY_COLORS = [
  "#203521ff",
  "#387d2fff",
  "#42a547ff",
  "#7ebb3dff",
  "#388E3C",
  "#090909ff",
];
const CONTROVERSY_LABELS = ["Severe", "High", "Significant", "Moderate", "Low", "None"];
const CONTROVERSY_DATA = [36.75, 24.83, 16.52, 10.92, 6.34, 4.64];

const EMPLOYEE_LABELS = ["0-10k", "10k-50k", "50k-100k", "100k-200k", "200k-500k"];
const EMPLOYEE_DATA = [400, 350, 280, 250, 200];

const SECTOR_LABELS = ["Energy", "Basic Materials", "Utilities", "Industrials", "Tech"];
const SECTOR_DATA = [32.34, 26.72, 26.71, 25.45, 19.23];

const INDUSTRY_LABELS = ["Oil & Gas", "Banks", "Insurance", "Telecom", "Retail"];
const INDUSTRY_DATA = [36, 35, 33, 32, 30];

// Chart data
const riskChartData = { labels: RISK_LABELS, datasets: [{ data: RISK_DATA, backgroundColor: RISK_COLORS }] };
const controversyChartData = { labels: CONTROVERSY_LABELS, datasets: [{ data: CONTROVERSY_DATA, backgroundColor: CONTROVERSY_COLORS }] };
const employeeChartData = { labels: EMPLOYEE_LABELS, datasets: [{ label: "Avg Risk Score", data: EMPLOYEE_DATA, borderColor: "#359A15", backgroundColor: "rgba(53,154,21,0.2)", fill: true, tension: 0.3 }] };
const sectorChartData = { labels: SECTOR_LABELS, datasets: [{ label: "Avg ESG Score", data: SECTOR_DATA, backgroundColor: "#359A15" }] };
const industryChartData = { labels: INDUSTRY_LABELS, datasets: [{ label: "Avg ESG Score", data: INDUSTRY_DATA, backgroundColor: "#4CAF50" }] };

// Options
const riskOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, datalabels: { color: "#ffffff", formatter: (v) => v } } };
const controversyOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, datalabels: { color: "#fff", formatter: (v) => v.toFixed(1) } } };
const employeeOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, datalabels: { align: "top", color: "#000", formatter: (v) => v } } };
const sectorOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, datalabels: { color: "#000", anchor: "end", align: "top", formatter: (v) => v.toFixed(2) } } };
const industryOptions = { responsive: true, maintainAspectRatio: false, indexAxis: "y", plugins: { legend: { display: false }, datalabels: { color: "#000", anchor: "end", align: "right", formatter: (v) => v } } };

export default function ESGDashboard() {
  const esg1Path = "./esg1.png";
  const earthPath = "./earth.png";
  const esgPath = "./esg.png";
  const navigate = useNavigate(); 
useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      navigate("/", { replace: true }); // only redirect if not logged in
    }
}, [navigate]);

  return (
    <div className="esg-root">
      {/* HEADER CARDS */}
      <div className="esg-header">
        <div className="esg-card">
          <div className="esg-card-value">21.53</div>
          <div className="esg-card-title">Average of Total ESG Risk Score</div>
          </div>
         <div className="esg-card">
          <div className="esg-card-value">5.74</div>
          <div className="esg-card-title">Avg Environment Risk Score</div>
          </div>
        <div className="esg-card">
         <div className="esg-card-value">9.07</div>
          <div className="esg-card-title">Average of Social Risk Score</div>
          </div>
        
        <div className="esg-card">
          <div className="esg-card-value">6.73</div>
          <div className="esg-card-title">Average Governance Risk Score</div>
          </div>
        <div className="esg-card">
          <img className="esg-img-logo" src={esgPath} alt="ESG Logo (esg.png)" />
        </div>
      </div>

      {/* TOP CHARTS */}
      <div className="esg-charts">
        <div className="esg-chart">
          <h4 className="esg-chart-title">ESG Risk Level</h4>
          <div className="esg-risk-wrapper">
            <div className="esg-risk-canvas">
              <Doughnut data={riskChartData} options={riskOptions} />
            </div>
            <div className="esg-risk-legend">
              <div className="esg-legend-heading">ESG Risk Level</div>
              {RISK_LABELS.map((label, i) => (
                <span key={label} className="esg-legend-item">
                  <i style={{ background: RISK_COLORS[i] }}></i> {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="esg-chart">
          <h4 className="esg-chart-title">Controversy Level</h4>
          <div className="esg-controversy-wrapper">
            <div className="esg-controversy-canvas">
              <Pie data={controversyChartData} options={controversyOptions} />
            </div>
            <div className="esg-controversy-legend">
              <div className="esg-legend-heading">Controversy Level</div>
              {CONTROVERSY_LABELS.map((label, i) => (
                <span key={label} className="esg-legend-item">
                  <i style={{ background: CONTROVERSY_COLORS[i] }}></i> {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="esg-chart">
          <h4 className="esg-chart-title">Employee Count vs Risk</h4>
          <div className="esg-employee-canvas">
            <Line data={employeeChartData} options={employeeOptions} />
          </div>
        </div>
      </div>

      {/* MIDDLE GRID */}
      <div className="esg-middle-grid">
        {/* Sector + Filters */}
        <div className="esg-sector-block">
          <div className="esg-sector">
            <h4 className="esg-chart-title">Sector Avg ESG Score</h4>
            <div className="esg-sector-canvas">
              <Bar data={sectorChartData} options={sectorOptions} />
            </div>
          </div>
          <div className="esg-filters">
            <select className="esg-filter-select" defaultValue="">
              <option value="" disabled>
                Select Sector
              </option>
              <option>All Sectors</option>
              <option>Energy</option>
              <option>Tech</option>
            </select>

            <select className="esg-filter-select" defaultValue="">
              <option value="" disabled>
                Select Industry
              </option>
              <option>All Industries</option>
              <option>Banking</option>
              <option>Retail</option>
            </select>
          </div>
        </div>
        <div className="esg-earth">
            <img src={earthPath} alt="Earth (earth.png)" />
          </div>

        {/* Industry + ESG1 + Earth */}
        <div className="esg-industry-block">
          <div className="esg-industry">
            <h4 className="esg-chart-title">Industry Avg ESG Score</h4>
            <div className="esg-industry-canvas">
              <Bar data={industryChartData} options={industryOptions} />
            </div>
          </div>
          <div className="esg-esg1">
            <img src={esg1Path} alt="ESG banner (esg1.png)" />
          </div>
          
        </div>
      </div>

      <div className="esg-footer" />
    </div>
  );
}
