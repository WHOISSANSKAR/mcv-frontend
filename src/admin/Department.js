import React, { useState, useEffect, useMemo } from "react";
import { FaSearch, FaPlusCircle } from "react-icons/fa";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { apiFetch } from "../api_call";

export default function User() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const rowsPerPage = 8;

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  // --- Auth check & fetch departments ---
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!isLoggedIn || user.usrlst_role?.toLowerCase() !== "admin") {
      navigate("/", { replace: true });
      return;
    }

    const fetchDepartments = async () => {
      try {
        const result = await apiFetch("/user/departments/all");

        if (!Array.isArray(result) || result.length === 0) {
          setErrorMsg("No departments found.");
          setDepartments([]);
        } else {
          const formatted = result.map((row) => ({
            department_id: row.usrdept_id || "N/A",
            department_name: row.usrdept_department_name || "N/A",
            business_unit_name: row.usrbu_business_unit_name || "N/A",
            business_unit_id: row.usrdept_user_group_id || "N/A",
            user_name: row.user_name || "Unknown User",
          }));
          setDepartments(formatted);
        }
      } catch (err) {
        console.error("Error loading departments:", err);
        setErrorMsg(err.message || "Failed to load departments.");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, [navigate]);

  // --- Search across all columns ---
  const filteredData = useMemo(() => {
    if (!searchTerm) return departments;

    return departments.filter((item) =>
      Object.values(item).some((val) =>
        (val || "").toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [departments, searchTerm]);

  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));

  const handleEditDepartment = (dept) => {
    localStorage.setItem("editDeptName", dept.department_name);
    localStorage.setItem("editDeptId", dept.department_id);
    localStorage.setItem("editDeptBusinessUnitName", dept.business_unit_name);
    localStorage.setItem("editDeptBusinessUnitId", dept.business_unit_id);
    navigate("/edit-dept");
  };

  // --- Export filtered data to CSV ---
  const exportToCSV = () => {
    if (!filteredData || filteredData.length === 0) return;

    const csvRows = [];
    const headers = ["Department", "Business Unit", "User Name"];
    csvRows.push(headers.join(","));

    filteredData.forEach((row) => {
      const values = [
        row.department_name,
        row.business_unit_name,
        row.user_name,
      ].map((val) => `"${val || ""}"`);
      csvRows.push(values.join(","));
    });

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "departments.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="department">
      <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className="headSection">
        <div className="compliance-score">Departments</div>
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

      <div
        className="table-header"
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginLeft: "45px",
          }}
        >
          <button className="btn blue-btn" onClick={() => navigate("/BusinessUnit")}>
            Business Unit
          </button>
          <button className="btn gray-btn" onClick={() => navigate("/department")}>
            Departments
          </button>
          <button className="btn blue-btn" onClick={() => navigate("/user")}>
            Users
          </button>
          <button className="btn blue-btn" onClick={() => navigate("/activity")}>
            Activity
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

          <button
            className="action-btn primary"
            onClick={() => {
              localStorage.setItem("page", "1");
              navigate("/add-department");
            }}
          >
            + Add Dept
          </button>

          <button className="action-btn primary" onClick={exportToCSV}>
            Export
          </button>
        </div>
      </div>

      {loading ? (
        <p style={{ textAlign: "center", marginTop: "20px" }}>Loading...</p>
      ) : errorMsg ? (
        <p style={{ textAlign: "center", color: "red", marginTop: "20px" }}>{errorMsg}</p>
      ) : (
        <>
          <table className="data-table">
            <thead>
              <tr>
                <th>Department</th>
                <th>Business Unit</th>
                <th>User Name</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {currentRows.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                    No data available
                  </td>
                </tr>
              ) : (
                currentRows.map((row, index) => (
                  <tr key={index}>
                    <td>{row.department_name}</td>
                    <td>{row.business_unit_name}</td>
                    <td>{row.user_name}</td>
                    <td>
                      <button className="edit-btn" onClick={() => handleEditDepartment(row)}>
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
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
        </>
      )}
    </div>
  );
}
