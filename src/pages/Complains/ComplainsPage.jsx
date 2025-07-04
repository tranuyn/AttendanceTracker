import React, { useState } from "react";
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
} from "antd";
import dayjs from "dayjs";

const { Text } = Typography;

const mockComplains = [
  {
    id: "1",
    date: "2025-07-01",
    staffName: "Nguyễn Văn A",
    status: "pending",
    text: "Công ty rớt mạng",
    imageUrl: "https://cdn.tgdd.vn/Files/2020/07/25/1273516/loi-mat-mang-no-internet-access-tren-windows-10--24.jpg",
  },
  {
    id: "2",
    date: "2025-07-02",
    staffName: "Trần Thị B",
    status: "approved",
    text: "Không check-out được do mất mạng.",
    imageUrl: null,
  },
  {
    id: "3",
    date: "2025-07-03",
    staffName: "Lê Văn C",
    status: "rejected",
    text: "Tôi quên check-in nhưng thực sự có đi làm.",
    imageUrl: null,
  },
  {
    id: "4",
    date: "2025-06-03",
    staffName: "Lê Văn C",
    status: "rejected",
    text: "Sếp ơi em lỡ",
    imageUrl: null,
  },
];

const statusColors = {
  pending: "orange",
  approved: "green",
  rejected: "red",
};

export default function ComplainsPage() {
  const [complains, setComplains] = useState(mockComplains);
  const [selectedMonth, setSelectedMonth] = useState(dayjs());

  const handleAction = (id, newStatus) => {
    const updated = complains.map((c) =>
      c.id === id ? { ...c, status: newStatus } : c
    );
    setComplains(updated);
    message.success(
      newStatus === "approved"
        ? "Đã duyệt yêu cầu"
        : "Đã từ chối yêu cầu"
    );
  };

  const filteredComplains = complains.filter((c) =>
    dayjs(c.date).isSame(selectedMonth, "month")
  );

  const columns = [
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      align: "center", 
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Nhân viên",
      dataIndex: "staffName",
      key: "staffName",
    },
    {
      title: "Nội dung",
      dataIndex: "text",
      key: "text",
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: "Ảnh minh chứng",
      dataIndex: "imageUrl",
      key: "imageUrl",
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
        record.status === "pending" ? (
          <Space>
            <Button color="primary" variant="outlined"
              onClick={() => handleAction(record.id, "approved")}
            >
              Duyệt
            </Button>
            <Button
              danger
              onClick={() => handleAction(record.id, "rejected")}
            >
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
        dataSource={filteredComplains}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
    </Card>
  );
}
