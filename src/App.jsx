import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import TimesheetPage from "./pages/Timesheet/TimesheetPage";
import StaffManagementPage from "./pages/StaffManagement/StaffManagementPage";
import DashboardLayout from "./components/DashboardLayout";
import ReportPage from "./pages/ReportPage";
import Profile from "./pages/Profile/ProfilePage";

function App() {
  // const role = localStorage.getItem("role") || "user";
  const role = "user";
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile"
          element={
            <DashboardLayout role={role}>
              <Profile />
            </DashboardLayout>
          } />
        <Route path="/staff-management" element={<StaffManagementPage />} />
        <Route
          path="/timesheet"
          element={
            <DashboardLayout role={role}>
              <TimesheetPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/reports"
          element={
            <DashboardLayout role={role}>
              <ReportPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/manage-staff"
          element={
            <DashboardLayout role={role}>
              <StaffManagementPage />
            </DashboardLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
