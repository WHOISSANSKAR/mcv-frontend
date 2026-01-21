import React, { useState, useMemo, useEffect } from "react";
import { FaSearch, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import UserSidebar from "./UserSidebar";
import UserHeader from "./UserHeader";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api_call"; // ✅ centralized API
import "./Dashboard.css";

export default function ComplianceList() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedAct, setSelectedAct] = useState("Statutory Compliance");
  const [selectedCountry, setSelectedCountry] = useState("");

  const navigate = useNavigate();

  // ---------------- FETCH ----------------
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
    if (!act || !country) return;

    const fetchComplianceData = async () => {
      try {
        const res = await apiFetch(
          `/compliance/filter?country=${country}&act=${act}`
        );
        if (!Array.isArray(res.records)) return;

        const formatted = res.records.map((r) => ({
          complianceId: String(r.cmplst_id),
          act: act,
          particular: r.cmplst_particular || "",
          description: r.cmplst_description || "",
          longDescription: r.cmplst_long_description || "",
          startDate: r.cmplst_start_date || "",
          actionDate: r.cmplst_action_date || "",
          endDate: r.cmplst_end_date || "",
        }));

        setData(formatted);
      } catch (err) {
        console.error("API error:", err);
      }
    };

    fetchComplianceData();
  }, [navigate]);

  // ---------------- SEARCH (UNCHANGED) ----------------
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

  // ---------------- SORT ----------------
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

  const sortedData = useMemo(() => {
    let sortable = [...filteredData];
    if (sortConfig.key) {
      sortable.sort((a, b) => {
        const A = String(a[sortConfig.key]).toLowerCase();
        const B = String(b[sortConfig.key]).toLowerCase();
        if (A < B) return sortConfig.direction === "asc" ? -1 : 1;
        if (A > B) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortable;
  }, [filteredData, sortConfig]);

  // ---------------- ADD ----------------
  const handleAddClick = (row) => {
    localStorage.setItem("selectedComplianceRow", JSON.stringify(row));
    navigate("/add_compliance");
  };
  // ---------------- UI ----------------
  return (
    <div className="StatutoryInfo">
      <UserSidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <UserHeader menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className="headSection">
        <div className="compliance-score">{selectedAct}</div>
      </div>

      {/* SEARCH – SAME STRUCTURE */}
      <div className="table-header">
        <div></div>
        <div className="table-actions">
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
            <th onClick={() => requestSort("act")}>
              Act {getSortIcon("act")}
            </th>
            <th onClick={() => requestSort("particular")}>
              Particular {getSortIcon("particular")}
            </th>
            <th>Description</th>
            <th>Long Description</th>
            <th>Start Date</th>
            <th>Action Date</th>
            <th>End Date</th>
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
                <td>{item.longDescription}</td>
                <td>{item.startDate}</td>
                <td>{item.actionDate}</td>
                <td>{item.endDate}</td>
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
              <td colSpan="9" style={{ textAlign: "center", padding: "15px" }}>
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
