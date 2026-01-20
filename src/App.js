// App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./LoginPage.jsx";
import Dashboard from "./admin/Dashboard";
import User from "./admin/user";
import Activity from "./admin/activity";
import AddUser from "./admin/add-user";
import EditUser from "./admin/edit-user";
import AddBU from "./admin/AddBu";
import BusinessUnit from "./admin/BusinessUnit";
import DPDPDashboard from "./admin/DPDPDashboard";
import AddDepartment from "./admin/AddDepartment";
import Department from "./admin/Department";
import Restore from "./admin/Restore";
import Settings from "./admin/Settings";
import Accounts from "./admin/Accounts";
import General from "./admin/General";
import Upcoming from "./admin/Upcoming";
import Approved from "./admin/Approved";
import Compliance from "./admin/Compliance";
import ESGDashboard from "./admin/ESGDashboard";
import UserDashboard from "./user/UserDashboard";
import CompanyForm from "./usergroupform";
import EditBu from "./admin/edit-bu"
import EditDept from "./admin/edit-dept";
import ApproveReport from "./admin/ApproveReport";
import AssessmentPage from "./user/Assessment";
import RestoreUser from "./admin/RestoreUser";
// App.js — Correct imports (exact filenames)
import AddStatutory from "./user/add-statutory";
import AddSelf from "./user/add-self";
import AddDc from "./user/add-dc";
import AddGeo from "./user/add-geo";
import AddDpdp from "./user/add-dpdp";
import AddCyber from "./user/add-cyber";
import AddNotices from "./user/add-notices";
import EditCompliance from "./user/edit-compliance.js";
import StatutoryInfo from "./user/statutory_info.js";
import AddAdminForm from "./AddAdminForm";
import AddCompliance from "./user/add_compliance.js";
import ManageStatutory from "./user/manage-statutory";
import ManageSelf from "./user/manage-self";
import ManageDc from "./user/manage-dc";
import ManageGeo from "./user/manage-geo";
import ManageDpdp from "./user/manage-dpdp";
import ManageCyber from "./user/manage-cyber";
import ManageNotices from "./user/manage-notices";
import NotFound from "./user/notfound_";
import General_ from "./user/general_";
import Report_ from "./user/report_";
import Settings_ from "./user/settings_";
import OutOfOffice from "./user/outofoffice";
import Tns from "./user/tns";
import DPDPAStart from "./user/DPDPA-start";
import DPDPAView from "./user/DPDPA-view";
import DPDPStart from "./user/DPDP-start";
import DPDPAtest from "./user/DPDP_test";
import DPDPView from "./user/DPDP-view";


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
        <Route
  path="/edit-dept"
  element={
    <ProtectedRoute roles={["admin"]}>
      <EditDept />
    </ProtectedRoute>
  }
/>

<Route
  path="/approve_report"
  element={
    <ProtectedRoute roles={["admin"]}>
      <ApproveReport />
    </ProtectedRoute>
  }
/>
<Route
  path="/restore_user"
  element={
    <ProtectedRoute roles={["admin"]}>
      <RestoreUser />
    </ProtectedRoute>
  }
/>
<Route path="/add-admin" element={<AddAdminForm />} />

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
          path="/edit-bu"
          element={
            <ProtectedRoute roles={["admin"]}>
              <EditBu />
            </ProtectedRoute>
          }
        />
     <Route path="/user_group" element={<CompanyForm />} />

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
          path="/dpdp_dashboard"
          element={
            <ProtectedRoute roles={["admin"]}>
              <DPDPDashboard />
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
          path="/comprehensive"
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
            <ProtectedRoute roles={[ "admin"]}>
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
  path="/statutory_info"
  element={
    <ProtectedRoute roles={["user", "admin"]}>
      <StatutoryInfo />
    </ProtectedRoute>
  }
/>
<Route
  path="/assessment"
  element={
    <ProtectedRoute roles={["user", "admin"]}>
      <AssessmentPage/>
    </ProtectedRoute>
  }
/>
<Route
  path="/DPDPA_test"
  element={
    <ProtectedRoute roles={["user", "admin"]}>
      <DPDPAtest/>
    </ProtectedRoute>
  }
/>
 
<Route
  path="/edit-compliance"
  element={
    <ProtectedRoute roles={["user", "admin"]}>
      <EditCompliance />
    </ProtectedRoute>
  }
/>
<Route
  path="/add_compliance"
  element={
    <ProtectedRoute roles={["user", "admin"]}>
      <AddCompliance />
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
