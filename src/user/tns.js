// TermsOfService.js
import React, { useState } from "react";
import UserHeader from "./UserHeader";
import UserSidebar from "./UserSidebar";

export default function TermsOfService() {
  const [menuOpen, setMenuOpen] = useState(false);

  const termsText = `
Terms of Service
IMPORTANT: You may not use this service prior to reading and agreeing to these terms of service.

Definitions and Interpretations
• “Confidential Information” - Includes, but not limited to, login credentials, passwords, files, databases, configuration, or financial information of the Customer.
• “Content” - Includes copyright-able material, confidential ideas, creatives, information, data, media or any other such content.
• “Customer” - Any Individual person, Company, or organization that has subscribed and Using the Service.
• “Service” - A Cloud based Software Solution named MyComplianceView, pursuant to these Terms of Service.
• “Site” - MyComplianceView website, application and any Subdomains made available to User.
• “Terms of Service” - All the terms and conditions contained or referenced in this document.
• “User” - Any person that accesses or uses this Service.

Eligibility
• By using or accessing the Site or the Service, Customer acknowledges and agrees to these terms of service...
• If any provision of this Terms of Service shall be held to be invalid or unenforceable, the remaining provisions shall continue to be valid and enforceable.

Title and Proprietary Rights
• The title “MyComplianceView”, software and Service are Trade related of Content of F1 InfoTech Pvt. Ltd...
• Customer shall not attempt any activity which involves hacking of source code, reverse engineering, or any other such development...

Technical Support and Services Availability
• The Service Availability depends on factors which are beyond the control of F1 InfoTech Pvt. Ltd...
• The availability and recovery shall be dependent on external factors such as Acts of God, Wars, or any other natural or unnatural events of Force Majeure...
• The Service will be available, except the above mentioned clauses, subject to the advance payment by Customer subscribing the Service...

Data, Data Privacy and Protection
• Data Administration responsibility shall lie with Customer...
• Customer is responsible to take timely backup of data provided to and stored on Service...
• Confidential Information provided to Service will be kept confidential...
• Service or F1 InfoTech Pvt. Ltd, are not liable for any direct, indirect, incidental or consequential data loss...

Unauthorized Activities and Liabilities
• Service prohibits its Customers and any third party not using Service, from attempting to infringe Service’s security...
• Service grants the right of legitimate usage to Customer...
• Customer by accepting the Terms of Service, indemnifies F1 InfoTech Pvt. Ltd., from all liabilities...
• Governing laws of India are applicable. Any dispute arising shall be subject to Delhi jurisdiction only.
`;

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <UserSidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <UserHeader menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <div
          style={{
            flex: 1,
            padding: "20px 40px",
            overflow: "auto",
            backgroundColor: "#f9f9f9",
          }}
        >
          <pre
            style={{
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              lineHeight: "1.5",
              color: "#333",
              margin: 0,
            }}
          >
            {termsText}
          </pre>
        </div>
      </div>
    </div>
  );
}
