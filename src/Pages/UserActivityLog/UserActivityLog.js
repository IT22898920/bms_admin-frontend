import React, { useEffect, useState } from "react";
import {
  DownloadOutlined,
  FilterOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import axios from "axios";
import "./UserActivityLog.css";

const UserActivityLog = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaintDetails, setSelectedComplaintDetails] = useState(""); // Store selected complaint details
  const [showModal, setShowModal] = useState(false); // Control modal visibility

  // Fetch complaints data
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/complaint/complaints`,
          { withCredentials: true }
        ); // Include authentication cookies
        setComplaints(response.data); // Assuming response.data contains an array of complaints
      } catch (error) {
        console.error("Error fetching complaints:", error);
      }
    };

    fetchComplaints();
  }, []);

  // Function to truncate complaint details to 3 words
  const truncateDetails = (details) => {
    const words = details.split(" ");
    return words.slice(0, 3).join(" ") + (words.length > 3 ? "..." : "");
  };

  // Function to handle click and show the full details in modal
  const handleClickDetails = (details) => {
    setSelectedComplaintDetails(details);
    setShowModal(true);
  };

  // Close the modal
  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="user-activity-log">
      {/* Header Section */}
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
          <button className="btn btn-primary">
            <DownloadOutlined /> Download
          </button>
        </div>
      </div>

      {/* User Activity Log Table */}
      <div className="activity-log">
        <h2>User Activity Log</h2>
        <table className="activity-log-table">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Contact</th>
              <th>Complaint Subject</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((complaint) => (
              <tr key={complaint._id}>
                <td>{complaint.firstName}</td>
                <td>{complaint.contactNumber}</td>
                <td>{complaint.complaintSubject}</td>
                <td>
                  <span
                    className="complaint-details-truncated"
                    onClick={() =>
                      handleClickDetails(complaint.complaintDetails)
                    }
                  >
                    {truncateDetails(complaint.complaintDetails)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Showing Full Complaint Details */}
      {showModal && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <h2>Complaint Details</h2>
            <p>{selectedComplaintDetails}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserActivityLog;
