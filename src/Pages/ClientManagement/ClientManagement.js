import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ClientManagement.css";
import {
  DownloadOutlined,
  FilterOutlined,
  UploadOutlined,
  LeftOutlined,
  RightOutlined,
  EyeOutlined,
  EllipsisOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  UserOutlined,
  UserAddOutlined,
  UserSwitchOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { message, Modal } from "antd";

const ClientManagement = () => {
  const navigate = useNavigate(); // Hook to navigate programmatically
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    service: "",
    status: "",
  });



  // Fetch all clients
  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/all-clients`,
        { withCredentials: true }
      );
      setClients(response.data.data);
    } catch (error) {
      message.error("Failed to fetch clients. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Delete a client
  const deleteClient = async (id) => {
    try {
      console.log(`Deleting client with ID: ${id}`);
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/delete-client/${id}`,
        { withCredentials: true }
      );
      message.success("Client deleted successfully.");
      fetchClients();
    } catch (error) {
      console.error("Error deleting client:", error);
      message.error("Failed to delete client. Please try again.");
    }
  };

  // Handle delete confirmation
  const confirmDelete = (id) => {
    console.log("Delete confirmation for ID:", id); // Check the ID here
    Modal.confirm({
      title: "Are you sure you want to delete this client?",
      content: "This action cannot be undone.",
      okText: "Yes",
      cancelText: "No",
      onOk: () => deleteClient(id),
    });
  };

  // Dynamic calculations for stats
  const totalClients = clients.length;
  const paidClients = clients.filter(
    (client) => client.status === "Paid"
  ).length;
  const activeClients = clients.filter(
    (client) => client.status === "Active"
  ).length;
  const pendingClients = clients.filter(
    (client) => client.status === "Pending"
  ).length;


  const stats = [
    {
      title: "TOTAL CLIENT",
      value: totalClients,
      description: "Lorem ipsum dola smit gthjr",
      icon: <UserOutlined style={{ color: "#4F91FF", fontSize: "24px" }} />,
    },
    {
      title: "PAID CLIENT",
      value: paidClients,
      description: "Lorem ipsum dola smit gthjr",
      icon: <UserAddOutlined style={{ color: "#FF5B5B", fontSize: "24px" }} />,
    },
    {
      title: "ACTIVE CLIENT",
      value: activeClients,
      description: "Lorem ipsum dola smit gthjr",
      icon: (
        <UserSwitchOutlined style={{ color: "#4CAF50", fontSize: "24px" }} />
      ),
    },
    {
      title: "PENDING CLIENT",
      value: pendingClients,
      description: "Lorem ipsum dola smit gthjr",
      icon: <TeamOutlined style={{ color: "#FFC107", fontSize: "24px" }} />,
    },
  ];




  const handleViewDetails = (clientId) => {
    navigate(`/client-management-details/${clientId}`);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Filter clients
  const filteredClients = clients.filter((client) => {
    const { service, status } = filters;
    return (
      (!service || (client.service && client.service === service)) &&
      (!status || (client.status && client.status === status))
    );
  });

  if (loading) return <p>Loading clients...</p>;

  return (
    <div className="client-management-container">
      {/* Header Section */}
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

      {/* Stats Section */}
      <div className="stats-container">
        {stats.map((stat, index) => (
          <div className="stat-card" key={index}>
            <div className="stat-content">
              <h3>{stat.title}</h3>
              <h2>{stat.value}</h2>
              <p>{stat.description}</p>
            </div>
            <div className="stat-icon">{stat.icon}</div>
          </div>
        ))}
      </div>

      {/* Filter Row */}
      <div className="filter-row">
        <select
          className="filter-select"
          value={filters.service}
          onChange={(e) => setFilters({ ...filters, service: e.target.value })}
        >
          <option value="">Service</option>
          <option value="Visa Services">Visa Services</option>
          <option value="Tax Filing">Tax Filing</option>
          <option value="Business Licensing">Business Licensing</option>
        </select>

        <select
          className="filter-select"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">Status</option>
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
          <option value="Inactive">Inactive</option>
        </select>

        <select className="filter-select">
          <option>Last Activity</option>
          <option>Most Recent</option>
          <option>Oldest</option>
        </select>
      </div>

      {/* Table Section */}
      <div className="table-container">
        <table className="client-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client) => (
              <tr key={client.id}>
                <td>{client._id}</td>
                <td>{client.name}</td>
                <td>{client.email || "N/A"}</td>
                <td>
                  <span
                    className={`status-badge ${
                      client.status ? client.status.toLowerCase() : ""
                    }`}
                  >
                    {client.status || "N/A"}
                  </span>
                </td>
                <td>
                  <div className="action-icons">
                    <EyeOutlined
                      onClick={() =>
                        navigate(`/client-management-details/${client._id}`)
                      }
                      style={{
                        color: "#4F91FF",
                        fontSize: "16px",
                        marginRight: "10px",
                        cursor: "pointer",
                      }}
                    />
                    <DeleteOutlined
                      onClick={() => confirmDelete(client._id)} // Use `_id` if `id` does not exist
                      style={{
                        color: "#FF5B5B",
                        fontSize: "16px",
                        marginRight: "10px",
                        cursor: "pointer",
                      }}
                    />
                    <EllipsisOutlined
                      style={{
                        color: "#4F91FF",
                        fontSize: "16px",
                        cursor: "pointer",
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <span>Showing 7 of 15 Transactions</span>
        <div className="page-buttons">
          <button>
            <LeftOutlined />
          </button>
          <button className="active">1</button>
          <button>2</button>
          <button>3</button>
          <button>
            <RightOutlined />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientManagement;
