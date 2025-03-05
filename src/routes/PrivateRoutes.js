import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Reports from "../pages/Reports";

function PrivateRoutes({ isAuthenticated }) {
  return (
    <Routes>
      {/* אם המשתמש מחובר, הוא רואה את דף הדיווחים. אחרת, מועבר הביתה */}
      <Route
        path="/reports"
        element={isAuthenticated ? <Reports /> : <Navigate to="/" />}
      />
    </Routes>
  );
}

export default PrivateRoutes;
