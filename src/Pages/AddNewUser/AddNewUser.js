import React, { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import "./AddNewUser.css";

const AddNewUser = () => {
  const [formData, setFormData] = useState({
    email: "",
    role: "",
    taskDescription: "",
    startDate: "",
    dueDate: "",
    priority: "",
  });
  const [roles, setRoles] = useState([]); // Store roles
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  // Fetch roles from the backend
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/roles-task/roles`,
          { withCredentials: true }
        );
        setRoles(response.data.data); // Store roles in state
      } catch (error) {
        message.error(
          error.response?.data?.message ||
            "Failed to fetch roles. Please try again."
        );
      }
    };

    fetchRoles();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    const { email, role, taskDescription, startDate, dueDate, priority } =
      formData;
    if (
      !email ||
      !role ||
      !taskDescription ||
      !startDate ||
      !dueDate ||
      !priority
    ) {
      message.error("All fields are required");
      return;
    }

    // Ensure start date is before due date
    if (new Date(startDate) > new Date(dueDate)) {
      message.error("Start date must be before the due date");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/roles-task/create-role-task`,
        formData,
        { withCredentials: true }
      );
      message.success(response.data.message); // Success message
      // Reset form
      setFormData({
        email: "",
        role: "",
        taskDescription: "",
        startDate: "",
        dueDate: "",
        priority: "",
      });
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to assign the task. Try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-new-user">
      <div className="client-management-header">
        <h1>Assign Task</h1>
        <p>Business Management System / User Management</p>
      </div>
      <div className="assignment-form">
        <h2>Assignment Form</h2>
        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email">
              User Email<span>*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              placeholder="Enter user email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Role Dropdown */}
          <div className="form-group">
            <label htmlFor="role">
              Assign Role<span>*</span>
            </label>
            <select
              id="role"
              name="role"
              className="form-control"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role._id} value={role.name}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          {/* Task Description */}
          <div className="form-group">
            <label htmlFor="taskDescription">
              Task Description<span>*</span>
            </label>
            <textarea
              id="taskDescription"
              name="taskDescription"
              className="form-control"
              placeholder="Enter task description"
              rows="3"
              value={formData.taskDescription}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          {/* Start Date and Due Date */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">
                Start Date<span>*</span>
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                className="form-control"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="dueDate">
                Due Date<span>*</span>
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                className="form-control"
                value={formData.dueDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Priority Dropdown */}
          <div className="form-group">
            <label htmlFor="priority">
              Priority Level<span>*</span>
            </label>
            <select
              id="priority"
              name="priority"
              className="form-control"
              value={formData.priority}
              onChange={handleChange}
              required
            >
              <option value="">Select priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Assigning..." : "Assign Task"}
            </button>
            <button
              type="button"
              className="btn btn-light"
              onClick={() =>
                setFormData({
                  email: "",
                  role: "",
                  taskDescription: "",
                  startDate: "",
                  dueDate: "",
                  priority: "",
                })
              }
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewUser;
