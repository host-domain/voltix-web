function IRStatus({ value, config }) {
  const isDetected = value === 1;

  return (
    <div className="sensor-chart">
      <div className="sensor-chart__header">
        <span className="sensor-chart__icon">{config.icon}</span>
        <span className="sensor-chart__label">{config.label}</span>
        <span
          className="sensor-chart__value"
          style={{ color: isDetected ? "#FF4757" : "#00F5C4" }}
        >
          {isDetected ? "Detected" : "Clear"}
        </span>
      </div>

      <div className="ir-display">
        <div className={`ir-circle ${isDetected ? "detected" : "clear"}`}>
          <div className="ir-inner">
            <span className="ir-icon">📡</span>
            <span className="ir-label">
              {isDetected ? "OBJECT DETECTED" : "NO OBJECT"}
            </span>
          </div>
        </div>

        <div className="ir-log">
          <span className="ir-log__label">Last State</span>
          <span
            className="ir-log__value"
            style={{ color: isDetected ? "#FF4757" : "#00F5C4" }}
          >
            {isDetected ? "● Triggered" : "○ Idle"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default IRStatus;