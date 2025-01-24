import React, { useEffect, useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const CorrectionForm = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [document, setDocument] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/document/document-id/${id}`,
          { withCredentials: true }
        );
        setDocument(response.data.document);
        form.setFieldsValue(response.data.document.formData);
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchDocument();
  }, [id, form]);

  const handleSubmit = async (values) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/document/submit-corrections/${id}`,
        { formData: values },
        { withCredentials: true }
      );
      message.success("Corrections submitted successfully!");
      navigate("/register-user-home");
    } catch (error) {
      console.error("Error submitting corrections:", error);
      message.error("Failed to submit corrections. Please try again.");
    }
  };

  return (
    <div>
      <h2>Submit Corrections</h2>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {document?.corrections?.map((field) => (
          <Form.Item
            key={field}
            name={field}
            label={field.charAt(0).toUpperCase() + field.slice(1)}
            rules={[{ required: true, message: `Please correct ${field}` }]}
          >
            <Input />
          </Form.Item>
        ))}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CorrectionForm;
