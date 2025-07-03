import { Card, Row, Col, Statistic, Button, DatePicker } from "antd";
import React from "react";

const { RangePicker } = DatePicker;

const ReportSection = () => {
  return (
    <>
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

      <Card title="Thống kê tổng quan" className="mt-4">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={6}><Statistic title="Tổng nhân viên" value={25} /></Col>
          <Col xs={24} md={6}><Statistic title="Có mặt hôm nay" value={23} /></Col>
          <Col xs={24} md={6}><Statistic title="Đi trễ" value={2} /></Col>
          <Col xs={24} md={6}><Statistic title="Vắng mặt" value={0} /></Col>
        </Row>
      </Card>
    </>
  );
};

export default ReportSection;
