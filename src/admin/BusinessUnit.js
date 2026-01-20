import React, { useState, useEffect } from "react";
import { FaSearch, FaPlusCircle } from "react-icons/fa";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function BusinessUnit() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const [data, setData] = useState([]);
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

    const fetchData = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/user/business_unit/all?user_id=${user.usrlst_id}`
        );

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`API error ${res.status} - ${text}`);
        }

        const result = await res.json();

        if (!result || result.error || result.message === "No business units found") {
          setErrorMsg("No Business Units found.");
          setData([]);
        } else if (Array.isArray(result) && result.length > 0) {
          const mapped = result.map((row) => ({
            businessUnitId: row.usrbu_id || "N/A",
            businessUnitName: row.business_unit_name || "N/A",
            userName: row.user_name || "Unknown User",
          }));
          setData(mapped);
          setErrorMsg("");
        } else {
          setErrorMsg("No Business Units found.");
          setData([]);
        }
      } catch (err) {
        console.error(err);
        setErrorMsg("No Business Units found.");
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // ✅ Search across all columns
  const filteredData = data.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));

  const handleAddUnit = () => {
    localStorage.setItem("page", "1");
    navigate("/add-bu");
  };

  const handleEdit = (row) => {
    localStorage.setItem("editBusinessUnitName", row.businessUnitName);
    localStorage.setItem("editBusinessUnitId", row.businessUnitId);
    navigate("/edit-bu");
  };

  // ✅ Export function
  const handleExport = () => {
    if (!filteredData.length) return alert("No data to export");

    const headers = ["Business Unit ID", "Business Unit Name", "User Name"];
    const csvRows = [headers.join(",")];

    filteredData.forEach((row) => {
      const values = [
        row.businessUnitId,
        row.businessUnitName,
        row.userName,
      ].map((v) => `"${v}"`);
      csvRows.push(values.join(","));
    });

    const blob = new Blob([csvRows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "business_units.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="Businessunit">
      <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className="headSection">
        <div className="compliance-score">Business Unit</div>
        <div className="rightGroup">
          <div className="buttonGroup">
           <button
  className="headBtn"
  style={{ backgroundColor: "#fff", color: "black" }}
  onClick={() => navigate("/user_dashboard")}
>
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
          <button className="btn gray-btn" onClick={() => navigate("/BusinessUnit")}>
            Business Unit
          </button>
          <button className="btn blue-btn" onClick={() => navigate("/department")}>
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
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="search-icon" />
          </div>

          <button className="action-btn primary" onClick={handleAddUnit}>
            + Add Unit
          </button>

          <button className="action-btn primary" onClick={handleExport}>
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
                <th>Business Unit ID</th>
                <th>Business Unit Name</th>
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
                currentRows.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.businessUnitId}</td>
                    <td>{row.businessUnitName}</td>
                    <td>{row.userName}</td>
                    <td>
                      <button className="edit-btn" onClick={() => handleEdit(row)}>
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
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
        </>
      )}
    </div>
  );
}
