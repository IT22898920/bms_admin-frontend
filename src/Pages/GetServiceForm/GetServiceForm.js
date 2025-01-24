import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Spin, Form, Input, Typography, Divider } from "antd";

const { Title } = Typography;

const GetServiceForm = () => {
  const { serviceId } = useParams(); // Extract service ID from URL params
  const [serviceDetails, setServiceDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch service details by ID
    const fetchServiceDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/forms/service-details/${serviceId}`,
          {
            withCredentials: true,
          }
        );
        setServiceDetails(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching service details:", err);
        setError("Failed to load service details.");
        setLoading(false);
      }
    };

    fetchServiceDetails();
  }, [serviceId]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px", color: "red" }}>
        <h3>{error}</h3>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <Title level={2}>Service Details</Title>
      <Divider />

      <Form layout="vertical">
        <Form.Item label="Service Name">
          <Input value={serviceDetails.servicename} readOnly />
        </Form.Item>

        <Form.Item label="Service Description">
          <Input.TextArea
            value={serviceDetails.serviceDescription}
            readOnly
            rows={4}
          />
        </Form.Item>

        <Title level={4}>Fields</Title>
        <Divider />

        {serviceDetails.fields.map((field, index) => (
          <Form.Item key={index} label={field.label}>
            {renderField(field)}
          </Form.Item>
        ))}
      </Form>
    </div>
  );
};

// Render field based on type (Read-Only)
const renderField = (field) => {
  switch (field.type) {
    case "text":
      return <Input value={field.value} readOnly />;
    case "number":
      return <Input value={field.value} readOnly type="number" />;
    case "paragraph":
      return <Input.TextArea value={field.value} readOnly rows={4} />;
    case "email":
      return <Input value={field.value} readOnly type="email" />;
    case "checkbox":
      return <Input value={field.value ? "Checked" : "Unchecked"} readOnly />;
    case "date":
      return <Input value={field.value} readOnly type="date" />;
    case "password":
      return <Input.Password value={field.value} readOnly />;
    case "url":
      return <Input value={field.value} readOnly type="url" />;
    default:
      return <Input value={field.value} readOnly />;
  }
};

export default GetServiceForm;
