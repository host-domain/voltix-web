import { createContext, useContext, useState } from "react";

export const SettingsContext = createContext();

export const DEFAULT_SETTINGS = {
  simSpeed:          2000,
  historyPoints:     10,
  theme:             "dark",
  defaultThresholds: {
    temperature: { min: 0,  max: 50  },
    humidity:    { min: 20, max: 80  },
    uv:          { min: 0,  max: 8   },
    gas:         { min: 0,  max: 300 },
    soil:        { min: 20, max: 90  },
    distance:    { min: 2,  max: 350 },
  },
};

// ── Load from localStorage on startup ────────────────────────────────────────
function loadSettings() {
  try {
    const saved = localStorage.getItem("voltix-settings");
    return saved
      ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }
      : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

// ── Save to localStorage ──────────────────────────────────────────────────────
function saveSettings(settings) {
  try {
    localStorage.setItem("voltix-settings", JSON.stringify(settings));
  } catch {
    console.warn("Could not save settings to localStorage");
  }
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(loadSettings); // ← loads from localStorage on mount

  const updateSetting = (key, value) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      saveSettings(next); // ← persists immediately
      return next;
    });
  };

  const updateDefaultThreshold = (sensor, field, value) => {
    setSettings((prev) => {
      const next = {
        ...prev,
        defaultThresholds: {
          ...prev.defaultThresholds,
          [sensor]: {
            ...prev.defaultThresholds[sensor],
            [field]: Number(value),
          },
        },
      };
      saveSettings(next); // ← persists immediately
      return next;
    });
  };

  return (
    <SettingsContext.Provider
      value={{ settings, updateSetting, updateDefaultThreshold }}
    >
      <div className={`theme-${settings.theme}`} style={{ height: "100%" }}>
        {children}
      </div>
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}