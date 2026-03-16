import { createContext, useContext, useState } from "react";

export const ReadingsContext = createContext();

export function ReadingsProvider({ children }) {
  const [readings, setReadings] = useState([]);

  const addReadings = (device, newReadings) => {
    const timestamp = new Date().toISOString();

    const entries = Object.entries(newReadings).map(([sensor, value]) => ({
      id:         `${device.id}-${sensor}-${Date.now()}`,
      deviceId:   device.id,
      deviceName: device.name,
      sensor,
      value,
      unit:       device.sensorUnits?.[sensor] || "",
      timestamp,
    }));

    // keep last 500 readings total to avoid memory issues
    setReadings((prev) => [...prev, ...entries].slice(-500));
  };

  const clearReadings = () => setReadings([]);

  const getReadingsByDevice = (deviceId) =>
    readings.filter((r) => r.deviceId === deviceId);

  const getReadingsBySensor = (deviceId, sensor) =>
    readings.filter((r) => r.deviceId === deviceId && r.sensor === sensor);

  return (
    <ReadingsContext.Provider
      value={{ readings, addReadings, clearReadings, getReadingsByDevice, getReadingsBySensor }}
    >
      {children}
    </ReadingsContext.Provider>
  );
}

export function useReadings() {
  return useContext(ReadingsContext);
}