import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

import Home from "../pages/public/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import StudentDashboard from "../pages/student/StudentDashboard";
import TeacherDashboard from "../pages/teacher/TeacherDashboard";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route
        path="/student"
        element={
          <ProtectedRoute>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher"
        element={
          <ProtectedRoute>
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRouter;
