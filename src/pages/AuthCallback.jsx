import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "../store/userSlice";
import { message } from "antd";

export default function AuthCallback() {
  const { isAuthenticated, isLoading, getIdTokenClaims, logout } = useAuth0();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      return navigate("/login");
    }

    (async () => {
      try {
        const token = await getIdTokenClaims();
        const res = await fetch("http://localhost:8081/users/me", {
          headers: { Authorization: `Bearer ${token.__raw}` },
        });

        if (res.ok) {
          const user = await res.json();
          dispatch(setUser(user));
          navigate("/timesheet");
        } else {
          message.error("Không tìm thấy người dùng");
          dispatch(clearUser());
          logout({ returnTo: window.location.origin + "/login" });
        }
      } catch (err) {
        message.error("Đăng nhập thất bại, hãy thử lại sau");
        dispatch(clearUser());
        logout({ returnTo: window.location.origin + "/login" });
      }
    })();
  }, [isAuthenticated, isLoading, getIdTokenClaims, logout, navigate, dispatch]);

  return <div>Đang xác thực...</div>;
}
