import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Spin, Modal, Form, Input, Button, message, Switch } from "antd";
import "./MyRequestForm.css";

const MyRequestForm = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm(); // Ant Design form instance
  const [renewalPreferences, setRenewalPreferences] = useState(false); // State for renewal preferences
  const [selectedFile, setSelectedFile] = useState(null);

  // Fetch client services on component mount
  useEffect(() => {
    const fetchClientServices = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/users/client-services`,
          { withCredentials: true }
        );
        setServices(response.data.data); // Populate services state
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch services. Please try again.");
        setLoading(false);
      }
    };

    fetchClientServices();
  }, []);

  // View button click handler
  const handleViewClick = (service) => {
    console.log("Selected Service:", service); // Debugging: Log the service object
    setSelectedService(service); // Set selected service details

    form.setFieldsValue(
      service.fields.reduce((acc, field) => {
        acc[field.label.toLowerCase()] = field.value || "";
        return acc;
      }, {})
    );
    setRenewalPreferences(false); // Reset renewal preferences toggle
    setIsModalVisible(true); // Open modal
  };

  // Close the modal
  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedService(null); // Clear selected service
    form.resetFields(); // Reset form
        setSelectedFile(null);

  };

  // Form submission handler
  const handleFormSubmit = async () => {
        const formData = new FormData();

    try {
const values = await form.validateFields();
      const clientID = selectedService?.ClientID || selectedService?._id;

      if (!clientID) {
        message.error("Client ID is missing. Please try again.");
        return;
      }
if (selectedFile) {
  formData.append("documentAttach", selectedFile);
}
console.log("FormData entries:", [...formData.entries()]);


      // Map frontend field labels to backend schema field names
      const fieldMappings = {
        "single line text": "singleTextLine",
        number: "number",
        email: "email",
        "paragraph text": "paragraphText",
        "website url": "url",

        "date/time": "date",
        "document upload": "documentAttach",
        renewalPreferences: "renewalPreferences",
      };

      // Add all fields to FormData
Object.keys(values).forEach((key) => {
  const mappedKey = fieldMappings[key] || key;

  let value = values[key];
  if (Array.isArray(value)) {
    value = value.join(", "); // Convert array to a comma-separated string
  }

  formData.append(mappedKey, value);
});

      // Add ClientID explicitly
      formData.append("ClientID", clientID);
      formData.append("renewalPreferences", renewalPreferences);

      console.log("FormData being sent:", [...formData.entries()]);

      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/document/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      message.success("Document created successfully!");
      handleModalClose();
    } catch (err) {
      console.error("Error submitting form:", err);
      message.error("Failed to create the document. Please try again.");
    }
  };

  // Ant Design table columns
  const columns = [
    {
      title: "Service Name",
      dataIndex: "servicename",
      key: "servicename",
    },
    {
      title: "Description",
      dataIndex: "serviceDescription",
      key: "serviceDescription",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <button
          onClick={() => handleViewClick(record)} // Pass service to handler
          className="view-button"
        >
          View
        </button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="my-request-form">
      <h1>My Request Forms</h1>
      <Table
        columns={columns}
        dataSource={services}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
      />

      {/* Modal for viewing and filling form */}
      <Modal
        title={`Fill Form - ${selectedService?.servicename}`}
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          {selectedService?.fields.map((field, index) => {
            // Normalize field.label for backend compatibility (optional)
            const fieldName = field.label.toLowerCase(); // Convert to lowercase if necessary

            return (
              <Form.Item
                key={index}
                name={fieldName} // Ensure this matches the backend schema
                label={field.label}
                rules={[
                  {
                    required: field.required || field.type === "file",
                    message: `${field.label} is required`,
                  },
                ]}
              >
                {renderFieldInput(field, setSelectedFile)}
              </Form.Item>
            );
          })}

          {/* Renewal Preferences Toggle */}
          <Form.Item label="Renewal Preferences">
            <div>
              <span style={{ marginRight: 10 }}>Auto yearly Renewal:</span>
              <Switch
                checked={renewalPreferences}
                onChange={(checked) => setRenewalPreferences(checked)}
              />
            </div>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Submit Form
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

// Function to dynamically render form fields based on their type
const renderFieldInput = (field, setSelectedFile) => {
  switch (field.type) {
    case "text":
      return <Input placeholder={`Enter ${field.label}`} />;
    case "email":
      return <Input type="email" placeholder={`Enter ${field.label}`} />;
    case "number":
      return <Input type="number" placeholder={`Enter ${field.label}`} />;
    case "date":
      return <Input type="date" />;
    case "file":
      return (
        <Input
          type="file"
          onChange={(e) => {
            const file = e.target.files[0];
            setSelectedFile(file); // Update selected file state
          }}
        />
      );
    case "textarea":
      return <Input.TextArea rows={4} placeholder={`Enter ${field.label}`} />;
    default:
      return <Input placeholder={`Enter ${field.label}`} />;
  }
};

export default MyRequestForm;
