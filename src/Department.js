import React, { useState, useEffect } from "react";
import { FaSearch, FaPlusCircle } from "react-icons/fa";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

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

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!isLoggedIn || user.usrlst_role?.toLowerCase() !== "admin") {
      navigate("/", { replace: true });
      return;
    }

    if (!user.usrlst_id) {
      setErrorMsg("User ID not found. Please login again.");
      setLoading(false);
      return;
    }

    const fetchDepartments = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/user/departments/all?user_id=${user.usrlst_id}`
        );

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`API Error: ${response.status} - ${text}`);
        }

        const result = await response.json();

        if (!result || result.error || result.message === "No departments found") {
          setErrorMsg("No Departments found.");
          setDepartments([]);
        } else if (Array.isArray(result) && result.length > 0) {
          const formatted = result.map((row) => ({
            department_id: row.usrdept_id || "N/A",
            department_name: row.usrdept_department_name || "N/A",
            business_unit_name: row.usrbu_business_unit_name || "N/A",
            user_name: row.user_name || "Unknown User",
            user_group_id: row.usrdept_user_group_id || "N/A",
          }));
          setDepartments(formatted);
          setErrorMsg("");
        } else {
          setErrorMsg("No Departments found.");
          setDepartments([]);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setErrorMsg("No Departments found.");
        setDepartments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, [navigate]);

  // 🔹 Filter only by department name
  const filteredData = departments.filter((item) =>
    (item.department_name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));

  return (
    <div className="department">
      <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className="headSection">
        <div className="compliance-score">Departments</div>
        <div className="rightGroup">
          <div className="buttonGroup">
            <button className="headBtn" onClick={() => navigate("/add-user")}>
              <FaPlusCircle className="btnIcon" /> Compliance Zone
            </button>
          </div>
        </div>
      </div>

      <div
        className="table-header"
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginLeft: "45px" }}>
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

        <div className="table-actions" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div className="search-box">
            <input
              placeholder="Search by Department"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="search-icon" />
          </div>
          <button
  className="action-btn primary"
  onClick={() => navigate("/add-department")}
>
  Add Dept
</button>


          <button className="action-btn primary">Export</button>
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
                <th>User Group ID</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                    No data available
                  </td>
                </tr>
              ) : (
                currentRows.map((row, index) => (
                  <tr key={index}>
                    <td>{row.department_name}</td>
                    <td>{row.business_unit_name}</td>
                    <td>{row.user_name}</td>
                    <td>{row.user_group_id}</td>
                    <td>
                      <button className="edit-btn" onClick={() => navigate("/edit-user")}>
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
