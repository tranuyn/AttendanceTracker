import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";
import LoginPage from "./pages/LoginPage";
import TimesheetPage from "./pages/Timesheet/TimesheetPage";
import StaffManagementPage from "./pages/StaffManagement/StaffManagementPage";
import DashboardLayout from "./components/DashboardLayout";
import ComplainsPage from "./pages/Complains/ComplainsPage";
import Profile from "./pages/Profile/ProfilePage";
import AuthCallback from "./auth/AuthCallback";
import AuthWrapper from "./auth/AuthWrapper";
import ProtectedRoute from "./auth/ProtectedRoute";
import { Spin } from "antd";
import CheckinCheckoutPage from "./pages/CheckinCheckout/CheckinCheckoutPage";

function App() {
  const { currentUser, isLoaded } = useSelector((state) => state.user);
  const { isAuthenticated, isLoading } = useAuth0();

  // Lấy role từ Redux store thay vì hardcode
  const role = currentUser?.role || "user";

  // Hiển thị loading khi đang xác thực
  if (isLoading) {
    return <Spin size="large"/>;
  }

  return (
    <Router>
      <AuthWrapper>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
        
          {/* Protected Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <DashboardLayout role={role}>
                  <Profile />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/attendance"
            element={
              <ProtectedRoute>
                <DashboardLayout role={role}>
                  <CheckinCheckoutPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/timesheet"
            element={
              <ProtectedRoute>
                <DashboardLayout role={role}>
                  <TimesheetPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <DashboardLayout role={role}>
                  <ComplainsPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/manage-staff"
            element={
              <ProtectedRoute>
                <DashboardLayout role={role}>
                  <StaffManagementPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          
          {/* Default redirect */}
          <Route 
            path="/" 
            element={
              isAuthenticated ? 
                <Navigate to="/attendance" replace /> : 
                <Navigate to="/login" replace />
            } 
          />
        </Routes>
      </AuthWrapper>
    </Router>
  );
}

export default App;