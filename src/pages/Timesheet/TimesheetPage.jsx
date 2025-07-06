import React, { useState, useEffect } from "react";
import { Row, Col, Card, Statistic, Button, Space, message, Form } from "antd";
import { useAuth0 } from "@auth0/auth0-react";
import dayjs from "dayjs";
import TimesheetTable from "./components/TimesheetTable";
import ReportSection from "./components/ReportSection";
import TimesheetFormModal from "./components/TimesheetFormModal";
import ReportTimesheetModal from "./components/ReportTimesheetModal";
import { useAttendanceService } from "services/attendanceService";

export default function TimesheetPage() {
  const [currentView, setCurrentView] = useState("timesheet");
  const [selectedWeek, setselectedWeek] = useState(dayjs());
  const [timesheetData, setTimesheetData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [userRole] = useState("staff");

  const [reportOpen, setReportOpen] = useState(false);
  const [reportRecord, setReportRecord] = useState(null);

  const { getMyWeeklyAttendance } = useAttendanceService();

  useEffect(() => {
    const fetchAttendance = async () => {
      if (userRole === "staff" && selectedWeek) {
        const startOfWeek = selectedWeek.startOf("week").format("YYYY-MM-DD");
        const endOfWeek = selectedWeek.endOf("week").format("YYYY-MM-DD");
        try {
          const response = await getMyWeeklyAttendance(startOfWeek, endOfWeek);
          const data = response || [];

          const transformed = data.map((item, index) => {
            const checkInTime = dayjs(item.checkIn);
            const checkOutTime = item.checkOut ? dayjs(item.checkOut) : null;
            const totalHours = checkOutTime
              ? checkOutTime.diff(checkInTime, "minute") / 60
              : 0;

            return {
              key: item.id || index.toString(),
              ...item,
              date: dayjs(item.checkIn).format("YYYY-MM-DD"),
              checkIn: checkInTime.format("HH:mm"),
              checkOut: checkOutTime ? checkOutTime.format("HH:mm") : "--:--",
              totalHours: Math.round(totalHours * 100) / 100,
              status: totalHours >= 8 ? "completed" : "late",
              employee: item.user?.name || "Tôi",
            };
          });
          console.log(transformed)
          setTimesheetData(transformed);
        } catch (error) {
          message.error("Không thể tải dữ liệu điểm danh tuần này");
        }
      }
    };

    fetchAttendance();
  }, [userRole, selectedWeek]);

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

            <TimesheetTable
              data={timesheetData}
              onAdd={handleAdd}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onReport={openReportModal}
              selectedWeek={selectedWeek}
              setselectedWeek={setselectedWeek}
            />
            <ReportTimesheetModal
              open={reportOpen}
              onCancel={() => setReportOpen(false)}
              onSubmit={handleSendReport}
              record={reportRecord}
            />
          </>
        );

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
          <Button
            color="primary"
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
        </Space>
      </div>

      <div className="px-4 relative">{renderContent()}</div>

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
