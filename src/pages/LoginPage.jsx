import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function LoginPage() {
  const navigate = useNavigate();

  const onFinish = (values) => {
    const { email, password } = values;

    // Giả lập xác thực (có thể thay bằng API sau này)
    if (email === "admin@example.com" && password === "admin") {
      localStorage.setItem("role", "admin");
      message.success("Đăng nhập thành công với vai trò Admin!");
      navigate("/timesheet");
    } else if (email === "user@example.com" && password === "user") {
      localStorage.setItem("role", "user");
      message.success("Đăng nhập thành công với vai trò User!");
      navigate("/timesheet");
    } else {
      message.error("Tài khoản hoặc mật khẩu không đúng!");
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <Card className="w-full max-w-md rounded-lg backdrop-blur-md bg-white/70 border border-white/20 shadow-2xl">
        <div className="text-center mb-6">
          <Title level={2}>Attendance Tracker</Title>
          <Text type="secondary">Vui lòng đăng nhập để tiếp tục</Text>
        </div>

        <Form name="login" layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
          </Form.Item>

          <Form.Item className="text-center">
            <Button type="primary" htmlType="submit" className="w-full">
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
