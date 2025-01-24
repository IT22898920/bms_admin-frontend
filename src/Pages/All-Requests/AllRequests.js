import React, { useState, useEffect } from "react";
import {
  DownloadOutlined,
  FilterOutlined,
  UploadOutlined,
  DeleteOutlined,
  EyeOutlined,
  EllipsisOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
// import "../Renewal Management/RenewalManagement.css";
import axios from "axios";
import "./AllRequests.css";

const AllRequests = () => {
  const [data, setData] = useState([]); // State for API data
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for errors
  const [filteredData, setFilteredData] = useState([]); // State for filtered data
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [itemsPerPage, setItemsPerPage] = useState(10); // Items per page for pagination
  const [statusFilter, setStatusFilter] = useState(""); // State for status filter

  // Fetch client services from backend
useEffect(() => {
  const fetchClientServices = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/client-service/get-all`,
        { withCredentials: true }
      );
      const uniqueData = response.data.data.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t._id === item._id)
      );

      // Sort by createdAt (newest first)
      uniqueData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setData(uniqueData);
      setFilteredData(uniqueData);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch data.");
      setLoading(false);
    }
  };

  fetchClientServices();
}, []);


  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setFilteredData(
      data.filter((item) =>
        item.clientName.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
    setCurrentPage(1);
    
  };

  const applyFilters = (searchTerm, statusFilter) => {
    let filtered = data;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.clientName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(
        (item) => item.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    setFilteredData(filtered);
    setCurrentPage(1); // Reset to the first page after applying filters
  };

  // Handle Status Filter
  const handleStatusFilter = (e) => {
    const status = e.target.value;
    setStatusFilter(status);
    applyFilters(searchTerm, status);
  };

  const handleExport = () => {
    const csvData = filteredData.map((item) => ({
      ID: item._id,
      Name: item.clientName,
      Email: item.clientemail,
      Service: item.serviceName,
      Status: item.status,
      RequestDate: new Date(item.createdAt).toLocaleDateString(),
    }));
    const csvContent = `data:text/csv;charset=utf-8,${[
      "ID,Name,Email,Service,Status,RequestDate",
      ...csvData.map((row) => Object.values(row).join(",")),
    ].join("\n")}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "client_requests.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (id) => {
    try {
      const confirm = window.confirm(
        "Are you sure you want to delete this entry?"
      );
      if (!confirm) return;

      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/client-service/${id}`,
        {
          withCredentials: true, // Include authentication token/cookie
        }
      );

      alert("Client service deleted successfully!");
      setData((prevData) => prevData.filter((item) => item._id !== id)); // Update state to remove deleted entry
    } catch (error) {
      console.error("Error deleting client service:", error);
      alert("Failed to delete client service. Please try again.");
    }
  };

  const handleSendForm = async (email, serviceName) => {
    try {
      const confirm = window.confirm(
        `Are you sure you want to send the service form for "${serviceName}" to ${email}?`
      );
      if (!confirm) return;

      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/forms/send-form-with-details`,
        { email, serviceName },
        {
          withCredentials: true, // Include authentication token/cookie
        }
      );

      alert(
        "Service form sent successfully! A notification has been created for the client."
      );

      // Update the local state to set the status to active
      setData((prevData) =>
        prevData.map((item) =>
          item.clientemail === email && item.serviceName === serviceName
            ? { ...item, status: "active" }
            : item
        )
      );
    } catch (error) {
      console.error("Error sending service form:", error);
      alert(
        error.response?.data?.message ||
          "Failed to send the service form. Please try again."
      );
    }
  };

  const renderStatus = (status) => {
    const badgeStyles = {
      active: {
        backgroundColor: "#28a745",
        color: "white",
        padding: "6px 12px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "bold",
        textTransform: "capitalize",
      },
      pending: {
        backgroundColor: "#ffc107",
        color: "black",
        padding: "6px 12px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "bold",
        textTransform: "capitalize",
      },
      overdue: {
        backgroundColor: "#dc3545",
        color: "white",
        padding: "6px 12px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "bold",
        textTransform: "capitalize",
      },
      default: {
        backgroundColor: "#6c757d",
        color: "white",
        padding: "6px 12px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "bold",
        textTransform: "capitalize",
      },
    };

    const style = badgeStyles[status.toLowerCase()] || badgeStyles.default;

    return <span style={style}>{status}</span>;
  };

  // Pagination variables
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }
  return (
    <div className="renewal-management">
      <div className="client-management-header">
        <h1>All Requests Management</h1>
        <p>Business Management System / All Requests Management</p>
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

      <div className="filter-row">
        <select className="filter-select">
          <option>Service</option>
          <option>Visa Renewal</option>
          <option>Business Licensing</option>
          <option>Tax Consultation</option>
        </select>

        <select
          className="filter-select"
          value={statusFilter}
          onChange={handleStatusFilter}
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      <div className="export-bar">
        <select
          className="results-count"
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(Number(e.target.value))}
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
        </select>

        <div style={{ display: "flex", flex: 2, alignItems: "center" }}>
          <input
            type="text"
            placeholder="Search users"
            className="custom-search-input"
            value={searchTerm}
            onChange={handleSearch}
          />

          <button className="export-btn" onClick={handleExport}>
            <DownloadOutlined /> Export
          </button>
        </div>
      </div>

      <table className="renewal-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={(e) =>
                  setFilteredData((prev) =>
                    prev.map((item) => ({
                      ...item,
                      selected: e.target.checked,
                    }))
                  )
                }
              />
            </th>

            <th>ID</th>
            <th>Client Name</th>
            <th>Client Email</th>
            <th>Service</th>
            <th>requset Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item) => (
            <tr key={item._id}>
              <td>
                <input type="checkbox" />
              </td>
              <td>{item._id}</td>
              <td>{item.clientName || "N/A"}</td>
              <td>{item.clientemail || "N/A"}</td>
              <td>{item.serviceName || "N/A"}</td>
              <td>
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString()
                  : "N/A"}
              </td>
              <td>{renderStatus(item.status || "unknown")}</td>
              <td>
                <button
                  className="action-btn"
                  onClick={() => handleDelete(item._id)}
                >
                  <DeleteOutlined />
                </button>
                {item.status !== "active" && (
                  <button
                    className="action-btn"
                    onClick={() =>
                      handleSendForm(item.clientemail, item.serviceName)
                    }
                  >
                    Send Service Form
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <span>
          Showing {Math.min(itemsPerPage, totalItems)} of {totalItems} Requests
        </span>
        <div className="page-buttons">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={currentPage === page ? "active" : ""}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllRequests;
