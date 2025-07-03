import { Table, Card, Button, Space } from "antd";
import React from "react";

const StaffTable = ({ data }) => {
  const columns = [
    { title: "Tên nhân viên", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phòng ban", dataIndex: "department", key: "department" },
    {
      title: "Tổng giờ tháng",
      dataIndex: "totalHours",
      key: "totalHours",
      render: (hours) => `${hours}h`,
    },
    {
      title: "Hành động",
      key: "actions",
      render: () => (
        <Space>
          <Button type="link">Chi tiết</Button>
          <Button type="link">Chỉnh sửa</Button>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Quản lý nhân sự"
      extra={<Button icon={<PlusOutlined />} type="primary">Thêm nhân viên</Button>}
    >
      <Table columns={columns} dataSource={data} pagination={{ pageSize: 10 }} />
    </Card>
  );
};

export default StaffTable;
