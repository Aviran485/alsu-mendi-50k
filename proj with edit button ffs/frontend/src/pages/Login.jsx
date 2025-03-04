import React, { useState } from "react";
import axios from "axios";
import "../styles.css";

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { username, password },
        { withCredentials: true }
      );
  
      console.log("✅ Login successful:", response.data);
      setIsAuthenticated(true);
      window.location.href = "/";
    } catch (error) {
      console.error("❌ Login error:", error);
      setError(error.response?.data?.message || "❌ שגיאה בהתחברות");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="login-container">
      <h2 className="login-title">🔑 התחברות עובדים</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="text"
          placeholder="👤 שם משתמש"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input-field"
          required
        />
        <input
          type="password"
          placeholder="🔒 סיסמה"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
          required
        />
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? "⏳ מתחבר..." : "🚀 התחבר"}
        </button>
      </form>
    </div>
  );
};

export default Login;
