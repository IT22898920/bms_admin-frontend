import React, { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Rnd } from "react-rnd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTextWidth,
  faHashtag,
  faParagraph,
  faEnvelope,
  faCheckSquare,
  faCaretDown,
  faPhone,
  faMapMarkerAlt,
  faCalendarAlt,
  faGlobe,
  faLock,
  faFileUpload,
  faBars,
  
} from "@fortawesome/free-solid-svg-icons";
import { EyeOutlined, SaveOutlined } from "@ant-design/icons"; // Import preview and save icons
import { Modal, Input, message } from "antd";
import "./FormBuilder.css";
import axios from "axios";
import {  useNavigate } from "react-router-dom";

// List of available fields
const availableFields = [
  {
    id: "1",
    type: "text",
    label: "Single Line Text",
    icon: faTextWidth,
  },
  {
    id: "2",
    type: "number",
    label: "Number",
    icon: faHashtag,
  },
  {
    id: "3",
    type: "paragraph",
    label: "Paragraph Text",
    icon: faParagraph,
  },
  {
    id: "4",
    type: "email",
    label: "Email",
    icon: faEnvelope,
  },

  {
    id: "6",
    type: "slider",
    label: "Number Slider",
    icon: faCaretDown,
  },

  {
    id: "8",
    type: "phone",
    label: "Phone",
    icon: faPhone,
  },
  {
    id: "9",
    type: "address",
    label: "Address",
    icon: faMapMarkerAlt,
  },
  {
    id: "10",
    type: "date",
    label: "Date/Time",
    icon: faCalendarAlt,
  },
  {
    id: "11",
    type: "url",
    label: "Website URL",
    icon: faGlobe,
  },
  {
    id: "12",
    type: "password",
    label: "Password",
    icon: faLock,
  },
  {
    id: "13",
    type: "file",
    label: "Document Upload",
    icon: faFileUpload,
  },
  {
    id: "14",
    type: "divider",
    label: "Section Divider",
    icon: faBars,
  },
  {
    id: "15",
    type: "name",
    label: "Name",
    icon: faCheckSquare,
  },
];

// Draggable field component
const Field = ({ field }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "field",
    item: field,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} className="field" style={{ opacity: isDragging ? 0.5 : 1 }}>
      <FontAwesomeIcon icon={field.icon} className="field-icon" />
      {field.label}
    </div>
  );
};

// Form preview container
const FormPreview = ({ items, setItems }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [previewSize, setPreviewSize] = useState({ width: 800, height: 500 }); // Initial size of the preview container

  const [, drop] = useDrop(() => ({
    accept: "field",
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const container = document
        .getElementById("form-preview-container")
        .getBoundingClientRect();

      const left = offset.x - container.left;
      const top = offset.y - container.top;

      setItems((prevItems) => [
        ...prevItems,
        {
          ...item,
          left: (left / previewSize.width) * 100,
          top: (top / previewSize.height) * 100,
          width: 30, // Default width percentage
          height: 10, // Default height percentage
        },
      ]);
    },
  }));

  const updateContainerSize = () => {
    const container = document.getElementById("form-preview-container");
    if (!container) return;

    const boundaries = items.reduce(
      (acc, item) => {
        const itemRight =
          (item.left / 100) * previewSize.width +
          (item.width / 100) * previewSize.width;
        const itemBottom =
          (item.top / 100) * previewSize.height +
          (item.height / 100) * previewSize.height;
        acc.maxRight = Math.max(acc.maxRight, itemRight);
        acc.maxBottom = Math.max(acc.maxBottom, itemBottom);
        return acc;
      },
      { maxRight: 800, maxBottom: 500 } // Initial size boundaries
    );

    setPreviewSize({
      width: Math.max(boundaries.maxRight + 20, 800), // Add padding
      height: Math.max(boundaries.maxBottom + 20, 500),
    });
  };

  useEffect(() => {
    updateContainerSize();
  }, [items]);

  const updateItem = (index, data) => {
    setItems((prevItems) =>
      prevItems.map((item, i) => (i === index ? { ...item, ...data } : item))
    );
  };

  const handleKeyDown = (event) => {
    if (event.key === "Delete" && selectedIndex !== null) {
      setItems((prevItems) => prevItems.filter((_, i) => i !== selectedIndex));
      setSelectedIndex(null); // Clear selection
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex]);

  return (
    <div
      id="form-preview-container"
      ref={drop}
      style={{
        position: "relative",
        border: "2px dashed #ccc",
        height: previewSize.height,
        width: previewSize.width,
        backgroundColor: "#f9f9f9",
        overflow: "auto",
        margin: "auto",
      }}
    >
      {items.map((item, index) => (
        <DraggableResizableItem
          key={index}
          item={item}
          index={index}
          isSelected={selectedIndex === index}
          updateItem={updateItem}
          setSelectedIndex={setSelectedIndex}
          containerSize={previewSize}
        />
      ))}
    </div>
  );
};

// Draggable and resizable item in the preview
const DraggableResizableItem = ({
  item,
  index,
  updateItem,
  setSelectedIndex,
  isSelected,
  containerSize,
}) => {
  const { width: containerWidth, height: containerHeight } = containerSize;

  return (
    <Rnd
      size={{
        width: `${item.width}%`,
        height: `${item.height}%`,
      }}
      position={{
        x: (item.left / 100) * containerWidth,
        y: (item.top / 100) * containerHeight,
      }}
      onDragStop={(e, data) =>
        updateItem(index, {
          left: (data.x / containerWidth) * 100,
          top: (data.y / containerHeight) * 100,
        })
      }
      onResizeStop={(e, direction, ref, delta, position) =>
        updateItem(index, {
          width: (ref.offsetWidth / containerWidth) * 100,
          height: (ref.offsetHeight / containerHeight) * 100,
          left: (position.x / containerWidth) * 100,
          top: (position.y / containerHeight) * 100,
        })
      }
      onClick={() => setSelectedIndex(index)}
      bounds="parent"
      style={{
        border: isSelected ? "2px solid #007bff" : "1px solid #ccc",
        backgroundColor: "#fff",
        padding: "10px",
        cursor: "pointer",
      }}
    >
      <div>{renderField(item, index, updateItem)}</div>
    </Rnd>
  );
};

// Render different field types
const renderField = (field, index, updateItem) => {
  const label = field.label ? (
    <label
      style={{
        fontSize: "14px",
        fontWeight: "500",
        color: "#333",
        marginBottom: "5px",
        display: "block",
      }}
    >
      {field.label}
      {field.required && (
        <span style={{ color: "#e63946", marginLeft: "2px" }}>*</span>
      )}
    </label>
  ) : null;
  const handleInputChange = (e) => {
    updateItem(index, { value: e.target.value });
  };
  switch (field.type) {
    case "text":
      return (
        <div className="form-group">
          {label}
          <input
            type="text"
            placeholder={`Enter ${field.label || "Text"}`}
            className="form-control"
            value={field.value || ""}
            onChange={handleInputChange}
            style={{
              resize: "both", // Allow resizing in both directions
              overflow: "auto", // Handle overflow during resize
            }}
          />
        </div>
      );
    case "number":
      return (
        <div className="form-group">
          {label}
          <input
            type="number"
            placeholder={`Enter ${field.label}`}
            className="form-control"
            value={field.value || ""}
            onChange={handleInputChange}
          />
        </div>
      );
    case "paragraph":
      return (
        <div className="form-group">
          {label}
          <textarea
            placeholder={`Enter ${field.label}`}
            className="form-control"
            rows="4"
            value={field.value || ""}
            onChange={handleInputChange}
          />
        </div>
      );
    case "email":
      return (
        <div className="form-group">
          {label}
          <input
            type="email"
            placeholder={`Enter ${field.label}`}
            className="form-control"
            value={field.value || ""}
            onChange={handleInputChange}
          />
        </div>
      );
    case "slider":
      return (
        <div className="form-group">
          {label}
          <input
            type="range"
            className="form-control"
            value={field.value || ""}
            onChange={handleInputChange}
          />
        </div>
      );

    case "phone":
      return (
        <div className="form-group">
          {label}
          <input
            type="tel"
            placeholder={`Enter ${field.label}`}
            className="form-control"
            value={field.value || ""}
            onChange={handleInputChange}
          />
        </div>
      );
    case "address":
      return (
        <div className="form-group">
          {label}
          <input
            type="text"
            placeholder={`Enter ${field.label}`}
            className="form-control"
            value={field.value || ""}
            onChange={handleInputChange}
          />
        </div>
      );
    case "date":
      return (
        <div className="form-group">
          {label}
          <input
            type="date"
            className="form-control"
            value={field.value || ""}
            onChange={handleInputChange}
          />
        </div>
      );
    case "url":
      return (
        <div className="form-group">
          {label}
          <input
            type="url"
            placeholder={`Enter ${field.label}`}
            className="form-control"
            value={field.value || ""}
            onChange={handleInputChange}
          />
        </div>
      );
    case "password":
      return (
        <div className="form-group">
          {label}
          <input
            type="password"
            placeholder={`Enter ${field.label}`}
            className="form-control"
            value={field.value || ""}
            onChange={handleInputChange}
          />
        </div>
      );
    case "file":
      return (
        <div className="form-group">
          {label}
          <input type="file" className="form-control" />
        </div>
      );
    case "divider":
      return (
        <hr
          className="form-divider"
          value={field.value || ""}
          onChange={handleInputChange}
        />
      );
    case "name":
      return (
        <div className="form-group">
          {label}
          <input
            type="text"
            placeholder={`Enter ${field.label}`}
            className="form-control"
            value={field.value || ""}
            onChange={handleInputChange}
          />
        </div>
      );
    default:
      console.error("Unsupported field type:", field);
      return <div style={{ color: "red" }}>Unsupported field type</div>;
  }
};

// Main FormBuilder component
const FormBuilder = () => {
  const [items, setItems] = useState([]);
  // Handler for the Preview button
  const [showPreview, setShowPreview] = useState(false); // Controls preview modal visibility
  const [servicename, setFormTitle] = useState("");
  const [serviceDescription, setFormDescription] = useState("");
const navigate = useNavigate();

  // Function to toggle preview
  const handlePreview = () => {
    setShowPreview(true);
  };

  // Function to close the modal
  const handleClosePreview = () => {
    setShowPreview(false);
  };
  // Handler for the Save button 
const handleSave = async () => {
  if (!servicename || items.length === 0) {
    message.error("Form title and at least one field are required.");
    return;
  }

  const formData = {
    servicename,
    serviceDescription,
    fields: items,
  };

  console.log("Form Data:", formData); // Debug log

  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/forms/create`,
      formData,
      {
        withCredentials: true, // Include credentials for secure endpoints
      }
    );

    if (response.status === 201) {
      message.success("Form created successfully!");
      setItems([]);
      setFormTitle("");
      setFormDescription("");
          navigate("/admin/service-management");

    } else {
      console.log("Unexpected Response:", response); // Debug log
      message.error("Unexpected response from server.");
    }
  } catch (err) {
    console.error("Error creating form:", err); // Debug log
    message.error("Failed to create form. Please try again.");
  }
};

useEffect(() => {
  console.log("Items:", items);
  console.log("Form Title:", servicename);
  console.log("Form Description:", serviceDescription);
}, [items, servicename, serviceDescription]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          padding: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2>Form Builder</h2>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            <button
              onClick={handlePreview}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                backgroundColor: "#f9f9f9",
                color: "#555",
                border: "1px solid #ccc",
                borderRadius: "5px",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              <EyeOutlined style={{ fontSize: "16px" }} /> Preview
            </button>
            <button
              onClick={handleSave}
              className="btn btn-primary"
              style={{
                padding: "10px 20px",
                backgroundColor: "#4fceb4",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "14px",
                marginBottom: "1px", 
              }}
            >
              Save
            </button>
          </div>
        </div>
        <Input
          placeholder="Enter Service Name..."
          value={servicename}
          onChange={(e) => setFormTitle(e.target.value)}
          style={{ marginBottom: "10px" }}
        />
        <Input.TextArea
          placeholder="Enter Service Description"
          value={serviceDescription}
          onChange={(e) => setFormDescription(e.target.value)}
          rows={4}
          style={{ marginBottom: "20px" }}
        />
        <div style={{ display: "flex", gap: "20px" }}>
          {/* Left panel */}
          <div className="fields-container">
            <div className="fields-tabs">
              <button className="fields-tab active">Fields</button>
              <button className="fields-tab">Sample</button>
            </div>
            <div className="fields-section">
              <h4 className="fields-header">Standards Fields</h4>
              <div className="fields-grid">
                {availableFields.slice(0, 7).map((field, index) => (
                  <Field key={index} field={field} />
                ))}
              </div>
              <h4 className="fields-header">Advanced Fields</h4>
              <div className="fields-grid">
                {availableFields.slice(7).map((field, index) => (
                  <Field key={index} field={field} />
                ))}
              </div>
            </div>
          </div>

          {/* Form Preview Section */}
          <div>
            <h3>Form Preview</h3>
            <FormPreview
              items={items}
              setItems={(updatedItems) => {
                setItems(updatedItems);
              }}
            />{" "}
          </div>

          {/* Preview Modal */}
          <Modal
            title="Form Preview"
            visible={showPreview}
            onCancel={handleClosePreview}
            footer={null} // No footer buttons
            width={800} // Adjust width if needed
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              <div>
                <h4>Live Form Preview:</h4>
                {items.length === 0 ? (
                  <p style={{ textAlign: "center", color: "#999" }}>
                    No fields added to the form yet.
                  </p>
                ) : (
                  items.map((item, index) => (
                    <div key={index} style={{ marginBottom: "15px" }}>
                      {renderField(item, index, (index, data) => {
                        setItems((prevItems) =>
                          prevItems.map((field, i) =>
                            i === index ? { ...field, ...data } : field
                          )
                        );
                      })}
                    </div>
                  ))
                )}
              </div>
              <div>
                <h4>Form Details:</h4>
                {items.length === 0 ? (
                  <p style={{ textAlign: "center", color: "#999" }}>
                    No fields added to the form yet.
                  </p>
                ) : (
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      textAlign: "left",
                      marginBottom: "15px",
                    }}
                  >
                    <thead>
                      <tr>
                        <th
                          style={{
                            borderBottom: "2px solid #ddd",
                            padding: "8px",
                          }}
                        >
                          Field Label
                        </th>
                        <th
                          style={{
                            borderBottom: "2px solid #ddd",
                            padding: "8px",
                          }}
                        >
                          Field Type
                        </th>
                        <th
                          style={{
                            borderBottom: "2px solid #ddd",
                            padding: "8px",
                          }}
                        >
                          Position (Top/Left)
                        </th>
                        <th
                          style={{
                            borderBottom: "2px solid #ddd",
                            padding: "8px",
                          }}
                        >
                          Dimensions (Width/Height)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, index) => (
                        <tr key={index}>
                          <td
                            style={{
                              padding: "8px",
                              borderBottom: "1px solid #ddd",
                            }}
                          >
                            {item.label || "Unnamed Field"}
                          </td>
                          <td
                            style={{
                              padding: "8px",
                              borderBottom: "1px solid #ddd",
                            }}
                          >
                            {item.type}
                          </td>
                          <td
                            style={{
                              padding: "8px",
                              borderBottom: "1px solid #ddd",
                            }}
                          >
                            {Math.round(item.top)}% / {Math.round(item.left)}%
                          </td>
                          <td
                            style={{
                              padding: "8px",
                              borderBottom: "1px solid #ddd",
                            }}
                          >
                            {Math.round(item.width)}% /{" "}
                            {Math.round(item.height)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </DndProvider>
  );
};

export default FormBuilder;
