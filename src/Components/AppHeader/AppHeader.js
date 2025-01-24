import React, { useEffect, useState } from "react";
import {
  Input,
  Avatar,
  Menu,
  Dropdown,
  Button,
  notification,
  Badge,
} from "antd";
import { BellOutlined, DownOutlined, SearchOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AppHeader.css";

const AppHeader = () => {
  const [admin, setAdmin] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0); // Track new notifications
  const navigate = useNavigate();

  // Fetch admin user data
  const fetchAdminDetails = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/getUser`,
        { withCredentials: true }
      );
      setAdmin(response.data);
    } catch (error) {
      console.error("Error fetching admin details:", error);
    }
  };

  // Fetch admin notifications
  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/notifications`,
        { withCredentials: true }
      );
      const notifications = response.data.notifications || [];
      // Count how many are unread
      const unread = notifications.filter((notif) => !notif.isRead).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchAdminDetails();
    fetchNotifications();
  }, []);

  // Logout
  const handleLogout = async () => {
    try {
      await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/logout`, {
        withCredentials: true,
      });
      notification.success({ message: "Logged out successfully" });
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      notification.error({ message: "Failed to log out" });
    }
  };

  // Admin user register page
  const handleUserRegister = () => {
    navigate("/admin/UserRegister");
  };

  // Menu for user dropdown
  const menu = (
    <Menu>
      <Menu.Item key="0">
        <a href="/profile">Profile</a>
      </Menu.Item>
      <Menu.Item key="1">
        <a href="/admin/settings-configurations">Settings</a>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="3" onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="app-header">
      <div className="search-area">
        <Input className="search-input" placeholder="Search for result..." />
        <div className="search-icon">
          <SearchOutlined />
        </div>
      </div>
      <div className="right-section">
        {admin && (
          <>
            <Dropdown overlay={menu} trigger={["click"]}>
              <div
                className="user-menu"
                onClick={(e) => e.preventDefault()}
                style={{ display: "flex", alignItems: "center" }}
              >
                <Avatar
                  className="avatar"
                  src="https://via.placeholder.com/40"
                  alt="Admin Avatar"
                  style={{ marginRight: "10px" }}
                />
                <div className="user-info">
                  <p
                    className="user-name"
                    style={{ margin: 0, fontSize: "16px" }}
                  >
                    {admin.name}
                  </p>
                  <p
                    className="user-email"
                    style={{ margin: 0, fontSize: "14px" }}
                  >
                    {admin.email}
                  </p>
                </div>
                <DownOutlined
                  className="dropdown-icon"
                  style={{ marginLeft: "5px" }}
                />
              </div>
            </Dropdown>

            {/* Animated bell if unreadCount > 0 */}
            <Link to="/admin-notifications" style={{ marginLeft: "20px" }}>
              <Badge count={unreadCount} offset={[0, 0]}>
                <BellOutlined
                  className={`icon notification-icon ${
                    unreadCount > 0 ? "notification-bounce" : ""
                  }`}
                  style={{ fontSize: "24px" }}
                />
              </Badge>
            </Link>
          </>
        )}
        <Button
          type="primary"
          className="user-register-button"
          onClick={handleUserRegister}
          style={{ marginLeft: "20px" }}
        >
          User Register
        </Button>
        <Button
          type="primary"
          className="logout-button"
          onClick={handleLogout}
          style={{ marginLeft: "20px" }}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default AppHeader;
