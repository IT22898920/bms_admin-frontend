import React, { useState, useEffect } from "react";
import {
  DownloadOutlined,
  FilterOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import "./SecurityPrivacy.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SecurityPrivacy = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/users/all-users-except-clients`,
          { withCredentials: true }
        );
        setUsers(response.data.data);
      } catch (error) {
        setError("Failed to fetch users. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
  const updateUserStatus = async (userId, newStatus) => {
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/update-status/${userId}`,
        { status: newStatus },
        { withCredentials: true }
      );

      // Update the user list with the new status
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, status: newStatus } : user
        )
      );

      alert(response.data.message || "Status updated successfully!");
    } catch (error) {
      alert("Failed to update status. Please try again.");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="security-privacy">
      {/* Header Section */}
      <div className="client-management-header">
        <h1>Security & Privacy</h1>
        <p>Business Management System / Security & Privacy</p>
        <div className="action-buttons">
          <button className="btn btn-light">
            <UploadOutlined /> Import
          </button>
          <button className="btn btn-light">
            <FilterOutlined /> Filter
          </button>
          <button className="btn btn-primary">
            <DownloadOutlined /> Download
          </button>
        </div>
      </div>

      {/* User Access Management Section */}
      <div className="user-access-management">
        <h2>User Access Management:</h2>
        <table className="access-management-table">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Role</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.role}</td>
                <td>{user.email}</td>
                <td
                  className={`status ${
                    user.status === "Active" ? "active" : "suspend"
                  }`}
                >
                  {user.status || "Active"}
                </td>
                <td>
                  <select
                    value={user.status || "Active"}
                    onChange={(e) => updateUserStatus(user._id, e.target.value)}
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="user-actions">
          <button
            className="btn btn-secondary"
            style={{
              height: "50px", // Specify the exact height
              width: "140px",
            }}
          >
            Revoke Access
          </button>
          <Link to="/admin/CreateRole">
            <button className="btn btn-primary">Create/Edit/Delete Role</button>
          </Link>
        </div>
      </div>

      {/* Authentication Modes Section */}
      <div className="authentication-modes">
        <h2>Authentication Modes:</h2>
        <div className="two-factor-auth">
          <label>Two-Factor Authentication:</label>
          <label className="switch">
            <input type="checkbox" />
            <span className="slider"></span>
          </label>
        </div>
        <button className="btn btn-primary">Edit Password Policy</button>
      </div>

      {/* Security Alerts Section */}
      <div className="security-alerts">
        <h2>Security Alerts:</h2>
        <p>
          Failed Logins: <b>5</b> (Last 24 hours)
        </p>
        <p>
          Unauthorized Access Attempts: <b>2</b>
        </p>
      </div>
    </div>
  );
};

export default SecurityPrivacy;
