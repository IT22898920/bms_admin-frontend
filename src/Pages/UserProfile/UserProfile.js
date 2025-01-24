import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LOGO from "../../img/ll.png";
import BackgroundImage from "../../img/pexels-divinetechygirl-1181224.jpg";
import profile_image from "../../img/user.png";
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CloseOutlined,
  BellOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import "./UserProfile.css";
import {
  Modal,
  Button,
  Form,
  Input,
  Select,
  Upload,
  DatePicker,
  TimePicker,
} from "antd";
import axios from "axios";
import { toast } from "react-toastify";
import { Spin, message } from "antd";
import { HistoryOutlined } from "@ant-design/icons";

const { Option } = Select;

// Timeline stages
const timelineStages = [
  { title: "Collecting", description: "Document collection started." },
  { title: "Screening", description: "Documents under review." },
  { title: "Processing", description: "Processing the documents." },
  { title: "Done", description: "Verification completed." },
];

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isScheduleModalVisible, setIsScheduleModalVisible] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTimelineModalVisible, setIsTimelineModalVisible] = useState(false);

  // For notifications
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const navigate = useNavigate();

  // ========================
  // Fetch user profile
  // ========================
  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/getUser`,
        {
          withCredentials: true,
        }
      );
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  // ========================
  // Fetch notifications
  // ========================
  const fetchNotifications = async () => {
    try {
      const resp = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/notifications`,
        { withCredentials: true }
      );
      const fetched = resp.data.notifications || [];
      setNotifications(fetched);

      // Count how many are unread
      const count = fetched.filter((n) => !n.isRead).length;
      setUnreadCount(count);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // ========================
  // Logout
  // ========================
  const handleLogout = async () => {
    try {
      await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/logout`, {
        withCredentials: true,
      });
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // ========================
  // Lifecycle
  // ========================
  useEffect(() => {
    fetchUserProfile();
    fetchNotifications();
  }, []);

  // ========================
  // Modal for complaint form
  // ========================
  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // ========================
  // "File a Concern" form
  // ========================
  const onFinish = async (values) => {
    const formData = new FormData();

    // Append text fields
    formData.append("firstName", values.firstName);
    formData.append("lastName", values.lastName);
    formData.append("email", values.email);
    formData.append("contactNumber", values.contactNumber);
    formData.append("complaintSubject", values.complaintSubject);
    formData.append("complaintDetails", values.complaintDetails);

    // Append the file
    const file = values.attachment?.fileList[0]?.originFileObj;
    if (file) {
      formData.append("fileAttachment", file);
      console.log("File attached to FormData:", file);
    } else {
      console.warn("No file selected. Submitting without file.");
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/complaint/creates`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      console.log("Response Data:", response.data);
      toast.success("Complaint submitted successfully!");
      setIsModalVisible(false);
    } catch (error) {
      console.error(
        "Error submitting complaint:",
        error.response?.data || error
      );
      toast.error("Failed to submit the complaint. Please try again.");
    }
  };

  // ========================
  // Meeting schedule
  // ========================
  const showScheduleModal = () => {
    setIsScheduleModalVisible(true);
  };
  const handleScheduleCancel = () => {
    setIsScheduleModalVisible(false);
  };

  const onScheduleFinish = async (values) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/meeting-schedule/create-meeting`,
        {
          ...values,
          preferredDate: values.preferredDate.format("YYYY-MM-DD"),
          preferredTime: values.preferredTime.format("h:mm A"),
        },
        { withCredentials: true }
      );
      console.log("API Response:", response.data);
      setIsScheduleModalVisible(false);
      alert("Meeting scheduled successfully!");
    } catch (error) {
      console.error("Error scheduling meeting:", error.response?.data || error);
      alert(
        error.response?.data?.message ||
          "Failed to schedule the meeting. Please try again."
      );
    }
  };

  const fetchUserProfileAndDocuments = async () => {
    try {
      const userResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/getUser`,
        { withCredentials: true }
      );
      setUserData(userResponse.data);

      const documentsResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/document/user-profile-timeline`,
        { withCredentials: true }
      );
      setDocuments(documentsResponse.data.documents);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Failed to fetch user data or documents.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfileAndDocuments();
  }, []);

  const getTimelineStatusClass = (currentStatus, stageIndex) => {
    const currentStatusIndex = timelineStages.findIndex(
      (stage) => stage.title === currentStatus
    );
    return stageIndex <= currentStatusIndex ? "completed" : "";
  };

  // ========================
  // Navigation
  // ========================
  const handleMyRequestsClick = () => {
    navigate("/my-requests");
  };

  // Open timeline modal
  const handleTimelineClick = () => {
    setIsTimelineModalVisible(true);
  };
  // Close timeline modal
  const handleTimelineModalClose = () => {
    setIsTimelineModalVisible(false);
  };

  // ========================
  // If user not loaded yet
  // ========================
  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* HEADER */}
      <header className="header">
        <div className="logo">
          <Link to="/register-user-home">
            <img src={LOGO} alt="NEWCOM Logo" />
          </Link>
        </div>

        <nav>
          <ul className="nav-links">
            <li>About</li>
            <li>Contact</li>
            <li>Services</li>
          </ul>
        </nav>
        <div className="header-actions">
          <HistoryOutlined
            className="timeline-main-icon"
            style={{ fontSize: "24px", cursor: "pointer", color: "blue" }}
            onClick={handleTimelineClick}
          />
        </div>
        <div className="header-actions">
          {/* Bell icon with unread count */}
          <Link to="/notificationsClient" style={{ marginRight: 20 }}>
            <span style={{ position: "relative" }}>
              <span
                style={{
                  fontSize: "20px",
                  cursor: "pointer",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: -10,
                    right: -10,
                    background: "red",
                    color: "white",
                    borderRadius: "50%",
                    width: 18,
                    height: 18,
                    fontSize: 12,
                    display: unreadCount > 0 ? "flex" : "none",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {unreadCount}
                </span>
                <BellOutlined style={{ fontSize: 24, marginLeft: "20px" }} />
              </span>
            </span>
          </Link>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
          <button className="enquire-btn">Enquire Now</button>
          <div className="profile-icon">
            <Link to="/user-profile">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-user"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </Link>
          </div>
        </div>
      </header>
      {/* TIMELINE MODAL */}
      <Modal
        title="Document Timelines"
        visible={isTimelineModalVisible}
        onCancel={handleTimelineModalClose}
        footer={[
          <Button key="close" onClick={handleTimelineModalClose}>
            Close
          </Button>,
        ]}
      >
        {documents.length > 0 ? (
          documents.map((doc) => (
            <div key={doc._id} className="document-section">
              <h4>Document ID: {doc._id}</h4>
              <div className="timeline">
                {timelineStages.map((stage, index) => {
                  const currentStatusIndex = timelineStages.findIndex(
                    (s) => s.title === doc.timelineStatus
                  );

                  const isCompleted = index <= currentStatusIndex;

                  return (
                    <div
                      key={index}
                      className={`timeline-item ${
                        isCompleted ? "completed" : ""
                      }`}
                    >
                      <div className="status-icon">
                        {isCompleted ? "✔" : "○"}
                      </div>
                      <div className="timeline-content">
                        <h4>{stage.title}</h4>
                        <p>{stage.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <p>No documents found.</p>
        )}
      </Modal>


      {/* MAIN CONTENT */}
      <div className="details-container">
        {/* Left Section */}
        <div className="contact-details-section">
          <div className="profile-header">
            <img src={profile_image} alt="Profile" />
            <div className="client-info">
              <h2>{userData.name}</h2>
            </div>
          </div>
          <div className="divider"></div>
          <ul className="contact-details">
            <li>
              <MailOutlined /> {userData.email}
            </li>
            <li>
              <PhoneOutlined /> {userData.phone || "N/A"}
            </li>
            <li>
              <EnvironmentOutlined />
              {userData.address || "No Address Provided"}
            </li>
          </ul>
          <Button
            type="primary"
            className="schedule-meeting-btn"
            onClick={showScheduleModal}
          >
            Schedule Meeting
          </Button>
          <Button
            type="default"
            className="my-requests-btn"
            onClick={handleMyRequestsClick}
            style={{ marginTop: "15px", width: "100%" }}
          >
            My Request Forms
          </Button>
        </div>

        {/* Schedule Meeting Modal */}
        <Modal
          title="Schedule a Meeting"
          visible={isScheduleModalVisible}
          onCancel={handleScheduleCancel}
          footer={null}
        >
          <Form layout="vertical" onFinish={onScheduleFinish}>
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[
                { required: true, message: "Please enter your first name" },
              ]}
            >
              <Input placeholder="First Name" />
            </Form.Item>
            <Form.Item
              name="lastName"
              label="Last Name"
              rules={[
                { required: true, message: "Please enter your last name" },
              ]}
            >
              <Input placeholder="Last Name" />
            </Form.Item>
            <Form.Item
              name="contactNumber"
              label="Contact Number"
              rules={[
                { required: true, message: "Please enter your contact number" },
              ]}
            >
              <Input placeholder="Contact Number" />
            </Form.Item>
            <Form.Item
              name="preferredDate"
              label="Preferred Date"
              rules={[{ required: true, message: "Please select a date" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="preferredTime"
              label="Preferred Time"
              rules={[{ required: true, message: "Please select a time" }]}
            >
              <TimePicker
                use12Hours
                format="h:mm A"
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item
              name="description"
              label="Purpose of the Meeting"
              rules={[
                { required: true, message: "Please describe the purpose" },
              ]}
            >
              <Input.TextArea
                rows={4}
                placeholder="Briefly describe the reason for the meeting"
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Confirm Meeting
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* Right Section */}
        <div className="details-container">
          <div className="details-section">
            <h3>DETAILS</h3>
            <div className="details">
              <div className="detail-item">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{userData.name}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{userData.email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Address:</span>
                <span className="detail-value">
                  {userData.address || "N/A"}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Contact Number:</span>
                <span className="detail-value">{userData.phone || "N/A"}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Resume:</span>
                <span className="detail-value">
                  <a href="/resume.pdf" className="resume-link">
                    resume.pdf
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Concern Section */}
      <div className="concern-section">
        <h2>Have a Concern? Let Us Know!</h2>
        <p>
          We value your feedback and are here to address your concerns promptly.
          Submit your compliance-related issues or complaints through the form.
          Our team will review and respond within 48 hours.
        </p>
        <Button type="primary" onClick={showModal}>
          File a Concern
        </Button>
      </div>

      {/* Modal for "File a Concern" Form */}
      <Modal
        title="Have a Concern? Let Us Know!"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ email: userData.email }}
        >
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[
              { required: true, message: "Please enter your first name" },
            ]}
          >
            <Input placeholder="First Name" />
          </Form.Item>
          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: "Please enter your last name" }]}
          >
            <Input placeholder="Last Name" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input placeholder="Email" disabled />
          </Form.Item>
          <Form.Item
            name="contactNumber"
            label="Contact Number"
            rules={[
              { required: true, message: "Please enter your contact number" },
            ]}
          >
            <Input placeholder="Contact Number" />
          </Form.Item>
          <Form.Item
            name="complaintSubject"
            label="Complaint Subject"
            rules={[{ required: true, message: "Please select a subject" }]}
          >
            <Select placeholder="Select Subject">
              <Option value="KYC Management">KYC Management</Option>
              <Option value="BRN Tracking">BRN Tracking</Option>
              <Option value="Compliance Documentation">
                Compliance Documentation
              </Option>
              <Option value="Regulatory Monitoring">
                Regulatory Monitoring
              </Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="complaintDetails"
            label="Complaint Details"
            rules={[
              { required: true, message: "Please provide complaint details" },
            ]}
          >
            <Input.TextArea rows={4} placeholder="Details of the complaint" />
          </Form.Item>

          <Form.Item name="attachment" label="Attachment Upload">
            <Upload
              maxCount={1}
              beforeUpload={() => false} // Prevent auto-upload
              listType="text"
              onChange={(info) => {
                console.log("Selected file:", info.fileList[0]?.originFileObj);
              }}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Submit a Complaint
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* FOOTER */}
      <footer className="footer-section">
        {/* Connect Section */}
        <div
          className="footer-connect"
          style={{ backgroundImage: `url(${BackgroundImage})` }}
        >
          <div className="footer-content">
            <h3>Have Questions? Let’s Connect!</h3>
            <button className="btn-primary">Contact Us</button>
          </div>
        </div>

        {/* Footer Info Section */}
        <div className="footer-info">
          <div className="footer-logo">
            <img src={LOGO} alt="NEWCOM Logo" />
            <p>
              We are a professional business service provider specializing in
              visa processing, tax consultations, business licensing, payroll
              management, and compliance services.
            </p>
          </div>
          <div className="footer-contact">
            <h4>Contact Us</h4>
            <p>Address: Office XYZ, Downtown, City, Country</p>
            <p>Phone: +1 234 567 890</p>
            <p>Email: info@gmail.com</p>
          </div>
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li>About</li>
              <li>Services</li>
              <li>Contact</li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>© 2024 NEWCOM. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default UserProfile;
