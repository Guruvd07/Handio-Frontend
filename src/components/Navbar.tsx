'use client';

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const [role, setRole] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  const refreshAuth = () => {
    const r = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    setRole(r);
    setLoggedIn(!!token);
  };

  useEffect(() => {
    refreshAuth();

    // update navbar if localStorage changes (login/logout in other pages)
    window.addEventListener("storage", refreshAuth);
    return () => window.removeEventListener("storage", refreshAuth);
  }, []);

  const logout = () => {
    localStorage.clear();
    refreshAuth();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">✨</span>
          Handio
        </Link>

        <div className="navbar-links">
          {/* ===== NOT LOGGED IN ===== */}
          {!loggedIn && (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link nav-link-register">
                Register
              </Link>
            </>
          )}

          {/* ===== CUSTOMER ===== */}
          {loggedIn && role === "customer" && (
            <>
              <Link to="/" className="nav-link">
                Search
              </Link>
              <Link to="/my-bookings" className="nav-link">
                My Bookings
              </Link>
            </>
          )}

          {/* ===== PROVIDER ===== */}
          {loggedIn && role === "provider" && (
            <>
              <Link to="/provider-dashboard" className="nav-link">
                Dashboard
              </Link>
              <Link to="/create-provider-profile" className="nav-link">
                Create Profile
              </Link>
            </>
          )}

          {/* ===== ADMIN ===== */}
          {loggedIn && role === "admin" && (
            <>
              <Link to="/admin" className="nav-link">
                Admin
              </Link>
            </>
          )}

          {/* ===== LOGOUT ===== */}
          {loggedIn && (
            <button onClick={logout} className="nav-logout-btn">
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
