import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">
      <Link to="/dashboard" className="logo">
        TaskFlow
      </Link>

      <nav>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/tasks">Tasks</Link>
        <Link to="/profile">Profile</Link>
      </nav>

      <button className="logout-btn">
        Logout
      </button>
    </header>
  );
}

import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <nav className="navbar">

      <div className="navbar-logo">
        TaskFlow
      </div>

      <div className="navbar-right">

        <span>
          {user?.name || "User"}
        </span>

        <button onClick={handleLogout}>
          Logout
        </button>

      </div>

    </nav>
  );
}

export default Navbar;