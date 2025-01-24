import React, { useEffect, useState } from "react";
import { List, Button, message, Spin } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import "./NotificationsAdmin.css";

const NotificationsAdmin = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1) Fetch all notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/notifications`,
        { withCredentials: true }
      );
      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.error("Error fetching notifications:", error.message);
      message.error("Failed to fetch notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // 2) Mark one notification as read
  const markAsRead = async (id) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/notifications/${id}`,
        {},
        { withCredentials: true }
      );
      message.success("Notification marked as read.");
      // Update local state so we don't need a refetch
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

  // 3) Clear ALL notifications
  const clearAllNotifications = async () => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/notifications/clear`,
        { withCredentials: true }
      );
      message.success("All notifications cleared.");
      setNotifications([]); // or refetch if you want
    } catch (error) {
      console.error("Error clearing notifications:", error);
      message.error("Failed to clear notifications.");
    }
  };

  return (
    <div className="notifications-admin">
      <h2>Admin Notifications</h2>
      <div className="notif-actions">
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
                  onClick={() => markAsRead(notification._id)}
                  disabled={notification.isRead}
                >
                  {notification.isRead ? "Read" : "Mark as Read"}
                </Button>,
              ]}
            >
              <span
                style={{
                  fontWeight: notification.isRead ? "normal" : "bold",
                }}
              >
                {notification.message}
              </span>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default NotificationsAdmin;
