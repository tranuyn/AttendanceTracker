import {
  Table,
  Card,
  Button,
  Space,
  DatePicker,
  Typography,
  Tag,
  Image,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import React from "react";

const TimesheetTable = ({
  data,
  onAdd,
  onEdit,
  onDelete,
  onReport,
  selectedWeek,
  setselectedWeek,
  role = "staff",
}) => {
  const getStatusColor = (status) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "orange";
      case "APPROVED":
        return "green";
      case "REJECTED":
        return "red";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "Ngày",
      dataIndex: "date",
      align: "center",
      key: "date",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    { title: "Giờ vào", dataIndex: "checkIn", key: "checkIn", align: "center" },
    {
      title: "Ảnh check-in",
      dataIndex: "checkInImageUrl",
      key: "checkInImageUrl",
      align: "center",
      render: (url) =>
        url ? (
          <Image width={80} src={url} alt="Ảnh check-in" />
        ) : (
          <Typography type="secondary">Không có</Typography>
        ),
    },
    {
      title: "Giờ ra",
      dataIndex: "checkOut",
      key: "checkOut",
      align: "center",
    },
    {
      title: "Ảnh check-out",
      dataIndex: "checkOutImageUrl",
      key: "checkOutImageUrl",
      align: "center",
      render: (url) =>
        url ? (
          <Image width={80} src={url} alt="Ảnh check-out" />
        ) : (
          <Typography type="secondary">Không có</Typography>
        ),
    },
    {
      title: "Tổng giờ",
      dataIndex: "totalHours",
      align: "center",
      key: "totalHours",
      render: (hours) => `${hours}h`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      align: "center",
      key: "status",
      render: (status) => {
        const statusKey = status?.toUpperCase();

        const colorMap = {
          ABSENT: "red",
          NO_CHECKOUT: "orange",
          LATE: "gold",
          EARLY_LEAVE: "gold",
          COMPLETED: "green",
        };

        const labelMap = {
          ABSENT: "Vắng mặt",
          NO_CHECKOUT: "Chưa check-out",
          LATE: "Đi trễ",
          EARLY_LEAVE: "Về sớm",
          COMPLETED: "Hoàn thành",
        };

        return (
          <Tag color={colorMap[statusKey] || "default"}>
            {labelMap[statusKey] || "Không xác định"}
          </Tag>
        );
      },
    },
    {
      title: "Hành động",
      key: "actions",
      align: "center",
      render: (_, record) => {
        const isReportable = record.status?.toUpperCase() !== "COMPLETED";
        return (
          <Space>
            {role === "admin" && (
              <>
                <Button
                  icon={<EditOutlined />}
                  onClick={() => onEdit(record)}
                />
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => onDelete(record.key)}
                />
              </>
            )}
            {role === "staff" && isReportable && (
              <>
                <Button
                  type={record.complain ? "default" : "dashed"}
                  danger={!!record.complain}
                  onClick={() => onReport(record)}
                >
                  {record.complain ? "Đã báo lỗi" : "Báo lỗi"}
                </Button>
                {record.complain?.status && (
                  <div style={{ marginTop: 4 }}>
                    <Tag color={getStatusColor(record.complain.status)}>
                      {record.complain.status}
                    </Tag>
                  </div>
                )}
              </>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <Card
      title="Bảng chấm công"
      extra={
        <Space>
          <DatePicker
            picker="week"
            value={selectedWeek}
            onChange={setselectedWeek}
            allowClear={false}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
            Thêm mới
          </Button>
        </Space>
      }
    >
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 10 }}
        className="overflow-auto"
      />
    </Card>
  );
};

export default TimesheetTable;
