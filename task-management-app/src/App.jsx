import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Completed from "./pages/Completed";
import Settings from "./pages/Settings";


function App() {

  return (

    <BrowserRouter>

      <Routes>


        {/* ======================================
            LOGIN
        ====================================== */}

        <Route
          path="/login"
          element={<Login />}
        />


        {/* ======================================
            REGISTER
        ====================================== */}

        <Route
          path="/register"
          element={<Register />}
        />


        {/* ======================================
            DASHBOARD
        ====================================== */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />


        {/* ======================================
            MY TASKS
        ====================================== */}

        <Route
          path="/tasks"
          element={<Tasks />}
        />


        {/* ======================================
            COMPLETED TASKS
        ====================================== */}

        <Route
          path="/completed"
          element={<Completed />}
        />


        {/* ======================================
            SETTINGS
        ====================================== */}

        <Route
          path="/settings"
          element={<Settings />}
        />


        {/* ======================================
            DEFAULT ROUTE
        ====================================== */}

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />


        {/* ======================================
            UNKNOWN ROUTE
        ====================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>

  );

}


export default App;