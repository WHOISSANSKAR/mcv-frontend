import React, { useState, useMemo, useEffect } from "react";
import { FaSearch, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function Upcoming() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const rowsPerPage = 8;

  /* =======================
     DATA MAPPERS
  ======================= */

  const mapRegulatoryCompliance = (item) => ({
    id: item.regcmp_compliance_id,
    email: item.regcmp_approver_email,
    department: item.regcmp_user_group_id,
    act: item.regcmp_compliance_key,
    name: "Regulatory Compliance",
    description: item.regcmp_compliance_document,
    startDate: item.regcmp_requested_date,
    actionDate: item.regcmp_completed_date,
    endDate: "",
    originalDate: "",
    status: item.regcmp_status,
    approver: item.regcmp_approver_email,
    requestDate: item.regcmp_requested_date,
    responseDate: item.regcmp_completed_date,
  });

  const mapSelfCompliance = (item) => ({
    id: item.slfcmp_user_id,
    email: item.slfcmp_approver_email,
    department: item.slfcmp_user_group_id,
    act: item.slfcmp_compliance_key,
    name: "Self Compliance",
    description: item.slfcmp_compliance_document,
    startDate: item.slfcmp_requested_date,
    actionDate: item.slfcmp_completed_date,
    endDate: "",
    originalDate: "",
    status: item.slfcmp_status,
    approver: item.slfcmp_approver_email,
    requestDate: item.slfcmp_requested_date,
    responseDate: item.slfcmp_completed_date,
  });

  /* =======================
     AUTH + DATA FETCH
  ======================= */

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!isLoggedIn || user.usrlst_role?.toLowerCase() !== "admin") {
      navigate("/", { replace: true });
      return;
    }

    const fetchData = async () => {
      try {
        const [regRes, selfRes] = await Promise.all([
          fetch("http://localhost:5000/regulcompliance/upcoming"),
          fetch("http://localhost:5000/report/upcoming"),
        ]);

        const regData = await regRes.json();
        const selfData = await selfRes.json();

        const mergedData = [
          ...regData.map(mapRegulatoryCompliance),
          ...selfData.map(mapSelfCompliance),
        ];

        setData(mergedData);
      } catch (error) {
        console.error("Error fetching upcoming compliances:", error);
      }
    };

    fetchData();
  }, [navigate]);

  /* =======================
     SEARCH
  ======================= */

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter((item) =>
      Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
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
    if (!sortedData.length) return;

    const headers = [
      "Id",
      "Email",
      "Department",
      "Act",
      "Type",
      "Description",
      "Start Date",
      "Action Date",
      "Status",
      "Approver",
      "Request Date",
      "Response Date",
    ];

    const rows = sortedData.map((row) =>
      [
        row.id,
        row.email,
        row.department,
        row.act,
        row.name,
        row.description,
        row.startDate,
        row.actionDate,
        row.status,
        row.approver,
        row.requestDate,
        row.responseDate,
      ]
        .map((v) => `"${v || ""}"`)
        .join(",")
    );

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "upcoming_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /* =======================
     UI
  ======================= */

  return (
    <div className="Upcoming">
      <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className="headSection">
        <div className="compliance-score">Upcoming</div>
      </div>

      <div className="table-header" style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: "10px", marginLeft: "45px" }}>
          <button className="btn blue-btn" onClick={() => navigate("/comprehensive")}>Comprehensive</button>
          <button className="btn blue-btn" onClick={() => navigate("/Compliance")}>Compliance</button>
          <button className="btn blue-btn" onClick={() => navigate("/Approved")}>Approved</button>
          <button className="btn gray-btn" onClick={() => navigate("/Upcoming")}>Upcoming</button>
        </div>

        <div className="table-actions" style={{ display: "flex", gap: "10px" }}>
          <div className="search-box">
            <input
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="search-icon" />
          </div>
          <button className="action-btn primary" onClick={exportToCSV}>
            Export
          </button>
        </div>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th onClick={() => requestSort("id")}>Id {getSortIcon("id")}</th>
            <th onClick={() => requestSort("email")}>Email {getSortIcon("email")}</th>
            <th onClick={() => requestSort("department")}>Department {getSortIcon("department")}</th>
            <th onClick={() => requestSort("act")}>Act {getSortIcon("act")}</th>
            <th onClick={() => requestSort("name")}>Type {getSortIcon("name")}</th>
            <th>Description</th>
            <th>Start Date</th>
            <th>Action Date</th>
            <th>Status</th>
            <th>Approver</th>
            <th>Request Date</th>
            <th>Response Date</th>
          </tr>
        </thead>

        <tbody>
          {currentRows.map((row, idx) => (
            <tr key={idx}>
              <td>{row.id}</td>
              <td>{row.email}</td>
              <td>{row.department}</td>
              <td>{row.act}</td>
              <td>{row.name}</td>
              <td>{row.description}</td>
              <td>{row.startDate}</td>
              <td>{row.actionDate}</td>
              <td>{row.status}</td>
              <td>{row.approver}</td>
              <td>{row.requestDate}</td>
              <td>{row.responseDate}</td>
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
