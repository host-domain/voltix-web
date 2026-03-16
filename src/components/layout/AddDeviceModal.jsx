import { useState } from "react";
import sensorConfig from "../../utils/sensorConfig";
import { useSettings } from "../../context/SettingsContext";
import { useToast }    from "../../context/ToastContext";

const deviceTypes     = ["Arduino", "ESP32", "NodeMCU", "Raspberry Pi"];
const connectionTypes = ["WiFi", "USB-Serial"];
const allSensors      = Object.keys(sensorConfig);

function AddDeviceModal({ onClose, onAdd }) {
  const { settings }  = useSettings();
  const { addToast }  = useToast();

  const [name, setName]                       = useState("");
  const [deviceType, setDeviceType]           = useState("Arduino");
  const [connection, setConnection]           = useState("WiFi");
  const [selectedSensors, setSelectedSensors] = useState([]);
  const [error, setError]                     = useState("");

  const toggleSensor = (sensor) => {
    setSelectedSensors((prev) =>
      prev.includes(sensor)
        ? prev.filter((s) => s !== sensor)
        : [...prev, sensor]
    );
  };

  const handleSubmit = () => {
    if (!name.trim()) { setError("Please enter a device name"); return; }
    if (selectedSensors.length === 0) { setError("Please select at least one sensor"); return; }

    onAdd({
      name:       name.trim(),
      deviceType,
      connection,
      sensors:    selectedSensors,
      status:     "online",
      thresholds: settings.defaultThresholds,
    });

    addToast({ message: `✅ ${name.trim()} added successfully`, type: "success" }); // ← toast
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>

        <div className="modal__header">
          <h2 className="modal__title">Add New Device</h2>
          <button className="modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="modal__field">
          <label className="modal__label">Device Name</label>
          <input
            className="modal__input"
            type="text"
            placeholder="e.g. Lab Room Monitor"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="modal__field">
          <label className="modal__label">Device Type</label>
          <div className="modal__options">
            {deviceTypes.map((type) => (
              <button
                key={type}
                className={`option__btn ${deviceType === type ? "active" : ""}`}
                onClick={() => setDeviceType(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="modal__field">
          <label className="modal__label">Connection</label>
          <div className="modal__options">
            {connectionTypes.map((type) => (
              <button
                key={type}
                className={`option__btn ${connection === type ? "active" : ""}`}
                onClick={() => setConnection(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="modal__field">
          <label className="modal__label">Sensors</label>
          <div className="modal__sensors">
            {allSensors.map((sensor) => {
              const config     = sensorConfig[sensor];
              const isSelected = selectedSensors.includes(sensor);
              return (
                <button
                  key={sensor}
                  className={`sensor__btn ${isSelected ? "active" : ""}`}
                  onClick={() => toggleSensor(sensor)}
                >
                  <span>{config.icon}</span>
                  <span>{config.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {error && <p className="modal__error">{error}</p>}

        <div className="modal__actions">
          <button className="modal__cancel" onClick={onClose}>Cancel</button>
          <button className="modal__submit" onClick={handleSubmit}>
            + Connect Device
          </button>
        </div>

      </div>
    </div>
  );
}

export default AddDeviceModal;