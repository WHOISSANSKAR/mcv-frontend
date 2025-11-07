import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaShieldAlt, FaPen, FaCalendarAlt } from "react-icons/fa";
import UserSidebar from "./UserSidebar";
import UserHeader from "./UserHeader";
import "./Dashboard.css";

const pieTrafficData = [
  { name: "Compliant", value: 60000 },
  { name: "Non-Compliant", value: 65000 },
  { name: "At Risk", value: 58000 },
];

const COLORS = ["#7c3aed", "#f50bed", "#d02cec"];

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ STATES FOR API VALUES
  const [totalDepartments, setTotalDepartments] = useState(0);
  const [totalCompliances, setTotalCompliances] = useState(0);
  const [totalInstances, setTotalInstances] = useState(0);
  const [endSubscription, setEndSubscription] = useState("");

  const navigate = useNavigate();

  // Load user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // ✅ FETCH DASHBOARD SUMMARY FROM API
  useEffect(() => {
  fetch("http://localhost:5000/dashboard/summary", {   // ✅ must match login origin
    method: "GET",
    credentials: "include",
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) return;

      setTotalCompliances(data.total_compliances);
      setTotalDepartments(data.total_departments);
      setTotalInstances(data.total_actions);
      setEndSubscription(data.subscription_end_date || "");
    })
    .catch((err) => console.log("Dashboard API Error:", err));
}, []);


  // Fix calendar overflow
  useEffect(() => {
    const calendarEl = document.querySelector(".calendar-wrapper .fc");
    if (calendarEl) calendarEl.style.overflow = "hidden";
  }, []);

  return (
    <div className="Dashboard">
      <UserSidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <UserHeader menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className="headSection">
        <div></div>
        <div className="rightGroup">
          <div className="finderBox">
            <input type="text" placeholder="Can't find something? Search it here!" />
            <FaSearch className="finderIcon" />
          </div>
        </div>
      </div>

      <div className="welcome-bar">
        <div className="welcome-user">
          Hello,<br />
          {user ? user.usrlst_name : "Admin"}
        </div>

        <div className="welcome-score">Current Compliance : 100%</div>
        <div className="welcome-right"></div>
      </div>

      <section className="charts">
        <div className="chart-row top">
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

        {/* ✅ STATS UPDATED WITH API VALUES */}
        <section className="stats">
          <div className="stat-box">
            <div className="icon"><FaUsers /></div>
            <div className="content">
              <div className="value">{totalDepartments}</div>
              <div className="label">Department</div>
            </div>
          </div>

          <div className="stat-box">
            <div className="icon"><FaShieldAlt /></div>
            <div className="content">
              <div className="value">{totalCompliances}</div>
              <div className="label">Compliance</div>
            </div>
          </div>

          <div className="stat-box">
            <div className="icon"><FaPen /></div>
            <div className="content">
              <div className="value">{totalInstances}</div>
              <div className="label2">Instances</div>
            </div>
          </div>

          <div className="stat-box">
            <div className="icon"><FaCalendarAlt /></div>
            <div className="content">
              <div className="value1">
                {endSubscription ? endSubscription.split("T")[0] : ""}
              </div>
              <div className="label1">End of Subscription</div>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
}
