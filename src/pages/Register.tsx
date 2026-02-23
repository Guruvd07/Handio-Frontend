'use client';

import React from "react"

import { useState } from "react";
import { registerUser } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    setError("");
    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }
    
    setLoading(true);
    try {
      const data = await registerUser(
        name,
        email,
        password,
        role
      );

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", role);

      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.msg || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleRegister();
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Create Account</h1>
            <p>Join ServiceHub today</p>
          </div>

          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          <div className="role-selector">
            <label className={`role-option ${role === "customer" ? "active" : ""}`}>
              <input
                type="radio"
                value="customer"
                checked={role === "customer"}
                onChange={e => setRole(e.target.value)}
              />
              <span>👤 Customer</span>
            </label>
            <label className={`role-option ${role === "provider" ? "active" : ""}`}>
              <input
                type="radio"
                value="provider"
                checked={role === "provider"}
                onChange={e => setRole(e.target.value)}
              />
              <span>🏢 Service Provider</span>
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
          </div>

          <button 
            onClick={handleRegister}
            className="register-btn"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>

        <div className="auth-benefits">
          <h3>{role === "customer" ? "As a Customer" : "As a Provider"}</h3>
          <ul>
            {role === "customer" ? (
              <>
                <li>✓ Find local service providers</li>
                <li>✓ Book with confidence</li>
                <li>✓ Track your bookings</li>
                <li>✓ Leave reviews & ratings</li>
              </>
            ) : (
              <>
                <li>✓ Build your profile</li>
                <li>✓ Accept service requests</li>
                <li>✓ Manage your schedule</li>
                <li>✓ Grow your business</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Register;
