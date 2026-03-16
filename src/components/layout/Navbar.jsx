import { NavLink } from "react-router-dom";
import SerialConnect from "./SerialConnect";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
// import logo_name from '../../assets/voltix-logo-horizontal.svg'

function Navbar({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button
          className="navbar__hamburger"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          ☰
        </button>

        {/* <img src={logo_name} alt="Voltix" height="36" style={{ display: "block" }} className="navbar__logo" /> */}

        <div className="navbar__links">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `navbar__link ${isActive ? "navbar__link--active" : ""}`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/devices"
            className={({ isActive }) =>
              `navbar__link ${isActive ? "navbar__link--active" : ""}`
            }
          >
            Devices
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `navbar__link ${isActive ? "navbar__link--active" : ""}`
            }
          >
            Settings
          </NavLink>
          <NavLink
            to="/readings"
            className={({ isActive }) =>
              `navbar__link ${isActive ? "navbar__link--active" : ""}`
            }
          >
            Readings
          </NavLink>
        </div>
      </div>

      <div className="navbar__right">
        <SerialConnect />
        <span className="live-badge">
          <span className="live-dot" />
          <span>LIVE</span>
        </span>

        {/* ← REPLACED profile-avatar with user info */}
        <div className="navbar__user">
          <span className="navbar__email" title={user?.email}>
            {user?.email}
          </span>
          <button className="logout-btn" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;