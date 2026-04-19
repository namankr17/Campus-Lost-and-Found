import api from "../config/axiosConfig";

export const commentService = {
  // Get all comments for a post
  getComments: async (postId) => {
    const response = await api.get(`/api/posts/${postId}/comments`);
    return response.data;
  },

  // Add a comment to a post
  addComment: async (postId, text) => {
    const response = await api.post(`/api/posts/${postId}/comments`, { text });
    return response.data;
  },

  // Delete a comment
  deleteComment: async (postId, commentId) => {
    const response = await api.delete(
      `/api/posts/${postId}/comments/${commentId}`
    );
    return response.data;
  },
};
