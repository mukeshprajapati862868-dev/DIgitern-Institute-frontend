import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import ErrorBoundary from './components/ErrorBoundary';
import { StudentDashboardProvider } from './context/StudentDashboardContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import StudentDashboard from './pages/student/Dashboard';
import InternshipTracker from './pages/student/InternshipTracker';
import CertificateDownload from './pages/student/CertificateDownload';
import PerformanceChart from './pages/student/PerformanceChart';
import CourseApplicationForm from './pages/student/CourseApplicationForm';
import MyTasks from './pages/student/MyTasks';
import ProjectSubmission from './pages/student/ProjectSubmission';

import AdminDashboard from './pages/admin/AdminDashboard';
import StudentApproval from './pages/admin/StudentApproval';
import TaskAssignment from './pages/admin/TaskAssignment';
import TaskManagement from './pages/admin/TaskManagement';
import CertificatePanel from './pages/admin/CertificatePanel';
import BulkStudentRegistration from './pages/admin/BulkStudentRegistration';
import CertificateGenerator from './pages/admin/CertificateGenerator';
import CourseManagement from './pages/admin/CourseManagement';
import CertificateUpload from './pages/admin/CertificateUpload';
import CourseApproval from './pages/admin/CourseApproval';

import ProjectList from './pages/fps/ProjectList';
import SubmitWork from './pages/fps/SubmitWork';

import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import CertificateVerification from './pages/CertificateVerification';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Unauthorized & Not Found Pages
const Unauthorized = () => (
  <div className="min-h-screen flex items-center justify-center bg-red-100">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-red-600 mb-4">403</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Access Denied</h2>
      <p className="text-gray-600 mb-8">You don’t have permission to access this page.</p>
      <button onClick={() => window.history.back()} className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition">
        Go Back
      </button>
    </div>
  </div>
);

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-gray-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
      <p className="text-gray-600 mb-8">The page you’re looking for doesn’t exist.</p>
      <button onClick={() => window.history.back()} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
        Go Back
      </button>
    </div>
  </div>
);

// Main Content
const AppContent = () => {
  const { user } = useAuth();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        
        {user && <Navbar />}
        <main className="flex-1">
          <Routes>
            {/* Public Routes - Only Landing page is public */}
            <Route path="/" element={<Landing />} />
            <Route path="/landing" element={<Landing />} />
            
            {/* Protected Auth Routes */}
            <Route path="/login" element={
              user ? (
                user.role === 'admin' || user.role === 'super_admin' ? (
                  <Navigate to="/admin/dashboard" replace />
                ) : (
                  <Navigate to="/student/dashboard" replace />
                )
              ) : (
                <Login />
              )
            } />
            <Route path="/register" element={
              user ? (
                user.role === 'admin' || user.role === 'super_admin' ? (
                  <Navigate to="/admin/dashboard" replace />
                ) : (
                  <Navigate to="/student/dashboard" replace />
                )
              ) : (
                <Register />
              )
            } />
            
            {/* Public Certificate Verification */}
            <Route path="/verify/:certificateId?" element={<CertificateVerification />} />
              
            {/* Protected Student Routes */}
              <Route 
                path="/student/dashboard" 
                element={
                <ProtectedRoute allowedRoles={['student']}>
                    <StudentDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
              path="/student/tracker"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <InternshipTracker />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/certificates"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <CertificateDownload />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/project-submission"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <ProjectSubmission />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/performance"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <PerformanceChart />
                </ProtectedRoute>
              } 
            />
            <Route
              path="/student/courses"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <CourseApplicationForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/tasks"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <MyTasks />
                </ProtectedRoute>
              }
            />
              
            {/* Protected Admin Routes */}
              <Route 
                path="/admin/dashboard" 
                element={
                <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
              path="/admin/approvals"
                element={
                <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                  <StudentApproval />
                  </ProtectedRoute>
                } 
              />
              <Route 
              path="/admin/tasks"
                element={
                <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                  <TaskAssignment />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/certificates" 
                element={
                <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                  <CertificatePanel />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/admin/bulk-registration" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                  <BulkStudentRegistration />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/admin/certificate-generator" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                  <CertificateGenerator />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/admin/courses" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                  <CourseManagement />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/admin/course-approval" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                  <CourseApproval />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/admin/certificate-upload" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                  <CertificateUpload />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/admin/task-assignment" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                  <TaskAssignment />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/admin/task-management" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                  <TaskManagement />
                </ProtectedRoute>
              }
            />

            {/* Protected FPS Routes */}
            <Route
              path="/fps/projects"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <ProjectList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/fps/submit"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <SubmitWork />
                </ProtectedRoute>
              } 
            />
              
            {/* Fallback Routes */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
            </Routes>
        </main>
        {user && <Footer />}
      </div>
    </Router>
  );
};

// App Wrapper
const App = () => (
  <ErrorBoundary>
    <AuthProvider>
      <StudentDashboardProvider>
        <AppContent />
      </StudentDashboardProvider>
    </AuthProvider>
  </ErrorBoundary>
);

export default App;
