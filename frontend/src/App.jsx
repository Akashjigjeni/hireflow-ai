import { BrowserRouter, Routes, Route } from "react-router-dom";

// =========================
// Pages
// =========================

import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import Apply from "./pages/Apply";
import Dashboard from "./pages/Dashboard";
import CandidateDashboard from "./pages/CandidateDashboard";
import MyApplications from "./pages/MyApplications";
import EmployerDashboard from "./pages/EmployerDashboard";
import ViewApplicants from "./pages/ViewApplicants";
import PostJob from "./pages/PostJob";
import EditJob from "./pages/EditJob";
import Profile from "./pages/Profile";
import SavedJobs from "./pages/SavedJobs";
import NotFound from "./pages/NotFound";

// =========================
// Components
// =========================

import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <BrowserRouter>

      {/* Automatically move to top on route change */}
      <ScrollToTop />

      <Routes>

        {/* =================================
            PUBLIC ROUTES
        ================================= */}

        <Route
          path="/"
          element={<Jobs />}
        />

        <Route
          path="/jobs"
          element={<Jobs />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* =================================
            COMMON PROTECTED ROUTES
        ================================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />


        {/* =================================
            CANDIDATE ROUTES
        ================================= */}

        <Route
          path="/candidate-dashboard"
          element={
            <ProtectedRoute
              allowedRoles={["candidate"]}
            >
              <CandidateDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/saved-jobs"
          element={
            <ProtectedRoute
              allowedRoles={["candidate"]}
            >
              <SavedJobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/apply/:jobId"
          element={
            <ProtectedRoute
              allowedRoles={["candidate"]}
            >
              <Apply />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-applications"
          element={
            <ProtectedRoute
              allowedRoles={["candidate"]}
            >
              <MyApplications />
            </ProtectedRoute>
          }
        />


        {/* =================================
            EMPLOYER ROUTES
        ================================= */}

        <Route
          path="/employer-dashboard"
          element={
            <ProtectedRoute
              allowedRoles={["employer"]}
            >
              <EmployerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/post-job"
          element={
            <ProtectedRoute
              allowedRoles={["employer"]}
            >
              <PostJob />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-job/:id"
          element={
            <ProtectedRoute
              allowedRoles={["employer"]}
            >
              <EditJob />
            </ProtectedRoute>
          }
        />

        <Route
          path="/view-applicants/:jobId"
          element={
            <ProtectedRoute
              allowedRoles={["employer"]}
            >
              <ViewApplicants />
            </ProtectedRoute>
          }
        />


        {/* =================================
            404
        ================================= */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;