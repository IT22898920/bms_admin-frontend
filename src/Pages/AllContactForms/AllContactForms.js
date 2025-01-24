import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import {
  FaFont,
  FaHashtag,
  FaEnvelope,
  FaParagraph,
  FaUser,
  FaSlidersH,
  FaCheckSquare,
  FaListUl,
  FaDotCircle,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaLock,
  FaFileUpload,
  FaDivide,
  FaLink,
  FaUpload,
} from "react-icons/fa";
import "./AllContactForms.css";

const AllContactForms = () => {
  const navigate = useNavigate(); // Initialize navigate function

  // Function to handle Save button click
  const handleSave = () => {
    // Logic to save form data can be added here
    console.log("Form data saved!");

    // Redirect to "All Simple Contact Forms" page
    navigate("/dashboard");
  };

    const formsData = [
      {
        title: "Simple Contact Form",
        description: "Lorem Ipsumdollar Sit Dgdf Fh",
      },
      {
        title: "Simple Contact Form",
        description: "Lorem Ipsumdollar Sit Dgdf Fh",
      },
      {
        title: "Simple Contact Form",
        description: "Lorem Ipsumdollar Sit Dgdf Fh",
      },
      {
        title: "Simple Contact Form",
        description: "Lorem Ipsumdollar Sit Dgdf Fh",
      },
    ];

  return (
    <div className="contact-form-container">
      {/* Fields Section */}
      <div className="fields-section">
        <div className="header-container">
          <div className="header-item active">FIELDS</div>
          <div className="header-item">SAMPLE</div>
        </div>

        <div className="fields-list">
          <h4>Standard Fields</h4>
          <div className="fields-grid">
            <button className="field-button">
              <FaFont /> Single line text
            </button>
            <button className="field-button">
              <FaHashtag /> Number
            </button>
            <button className="field-button">
              <FaParagraph /> Paragraph text
            </button>
            <button className="field-button">
              <FaEnvelope /> Email
            </button>
            <button className="field-button">
              <FaUser /> Name
            </button>
            <button className="field-button">
              <FaSlidersH /> Number slider
            </button>
            <button className="field-button">
              <FaCheckSquare /> Check box
            </button>
            <button className="field-button">
              <FaListUl /> Dropdown
            </button>
            <button className="field-button">
              <FaDotCircle /> Radio button
            </button>
            <button className="field-button">
              <FaCheckSquare /> reCAPTCHA
            </button>
          </div>

          <h4>Standard Fields</h4>
          <div className="fields-grid">
            <button className="field-button">
              <FaPhone /> Phone
            </button>
            <button className="field-button">
              <FaMapMarkerAlt /> Address
            </button>
            <button className="field-button">
              <FaCalendarAlt /> Date/Time
            </button>
            <button className="field-button">
              <FaLink /> Website URL
            </button>
            <button className="field-button">
              <FaLock /> Password
            </button>
            <button className="field-button">
              <FaFileUpload /> Document upload
            </button>
            <button className="field-button">
              <FaDivide /> Page break
            </button>
            <button className="field-button">
              <FaDivide /> Section divider
            </button>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="form-section">
        <div className="form-header">
          <div className="form-actions">
            <button className="preview-button">Preview</button>
            <button className="save-button" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
        <div className="form-grid">
          {formsData.map((form, index) => (
            <div key={index} className="form-card">
              <div className="form-image-placeholder"></div>
              <div className="form-card-content">
                <h4>{form.title}</h4>
                <p>{form.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllContactForms;
