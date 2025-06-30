import { Table, DatePicker, Typography, Card } from 'antd';
import { useState } from 'react';
import dayjs from 'dayjs';

const { Title } = Typography;

const columns = [
  { title: 'Ngày', dataIndex: 'date', key: 'date' },
  { title: 'Giờ vào', dataIndex: 'checkIn', key: 'checkIn' },
  { title: 'Giờ ra', dataIndex: 'checkOut', key: 'checkOut' },
  { title: 'Tổng giờ', dataIndex: 'totalHours', key: 'totalHours' },
];

// Dummy dữ liệu
const mockData = [
  { key: '1', date: '01/06/2025', checkIn: '08:00', checkOut: '17:00', totalHours: 8 },
  { key: '2', date: '02/06/2025', checkIn: '08:15', checkOut: '17:05', totalHours: 7.8 },
  // ...
];

export default function TimesheetPage() {
  const [selectedMonth, setSelectedMonth] = useState(dayjs());

  const handleMonthChange = (value) => {
    setSelectedMonth(value);
    // TODO: Gọi API để lấy timesheet theo tháng mới
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Card>
        <div className="flex justify-between items-center mb-4">
          <Title level={3}>Bảng chấm công</Title>
          <DatePicker
            picker="month"
            onChange={handleMonthChange}
            value={selectedMonth}
            allowClear={false}
          />
        </div>
        <Table columns={columns} dataSource={mockData} pagination={false} />
      </Card>
    </div>
  );
}
