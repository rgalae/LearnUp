import api from "../api/axios";

export const getStudentResults = async () => {
  const token = localStorage.getItem("token");

  const response = await api.get("/users/student-results/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getTeacherResults = async () => {
  const token = localStorage.getItem("token");

  const response = await api.get("/users/teacher-results/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
