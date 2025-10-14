
import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";
import "./Dashboard.css";
import "./ESGDashboard.css"; // ✅ for ESG styles

// ---------------- Initial Data ----------------
const initialStats = { Overdue: 1, Upcoming: 2, Approved: 1, Compliance: 12 };

const initialDailyTraffic = [
  { date: "Jun 1", users: 4000 },
  { date: "Jun 2", users: 3200 },
  { date: "Jun 3", users: 4500 },
  { date: "Jun 4", users: 2800 },
  { date: "Jun 5", users: 3600 },
  { date: "Jun 6", users: 2400 },
  { date: "Jun 7", users: 3000 },
  { date: "Jun 8", users: 3800 },
  { date: "Jun 9", users: 2000 },
  { date: "Jun 10", users: 4200 },
];

const initialOverdueApproved = initialDailyTraffic.map((d) => ({
  date: d.date,
  Overdue: Math.round(60 + Math.random() * 80),
  Approved: Math.round(200 + Math.random() * 600),
}));

const pieTrafficData = [
  { name: "Compliant", value: 60000 },
  { name: "Non-Compliant", value: 65000 },
  { name: "At Risk", value: 58000 },
];

const COLORS = ["#7c3aed", "#f50bed", "#d02cec"];

// ---------------- Utils ----------------
function numberFmt(n) {
  return n >= 1000 ? (n / 1000).toFixed(1) + "K" : n;
}

// ---------------- Component ----------------
export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats] = useState(initialStats);
  const [OverdueApproved] = useState(initialOverdueApproved);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  // ✅ Load user info from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // ✅ Fix calendar overflow
  useEffect(() => {
    const calendarEl = document.querySelector(".calendar-wrapper .fc");
    if (calendarEl) calendarEl.style.overflow = "hidden";
  }, []);

  return (
    <div className="Dashboard">
      {/* Sidebar */}
      <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* Header */}
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* Head Section */}
      <div className="headSection">
        <div></div>
        <div className="rightGroup">
          <div className="searchBox">
            <input
              type="text"
              placeholder="Can't find something? Search it here!"
            />
            <FaSearch className="searchIcon" />
          </div>
          <div className="buttonGroup">
            <button
  className="headBtn"
  onClick={() => window.location.href = "/user_dashboard"}
>
  + Compliance Zone
</button>

            <button className="headBtn" onClick={() => navigate("/ESG")}>
              + ESG
            </button>
          </div>
        </div>
      </div>

      {/* Greeting & Compliance Score Bar */}
      <div className="welcome-bar">
        <div className="welcome-user">
  Hello,<br />
  {user ? user.usrlst_name : "Admin"}
</div>

        <div className="welcome-score">Current Compliance : 100%</div>
        <div className="welcome-right"></div>
      </div>

      {/* Charts Section */}
      <section className="charts">
        <div className="chart-row top">
          {/* Recent Compliance Table */}
          <div className="chart-card">
            <h3>Recent Compliance</h3>
            <table className="compliance-table">
              <thead>
                <tr>
                  <th>Comp_id</th>
                  <th>Compliance</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>REGSTFACTORIES02</td>
                  <td>REFER TO STATE RULES - II</td>
                  <td>Sep 10 2025</td>
                  <td>Sep 11 2025</td>
                </tr>
                <tr>
                  <td>REGSTFACTORIES01</td>
                  <td>REFER TO STATE RULES - I</td>
                  <td>Sep 3 2025</td>
                  <td>Sep 10 2025</td>
                </tr>
              </tbody>
            </table>
            <div className="view-more" onClick={() => navigate("/Compliance")}>
              View More
            </div>
          </div>

          {/* Compliance Track Line Chart */}
          <div className="chart-card">
            <h3>Compliance Track</h3>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={OverdueApproved}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="Overdue"
                  stroke="#cc0e0e"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="Approved"
                  stroke="#38269f"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Calendar */}
          <div className="chart-card calendar-card">
            <h3>Compliance Calendar</h3>
            <div className="calendar-wrapper">
              <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                height="100%"
                headerToolbar={{ left: "title", center: "", right: "prev,next" }}
              />
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="chart-row bottom">
          {/* Compliance Health Pie Chart */}
          <div className="chart-card">
            <h3>Compliance Health</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieTrafficData}
                  dataKey="value"
                  nameKey="name"
                  cx="40%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={70}
                  label={({ percent }) => `(${(percent * 100).toFixed(0)}%)`}
                >
                  {pieTrafficData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" verticalAlign="middle" align="right" />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Alerts & Notifications */}
          <div className="chart-card">
            <h3>Alerts & Notifications</h3>
            <ul className="alerts-list">
              <li className="alert-item overdue">
                ❗ 2 audits overdue (Finance, IT)
              </li>
              <li className="alert-item expiring">
                ⚠️ Vendor X compliance certificate expiring in 30 days
              </li>
              <li className="alert-item success">
                ✅ New GDPR regulation update applied successfully
              </li>
            </ul>
          </div>

          {/* Risk Heatmap */}
          <div className="chart-card">
            <h3>Risk Heatmap</h3>
            <table className="heatmap-table">
              <thead>
                <tr>
                  <th>Department</th>
                  <th>High</th>
                  <th>Medium</th>
                  <th>Low</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Finance</td>
                  <td className="red"></td>
                  <td className="yellow"></td>
                  <td className="green"></td>
                </tr>
                <tr>
                  <td>IT</td>
                  <td className="yellow"></td>
                  <td className="red"></td>
                  <td className="green"></td>
                </tr>
                <tr>
                  <td>HR</td>
                  <td className="yellow"></td>
                  <td className="yellow"></td>
                  <td className="green"></td>
                </tr>
                <tr>
                  <td>Operations</td>
                  <td className="red"></td>
                  <td className="yellow"></td>
                  <td className="green"></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Tasks & Workflow */}
          <div className="chart-card">
            <div className="tasks-header">
              <h3>Tasks & Workflow</h3>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: "60%" }}></div>
              </div>
              <span className="progress-text">60%</span>
            </div>
            <table className="tasks-table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Departmental User</th>
                  <th>Due Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Update data privacy policy</td>
                  <td>A. Patel</td>
                  <td>20-Sep</td>
                </tr>
                <tr>
                  <td>Complete PCI-DSS audit</td>
                  <td>R. Singh</td>
                  <td>25-Sep</td>
                </tr>
                <tr>
                  <td>Refresh GDPR training</td>
                  <td>S. Kumar</td>
                  <td>30-Sep</td>
                </tr>
                <tr>
                  <td>Renew ISO 27001 certificate</td>
                  <td>L. Chen</td>
                  <td>05-Oct</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
