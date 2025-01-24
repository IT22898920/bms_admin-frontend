import React, { useState, useEffect } from "react";
import ProfessionalImage from "../../img/istockphoto-1916729901-1024x1024.jpg";
import MeetingImage from "../../img/pexels-cowomen-1058097-2041393.jpg";
import VisaImage from "../../img/pexels-cytonn-955395.jpg";
import TaxImage from "../../img/pexels-divinetechygirl-1181425.jpg";
import LicensingImage from "../../img/pexels-divinetechygirl-1181425.jpg";
import PayrollImage from "../../img/pexels-divinetechygirl-1181563.jpg";
import LOGO from "../../img/ll.png";
import BackgroundImage from "../../img/pexels-divinetechygirl-1181224.jpg";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Upload,
  Menu,
  Badge,
  Dropdown,
  message,
} from "antd";
import "./Home.css";
// Video Import
import Video from "../../assets/video.mp4"; // Add the video path
import backgroundVideo from "../../assets/backgroundVideo.mp4";


const { Option } = Select;

const Home = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm(); // Ant Design form instance
  const [serviceNames, setServiceNames] = useState([]); // State for service names

const fetchServiceNames = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/forms/service-names`,
      { withCredentials: true }
    );
    console.log(response.data); // Log response to see its structure
    setServiceNames(response.data.data);
  } catch (error) {
    console.error("Error fetching service names:", error);
  }
};



useEffect(() => {
  // Fetch service names from backend
  const fetchServiceNames = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/forms/service-names-unregister`,
        { withCredentials: true }
      );
      setServiceNames(response.data.data);
    } catch (error) {
      console.error("Error fetching service names:", error);
    }
  };

  fetchServiceNames();
}, []);

    

  // Submit new client service
  const onFinish = async (values) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/client-service/create-unregister`,
        values,
        { withCredentials: true }
      );
      message.success("Client service submitted successfully!");
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error submitting client service:", error);
      message.error("Failed to submit client service. Please try again.");
    }
  };

  

  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <img src={LOGO} alt="NEWCOM Logo" />
        </div>
        <nav>
          <ul className="nav-links">
            <li>About</li>
            <li>Contact</li>
            <li>Services</li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </ul>
        </nav>
        <button className="enquire-btn">Enquire Now</button>
      </header>
      {/* Hero Section with Video */}
      <section className="hero">
        <div className="hero-content">
          <h1>Professional Business Services to Help You Thrive</h1>
          <p>
            From visa processing to tax consultations, we handle the
            complexities so you can focus on growth.
          </p>
          <button className="btn-primary" onClick={showModal}>
            Explore Services
          </button>
        </div>
        <div className="hero-images">
          <div className="video-container">
            {/* Autoplay and Muted Attributes Added */}
            <video width="100%" height="auto" autoPlay muted loop>
              <source src={Video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>
      {/* Modal for Form */}
      <Modal
        title="Client Service Management"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="clientName"
            label="Client Name"
            rules={[
              { required: true, message: "Please enter the client's name" },
            ]}
          >
            <Input placeholder="Client Name" />
          </Form.Item>
          <Form.Item
            name="clientemail"
            label="Client Email"
            rules={[
              { required: true, message: "Please enter the client's email" },
              { type: "email", message: "Please enter a valid email address" },
            ]}
          >
            <Input placeholder="Client Email" />
          </Form.Item>

          <Form.Item
            name="clientnumber"
            label="Client Contact Number"
            rules={[
              {
                required: true,
                message: "Please enter the client's contact number",
              },
            ]}
          >
            <Input placeholder="Client Contact Number" />
          </Form.Item>
          <Form.Item
            name="serviceName"
            label="Service Name"
            rules={[
              { required: true, message: "Please select a service name" },
            ]}
          >
            <Select placeholder="Select Service">
              {serviceNames.length > 0 ? (
                serviceNames.map((serviceName, index) => (
                  <Option key={index} value={serviceName}>
                    {serviceName}
                  </Option>
                ))
              ) : (
                <Option value="">No services available</Option>
              )}
            </Select>
          </Form.Item>

          <Form.Item name="serviceDescription" label="Service Description">
            <Input.TextArea rows={4} placeholder="Description of the service" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Submit Client Service
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {/* About Us Section */}
      <section className="about-us">
        <div className="about-image">
          <img src={TaxImage} alt="About Us" />
        </div>
        <div className="about-content">
          <h2>About Us</h2>
          <p>
            We are a professional business service provider specializing in visa
            processing, tax consultations, business licensing, payroll
            management, and compliance services. With years of experience and a
            client-centric approach, we ensure seamless solutions tailored to
            your needs.
          </p>
          <button className="btn-primary">Contact Us</button>
        </div>
      </section>
      {/* Our Services Section */}(
      <section className="services">
        <h2>Our Services</h2>
        <div className="service-cards">
          <div className="service-card">
            <div className="service-image">
              <img src={VisaImage} alt="Visa Processing" />
              <div className="play-icon">▶</div>
            </div>
            <h3>Visa Processing</h3>
            <p>
              We simplify visa applications for businesses and individuals,
              ensuring compliance and timely approvals.
            </p>
          </div>
          <div className="service-card">
            <div className="service-image">
              <img src={TaxImage} alt="Tax Consultation" />
              <div className="play-icon">▶</div>
            </div>
            <h3>Tax Consultation</h3>
            <p>
              Navigate tax regulations with ease. We offer comprehensive tax
              advice and filing services to keep you compliant.
            </p>
          </div>
          <div className="service-card">
            <div className="service-image">
              <img src={LicensingImage} alt="Business Licensing" />
              <div className="play-icon">▶</div>
            </div>
            <h3>Business Licensing</h3>
            <p>
              Whether you're starting a new business or renewing an existing
              license, our team is here to help.
            </p>
          </div>
          <div className="service-card">
            <div className="service-image">
              <img src={PayrollImage} alt="Payroll Services" />
              <div className="play-icon">▶</div>
            </div>
            <h3>Payroll Services</h3>
            <p>
              Outsource your payroll for accuracy and compliance with regulatory
              requirements.
            </p>
          </div>
        </div>
      </section>
      {/* How It Works Section */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-container">
          <div className="step-card">
            <h3>01</h3>
            <h4>Explore Our Services</h4>
            <p>
              Browse through our range of services to find the right solution
              for your business.
            </p>
          </div>
          <div className="step-card">
            <h3>02</h3>
            <h4>Submit Your Inquiry</h4>
            <p>Use our inquiry form to share your requirements with us.</p>
          </div>
          <div className="step-card">
            <h3>03</h3>
            <h4>Get Personalized Support</h4>
            <p>Our experts will guide you through the process step-by-step.</p>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="footer-section">
        {/* Connect Section */}
        <div className="footer-connect">
          <video autoPlay muted loop>
            <source src={backgroundVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
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

export default Home;
