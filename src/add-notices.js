// DPDPAView.jsx
import React, { useState } from "react";
import UserHeader from "./UserHeader";
import UserSidebar from "./UserSidebar";

export default function AddNotices() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <UserSidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <UserHeader menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <main
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <h1>Add Notices</h1>
        </main>
      </div>
    </div>
  );
}
