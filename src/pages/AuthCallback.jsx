// src/AuthCallback.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { message } from "antd";

export default function AuthCallback() {
  const { isAuthenticated, isLoading, getIdTokenClaims, logout } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      return navigate("/login");
    }

    (async () => {
      try {
        const token = await getIdTokenClaims();
        console.log("Access Token:", token);
        const res = await fetch("http://localhost:8081/users/me", {
          headers: { Authorization: `Bearer ${token.__raw}` },
        });

        if (res.ok) {
          navigate("/timesheet");
        } else {
          message.error("Không tìm thấy người dùng");
          console.log(res);
          //logout({ returnTo: window.location.origin + "/login" });
        }
      } catch (err) {
        message.error("Đăng nhập thất bại, hãy trở lại sau");
        console.log(res);
        //logout({ returnTo: window.location.origin + "/login" });
      }
    })();
  }, [isAuthenticated, isLoading, getIdTokenClaims, logout, navigate]);

  return <div>Đang xác thực...</div>;
}
