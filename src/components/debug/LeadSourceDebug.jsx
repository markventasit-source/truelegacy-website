import { useEffect, useState } from "react";
import { getLeadSource } from "../../utils/leadSource";

/**
 * Debug component to display lead source tracking status.
 * Add this temporarily to any page to verify lead source is being tracked correctly.
 * 
 * Usage:
 * import LeadSourceDebug from "../components/debug/LeadSourceDebug";
 * 
 * Then in your component:
 * <LeadSourceDebug />
 * 
 * Remove this component in production builds.
 */
const LeadSourceDebug = () => {
  const [leadSource, setLeadSource] = useState("");
  const [urlParams, setUrlParams] = useState("");
  const [sessionStorage, setSessionStorageValue] = useState("");

  useEffect(() => {
    // Get current lead source
    const source = getLeadSource();
    setLeadSource(source);

    // Get URL parameters
    const params = new URLSearchParams(window.location.search);
    setUrlParams(params.toString() || "No parameters");

    // Get raw sessionStorage value
    const stored = window.sessionStorage.getItem("tl_lead_source");
    setSessionStorageValue(stored || "Not set");

    // Log to console
    console.log("🐛 Lead Source Debug:", {
      leadSource: source,
      urlParams: params.toString(),
      sessionStorage: stored,
      currentUrl: window.location.href,
    });
  }, []);

  // Only show in development or when specifically enabled
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        backgroundColor: "#1a1a1a",
        color: "#00ff00",
        padding: "15px",
        borderRadius: "8px",
        fontSize: "12px",
        fontFamily: "monospace",
        maxWidth: "400px",
        zIndex: 9999,
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        border: "2px solid #00ff00",
      }}
    >
      <div style={{ marginBottom: "10px", fontWeight: "bold", fontSize: "14px" }}>
        🐛 Lead Source Debug
      </div>
      <div style={{ marginBottom: "8px" }}>
        <strong>Lead Source:</strong>{" "}
        <span style={{ color: leadSource === "succession-tool-qr" ? "#00ff00" : "#ffff00" }}>
          {leadSource}
        </span>
      </div>
      <div style={{ marginBottom: "8px" }}>
        <strong>URL Params:</strong> <span>{urlParams}</span>
      </div>
      <div style={{ marginBottom: "8px" }}>
        <strong>SessionStorage:</strong>{" "}
        <span style={{ color: sessionStorage === "succession-tool-qr" ? "#00ff00" : "#ffff00" }}>
          {sessionStorage}
        </span>
      </div>
      <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: "1px solid #00ff00" }}>
        <strong>Expected CRM Source:</strong>{" "}
        <span style={{ color: "#00ffff", fontWeight: "bold" }}>
          {leadSource === "succession-tool-qr" ? "QR Code ✅" : 
           leadSource === "succession-tool-event" ? "Event ✅" : 
           "Default (Schedule/Request) ⚠️"}
        </span>
      </div>
      <button
        onClick={() => {
          const stored = window.sessionStorage.getItem("tl_lead_source");
          alert(`Lead Source: ${getLeadSource()}\nSessionStorage: ${stored || "Not set"}`);
        }}
        style={{
          marginTop: "10px",
          padding: "5px 10px",
          backgroundColor: "#00ff00",
          color: "#1a1a1a",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "11px",
          fontWeight: "bold",
        }}
      >
        Show Alert
      </button>
    </div>
  );
};

export default LeadSourceDebug;
