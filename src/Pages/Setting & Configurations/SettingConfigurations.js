import React from "react";
import {
  UploadOutlined,
  FilterOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import "./SettingConfigurations.css";

const SettingConfigurations = () => {
  const settings = [
    {
      setting: "Email Sender Address",
      description: "Address used for all outgoing emails",
      currentValue: "no-reply@gmail.com",
      action: "Edit",
    },
    {
      setting: "Automated Reminder Schedule",
      description: "Default interval for renewal reminders",
      currentValue: "14 days before due date",
      action: "Edit",
    },
    {
      setting: "Default Notification Email",
      description: "Admin email for critical system alerts",
      currentValue: "admin@gmail.com",
      action: "Edit",
    },
  ];

  return (
    <div className="setting-configurations">
      {/* Header */}
      <div className="client-management-header">
        <h1>Setting & Configurations</h1>
        <p>Business Management System / Setting & Configurations</p>
        <div className="action-buttons">
          <button className="btn btn-light">
            <UploadOutlined /> Import
          </button>
          <button className="btn btn-light">
            <FilterOutlined /> Filter
          </button>
          <button className="btn btn-primary">
            <DownloadOutlined /> Download
          </button>
        </div>
      </div>

      <div className="settings-container">
        {/* Sidebar */}
        <div className="settings-sidebar">
          <ul>
            <li className="active">System Configuration</li>
            <li>Email Templates & Automated Messages</li>
            <li>User Preferences</li>
            <li>Data Backup & Security</li>
          </ul>
        </div>

        {/* Settings Table */}
        <div className="settings-table">
          <table>
            <thead>
              <tr>
                <th>SETTING</th>
                <th>DESCRIPTION</th>
                <th>CURRENT VALUE</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {settings.map((item, index) => (
                <tr key={index}>
                  <td>{item.setting}</td>
                  <td>{item.description}</td>
                  <td>{item.currentValue}</td>
                  <td>
                    <button className="edit-btn">{item.action}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SettingConfigurations;
