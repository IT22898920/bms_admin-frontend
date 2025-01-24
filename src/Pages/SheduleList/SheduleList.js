import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Spin, Alert } from "antd";
import "./SheduleList.css";

const SheduleList = () => {
  const [loading, setLoading] = useState(true);
  const [meetings, setMeetings] = useState([]);
  const [error, setError] = useState(null);

  // Fetch all meetings
  const fetchMeetings = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/meeting-schedule/all-meetings`,
        {
          withCredentials: true, // Send cookies for authentication
        }
      );
      setMeetings(response.data.meetings);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load meetings");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  // Define table columns
  const columns = [
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Contact Number",
      dataIndex: "contactNumber",
      key: "contactNumber",
    },
    {
      title: "Preferred Date",
      dataIndex: "preferredDate",
      key: "preferredDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Preferred Time",
      dataIndex: "preferredTime",
      key: "preferredTime",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
  ];

  if (loading) {
    return <Spin tip="Loading schedules..." />;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  return (
    <div>
      <h2>All Scheduled Meetings</h2>
      <Table
        columns={columns}
        dataSource={meetings}
        rowKey={(record) => record._id}
      />
    </div>
  );
};

export default SheduleList;
