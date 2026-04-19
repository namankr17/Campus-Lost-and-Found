import { useEffect, useState } from "react";
import { format } from "date-fns";
import { FaTrash } from "react-icons/fa";
import { useNotifications } from "../../contexts/notification/NotificationContext";
import { useNavigate } from "react-router-dom";

const NotificationMenu = ({ userId, onClose }) => {
  const {
    getUserNotifications,
    markNotificationAsViewed,
    deleteNotification,
    loading,
    updateNotificationCount,
  } = useNotifications();
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const fetchedNotifications = await getUserNotifications(userId);
        setNotifications(fetchedNotifications);

        // Count unread notifications
        const unreadCount = fetchedNotifications.filter(
          (n) => !n.viewed
        ).length;
        updateNotificationCount(unreadCount);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [userId]);

  const handleDeleteNotification = async (notificationId) => {
    try {
      await deleteNotification(notificationId);

      // Update local state
      setNotifications((prev) => {
        const updatedNotifications = prev.filter(
          (n) => n._id !== notificationId
        );
        // Update count after deletion
        const unreadCount = updatedNotifications.filter(
          (n) => !n.viewed
        ).length;
        updateNotificationCount(unreadCount);
        return updatedNotifications;
      });
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const handleNotificationClick = async (notification) => {
    // If notification hasn't been viewed, mark it as viewed
    if (!notification.viewed) {
      try {
        await markNotificationAsViewed(notification._id);
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === notification._id ? { ...n, viewed: true } : n
          )
        );

        // Update notification count
        const unreadCount = notifications.filter(
          (n) => !n.viewed && n._id !== notification._id
        ).length;
        updateNotificationCount(unreadCount);
      } catch (error) {
        console.error("Error marking notification as viewed:", error);
      }
    }

    navigate("/", {
      state: {
        scrollToPostId: notification.postId._id,
        openComments: true,
        highlightCommentId: notification.commentId._id,
        includeResolved: true,
      },
    });
    onClose();
  };

  return (
    <div className="notification-menu">
      <div className="notification-header">
        <h3>Notifications</h3>
      </div>

      <div className="notification-list">
        {loading ? (
          <div className="loading">Loading notifications...</div>
        ) : notifications.length > 0 ? (
          notifications.map((notification) => {
            const username = notification.message.split(" ")[0];

            return (
              <div
                key={notification._id}
                className={`notification-item ${
                  !notification.viewed ? "unread" : ""
                }`}
              >
                <div
                  className="notification-content"
                  onClick={() => handleNotificationClick(notification)}
                  style={{ cursor: "pointer" }}
                >
                  <p>
                    <strong>{username}</strong> left a comment on your post:{" "}
                    <strong>{notification.postId.title}</strong>
                  </p>
                  <p className="notification-comment">
                    {notification.commentId.text.length > 50
                      ? `${notification.commentId.text.substring(0, 50)}...`
                      : notification.commentId.text}
                  </p>
                  <span className="notification-time">
                    {format(new Date(notification.createdAt), "MM/dd/yyyy")}
                  </span>
                </div>
                <button
                  className="delete-notification"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteNotification(notification._id);
                  }}
                >
                  <FaTrash />
                </button>
              </div>
            );
          })
        ) : (
          <div className="no-notifications">No new notifications</div>
        )}
      </div>
    </div>
  );
};

export default NotificationMenu;
