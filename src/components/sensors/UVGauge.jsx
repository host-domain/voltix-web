import ReactApexChart from "react-apexcharts";

function UVGauge({ value, config }) {
  const percentage = Math.round(((value ?? 0) / config.max) * 100);

  // uv risk level
  const getRiskLevel = (val) => {
    if (val <= 2) return { label: "Low", color: "#00F5C4" };
    if (val <= 5) return { label: "Moderate", color: "#FFD93D" };
    if (val <= 7) return { label: "High", color: "#FF8A65" };
    if (val <= 10) return { label: "Very High", color: "#FF6B6B" };
    return { label: "Extreme", color: "#FF4757" };
  };

  const risk = getRiskLevel(value ?? 0);

  const options = {
    chart: {
      type: "radialBar",
      background: "transparent",
      toolbar: { show: false },
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        hollow: {
          size: "60%",
        },
        track: {
          background: "#1f2d3a",
          strokeWidth: "100%",
        },
        dataLabels: {
          name: {
            show: true,
            fontSize: "11px",
            color: "#6b8299",
            offsetY: 20,
          },
          value: {
            show: true,
            fontSize: "22px",
            fontWeight: 700,
            color: risk.color,
            offsetY: -15,
            formatter: () => `${value ?? 0}`,
          },
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "horizontal",
        gradientToColors: [risk.color],
        stops: [0, 100],
      },
    },
    colors: [config.color],
    stroke: { lineCap: "round" },
    labels: [risk.label],
  };

  const series = [percentage];

  return (
    <div className="sensor-chart">
      <div className="sensor-chart__header">
        <span className="sensor-chart__icon">{config.icon}</span>
        <span className="sensor-chart__label">{config.label}</span>
        <span
          className="sensor-chart__value"
          style={{ color: risk.color }}
        >
          {value ?? "--"} {config.unit}
        </span>
      </div>

      <ReactApexChart
        options={options}
        series={series}
        type="radialBar"
        height={200}
      />

      <div className="gauge-risk" style={{ borderColor: risk.color }}>
        <span style={{ color: risk.color }}>
          {risk.label} Risk
        </span>
      </div>
    </div>
  );
}

export default UVGauge;