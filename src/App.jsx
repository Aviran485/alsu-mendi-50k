import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Reports from "./pages/Reports";
import IdentifyTab from "./pages/IdentifyTab";
import ReportTab from "./pages/ReportTab";
import Header from "./components/Header";
import Footer from "./components/Footer";
import axios from "axios";
import "./styles.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ✅ בדיקה אם המשתמש מחובר דרך session בשרת
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/auth/status", {
          withCredentials: true,
        });
        setIsAuthenticated(response.data.loggedIn);
      } catch (error) {
        console.error("❌ Authentication check failed:", error);
        setIsAuthenticated(false);
      }
    };
  
    checkAuthStatus();
  }, []);
  

  // useEffect(() => {
  //   checkAuthStatus();
  // }, []);

  const handleLogout = async () => {
    await axios.post(
      "http://localhost:5000/api/auth/logout",
      {},
      { withCredentials: true }
    );
    setIsAuthenticated(false);
    window.location.href = "/";
  };

  return (
    <div className="app-container">
      <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <main>
        <Routes>
          <Route
            path="/"
            element={<Home isAuthenticated={isAuthenticated} />}
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/login"
            element={<Login setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route
            path="/reports"
            element={isAuthenticated ? <Reports /> : <Home />}
          />
          <Route path="/identify" element={<IdentifyTab />} />
          <Route path="/report" element={<ReportTab />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
