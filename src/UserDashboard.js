import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaShieldAlt, FaPen, FaCalendarAlt } from "react-icons/fa"; // add this import at the top
import UserSidebar from "./UserSidebar";
import UserHeader from "./UserHeader";
import "./Dashboard.css";
import "./ESGDashboard.css"; // for ESG styles

// ---------------- Initial Data ----------------
const pieTrafficData = [
  { name: "Compliant", value: 60000 },
  { name: "Non-Compliant", value: 65000 },
  { name: "At Risk", value: 58000 },
];

const COLORS = ["#7c3aed", "#f50bed", "#d02cec"];

// ---------------- Component ----------------
export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  // Load user info from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Fix calendar overflow
  useEffect(() => {
    const calendarEl = document.querySelector(".calendar-wrapper .fc");
    if (calendarEl) calendarEl.style.overflow = "hidden";
  }, []);

  return (
    <div className="Dashboard">
      {/* Sidebar */}
      <UserSidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* Header */}
      <UserHeader menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

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
        <section className="stats">
  <div className="stat-box">
    <div className="icon"><FaUsers /></div>
    <div className="content">
      <div className="label">Department</div>
      <div className="value">2</div>
    </div>
  </div>

  <div className="stat-box">
    <div className="icon"><FaShieldAlt /></div>
    <div className="content">
      <div className="label">Compliance</div>
      <div className="value">5</div>
    </div>
  </div>

  <div className="stat-box">
    <div className="icon"><FaPen /></div>
    <div className="content">
      <div className="label">Action</div>
      <div className="value">12</div>
    </div>
  </div>

  <div className="stat-box">
    <div className="icon"><FaCalendarAlt /></div>
    <div className="content">
      <div className="label1">End of Subscription</div>
      <div className="value1">02-09-2026</div>
    </div>
  </div>
</section>
      </section>
    </div>
  );
}
