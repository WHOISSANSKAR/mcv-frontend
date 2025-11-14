import React, { useState, useMemo, useEffect } from "react";
import { FaSearch, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import UserSidebar from "./UserSidebar";
import UserHeader from "./UserHeader";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function ComplianceList() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [data, setData] = useState([]); // ✅ Dynamic backend data
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedAct, setSelectedAct] = useState("Statutory Compliance");
  const [selectedCountry, setSelectedCountry] = useState("");

  const navigate = useNavigate();

  // ✅ Load country + act + fetch data
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      navigate("/", { replace: true });
      return;
    }

    const act = localStorage.getItem("selectedAct");
    const country = localStorage.getItem("selectedCountry");

    if (act) setSelectedAct(act);
    if (country) setSelectedCountry(country);

    if (act && country) {
      fetch(
        `http://localhost:5000/compliance/filter?country=${country}&act=${act}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.records) {
            const formatted = data.records.map((item) => ({
              complianceId: "1",
              act: act,
              particular: item.cmplst_particular,
              description: item.cmplst_description,
            }));
            setData(formatted);
          }
        })
        .catch((err) => console.error("API error:", err));
    }
  }, [navigate]);

  // ✅ Search
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(
      (item) =>
        item.complianceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.act.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.particular.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  // ✅ Sorting logic
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc")
      direction = "desc";
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

  const sortedData = useMemo(() => {
    let sortable = [...filteredData];
    if (sortConfig.key) {
      sortable.sort((a, b) => {
        const valA = a[sortConfig.key].toLowerCase();
        const valB = b[sortConfig.key].toLowerCase();

        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortable;
  }, [filteredData, sortConfig]);

  // ✅ Save clicked row + redirect
  const handleAddClick = (row) => {
    localStorage.setItem("selectedComplianceRow", JSON.stringify(row));
    navigate("/add_compliance");
  };

  return (
    <div className="StatutoryInfo">
      <UserSidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <UserHeader menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className="headSection">
        <div className="compliance-score">{selectedAct}</div>
        <div className="rightGroup">
          <div className="buttonGroup"></div>
        </div>
      </div>

      {/* Search & field controls */}
      <div
        className="table-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div></div>

        <div
          className="table-actions"
          style={{ display: "flex", alignItems: "center", gap: "10px" }}
        >
          <div className="search-box">
            <input
              placeholder="Search Compliance..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="search-icon" />
          </div>
        </div>
      </div>

      {/* TABLE */}
      <table className="data-table">
        <thead>
          <tr>
            <th onClick={() => requestSort("complianceId")}>
              Compliance ID {getSortIcon("complianceId")}
            </th>
            <th onClick={() => requestSort("act")}>
              Act {getSortIcon("act")}
            </th>
            <th onClick={() => requestSort("particular")}>
              Particular {getSortIcon("particular")}
            </th>
            <th onClick={() => requestSort("description")}>
              Description {getSortIcon("description")}
            </th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {sortedData.length > 0 ? (
            sortedData.map((item, index) => (
              <tr key={index}>
                <td>{item.complianceId}</td>
                <td>{item.act}</td>
                <td>{item.particular}</td>
                <td>{item.description}</td>

                {/* ✅ Add button with save functionality */}
                <td>
                  <button
                    className="action-btn primary"
                    onClick={() => handleAddClick(item)}
                  >
                    Add
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "15px" }}>
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
