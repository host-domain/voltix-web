import { useState } from "react";
import { useBoxes }  from "../hooks/useBoxes";
import { useToast }  from "../context/ToastContext";
import sensorConfig  from "../utils/sensorConfig";

// MainLayout provides navbar + sidebar — this is just the page content

function DevicesTable() {
  const { boxes, removeBox, updateName } = useBoxes();
  const { addToast }                     = useToast(); // ← NEW
  const [editingId, setEditingId]        = useState(null);
  const [editingName, setEditingName]    = useState("");

  const startEdit = (device) => {
    setEditingId(device.id);
    setEditingName(device.name);
  };

  const saveEdit = () => {
    if (!editingName.trim()) return;
    updateName(editingId, editingName.trim());
    setEditingId(null);
  };

  const cancelEdit = () => setEditingId(null);

  const handleDelete = (device) => {
    removeBox(device.id);
    addToast({ message: `🗑 ${device.name} removed`, type: "info" }); // ← NEW
  };

  if (boxes.length === 0) {
    return (
      <div className="empty-state" style={{ height: "60vh" }}>
        <div className="empty-state__icon">📋</div>
        <h2 className="empty-state__title">No Devices</h2>
        <p className="empty-state__subtitle">
          Go to <strong>Dashboard</strong> and click + Add Device to get started
        </p>
      </div>
    );
  }

  return (
    <div className="devices-table-wrapper">
      <table className="devices-table">
        <thead>
          <tr>
            <th>Status</th>
            <th>Name</th>
            <th>Type</th>
            <th>Connection</th>
            <th>Sensors</th>
            <th>Thresholds</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {boxes.map((device) => {
            const thresholdCount = device.thresholds
              ? Object.keys(device.thresholds).length
              : 0;

            return (
              <tr key={device.id} className="devices-table__row">

                {/* Status */}
                <td>
                  <span className={`status-dot ${device.status}`} />
                </td>

                {/* Name — inline editable */}
                <td className="devices-table__name">
                  {editingId === device.id ? (
                    <div className="devices-table__edit-row">
                      <input
                        className="devices-table__name-input"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter")  saveEdit();
                          if (e.key === "Escape") cancelEdit();
                        }}
                        autoFocus
                      />
                      <button className="devices-table__save-btn"   onClick={saveEdit}>✓</button>
                      <button className="devices-table__cancel-btn" onClick={cancelEdit}>✕</button>
                    </div>
                  ) : (
                    <span
                      className="devices-table__name-text"
                      onClick={() => startEdit(device)}
                      title="Click to rename"
                    >
                      {device.name}
                      <span className="devices-table__edit-hint">✏️</span>
                    </span>
                  )}
                </td>

                {/* Type */}
                <td>
                  <span className="device-card__type">{device.deviceType}</span>
                </td>

                {/* Connection */}
                <td>
                  <span className="device-card__connection">{device.connection}</span>
                </td>

                {/* Sensors */}
                <td>
                  <div className="devices-table__sensors">
                    {device.sensors.map((s) => (
                      <span key={s} className="sensor-tag">
                        {sensorConfig[s]?.icon} {sensorConfig[s]?.label}
                      </span>
                    ))}
                  </div>
                </td>

                {/* Thresholds */}
                <td>
                  {thresholdCount > 0 ? (
                    <span className="devices-table__threshold-badge">
                      ✅ {thresholdCount} set
                    </span>
                  ) : (
                    <span className="devices-table__threshold-none">— not set</span>
                  )}
                </td>

                {/* Actions */}
                <td>
                  <button
                    className="devices-table__delete-btn"
                    onClick={() => handleDelete(device)} // ← passes full device for toast name
                  >
                    🗑 Delete
                  </button>
                </td>

              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Devices() {
  return (
    <div className="devices-page">
      <div className="devices-page__header">
        <div>
          <h1 className="devices-page__title">Devices</h1>
          <p className="devices-page__subtitle">Manage all your connected devices</p>
        </div>
      </div>
      <DevicesTable />
    </div>
  );
}

export default Devices;