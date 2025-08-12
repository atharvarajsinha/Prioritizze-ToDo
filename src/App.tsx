import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { initRecurringTaskHandler } from './utils/recurringTasks';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { UserDashboard } from './pages/UserDashboard';
import { ProfilePage } from './pages/ProfilePage';
import { AboutPage } from './pages/AboutPage';
import { FeedbackPage } from './pages/FeedbackPage';
import { TasksPage } from './pages/TasksPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { RemindersPage } from './pages/RemindersPage';
import { AdminFeedbackPage } from './pages/AdminFeedbackPage';
import { ROUTES } from './utils/constants';

// Initialize recurring task handler
// React.useEffect(() => {
//   initRecurringTaskHandler();
// }, []);

function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  allowedRoles 
}: { 
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedRoles?: string[];
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (!requireAuth && user) {
    const redirectPath = user.role === 'admin' ? ROUTES.ADMIN_DASHBOARD : ROUTES.USER_DASHBOARD;
    return <Navigate to={redirectPath} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    const redirectPath = user.role === 'admin' ? ROUTES.ADMIN_DASHBOARD : ROUTES.USER_DASHBOARD;
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path={ROUTES.HOME} 
        element={
          <ProtectedRoute requireAuth={false}>
            <HomePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path={ROUTES.LOGIN} 
        element={
          <ProtectedRoute requireAuth={false}>
            <LoginPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path={ROUTES.REGISTER} 
        element={
          <ProtectedRoute requireAuth={false}>
            <RegisterPage />
          </ProtectedRoute>
        } 
      />
      <Route path={ROUTES.ABOUT} element={<AboutPage />} />
      <Route path={ROUTES.FEEDBACK} element={<FeedbackPage />} />

      {/* Admin Routes */}
      <Route 
        path={ROUTES.ADMIN_DASHBOARD} 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/feedback" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminFeedbackPage />
          </ProtectedRoute>
        } 
      />

      {/* User Routes */}
      <Route 
        path={ROUTES.USER_DASHBOARD} 
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <UserDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/tasks" 
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <TasksPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/categories" 
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <CategoriesPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/reminders" 
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <RemindersPage />
          </ProtectedRoute>
        } 
      />

      {/* Shared Protected Routes */}
      <Route 
        path={ROUTES.PROFILE} 
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } 
      />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <AppRoutes />
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--toast-bg, #fff)',
                  color: 'var(--toast-color, #000)',
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;