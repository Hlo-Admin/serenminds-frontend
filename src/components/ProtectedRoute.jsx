import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, userType } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "1.2rem",
          color: "#666",
        }}
      >
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to appropriate login page based on route
    const isStudentRoute = location.pathname.startsWith("/student");
    const isSchoolRoute = location.pathname.startsWith("/school");
    const isParentRoute = location.pathname.startsWith("/parent");
    let redirectTo = "/login";
    if (isStudentRoute) {
      redirectTo = "/student/login";
    } else if (isSchoolRoute) {
      redirectTo = "/school/login";
    } else if (isParentRoute) {
      redirectTo = "/parent/login";
    }
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Role-based access control
  const isStudentRoute = location.pathname.startsWith("/student");
  const isSchoolRoute = location.pathname.startsWith("/school");
  const isParentRoute = location.pathname.startsWith("/parent");
  const isAdminRoute = !isStudentRoute && !isSchoolRoute && !isParentRoute;

  // Check if user is trying to access a route they don't have permission for
  if (userType === "student" && !isStudentRoute) {
    // Student trying to access non-student route - redirect to student dashboard
    return <Navigate to="/student/dashboard" replace />;
  }

  if (userType === "school" && !isSchoolRoute) {
    // School user trying to access non-school route - redirect to school dashboard
    return <Navigate to="/school/dashboard" replace />;
  }

  if (userType === "parent" && !isParentRoute) {
    // Parent trying to access non-parent route - redirect to parent dashboard
    return <Navigate to="/parent/dashboard" replace />;
  }

  if (userType === "admin" && (isStudentRoute || isSchoolRoute || isParentRoute)) {
    // Admin trying to access student, school, or parent route - redirect to admin dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
