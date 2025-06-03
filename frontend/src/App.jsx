import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Navigate,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoutes from "../utils/ProtectedRoutes";
import WorkoutPlansPage from "./pages/WorkoutPlansPage";
import WorkoutPlanPage from "./pages/WorkoutPlanPage";
import WorkoutDayPage from "./pages/WorkoutDayPage";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        {/* Redirect root to /auth */}
        <Route index element={<Navigate to="/auth" replace />} />

        {/* Public Routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/plans" element={<MainLayout />}>
            <Route index element={<WorkoutPlansPage />} />
            <Route path=":planId" element={<WorkoutPlanPage />} />
            <Route path=":planId/day/:dayId" element={<WorkoutDayPage />} />
          </Route>
        </Route>
      </Route>
    )
  );
  return <RouterProvider router={router} />;
};

export default App;
