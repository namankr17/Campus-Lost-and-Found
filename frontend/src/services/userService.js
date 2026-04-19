import api from "../config/axiosConfig";

export const userService = {
  updateProfile: async (formData) => {
    const response = await api.put("/api/users/update", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  getUserProfile: async (userId) => {
    const response = await api.get(`/api/users/${userId}`);
    return response.data;
  },

  getUserStats: (userPosts) => {
    if (!userPosts) return { total: 0, resolved: 0, unresolved: 0 };

    return {
      total: userPosts.length,
      resolved: userPosts.filter((post) => post.status === "resolved").length,
      unresolved: userPosts.filter((post) => post.status === "unresolved")
        .length,
    };
  },
};
