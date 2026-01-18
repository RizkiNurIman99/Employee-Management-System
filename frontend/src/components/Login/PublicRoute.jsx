import React from "react";
import { useAuth } from "../Context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
};

export default PublicRoute;
