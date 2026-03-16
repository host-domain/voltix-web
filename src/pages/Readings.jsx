import { useState, useMemo } from "react";
import { useReadings } from "../context/ReadingsContext";
import { useBoxes } from "../hooks/useBoxes";
import sensorConfig from "../utils/sensorConfig";
import '../styles/global.css';

// ── CSV Export ───────────────────────────────────────────────
function exportCSV(data, filename) {
  const headers = ["Timestamp", "Device", "Sensor", "Value", "Unit"];
  const rows = data.map((r) => [
    r.timestamp,
    r.deviceName,
    r.sensor,
    r.value,
    r.unit,
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.join(","))
    .join("\n");

  const blob = new URL(
    `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`
  );
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  link.download = filename;
  link.click();
}

// ── Readings Page ────────────────────────────────────────────
function Readings() {
  const { readings, clearReadings } = useReadings();
  const { boxes }                   = useBoxes();

  const [selectedDevice, setSelectedDevice] = useState("all");
  const [selectedSensor, setSelectedSensor] = useState("all");

  // filtered readings
  const filtered = useMemo(() => {
    return readings
      .filter((r) => selectedDevice === "all" || r.deviceId === selectedDevice)
      .filter((r) => selectedSensor === "all" || r.sensor === selectedSensor)
      .slice()
      .reverse(); // newest first
  }, [readings, selectedDevice, selectedSensor]);

  // unique sensors from selected device
  const availableSensors = useMemo(() => {
    if (selectedDevice === "all") return Object.keys(sensorConfig);
    const device = boxes.find((b) => b.id === selectedDevice);
    return device ? device.sensors : [];
  }, [selectedDevice, boxes]);

  const handleExport = () => {
    const filename = `voltix-readings-${Date.now()}.csv`;
    exportCSV(filtered, filename);
  };

  return (
    <div className="readings-page">

      {/* Header */}
      <div className="readings-page__header">
        <div>
          <h1 className="readings-page__title">Readings Log</h1>
          <p className="readings-page__subtitle">
            {readings.length} total readings recorded this session
          </p>
        </div>
        <div className="readings-page__actions">
          <button
            className="readings-btn readings-btn--export"
            onClick={handleExport}
            disabled={filtered.length === 0}
          >
            ⬇ Download CSV
          </button>
          <button
            className="readings-btn readings-btn--clear"
            onClick={clearReadings}
            disabled={readings.length === 0}
          >
            🗑 Clear Log
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="readings-filters">
        <div className="readings-filter__group">
          <label className="readings-filter__label">Device</label>
          <select
            className="readings-filter__select"
            value={selectedDevice}
            onChange={(e) => {
              setSelectedDevice(e.target.value);
              setSelectedSensor("all");
            }}
          >
            <option value="all">All Devices</option>
            {boxes.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        <div className="readings-filter__group">
          <label className="readings-filter__label">Sensor</label>
          <select
            className="readings-filter__select"
            value={selectedSensor}
            onChange={(e) => setSelectedSensor(e.target.value)}
          >
            <option value="all">All Sensors</option>
            {availableSensors.map((s) => (
              <option key={s} value={s}>
                {sensorConfig[s]?.icon} {sensorConfig[s]?.label}
              </option>
            ))}
          </select>
        </div>

        <div className="readings-filter__count">
          Showing <strong>{filtered.length}</strong> readings
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="empty-state" style={{ height: "40vh" }}>
          <div className="empty-state__icon">📋</div>
          <h2 className="empty-state__title">No Readings Yet</h2>
          <p className="empty-state__subtitle">
            Readings appear here as sensors generate data
          </p>
        </div>
      ) : (
        <div className="readings-table-wrapper">
          <table className="readings-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Device</th>
                <th>Sensor</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const config = sensorConfig[r.sensor];
                const isAlert =
                  r.threshold &&
                  (r.value < r.threshold.min || r.value > r.threshold.max);

                return (
                  <tr
                    key={r.id}
                    className={`readings-table__row ${isAlert ? "readings-table__row--alert" : ""}`}
                  >
                    <td className="readings-table__time">
                      {new Date(r.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="readings-table__device">
                      {r.deviceName}
                    </td>
                    <td className="readings-table__sensor">
                      <span className="sensor-tag">
                        {config?.icon} {config?.label}
                      </span>
                    </td>
                    <td
                      className="readings-table__value"
                      style={{ color: config?.color }}
                    >
                      {r.sensor === "ir"
                        ? r.value === 1 ? "Detected" : "Clear"
                        : `${r.value} ${r.unit}`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Readings;