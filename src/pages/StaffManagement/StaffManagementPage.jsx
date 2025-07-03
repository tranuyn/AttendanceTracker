import React, { useState } from "react";
import { Table, Input, Button, Space, Avatar, Typography, message, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined, UserOutlined } from "@ant-design/icons";
import EditEmployeeModal from "./components/EditEmployeeModal";

const { Title } = Typography;

const employeesData = [
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

export default function StaffManagementPage() {
  const [employees, setEmployees] = useState(employeesData);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleEdit = (employee) => {
    setEditing(employee);
    setModalOpen(true);
  };

  const handleSave = (updated) => {
    const updatedList = employees.map((emp) =>
      emp.email === updated.email ? updated : emp
    );
    setEmployees(updatedList);
    message.success("Cập nhật thành công!");
    setModalOpen(false);
  };

  const handleDelete = (email) => {
    const filtered = employees.filter((emp) => emp.email !== email);
    setEmployees(filtered);
    message.success("Đã xóa nhân viên.");
  };

  const filteredData = employees.filter((emp) =>
    emp.name.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      title: "Nhân viên",
      key: "name",
      render: (_, record) => (
        <Space>
          <Avatar src={record.avatarUrl} icon={<UserOutlined />} />
          <div>
            <div className="font-medium">{record.name}</div>
            <div className="text-sm text-gray-500">{record.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: "Chức vụ",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Xác nhận xóa?"
            onConfirm={() => handleDelete(record.email)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger type="link" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <Title level={3} style={{ margin: 0 }}>Quản lý nhân viên</Title>
        <Input.Search
          placeholder="Tìm theo tên nhân viên..."
          allowClear
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 300 }}
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="email"
        pagination={{ pageSize: 5 }}
      />

      <EditEmployeeModal
        open={modalOpen}
        employee={editing}
        onCancel={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}