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
import "./ContactForm.css";

const ContactForm = () => {
  const navigate = useNavigate(); // Initialize navigate function

  // Function to handle Save button click
  const handleSave = () => {
    // Logic to save form data can be added here
    console.log("Form data saved!");

    // Redirect to "All Simple Contact Forms" page
    navigate("/all-contact-forms");
  };

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
          <h2>Simple Contact Form</h2>
          <div className="form-actions">
            <button className="preview-button">Preview</button>
            <button className="save-button" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
        <form className="contact-form">
          <div className="form-row">
            <label>
              Name<span>*</span>
            </label>
            <div className="form-inline">
              <input type="text" placeholder="First Name" />
              <input type="text" placeholder="Last Name" />
            </div>
          </div>

          <div className="form-row">
            <label>
              Email<span>*</span>
            </label>
            <input type="email" placeholder="Email" />
          </div>
          <div className="form-row">
            <label>
              Address<span>*</span>
            </label>
            <input type="text" placeholder="Address" />
          </div>
          <div className="form-row">
            <label>
              Contact Number<span>*</span>
            </label>
            <input type="text" placeholder="Contact Number" />
          </div>
          <div className="form-row">
            <label>
              Comment or Message<span>*</span>
            </label>
            <textarea placeholder="Comment"></textarea>
          </div>
          <div className="form-row">
            <label>
              Upload Resume<span>*</span>
            </label>
            <div className="upload-container">
              <FaUpload />
              <p>Drag and drop a file here or click to upload.</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
