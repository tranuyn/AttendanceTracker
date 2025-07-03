import { Table, Card, Button, Space, DatePicker, Tag } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import React from "react";

const TimesheetTable = ({
  data,
  onAdd,
  onEdit,
  onDelete,
  onReport, // mới
  selectedMonth,
  setSelectedMonth,
  role = "staff", // truyền từ ngoài
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

        return (
          <Space>
            <Tag color={colorMap[status]}>{labelMap[status]}</Tag>
          </Space>
        );
      },
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) =>{
        const isReportable = record.status !== "completed";
        return(
          <Space>
            <Button icon={<EditOutlined />} onClick={() => onEdit(record)} />
            {role === "admin" && (
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => onDelete(record.key)}
              />
            )}
            {role === "staff" && isReportable && (
              <Button color="danger" variant="filled" onClick={() => onReport(record)}>
                Báo lỗi
              </Button>
            )}
          </Space>
        )
      } 
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
