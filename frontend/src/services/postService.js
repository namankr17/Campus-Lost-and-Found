import api from "../config/axiosConfig";

export const postService = {
  // Create post
  createPost: async (formData) => {
    const response = await api.post("/api/posts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  getAllPosts: async () => {
    const response = await api.get("/api/posts");
    return response.data;
  },

  getPost: async (postId) => {
    const response = await api.get(`/api/posts/${postId}`);
    return response.data;
  },

  updatePost: async (postId, formData) => {
    const response = await api.put(`/api/posts/${postId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  updatePostStatus: async (postId, status) => {
    const response = await api.patch(`/api/posts/${postId}/status`, {
      status,
    });
    return response.data;
  },

  deletePost: async (postId) => {
    const response = await api.delete(`/api/posts/${postId}`);
    return response.data;
  },
};
