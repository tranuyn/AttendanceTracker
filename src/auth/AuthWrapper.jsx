import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "../store/userSlice";
import useApp from "antd/es/app/useApp";
import { useUserService } from "../services/userService";

export default function AuthWrapper({ children }) {
  const { message } = useApp();
  const { isAuthenticated, isLoading, getIdTokenClaims, logout } = useAuth0();
  const dispatch = useDispatch();
  const { currentUser, isLoaded } = useSelector((state) => state.user);
  const { getMe } = useUserService();
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
          const res = await getMe();
          if (res.id) {
            dispatch(setUser(res));
          } else {
            message.error(
              res?.error || "Không thể tải thông tin người dùng"
            );
            dispatch(clearUser());
            await new Promise((resolve) => setTimeout(resolve, 1000));
            logout({ returnTo: window.location.origin + "/login" });
          }
        } catch (err) {
          message.error("Lỗi khi tải thông tin người dùng");
          dispatch(clearUser());
          await new Promise((resolve) => setTimeout(resolve, 1000));
          logout({ returnTo: window.location.origin + "/login" });
        }
      })();
    }
  }, [
    isAuthenticated,
    isLoading,
    currentUser,
    isLoaded,
    getIdTokenClaims,
    logout,
    dispatch,
  ]);

  return children;
}
