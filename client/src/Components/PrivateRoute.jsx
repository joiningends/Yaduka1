// PrivateRoute.jsx

import React from "react";
import { Route, Routes, Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ auth: { isAuthenticated }, children }) => {
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
