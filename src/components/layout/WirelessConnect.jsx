import { useState } from "react";
import { useSerial } from "../../context/SerialContext";

export default function WirelessConnect() {
  const {
    wsConnected,
    wsStatus,
    wsError,
    connectWireless,
    disconnectWireless,
  } = useSerial();

  const [showPopup, setShowPopup] = useState(false);
  const [ip, setIp]               = useState("192.168.1.");

  const handleConnect = () => {
    connectWireless(ip);
    setShowPopup(false);
  };

  const handleDisconnect = () => {
    disconnectWireless();
  };

  // ── Status dot color ──────────────────────────────────────────────────────
  const dotColor = {
    disconnected: "var(--text-muted)",
    connecting:   "#FFD93D",
    connected:    "var(--accent)",
    error:        "var(--danger)",
  }[wsStatus];

  return (
    <div style={{ position: "relative" }}>

      {/* ── Button ─────────────────────────────────────────────────────────── */}
      {wsConnected ? (
        <button
          onClick={handleDisconnect}
          style={styles.btnConnected}
          title="Disconnect wireless"
        >
          <span style={{ ...styles.dot, background: dotColor }} />
          WiFi Connected
        </button>
      ) : (
        <button
          onClick={() => setShowPopup((p) => !p)}
          style={styles.btnIdle}
          title="Connect via WiFi"
        >
          <span style={{ ...styles.dot, background: dotColor }} />
          {wsStatus === "connecting" ? "Connecting…" : "Connect Wireless"}
        </button>
      )}

      {/* ── IP Input Popup ─────────────────────────────────────────────────── */}
      {showPopup && !wsConnected && (
        <>
          {/* backdrop — click outside to close */}
          <div style={styles.backdrop} onClick={() => setShowPopup(false)} />

          <div style={styles.popup}>
            <p style={styles.popupTitle}>📡 Connect via WiFi</p>
            <p style={styles.popupHint}>
              ESP32 IP address — check Serial Monitor or your router
            </p>

            <input
              style={styles.input}
              type="text"
              value={ip}
              placeholder="192.168.1.47"
              onChange={(e) => setIp(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleConnect()}
              autoFocus
              spellCheck={false}
            />

            {/* Error message */}
            {wsError && (
              <p style={styles.errorMsg}>⚠ {wsError}</p>
            )}

            <div style={styles.popupActions}>
              <button
                style={styles.btnCancel}
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
              <button
                style={styles.btnConfirm}
                onClick={handleConnect}
              >
                Connect →
              </button>
            </div>

            <p style={styles.popupFooter}>
              Connects to <code style={styles.code}>ws://{ip}:81</code>
            </p>
          </div>
        </>
      )}
    </div>
  );
}

// ── Styles ──────────────────────────────────────────────────────────────────
const styles = {
  btnIdle: {
    display:        "flex",
    alignItems:     "center",
    gap:            "7px",
    padding:        "7px 14px",
    borderRadius:   "8px",
    border:         "1px solid var(--border)",
    background:     "var(--bg-elevated)",
    color:          "var(--text-secondary)",
    fontSize:       "13px",
    cursor:         "pointer",
    transition:     "all 0.2s",
    whiteSpace:     "nowrap",
  },
  btnConnected: {
    display:        "flex",
    alignItems:     "center",
    gap:            "7px",
    padding:        "7px 14px",
    borderRadius:   "8px",
    border:         "1px solid var(--accent)",
    background:     "var(--accent-dim)",
    color:          "var(--accent)",
    fontSize:       "13px",
    cursor:         "pointer",
    transition:     "all 0.2s",
    whiteSpace:     "nowrap",
  },
  dot: {
    width:          "8px",
    height:         "8px",
    borderRadius:   "50%",
    display:        "inline-block",
    flexShrink:     0,
  },
  backdrop: {
    position:       "fixed",
    inset:          0,
    zIndex:         999,
  },
  popup: {
    position:       "absolute",
    top:            "calc(100% + 10px)",
    right:          0,
    zIndex:         1000,
    background:     "var(--bg-elevated)",
    border:         "1px solid var(--border)",
    borderRadius:   "12px",
    padding:        "18px 20px",
    width:          "290px",
    boxShadow:      "0 8px 32px rgba(0,0,0,0.4)",
  },
  popupTitle: {
    margin:         "0 0 4px 0",
    fontSize:       "14px",
    fontWeight:     600,
    color:          "var(--text-primary)",
  },
  popupHint: {
    margin:         "0 0 12px 0",
    fontSize:       "12px",
    color:          "var(--text-secondary)",
    lineHeight:     1.4,
  },
  input: {
    width:          "100%",
    padding:        "9px 12px",
    borderRadius:   "8px",
    border:         "1px solid var(--border)",
    background:     "var(--bg-card)",
    color:          "var(--text-primary)",
    fontSize:       "14px",
    outline:        "none",
    fontFamily:     "monospace",
    boxSizing:      "border-box",
  },
  errorMsg: {
    margin:         "8px 0 0 0",
    fontSize:       "12px",
    color:          "var(--danger)",
    lineHeight:     1.4,
  },
  popupActions: {
    display:        "flex",
    gap:            "8px",
    marginTop:      "14px",
  },
  btnCancel: {
    flex:           1,
    padding:        "8px",
    borderRadius:   "8px",
    border:         "1px solid var(--border)",
    background:     "transparent",
    color:          "var(--text-secondary)",
    fontSize:       "13px",
    cursor:         "pointer",
  },
  btnConfirm: {
    flex:           1,
    padding:        "8px",
    borderRadius:   "8px",
    border:         "none",
    background:     "var(--accent)",
    color:          "#000",
    fontSize:       "13px",
    fontWeight:     600,
    cursor:         "pointer",
  },
  popupFooter: {
    margin:         "10px 0 0 0",
    fontSize:       "11px",
    color:          "var(--text-muted)",
    textAlign:      "center",
  },
  code: {
    fontFamily:     "monospace",
    color:          "var(--text-secondary)",
  },
};