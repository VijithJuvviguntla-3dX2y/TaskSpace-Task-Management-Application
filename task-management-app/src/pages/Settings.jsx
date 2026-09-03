import {
  useState,
} from "react";

import Sidebar from "../components/Sidebar";


function Settings() {

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );


  const [notifications, setNotifications] =
    useState(true);


  const [realtime, setRealtime] =
    useState(true);


  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {

    const confirmed =
      window.confirm(
        "Are you sure you want to logout?"
      );

    if (!confirmed) {
      return;
    }

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    window.location.href =
      "/login";

  };


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="app-layout">


      {/* ======================================
          SIDEBAR
      ====================================== */}

      <Sidebar />


      {/* ======================================
          MAIN CONTENT
      ====================================== */}

      <main className="main-content">

        <div className="dashboard">


          {/* ==================================
              HEADER
          ================================== */}

          <div className="dashboard-header">

            <div>

              <p className="dashboard-greeting">
                TASKSPACE / SETTINGS
              </p>

              <h1>
                Settings ⚙
              </h1>

              <p className="dashboard-subtitle">
                Manage your account and
                application preferences.
              </p>

            </div>

          </div>


          {/* ==================================
              SETTINGS GRID
          ================================== */}

          <div className="settings-grid">


            {/* =================================
                ACCOUNT
            ================================= */}

            <section className="settings-card">

              <div className="settings-card-header">

                <span className="settings-icon">
                  ◉
                </span>

                <div>

                  <span>
                    ACCOUNT
                  </span>

                  <h2>
                    Profile
                  </h2>

                </div>

              </div>


              <div className="settings-info">

                <div>

                  <label>
                    NAME
                  </label>

                  <p>
                    {user?.name ||
                      "User"}
                  </p>

                </div>


                <div>

                  <label>
                    EMAIL
                  </label>

                  <p>
                    {user?.email ||
                      "Not available"}
                  </p>

                </div>

              </div>

            </section>


            {/* =================================
                NOTIFICATIONS
            ================================= */}

            <section className="settings-card">

              <div className="settings-card-header">

                <span className="settings-icon">
                  ◇
                </span>

                <div>

                  <span>
                    NOTIFICATIONS
                  </span>

                  <h2>
                    Alerts
                  </h2>

                </div>

              </div>


              <div className="setting-row">

                <div>

                  <strong>
                    Task notifications
                  </strong>

                  <p>
                    Receive notifications about
                    task activity.
                  </p>

                </div>


                <button
                  className={
                    `toggle ${
                      notifications
                        ? "active"
                        : ""
                    }`
                  }

                  onClick={() =>
                    setNotifications(
                      !notifications
                    )
                  }

                  aria-label="Toggle task notifications"
                >

                  <span />

                </button>

              </div>

            </section>


            {/* =================================
                REAL TIME
            ================================= */}

            <section className="settings-card">

              <div className="settings-card-header">

                <span className="settings-icon">
                  ◌
                </span>

                <div>

                  <span>
                    CONNECTION
                  </span>

                  <h2>
                    Real-Time Updates
                  </h2>

                </div>

              </div>


              <div className="setting-row">

                <div>

                  <strong>
                    Socket.IO updates
                  </strong>

                  <p>
                    Receive task changes
                    instantly.
                  </p>

                </div>


                <button
                  className={
                    `toggle ${
                      realtime
                        ? "active"
                        : ""
                    }`
                  }

                  onClick={() =>
                    setRealtime(
                      !realtime
                    )
                  }

                  aria-label="Toggle real-time updates"
                >

                  <span />

                </button>

              </div>

            </section>


            {/* =================================
                APPLICATION
            ================================= */}

            <section className="settings-card">

              <div className="settings-card-header">

                <span className="settings-icon">
                  ✦
                </span>

                <div>

                  <span>
                    APPLICATION
                  </span>

                  <h2>
                    TaskSpace
                  </h2>

                </div>

              </div>


              <div className="settings-info">

                <div>

                  <label>
                    VERSION
                  </label>

                  <p>
                    1.0.0
                  </p>

                </div>


                <div>

                  <label>
                    PLATFORM
                  </label>

                  <p>
                    React Task Manager
                  </p>

                </div>

              </div>

            </section>


          </div>


          {/* ==================================
              LOGOUT
          ================================== */}

          <div className="settings-danger">

            <div>

              <span>
                SESSION
              </span>

              <h3>
                Sign out of TaskSpace
              </h3>

              <p>
                You will need to login again
                to access your tasks.
              </p>

            </div>


            <button
              className="logout-btn"
              onClick={
                handleLogout
              }
            >
              LOG OUT
            </button>

          </div>


        </div>

      </main>

    </div>

  );

}


export default Settings;