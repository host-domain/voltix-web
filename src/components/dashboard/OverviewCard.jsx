import useDeviceData from "../../hooks/useDeviceData";
import sensorConfig from "../../utils/sensorConfig";
import '../../styles/overview.css';

function OverviewCard({ device }) {
  const { currentReadings, alerts, isLoading } = useDeviceData(device);

  const hasAlert = Object.values(alerts).some((a) => a === true);

  return (
    <div className={`overview-card ${hasAlert ? "overview-card--alert" : ""}`}>

      {/* Header */}
      <div className="overview-card__header">
        <span className={`status-dot ${device.status}`} />
        <span className="overview-card__name">{device.name}</span>
        {hasAlert && <span className="alert-badge">⚠️</span>}
      </div>

      {/* Meta */}
      <div className="overview-card__meta">
        <span className="device-card__type">{device.deviceType}</span>
        <span className="device-card__connection">{device.connection}</span>
      </div>

      {/* Sensor readings grid */}
      <div className="overview-card__readings">
        {device.sensors.map((sensorKey) => {
          const config   = sensorConfig[sensorKey];
          const value    = currentReadings[sensorKey];
          const isAlert  = alerts[sensorKey];

          // IR sensor — show status text instead of number
          if (sensorKey === "ir") {
            const isDetected = value === 1;
            return (
              <div key={sensorKey} className="overview-reading">
                <span className="overview-reading__icon">{config.icon}</span>
                <span className="overview-reading__label">{config.label}</span>
                <span
                  className="overview-reading__value"
                  style={{ color: isDetected ? "#FF4757" : "#00F5C4" }}
                >
                  {isLoading ? "—" : isDetected ? "Detected" : "Clear"}
                </span>
              </div>
            );
          }

          return (
            <div
              key={sensorKey}
              className={`overview-reading ${isAlert ? "overview-reading--alert" : ""}`}
            >
              <span className="overview-reading__icon">{config.icon}</span>
              <span className="overview-reading__label">{config.label}</span>
              <span
                className="overview-reading__value"
                style={{ color: isAlert ? "#ff4757" : config.color }}
              >
                {isLoading ? "—" : value !== undefined ? `${value} ${config.unit}` : "—"}
              </span>
              {isAlert && <span className="overview-reading__warn">⚠️</span>}
            </div>
          );
        })}
      </div>

    </div>
  );
}

export default OverviewCard;