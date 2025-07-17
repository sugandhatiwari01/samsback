import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

export const submitQuiz = async (quizData) => {
  const response = await api.post("/quiz/submit", quizData);
  return response.data;
};

export const getRecommendations = async (userId) => {
  const response = await api.get(`/quiz/user/${userId}/recommendations`);
  return response.data;
};

export const forgotPassword = async ({ email }) => {
  try {
    const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    return await res.json();
  } catch (err) {
    return { error: "Failed to connect to server" };
  }
};


export async function resetPassword({ email, answer, newPassword }) {
  try {
    const res = await fetch("http://localhost:5000/api/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, answer, newPassword })
    });
    return await res.json();
  } catch (err) {
    console.error("Reset password error:", err);
    return { error: "Server error" };
  }
}
