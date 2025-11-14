import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { FaSearch, FaUsers, FaShieldAlt, FaPen, FaCalendarAlt, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
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

  const [totalDepartments, setTotalDepartments] = useState(0);
  const [totalCompliances, setTotalCompliances] = useState(0);
  const [totalInstances, setTotalInstances] = useState(0);
  const [endSubscription, setEndSubscription] = useState("");

  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [newTaskText, setNewTaskText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/dashboard/summary", { method: "GET", credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) return;
        setTotalDepartments(data.total_departments);
        setTotalCompliances(data.total_compliances);
        setTotalInstances(data.total_actions);
        setEndSubscription(data.subscription_end_date || "");
      })
      .catch((err) => console.log("Dashboard API Error:", err));
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

  const fetchTasks = async () => {
    try {
      const res = await fetch("http://localhost:5000/calendar/list", { method: "GET", credentials: "include" });
      const data = await res.json();
      if (Array.isArray(data)) {
        const mappedTasks = data.map((item) => ({
          cal_id: item.cal_id,
          cal_date: parseBackendDate(item.cal_date),
          cal_event: item.cal_event,
        }));
        setTasks(mappedTasks);

        const formattedEvents = mappedTasks.map((e) => ({
          id: e.cal_id,
          title: e.cal_event,
          start: e.cal_date,
          allDay: true,
        }));
        setEvents(formattedEvents);
      }
    } catch (err) {
      console.log("Calendar API Error:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [refresh]);

  const addTask = async (e) => {
    e.preventDefault();
    if (!selectedDate || !newTaskText.trim()) return;

    try {
      const res = await fetch("http://localhost:5000/calendar/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ date: selectedDate, event: newTaskText }),
      });
      const data = await res.json();
      if (res.ok) {
        setNewTaskText("");
        setRefresh(!refresh);
        setShowModal(false);
      } else alert(data.error || "Error adding task");
    } catch {
      alert("Network error while adding task");
    }
  };

  const handleDateClick = (info) => {
    // Use dateStr directly provided by FullCalendar
    setSelectedDate(info.dateStr);
    setShowModal(true);
  };

  const tasksForDate = tasks.filter((t) => t.cal_date === selectedDate);

  const truncateTask = (text) => (text.length > 15 ? text.slice(0, 15) + "..." : text);

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
        <div className="welcome-user">Hello,<br />{user ? user.usrlst_name : "Admin"}</div>
        <div className="welcome-score">Current Compliance : 100%</div>
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
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                height="100%"
                events={events}
                dateClick={handleDateClick}
                headerToolbar={{ left: "title", center: "", right: "prev,next" }}
                dayCellContent={(arg) => {
                  const dateStr = parseBackendDate(arg.date);
                  const dayTasks = tasks.filter((t) => t.cal_date === dateStr);

                  if (dayTasks.length >= 2) {
                    return { html: `<div class="fc-daygrid-day-number">${arg.dayNumberText}</div><div class="task-dot"></div>` };
                  }

                  if (dayTasks.length === 1) {
                    const t = dayTasks[0];
                    return {
                      html: `<div class="fc-daygrid-day-number" style="text-align:center;">${arg.dayNumberText}</div>
                             <div style="
                               max-width: 70px;
                               margin: 2px auto 0 auto;
                               font-size: 10px;
                               white-space: nowrap;
                               overflow: hidden;
                               text-overflow: ellipsis;
                               text-align: center;"
                               title="${t.cal_event}">
                               ${truncateTask(t.cal_event)}
                             </div>`,
                    };
                  }

                  return { html: `<div class="fc-daygrid-day-number">${arg.dayNumberText}</div>` };
                }}
                dayCellClassNames={() => "fc-pointer"}
              />
            </div>
          </div>
        </div>

        <section className="stats">
          <div className="stat-box">
            <div className="icon"><FaUsers /></div>
            <div className="content"><div className="value">{totalDepartments}</div><div className="label">Department</div></div>
          </div>
          <div className="stat-box">
            <div className="icon"><FaShieldAlt /></div>
            <div className="content"><div className="value">{totalCompliances}</div><div className="label">Compliance</div></div>
          </div>
          <div className="stat-box">
            <div className="icon"><FaPen /></div>
            <div className="content"><div className="value">{totalInstances}</div><div className="label2">Instances</div></div>
          </div>
          <div className="stat-box">
            <div className="icon"><FaCalendarAlt /></div>
            <div className="content"><div className="value1">{endSubscription ? endSubscription.split("T")[0] : ""}</div><div className="label1">End of Subscription</div></div>
          </div>
        </section>
      </section>

      {showModal && (
        <div className="ct-modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="ct-modal" onClick={(e) => e.stopPropagation()} style={{ maxHeight: "400px", overflowY: "auto" }}>
            <h3>Tasks for {selectedDate}</h3>
            <form onSubmit={addTask}>
              <input
                type="text"
                placeholder="Enter task name"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                required
              />
              <button type="submit">Add Task</button>
            </form>

            <h4>Existing Tasks</h4>
            {tasksForDate.length > 0 ? (
              <ul className="task-list">
                {tasksForDate.map((t) => (
                  <TaskItem key={t.cal_id} task={t} refresh={() => setRefresh(!refresh)} selectedDate={selectedDate} />
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

function TaskItem({ task, refresh, selectedDate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.cal_event);

  const handleUpdate = async () => {
    if (!editText.trim()) return;
    try {
      const res = await fetch(`http://localhost:5000/calendar/edit/${task.cal_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ date: selectedDate, event: editText }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsEditing(false);
        refresh();
      } else alert(data.error || "Failed to update event");
    } catch (err) {
      alert("Network error while updating");
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:5000/calendar/delete/${task.cal_id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) refresh();
      else alert(data.error || "Failed to delete event");
    } catch (err) {
      alert("Network error while deleting");
      console.error(err);
    }
  };

  return (
    <li className="task-item">
      {isEditing ? (
        <>
          <input type="text" value={editText} onChange={(e) => setEditText(e.target.value)} style={{ flex: 1 }} />
          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <span style={{ flex: 1, wordBreak: "break-word" }}>{task.cal_event}</span>
          <div className="task-actions" style={{ display: "flex", gap: "4px" }}>
            <button onClick={() => setIsEditing(true)}><FaEdit /></button>
            <button onClick={handleDelete}><FaTrash /></button>
          </div>
        </>
      )}
    </li>
  );
}
