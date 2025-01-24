import React, { useState, useEffect } from "react";
import {
  DownloadOutlined,
  FilterOutlined,
  UploadOutlined,
  EyeOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import axios from "axios";
import "./GetUnregisteredClientServices.css";

const GetUnregisteredClientServices = () => {
  const [data, setData] = useState([]); // State for storing client services data
  const [loading, setLoading] = useState(true); // State for loading state
  const [error, setError] = useState(null); // State for errors

  useEffect(() => {
    const fetchUnregisteredClientServices = async () => {
      try {
        // Fetching unregistered client services from backend
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/client-service/get-unregistered`,
          {
            withCredentials: true,
          }
        );
        setData(response.data.data); // Set data to state
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch data.");
        setLoading(false);
      }
    };
    fetchUnregisteredClientServices();
  }, []);

  

  // Render status badge
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

  // Handle "View Details" button click
  const handleViewDetails = (id) => {
    // Navigate to detailed view page
    console.log("Viewing details for client ID:", id);
  };

  // Handle sending email action
const handleSendEmail = async (email, serviceName) => {
  try {
    // Sending email request to backend
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/client-service/send-service-form-unregister`,
      {
        email: email,
        serviceName: serviceName,
      },
      { withCredentials: true }
    );

    // Display success message
    alert(`Email sent to ${email} for ${serviceName}`);
  } catch (error) {
    // Handle any errors
    console.error("Error sending email:", error);
    alert("Failed to send email.");
  }
};


  return (
    <div className="document-management">
      <div className="client-management-header">
        <h1>Request Services</h1>
        <p>Business Management System / Get Unregistered Client Service</p>
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

      <div className="tasklist-box">
        <div className="tasklist-header">
          <h2>TASK LIST</h2>
        </div>

        <table className="task-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Client Name</th>
              <th>Email</th>
              <th>Service Name</th>
              <th>Registered Status</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7">Loading...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="7">{error}</td>
              </tr>
            ) : (
              data.map((task, index) => (
                <tr key={index}>
                  <td>{task._id}</td>
                  <td>{task.clientName}</td>
                  <td>{task.clientemail}</td>
                  <td>{task.serviceName}</td>
                  <td>{task.isRegistered ? "Registered" : "Not Registered"}</td>
                  <td>{renderStatus(task.status)}</td>
                  <td>
                    <button
                      className="action-btn"
                      onClick={() => handleViewDetails(task._id)}
                    >
                      <EyeOutlined />
                    </button>
                    <button
                      className="action-btn"
                      onClick={() =>
                        handleSendEmail(task.clientemail, task.serviceName)
                      }
                    >
                      Send Email
                    </button>
                    <button className="action-btn">
                      <EllipsisOutlined />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GetUnregisteredClientServices;
