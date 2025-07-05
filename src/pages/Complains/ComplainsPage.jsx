import React, { useEffect, useState } from "react";
import {
  Table,
  Card,
  Tag,
  Button,
  Typography,
  Space,
  Image,
  DatePicker,
  message,
  Avatar,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useComplainService } from "../../services/complainService";

const { Text } = Typography;

const statusColors = {
  PENDING: "orange",
  APPROVED: "green",
  REJECTED: "red",
};

export default function ComplainsPage() {
  const [complains, setComplains] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const { getWithMonth, changeStatus } = useComplainService();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  const fetchReport = async (page = 1, pageSize = 5) => {
    try {
      const year = selectedMonth.year();
      const month = selectedMonth.month() + 1;
      const response = await getWithMonth({
        year,
        month,
        page: page - 1,
        size: pageSize,
      });
      setComplains(response.content || []);
      setPagination({
        current: response.number + 1,
        pageSize: response.size,
        total: response.totalElements,
      });
    } catch (error) {
      console.error("Lỗi khi lấy báo cáo:", error);
      message.error("Không thể tải dữ liệu chấm công");
    }
  };

  useEffect(() => {
    fetchReport(pagination.current, pagination.pageSize);
  }, [selectedMonth]);

  const handleAction = async (id, newStatus) => {
    try {
      const res = await changeStatus(id, { status: newStatus });

      setComplains((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
      );

      message.success(
        newStatus === "APPROVED" ? "Đã duyệt yêu cầu" : "Đã từ chối yêu cầu"
      );
    } catch (error) {
      console.error("Lỗi cập nhật khiếu nại:", error);
      message.error("Không thể cập nhật trạng thái khiếu nại");
    }
  };

  const columns = [
    {
      title: "Ngày",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (createdAt) => dayjs(createdAt).format("DD/MM/YYYY"),
    },
    {
      title: "Nhân viên",
      key: "userName",
      render: (_, record) => (
        <Space>
          <Avatar
            src={record.attendance?.user?.avatarUrl}
            icon={<UserOutlined />}
          />
          <div>
            <div className="font-medium">{record.attendance?.user?.name}</div>
            <div className="text-sm text-gray-500">
              {record.attendance?.user?.email}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
      render: (content) => <Text>{content}</Text>,
    },
    {
      title: "Ảnh minh chứng",
      dataIndex: "complainImage",
      key: "complainImage",
      align: "center",
      render: (url) =>
        url ? (
          <Image width={80} src={url} alt="Ảnh minh chứng" />
        ) : (
          <Text type="secondary">Không có</Text>
        ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => <Tag color={statusColors[status]}>{status}</Tag>,
    },
    {
      title: "Hành động",
      key: "actions",
      align: "center",
      render: (_, record) =>
        record.status === "PENDING" ? (
          <Space>
            <Button
              color="primary"
              variant="outlined"
              onClick={() => handleAction(record.id, "APPROVED")}
            >
              Duyệt
            </Button>
            <Button danger onClick={() => handleAction(record.id, "REJECTED")}>
              Từ chối
            </Button>
          </Space>
        ) : (
          <Text type="secondary">Đã xử lý</Text>
        ),
    },
  ];

  return (
    <Card
      title="Danh sách khiếu nại"
      extra={
        <DatePicker
          picker="month"
          value={selectedMonth}
          onChange={setSelectedMonth}
          allowClear={false}
        />
      }
    >
      <Table
        columns={columns}
        dataSource={complains}
        rowKey="id"
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
        }}
        onChange={(pagination) => {
          fetchReport(pagination.current, pagination.pageSize);
        }}
      />
    </Card>
  );
}
