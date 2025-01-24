import React, { useEffect, useState } from "react";
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
import "./KYCManagement.css";
import axios from "axios";

const KYCManagement = () => {
  const [kycData, setKycData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  // 1. Pagination states
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedComplaintDetails, setSelectedComplaintDetails] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch KYC data from the backend
  const fetchKycData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/complaint/filter/KYC Management`,
        {
          withCredentials: true,
        }
      );
      setKycData(response.data);
      setFilteredData(response.data); // Make a copy for filtered view
      setLoading(false);
    } catch (err) {
      console.error("Error fetching KYC data:", err);
      setError("Failed to fetch KYC data.");
      setLoading(false);
    }
  };

  // Call fetchKycData on component mount
  useEffect(() => {
    fetchKycData();
  }, []);

  // Filter data based on search query
  useEffect(() => {
    if (searchQuery) {
      const filtered = kycData.filter((item) =>
        item.firstName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
      setCurrentPage(1); // reset to page 1 if we run a new search
    } else {
      setFilteredData(kycData);
    }
  }, [searchQuery, kycData]);

  // --- Pagination Calculations ---
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  // Calculate indexes for slicing
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  // Ensure we don't exceed totalItems
  const displayedData = filteredData.slice(startIndex, endIndex);

  // Handle page changes
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // When the user picks a new itemsPerPage from <select>
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Handle opening the dialog with complaint details
  const handleViewComplaint = (details) => {
    setSelectedComplaintDetails(details);
    setIsDialogOpen(true);
  };

  // Handle closing the dialog
  const handleCloseDialog = () => {
    setSelectedComplaintDetails("");
    setIsDialogOpen(false);
  };

  // Export to CSV
  const handleExport = () => {
    if (!filteredData.length) {
      alert("No data to export");
      return;
    }

    const headers = ["ID", "ClientName", "KYCStatus", "LastUpdate"];
    const rows = filteredData.map((row) => [
      row.id ?? "",
      row.firstName ?? "",
      row.status ?? "",
      row.lastUpdate ?? "",
    ]);

    const csvContent = [headers, ...rows]
      .map((arr) => arr.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const csvUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = csvUrl;
    link.setAttribute("download", "KYC_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="kyc-management">
      <div className="client-management-header">
        <h1>KYC Management</h1>
        <p>Business Management System / Compliance Management</p>
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
          <option>Client Name</option>
          <option>Visa Renewal</option>
          <option>Business Licensing</option>
          <option>Tax Consultation</option>
        </select>

        <select className="filter-select">
          <option>Status</option>
          <option>Active</option>
          <option>Pending</option>
          <option>Overdue</option>
        </select>

        <select className="filter-select">
          <option>Last Activity</option>
          <option>Recent</option>
          <option>Oldest</option>
        </select>
      </div>

      {/* Top bar for items-per-page, search, and CSV export */}
      <div className="export-bar">
        <select
          className="results-count"
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
        </select>

        <div style={{ display: "flex", flex: 2, alignItems: "center" }}>
          <input
            type="text"
            placeholder="Search by Client Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="custom-search-input"
          />
          <button className="export-btn" onClick={handleExport}>
            <DownloadOutlined /> Export
          </button>
        </div>
      </div>

      <table className="kyc-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" />
            </th>
            <th>ID</th>
            <th>Client Name</th>
            <th>KYC Status</th>
            <th>Upload Documents</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {displayedData.map((data, index) => (
            <tr key={index}>
              <td>
                <input type="checkbox" />
              </td>
              <td>{data.id}</td>
              <td>{data.firstName}</td>
              <td>{data.status}</td>
              <td>
                {data.fileAttachment ? (
                  <a
                    href={data.fileAttachment}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Document
                  </a>
                ) : (
                  "No Document"
                )}
              </td>
              <td>
                <button
                  className="action-btn"
                  onClick={() => handleViewComplaint(data.complaintDetails)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        {/* "Showing X of Y" label */}
        <span>
          Showing {endIndex > totalItems ? totalItems : endIndex} of{" "}
          {totalItems} Transactions
        </span>
        <div className="page-buttons">
          <button onClick={() => handlePageChange(currentPage - 1)}>
            <LeftOutlined />
          </button>
          {/* Example: Just show current page for now */}
          <button className="active">{currentPage}</button>
          <button onClick={() => handlePageChange(currentPage + 1)}>
            <RightOutlined />
          </button>
        </div>
      </div>

      {/* Dialog Box for Complaint Details */}
      {isDialogOpen && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <h2>Complaint Details</h2>
            <p>{selectedComplaintDetails}</p>
            <button className="btn btn-close" onClick={handleCloseDialog}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KYCManagement;
