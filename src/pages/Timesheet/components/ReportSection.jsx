import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Button, DatePicker, Select, message, Space } from "antd";
import { useUserService } from "services/userService";
import { PrinterOutlined, FileExcelOutlined } from "@ant-design/icons";

const { Option } = Select;

const ReportSection = ({ onFilterChange, statistics, onPrint, onExport }) => {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("all");

  const { getAllUsers } = useUserService();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        setUsers(response || []);
      } catch (error) {
        message.error("Không thể tải danh sách nhân viên");
      }
    };
    fetchUsers();
  }, []);

  const handleGenerateReport = () => {
    if (!selectedMonth) {
      return message.warning("Vui lòng chọn tháng");
    }

    onFilterChange?.({
      month: selectedMonth,
      userId: selectedUser,
    });
  };

  return (
    <>
      <Card title="Bộ lọc báo cáo">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <DatePicker
              picker="month"
              style={{ width: "100%" }}
              value={selectedMonth}
              onChange={setSelectedMonth}
              placeholder="Chọn tháng"
            />
          </Col>
          <Col xs={24} md={8}>
            <Select
              showSearch
              placeholder="Chọn nhân viên"
              style={{ width: "100%" }}
              optionFilterProp="children"
              allowClear
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
          </Col>
          <Col xs={24} md={8}>
            <Space style={{ width: "100%" }}>
              <Button type="primary" block onClick={handleGenerateReport}>
                Tạo báo cáo
              </Button>
              <Button icon={<PrinterOutlined />} onClick={onPrint} />
              <Button icon={<FileExcelOutlined />} onClick={onExport} />
            </Space>
          </Col>
        </Row>
      </Card>

      <Card title="Thống kê tổng quan" className="mt-4">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={6}><Statistic title="Tổng nhân viên" value={statistics?.total || 0} /></Col>
          <Col xs={24} md={6}><Statistic title="Có mặt" value={statistics?.present || 0} /></Col>
          <Col xs={24} md={6}><Statistic title="Đi trễ" value={statistics?.late || 0} /></Col>
          <Col xs={24} md={6}><Statistic title="Vắng mặt" value={statistics?.absent || 0} /></Col>
        </Row>
      </Card>
    </>
  );
};

export default ReportSection;
