import { useSerial } from "../../context/SerialContext";
import WirelessConnect from "./WirelessConnect";

export default function SerialConnect() {
  const { isConnected, isSupported, error, connect, disconnect } = useSerial();

  return (
    <div style={styles.wrapper}>

      {/* ── USB Serial Button (unchanged) ─────────────────────────────────── */}
      {isSupported ? (
        isConnected ? (
          <button onClick={disconnect} style={styles.btnConnected} title="Disconnect USB">
            <span style={{ ...styles.dot, background: "var(--accent)" }} />
            USB Connected
          </button>
        ) : (
          <button onClick={connect} style={styles.btnIdle} title="Connect via USB Serial">
            <span style={{ ...styles.dot, background: "var(--text-muted)" }} />
            Connect USB
          </button>
        )
      ) : (
        <span style={styles.unsupported} title="Use Chrome for Web Serial">
          Serial N/A
        </span>
      )}

      {/* ── Error (USB) ───────────────────────────────────────────────────── */}
      {error && (
        <span style={styles.error} title={error}>⚠</span>
      )}

      {/* ── Wireless Connect Button ───────────────────────────────────────── */}
      <WirelessConnect />

    </div>
  );
}

const styles = {
  wrapper: {
    display:     "flex",
    alignItems:  "center",
    gap:         "8px",
  },
  btnIdle: {
    display:     "flex",
    alignItems:  "center",
    gap:         "7px",
    padding:     "7px 14px",
    borderRadius:"8px",
    border:      "1px solid var(--border)",
    background:  "var(--bg-elevated)",
    color:       "var(--text-secondary)",
    fontSize:    "13px",
    cursor:      "pointer",
    whiteSpace:  "nowrap",
  },
  btnConnected: {
    display:     "flex",
    alignItems:  "center",
    gap:         "7px",
    padding:     "7px 14px",
    borderRadius:"8px",
    border:      "1px solid var(--accent)",
    background:  "var(--accent-dim)",
    color:       "var(--accent)",
    fontSize:    "13px",
    cursor:      "pointer",
    whiteSpace:  "nowrap",
  },
  dot: {
    width:       "8px",
    height:      "8px",
    borderRadius:"50%",
    display:     "inline-block",
    flexShrink:  0,
  },
  unsupported: {
    fontSize:    "12px",
    color:       "var(--text-muted)",
    padding:     "7px 10px",
  },
  error: {
    color:       "var(--danger)",
    fontSize:    "16px",
    cursor:      "help",
  },
};