import React, { useState, useMemo, useEffect } from "react";
import { FaSearch, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./Dashboard.css";

const departments = ["HR", "IT", "Finance", "Marketing", "Sales", "Admin"];

function getRandomDate() {
  const day = Math.floor(Math.random() * 30) + 1;
  return `2025-09-${day.toString().padStart(2, "0")}`;
}

function getRandomTime() {
  const hour = 8 + Math.floor(Math.random() * 10);
  const minute = Math.random() > 0.5 ? "00" : "30";
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minute} ${suffix}`;
}

function getRandomAction() {
  return Math.random() > 0.5 ? "Logged in" : "Logged out";
}

export default function Activity() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const initialData = Array.from({ length: 20 }, (_, i) => ({
    department: departments[Math.floor(Math.random() * departments.length)],
    email: `user${i + 1}@mail.com`,
    date: getRandomDate(),
    time: getRandomTime(),
    action: getRandomAction(),
  }));

  const [data] = useState(initialData);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  const [searchDept, setSearchDept] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchDate, setSearchDate] = useState("");

  const [debouncedDept, setDebouncedDept] = useState("");
  const [debouncedEmail, setDebouncedEmail] = useState("");
  const [debouncedDate, setDebouncedDate] = useState("");

  useEffect(() => { const handler = setTimeout(() => setDebouncedDept(searchDept), 300); return () => clearTimeout(handler); }, [searchDept]);
  useEffect(() => { const handler = setTimeout(() => setDebouncedEmail(searchEmail), 300); return () => clearTimeout(handler); }, [searchEmail]);
  useEffect(() => { const handler = setTimeout(() => setDebouncedDate(searchDate), 300); return () => clearTimeout(handler); }, [searchDate]);
  useEffect(() => {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!isLoggedIn || user.usrlst_role?.toLowerCase() !== "admin") {
        navigate("/", { replace: true }); // redirect non-admins to login/home
      }
    }, [navigate]);
  const filteredData = useMemo(() => {
    return data
      .filter(row =>
        row.department.toLowerCase().includes(debouncedDept.toLowerCase()) &&
        row.email.toLowerCase().includes(debouncedEmail.toLowerCase()) &&
        row.date.includes(debouncedDate)
      )
      .sort((a, b) => {
        if (!sortConfig.key) return 0;
        const valA = a[sortConfig.key].toString().toLowerCase();
        const valB = b[sortConfig.key].toString().toLowerCase();
        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
  }, [data, debouncedDept, debouncedEmail, debouncedDate, sortConfig]);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="sort-icon" />;
    return sortConfig.direction === "asc" ? <FaSortUp className="sort-icon" /> : <FaSortDown className="sort-icon" />;
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
    <div className="activity">
      <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* Heading */}
       <div className="compliance-score" style={{ paddingLeft: "45px" }}>Activity log</div>


      {/* Navigation + Search row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", paddingLeft: "45px", paddingRight: "20px" }}>
        {/* Left: Navigation Buttons */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="btn blue-btn" onClick={() => navigate("/BusinessUnit")}>Business Unit</button>
          <button className="btn blue-btn" onClick={() => navigate("/department")}>Departments</button>
          <button className="btn blue-btn" onClick={() => navigate("/user")}>Users</button>
          <button className="btn gray-btn" onClick={() => navigate("/activity")}>Activity</button>
        </div>

        {/* Right: Search Boxes */}
        <div style={{ display: "flex", gap: "10px" }}>
          <div className="search-box">
            <input placeholder="Search Dept" value={searchDept} onChange={(e) => setSearchDept(e.target.value)} />
            <FaSearch className="search-icon" />
          </div>
          <div className="search-box">
            <input placeholder="Search Email" value={searchEmail} onChange={(e) => setSearchEmail(e.target.value)} />
            <FaSearch className="search-icon" />
          </div>
          <div className="search-box">
            <input placeholder="Search Date" value={searchDate} onChange={(e) => setSearchDate(e.target.value)} />
            <FaSearch className="search-icon" />
          </div>
        </div>
      </div>

      {/* Data Table */}
      <table className="data-table">
        <thead>
          <tr>
            <th onClick={() => requestSort("department")}>Department {getSortIcon("department")}</th>
            <th onClick={() => requestSort("email")}>Email {getSortIcon("email")}</th>
            <th onClick={() => requestSort("date")}>Date {getSortIcon("date")}</th>
            <th onClick={() => requestSort("time")}>Time {getSortIcon("time")}</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((row, i) => (
            <tr key={i}>
              <td><b>{row.department}</b></td>
              <td>{row.email}</td>
              <td>{row.date}</td>
              <td>{row.time}</td>
              <td>{row.action}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Prev</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</button>
      </div>
    </div>
  );
}
