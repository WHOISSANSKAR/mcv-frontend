import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
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
  BarChart,
  Bar,
} from "recharts";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./Dashboard.css";
const token = localStorage.getItem("token");

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

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats] = useState(initialStats);
  const [OverdueApproved] = useState(initialOverdueApproved);
  const [menuOpen, setMenuOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [newTaskText, setNewTaskText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [recentCompliances, setRecentCompliances] = useState([]);
  const navigate = useNavigate();

  // Impact Assessment sample data
  // Unified Impact Assessment Colors + Values
const IMPACT_DATA = [
  { name: "Completed", value: 100, color: "#7c3aed" },
  { name: "In Progress", value: 40, color: "#f50bed" },
  { name: "Not Started", value: 60, color: "#d02cec" }
];

const impactBarData = IMPACT_DATA.map((d) => ({
  name: d.name,
  value: d.value,
  color: d.color
}));
const impactPieData = IMPACT_DATA.map((d) => ({
  name: d.name,
  value: d.value,
  fill: d.color
}));
  const values = impactBarData.map(d => d.value);
const min = Math.min(...values);
const max = Math.max(...values);

// Add padding BELOW the smallest value
const paddedMin = min - 10 < 0 ? 0 : min - 10;  // (so if min = 40 → 30)

// Calculate ticks with padding
const step = Math.ceil((max - paddedMin) / 2) || 1;
const customTicks = [paddedMin, paddedMin + step, max];


  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const parseBackendDate = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (isNaN(d)) return null;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/calendar/list", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

      const data = await res.json();

      if (Array.isArray(data)) {
        const mappedTasks = data.map((t) => ({
          id: t.cal_id,
          cal_event: t.cal_event || "No Event",
          cal_date: parseBackendDate(t.cal_date),
        }));

        setTasks(mappedTasks);

        const formattedEvents = mappedTasks.map((t) => ({
          title: t.cal_event,
          start: t.cal_date,
        }));

        setEvents(formattedEvents);
      } else {
        console.error("Invalid data structure:", data);
      }
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentCompliances = async () => {
    try {
      const res = await fetch("http://localhost:5000/compliance/list", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok && data.compliances) {
        setRecentCompliances(data.compliances.slice(0, 5));
      }
    } catch (err) {
      console.error("Error loading compliances:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchRecentCompliances();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTaskText || !selectedDate) return;

    try {
      const res = await fetch("http://localhost:5000/calendar/add", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({ date: selectedDate, event: newTaskText }),
});

      const body = await res.json();
      if (res.ok) {
        await fetchEvents();
        setNewTaskText("");
        setShowModal(false);
      } else {
        alert(body.error || "Error adding event");
      }
    } catch (err) {
      alert("Network error");
    }
  };

  const handleDateClick = (info) => {
    const date = info.date;
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;

    setSelectedDate(formattedDate);
    setShowModal(true);
  };

  const tasksForDate = tasks.filter((t) => t.cal_date === selectedDate);

  return (
    <div className="Dashboard">
      <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* HEADER SECTION */}
      <div className="headSection">
        <div className="rightGroup">
          <div className="buttonGroup">
            <button className="headBtn" onClick={() => (window.location.href = "/user_dashboard")}>
              + Compliance Zone
            </button>
            <button className="headBtn" onClick={() => navigate("/ESG")}>
              + ESG
            </button>
            <button className="headBtn" onClick={() => (window.location.href = "/dpdp_dashboard")}>
              + DPDP Act
            </button>
            <button className="headBtn" onClick={() => navigate("/ESG")}>
              + Bharat vault
            </button>
          </div>

          <div className="searchBox">
            <input type="text" placeholder="Can't find something? Search it here!" />
            <FaSearch className="searchIcon" />
          </div>
        </div>
      </div>

      {/* WELCOME */}
      <div className="welcome-bar">
        <div className="welcome-user">
          Hello,
          <br />
          {user ? user.usrlst_name : "Admin"}
        </div>
        <div className="welcome-score">Current Compliance : 100%</div>
      </div>

      {/* ====== CHARTS SECTION (3 rows as requested) ====== */}
      <section className="charts">
        {/* ROW 1: Recent Compliance | Compliance Track | Calendar */}
        <div className="chart-row row-1">
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
                {recentCompliances.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>
                      No Records Found
                    </td>
                  </tr>
                ) : (
                  recentCompliances.map((c, i) => (
                    <tr key={i}>
                      <td>{c.cmplst_id}</td>
                      <td>{c.cmplst_particular}</td>
                      <td>{c.cmplst_start_date}</td>
                      <td>{c.cmplst_end_date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="view-more" onClick={() => navigate("/Compliance")}>
              View More
            </div>
          </div>

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
                <Line yAxisId="left" type="monotone" dataKey="Overdue" stroke="#cc0e0e" />
                <Line yAxisId="right" type="monotone" dataKey="Approved" stroke="#38269f" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card calendar-card">
            <h3>Compliance Calendar</h3>
            <div className="calendar-wrapper">
              {loading && <div className="loading">Loading...</div>}

              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events}
                dateClick={handleDateClick}
                headerToolbar={{ left: "title", center: "", right: "prev,next" }}
                height="100%"
                eventContent={() => null}
                dayCellContent={(arg) => {
                  const date = arg.date;
                  const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
                    2,
                    "0"
                  )}-${String(date.getDate()).padStart(2, "0")}`;
                  const dayTasks = tasks.filter((t) => t.cal_date === dateStr);

                  if (dayTasks.length >= 2) {
                    return {
                      html: `
                        <div class="fc-daygrid-day-number">${arg.dayNumberText}</div>
                        <div class="task-dot"></div>
                      `,
                    };
                  }

                  if (dayTasks.length === 1) {
                    const t = dayTasks[0];
                    const displayText =
                      t.cal_event.length > 15 ? t.cal_event.slice(0, 15) + "..." : t.cal_event;

                    return {
                      html: `
                        <div class="fc-daygrid-day-number" style="text-align:center;">${arg.dayNumberText}</div>
                        <div class="task-text" title="${t.cal_event}">
                          ${displayText}
                        </div>
                      `,
                    };
                  }

                  return {
                    html: `<div class="fc-daygrid-day-number">${arg.dayNumberText}</div>`,
                  };
                }}
              />
            </div>
          </div>
        </div>

        {/* ROW 2: Compliance Health | Alerts & Notifications | Impact Assessment */}
        <div className="chart-row row-2">
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

          <div className="chart-card">
            <h3>Alerts & Notifications</h3>
            <ul className="alerts-list">
              <li className="alert-item overdue">❗ 2 audits overdue (Finance, IT)</li>
              <li className="alert-item expiring">
                ⚠️ Vendor X compliance certificate expiring in 30 days
              </li>
              <li className="alert-item success">✅ New GDPR regulation update applied successfully</li>
            </ul>
          </div>

         {/* IMPACT ASSESSMENT (replace existing Impact Assessment card) */}
<div className="chart-card impact-card">
  <div className="impact-card-header">
    <div className="impact-title">Impact Assessment</div>

    <div className="risk-status">
      <span className="risk-text">Risk Status :</span>
      <span className="risk-pill" />
    </div>
  </div>

  <div className="impact-body">

    {/* LEFT BAR GRAPH */}
    <div className="impact-left">
  <div className="subheader dark">Overall Count</div>

  <ResponsiveContainer width="150%" height={180}>
  <BarChart
    data={impactBarData}
    layout="vertical"
    margin={{ top: 10, right: 20, left: 20, bottom: 0 }}   // shifted right so ticks fit
  >
    <XAxis
      type="number"
      domain={[paddedMin, max]}
      ticks={customTicks}
      interval={0}
      stroke="#333"        // X-axis visible
      tick={{ fill: "#000" }}
      axisLine={true}      // show axis line
    />

    <YAxis
      type="category"
      dataKey="name"
      tick={{ fontSize: 11, fill: "#000" }}
      width={80}           // wider so labels don't clash
      axisLine={true}      // show axis line
      tickLine={true}      // make tick marks visible
      stroke="#333"
    />

    <Tooltip />

    <Bar
      dataKey="value"
      barSize={18}
      radius={[5, 5, 5, 5]}
      label={{ position: "right", fill: "#000", fontSize: 11 }}
    >
      {impactBarData.map((entry, index) => (
        <Cell key={index} fill={entry.color} />
      ))}
    </Bar>
  </BarChart>
</ResponsiveContainer>


</div>


    {/* RIGHT PIE CHART */}
    <div className="impact-right">
      <div className="subheader dark">Percentage (%)</div>

      <div className="pie-wrapper">
  <ResponsiveContainer width="100%" height={180}>
    <PieChart>
      <Pie
  data={impactPieData}
  dataKey="value"
  nameKey="name"
  outerRadius={70}
  label={({ percent }) => `${Math.round(percent * 100)}%`}
>
  {impactPieData.map((entry, i) => (
    <Cell key={i} fill={entry.fill} />
  ))}
</Pie>

      <Tooltip />
    </PieChart>
  </ResponsiveContainer>
</div>

    </div>

  </div>
</div>

        </div>

        {/* ROW 3: Risk Heatmap | Tasks & Workflow */}
        <div className="chart-row row-3">
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
                {tasks.map((t) => (
                  <tr key={t.id}>
                    <td>{t.cal_event}</td>
                    <td>{user ? user.usrlst_name : "Admin"}</td>
                    <td>{t.cal_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* TASK MODAL */}
      {showModal && (
        <div className="ct-modal-backdrop" onClick={() => setShowModal(false)}>
          <div
            className="ct-modal"
            onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: "400px", overflowY: "auto" }}
          >
            <h3 style={{ textAlign: "center" }}>Tasks for {selectedDate}</h3>

            <form onSubmit={addTask}>
              <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="Enter task name"
                required
              />
              <button type="submit">Add Task</button>
            </form>

            <h4>Existing Tasks</h4>
            {tasksForDate.length > 0 ? (
              <ul className="task-list" style={{ maxHeight: "250px", overflowY: "auto" }}>
                {tasksForDate.map((t) => (
                  <TaskItem key={t.id} task={t} refresh={fetchEvents} selectedDate={selectedDate} />
                ))}
              </ul>
            ) : (
              <p className="no-tasks">No tasks yet for this date</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* -------- TaskItem Component -------- */
function TaskItem({ task, refresh, selectedDate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.cal_event);

  const handleUpdate = async () => {
    if (!editText.trim()) return;
    try {
    const res = await fetch(`http://localhost:5000/calendar/edit/${task.id}`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
  body: JSON.stringify({ date: selectedDate, event: editText }),
});
const body = await res.json(); // ✅ now res is defined
if (res.ok) {
        setIsEditing(false);
        await refresh();
      } else {
        alert(body.error || "Failed to update event");
      }
    } catch (err) {
      alert("Network error while updating");
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
    const res = await fetch(`http://localhost:5000/calendar/delete/${task.id}`, {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});
const body = await res.json(); 
      if (res.ok) {
        await refresh();
      } else {
        alert(body.error || "Failed to delete event");
      }
    } catch (err) {
      alert("Network error while deleting");
      console.error(err);
    }
  };

  return (
    <li className="task-item" style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
      {isEditing ? (
        <>
          <input type="text" value={editText} onChange={(e) => setEditText(e.target.value)} style={{ flex: 1 }} />
          <button onClick={handleUpdate} title="Save Task">
            Save
          </button>
          <button onClick={() => setIsEditing(false)} title="Cancel">
            Cancel
          </button>
        </>
      ) : (
        <>
          <span style={{ flex: 1, wordBreak: "break-word" }}>{task.cal_event}</span>
          <div className="task-actions" style={{ display: "flex", gap: "4px" }}>
            <button onClick={() => setIsEditing(true)} title="Edit Task">
              <FaEdit />
            </button>
            <button onClick={handleDelete} title="Delete Task">
              <FaTrash />
            </button>
          </div>
        </>
      )}
    </li>
  );
}
