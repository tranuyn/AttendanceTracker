import { Layout, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import {
  UserOutlined,
  ClockCircleOutlined,
  FileOutlined,
} from "@ant-design/icons";

const { Header, Sider, Content } = Layout;

const DashboardLayout = ({ children, role }) => {
  const navigate = useNavigate();

  const menuItems = {
    user: [
      {
        key: "timesheet",
        icon: <ClockCircleOutlined />,
        label: "Timesheet",
        onClick: () => navigate("/timesheet"),
      },
      {
        key: "profile",
        icon: <ClockCircleOutlined />,
        label: "Profile",
        onClick: () => navigate("/profile"),
      },
    ],
    staff: [
      {
        key: "timesheet",
        icon: <ClockCircleOutlined />,
        label: "Timesheet",
        onClick: () => navigate("/timesheet"),
      },
      {
        key: "profile",
        icon: <ClockCircleOutlined />,
        label: "Profile",
        onClick: () => navigate("/profile"),
      },
    ],
    admin: [
      {
        key: "staff",
        icon: <UserOutlined />,
        label: "Manage Staff",
        onClick: () => navigate("/manage-staff"),
      },
      {
        key: "report",
        icon: <FileOutlined />,
        label: "Reports",
        onClick: () => navigate("/reports"),
      },
      {
        key: "profile",
        icon: <ClockCircleOutlined />,
        label: "Profile",
        onClick: () => navigate("/profile"),
      },
    ],
  };

  const currentMenu = menuItems[role] || menuItems.user;

  return (
    <Layout style={{ minHeight: "100vh", minWidth: "100vw" }}>
      <Sider
        collapsible
        width={200}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div
          style={{
            height: 64,
            background: "#001529",
            color: "white",
            fontSize: 18,
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Logo/Brand
        </div>
        <Menu mode="inline" theme="dark" items={currentMenu} />
      </Sider>
      <Content
        style={{
          display: "flex",
          flex: 1,
          width: "100%",
          marginLeft: 200,
          padding: 5,
        }}
      >
        {children}
      </Content>
    </Layout>
  );
};

export default DashboardLayout;
