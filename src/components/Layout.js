import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./Layout.css"; // Create this CSS file

const Layout = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="layout">
      <header className="header">
        <div className="logo">News Aggregator</div>
        <nav className="nav">
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            {user ? (
              <li className="nav-item">
                <button onClick={logout} className="nav-link">
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="nav-link">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>
      <main className="main-content">{children}</main>
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} News Aggregator</p>
      </footer>
    </div>
  );
};

export default Layout;
