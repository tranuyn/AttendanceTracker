import React from "react";
import { Card, Typography } from "antd";

const { Title, Text } = Typography;

const EmployeeCard = ({ name, role, email, avatarUrl }) => {
  return (
    <Card
      hoverable
      bordered={false}
      style={{
        width: "100%",
        borderRadius: 20,
        overflow: "hidden",
        textAlign: "center",
        backgroundColor: "#fff",
        boxShadow: "none",
      }}
      bodyStyle={{ padding: 0 }}
    >
      <div style={{ position: "relative" }}>
        <div style={{ height: 220, overflow: "hidden" }}>
          <img
            src={avatarUrl}
            alt="avatar"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>

        <div
          style={{
            position: "relative",
            top: -15,
            background: "#f0f4fa",
            borderRadius: 20,
            padding: "24px 16px",
            zIndex: 2,
          }}
        >
          <Title level={4} style={{ marginBottom: 8, marginTop: 0 }}>
            {name}
          </Title>
          <div style={{ marginBottom: 12 }}>
            <Text type="secondary" strong>
              Role
            </Text>
            <br />
            <Text>{role}</Text>
          </div>
          <div>
            <Text type="secondary" strong>
              Email
            </Text>
            <br />
            <Text>{email}</Text>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EmployeeCard;
