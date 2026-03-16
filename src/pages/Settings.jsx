import { useSettings } from "../context/SettingsContext";
import sensorConfig from "../utils/sensorConfig";
import '../styles/settings.css'

// MainLayout provides navbar + sidebar — this is just the page content

function SettingsSection({ title, description, children }) {
  return (
    <div className="settings-section">
      <div className="settings-section__header">
        <h2 className="settings-section__title">{title}</h2>
        <p className="settings-section__desc">{description}</p>
      </div>
      <div className="settings-section__body">{children}</div>
    </div>
  );
}

function OptionGroup({ options, value, onChange }) {
  return (
    <div className="settings-option-group">
      {options.map((opt) => (
        <button
          key={opt.value}
          className={`settings-option ${value === opt.value ? "settings-option--active" : ""}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function Settings() {
  const { settings, updateSetting, updateDefaultThreshold } = useSettings();

  const thresholdSensors = Object.keys(sensorConfig).filter((s) => s !== "ir");

  return (
    <div className="settings-page">

      <div className="settings-page__header">
        <h1 className="settings-page__title">Settings</h1>
        <p className="settings-page__subtitle">Customize your Voltix experience</p>
      </div>

      <div className="settings-list">

        {/* Theme */}
        <SettingsSection
          title="Theme"
          description="Switch between dark and light mode."
        >
          <OptionGroup
            value={settings.theme}
            onChange={(v) => updateSetting("theme", v)}
            options={[
              { label: "🌑 Dark",  value: "dark"  },
              { label: "☀️ Light", value: "light" },
            ]}
          />
        </SettingsSection>

        {/* Simulation Speed */}
        <SettingsSection
          title="Simulation Speed"
          description="How often sensor readings update on the dashboard."
        >
          <OptionGroup
            value={settings.simSpeed}
            onChange={(v) => updateSetting("simSpeed", v)}
            options={[
              { label: "Fast — 1s",   value: 1000 },
              { label: "Normal — 2s", value: 2000 },
              { label: "Slow — 5s",   value: 5000 },
            ]}
          />
        </SettingsSection>

        {/* Chart History */}
        <SettingsSection
          title="Chart History"
          description="Number of data points shown on sensor charts."
        >
          <OptionGroup
            value={settings.historyPoints}
            onChange={(v) => updateSetting("historyPoints", v)}
            options={[
              { label: "5 points",  value: 5  },
              { label: "10 points", value: 10 },
              { label: "20 points", value: 20 },
            ]}
          />
        </SettingsSection>

        {/* Default Thresholds */}
        <SettingsSection
          title="Default Thresholds"
          description="Applied to new devices automatically when added."
        >
          <div className="settings-thresholds">
            {thresholdSensors.map((sensor) => {
              const config  = sensorConfig[sensor];
              const current = settings.defaultThresholds[sensor];
              if (!current) return null;

              return (
                <div key={sensor} className="settings-threshold-row">
                  <div className="settings-threshold-row__label">
                    <span>{config.icon}</span>
                    <span>{config.label}</span>
                    <span className="threshold-unit">({config.unit})</span>
                  </div>
                  <div className="threshold-row__inputs">
                    <div className="threshold-input-group">
                      <label>Min</label>
                      <input
                        type="number"
                        className="modal__input threshold-input"
                        value={current.min}
                        onChange={(e) =>
                          updateDefaultThreshold(sensor, "min", e.target.value)
                        }
                      />
                    </div>
                    <span className="threshold-dash">—</span>
                    <div className="threshold-input-group">
                      <label>Max</label>
                      <input
                        type="number"
                        className="modal__input threshold-input"
                        value={current.max}
                        onChange={(e) =>
                          updateDefaultThreshold(sensor, "max", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </SettingsSection>

      </div>
    </div>
  );
}

export default Settings;