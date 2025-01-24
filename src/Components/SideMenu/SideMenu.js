import React from "react";
import { Menu } from "antd";
import {
  AppstoreOutlined,
  TeamOutlined,
  SettingOutlined,
  ReloadOutlined,
  FileTextOutlined,
  BarChartOutlined,
  SafetyOutlined,
  UserOutlined,
  SecurityScanOutlined,
} from "@ant-design/icons";
import "./SideMenu.css";
import logo from "../../img/logo.png";
import { useNavigate } from "react-router-dom";

const { SubMenu } = Menu;

function SideMenu() {
  const navigate = useNavigate();

  return (
    <div className="SideMenu">
      <div className="logo">
        <img src={logo} alt="Logo" className="logo-image" />
      </div>
      <Menu
        className="SideMenuVertical"
        mode="inline"
        onClick={(item) => {
          navigate(item.key);
        }}
        style={{
          backgroundColor: "transparent",
          color: "#64CCC5",
        }}
      >
        <Menu.Item key="/admin/dashboard" icon={<AppstoreOutlined />}>
          Dashboard
        </Menu.Item>
        <Menu.Item key="/admin/client-management" icon={<TeamOutlined />}>
          Client Management
        </Menu.Item>
        <Menu.Item key="/admin/service-management" icon={<SettingOutlined />}>
          Service Management
        </Menu.Item>

        <SubMenu
          key="/admin/compliance-management"
          icon={<SettingOutlined />}
          title="Request Services"
        >
          <Menu.Item key="/admin/all-requests">
            Clients Request Services
          </Menu.Item>
          <Menu.Item key="/admin/getUnregisteredClientServices">
            Get Unregistered Client Services
          </Menu.Item>
        </SubMenu>

        <Menu.Item key="/admin/renewal-management" icon={<ReloadOutlined />}>
          Renewal Management
        </Menu.Item>
        <Menu.Item key="/admin/document-management" icon={<FileTextOutlined />}>
          Document Management
        </Menu.Item>
        <Menu.Item key="/admin/analytics-reporting" icon={<BarChartOutlined />}>
          Analytics & Reporting
        </Menu.Item>
        <SubMenu
          key="/admin/compliance-management"
          icon={<SafetyOutlined />}
          title="Compliance Management"
        >
          <Menu.Item key="/admin/compliance-management/kyc-management">
            KYC Management
          </Menu.Item>
          <Menu.Item key="/admin/compliance-management/brn-tracking">
            BRN Tracking
          </Menu.Item>
          <Menu.Item key="/admin/compliance-management/compliance-documentation">
            Compliance Documentation
          </Menu.Item>
          <Menu.Item key="/admin/compliance-management/regulatory-monitoring">
            Regulatory Monitoring
          </Menu.Item>
        </SubMenu>

        <SubMenu
          key="/admin/user-management"
          icon={<UserOutlined />}
          title="User Management"
        >
          <Menu.Item key="/admin/user-management/all-users">
            User Role & Permissions
          </Menu.Item>
          <Menu.Item key="/admin/user-management/activity-log">
            User Activity log
          </Menu.Item>
        </SubMenu>

        <Menu.Item
          key="/admin/settings-configurations"
          icon={<SettingOutlined />}
        >
          Setting & Configurations
        </Menu.Item>
        <Menu.Item
          key="/admin/security-privacy"
          icon={<SecurityScanOutlined />}
        >
          Security & Privacy
        </Menu.Item>
        <Menu.Item key="/admin/SheduleList" icon={<SecurityScanOutlined />}>
          Shedule List
        </Menu.Item>
      </Menu>
    </div>
  );
}

export default SideMenu;
