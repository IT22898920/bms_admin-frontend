import React from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import {
  UploadOutlined,
  FilterOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import "./AnalyticsReporting.css";


// Register Chart.js components
ChartJS.register(
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const AnalyticsReporting = () => {
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

  const lineData = {
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        label: "Clients",
        data: [400, 700, 600, 900, 800, 1000, 1100],
        borderColor: "#007bff",
        backgroundColor: "rgba(0, 123, 255, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const revenueData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Revenue",
        data: [
          10000, 20000, 15000, 25000, 30000, 35000, 40000, 30000, 35000, 40000,
          30000, 35000,
        ],
        borderColor: "#28a745",
        backgroundColor: "rgba(40, 167, 69, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const barData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Lorem",
        data: [
          5000, 6000, 7000, 8000, 9000, 10000, 11000, 12000, 13000, 14000,
          15000, 16000,
        ],
        backgroundColor: "#007bff",
      },
      {
        label: "Ipsum",
        data: [
          3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000, 12000, 13000,
          14000,
        ],
        backgroundColor: "#6c757d",
      },
    ],
  };

  const doughnutData = {
    labels: [
      "Visa Services",
      "Tax Consultation",
      "Business Licensing",
      "Payroll Services",
    ],
    datasets: [
      {
        label: "Services",
        data: [29, 25, 18, 28],
        backgroundColor: ["#007bff", "#28a745", "#ffc107", "#dc3545"],
        hoverOffset: 4,
      },
    ],
  };

  const serviceList = [
    {
      service: "Visa Services",
      renewalsDue: 20,
      pending: 10,
      overdue: 5,
      completed: 5,
    },
    {
      service: "Business Licensing",
      renewalsDue: 15,
      pending: 8,
      overdue: 4,
      completed: 3,
    },
    {
      service: "Payroll Services",
      renewalsDue: 12,
      pending: 7,
      overdue: 3,
      completed: 2,
    },
  ];

  return (
    <div className="analytics-reporting">
      {/* Header */}
      <div className="client-management-header">
        <h1>Analytics & Reporting</h1>
        <p>Business Management System / Analytics & Reporting</p>
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
      {/* Charts Section */}
      <div className="charts-container">
        <div className="chart-box">
          <div className="chart-header">
            <h3>Client</h3>
            <select className="chart-filter">
              <option>This Week</option>
              <option>Last Week</option>
              <option>This Month</option>
              <option>Last 3 Months</option>
            </select>
          </div>
          <Line data={lineData} />
        </div>
        <div className="chart-box">
          <div className="chart-header">
            <h3>Revenue</h3>
            <select className="chart-filter">
              <option>Last 8 Months</option>
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <Line data={revenueData} />
        </div>
        <div className="bar-chart">
          <h3>Lorem Ipsum</h3>
          <select className="chart-filter">
            <option>Last 8 Months</option>
            <option>Last 6 Months</option>
            <option>Last Year</option>
          </select>
          <Bar data={barData} />
        </div>

        <div className="doughnut-chart">
          <div className="chart-header">
            <h3>Services</h3>
            <select className="chart-filter">
              <option>This Week</option>
              <option>Last Week</option>
              <option>This Month</option>
            </select>
          </div>
          <Doughnut
            data={doughnutData}
            options={{
              maintainAspectRatio: false,
            }}
            style={{
              width: "200px", // Set the desired width
              height: "200px", // Set the desired height
              margin: "0 auto",
            }}
          />
        </div>
      </div>

      {/* Service List Table */}
      <div className="service-list">
        <h3>Service List</h3>
        <table className="service-table">
          <thead>
            <tr>
              <th>SERVICE</th>
              <th>RENEWALS DUE</th>
              <th>PENDING</th>
              <th>OVERDUE</th>
              <th>COMPLETED</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Visa Services</td>
              <td>20</td>
              <td>10</td>
              <td>5</td>
              <td>5</td>
            </tr>
            <tr>
              <td>Business Licensing</td>
              <td>15</td>
              <td>8</td>
              <td>4</td>
              <td>3</td>
            </tr>
            <tr>
              <td>Payroll Services</td>
              <td>10</td>
              <td>7</td>
              <td>2</td>
              <td>1</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnalyticsReporting;
