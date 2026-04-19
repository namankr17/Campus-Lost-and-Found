import api from "../config/axiosConfig";

export const notificationService = {
  // Get user's notifications
  getUserNotifications: async (userId) => {
    const response = await api.get(`/api/notifications/user/${userId}`);
    return response.data;
  },

  // Mark notifications as viewed
  markNotificationsAsViewed: async (userId) => {
    const response = await api.put(`/api/notifications/user/${userId}/viewed`);
    return response.data;
  },

  // Mark single notification as viewed
  markNotificationAsViewed: async (notificationId) => {
    const response = await api.put(`/api/notifications/${notificationId}/view`);
    return response.data;
  },

  // Delete a notification
  deleteNotification: async (notificationId) => {
    const response = await api.delete(`/api/notifications/${notificationId}`);
    return response.data;
  },
};
