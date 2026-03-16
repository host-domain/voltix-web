import '../../styles/skeleton.css'

function SkeletonCard() {
  return (
    <div className="device-card skeleton-card">

      {/* Header row */}
      <div className="device-card__header">
        <div className="skeleton skeleton--circle" />
        <div className="skeleton skeleton--text" style={{ width: "40%" }} />
        <div className="skeleton skeleton--badge" />
        <div className="skeleton skeleton--badge" />
      </div>

      {/* Simulate 2 sensor chart blocks */}
      <div className="device-card__charts">
        <div className="skeleton-chart-block">
          <div className="skeleton-chart-block__header">
            <div className="skeleton skeleton--icon" />
            <div className="skeleton skeleton--text" style={{ width: "30%" }} />
            <div className="skeleton skeleton--text" style={{ width: "20%", marginLeft: "auto" }} />
          </div>
          <div className="skeleton skeleton--chart" />
        </div>

        <div className="skeleton-chart-block">
          <div className="skeleton-chart-block__header">
            <div className="skeleton skeleton--icon" />
            <div className="skeleton skeleton--text" style={{ width: "25%" }} />
            <div className="skeleton skeleton--text" style={{ width: "18%", marginLeft: "auto" }} />
          </div>
          <div className="skeleton skeleton--chart" />
        </div>
      </div>

    </div>
  );
}

export default SkeletonCard;