import React, { useState, useMemo, useEffect } from "react";
import { FaSearch, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function Approved() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Sample data
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

  // Search across all columns
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const term = searchTerm.toLowerCase();
    return data.filter((item) =>
      Object.values(item).some((val) => val.toString().toLowerCase().includes(term))
    );
  }, [data, searchTerm]);

  // Sorting logic
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

  // Export to CSV
  const exportToCSV = () => {
    if (!sortedData || sortedData.length === 0) return;

    const headers = [
      "Id", "Email", "Department", "Act", "Name", "Description", "Start Date",
      "Action Date", "End Date", "Original Date", "Status", "Approver", "Request Date", "Response Date"
    ];

    const csvRows = [headers.join(",")];

    sortedData.forEach((row) => {
      const values = [
        row.id, row.email, row.department, row.act, row.name, row.description,
        row.startDate, row.actionDate, row.endDate, row.originalDate, row.status,
        row.approver, row.requestDate, row.responseDate
      ].map((val) => `"${val || ""}"`);
      csvRows.push(values.join(","));
    });

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "approved_records.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = sortedData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  // Auth check
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!isLoggedIn || user.usrlst_role?.toLowerCase() !== "admin") {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="Approved">
      <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className="headSection">
        <div className="compliance-score">Approved</div>
        <div className="rightGroup">
          <div className="buttonGroup"></div>
        </div>
      </div>

      <div className="table-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginLeft: "45px" }}>
          <button className="btn blue-btn" onClick={() => navigate("/General")}>General</button>
          <button className="btn blue-btn" onClick={() => navigate("/Compliance")}>Compliance</button>
          <button className="btn gray-btn" onClick={() => navigate("/Approved")}>Approved</button>
          <button className="btn blue-btn" onClick={() => navigate("/Upcoming")}>Upcoming</button>
        </div>

        <div className="table-actions" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div className="search-box">
            <input
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="search-icon" />
          </div>
          <button className="action-btn primary" onClick={exportToCSV}>Export</button>
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
            <th>Action</th> {/* NEW COLUMN */}
          </tr>
        </thead>

        <tbody>
          {currentRows.map((row, index) => (
            <tr key={index}>
              <td><div className="label">Id</div><div className="value">{row.id}</div></td>
              <td><div className="label">Email</div><div className="value">{row.email}</div></td>
              <td><div className="label">Department</div><div className="value">{row.department}</div></td>
              <td><div className="label">Act</div><div className="value">{row.act}</div></td>
              <td><div className="label">Name</div><div className="value">{row.name}</div></td>
              <td><div className="label">Description</div><div className="value">{row.description}</div></td>
              <td><div className="label">Start Date</div><div className="value">{row.startDate}</div></td>
              <td><div className="label">Action Date</div><div className="value">{row.actionDate}</div></td>
              <td><div className="label">End Date</div><div className="value">{row.endDate}</div></td>
              <td><div className="label">Original Date</div><div className="value">{row.originalDate}</div></td>
              <td><div className="label">Status</div><div className="value">{row.status}</div></td>
              <td><div className="label">Approver</div><div className="value">{row.approver}</div></td>
              <td><div className="label">Request Date</div><div className="value">{row.requestDate}</div></td>
              <td><div className="label">Response Date</div><div className="value">{row.responseDate}</div></td>

              {/* NEW ACTION BUTTON */}
              <td>
                <span className="label">Action</span>
                <span className="value">
                  <button
                    className="edit-btn"
                    onClick={() => {
                      localStorage.setItem("approveReportData", JSON.stringify(row));
                      navigate("/approve_report");
                    }}
                  >
                    View
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
    </div>
  );
}
