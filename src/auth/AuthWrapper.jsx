import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "../store/userSlice";
import { message } from "antd";

export default function AuthWrapper({ children }) {
  const { isAuthenticated, isLoading, getIdTokenClaims, logout } = useAuth0();
  const dispatch = useDispatch();
  const { currentUser, isLoaded } = useSelector((state) => state.user);

  useEffect(() => {
    if (isLoading) return;
    
    if (!isAuthenticated) {
      if (currentUser) {
        dispatch(clearUser());
      }
      return;
    }

    // Chỉ fetch user data khi:
    // - Đã authenticated
    // - Chưa có user data trong Redux (để tránh fetch lại sau khi từ callback về)
    // - Không đang trong quá trình load
    if (isAuthenticated && !currentUser && !isLoaded) {
      (async () => {
        try {
          const token = await getIdTokenClaims();
          if (!token) return;
          
          const res = await fetch("http://localhost:8081/users/me", {
            headers: { Authorization: `Bearer ${token.__raw}` },
          });

          if (res.ok) {
            const user = await res.json();
            dispatch(setUser(user));
          } else {
            message.error("Không thể tải thông tin người dùng");
            dispatch(clearUser());
            logout({ returnTo: window.location.origin + "/login" });
          }
        } catch (err) {
          console.error("Fetch user error:", err);
          message.error("Lỗi khi tải thông tin người dùng");
          dispatch(clearUser());
          logout({ returnTo: window.location.origin + "/login" });
        }
      })();
    }
  }, [isAuthenticated, isLoading, currentUser, isLoaded, getIdTokenClaims, logout, dispatch]);

  return children;
}