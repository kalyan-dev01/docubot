import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Spinner } from "../components/ui/States";

export const ProtectedRoute = () => {
  const { isAuthenticated, initializing } = useAuth();
  const location = useLocation();

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#2454ff]">
        <Spinner size={28} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export const PublicOnlyRoute = () => {
  const { isAuthenticated, initializing } = useAuth();

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#2454ff]">
        <Spinner size={28} />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
