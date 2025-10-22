// App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./LoginPage.jsx";
import Dashboard from "./Dashboard";
import User from "./user";
import Activity from "./activity";
import AddUser from "./add-user";
import EditUser from "./edit-user";
import AddBU from "./AddBu";
import BusinessUnit from "./BusinessUnit";
import AddDepartment from "./AddDepartment";
import Department from "./Department";
import Restore from "./Restore";
import Settings from "./Settings";
import Accounts from "./Accounts";
import General from "./General";
import Upcoming from "./Upcoming";
import Approved from "./Approved";
import Compliance from "./Compliance";
import ESGDashboard from "./ESGDashboard";
import UserDashboard from "./UserDashboard";
import CompanyForm from "./usergroupform";

// App.js — Correct imports (exact filenames)
import AddStatutory from "./add-statutory";
import AddSelf from "./add-self";
import AddDc from "./add-dc";
import AddGeo from "./add-geo";
import AddDpdp from "./add-dpdp";
import AddCyber from "./add-cyber";
import AddNotices from "./add-notices";

import ManageStatutory from "./manage-statutory";
import ManageSelf from "./manage-self";
import ManageDc from "./manage-dc";
import ManageGeo from "./manage-geo";
import ManageDpdp from "./manage-dpdp";
import ManageCyber from "./manage-cyber";
import ManageNotices from "./manage-notices";
import NotFound from "./notfound_";
import General_ from "./general_";
import Report_ from "./report_";
import Settings_ from "./settings_";
import OutOfOffice from "./outofoffice";
import Tns from "./tns";
import DPDPAStart from "./DPDPA-start";
import DPDPAView from "./DPDPA-view";
import DPDPStart from "./DPDP-start";
import DPDPView from "./DPDP-view";


// ProtectedRoute component
function ProtectedRoute({ children, roles }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!isLoggedIn) return <Navigate to="/" replace />;

  // If roles are defined, check if user's role matches
  if (roles && !roles.includes(user.usrlst_role?.toLowerCase())) {
    return <Navigate to="/user_dashboard" replace />;
  }

  return children;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        {/* Login Page */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" />
            ) : (
              <LoginPage setIsLoggedIn={setIsLoggedIn} />
            )
          }
        />

        {/* Admin Routes */}
        <Route
          path="/add-user"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AddUser />
            </ProtectedRoute>
          }
        />
       <Route
  path="/user_group"
  element={
    <ProtectedRoute roles={["admin"]}>
      <CompanyForm />
    </ProtectedRoute>
  }
/>
        <Route
          path="/edit-user"
          element={
            <ProtectedRoute roles={["admin"]}>
              <EditUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-bu"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AddBU />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-department"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AddDepartment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/BusinessUnit"
          element={
            <ProtectedRoute roles={["admin"]}>
              <BusinessUnit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Restore"
          element={
            <ProtectedRoute roles={["admin"]}>
              <Restore />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Settings"
          element={
            <ProtectedRoute roles={["admin"]}>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Accounts"
          element={
            <ProtectedRoute roles={["admin"]}>
              <Accounts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/General"
          element={
            <ProtectedRoute roles={["admin"]}>
              <General />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Upcoming"
          element={
            <ProtectedRoute roles={["admin"]}>
              <Upcoming />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Approved"
          element={
            <ProtectedRoute roles={["admin"]}>
              <Approved />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Compliance"
          element={
            <ProtectedRoute roles={["admin"]}>
              <Compliance />
            </ProtectedRoute>
          }
        />

        {/* ESG Dashboard */}
        <Route
          path="/ESG"
          element={
            <ProtectedRoute roles={["user", "admin"]}>
              <ESGDashboard />
            </ProtectedRoute>
          }
        />

        {/* ADD Routes */}
        <Route
          path="/add-statutory"
          element={
            <ProtectedRoute roles={["user", "admin"]}>
              <AddStatutory />
            </ProtectedRoute>
          }
        />
       <Route
  path="/notfound"
  element={
    <ProtectedRoute roles={["user", "admin"]}>
      <NotFound />
    </ProtectedRoute>
  }
/>

        <Route
          path="/add-self"
          element={
            <ProtectedRoute roles={["user", "admin"]}>
              <AddSelf />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-dc"
          element={
            <ProtectedRoute roles={["user", "admin"]}>
              <AddDc />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-geo"
          element={
            <ProtectedRoute roles={["user", "admin"]}>
              <AddGeo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-dpdp"
          element={
            <ProtectedRoute roles={["user", "admin"]}>
              <AddDpdp />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-cyber"
          element={
            <ProtectedRoute roles={["user", "admin"]}>
              <AddCyber />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-notices"
          element={
            <ProtectedRoute roles={["user", "admin"]}>
              <AddNotices />
            </ProtectedRoute>
          }
        />

        {/* MANAGE Routes */}
        <Route
          path="/manage-statutory"
          element={
            <ProtectedRoute roles={["user", "admin"]}>
              <ManageStatutory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-self"
          element={
            <ProtectedRoute roles={["user", "admin"]}>
              <ManageSelf />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-dc"
          element={
            <ProtectedRoute roles={["user", "admin"]}>
              <ManageDc />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-geo"
          element={
            <ProtectedRoute roles={["user", "admin"]}>
              <ManageGeo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-dpdp"
          element={
            <ProtectedRoute roles={["user", "admin"]}>
              <ManageDpdp />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-cyber"
          element={
            <ProtectedRoute roles={["user", "admin"]}>
              <ManageCyber />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-notices"
          element={
            <ProtectedRoute roles={["user", "admin"]}>
              <ManageNotices />
            </ProtectedRoute>
          }
        />

        {/* General / Report / Settings (User accessible) */}
        <Route
          path="/general_"
          element={
            <ProtectedRoute roles={["user", "admin"]}>
              <General_ />
            </ProtectedRoute>
          }
        />
        <Route
          path="/report_"
          element={
            <ProtectedRoute roles={["user", "admin"]}>
              <Report_ />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings_"
          element={
            <ProtectedRoute roles={["user", "admin"]}>
              <Settings_ />
            </ProtectedRoute>
          }
        />

        {/* Other Routes */}
        <Route
          path="/outofoffice"
          element={
            <ProtectedRoute roles={["user", "admin"]}>
              <OutOfOffice />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tns"
          element={
            <ProtectedRoute roles={["user", "admin"]}>
              <Tns />
            </ProtectedRoute>
          }
        />
        <Route
          path="/DPDPA-start"
          element={
            <ProtectedRoute roles={["user", "admin"]}>
              <DPDPAStart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/DPDPA-view"
          element={
            <ProtectedRoute roles={["user", "admin"]}>
              <DPDPAView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/DPDP-start"
          element={
            <ProtectedRoute roles={["user", "admin"]}>
              <DPDPStart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/DPDP-view"
          element={
            <ProtectedRoute roles={["user", "admin"]}>
              <DPDPView />
            </ProtectedRoute>
          }
        />

        {/* Dashboards */}
        <Route
          path="/user_dashboard"
          element={
            <ProtectedRoute roles={["user", "admin"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={["admin"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Open Routes */}
        <Route path="/user" element={<User />} />
        <Route path="/activity" element={<Activity />} />
        <Route path="/Department" element={<Department />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
