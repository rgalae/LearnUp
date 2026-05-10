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
