import { createContext, useContext, useState, useEffect } from "react";
import { notificationService } from "../../services/notificationService";
import { AuthContext } from "../auth/AuthContext";

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchInitialNotifications = async () => {
      if (user?._id) {
        setLoading(true);
        try {
          const notifications = await notificationService.getUserNotifications(
            user._id
          );
          const unviewedCount = notifications.filter((n) => !n.viewed).length;
          setNotificationCount(unviewedCount);
          setLoading(false);
        } catch (err) {
          setError(
            err.response?.data?.message || "Error fetching notifications"
          );
          setLoading(false);
        }
      }
    };

    fetchInitialNotifications();
  }, [user?._id]);

  const getUserNotifications = async (userId) => {
    setLoading(true);
    try {
      const notifications = await notificationService.getUserNotifications(
        userId
      );
      setLoading(false);
      const unviewedCount = notifications.filter((n) => !n.viewed).length;
      setNotificationCount(unviewedCount);
      return notifications;
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching notifications");
      setLoading(false);
      throw err;
    }
  };

  const markNotificationsAsViewed = async (userId) => {
    setLoading(true);
    try {
      await notificationService.markNotificationsAsViewed(userId);
      setNotificationCount(0);
      setLoading(false);
    } catch (err) {
      setError(
        err.response?.data?.message || "Error marking notifications as viewed"
      );
      setLoading(false);
      throw err;
    }
  };

  const markNotificationAsViewed = async (notificationId) => {
    setLoading(true);
    try {
      await notificationService.markNotificationAsViewed(notificationId);
      setLoading(false);
    } catch (err) {
      setError(
        err.response?.data?.message || "Error marking notification as viewed"
      );
      setLoading(false);
      throw err;
    }
  };

  const deleteNotification = async (notificationId) => {
    setLoading(true);
    try {
      await notificationService.deleteNotification(notificationId);
      setNotificationCount((prev) => Math.max(0, prev - 1));
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Error deleting notification");
      setLoading(false);
      throw err;
    }
  };

  const updateNotificationCount = (count) => {
    setNotificationCount(count);
  };

  const value = {
    loading,
    error,
    notificationCount,
    getUserNotifications,
    markNotificationsAsViewed,
    markNotificationAsViewed,
    deleteNotification,
    updateNotificationCount,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
