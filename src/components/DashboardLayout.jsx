import { Layout, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import FeedbackIcon from '@mui/icons-material/Feedback';
import CameraFrontRoundedIcon from '@mui/icons-material/CameraFrontRounded';
import logo from "../assets/images/logo.png";

const { Sider, Content } = Layout;

const DashboardLayout = ({ children, role }) => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = {
    user: [
      {
        key: "attendance",
        icon: <CameraFrontRoundedIcon />,
        label: 'Check-in/Check-out',
        onClick: () => navigate("/attendance"),
      },
      {
        key: "timesheet",
        icon: <CalendarMonthRoundedIcon />,
        label: "Timesheet",
        onClick: () => navigate("/timesheet"),
      },
      {
        key: "profile",
        icon: <ManageAccountsRoundedIcon />,
        label: "Profile",
        onClick: () => navigate("/profile"),
      },
    ],
    staff: [
      {
        key: "timesheet",
        icon: <CalendarMonthRoundedIcon />,
        label: "Timesheet",
        onClick: () => navigate("/timesheet"),
      },
      {
        key: "profile",
        icon: <ManageAccountsRoundedIcon />,
        label: "Profile",
        onClick: () => navigate("/profile"),
      },
    ],
    admin: [
      {
        key: "attendance",
        icon: <CameraFrontRoundedIcon />,
        label: 'Attendance',
        onClick: () => navigate("/attendance"),
      },
      {
        key: "timesheet",
        icon: <CalendarMonthRoundedIcon />,
        label: "Timesheet",
        onClick: () => navigate("/timesheet"),
      },
      {
        key: "staff",
        icon: <GroupsRoundedIcon />,
        label: "Manage Staff",
        onClick: () => navigate("/manage-staff"),
      },
      {
        key: "report",
        icon: <FeedbackIcon />,
        label: "Reports",
        onClick: () => navigate("/reports"),
      },
      {
        key: "profile",
        icon: <ManageAccountsRoundedIcon />,
        label: "Profile",
        onClick: () => navigate("/profile"),
      },
    ],
  };

  const currentMenu = menuItems[role] || menuItems.user;

  return (
    <Layout style={{ minHeight: "100vh", width: "100vw" }} >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={200}
        style={{
          overflow: "auto",
          height: "100vh",
          backgroundColor: 'white',
          paddingTop: 15,
        }}
      >
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "start",
            gap: collapsed ? 0 : 15,
            padding: collapsed ? 0 : 10,
          }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{
              maxHeight: "40px",
              objectFit: "contain",
              paddingLeft: collapsed ? 0 : 10,
            }}
          />
          {!collapsed && (
            <span style={{ color: "#28608e", fontWeight: "bold", fontSize: 16 }}>
              Attendance Tracker
            </span>
          )}
        </div>
        <Menu mode="inline" theme="light" items={currentMenu} className="font-normal text-md"/>
      </Sider>
      <Layout style={{ width: "100%" }} hasSider>
        <Content
          style={{
            height: "100vh",
            overflowX: "auto",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
