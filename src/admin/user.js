import React, { useState, useMemo, useEffect } from "react";
import { FaSearch, FaPlusCircle, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api_call"; // centralized API helper
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

  /* =======================
     AUTH + FETCH USERS
  ======================= */
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!isLoggedIn || user.usrlst_role?.toLowerCase() !== "admin") {
      navigate("/", { replace: true });
      return;
    }

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const users = await apiFetch("/user/list", "GET");
        setData(users);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError("Failed to fetch users from server.");
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  /* =======================
     SEARCH
  ======================= */
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const lower = searchTerm.toLowerCase();
    return data.filter(item =>
      Object.values(item).some(val =>
        (val || "").toString().toLowerCase().includes(lower)
      )
    );
  }, [data, searchTerm]);

  /* =======================
     SORTING
  ======================= */
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

  /* =======================
     PAGINATION
  ======================= */
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = sortedData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  /* =======================
     EXPORT CSV
  ======================= */
  const exportToCSV = () => {
    if (!sortedData || sortedData.length === 0) return;

    const headers = [
      "Name","E-mail","Contact","Company","Business Unit","Department","Escalation E-mail"
    ];
    const rows = sortedData.map(row =>
      [
        row.name,row.email,row.contact,row.company_name,row.business_unit,row.department,row.escalation_mail
      ].map(val => `"${val || ""}"`).join(",")
    );

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "users.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /* =======================
     UI
  ======================= */
  return (
    <div className="user">
      <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className="headSection">
        <div className="compliance-score">Departmental Users</div>
        <div className="rightGroup">
          <button
            className="headBtn"
            style={{ backgroundColor: "#fff", color: "black" }}
            onClick={() => navigate("/user_dashboard")}
          >
            <FaPlusCircle className="btnIcon" /> Compliance Zone
          </button>
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
            <input placeholder="Search" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            <FaSearch className="search-icon" />
          </div>
          <button className="action-btn primary" onClick={() => navigate("/add-user")}>+ Add User</button>
          <button className="action-btn primary" onClick={exportToCSV}>Export</button>
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
              {currentRows.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.name}</td>
                  <td>{row.email}</td>
                  <td>{row.contact}</td>
                  <td>{row.company_name}</td>
                  <td>{row.business_unit}</td>
                  <td>{row.department}</td>
                  <td>{row.escalation_mail}</td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => {
                        localStorage.setItem("editUserData", JSON.stringify(row));
                        navigate("/edit-user");
                      }}
                    >
                      Edit
                    </button>
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
