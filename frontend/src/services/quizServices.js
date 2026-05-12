import api from "../api/axios";

export const getQuiz = async (coursId) => {
  const token = localStorage.getItem("token");

  const response = await api.get(`/quiz/${coursId}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const submitQuiz = async (quizData) => {
  const token = localStorage.getItem("token");

  const response = await api.post("/quiz/submit/", quizData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const createQuiz = async (quizData) => {
  const token = localStorage.getItem("token");

  const response = await api.post("/quiz/create/", quizData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
