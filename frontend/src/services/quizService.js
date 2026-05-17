import api from "../api/axios";

export const getQuiz = async (quizId) => {
  const token = localStorage.getItem("token");

  const response = await api.get(`/quiz/${quizId}/`, {
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

export const createQuestion = async (questionData) => {
  const token = localStorage.getItem("token");

  const response = await api.post("/quiz/question/create/", questionData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const createResponse = async (responseData) => {
  const token = localStorage.getItem("token");

  const response = await api.post("/quiz/response/create/", responseData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const deleteQuiz = async (quizId) => {
  const token = localStorage.getItem("token");
  const response = await api.delete(`/quiz/${quizId}/delete/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
