import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import TimesheetPage from "./pages/Timesheet/TimesheetPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/timesheet" element={<TimesheetPage />} />
      </Routes>
    </Router>
  );
}

export default App;
