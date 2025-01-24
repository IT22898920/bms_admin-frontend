import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DownloadOutlined,
  FilterOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import "./AddService.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";




const AddService = () => {
  const [autoRenewal, setAutoRenewal] = useState(false);
  const navigate = useNavigate(); // Hook for navigation
  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const handleToggle = () => {
    setAutoRenewal(!autoRenewal);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all fields are filled
    if (!serviceName || !description) {
      toast.error("All fields are required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create FormData object to send multipart data (file upload)
      const formData = new FormData();
      formData.append("serviceName", serviceName);
      formData.append("description", description);
      formData.append("image", image);

      // Send data to the backend
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/services/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true, // Include cookies for secure authentication
        }
      );

      if (response.status === 201) {
        toast.success("Service added successfully!");
        setServiceName("");
        setDescription("");
        setImage(null);
        setTimeout(() => {
          navigate("/admin/service-management"); // Navigate to ServiceManagement page
        }, 2000); // Wait for 2 seconds before navigation
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add service.");
      toast.error(error || "Failed to add service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-service-container">
      {/* Header Section */}
      <div className="client-management-header">
        <h1>Service Management</h1>
        <p>Business Management System / Service Management</p>
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

      {/* Add Category Form Section */}
      <div className="add-service-form-container">
        <h2>Add Service</h2>

        <form className="add-service-form" onSubmit={handleSubmit}>
          {/* Service Name */}
          <div className="form-group">
            <label htmlFor="serviceName">Service Name</label>
            <input
              type="text"
              id="serviceName"
              placeholder="Enter service name"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              className="form-input"
              required
            />
          </div>

          {/* Image or Icon */}
          {/* <div className="form-group">
            <label htmlFor="imageUpload">Image or Icon</label>
            <div className="file-upload">
              <input type="file" id="imageUpload" className="file-input" />
              <label htmlFor="imageUpload" className="file-upload-button">
                <UploadOutlined /> Choose file
              </label>
            </div>
          </div> */}

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
              required
            ></textarea>
          </div>

          {/* Renewal Preferences */}
          <div className="form-group">
            <h3>Renewal Preferences</h3>
            <label className="toggle-container">
              Auto yearly renewal:
              <input
                type="checkbox"
                checked={autoRenewal}
                onChange={handleToggle}
                className="toggle-input"
              />
              <span className="toggle-switch"></span>
            </label>
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Submitting..." : "Add Service"}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddService;
