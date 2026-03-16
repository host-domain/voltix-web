import { useBoxes } from "../../hooks/useBoxes";
import DeviceCard from "./DeviceCard";
import EmptyState from "./EmptyState";

function DashboardGrid() {
  const { boxes, loading } = useBoxes();

  if (loading) {
    return (
      <div className="empty-state" style={{ height: "40vh" }}>
        <div className="empty-state__icon">⏳</div>
        <h2 className="empty-state__title">Loading devices...</h2>
      </div>
    );
  }

  if (boxes.length === 0) return <EmptyState />;

  return (
    <div className="device-panel">
      {boxes.map((device) => (
        <DeviceCard key={device.id} device={device} />
      ))}
    </div>
  );
}

export default DashboardGrid;