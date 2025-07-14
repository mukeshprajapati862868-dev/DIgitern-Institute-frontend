import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminService } from '../../services/adminService';
import { Link } from 'react-router-dom';
import { Download, CheckCircle } from 'lucide-react';

const AdminDashboard = () => {
  const { user, switchRole } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [dashboardResponse, certificatesResponse] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getAllCertificates()
        ]);
        setDashboardData(dashboardResponse.data);
        setCertificates(certificatesResponse.data || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setDashboardData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleStatusUpdate = async (studentId, status) => {
    try {
      await adminService.updateStudentStatus(studentId, status);
      const response = await adminService.getDashboardStats();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error updating student status:', error);
    }
  };

  const downloadCertificate = async (certificate) => {
    try {
      const filename = certificate.filename || `certificate_${certificate.certificateId}.pdf`;
      const response = await adminService.downloadCertificate(filename);
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Safe destructuring with fallback
  const stats = dashboardData?.stats || {
    totalStudents: 0,
    pendingStudents: 0,
    activeStudents: 0,
    completedStudents: 0,
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalEarnings: 0,
    thisMonthEarnings: 0,
  };

  const recentStudents = dashboardData?.recentStudents || [];
  const recentProjects = dashboardData?.recentProjects || [];
  const recentCertificates = certificates.slice(0, 5); // Show only 5 recent certificates

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back, {user?.name}. Here's your platform overview.</p>
          </div>
          <div className="flex space-x-4">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <Link
              to="/admin/task-assignment"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
            >
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Assign Tasks
            </Link>
            <Link
              to="/admin/task-management"
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center"
            >
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Manage Tasks
            </Link>
            <Link
              to="/admin/certificate-upload"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Upload Certificates
            </Link>
            <button
              onClick={() => switchRole('student')}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Switch to Student View
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard label="Total Students" value={stats.totalStudents} color="blue" />
          <DashboardCard label="Pending Approvals" value={stats.pendingStudents} color="yellow" />
          <DashboardCard label="Active Students" value={stats.activeStudents} color="green" />
          <DashboardCard label="Total Certificates" value={certificates.length} color="purple" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Recent Students</h2>
              <div className="flex space-x-4">
              <Link to="/admin/approvals" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </Link>
                <Link to="/admin/course-approval" className="text-green-600 hover:text-green-700 text-sm font-medium">
                  Course Applications
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              {recentStudents.map((student) => (
                <div key={student._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{student.name}</h3>
                    <p className="text-sm text-gray-600">{student.email}</p>
                    <p className="text-xs text-gray-500">{student.college}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      student.internshipStatus === 'active'
                        ? 'bg-green-100 text-green-800'
                        : student.internshipStatus === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {student.internshipStatus}
                    </span>
                    {student.internshipStatus === 'pending' && (
                      <button
                        onClick={() => handleStatusUpdate(student._id, 'approved')}
                        className="text-green-600 hover:text-green-700 text-sm"
                      >
                        Approve
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Recent Projects</h2>
              <Link to="/admin/tasks" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div key={project._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{project.title}</h3>
                    <p className="text-sm text-gray-600">{project.category}</p>
                    <p className="text-xs text-gray-500">Assigned to: {project.student}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    project.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : project.status === 'in_progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Recent Certificates</h2>
              <Link to="/admin/certificates" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {recentCertificates.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No certificates yet</p>
              ) : (
                recentCertificates.map((certificate) => (
                  <div key={certificate._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{certificate.student?.name}</h3>
                      <p className="text-sm text-gray-600">{certificate.project?.title}</p>
                      <p className="text-xs text-gray-500">ID: {certificate.certificateId}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        certificate.status === 'generated'
                          ? 'bg-green-100 text-green-800'
                          : certificate.status === 'approved'
                          ? 'bg-blue-100 text-blue-800'
                          : certificate.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {certificate.status}
                      </span>
                      {certificate.status === 'generated' && (
                        <button
                          onClick={() => downloadCertificate(certificate)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({ label, value, color }) => {
  const colors = {
    blue: 'bg-blue-100 text-blue-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600'
  };
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-2 rounded-lg ${colors[color]}`}>
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
          </svg>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
