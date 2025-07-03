import React, { useEffect, useState } from "react";
import { Table, Input, Button, Space, Avatar, Typography, message, Popconfirm, Spin } from "antd";
import { EditOutlined, DeleteOutlined, UserOutlined } from "@ant-design/icons";
import EditEmployeeModal from "./components/EditEmployeeModal";
import { useUserService } from "../../services/userService";
const { Title } = Typography;

export default function StaffManagementPage() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const { getAllUsers } = useUserService();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllUsers();
        setEmployees(data || []);
      } catch (err) {
        console.error("Error fetching users:", err);
        message.error("Không thể tải danh sách nhân viên");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  
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

      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      )}

      <EditEmployeeModal
        open={modalOpen}
        employee={editing}
        onCancel={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}