import { Table, Card, Button, Space, DatePicker } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import Tag from "antd/es/tag";
import React from "react";

const TimesheetTable = ({
  data,
  onAdd,
  onEdit,
  onDelete,
  selectedMonth,
  setSelectedMonth,
}) => {
  const columns = [
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    { title: "Giờ vào", dataIndex: "checkIn", key: "checkIn" },
    { title: "Giờ ra", dataIndex: "checkOut", key: "checkOut" },
    {
      title: "Tổng giờ",
      dataIndex: "totalHours",
      key: "totalHours",
      render: (hours) => `${hours}h`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const colorMap = { completed: "green", late: "orange", absent: "red" };
        const labelMap = { completed: "Hoàn thành", late: "Trễ", absent: "Vắng" };
        return <Tag color={colorMap[status]}>{labelMap[status]}</Tag>;
      },
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => onEdit(record)} />
          <Button danger icon={<DeleteOutlined />} onClick={() => onDelete(record.key)} />
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Bảng chấm công"
      extra={
        <Space>
          <DatePicker
            picker="month"
            value={selectedMonth}
            onChange={setSelectedMonth}
            allowClear={false}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
            Thêm mới
          </Button>
        </Space>
      }
    >
      <Table columns={columns} dataSource={data} pagination={{ pageSize: 10 }} />
    </Card>
  );
};

export default TimesheetTable;
