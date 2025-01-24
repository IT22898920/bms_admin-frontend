import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ServiceManagement.css";
import {
  DownloadOutlined,
  FilterOutlined,
  UploadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { message, Modal } from "antd";

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  // Fetch all services
  const fetchServices = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/forms/all`,
        {
          withCredentials: true,
        }
      );
      setServices(response.data.data);
      setFilteredServices(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching services:", err);
      setError("Failed to fetch services.");
      setLoading(false);
    }
  };

  // Navigate to GetServiceForm page
  const handleViewService = (serviceId) => {
    navigate(`/admin/service-details/${serviceId}`);
  };
  const handleEditService = (serviceId) => {
    navigate(`/admin/update-service/${serviceId}`);
  };
  const handleAddService = () => {
    navigate(`/admin/FormBuilder`);
  };

  // Delete a service
  const handleDeleteService = (serviceId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this service?",
      content: "This action cannot be undone.",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        try {
          await axios.delete(
            `${process.env.REACT_APP_BACKEND_URL}/api/forms/${serviceId}`,
            {
              withCredentials: true,
            }
          );
          message.success("Service deleted successfully!");
          fetchServices();
        } catch (err) {
          console.error("Error deleting service:", err);
          message.error("Failed to delete service. Please try again.");
        }
      },
    });
  };

  // Handle search input
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const filtered = services.filter((service) =>
      service.servicename.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredServices(filtered);
    setCurrentPage(1); // Reset to the first page after filtering
  };

  // Handle pagination
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to the first page
  };

  const handlePageChange = (direction) => {
    if (direction === "next") {
      setCurrentPage((prev) => prev + 1);
    } else if (direction === "prev") {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Paginated services
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentServices = filteredServices.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Fetch services on component mount
  useEffect(() => {
    fetchServices();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="service-management">
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

      {/* Service List Section */}
      <div className="service-list">
        <h3>Service List</h3>
        <div className="service-list-controls">
          <input
            type="text"
            placeholder="Search Service"
            className="search-inputs"
            value={searchQuery}
            onChange={handleSearch}
          />
          <div className="pagination-controls">
            <select
              className="dropdown"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
            <button className="add-service-btn" onClick={handleAddService}>
              <PlusOutlined /> Add Service
            </button>
          </div>
        </div>
        <div className="service-table-container">
          <table className="service-table">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" />
                </th>
                <th>Service Name</th>
                <th>Description</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentServices.map((service, index) => (
                <tr key={index}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>{service.servicename}</td>
                  <td>{service.serviceDescription}</td>
                  <td>
                    <span className="status-badge">Active</span>
                  </td>
                  <td>
                    <div className="action-icons">
                      <EditOutlined
                        className="icon"
                        onClick={() => handleEditService(service._id)}
                      />
                      <DeleteOutlined
                        className="icon"
                        onClick={() => handleDeleteService(service._id)}
                      />
                      <EyeOutlined
                        className="icon"
                        onClick={() => handleViewService(service._id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination-navigation">
          <button
            className="pagination-button"
            onClick={() => handlePageChange("prev")}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of{" "}
            {Math.ceil(filteredServices.length / itemsPerPage)}
          </span>
          <button
            className="pagination-button"
            onClick={() => handlePageChange("next")}
            disabled={indexOfLastItem >= filteredServices.length}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceManagement;
