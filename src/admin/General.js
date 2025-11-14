import React, { useState, useMemo, useEffect } from "react";
import { FaSearch, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function General() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const initialData = Array.from({ length: 35 }, (_, i) => ({
    id: i + 1,
    email: `user${i + 1}@mail.com`,
    department: `Dept ${((i % 5) + 1)}`,
    act: `Act ${i + 10}`,
    name: `User ${i + 1}`,
    description: `This is a sample description ${i + 1}`,
    startDate: `2025-01-${(i % 28) + 1}`,
    actionDate: `2025-02-${(i % 28) + 1}`,
    endDate: `2025-03-${(i % 28) + 1}`,
    originalDate: `2025-04-${(i % 28) + 1}`,
    status: i % 2 === 0 ? "Pending" : "Approved",
    approver: `Approver ${((i % 4) + 1)}`,
    requestDate: `2025-05-${(i % 28) + 1}`,
    responseDate: `2025-06-${(i % 28) + 1}`,
  }));

  const [data] = useState(initialData);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const rowsPerPage = 8;

  // ✅ Search across all columns
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter((item) =>
      Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  // ✅ Sorting
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
    return sortConfig.direction === "asc" ? (
      <FaSortUp className="sort-icon" />
    ) : (
      <FaSortDown className="sort-icon" />
    );
  };

  // ✅ Pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = sortedData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  // ✅ Auth guard
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!isLoggedIn || user.usrlst_role?.toLowerCase() !== "admin") {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  // ✅ Export full (filtered + sorted) data as CSV
  const exportToCSV = () => {
    if (!sortedData.length) return;

    const headers = [
      "Id",
      "Email",
      "Department",
      "Act",
      "Name",
      "Description",
      "Start Date",
      "Action Date",
      "End Date",
      "Original Date",
      "Status",
      "Approver",
      "Request Date",
      "Response Date",
    ];
    const csvRows = [];
    csvRows.push(headers.join(","));

    sortedData.forEach((row) => {
      const values = [
        row.id,
        row.email,
        row.department,
        row.act,
        row.name,
        row.description,
        row.startDate,
        row.actionDate,
        row.endDate,
        row.originalDate,
        row.status,
        row.approver,
        row.requestDate,
        row.responseDate,
      ].map((v) => `"${v || ""}"`);
      csvRows.push(values.join(","));
    });

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "general_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="General">
      <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className="headSection">
        <div className="compliance-score">General Report</div>
        <div className="rightGroup">
          <div className="buttonGroup"></div>
        </div>
      </div>

      <div
        className="table-header"
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginLeft: "45px" }}>
          <button className="btn gray-btn" onClick={() => navigate("/General")}>
            General
          </button>
          <button className="btn blue-btn" onClick={() => navigate("/Compliance")}>
            Compliance
          </button>
          <button className="btn blue-btn" onClick={() => navigate("/Approved")}>
            Approved
          </button>
          <button className="btn blue-btn" onClick={() => navigate("/Upcoming")}>
            Upcoming
          </button>
        </div>

        <div
          className="table-actions"
          style={{ display: "flex", alignItems: "center", gap: "10px" }}
        >
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
            <th onClick={() => requestSort("name")}>Name {getSortIcon("name")}</th>
            <th>Description</th>
            <th>Start Date</th>
            <th>Action Date</th>
            <th>End Date</th>
            <th>Original Date</th>
            <th>Status</th>
            <th>Approver</th>
            <th>Request Date</th>
            <th>Response Date</th>
          </tr>
        </thead>

        <tbody>
          {currentRows.map((row, index) => (
            <tr key={index}>
              <td>{row.id}</td>
              <td>{row.email}</td>
              <td>{row.department}</td>
              <td>{row.act}</td>
              <td>{row.name}</td>
              <td>{row.description}</td>
              <td>{row.startDate}</td>
              <td>{row.actionDate}</td>
              <td>{row.endDate}</td>
              <td>{row.originalDate}</td>
              <td>{row.status}</td>
              <td>{row.approver}</td>
              <td>{row.requestDate}</td>
              <td>{row.responseDate}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
          Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
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
