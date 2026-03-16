function EmptyState() {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">📡</div>
      <h2 className="empty-state__title">No Devices Connected</h2>
      <p className="empty-state__subtitle">
        Click <strong>+ Add Device</strong> in the sidebar to get started
      </p>
    </div>
  );
}

export default EmptyState;
