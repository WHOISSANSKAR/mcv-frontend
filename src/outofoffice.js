// OutOfOffice.js
import React, { useState } from "react";
import UserSidebar from "./UserSidebar";
import UserHeader from "./UserHeader";
import "./Dashboard.css";

export default function OutOfOffice() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [alternateEmail, setAlternateEmail] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const action = e.nativeEvent.submitter?.value;

    if (!alternateEmail.trim()) {
      setErrorMsg("Alternate email is required");
      setSuccessMsg("");
      return;
    }

    if (action === "add") {
      // API logic or mock
      console.log("Alternate email added:", alternateEmail);
      setSuccessMsg("✅ Alternate email added successfully!");
      setErrorMsg("");
      setAlternateEmail("");
    } else if (action === "back") {
      console.log("Back in office clicked");
      setSuccessMsg("✅ Notifications reverted to your primary email.");
      setErrorMsg("");
      setAlternateEmail("");
    }
  };

  return (
    <div className="add-user">
      <UserSidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <UserHeader menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className="form-container">
        <h2>Out of Office</h2>

        <div className="form-grid">
          <div className="form-group full-width">
            <p>
              This feature allows you to add an alternate email to receive
              notifications from MyComplianceView.
            </p>
            <p>
              All the mails will also be sent to the Alternate Email when added
              and will be removed once you click the “Back in Office” button.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="add-user-form">
          <label htmlFor="alternate-email">
            Alternate Email
            <input
              type="email"
              id="alternate-email"
              name="alternate_email"
              placeholder="Enter alternate email"
              required
              value={alternateEmail}
              onChange={(e) => setAlternateEmail(e.target.value)}
            />
            {errorMsg && <span className="error">{errorMsg}</span>}
          </label>

          {successMsg && <span className="success-msg">{successMsg}</span>}

          <div className="action-buttons">
            <button
              type="submit"
              name="action"
              value="add"
              className="submit-btn"
            >
              Add Alternate Email
            </button>

            <button
              type="submit"
              name="action"
              value="back"
              className="submit-btn"
            >
              Back in Office
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
