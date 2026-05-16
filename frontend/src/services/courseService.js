import api from "../api/axios";

// ============================================
// GET ALL COURSES
// ============================================

export const getCourses = async () => {
  const token = localStorage.getItem("token");

  const config = token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : {};

  const response = await api.get("/cours/", config);

  return response.data;
};

// ============================================
// GET MY COURSES
// ============================================

export const getMyCourses = async () => {
  const token = localStorage.getItem("token");

  const response = await api.get("/cours/my-courses/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// ============================================
// GET TEACHER COURSES
// ============================================

export const getTeacherCourses = async () => {
  const token = localStorage.getItem("token");

  const response = await api.get("/cours/teacher-courses/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// ============================================
// GET COURSE DETAIL
// ============================================

export const getCourseDetail = async (id) => {
  const token = localStorage.getItem("token");

  const response = await api.get(`/cours/${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// ============================================
// GET TEACHER COURSE DETAIL
// ============================================

export const getTeacherCourseDetail = async (id) => {
  const token = localStorage.getItem("token");

  const response = await api.get(`/cours/teacher/${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
// ============================================
// CREATE COURSE
// ============================================

export const createCourse = async (courseData) => {
  const token = localStorage.getItem("token");

  const response = await api.post("/cours/create/", courseData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// ============================================
// MODULES
// ============================================

export const createModule = async (moduleData) => {
  const token = localStorage.getItem("token");
  const response = await api.post("/cours/modules/create/", moduleData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const updateModule = async (id, moduleData) => {
  const token = localStorage.getItem("token");
  const response = await api.put(`/cours/modules/${id}/update/`, moduleData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const deleteModule = async (id) => {
  const token = localStorage.getItem("token");
  const response = await api.delete(`/cours/modules/${id}/delete/`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// ============================================
// UPDATE COURSE
// ============================================

export const updateCourse = async (id, courseData) => {
  const token = localStorage.getItem("token");

  const response = await api.put(`/cours/${id}/update/`, courseData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// ============================================
// DELETE COURSE
// ============================================

export const deleteCourse = async (id) => {
  const token = localStorage.getItem("token");

  const response = await api.delete(`/cours/${id}/delete/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// ============================================
// ENROLL COURSE
// ============================================

export const enrollCourse = async (coursId) => {
  const token = localStorage.getItem("token");

  const response = await api.post(
    "/cours/inscription/",
    {
      cours_id: coursId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

// ============================================
// UNENROLL COURSE
// ============================================

export const unenrollCourse = async (coursId) => {
  const token = localStorage.getItem("token");

  const response = await api.post(
    "/cours/desinscription/",
    {
      cours_id: coursId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};
// ============================================
// COMPLETE CONTENT
// ============================================

export const completeContent = async (contenuId) => {
  const token = localStorage.getItem("token");

  const response = await api.post(
    "/cours/complete/",
    {
      contenu_id: contenuId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

// ============================================
// GET PROGRESS
// ============================================

export const getProgress = async () => {
  const token = localStorage.getItem("token");

  const response = await api.get("/cours/progress/", {
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

// ============================================
// STUDENT DASHBOARD
// ============================================

export const getStudentDashboard = async () => {
  const token = localStorage.getItem("token");

  const response = await api.get("/results/student-dashboard/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// ============================================
// CREATE CONTENT
// ============================================

export const createContent = async (moduleId, formData) => {
  const token = localStorage.getItem("token");

  const response = await api.post(`/cours/modules/${moduleId}/add-content/`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const updateContent = async (id, formData) => {
  const token = localStorage.getItem("token");
  const response = await api.put(`/cours/content/${id}/update/`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteContent = async (id) => {
  const token = localStorage.getItem("token");
  const response = await api.delete(`/cours/content/${id}/delete/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const reorderModules = async (data) => {
  const token = localStorage.getItem("token");
  const response = await api.post("/cours/modules/reorder/", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const reorderContent = async (moduleId, data) => {
  const token = localStorage.getItem("token");
  const response = await api.post(`/cours/modules/${moduleId}/reorder-content/`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
