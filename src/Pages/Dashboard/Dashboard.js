import React from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import "./Dashboard.css";

import {
  DownloadOutlined,
  FilterOutlined,
  UploadOutlined,

} from "@ant-design/icons";
// Register Chart.js components
ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const stats = [
    {
      title: "TOTAL CLIENTS",
      value: 1200,
      description: "Displays the total number of clients",
      icon: "👥",
    },
    {
      title: "ACTIVE SERVICES",
      value: 200,
      description: "Total services currently in use",
      icon: "🔧",
    },
    {
      title: "PENDING RENEWALS",
      value: 50,
      description: "Services nearing renewal deadline",
      icon: "⏳",
    },
    {
      title: "COMPLIANCE ALERT",
      value: 5,
      description: "Compliance issues needing attention",
      icon: "⚠️",
    },
  ];

  const recentActivities = [
    {
      action: "Added New Client",
      client: "John Doe Enterprises",
      service: "Visa Services",
      date: "2024-12-01 10:30 AM",
    },
    {
      action: "Compliance Alert",
      client: "ABC Corp",
      service: "Tax Filing",
      date: "2024-12-02 9:00 AM",
    },
    {
      action: "Renewed Service",
      client: "XYZ Holdings",
      service: "Business Licensing",
      date: "2024-12-01 11:45 AM",
    },
    {
      action: "Added New Client",
      client: "John Doe Enterprises",
      service: "Business Licensing",
      date: "2024-12-01 11:45 AM",
    },
  ];

  const notifications = [
    {
      action: "Compliance Check Required for ABC Corp",
      client: "30 minutes ago",
    },
    { action: "Service Renewal Due for XYZ Holdings", client: "2 hours ago" },
    { action: "New Client Added: John Doe Enterprises", client: "5:00 PM" },
    { action: "New Client Added: John Doe Enterprises", client: "5:00 PM" },
    { action: "New Client Added: John Doe Enterprises", client: "5:00 PM" },
  ];

  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Lorem",
        data: [50, 80, 40, 70, 60],
        backgroundColor: "#176b87",
      },
      {
        label: "Ipsum",
        data: [30, 60, 20, 50, 40],
        backgroundColor: "#cccccc",
      },
    ],
  };

  const doughnutData = {
    labels: ["Pending", "Done"],
    datasets: [
      {
        label: "Monthly Target",
        data: [31, 69],
        backgroundColor: ["#176b87", "#64ccc5"],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="dashboard-container">
      {/* Header Section */}

      <div className="client-management-header">
        <h1>Welcome To Dashboard</h1>
        <p>Business Management System / Dashboard</p>
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

      {/* Activity and Target Section */}
      <div className="activity-and-target">
        <div className="activity-box">
          <div className="activity-header">
            <h3>Recent Activity Log</h3>
            <select className="activity-filter">
              <option value="all">All</option>
              <option value="6m">6M</option>
              <option value="1y">1Y</option>
            </select>
          </div>
          <table>
            <thead>
              <tr>
                <th>ACTION</th>
                <th>CLIENT</th>
                <th>SERVICE</th>
                <th>DATE</th>
              </tr>
            </thead>
            <tbody>
              {recentActivities.map((activity, index) => (
                <tr key={index}>
                  <td>{activity.action}</td>
                  <td>{activity.client}</td>
                  <td>{activity.service}</td>
                  <td>{activity.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="target-box">
          <h3>Monthly Target</h3>
          <Doughnut data={doughnutData} />
        </div>
      </div>

      {/* Overview and Notifications Section */}
      <div className="overview-and-notifications">
        <div className="overview-box">
          <div className="overview-header">
            <h3>Overview</h3>
            <div className="overview-buttons">
              <button className="btn btn-light">All</button>
              <button className="btn btn-light">6M</button>
              <button className="btn btn-light">1Y</button>
            </div>
          </div>
          <div className="bar-chart-container">
            <Bar data={barData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="notifications-box">
          <div className="notifications-header">
            <h3>Notifications</h3>
            <select className="notifications-filter">
              <option value="all">All</option>
              <option value="6m">6M</option>
              <option value="1y">1Y</option>
            </select>
          </div>
          <table>
            <thead>
              <tr>
                <th>ACTION</th>
                <th>CLIENT</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((notification, index) => (
                <tr key={index}>
                  <td>{notification.action}</td>
                  <td>{notification.client}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
