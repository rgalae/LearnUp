import api from "../api/axios";

export const getCourses = async () => {
  const token = localStorage.getItem("token");

  const response = await api.get("/cours/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
export const getCourseDetail = async (id) => {
  const token = localStorage.getItem("token");

  const response = await api.get(`/cours/${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

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

export const createCourse = async (courseData) => {
  const token = localStorage.getItem("token");

  const response = await api.post("/cours/create/", courseData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
export const createContent = async (coursId, contentData) => {
  const token = localStorage.getItem("token");

  const response = await api.post(
    `/cours/${coursId}/add-content/`,
    contentData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export const getTeacherCourseDetail = async (id) => {
  const token = localStorage.getItem("token");

  const response = await api.get(`/cours/teacher/${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

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

export const getProgress = async () => {
  const token = localStorage.getItem("token");

  const response = await api.get("/cours/progress/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
