import {
  NavLink,
} from "react-router-dom";

function Sidebar() {

  return (

    <aside className="sidebar">

      {/* =====================================
          LOGO
      ====================================== */}

      <div className="sidebar-logo">

        <span className="logo-mark">
          T
        </span>

        <span>
          TASKSPACE
        </span>

      </div>


      {/* =====================================
          NAVIGATION
      ====================================== */}

      <nav className="sidebar-nav">

        {/* Dashboard */}

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `sidebar-link ${
              isActive
                ? "active"
                : ""
            }`
          }
        >

          <span className="sidebar-icon">
            ◈
          </span>

          <span>
            Dashboard
          </span>

        </NavLink>


        {/* My Tasks */}

        <NavLink
          to="/tasks"
          className={({ isActive }) =>
            `sidebar-link ${
              isActive
                ? "active"
                : ""
            }`
          }
        >

          <span className="sidebar-icon">
            ✓
          </span>

          <span>
            My Tasks
          </span>

        </NavLink>


        {/* Completed */}

        <NavLink
          to="/completed"
          className={({ isActive }) =>
            `sidebar-link ${
              isActive
                ? "active"
                : ""
            }`
          }
        >

          <span className="sidebar-icon">
            ◉
          </span>

          <span>
            Completed
          </span>

        </NavLink>


        {/* Settings */}

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `sidebar-link ${
              isActive
                ? "active"
                : ""
            }`
          }
        >

          <span className="sidebar-icon">
            ⚙
          </span>

          <span>
            Settings
          </span>

        </NavLink>

      </nav>


      {/* =====================================
          SIDEBAR FOOTER
      ====================================== */}

      <div className="sidebar-footer">

        <div className="sidebar-status">

          <span className="status-dot" />

          <span>
            SYSTEM ONLINE
          </span>

        </div>

      </div>

    </aside>

  );

}

export default Sidebar;