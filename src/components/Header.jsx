import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <h1>מערכת זיהוי כלבים ודיווחים</h1>
      <nav className="nav-links">
        <Link to="/">בית</Link>
        <Link to="/about">אודות</Link>
        <Link to="/contact">צור קשר</Link>
        {isAuthenticated ? (
          <button className="logout-btn" onClick={onLogout}>
            התנתקות
          </button>
        ) : (
          <Link className="login-btn" to="/login">
            התחברות
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
