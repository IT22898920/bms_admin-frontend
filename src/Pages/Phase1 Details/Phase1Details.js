import React, { useEffect, useState } from "react";
import {
  DownloadOutlined,
  FilterOutlined,
  UploadOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { Modal, Button, Checkbox, Input, Form, message } from "antd";
import profile_image from "../../img/user.png";
import "./Phase1Details.css";
import { Spin, Alert } from "antd";
import { useParams } from "react-router-dom";
import axios from "axios";

const Phase1Details = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
const { id } = useParams();
console.log("Document ID from URL:", id);
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkedFields, setCheckedFields] = useState([]);
  const [rejectionReason, setRejectionReason] = useState(""); // Added state for rejectionReason

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/document/document-id/${id}`,
          { withCredentials: true }
        );

        // Filter the document data to include only non-null, non-empty values
        const filteredDocument = Object.fromEntries(
          Object.entries(response.data.document).filter(
            ([_, value]) => value !== null && value !== undefined
          )
        );

        setDocument(filteredDocument);
      } catch (err) {
        console.error("Error fetching document:", err);
        setError("Failed to fetch document details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentDetails();
  }, [id]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCheckedFields([]);
    setRejectionReason(""); // Reset rejectionReason
  };

  const handleConfirm = async () => {
    try {
      const payload = {
        status: checkedFields.length > 0 ? "Rejected" : "Verified",
        rejectionReason: checkedFields.length > 0 ? rejectionReason : undefined,
        description:
          checkedFields.length > 0
            ? "Please correct the highlighted fields."
            : undefined,
        corrections: checkedFields,
      };

      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/document/verify-document/${id}`,
        payload,
        { withCredentials: true }
      );

      message.success(response.data.message);
      setIsModalVisible(false);
      setCheckedFields([]);
      setRejectionReason(""); // Reset rejectionReason
      // Refresh document details
      const updatedDocument = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/document/document-id/${id}`,
        { withCredentials: true }
      );
      setDocument(updatedDocument.data.document);
    } catch (error) {
      console.error("Error updating document:", error);
      message.error("Failed to update the document. Please try again.");
    }
  };

  const handleCheckboxChange = (field) => {
    setCheckedFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  return (
    <div className="phase1-details">
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

      <div className="details-container">
        {/* Left Section */}
        <div className="contact-details-section">
          <div className="profile-header">
            <img src={profile_image} alt="Profile" />
            <div className="client-info">
              <h2>{document?.ClientID?.name || "Unknown Client"}</h2>
              <p className="client-id">
                ID: #{document?.ClientID?._id || "N/A"}
              </p>
            </div>
          </div>
          <div className="divider"></div>
          <h3>Contact Details:</h3>
          <ul className="contact-details">
            {document?.ClientID?.email && (
              <li>
                <MailOutlined /> {document.ClientID.email}
              </li>
            )}
            {document.phone && (
              <li>
                <PhoneOutlined /> {document.phone}
              </li>
            )}
            {document.address && (
              <li>
                <EnvironmentOutlined /> {document.address}
              </li>
            )}
          </ul>
        </div>

        {/* Right Section */}
        <div className="details-section">
          <div className="details">
            <h3>DETAILS</h3>
            {document?.formData ? (
              Object.entries(document.formData).map(([key, value]) => (
                <div className="detail-item" key={key}>
                  <span className="detail-label">
                    {key.charAt(0).toUpperCase() +
                      key.slice(1).replace(/_/g, " ")}
                    :
                  </span>
                  <span className="detail-value">
                    {value === "" || value === null ? (
                      "N/A"
                    ) : key === "documentAttach" ? (
                      <a href={value} target="_blank" rel="noopener noreferrer">
                        View Attachment
                      </a>
                    ) : typeof value === "boolean" ? (
                      value ? (
                        "Yes"
                      ) : (
                        "No"
                      )
                    ) : (
                      value
                    )}
                  </span>
                </div>
              ))
            ) : (
              <p>No form data available.</p>
            )}
          </div>

          <div className="action-buttons">
            {/* <button className="btn btn-reject" onClick={showModal}>
              Reject
            </button>
            <button
              className="btn btn-verified"
              onClick={() => {
                Modal.confirm({
                  title: "Confirm Verification",
                  content: "Are you sure you want to verify this document?",
                  okText: "Yes, Verify",
                  cancelText: "Cancel",
                  onOk: async () => {
                    try {
                      const response = await axios.put(
                        `${process.env.REACT_APP_BACKEND_URL}/api/document/verify-document/${id}`,
                        { status: "Verified" },
                        { withCredentials: true }
                      );
                      message.success(response.data.message);
                      // Refresh the document data after verification
                      const updatedDocument = await axios.get(
                        `${process.env.REACT_APP_BACKEND_URL}/api/document/document-id/${id}`,
                        { withCredentials: true }
                      );
                      setDocument(updatedDocument.data.document);
                    } catch (error) {
                      console.error("Error verifying document:", error);
                      message.error(
                        "Failed to verify the document. Please try again."
                      );
                    }
                  },
                });
              }}
            >
              Verified
            </button> */}
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        title="Why are you rejecting this document?"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="confirm" type="primary" onClick={handleConfirm}>
            Confirm
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item label="Reason for Rejection" required>
            <Input.TextArea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter the reason for rejection"
            />
          </Form.Item>

          <Form.Item label="Fields to Correct">
            <Checkbox.Group
              options={Object.keys(document?.formData || {}).filter(
                (field) => field !== "renewalPreferences"
              )}
              value={checkedFields}
              onChange={(checkedValues) => setCheckedFields(checkedValues)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Phase1Details;
