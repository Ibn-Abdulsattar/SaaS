import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProtectedRoute from '../components/common/ProtectedRoute';
import Layout from '../components/Layout';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import ForgotPasswordPage from '../pages/Auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/Auth/ResetPasswordPage';
import DashboardPage from '../pages/DashboardPage';
import ProjectDetailPage from '../pages/project-detail/ProjectDetailPage';
import BillingPage from '../pages/BillingPage';
import ProfilePage from '../pages/ProfilePage';
import SearchPage from '../pages/SearchPage';
import TeamPage from '../pages/teams/TeamPage';
import TaskPage from '../pages/tasks/TaskPage';
import ProjectPage from '../pages/projects/ProjectPage';

const AppRoutes = () => {
  const { isAuthenticated } = useSelector(state => state.auth);

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterPage />}
      />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      
      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="projects" element={<ProjectPage />} />
        <Route path="projects/:id" element={<ProjectDetailPage />} />
        <Route path="team" element={<TeamPage />} />
        <Route path="tasks" element={<TaskPage />} />
        <Route path="billing" element={<BillingPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="search" element={<SearchPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;