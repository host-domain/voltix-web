import { Component } from "react";
import '../../styles/errorboundary.css'

// ── Sensor-level boundary ─────────────────────────────────────────────────────
// Wraps individual sensor charts inside DeviceCard.
// If one chart crashes, shows a small inline error — other charts still work.
export class SensorErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("[SensorErrorBoundary]", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="sensor-error">
          <span className="sensor-error__icon">⚠️</span>
          <span className="sensor-error__text">Chart unavailable</span>
          <button
            className="sensor-error__retry"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ── Card-level boundary ───────────────────────────────────────────────────────
// Wraps the entire DeviceCard.
// If the whole card crashes, shows a card-shaped error block — other cards fine.
export class CardErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("[CardErrorBoundary]", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="card-error">
          <span className="card-error__icon">💥</span>
          <p className="card-error__title">Device Error</p>
          <p className="card-error__desc">
            This device card encountered an error and couldn't render.
          </p>
          <button
            className="card-error__retry"
            onClick={() => this.setState({ hasError: false })}
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}