// StaffManagementPage.jsx
import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Avatar,
  Typography,
  Popconfirm,
  Spin,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import EditEmployeeModal from "./components/EditEmployeeModal";
import { useUserService } from "../../services/userService";
import useApp from "antd/es/app/useApp";
import SearchBar from "components/SearchBar";

const { Title } = Typography;

export default function StaffManagementPage() {
  const { message } = useApp();
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  const { updateUser, deleteUser, createUser, getUsers } = useUserService();

  useEffect(() => {
    fetchUsers(pagination.current, pagination.pageSize, search);
  }, []);

  const fetchUsers = async (page = 1, pageSize = 5, searchkey = "") => {
    setLoading(true);
    try {
      const res = await getUsers({
        page: page - 1, // Spring bắt đầu từ 0
        size: pageSize,
        sort: "name,asc",
        searchkey,
      });
      console.log("getUsers response", res);


      setEmployees(res.content || []);
      setPagination({
        current: res.number + 1,
        pageSize: res.size,
        total: res.totalElements,
      });
    } catch (err) {
      console.error("Error fetching users:", err);
      message.error("Không thể tải danh sách nhân viên");
    } finally {
      setLoading(false);
    }
  };
  const handleSearchChange = (value) => {
    setSearch(value);
    console.log(value)
    fetchUsers(1, pagination.pageSize, value);
  };

  const handleEdit = (employee) => {
    setEditing(employee);
    setModalOpen(true);
  };

  const handleSave = async (values) => {
    try {
      if (editing) {
        const response = await updateUser(editing.id, values);
        const updatedList = employees.map((emp) =>
          emp.id === editing.id ? response : emp
        );
        setEmployees(updatedList);
        message.success("Cập nhật thành công!");
      } else {
        const newUser = await createUser(values);
        setEmployees((prev) => [...prev, newUser]);
        message.success("Tạo nhân viên thành công!");
      }
    } catch (err) {
      console.error("Save user error:", err);
      message.error("Thao tác thất bại!");
    } finally {
      setModalOpen(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
      message.success("Xóa nhân viên thành công!");
    } catch (err) {
      console.error("Delete user error:", err);
      message.error("Xóa nhân viên thất bại!");
    }
  };

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
      title: "Vai trò",
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
            onConfirm={() => handleDelete(record.id)}
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
      <div className="flex max-md:flex-col items-center justify-between mb-4">
        <Title level={3} className="max-md:self-start max-md:mb-5 m-0 ">
          Quản lý nhân viên
        </Title>
        <div className="flex gap-2 max-sm:flex-col ">
          <SearchBar
            onSearch={handleSearchChange}
          />
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
          >
            Thêm nhân viên
          </Button>
        </div>
      </div>

      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          columns={columns}
          dataSource={employees}
          rowKey="id"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
          }}
          onChange={(pagination) => {
            fetchUsers(pagination.current, pagination.pageSize, search);
          }}
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
