import React, { useState, useMemo, useEffect } from "react";
import { FaSearch, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./Dashboard.css";

function cleanDate(dateString) {
  if (!dateString) return "";
  const parts = dateString.split(" "); 
  // Example: ["Tue,", "04", "Nov", "2025", "00:00:00", "GMT"]
  return `${parts[1]} ${parts[2]} ${parts[3]}`; // "04 Nov 2025"
}

export default function Activity() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const [data, setData] = useState([]);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  const [searchDept, setSearchDept] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchDate, setSearchDate] = useState("");

  const [debouncedDept, setDebouncedDept] = useState("");
  const [debouncedEmail, setDebouncedEmail] = useState("");
  const [debouncedDate, setDebouncedDate] = useState("");

  // ✅ Debounce logic
  useEffect(() => {
    const h = setTimeout(() => setDebouncedDept(searchDept), 300);
    return () => clearTimeout(h);
  }, [searchDept]);

  useEffect(() => {
    const h = setTimeout(() => setDebouncedEmail(searchEmail), 300);
    return () => clearTimeout(h);
  }, [searchEmail]);

  useEffect(() => {
    const h = setTimeout(() => setDebouncedDate(searchDate), 300);
    return () => clearTimeout(h);
  }, [searchDate]);

  // ✅ Admin auth check
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!isLoggedIn || user.usrlst_role?.toLowerCase() !== "admin") {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  // ✅ Fetch data
 useEffect(() => {
  async function fetchLogs() {
    try {
      const res = await fetch("http://localhost:5000/activity_log", {
  credentials: "include",
});

  

      const json = await res.json();

      if (res.ok && json.activities) {
        const formatted = json.activities.map((item) => ({
          department: item.acty_department || "",
          email: item.acty_email || "",
          date: item.acty_date ? item.acty_date.split("T")[0] : "", // keeps YYYY-MM-DD
          time: item.acty_time || "",
          action: item.acty_action || "",
        }));
        setData(formatted);
      } else {
        console.error("API Error:", json);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }

  fetchLogs();
}, []);


  // ✅ Filtering + sorting
  const filteredData = useMemo(() => {
    return data
      .filter(
        (row) =>
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

  // ✅ Sorting UI logic
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="sort-icon" />;
    return sortConfig.direction === "asc" ? (
      <FaSortUp className="sort-icon" />
    ) : (
      <FaSortDown className="sort-icon" />
    );
  };

  // ✅ Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
    <div className="activity">
      <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className="compliance-score" style={{ paddingLeft: "45px" }}>
        Activity log
      </div>

      {/* Top Filters & Navigation */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          paddingLeft: "45px",
          paddingRight: "20px",
        }}
      >
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="btn blue-btn" onClick={() => navigate("/BusinessUnit")}>
            Business Unit
          </button>
          <button className="btn blue-btn" onClick={() => navigate("/department")}>
            Departments
          </button>
          <button className="btn blue-btn" onClick={() => navigate("/user")}>
            Users
          </button>
          <button className="btn gray-btn" onClick={() => navigate("/activity")}>
            Activity
          </button>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <div className="search-box">
            <input
              placeholder="Search Dept"
              value={searchDept}
              onChange={(e) => setSearchDept(e.target.value)}
            />
            <FaSearch className="search-icon" />
          </div>

          <div className="search-box">
            <input
              placeholder="Search Email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
            />
            <FaSearch className="search-icon" />
          </div>

          <div className="search-box">
            <input
              placeholder="Search Date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
            />
            <FaSearch className="search-icon" />
          </div>
        </div>
      </div>

      {/* Data Table */}
      <table className="data-table">
        <thead>
          <tr>
            <th onClick={() => requestSort("department")}>
              Department {getSortIcon("department")}
            </th>
            <th onClick={() => requestSort("email")}>
              Email {getSortIcon("email")}
            </th>
            <th onClick={() => requestSort("date")}>
              Date {getSortIcon("date")}
            </th>
            <th onClick={() => requestSort("time")}>
              Time {getSortIcon("time")}
            </th>
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
        <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
          Prev
        </button>

        <span>Page {currentPage} of {totalPages}</span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
