import React, { useState, useEffect } from "react";
import { Row, Col, Card, Statistic, Button, Space, Form } from "antd";
import useApp from "antd/es/app/useApp";
import dayjs from "dayjs";
import TimesheetTable from "./components/TimesheetTable";
import ReportSection from "./components/ReportSection";
import TimesheetFormModal from "./components/TimesheetFormModal";
import ReportTimesheetModal from "./components/ReportTimesheetModal";
import { useAttendanceService } from "services/attendanceService";
import { useComplainService } from "services/complainService";
import { useSelector } from "react-redux";

export default function TimesheetPage() {
  const { message } = useApp();
  const [currentView, setCurrentView] = useState("timesheet");
  const [selectedWeek, setselectedWeek] = useState(dayjs());
  const [timesheetData, setTimesheetData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [userRole] = useState("staff");
  const { currentUser } = useSelector((state) => state.user);
  const role = currentUser?.role || "user";
  const [statistics, setStatistics] = useState({
    totalHours: 0,
    averageHoursPerDay: 0,
    presentDays: 0,
    violationDays: 0,
  });

  const [reportOpen, setReportOpen] = useState(false);
  const [reportRecord, setReportRecord] = useState(null);

  const { getMyWeeklyAttendance } = useAttendanceService();
  const { createComplain, updateComplain } = useComplainService();

  const fetchAttendance = async () => {
    if (role === "staff" && selectedWeek) {
      const startOfWeek = selectedWeek.startOf("week").format("YYYY-MM-DD");
      const endOfWeek = selectedWeek.endOf("week").format("YYYY-MM-DD");
      try {
        const response = await getMyWeeklyAttendance(startOfWeek, endOfWeek);
        const data = response?.content || [];

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
            employee: item.user?.name || "Tôi",
          };
        });
        setTimesheetData(transformed);
        setStatistics({
          totalHours: response.totalHours || 0,
          averageHoursPerDay: response.averageHoursPerDay || 0,
          presentDays: response.presentDays || 0,
          violationDays: response.violationDays || 0,
        });
      } catch (error) {
        message.error("Không thể tải dữ liệu điểm danh tuần này");
      }
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [role, selectedWeek]);

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
    setReportRecord(null);
    setTimeout(() => {
      setReportRecord(record);
      setReportOpen(true);
    }, 0);
  };

  const handleSendReport = async (reportData, isUpdate) => {
    const formData = new FormData();
    formData.append("attendanceId", reportData.attendanceId);
    formData.append("content", reportData.content);
    if (reportData.complainImage) {
      formData.append("complainImage", reportData.complainImage);
    }

    try {
      if (isUpdate) {
        await updateComplain(reportData.complainid, formData);
        message.success("Đã cập nhật báo lỗi!");
        await fetchAttendance();
      } else {
        await createComplain(formData);
        message.success("Báo lỗi đã được gửi!");
        await fetchAttendance();
      }
      setReportOpen(false);
    } catch (error) {
      console.error("Gửi báo lỗi thất bại:", error);
      message.error("Gửi báo lỗi thất bại!");
    }
  };

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
                    value={statistics.totalHours}
                    suffix="h"
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Trung bình/ngày"
                    value={(statistics.averageHoursPerDay ?? 0).toFixed(1)}
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
                    title="Số ngày vi phạm chấm công"
                    value={statistics.violationDays}
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
          {role === "admin" && (
            <Button
              type={currentView === "reports" ? "primary" : "default"}
              onClick={() => setCurrentView("reports")}
            >
              Báo cáo
            </Button>
          )}
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
