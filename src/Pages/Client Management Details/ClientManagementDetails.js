import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  DownloadOutlined,
  FilterOutlined,
  UploadOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import "./ClientManagementDetails.css";
import profile_image from "../../img/user.png";
import { message, Spin } from "antd";

const timelineStages = [
  { title: "Collecting", description: "Document collection started." },
  { title: "Screening", description: "Documents under review." },
  { title: "Processing", description: "Processing the documents." },
  { title: "Done", description: "Verification completed." },
];

const ClientManagementDetails = () => {
  const { id } = useParams(); // Get the client ID from the URL
  const [clientData, setClientData] = useState(null); // State for client details
  const [documents, setDocuments] = useState([]); // State for documents
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch client details and documents from the backend
  const fetchClientDataAndDocuments = async () => {
    try {
      const clientResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/client-management-details/${id}`,
        { withCredentials: true }
      );
      setClientData(clientResponse.data.data);

      const documentsResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/document/client-documents/${id}`,
        { withCredentials: true }
      );
      setDocuments(documentsResponse.data.documents);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Failed to fetch client data or documents.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientDataAndDocuments();
  }, [id]);

const handleNextStage = async (documentId) => {
  try {
    const response = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/api/document/next-stage/${documentId}`,
      {},
      { withCredentials: true }
    );
    message.success(response.data.message);
    fetchClientDataAndDocuments(); // Use the correct function name
  } catch (error) {
    console.error("Error moving to the next stage:", error);
    message.error("Failed to move to the next stage. Please try again.");
  }
};

const handleVerify = async (documentId) => {
  try {
    const response = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/api/document/verify-document/${documentId}`,
      { status: "Verified" },
      { withCredentials: true }
    );
    message.success(response.data.message);

    // Refresh the document data to reflect the updated timelineStatus
    fetchClientDataAndDocuments();
  } catch (error) {
    console.error("Error verifying document:", error);
    message.error("Failed to verify the document. Please try again.");
  }
};


useEffect(() => {
  fetchClientDataAndDocuments(); // Call the fetch function when the component loads
}, [id]);

  if (loading) {
    return <Spin size="large" />;
  }

  if (!clientData) {
    return <p>No client data found.</p>;
  }

  return (
    <div className="client-management">
      {/* Header */}
      <div className="client-management-header">
        <h1>Client Management</h1>
        <p>Business Management System / Client Management</p>
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

      {/* Main Content */}
      <div className="client-management-body">
        {/* Left: Contact Details */}
        <div className="contact-details-section">
          <div className="profile-header">
            <img src={profile_image} alt="Profile" />
            <div className="client-info">
              <h2>{clientData.name}</h2>
              <p className="client-id">ID: #{clientData._id}</p>
            </div>
          </div>
          <div className="divider"></div>
          <h3>Contact Details:</h3>
          <ul className="contact-details">
            <li>
              <MailOutlined /> {clientData.email || "N/A"}
            </li>
            <li>
              <PhoneOutlined /> {clientData.phone || "N/A"}
            </li>
            <li>
              <EnvironmentOutlined /> {clientData.address || "N/A"}
            </li>
          </ul>
        </div>

        {/* Right: Details and Timeline */}
        <div className="details-and-timeline">
          <div className="details-section">
            <h3>DETAILS</h3>
            <div className="details">
              <div className="detail-item">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{clientData.name}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{clientData.email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Address:</span>
                <span className="detail-value">
                  {clientData.address || "N/A"}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Phone:</span>
                <span className="detail-value">
                  {clientData.phone || "N/A"}
                </span>
              </div>
            </div>
          </div>
          <div>
            <h2>{clientData.name}</h2>
            <p>Email: {clientData.email}</p>
          </div>
          {/* Timeline Section */}
          <div className="timeline-section">
            <h3>DOCUMENT TIMELINE</h3>
            {documents.map((doc) => (
              <div key={doc._id} className="document-section">
                <h4>Document ID: {doc._id}</h4>
                <div className="timeline">
                  {timelineStages.map((stage, index) => {
                    const currentStatusIndex = timelineStages.findIndex(
                      (s) => s.title === doc.timelineStatus
                    );

                    const isCompleted = index <= currentStatusIndex; // Mark current and previous stages as completed

                    return (
                      <div
                        key={index}
                        className={`timeline-item ${
                          isCompleted ? "completed" : ""
                        }`}
                      >
                        <div className="status-icon">
                          {isCompleted ? "✔" : "○"}
                        </div>
                        <div className="timeline-content">
                          <h4>{stage.title}</h4>
                          <p>{stage.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientManagementDetails;
