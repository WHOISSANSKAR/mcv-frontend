import React, { useState, useMemo, useEffect } from "react";
import { FaSearch, FaPlusCircle, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function User() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const rowsPerPage = 8;
  const navigate = useNavigate();

  // Check admin access and fetch data
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!isLoggedIn || user.usrlst_role?.toLowerCase() !== "admin") {
      navigate("/", { replace: true });
      return;
    }

    async function fetchUsers() {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/user/list");
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const users = await response.json();
        setData(users);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError("Failed to fetch users from server.");
        setLoading(false);
      }
    }

    fetchUsers();
  }, [navigate]);

  // Search filtering
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(
      item =>
        (item.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.email || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  // Sorting
  const sortedData = useMemo(() => {
    let sortable = [...filteredData];
    if (sortConfig.key) {
      sortable.sort((a, b) => {
        const valA = (a[sortConfig.key] || "").toString().toLowerCase();
        const valB = (b[sortConfig.key] || "").toString().toLowerCase();
        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortable;
  }, [filteredData, sortConfig]);

  const requestSort = key => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  const getSortIcon = key => {
    if (sortConfig.key !== key) return <FaSort className="sort-icon" />;
    return sortConfig.direction === "asc" ? <FaSortUp className="sort-icon" /> : <FaSortDown className="sort-icon" />;
  };

  // Pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = sortedData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  return (
    <div className="user">
      <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className="headSection">
        <div className="compliance-score">Departmental Users</div>
        <div className="rightGroup">
          <div className="buttonGroup">
            <button className="headBtn" onClick={() => navigate("/user_dashboard")}>
              <FaPlusCircle className="btnIcon" /> Compliance Zone
            </button>
          </div>
        </div>
      </div>

      <div className="table-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginLeft: "45px" }}>
          <button className="btn blue-btn" onClick={() => navigate("/BusinessUnit")}>Business Unit</button>
          <button className="btn blue-btn" onClick={() => navigate("/department")}>Departments</button>
          <button className="btn gray-btn" onClick={() => navigate("/user")}>Users</button>
          <button className="btn blue-btn" onClick={() => navigate("/activity")}>Activity</button>
        </div>

        <div className="table-actions" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div className="search-box">
            <input
              placeholder="Search by Name or Email"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <FaSearch className="search-icon" />
          </div>
          
          <button className="action-btn primary" onClick={() => navigate("/add-user")}>
            + Add User
          </button>
          <button className="action-btn primary">Export</button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", margin: "30px" }}>Loading users...</div>
      ) : error ? (
        <div style={{ textAlign: "center", margin: "30px", color: "red" }}>{error}</div>
      ) : (
        <>
          <table className="data-table">
            <thead>
              <tr>
                <th onClick={() => requestSort("name")}>Name {getSortIcon("name")}</th>
                <th onClick={() => requestSort("email")}>E-mail {getSortIcon("email")}</th>
                <th onClick={() => requestSort("contact")}>Contact {getSortIcon("contact")}</th>
                <th onClick={() => requestSort("company_name")}>Company {getSortIcon("company_name")}</th>
                <th onClick={() => requestSort("business_unit")}>Business Unit {getSortIcon("business_unit")}</th>
                <th onClick={() => requestSort("department")}>Department {getSortIcon("department")}</th>
                <th>Escalation E-mail</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {currentRows.map((row, index) => (
                <tr key={index}>
                  <td><span className="label">Name</span><span className="value">{row.name}</span></td>
                  <td><span className="label">E-mail</span><span className="value">{row.email}</span></td>
                  <td><span className="label">Contact</span><span className="value">{row.contact}</span></td>
                  <td><span className="label">Company</span><span className="value">{row.company_name}</span></td>
                  <td><span className="label">Business Unit</span><span className="value">{row.business_unit}</span></td>
                  <td><span className="label">Department</span><span className="value">{row.department}</span></td>
                  <td><span className="label">Escalation E-mail</span><span className="value">{row.escalation_mail}</span></td>
                  <td>
                    <span className="label">Action</span>
                    <span className="value">
                      <button
                        className="edit-btn"
                        onClick={() => {
                          localStorage.setItem("editUserData", JSON.stringify(row));
                          navigate("/edit-user");
                        }}
                      >
                        Edit
                      </button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Prev</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</button>
          </div>
        </>
      )}
    </div>
  );
}
