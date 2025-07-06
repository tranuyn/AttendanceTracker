import { Table, Card, Button, Space, DatePicker, Typography, Tag, Image } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import React from "react";

const TimesheetTable = ({
  data,
  onAdd,
  onEdit,
  onDelete,
  onReport, // mới
  selectedWeek,
  setselectedWeek,
  role = "admin", // truyền từ ngoài
}) => {
  const columns = [
    {
      title: "Ngày",
      dataIndex: "date",
      align: "center", 
      key: "date",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    { title: "Giờ vào", dataIndex: "checkIn", key: "checkIn", align: "center", },
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
    { title: "Giờ ra", dataIndex: "checkOut", key: "checkOut", align: "center",  },
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
      align: "center", 
      render: (_, record) =>{
        const isReportable = record.status !== "completed";
        return(
          <Space>
            {role === "admin" && (
              <>
                <Button icon={<EditOutlined />} onClick={() => onEdit(record)} />
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => onDelete(record.key)}
                  />
              </>
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
      <Table columns={columns} dataSource={data} pagination={{ pageSize: 10 }} className="overflow-auto" />
    </Card>
  );
};

export default TimesheetTable;
