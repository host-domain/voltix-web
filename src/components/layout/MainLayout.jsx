import { useState } from "react";
import { Outlet } from "react-router-dom";   // ← renders the current page
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import "../../styles/global.css";

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

      <div className="main">
        {/* Mobile overlay */}
        <div
          className={`sidebar-overlay ${sidebarOpen ? "visible" : ""}`}
          onClick={() => setSidebarOpen(false)}
        />

        <div className={`left ${sidebarOpen ? "sidebar-open" : ""}`}>
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </div>

        {/* ← each page renders here via nested routing */}
        <div className="right">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default MainLayout;