import { createContext, useContext, useState, useRef } from "react";
import '../styles/global.css'

export const SerialContext = createContext();

export function SerialProvider({ children }) {

  // ─── USB Serial state (unchanged) ────────────────────────────────────────
  const [isConnected,  setIsConnected]  = useState(false);
  const [isSupported]                   = useState("serial" in navigator);
  const portRef                         = useRef(null);
  const readerRef                       = useRef(null);

  // ─── WebSocket (Wireless) state ───────────────────────────────────────────
  const [wsConnected,  setWsConnected]  = useState(false);
  const [wsStatus,     setWsStatus]     = useState("disconnected"); // "disconnected" | "connecting" | "connected" | "error"
  const [wsError,      setWsError]      = useState(null);
  const wsRef                           = useRef(null);

  // ─── Shared state (both USB + Wireless write here) ────────────────────────
  const [latestData,   setLatestData]   = useState({});
  const [error,        setError]        = useState(null);

  // ─── Which connection is active ───────────────────────────────────────────
  // "none" | "usb" | "wireless"
  const [connectionType, setConnectionType] = useState("none");

  // =========================================================================
  // SHARED PARSER — same format for USB and WebSocket
  // "temperature:28.5,humidity:61.2,uv:4.3"
  // =========================================================================
  const parseLine = (line) => {
    if (!line) return null;
    try {
      const result = {};
      line.split(",").forEach((pair) => {
        const [key, value] = pair.split(":");
        if (key && value !== undefined) {
          result[key.trim()] = parseFloat(value.trim());
        }
      });
      return Object.keys(result).length > 0 ? result : null;
    } catch {
      return null;
    }
  };

  // =========================================================================
  // USB SERIAL — connect (unchanged from your original)
  // =========================================================================
  const connect = async () => {
    if (!isSupported) {
      setError("Web Serial not supported. Use Chrome browser.");
      return;
    }
    try {
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });
      portRef.current = port;
      setIsConnected(true);
      setConnectionType("usb");
      setError(null);
      readLoop(port);
    } catch (err) {
      setError("Connection failed: " + err.message);
      setIsConnected(false);
    }
  };

  // USB read loop (unchanged from your original)
  const readLoop = async (port) => {
    const decoder = new TextDecoderStream();
    port.readable.pipeTo(decoder.writable);
    const reader = decoder.readable.getReader();
    readerRef.current = reader;
    let buffer = "";
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += value;
        const lines = buffer.split("\n");
        buffer = lines.pop();
        lines.forEach((line) => {
          const parsed = parseLine(line.trim());
          if (parsed) setLatestData(parsed);
        });
      }
    } catch (err) {
      console.log("Serial read ended:", err.message);
      setIsConnected(false);
      setConnectionType("none");
    }
  };

  // USB disconnect (unchanged from your original)
  const disconnect = async () => {
    try {
      if (readerRef.current) await readerRef.current.cancel();
      if (portRef.current)   await portRef.current.close();
    } catch (err) {
      console.log("Disconnect error:", err.message);
    } finally {
      setIsConnected(false);
      setLatestData({});
      setConnectionType("none");
      portRef.current   = null;
      readerRef.current = null;
    }
  };

  // =========================================================================
  // WEBSOCKET WIRELESS — connect
  // ip example: "192.168.1.47"  →  opens ws://192.168.1.47:81
  // =========================================================================
  const connectWireless = (ip) => {
    if (!ip || ip.trim() === "") {
      setWsError("Please enter a valid IP address.");
      return;
    }

    // Close any existing WS connection first
    if (wsRef.current) {
      wsRef.current.close();
    }

    const url = `ws://${ip.trim()}:81`;
    setWsStatus("connecting");
    setWsError(null);

    const ws = new WebSocket(url);
    wsRef.current = ws;

    // ── Connection opened ──────────────────────────────────────────────────
    ws.onopen = () => {
      setWsConnected(true);
      setWsStatus("connected");
      setConnectionType("wireless");
      setWsError(null);
      console.log(`[Voltix] WebSocket connected to ${url}`);
    };

    // ── Message received — same parser as USB ─────────────────────────────
    ws.onmessage = (event) => {
      // ESP32 sends one line per message e.g. "temperature:28.5,humidity:61.2"
      const lines = event.data.split("\n");
      lines.forEach((line) => {
        const parsed = parseLine(line.trim());
        if (parsed) setLatestData(parsed);
      });
    };

    // ── Connection closed ─────────────────────────────────────────────────
    ws.onclose = (event) => {
      setWsConnected(false);
      setWsStatus("disconnected");
      setConnectionType("none");
      wsRef.current = null;
      console.log(`[Voltix] WebSocket closed. Code: ${event.code}`);
    };

    // ── Connection error ──────────────────────────────────────────────────
    ws.onerror = () => {
      setWsConnected(false);
      setWsStatus("error");
      setConnectionType("none");
      setWsError(`Could not connect to ws://${ip.trim()}:81 — check IP and make sure ESP32 is on the same WiFi.`);
      console.error(`[Voltix] WebSocket error connecting to ${url}`);
    };
  };

  // =========================================================================
  // WEBSOCKET WIRELESS — disconnect
  // =========================================================================
  const disconnectWireless = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setWsConnected(false);
    setWsStatus("disconnected");
    setConnectionType("none");
    setLatestData({});
    setWsError(null);
    console.log("[Voltix] WebSocket disconnected by user.");
  };

  // =========================================================================
  // CONTEXT VALUE — expose everything to the app
  // =========================================================================
  return (
    <SerialContext.Provider
      value={{
        // ── USB Serial (your existing keys — unchanged) ──
        isConnected,
        isSupported,
        error,
        connect,
        disconnect,

        // ── WebSocket Wireless (new) ─────────────────────
        wsConnected,
        wsStatus,       // "disconnected" | "connecting" | "connected" | "error"
        wsError,
        connectWireless,
        disconnectWireless,

        // ── Shared ───────────────────────────────────────
        latestData,     // both USB + Wireless write to the same latestData
        connectionType, // "none" | "usb" | "wireless"
      }}
    >
      {children}
    </SerialContext.Provider>
  );
}

export function useSerial() {
  return useContext(SerialContext);
}