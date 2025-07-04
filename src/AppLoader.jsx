// src/AppLoader.jsx
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "./store/userSlice";

export default function AppLoader() {
  const { isAuthenticated, isLoading, getIdTokenClaims, logout } = useAuth0();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      if (isLoading) return;

      if (isAuthenticated) {
        try {
          const token = await getIdTokenClaims();
          const res = await fetch("http://localhost:8081/users/me", {
            headers: { Authorization: `Bearer ${token.__raw}` },
          });

          if (res.ok) {
            const user = await res.json();
            dispatch(setUser(user));
          } else {
            dispatch(clearUser());
            // logout({ returnTo: window.location.origin + "/login" });
                        console.log('mất authen r')

          }
        } catch {
          dispatch(clearUser());
        //   logout({ returnTo: window.location.origin + "/login" });
            console.log('mất authen r')
        }
      } else {
        dispatch(clearUser());
      }
    };

    fetchUser();
  }, [isAuthenticated, isLoading, getIdTokenClaims, logout, dispatch]);

  return null; // không render gì cả
}
