import React, { useEffect, useState } from "react";
import {
  DownloadOutlined,
  FilterOutlined,
  UploadOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import "./RegulatoryMonitoring.css";
import axios from "axios";

const RegulatoryMonitoring = () => {
  const [kycData, setKycData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // For pagination
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Complaint details dialog
  const [selectedComplaintDetails, setSelectedComplaintDetails] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // --- Fetch data ---
  const fetchKycData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/complaint/filter/Regulatory Monitoring`,
        {
          withCredentials: true,
        }
      );
      setKycData(response.data);
      setFilteredData(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching KYC data:", err);
      setError("Failed to fetch KYC data.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKycData();
  }, []);

  // --- Search filter ---
  useEffect(() => {
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      const filtered = kycData.filter((item) =>
        item.firstName?.toLowerCase().includes(lowerQuery)
      );
      setFilteredData(filtered);
      setCurrentPage(1); // go to first page
    } else {
      setFilteredData(kycData);
    }
  }, [searchQuery, kycData]);

  // --- Pagination calculations ---
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // --- Dialog ---
  const handleViewComplaint = (details) => {
    setSelectedComplaintDetails(details || "");
    setIsDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setSelectedComplaintDetails("");
    setIsDialogOpen(false);
  };

  // --- CSV Export (filtered data) ---
  const handleExport = () => {
    if (!filteredData.length) {
      alert("No data to export");
      return;
    }

    // Example columns; adjust as needed
    const headers = [
      "ID",
      "ClientName",
      "RegulatoryMonitoringStatus",
      "LastUpdate",
    ];
    const rows = filteredData.map((row) => [
      row.id ?? "",
      row.firstName ?? "",
      row.status ?? "",
      row.lastUpdate ?? "",
    ]);

    const csvContent = [headers, ...rows].map((r) => r.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const csvUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = csvUrl;
    link.setAttribute("download", "RegulatoryMonitoring.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="kyc-management">
      <div className="client-management-header">
        <h1>Regulatory Monitoring</h1>
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

      {/* Export bar & pagination controls */}
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

      {/* Data Table */}
      <table className="kyc-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" />
            </th>
            <th>ID</th>
            <th>Client Name</th>
            <th>Regulatory Monitoring Status</th>
            <th>Upload Documents</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {displayedData.map((data, idx) => (
            <tr key={idx}>
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
        <span>
          Showing {endIndex > totalItems ? totalItems : endIndex} of{" "}
          {totalItems} Transactions
        </span>
        <div className="page-buttons">
          <button onClick={() => handlePageChange(currentPage - 1)}>
            <LeftOutlined />
          </button>
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

export default RegulatoryMonitoring;
