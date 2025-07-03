import React, { useState, useEffect } from "react";
import {
  Table,
  DatePicker,
  Card,
  Button,
  Modal,
  Form,
  TimePicker,
  message,
  Statistic,
  Row,
  Col,
  Tag,
  Space,
  Input,
  Select,
  Divider,
} from "antd";
import {
  ClockCircleOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
  UserOutlined,
  TeamOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useAuth0 } from "@auth0/auth0-react";

const { RangePicker } = DatePicker;
const { Option } = Select;

export default function TimesheetApp() {
  const [currentView, setCurrentView] = useState("timesheet");
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [timesheetData, setTimesheetData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [userRole] = useState("staff");
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const fetchUser = async () => {
    try {
      const token = await getAccessTokenSilently();
      console.log(token);

      const res = await fetch("http://localhost:8081/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user = await res.json();
      console.log("User info from backend:", user);
    } catch (err) {
      console.error("Lỗi lấy thông tin user:", err);
    }
  };

  useEffect(() => {
    fetchUser();
  });

  // Mock data
  const mockTimesheetData = [
    {
      key: "1",
      date: "2025-06-01",
      checkIn: "08:00",
      checkOut: "17:00",
      totalHours: 8,
      status: "completed",
      employee: "Nguyễn Văn A",
    },
    {
      key: "2",
      date: "2025-06-02",
      checkIn: "08:15",
      checkOut: "17:05",
      totalHours: 7.8,
      status: "completed",
      employee: "Nguyễn Văn A",
    },
    {
      key: "3",
      date: "2025-06-03",
      checkIn: "08:30",
      checkOut: "16:45",
      totalHours: 7.25,
      status: "late",
      employee: "Nguyễn Văn A",
    },
  ];

  const mockStaffData = [
    {
      key: "1",
      name: "Nguyễn Văn A",
      email: "a@company.com",
      department: "IT",
      totalHours: 160,
    },
    {
      key: "2",
      name: "Trần Thị B",
      email: "b@company.com",
      department: "HR",
      totalHours: 155,
    },
    {
      key: "3",
      name: "Lê Văn C",
      email: "c@company.com",
      department: "Finance",
      totalHours: 162,
    },
  ];
  useEffect(() => {
    setTimesheetData(mockTimesheetData);
  }, []);

  const timesheetColumns = [
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
        const colorMap = {
          completed: "green",
          late: "orange",
          absent: "red",
        };
        const labelMap = {
          completed: "Hoàn thành",
          late: "Trễ",
          absent: "Vắng",
        };
        return <Tag color={colorMap[status]}>{labelMap[status]}</Tag>;
      },
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.key)}
          />
        </Space>
      ),
    },
  ];

  const staffColumns = [
    { title: "Tên nhân viên", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phòng ban", dataIndex: "department", key: "department" },
    {
      title: "Tổng giờ tháng",
      dataIndex: "totalHours",
      key: "totalHours",
      render: (hours) => `${hours}h`,
    },
    {
      title: "Hành động",
      key: "actions",
      render: () => (
        <Space>
          <Button type="link">Chi tiết</Button>
          <Button type="link">Chỉnh sửa</Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    form.setFieldsValue({
      date: dayjs(record.date),
      checkIn: dayjs(record.checkIn, "HH:mm"),
      checkOut: dayjs(record.checkOut, "HH:mm"),
    });
    setEditingRecord(record);
    setIsModalVisible(true);
  };

  const handleDelete = (key) => {
    setTimesheetData(timesheetData.filter((record) => record.key !== key));
    message.success("Xóa thành công!");
  };

  const handleSubmit = (values) => {
    const checkIn = values.checkIn.format("HH:mm");
    const checkOut = values.checkOut.format("HH:mm");
    const totalHours = values.checkOut.diff(values.checkIn, "hour", true);

    const newRecord = {
      key: editingRecord ? editingRecord.key : Date.now().toString(),
      date: values.date.format("YYYY-MM-DD"),
      checkIn,
      checkOut,
      totalHours: Math.round(totalHours * 100) / 100,
      status: totalHours >= 8 ? "completed" : "late",
      employee: "Nguyễn Văn A",
    };

    if (editingRecord) {
      setTimesheetData(
        timesheetData.map((item) =>
          item.key === editingRecord.key ? newRecord : item
        )
      );
      message.success("Cập nhật thành công!");
    } else {
      setTimesheetData([...timesheetData, newRecord]);
      message.success("Thêm mới thành công!");
    }

    setIsModalVisible(false);
  };

  const totalHours = timesheetData.reduce((sum, r) => sum + r.totalHours, 0);
  const avgHours =
    timesheetData.length > 0 ? totalHours / timesheetData.length : 0;

  const renderContent = () => {
    switch (currentView) {
      case "timesheet":
        return (
          <div className="mx-auto space-y-6">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Tổng giờ làm"
                    value={totalHours}
                    suffix="h"
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Trung bình/ngày"
                    value={avgHours.toFixed(1)}
                    suffix="h"
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Số ngày làm"
                    value={timesheetData.length}
                    suffix="ngày"
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Hiệu suất"
                    value={((avgHours / 8) * 100).toFixed(0)}
                    suffix="%"
                  />
                </Card>
              </Col>
            </Row>

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
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAdd}
                  >
                    Thêm mới
                  </Button>
                </Space>
              }
            >
              <Table
                columns={timesheetColumns}
                dataSource={timesheetData}
                pagination={{ pageSize: 10 }}
              />
            </Card>
          </div>
        );

      case "staff":
        return (
          <Card
            title="Quản lý nhân sự"
            extra={
              <Button icon={<PlusOutlined />} type="primary">
                Thêm nhân viên
              </Button>
            }
          >
            <Table
              columns={staffColumns}
              dataSource={mockStaffData}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        );

      case "reports":
        return (
          <div className="mx-auto space-y-6">
            <Card title="Bộ lọc báo cáo">
              <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                  <RangePicker style={{ width: "100%" }} />
                </Col>
                <Col xs={24} md={8}>
                  <select className="w-full border p-2 rounded">
                    <option>Tất cả phòng ban</option>
                    <option value="it">IT</option>
                    <option value="hr">HR</option>
                    <option value="finance">Finance</option>
                  </select>
                </Col>
                <Col xs={24} md={8}>
                  <Button type="primary" block>
                    Tạo báo cáo
                  </Button>
                </Col>
              </Row>
            </Card>

            <Card title="Thống kê tổng quan">
              <Row gutter={[16, 16]}>
                <Col xs={24} md={6}>
                  <Statistic title="Tổng nhân viên" value={25} />
                </Col>
                <Col xs={24} md={6}>
                  <Statistic title="Có mặt hôm nay" value={23} />
                </Col>
                <Col xs={24} md={6}>
                  <Statistic title="Đi trễ" value={2} />
                </Col>
                <Col xs={24} md={6}>
                  <Statistic title="Vắng mặt" value={0} />
                </Col>
              </Row>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-red-500 py-6 ">
      <div className="flex justify-center mb-4">
        <Space>
          <Button
            type={currentView === "timesheet" ? "primary" : "default"}
            onClick={() => setCurrentView("timesheet")}
          >
            Chấm công
          </Button>
          <Button
            type={currentView === "reports" ? "primary" : "default"}
            onClick={() => setCurrentView("reports")}
          >
            Báo cáo
          </Button>
          {userRole === "admin" && (
            <Button
              type={currentView === "staff" ? "primary" : "default"}
              onClick={() => setCurrentView("staff")}
            >
              Nhân sự
            </Button>
          )}
        </Space>
      </div>
        <div className="px-4 relative"> {/* Wrap renderContent với padding */}
          {renderContent()}
        </div>

      <Modal
        title={editingRecord ? "Chỉnh sửa chấm công" : "Thêm chấm công"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Form.Item
            name="date"
            label="Ngày"
            rules={[{ required: true, message: "Chọn ngày!" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="checkIn"
            label="Giờ vào"
            rules={[{ required: true, message: "Chọn giờ vào!" }]}
          >
            <TimePicker format="HH:mm" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="checkOut"
            label="Giờ ra"
            rules={[{ required: true, message: "Chọn giờ ra!" }]}
          >
            <TimePicker format="HH:mm" style={{ width: "100%" }} />
          </Form.Item>
          <div className="flex justify-end space-x-2">
            <Button onClick={() => setIsModalVisible(false)}>Hủy</Button>
            <Button type="primary" htmlType="submit">
              {editingRecord ? "Cập nhật" : "Thêm mới"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
