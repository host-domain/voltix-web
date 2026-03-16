const sensorConfig = {
  temperature: {
    label:     "Temperature",
    unit:      "°C",
    chartType: "line",
    min:       0,
    max:       50,
    color:     "#FF6B6B",
    icon:      "🌡️",
  },
  humidity: {
    label:     "Humidity",
    unit:      "%",
    chartType: "line",
    min:       0,
    max:       100,
    color:     "#4FC3F7",
    icon:      "💧",
  },
  uv: {
    label:     "UV Index",
    unit:      "mW/cm²",
    chartType: "gauge",
    min:       0,
    max:       15,
    color:     "#FFD93D",
    icon:      "☀️",
  },
  ir: {
    label:     "IR Sensor",
    unit:      "",
    chartType: "status",
    min:       0,
    max:       1,
    color:     "#00F5C4",
    icon:      "📡",
  },
  soil: {
    label:     "Soil Moisture",
    unit:      "%",
    chartType: "progressbar",
    min:       0,
    max:       100,
    color:     "#A5D6A7",
    icon:      "🌱",
  },
  gas: {
    label:     "Gas Level",
    unit:      "ppm",
    chartType: "gauge",
    min:       0,
    max:       500,
    color:     "#FF8A65",
    icon:      "💨",
  },
  distance: {
    label:     "Distance",
    unit:      "cm",
    chartType: "line",
    min:       0,
    max:       200,
    color:     "#CE93D8",
    icon:      "📏",
  },
};

// ── getSensorConfig ───────────────────────────────────────────────────────────
// Accepts either a plain key ("temperature") or a numbered key ("temperature_2")
// Returns the config with the label updated to include the number if present.
//
// Examples:
//   getSensorConfig("temperature")   → { label: "Temperature", ... }
//   getSensorConfig("temperature_1") → { label: "Temperature 1", ... }
//   getSensorConfig("temperature_3") → { label: "Temperature 3", ... }
//
export function getSensorConfig(sensorKey) {
  if (!sensorKey) return null;

  // strip trailing _N  e.g. "temperature_2" → baseKey="temperature", num=2
  const match   = sensorKey.match(/^(.+?)_(\d+)$/);
  const baseKey = match ? match[1] : sensorKey;
  const num     = match ? parseInt(match[2]) : null;

  const config = sensorConfig[baseKey];
  if (!config) return null;

  // if no number suffix, return as-is
  if (num === null) return config;

  // return a copy with the number appended to the label
  return { ...config, label: `${config.label} ${num}` };
}

export default sensorConfig;