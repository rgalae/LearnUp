import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

import DashboardLayout from "../layouts/DashboardLayout";

import Home from "../pages/public/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import PublicCourses from "../pages/public/PublicCourses";

import StudentDashboard from "../pages/student/StudentDashboard";
import StudentCourses from "../pages/student/StudentCourses";
import StudentResults from "../pages/student/StudentResults";
import CourseDetail from "../pages/student/CourseDetail";
import QuizPage from "../pages/student/QuizPage";

import TeacherDashboard from "../pages/teacher/TeacherDashboard";
import TeacherCourses from "../pages/teacher/TeacherCourses";
import TeacherResults from "../pages/teacher/TeacherResults";
import TeacherStudents from "../pages/teacher/TeacherStudents";
import TeacherCreateCourse from "../pages/teacher/TeacherCreateCourse";
import TeacherCourseDetail from "../pages/teacher/TeacherCourseDetail";

function AppRouter() {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<Home />} />

      <Route path="/courses" element={<PublicCourses />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      {/* STUDENT ROUTES */}
      <Route
        path="/student"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <StudentDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/courses"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <StudentCourses />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/courses/:id"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <CourseDetail />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/quiz/:coursId"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <QuizPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/results"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <StudentResults />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* TEACHER ROUTES */}
      <Route
        path="/teacher"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <TeacherDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher/courses"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <TeacherCourses />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher/courses/:id"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <TeacherCourseDetail />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher/create-course"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <TeacherCreateCourse />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher/results"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <TeacherResults />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher/students"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <TeacherStudents />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default AppRouter;
