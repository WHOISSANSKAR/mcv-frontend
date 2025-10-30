import React, { useState, useMemo, useEffect } from "react";
import { FaSearch, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import UserSidebar from "./UserSidebar";
import UserHeader from "./UserHeader";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function ComplianceList() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const initialData = [
    {
      complianceId: "REGSTFACTORIES01",
      act: "FACTORIES ACT",
      particular: "REFER TO STATE RULES - I",
      description: "RETURN: ANNUAL RETURN",
    },
    {
      complianceId: "REGSTFACTORIES02",
      act: "FACTORIES ACT",
      particular: "REFER TO STATE RULES - II",
      description: "RETURN: APPLICATION FOR RENEWAL OF LICENSE",
    },
    {
      complianceId: "REGSTFACTORIES03",
      act: "FACTORIES ACT",
      particular: "REFER TO STATE RULES - III",
      description: "RETURN: HALF YEARLY RETURN",
    },
  ];

  const [data] = useState(initialData);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAct, setSelectedAct] = useState("Statutory Compliance");

 useEffect(() => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  if (!isLoggedIn) {
    navigate("/", { replace: true });
  }

  // ✅ Get the exact name from localStorage
  const savedAct = localStorage.getItem("selectedAct");
  if (savedAct) {
    setSelectedAct(savedAct); // directly show exact name
  }
}, [navigate]);


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

      <div
        className="table-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginLeft: "45px",
          }}
        ></div>

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

      <table className="data-table">
        <thead>
          <tr>
            <th onClick={() => requestSort("complianceId")}>
              Compliance ID {getSortIcon("complianceId")}
            </th>
            <th onClick={() => requestSort("act")}>Act {getSortIcon("act")}</th>
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
                <td>
                  <button
                    className="action-btn primary"
                    onClick={() => navigate("/add_compliance")}
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
