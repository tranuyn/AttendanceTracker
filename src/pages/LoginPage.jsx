import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useAuth0 } from "@auth0/auth0-react";

const { Title, Text } = Typography;

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginWithRedirect, isAuthenticated, user, getAccessTokenSilently } =
    useAuth0();
  const onFinish = async () => {
    loginWithRedirect();
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <Card className="w-full max-w-md rounded-lg backdrop-blur-md bg-white/70 border border-white/20 shadow-2xl">
        <div className="text-center mb-6">
          <Title level={2}>Attendance Tracker</Title>
          <Text type="secondary">Vui lòng đăng nhập để tiếp tục</Text>
        </div>

        <Form name="login" layout="vertical" onFinish={onFinish}>
          <Form.Item className="text-center">
            <Button
              type="primary"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              htmlType="submit"
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
