import React, { useState, useEffect } from "react";
import { Row, Col, Card, Statistic, Button, Space, message, Form } from "antd";
import { useAuth0 } from "@auth0/auth0-react";
import dayjs from "dayjs";
import TimesheetTable from "./components/TimesheetTable";
import StaffTable from "./components/StaffTable";
import ReportSection from "./components/ReportSection";
import TimesheetFormModal from "./components/TimesheetFormModal";
import ReportTimesheetModal from "./components/ReportTimesheetModal"; 

export default function TimesheetPage() {
  const [currentView, setCurrentView] = useState("timesheet");
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [timesheetData, setTimesheetData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [userRole] = useState("admin");

  const [reportOpen, setReportOpen] = useState(false);
  const [reportRecord, setReportRecord] = useState(null);

  const { getAccessTokenSilently } = useAuth0();

  // Fake call để lấy thông tin user từ backend
  const fetchUser = async () => {
    try {
      const token = await getAccessTokenSilently();
      console.log("Access Token:", token);

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
  }, []);

  // Mock dữ liệu timesheet
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

  const openReportModal = (record) => {
    setReportRecord(record);
    setReportOpen(true);
  };

  const handleSendReport = (reportData) => {
    console.log("Report gửi:", reportData);
    // TODO: gửi lên BE
    setReportOpen(false);
  };

  const totalHours = timesheetData.reduce((sum, r) => sum + r.totalHours, 0);
  const avgHours =
    timesheetData.length > 0 ? totalHours / timesheetData.length : 0;

  const renderContent = () => {
    switch (currentView) {
      case "timesheet":
        return (
          <>
            <Row gutter={[16, 16]} className="mb-4">
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic title="Tổng giờ làm" value={totalHours} suffix="h" />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic title="Trung bình/ngày" value={avgHours.toFixed(1)} suffix="h" />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic title="Số ngày làm" value={timesheetData.length} suffix="ngày" />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic title="Hiệu suất" value={((avgHours / 8) * 100).toFixed(0)} suffix="%" />
                </Card>
              </Col>
            </Row>

            <TimesheetTable
              data={timesheetData}
              onAdd={handleAdd}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onReport={openReportModal}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
            />
            <ReportTimesheetModal
              open={reportOpen}
              onCancel={() => setReportOpen(false)}
              onSubmit={handleSendReport}
              record={reportRecord}
            />
          </>
        );

      case "staff":
        return <StaffTable data={mockStaffData} />;

      case "reports":
        return <ReportSection />;

      default:
        return null;
    }
  };

  return (
    <div className="w-full py-6">
      <div className="flex justify-center mb-4">
        <Space>
          <Button color="primary"
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

      <div className="px-4 relative">
        {renderContent()}
      </div>

      <TimesheetFormModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSubmit={handleSubmit}
        form={form}
        editingRecord={editingRecord}
      />
    </div>
  );
}
