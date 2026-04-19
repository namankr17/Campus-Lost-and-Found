import api from "../config/axiosConfig";

export const authService = {
  verifyToken: async () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const response = await api.get("/api/auth/verify");
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post("/api/auth/login", credentials);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;
    }
    return response.data;
  },

  signup: async (formData) => {
    const response = await api.post("/api/auth/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
  },
};
