import React from "react";
import { useNavigate } from "react-router-dom";
import {
  DownloadOutlined,
  FilterOutlined,
  UploadOutlined,
  EyeOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import "./Phase4.css";

const Phase4 = () => {
  const navigate = useNavigate();

  const taskData = [
    {
      id: "#24",
      clientName: "John Doe Enterprises",
      service: "Visa Renewal",
      dueDate: "2024-12-01",
      status: "Collecting",
    },
    {
      id: "#23",
      clientName: "XYZ Holdings",
      service: "Visa Renewal",
      dueDate: "2024-12-01",
      status: "Collecting",
    },
    {
      id: "#24",
      clientName: "XYZ Holdings",
      service: "Business Licensing",
      dueDate: "2024-12-01",
      status: "Reject",
    },
    {
      id: "#25",
      clientName: "XYZ Holdings",
      service: "Business Licensing",
      dueDate: "2024-12-01",
      status: "Collecting",
    },
  ];

  const renderStatus = (status) => {
    switch (status) {
      case "Collecting":
        return <span className="badge badge-collecting">Collecting</span>;
      case "Reject":
        return <span className="badge badge-reject">Reject</span>;
      default:
        return <span>{status}</span>;
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/phase1_details`);
  };

  return (
    <div className="document-management">
      {/* Header */}
      <div className="client-management-header">
        <h1>Document Management</h1>
        <p>Business Management System / Document Management</p>
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


      {/* Task List Box */}
      <div className="tasklist-box">
        <div className="tasklist-header">
          <h2>TASK LIST</h2>
        </div>

        {/* Filters */}
        <div className="filter-row">
          <select className="filter-select">
            <option>Service</option>
            <option>Visa Renewal</option>
            <option>Business Licensing</option>
          </select>

          <select className="filter-select">
            <option>Status</option>
            <option>Processing</option>
            <option>Return</option>
          </select>

          <select className="filter-select">
            <option>Last activity</option>
            <option>Newest</option>
            <option>Oldest</option>
          </select>
        </div>

        {/* Task Buttons */}
        <div className="task-buttons">
          <button className="btn btn-add-task">+ Add Task</button>
          <button className="btn btn-my-task">My Task</button>
        </div>

        {/* Task Table */}
        <table className="task-table">
          <thead>
            <tr>
              <th>
                <input type="checkbox" />
              </th>
              <th>ID</th>
              <th>Client Name</th>
              <th>Service</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {taskData.map((task, index) => (
              <tr key={index}>
                <td>
                  <input type="checkbox" />
                </td>
                <td>{task.id}</td>
                <td>{task.clientName}</td>
                <td>{task.service}</td>
                <td>{task.dueDate}</td>
                <td>{renderStatus(task.status)}</td>
                <td>
                  <button
                    className="action-btn"
                    onClick={() => handleViewDetails(task.id)}
                  >
                    <EyeOutlined />
                  </button>
                  <button className="action-btn">
                    <EllipsisOutlined />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Phase4;
