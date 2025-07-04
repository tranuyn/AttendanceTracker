import { useAuth0 } from "@auth0/auth0-react";
import { Spin } from "antd";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth0();
  const { currentUser, isLoaded } = useSelector((state) => state.user);

  // Đang loading Auth0
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Đang xác thực...</div>
      </div>
    );
  }

  // Chưa authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Đã authenticated nhưng chưa có user data
  if (isAuthenticated && !currentUser && !isLoaded) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        width: '100%'
      }}>
        <Spin />
      </div>
    );
  }

  return children;
}