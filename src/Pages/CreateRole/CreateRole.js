import React, { useState, useEffect } from "react";
import axios from "axios";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const CreateRole = () => {
  const [formData, setFormData] = useState({ name: "" });
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [newRoleName, setNewRoleName] = useState("");

  const { name } = formData;

  // Fetch roles from the backend
  const fetchRoles = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/role`,
        { withCredentials: true }
      );
      setRoles(response.data.data);
    } catch (error) {
      alert("Failed to fetch roles. Please try again.");
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Create role
  const createRole = async (e) => {
    e.preventDefault();
    if (!name) {
      alert("Role name is required");
      return;
    }
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/role`,
        { name },
        { withCredentials: true }
      );
      alert(response.data.message);
      setFormData({ name: "" });
      fetchRoles();
    } catch (error) {
      alert("Failed to create role. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Edit role
  const editRole = async (roleId) => {
    if (!newRoleName) {
      alert("Role name cannot be empty.");
      return;
    }
    try {
      await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/api/role/${roleId}`,
        { name: newRoleName },
        { withCredentials: true }
      );
      alert("Role updated successfully.");
      setEditingRoleId(null);
      fetchRoles();
    } catch (error) {
      alert("Failed to update role. Please try again.");
    }
  };

  // Delete role
  const deleteRole = async (roleId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/role/${roleId}`,
        { withCredentials: true }
      );
      alert("Role deleted successfully.");
      fetchRoles();
    } catch (error) {
      alert("Failed to delete role. Please try again.");
    }
  };

  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Create Role Form */}
      <div
        style={{
          width: "300px",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
        }}
      >
        <h2 style={{ color: "#007bff", marginBottom: "15px" }}>Create Role</h2>
        <form onSubmit={createRole}>
          <input
            type="text"
            placeholder="Role Name"
            required
            name="name"
            value={name}
            onChange={handleInputChange}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {isLoading ? "Creating..." : "Create Role"}
          </button>
        </form>
      </div>

      {/* Existing Roles Table */}
      <div
        style={{
          width: "80%",
          marginTop: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          padding: "20px",
          backgroundColor: "#fff",
        }}
      >
        <h2 style={{ color: "#333", marginBottom: "15px" }}>Existing Roles</h2>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  padding: "10px",
                  backgroundColor: "#007bff",
                  color: "white",
                }}
              >
                Role Name
              </th>
              <th
                style={{
                  padding: "10px",
                  backgroundColor: "#007bff",
                  color: "white",
                  textAlign: "center",
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role._id}>
                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                  {editingRoleId === role._id ? (
                    <input
                      type="text"
                      value={newRoleName}
                      onChange={(e) => setNewRoleName(e.target.value)}
                      placeholder="Enter new role name"
                      style={{
                        width: "100%",
                        padding: "5px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                      }}
                    />
                  ) : (
                    role.name
                  )}
                </td>
                <td
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #ddd",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "10px",
                    }}
                  >
                    {editingRoleId === role._id ? (
                      <>
                        <button
                          style={{
                            padding: "5px 10px",
                            backgroundColor: "#28a745",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                          }}
                          onClick={() => editRole(role._id)}
                        >
                          Save
                        </button>
                        <button
                          style={{
                            padding: "5px 10px",
                            backgroundColor: "#dc3545",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                          }}
                          onClick={() => setEditingRoleId(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          style={{
                            padding: "5px 10px",
                            backgroundColor: "#ffc107",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setEditingRoleId(role._id);
                            setNewRoleName(role.name);
                          }}
                        >
                          <EditOutlined /> Edit
                        </button>
                        <button
                          style={{
                            padding: "5px 10px",
                            backgroundColor: "#dc3545",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                          }}
                          onClick={() => deleteRole(role._id)}
                        >
                          <DeleteOutlined /> Delete
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default CreateRole;
