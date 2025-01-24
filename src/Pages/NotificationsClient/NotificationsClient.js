import React, { useEffect, useState } from "react";
import { List, Button, message, Spin } from "antd";
import { Link } from "react-router-dom";
import { DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

const NotificationsClient = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch notifications on component mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/notifications`,
          { withCredentials: true }
        );
        setNotifications(response.data.notifications || []);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        message.error("Failed to fetch notifications.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Mark a single notification as read
  const markAsRead = async (id) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/notifications/${id}`,
        {},
        { withCredentials: true }
      );
      message.success("Notification marked as read.");
      // Update local state
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === id ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
      message.error("Failed to mark notification as read.");
    }
  };

  // Clear ALL notifications
  const clearAllNotifications = async () => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/notifications/clear`,
        { withCredentials: true }
      );
      message.success("All notifications cleared.");
      // Update local state to empty array
      setNotifications([]);
    } catch (error) {
      console.error("Error clearing notifications:", error);
      message.error("Failed to clear notifications.");
    }
  };

  return (
    <div>
      <h2>Notifications (Client)</h2>

      {/* Clear All Button */}
      <div style={{ marginBottom: 16 }}>
        <Button
          onClick={clearAllNotifications}
          danger
          icon={<DeleteOutlined />}
        >
          Clear All
        </Button>
      </div>

      {loading ? (
        <Spin size="large" />
      ) : notifications.length === 0 ? (
        <p>No notifications found.</p>
      ) : (
        <List
          bordered
          dataSource={notifications}
          renderItem={(notification) => (
            <List.Item
              actions={[
                <Button
                  type="link"
                  key="mark-as-read"
                  onClick={() => markAsRead(notification._id)}
                  disabled={notification.isRead}
                >
                  {notification.isRead ? "Read" : "Mark as Read"}
                </Button>,
                notification.documentId &&
                  notification.message.includes("rejected") && (
                    <Link
                      to={`/correction-form/${notification.documentId}`}
                      key="fill-form"
                    >
                      Fill Form
                    </Link>
                  ),
                notification.message.includes("Test") && (
                  <Link to="/my-requests" key="view-requests">
                    View Requests
                  </Link>
                ),
              ].filter(Boolean)} // Filter out null actions
            >
              <span
                style={{
                  fontWeight: notification.isRead ? "normal" : "bold",
                }}
              >
                {notification.message || "No message available"}
              </span>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default NotificationsClient;
