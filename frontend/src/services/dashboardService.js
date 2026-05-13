import api from "../api/axios";

// ============================================
// STUDENT DASHBOARD
// ============================================

export const getStudentDashboardData = async () => {
  const token = localStorage.getItem("token");

  const response = await api.get("/users/student-dashboard/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// ============================================
// TEACHER DASHBOARD
// ============================================

export const getTeacherDashboardData = async () => {
  const token = localStorage.getItem("token");

  const response = await api.get("/users/teacher-dashboard/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// ============================================
// TEACHER RESULTS
// ============================================

export const getTeacherResults = async () => {
  const token = localStorage.getItem("token");

  const response = await api.get("/results/teacher-results/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// ============================================
// TEACHER STUDENTS
// ============================================

export const getTeacherStudents = async () => {
  const token = localStorage.getItem("token");

  const response = await api.get("/cours/teacher-students/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// ============================================
// STUDENT RESULTS
// ============================================

export const getStudentResults = async () => {
  const token = localStorage.getItem("token");

  const response = await api.get("/results/student-results/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
