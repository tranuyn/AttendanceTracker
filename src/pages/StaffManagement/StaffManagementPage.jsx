import React from "react";
import { Row, Col } from "antd";
import EmployeeCard from "../../components/UserCard";
const employees = [
  {
    name: "Mauro Sicard",
    role: "CEO & Founder",
    email: "mauro@brix.com",
    avatarUrl: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    name: "Sophie Le",
    role: "Product Designer",
    email: "sophie@brix.com",
    avatarUrl: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    name: "David Tran",
    role: "Frontend Developer",
    email: "david@brix.com",
    avatarUrl: "https://randomuser.me/api/portraits/men/45.jpg",
  },
  {
    name: "Linh Nguyen",
    role: "HR Manager",
    email: "linh@brix.com",
    avatarUrl: "https://randomuser.me/api/portraits/women/70.jpg",
  },
  {
    name: "Alex Chu",
    role: "Backend Engineer",
    email: "alex@brix.com",
    avatarUrl: "https://randomuser.me/api/portraits/men/29.jpg",
  },
  {
    name: "Trang Vo",
    role: "Marketing Lead",
    email: "trang@brix.com",
    avatarUrl: "https://randomuser.me/api/portraits/women/20.jpg",
  },
];

const logoUrl =
  "https://upload.wikimedia.org/wikipedia/commons/8/8e/Brix_logo.svg";

function StaffManagementPage() {
  return (
    <div
      style={{
        padding: "24px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Row gutter={[24, 24]} justify="start">
        {employees.map((emp, index) => (
          <Col
            key={index}
            xs={24} // mobile
            sm={12} // tablet
            md={8} // medium screen
            lg={6} // large screen
          >
            <EmployeeCard {...emp} logoUrl={logoUrl} />
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default StaffManagementPage;
