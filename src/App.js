import React, { useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Topbar from "./components/Topbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import MobileSidebar from "./components/MobileSidebar.jsx";
import StudentSidebar from "./components/StudentSidebar.jsx";
import StudentMobileSidebar from "./components/StudentMobileSidebar.jsx";
import SchoolSidebar from "./components/SchoolSidebar.tsx";
import SchoolMobileSidebar from "./components/SchoolMobileSidebar.tsx";
import ParentSidebar from "./components/ParentSidebar.tsx";
import ParentMobileSidebar from "./components/ParentMobileSidebar.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import AdminReports from "./pages/Reports.tsx";
import Graph from "./pages/Graph.tsx";
import Cities from "./pages/MasterData/City.tsx";
import States from "./pages/MasterData/State.tsx";
import Institute from "./pages/MasterData/Institute.tsx";
import Branch from "./pages/MasterData/Branch.tsx";
import School from "./pages/MasterData/School.tsx";
import Board from "./pages/MasterData/Board.tsx";
import ClassPage from "./pages/MasterData/Class.tsx";
import Division from "./pages/MasterData/Division.tsx";
import Academicyear from "./pages/MasterData/Academicyear.tsx";
import Emotion from "./pages/MasterData/Emotion.tsx";
import Zone from "./pages/MasterData/Zone.tsx";
import LogMoodMaster from "./pages/MasterData/LogMood.tsx";
import Category from "./pages/MasterData/Category.tsx";
import SubCategory from "./pages/MasterData/SubCategory.tsx";
import Impact from "./pages/MasterData/Impact.tsx";
import Pleasantness from "./pages/MasterData/Pleasantness.tsx";
// Import Auth pages
import Login from "./pages/Auth/Login.tsx";
import StudentLogin from "./pages/Auth/StudentLogin.tsx";
import SchoolLogin from "./pages/Auth/SchoolLogin.tsx";
import ParentLogin from "./pages/Auth/ParentLogin.tsx";
import Register from "./pages/Auth/Register.tsx";
import SchoolRegister from "./pages/Auth/SchoolRegister.tsx";
import StudentRegister from "./pages/Auth/StudentRegister.tsx";
import ForgotPassword from "./pages/Auth/ForgotPassword.tsx";
import ResetPassword from "./pages/Auth/ResetPassword.tsx";
import Countries from "./pages/MasterData/Countries.tsx";
import Welcome from "./pages/Welcome.tsx";
// Import School pages
import SchoolDashboard from "./pages/School/SchoolDashboard.tsx";
import SchoolOverview from "./pages/School/Overview.tsx";
import AllStudents from "./pages/School/AllStudents.tsx";
import Classes from "./pages/School/Classes.tsx";
import Divisions from "./pages/School/Divisions.tsx";
import AcademicYear from "./pages/School/AcademicYear.tsx";
import Teachers from "./pages/School/Teachers.tsx";
import SchoolCalendar from "./pages/School/Calendar.tsx";
import SchoolNotifications from "./pages/School/Notifications.tsx";
import Documents from "./pages/School/Documents.tsx";
// Import Student pages
import {
  StudentDashboard,
  StudentProfile,
  LogMood,
  MoodHistory,
  MoodOverview,
  Calendar,
  StreaksRewards,
  Referrals,
  Community,
  Notifications,
  PredefinedList,
} from "./pages/Student";
// Import Parent pages
import ParentDashboard from "./pages/Parent/ParentDashboard.tsx";
import Children from "./pages/Parent/Children.tsx";
import ChildMoodTracking from "./pages/Parent/ChildMoodTracking.tsx";
import ParentNotifications from "./pages/Parent/Notifications.tsx";
import ParentProfile from "./pages/Parent/Profile.tsx";
import ParentCalendar from "./pages/Parent/Calendar.tsx";
import Reports from "./pages/Parent/Reports.tsx";

function AppContent() {
  const location = useLocation();
  const { isAuthenticated, userType } = useAuth();
  const authRoutes = [
    "/login",
    "/student/login",
    "/school/login",
    "/parent/login",
    "/register",
    "/school/register",
    "/student/register",
    "/forgot-password",
    "/reset-password",
  ];

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check if current path is a student route
  const isStudentRoute = location.pathname.startsWith("/student");
  // Check if current path is a school route
  const isSchoolRoute = location.pathname.startsWith("/school");
  // Check if current path is a parent route
  const isParentRoute = location.pathname.startsWith("/parent");

  // If user is authenticated and on root or welcome page, redirect to dashboard
  if (isAuthenticated && (location.pathname === "/" || location.pathname === "/welcome")) {
    if (userType === "student") {
      return <Navigate to="/student/dashboard" replace />;
    }
    if (userType === "school") {
      return <Navigate to="/school/dashboard" replace />;
    }
    if (userType === "parent") {
      return <Navigate to="/parent/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  // Redirect to appropriate dashboard if user is already authenticated and trying to access auth pages
  if (isAuthenticated && authRoutes.includes(location.pathname)) {
    if (location.pathname.startsWith("/student")) {
      return <Navigate to="/student/dashboard" replace />;
    }
    if (location.pathname.startsWith("/school")) {
      return <Navigate to="/school/dashboard" replace />;
    }
    if (location.pathname.startsWith("/parent")) {
      return <Navigate to="/parent/dashboard" replace />;
    }
    if (userType === "student") {
      return <Navigate to="/student/dashboard" replace />;
    }
    if (userType === "school") {
      return <Navigate to="/school/dashboard" replace />;
    }
    if (userType === "parent") {
      return <Navigate to="/parent/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  // Show welcome page or auth pages for unauthenticated users
  if (location.pathname === "/" || location.pathname === "/welcome") {
    return <Welcome />;
  }

  if (authRoutes.includes(location.pathname)) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/school/login" element={<SchoolLogin />} />
        <Route path="/parent/login" element={<ParentLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/school/register" element={<SchoolRegister />} />
        <Route path="/student/register" element={<StudentRegister />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <ProtectedRoute>
      <div style={{ display: "flex", position: "relative" }}>
        {/* Desktop Sidebar - Conditional based on route */}
        <div className="sidebar-desktop">
          {isStudentRoute ? (
            <StudentSidebar />
          ) : isSchoolRoute ? (
            <SchoolSidebar />
          ) : isParentRoute ? (
            <ParentSidebar />
          ) : (
            <Sidebar />
          )}
        </div>
        {/* Mobile Sidebar - Conditional based on route */}
        {isStudentRoute ? (
          <StudentMobileSidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        ) : isSchoolRoute ? (
          <SchoolMobileSidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        ) : isParentRoute ? (
          <ParentMobileSidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        ) : (
          <MobileSidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        )}
        <div style={{ flex: 1 }}>
          <Topbar onMenuClick={() => setSidebarOpen(true)} />
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/reports" element={<AdminReports />} />
            <Route path="/graph" element={<Graph />} />
            <Route path="/master/city" element={<Cities />} />
            <Route path="/master/state" element={<States />} />
            <Route path="master/country" element={<Countries />} />
            <Route path="master/institute" element={<Institute />} />
            <Route path="master/branch" element={<Branch />} />
            <Route path="/master/school" element={<School />} />
            <Route path="/master/board" element={<Board />} />
            <Route path="/master/class" element={<ClassPage />} />
            <Route path="/master/division" element={<Division />} />
            <Route path="/master/academicyear" element={<Academicyear />} />
            <Route path="/master/emotion" element={<Emotion />} />
            <Route path="/master/zone" element={<Zone />} />
            <Route path="/master/logmood" element={<LogMoodMaster />} />
            <Route path="/master/category" element={<Category />} />
            <Route path="/master/subcategory" element={<SubCategory />} />
            <Route path="/master/impact" element={<Impact />} />
            <Route path="/master/pleasantness" element={<Pleasantness />} />

            {/* School Pages */}
            <Route path="/school/dashboard" element={<SchoolDashboard />} />
            <Route path="/school/overview" element={<SchoolOverview />} />
            <Route path="/school/students" element={<AllStudents />} />
            <Route path="/school/academics/classes" element={<Classes />} />
            <Route path="/school/academics/divisions" element={<Divisions />} />
            <Route path="/school/academics/academic-year" element={<AcademicYear />} />
            <Route path="/school/teachers" element={<Teachers />} />
            <Route path="/school/calendar" element={<SchoolCalendar />} />
            <Route path="/school/notifications" element={<SchoolNotifications />} />
            <Route path="/school/documents" element={<Documents />} />

            {/* Student Pages */}
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/profile" element={<StudentProfile />} />
            <Route path="/student/log-mood" element={<LogMood />} />
            <Route path="/student/mood-history" element={<MoodHistory />} />
            <Route path="/student/mood-overview" element={<MoodOverview />} />
            <Route path="/student/calendar" element={<Calendar />} />
            <Route
              path="/student/streaks-rewards"
              element={<StreaksRewards />}
            />
            <Route path="/student/referrals" element={<Referrals />} />
            <Route path="/student/community" element={<Community />} />
            <Route path="/student/notifications" element={<Notifications />} />
            <Route
              path="/student/predefined-list"
              element={<PredefinedList />}
            />

            {/* Parent Pages */}
            <Route path="/parent/dashboard" element={<ParentDashboard />} />
            <Route path="/parent/children" element={<Children />} />
            <Route path="/parent/children/:id/mood-tracking" element={<ChildMoodTracking />} />
            <Route path="/parent/children/:id/profile" element={<ParentProfile />} />
            <Route path="/parent/notifications" element={<ParentNotifications />} />
            <Route path="/parent/profile" element={<ParentProfile />} />
            <Route path="/parent/calendar" element={<ParentCalendar />} />
            <Route path="/parent/reports" element={<Reports />} />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </div>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
