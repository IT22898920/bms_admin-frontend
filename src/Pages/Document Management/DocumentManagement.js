import React, { useEffect, useState } from "react";
import {
  DownloadOutlined,
  FilterOutlined,
  UploadOutlined,
  DeleteOutlined,
  EyeOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { Modal, Form, message, Spin, Button } from "antd";
import "./DocumentManagement.css";
import { useNavigate } from "react-router-dom";

const DocumentManagement = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [userRole, setUserRole] = useState("");

  // For text-based search
  const [searchTerm, setSearchTerm] = useState("");

  // For status filtering
  const [statusFilter, setStatusFilter] = useState("");

  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/document/all-document`,
          { withCredentials: true }
        );
        setDocuments(response.data.documents);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching documents:", error);
        message.error("Failed to fetch documents.");
        setLoading(false);
        setError(error);
      }
    };
    fetchDocuments();
  }, []);

  useEffect(() => {
    console.log("Documents:", documents);
  }, [documents]);

  // Filter documents by (a) searchTerm, (b) statusFilter
  const filteredDocuments = documents.filter((doc) => {
    const nameMatch = doc.clientID?.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    // If statusFilter is empty, skip it. Otherwise, require doc.status to match
    const statusMatch = !statusFilter || doc.status === statusFilter;

    return nameMatch && statusMatch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const displayedDocuments = filteredDocuments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  // Handlers for search and status filter
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  // Modal actions (if used for file uploads, etc.)
  const showUploadModal = () => {
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // Delete a document
  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this document?",
      content: "This action cannot be undone.",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        try {
          await axios.delete(
            `${process.env.REACT_APP_BACKEND_URL}/api/document/delete-document/${id}`,
            { withCredentials: true }
          );
          message.success("Document deleted successfully.");
          setDocuments((prevDocs) => prevDocs.filter((doc) => doc._id !== id));
        } catch (error) {
          console.error("Error deleting document:", error);
          message.error("Failed to delete document.");
        }
      },
      onCancel: () => {
        message.info("Document deletion canceled.");
      },
    });
  };

  // Export CSV of filtered documents
  const handleExport = () => {
    if (filteredDocuments.length === 0) {
      message.info("No data to export");
      return;
    }

    const headers = ["Client Name", "Client Email", "Status", "Is Verified"];
    const rows = filteredDocuments.map((doc) => [
      doc.clientID?.name || "",
      doc.clientID?.email || "",
      doc.status || "",
      doc.isVerified ? "Yes" : "No",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "renewals_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }
console.log("User role:", userRole);

  return (
    <div className="document-management">
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
          onChange={handleStatusChange}
        >
          <option value="">Status</option>
          <option value="Pending">Pending</option>
          <option value="Rejected">Rejected</option>
          <option value="Corrected">Corrected</option>
          <option value="Verified">Verified</option>
        </select>
      </div>

      <div className="export-bar">
        <select
          className="results-count"
          value={itemsPerPage}
          onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
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
            <th>Client Name</th>
            <th>Client Email</th>
            <th>Status</th>
            <th>Is Verified</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayedDocuments.length > 0 ? (
            displayedDocuments.map((doc) => (
              <tr key={doc._id}>
                <td>{doc.clientID?.name || "N/A"}</td>
                <td>{doc.clientID?.email || "N/A"}</td>
                <td>{doc.status || "N/A"}</td>
                <td>{doc.isVerified ? "Yes" : "No"}</td>
                <td>
                  <Button
                    className="action-btn view-btn"
                    icon={<EyeOutlined />}
                    onClick={() => navigate(`/documents/${doc._id}`)}
                  >
                    View
                  </Button>
                  <Button
                    className="action-btn delete-btn"
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(doc._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No documents found</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination">
        <Button
          icon={<LeftOutlined />}
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        />
        {[...Array(totalPages)].map((_, index) => (
          <Button
            key={index}
            type={currentPage === index + 1 ? "primary" : "default"}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Button>
        ))}
        <Button
          icon={<RightOutlined />}
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => handlePageChange(currentPage + 1)}
        />
      </div>
    </div>
  );
};

export default DocumentManagement;
