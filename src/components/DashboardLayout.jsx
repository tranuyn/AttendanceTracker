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
    <Layout style={{ minHeight: "100vh", width: "100vw" }}>
      <Sider
        collapsible
        width={200}
        style={{
          overflow: "auto",
          height: "100vh",
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
      <Layout style={{ width: "100%" }} hasSider>
        <Content
          style={{
            // marginLeft: 200,
            padding: 10,
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
