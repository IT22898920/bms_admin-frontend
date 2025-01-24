import React, { useState, useEffect } from "react";
import {
  DownloadOutlined,
  FilterOutlined,
  UploadOutlined,
  DeleteOutlined,
  EyeOutlined,
  EllipsisOutlined,
  PlusOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./UserManagement.css";
import axios from "axios"; // For API calls
import { message, Modal } from "antd"; // For notifications and confirmation modal

const UserManagement = () => {
  const navigate = useNavigate();
  const [rolesData, setRolesData] = useState([]); // State to hold roles data
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [searchQuery, setSearchQuery] = useState(""); // State for search input

  // Fetch roles data from the backend
  const fetchRolesData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/roles-task/get-all-role-tasks`,
        { withCredentials: true } // Include authentication cookies
      );
      setRolesData(response.data.data || []); // Ensure default to an array
    } catch (error) {
      console.error("Failed to fetch roles data:", error);
      message.error("Failed to load roles & tasks.");
    } finally {
      setLoading(false); // Stop the loading indicator
    }
  };

  // Delete a role by ID
  const deleteRole = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/roles-task/delete-role-task/${id}`,
        { withCredentials: true } // Include authentication cookies
      );
      message.success("Role & Task deleted successfully!");
      fetchRolesData(); // Refresh data after deletion
    } catch (error) {
      console.error("Failed to delete role:", error);
      message.error("Failed to delete Role & Task.");
    }
  };

  // Handle delete confirmation
  const confirmDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this role?",
      content: "This action cannot be undone.",
      okText: "Yes",
      cancelText: "No",
      onOk: () => deleteRole(id), // Call delete function on confirmation
    });
  };

  // Filter roles based on search input (search by email or task description)
  const filteredRoles = rolesData.filter(
    (data) =>
      data.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      data.taskDescription.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchRolesData();
  }, []);

  // CSV Export: Export the currently filtered roles
const handleExport = () => {
  if (!filteredRoles.length) {
    message.info("No data to export");
    return;
  }

  const headers = ["Email", "Description", "Start Date", "Due Date"];

  // Helper to format date as YYYY-MM-DD
  const formatDate = (dateVal) => {
    if (!dateVal) return "";
    const d = new Date(dateVal);
    // e.g. 2023-04-05
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")}`;
  };

  const rows = filteredRoles.map((r) => [
    r.email ?? "",
    r.taskDescription ?? "",
    formatDate(r.startDate),
    formatDate(r.dueDate),
  ]);

  // Utility to wrap each field in double quotes, escaping any existing quotes
  const escapeAndQuote = (cell) => `"${String(cell).replace(/"/g, '""')}"`;

  // Build final CSV string
  const csvContent = [headers, ...rows]
    .map((row) => row.map(escapeAndQuote).join(","))
    .join("\n");

  // Create Blob and initiate download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "UserRoles.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


  if (loading) {
    return <p>Loading...</p>; // Show a loading indicator while fetching data
  }

  const handleAddUserClick = () => {
    navigate(`/admin/user-management/add-user`);
  };

  return (
    <div className="user-management">
      <div className="client-management-header">
        <h1>User Roles & Permissions</h1>
        <p>Business Management System / User Management</p>
        <div className="action-buttons">
          <button className="btn btn-light">
            <UploadOutlined /> Import
          </button>
          <button className="btn btn-light">
            <FilterOutlined /> Filter
          </button>
          {/* Wire the Download button to handleExport */}
          <button className="btn btn-primary" onClick={handleExport}>
            <DownloadOutlined /> Download
          </button>
        </div>
      </div>
      <div className="export-bar">
        <div style={{ display: "flex", flex: 2, alignItems: "center" }}>
          <input
            type="text"
            placeholder="Search by email or task description"
            className="custom-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn-btn-primary" onClick={handleAddUserClick}>
            <PlusOutlined /> Add User
          </button>
        </div>
      </div>
      <table className="role-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Description</th>
            <th>Start Date</th>
            <th>Due Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredRoles.map((data) => (
            <tr key={data._id}>
              <td>{data.email}</td>
              <td>{data.taskDescription}</td>
              <td>{new Date(data.startDate).toLocaleDateString()}</td>
              <td>{new Date(data.dueDate).toLocaleDateString()}</td>
              <td className="action-column">
                <button
                  className="icon-btn"
                  onClick={() => confirmDelete(data._id)}
                >
                  <DeleteOutlined />
                </button>
                <button
                  className="icon-btn"
                  onClick={() =>
                    navigate(`/admin/user-management/edit-user`, {
                      state: { role: data },
                    })
                  }
                >
                  <EditOutlined />
                </button>
                <button className="icon-btn">
                  <EyeOutlined />
                </button>
                <button className="icon-btn">
                  <EllipsisOutlined />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
