import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Button,
  DatePicker,
  Select,
  message,
  Space,
  Table,
  Tag,
  Typography,
  Image,
  Avatar,
} from "antd";
import { useUserService } from "services/userService";
import { useAttendanceService } from "services/attendanceService";
import { PrinterOutlined, FileExcelOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { exportToExcel } from "common/utilities/exportToExcel";
import { printReport } from "common/utilities/printReport";
import { UserOutlined } from "@ant-design/icons";

const { Option } = Select;

const ReportSection = () => {
  const [date, setDate] = useState(null);
  const [mode, setMode] = useState("month");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState({
    total: 0,
    present: 0,
    late: 0,
    absent: 0,
    noCheckout: 0,
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const { getAllUsers } = useUserService();
  const { getReportMonthly, getReportYearly, getAllAttendance } =
    useAttendanceService();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        console.log(response);
        setUsers(response || []);
      } catch {
        message.error("Không thể tải danh sách nhân viên");
      }
    };
    fetchUsers();
  }, []);

  // Reset pagination khi thay đổi filters
  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      current: 1,
    }));
  }, [date, selectedUser, mode]);

  const calculateStatistics = (records) => {
    const stats = {
      total: records.length,
      present: 0,
      late: 0,
      absent: 0,
      noCheckout: 0,
    };

    records.forEach((record) => {
      const status = record.status?.toUpperCase();
      switch (status) {
        case "COMPLETED":
          stats.present++;
          break;
        case "LATE":
          stats.late++;
          break;
        case "ABSENT":
          stats.absent++;
          break;
        case "NO_CHECKOUT":
          stats.noCheckout++;
          break;
        default:
          // Xử lý các trường hợp status null hoặc không xác định
          if (record.checkIn && !record.checkOut) {
            stats.noCheckout++;
          } else if (record.checkIn && record.checkOut) {
            stats.present++;
          }
          break;
      }
    });

    return stats;
  };

  const handleGenerateReport = async (page = 1, pageSize = 10) => {
    if (!date || !selectedUser) {
      return message.warning("Vui lòng chọn tháng/năm và nhân viên");
    }

    setLoading(true);
    const year = date.year();
    const month = date.month() + 1;

    try {
      let response, records;

      if (selectedUser === "all") {
        // Gọi API /attendance/all với pagination
        const apiPage = Math.max(0, page - 1); // Convert to 0-based

        console.log("API Call params:", {
          year,
          month: mode === "month" ? month : undefined,
          page: apiPage,
          size: pageSize,
        });

        response = await getAllAttendance({
          year,
          month: mode === "month" ? month : undefined,
          page: apiPage,
          size: pageSize,
        });

        records = response.content || [];

        // Cập nhật pagination với dữ liệu từ API
        setPagination({
          current: page,
          pageSize: pageSize,
          total: response.totalElements || 0,
        });
      } else {
        // Gọi API theo từng user (không có pagination)
        if (mode === "month") {
          response = await getReportMonthly({
            year,
            month,
            userId: selectedUser,
          });
        } else {
          response = await getReportYearly(year, selectedUser);
        }

        records = Array.isArray(response) ? response : [];

        // Reset pagination cho single user
        setPagination({
          current: 1,
          pageSize: 10,
          total: records.length,
        });
      }

      console.log("Records received:", records);
      setData(records);

      // Tính toán thống kê
      const stats = calculateStatistics(records);
      setStatistics(stats);
    } catch (err) {
      console.error("Error generating report:", err);
      message.error("Không thể tạo báo cáo. Vui lòng thử lại.");
      setData([]);
      setStatistics({
        total: 0,
        present: 0,
        late: 0,
        absent: 0,
        noCheckout: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (paginationInfo) => {
    console.log("Table pagination changed:", paginationInfo);
    if (selectedUser === "all") {
      handleGenerateReport(paginationInfo.current, paginationInfo.pageSize);
    }
  };

  const columns = [
    {
      title: "Nhân viên",
      key: "user",
      render: (_, record) => (
        <Space>
          <Avatar src={record.user?.avatarUrl} icon={<UserOutlined />} />
          <div>
            <div className="font-medium">{record.user?.name}</div>
            <div className="text-sm text-gray-500">{record.user?.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: "Ngày",
      dataIndex: "checkIn",
      key: "date",
      render: (value) => (value ? dayjs(value).format("DD/MM/YYYY") : "--"),
    },
    {
      title: "Giờ vào",
      dataIndex: "checkIn",
      key: "checkIn",
      render: (value) => (value ? dayjs(value).format("HH:mm") : "--:--"),
    },
    {
      title: "Ảnh check-in",
      dataIndex: "checkInImageUrl",
      key: "checkInImageUrl",
      render: (url) =>
        url ? (
          <Image width={60} src={url} alt="Check-in" />
        ) : (
          <Typography.Text type="secondary">Không có</Typography.Text>
        ),
    },
    {
      title: "Giờ ra",
      dataIndex: "checkOut",
      key: "checkOut",
      render: (value) => (value ? dayjs(value).format("HH:mm") : "--:--"),
    },
    {
      title: "Ảnh check-out",
      dataIndex: "checkOutImageUrl",
      key: "checkOutImageUrl",
      render: (url) =>
        url ? (
          <Image width={60} src={url} alt="Check-out" />
        ) : (
          <Typography.Text type="secondary">Không có</Typography.Text>
        ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status, record) => {
        const upper = status?.toUpperCase();
        const colorMap = {
          COMPLETED: "green",
          LATE: "orange",
          ABSENT: "red",
          NO_CHECKOUT: "volcano",
        };
        const labelMap = {
          COMPLETED: "Hoàn thành",
          LATE: "Đi trễ",
          ABSENT: "Vắng mặt",
          NO_CHECKOUT: "Chưa check-out",
        };

        // Xử lý trường hợp status null
        if (!status) {
          if (record.checkIn && !record.checkOut) {
            return <Tag color="volcano">Chưa check-out</Tag>;
          } else if (record.checkIn && record.checkOut) {
            return <Tag color="green">Hoàn thành</Tag>;
          } else {
            return <Tag color="default">Không xác định</Tag>;
          }
        }

        return (
          <Tag color={colorMap[upper] || "default"}>
            {labelMap[upper] || "Không xác định"}
          </Tag>
        );
      },
    },
  ];

  return (
    <>
      <Card title="Bộ lọc báo cáo">
        <div className="flex flex-wrap gap-4">
          <div className="w-full md:w-[calc(25%-12px)]">
            <Select value={mode} onChange={setMode} style={{ width: "100%" }}>
              <Option value="month">Báo cáo theo tháng</Option>
              <Option value="year">Báo cáo theo năm</Option>
            </Select>
          </div>

          <div className="w-full md:w-[calc(25%-12px)]">
            <DatePicker
              picker={mode}
              style={{ width: "100%" }}
              value={date}
              onChange={setDate}
              placeholder={mode === "month" ? "Chọn tháng" : "Chọn năm"}
            />
          </div>

          <div className="w-full md:w-[calc(25%-12px)]">
            <Select
              showSearch
              placeholder="Chọn nhân viên"
              style={{ width: "100%" }}
              optionFilterProp="children"
              value={selectedUser}
              onChange={setSelectedUser}
            >
              <Option value="all">Tất cả nhân viên</Option>
              {users.map((user) => (
                <Option key={user.id} value={user.id}>
                  {user.name}
                </Option>
              ))}
            </Select>
          </div>

          <div className="max-md:w-full flex max-md:flex-col gap-2">
            <Button
              type="primary"
              loading={loading}
              onClick={() => handleGenerateReport()}
              block
            >
              Xem báo cáo
            </Button>
            <div className="flex gap-2">
              <Button
                icon={<PrinterOutlined />}
                onClick={() => printReport(data)}
              />
              <Button
                icon={<FileExcelOutlined />}
                onClick={() => exportToExcel(data)}
              />
            </div>
          </div>
        </div>
      </Card>

      <Card title="Thống kê tổng quan" className="mt-4">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={6}>
            <Statistic title="Tổng bản ghi" value={statistics.total} />
          </Col>
          <Col xs={24} md={6}>
            <Statistic title="Có mặt" value={statistics.present} />
          </Col>
          <Col xs={24} md={6}>
            <Statistic title="Đi trễ" value={statistics.late} />
          </Col>
          <Col xs={24} md={6}>
            <Statistic title="Vắng mặt" value={statistics.absent} />
          </Col>
          <Col xs={24} md={6}>
            <Statistic title="Chưa check-out" value={statistics.noCheckout} />
          </Col>
        </Row>
      </Card>

      <Card title="Bảng báo cáo chấm công" className="mt-4">
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey={(record) => record.id}
          pagination={
            selectedUser === "all"
              ? {
                  current: pagination.current,
                  pageSize: pagination.pageSize,
                  total: pagination.total,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} của ${total} bản ghi`,
                }
              : false
          }
          onChange={handleTableChange}
          scroll={{ x: true }}
        />
      </Card>
    </>
  );
};

export default ReportSection;
