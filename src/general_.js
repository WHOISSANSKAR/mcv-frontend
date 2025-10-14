import React, { useState, useMemo , useEffect} from "react";
import { FaSearch, FaPlusCircle, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import UserSidebar from "./UserSidebar";
import UserHeader from "./UserHeader";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function General() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const initialData = Array.from({ length: 35 }, (_, i) => ({
    department: `Dept ${i + 1}`,
    name: `User ${i + 1}`,
    email: `user${i + 1}@mail.com`,
    company: `Company ${Math.ceil((i + 1) / 5)}`,
    contact: `+91-99999${i + 100}`,
    escalation: "kunal@infotech.com",
    businessUnit: "Unit 1",
  }));

  const [data] = useState(initialData);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // <-- single search bar
  const rowsPerPage = 8;

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const sortedData = useMemo(() => {
    let sortable = [...filteredData];
    if (sortConfig.key) {
      sortable.sort((a, b) => {
        const valA = a[sortConfig.key].toString().toLowerCase();
        const valB = b[sortConfig.key].toString().toLowerCase();
        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortable;
  }, [filteredData, sortConfig]);

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
  const currentRows = sortedData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!isLoggedIn || user.usrlst_role?.toLowerCase() !== "admin") {
      navigate("/", { replace: true }); // redirect non-admins to login/home
    }
  }, [navigate]);
  return (
    <div className="general_">
      <UserSidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <UserHeader menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className="headSection">
        <div className="compliance-score">General Report</div>
        <div className="rightGroup">
          <div className="buttonGroup">
            
          </div>
        </div>
      </div>

      <div className="table-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginLeft: "45px" }}>
          
          
        </div>

        <div className="table-actions" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div className="search-box">
            <input
              placeholder="Search by Name or Email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="search-icon" />
          </div>
          
         
          <button className="action-btn primary">Export</button>
        </div>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th onClick={() => requestSort("department")}>Department {getSortIcon("department")}</th>
            <th onClick={() => requestSort("name")}>Name {getSortIcon("name")}</th>
            <th onClick={() => requestSort("email")}>E-mail {getSortIcon("email")}</th>
            <th onClick={() => requestSort("company")}>Company {getSortIcon("company")}</th>
            <th onClick={() => requestSort("contact")}>Contact {getSortIcon("contact")}</th>
            <th>Escalation E-mail</th>
            <th>Business Unit</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {currentRows.map((row, index) => (
            <tr key={index}>
              <td><b>{row.department}</b></td>
              <td>{row.name}</td>
              <td>{row.email}</td>
              <td>{row.company}</td>
              <td>{row.contact}</td>
              <td>{row.escalation}</td>
              <td>{row.businessUnit}</td>
              <td>
                <button className="edit-btn" onClick={() => navigate("/edit-user")}>
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
    </div>
  );
}
