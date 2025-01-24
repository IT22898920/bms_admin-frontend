import React, { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd"; // For success/error notifications
import { useLocation, useNavigate } from "react-router-dom"; // To get data from previous page and navigate
import "../AddNewUser/AddNewUser.css"; // Ensure your CSS file is available

const EditUser = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get task details from navigation state
  const taskData = location.state?.role;

  const [formData, setFormData] = useState({
    email: taskData?.email || "",
    taskDescription: taskData?.taskDescription || "",
    startDate: taskData?.startDate ? taskData.startDate.split("T")[0] : "",
    dueDate: taskData?.dueDate ? taskData.dueDate.split("T")[0] : "",
    priority: taskData?.priority || "",
    role: taskData?.role || "", // Include role in initial form data
  });

  const [roles, setRoles] = useState([]); // State to hold roles
  const [isLoading, setIsLoading] = useState(false); // Loading state for form submission

  // Fetch roles from backend
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/roles-task/roles`,
          { withCredentials: true }
        );
        setRoles(response.data.data); // Populate roles state
      } catch (error) {
        message.error(
          error.response?.data?.message ||
            "Failed to fetch roles. Please try again."
        );
      }
    };

    fetchRoles();
  }, []);

  // Redirect if no task data is passed
  useEffect(() => {
    if (!taskData) {
      message.error("No task data found!");
      navigate("/admin/user-management"); // Redirect back if no task data
    }
  }, [taskData, navigate]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: Ensure start date is before due date
    if (new Date(formData.startDate) > new Date(formData.dueDate)) {
      message.error("Start date must be before the due date");
      return;
    }

    try {
      setIsLoading(true); // Start loading
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/roles-task/update-role-task/${taskData._id}`,
        formData,
        { withCredentials: true }
      );

      message.success(response.data.message || "Task updated successfully!"); // Success notification
      navigate("/admin/user-management/all-users"); // Redirect back to user management
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to update the task. Try again."
      );
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="edit-user">
      <div className="client-management-header">
        <h1>Edit Task</h1>
        <p>Business Management System / User Management</p>
      </div>

      <div className="assignment-form">
        <h2>Edit Assignment</h2>
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
              Role<span>*</span>
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
              {isLoading ? "Updating..." : "Update Task"}
            </button>
            <button
              type="button"
              className="btn btn-light"
              onClick={() => navigate("/admin/user-management")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
