import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import ProtectedRoute from "./components/ProtectedRoutes";
import Register from "./components/Register";
import AdminLogin from "./components/AdminLogin";
import { ThemeContextProvider } from "./context/ThemeContext";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";

const App = () => {
  return (
    <ThemeContextProvider>
      <div style={{ height: 400, width: "100%" }}>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-dashboard"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytical-dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin", "user"]}>
                  <AnalyticsDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>

        {/* <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/analytical-dashboard" element={<AnalyticsDashboard />} />
          </Routes>
        </Router> */}
      </div>
    </ThemeContextProvider>
  );
};

export default App;