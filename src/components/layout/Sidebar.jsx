import { useState } from "react";
import { useBoxes } from "../../hooks/useBoxes";
import AddDeviceModal from "./AddDeviceModal";
import "../../styles/global.css";

function Sidebar({ onClose }) {
  const { boxes, addBox, removeBox } = useBoxes();
  const [showModal, setShowModal] = useState(false);

  const [menu, setMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    deviceId: null,
  });

  const handleRightClick = (e, id) => {
    e.preventDefault();
    setMenu({ visible: true, x: e.clientX, y: e.clientY, deviceId: id });
  };

  const handleDelete = () => {
    removeBox(menu.deviceId);
    setMenu({ visible: false, x: 0, y: 0, deviceId: null });
  };

  const handleCloseMenu = () => {
    if (menu.visible) setMenu({ visible: false, x: 0, y: 0, deviceId: null });
  };

  return (
    <div className="sidebar-container" onClick={handleCloseMenu}>

      {/* Close button — only visible on mobile (CSS hides on desktop) */}
      <div className="sidebar-header">
        <span className="sidebar-title">Devices</span>
        <button className="sidebar-close-btn" onClick={onClose} aria-label="Close sidebar">
          ✕
        </button>
      </div>

      {boxes.length === 0 && (
        <p className="sidebar-empty">No devices yet</p>
      )}

      {boxes.map((device) => (
        <div
          key={device.id}
          className="device__box"
          onContextMenu={(e) => handleRightClick(e, device.id)}
        >
          <span className={`status-dot ${device.status}`} />
          <span className="device-label">{device.name}</span>
        </div>
      ))}

      <button
        onClick={() => {
          setShowModal(true);
        }}
        className="add_btn"
      >
        + Add Device
      </button>

      {menu.visible && (
        <div
          className="context_menu"
          style={{ position: "fixed", top: menu.y, left: menu.x }}
        >
          <div onClick={handleDelete}>🗑 Delete</div>
        </div>
      )}

      {showModal && (
        <AddDeviceModal
          onClose={() => setShowModal(false)}
          onAdd={(deviceData) => {
            addBox(deviceData);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}

export default Sidebar;