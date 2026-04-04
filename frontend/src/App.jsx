import React from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import Complaints from "./pages/Complaints.jsx";
import Offenders from "./pages/Offenders.jsx";
import Laundry from "./pages/Laundry.jsx";
import LeaveSurvey from "./pages/LeaveSurvey.jsx";
import Notices from "./pages/Notices.jsx";
import Movement from "./pages/Movement.jsx";
import Auth from "./pages/Auth.jsx";
import Violations from "./pages/Violations.jsx";

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem("authUser");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const isAuthenticated = () => {
  const token = localStorage.getItem("authToken");
  const user = getStoredUser();
  return Boolean(token && user);
};

const isAdminAuthenticated = () => {
  const token = localStorage.getItem("authToken");
  const user = getStoredUser();
  return Boolean(token && user?.role === "ADMIN");
};

const isStudentAuthenticated = () => {
  const token = localStorage.getItem("authToken");
  const user = getStoredUser();
  return Boolean(token && user?.role === "STUDENT");
};

const RequireAuth = () => {
  if (!isAuthenticated()) {
    return <Navigate to="/auth" replace />;
  }
  return <Outlet />;
};

const RequireAdmin = () => {
  if (!isAdminAuthenticated()) {
    return <Navigate to="/auth" replace />;
  }
  return <Outlet />;
};

const PublicOnlyAuth = () => {
  if (isAdminAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

function App() {
  return (
    <div className="App selection:bg-slate-900 selection:text-white font-sans antialiased">
      <BrowserRouter>
        <Routes>
          <Route element={<PublicOnlyAuth />}>
            <Route path="/auth" element={<Auth />} />
            <Route path="/login" element={<Auth />} />
          </Route>

          <Route element={<RequireAuth />}>
            <Route
              path="/"
              element={
                isAdminAuthenticated() ? <Dashboard /> : <StudentDashboard />
              }
            />
            <Route path="/complaints" element={<Complaints />} />
            <Route path="/offenders" element={<Offenders />} />
            <Route path="/violations" element={<Violations />} />
            <Route path="/notices" element={<Notices />} />
            <Route path="/movement" element={<Movement />} />
            <Route path="/laundry" element={<Laundry />} />
            <Route path="/leave-survey" element={<LeaveSurvey />} />
          </Route>

          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
