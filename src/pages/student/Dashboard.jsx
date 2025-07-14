import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useStudentDashboard } from '../../context/StudentDashboardContext';
import courseService from '../../services/courseService';
import certificateService from '../../services/certificateService';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { dashboardData, loading } = useStudentDashboard();
  const [courseApplications, setCourseApplications] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [certificatesLoading, setCertificatesLoading] = useState(false);

  // Log all dashboard data for debugging
  console.log('Student Dashboard Data:', dashboardData);

  useEffect(() => {
    const fetchCourseApplications = async () => {
      try {
        const response = await courseService.getStudentApplications();
        setCourseApplications(response.data || []);
      } catch (error) {
        console.error('Error fetching course applications:', error);
      }
    };

    const fetchCertificates = async () => {
      try {
        setCertificatesLoading(true);
        const response = await certificateService.getStudentCertificates();
        setCertificates(response.data || []);
      } catch (error) {
        console.error('Error fetching certificates:', error);
      } finally {
        setCertificatesLoading(false);
      }
    };

    fetchCourseApplications();
    fetchCertificates();
  }, []);

  const handleDownloadCertificate = async (certificate) => {
    try {
      if (!certificate.filename) {
        alert('Certificate file not available for download.');
        return;
      }

      const response = await certificateService.downloadCertificate(certificate.filename);
      
      // Create a blob from the response data
      const blob = new Blob([response.data], { type: 'application/pdf' });
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = certificate.filename || 'certificate.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading certificate:', error);
      alert('Failed to download certificate. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600 mt-2">Here's your internship progress overview</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tasks Completed</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {dashboardData?.recentTasks?.filter(task => task.taskStatus === 'completed').length || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Performance Score</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {dashboardData?.performanceStats?.overallScore || 0}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Earned</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ${dashboardData?.earningsSummary?.totalEarned || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Certificates</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {dashboardData?.student?.performance?.certificates?.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Project */}
        {dashboardData?.student?.currentProject && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Project</h2>
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-medium text-gray-900">
                {dashboardData.student.currentProject.title}
              </h3>
              <p className="text-gray-600 mt-1">
                {dashboardData.student.currentProject.description}
              </p>
              <div className="flex items-center mt-3 space-x-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {dashboardData.student.currentProject.category}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {dashboardData.student.currentProject.difficulty}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Show logged-in student ID */}
        {dashboardData?.student?.studentId && (
          <div className="mb-4 text-sm text-blue-700 font-semibold">
            Student ID: {dashboardData.student.studentId}
          </div>
        )}
        {/* Recent Tasks */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Tasks</h2>
            <Link to="/student/tasks" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All Tasks
            </Link>
          </div>
          <div className="space-y-4">
            {dashboardData?.recentTasks?.length > 0 ? (
              dashboardData.recentTasks.map((task, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{task.taskTitle}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          task.taskStatus === 'completed' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {task.taskStatus === 'completed' ? 'Completed' : 'Pending'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-700 mb-2">
                        <span className="font-medium">Description:</span> {task.projectDescription}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div><span className="font-medium">Assigned by:</span> {task.assignedBy}</div>
                        <div><span className="font-medium">Assigned on:</span> {new Date(task.assignedAt).toLocaleDateString()}</div>
                        {task.completedAt && (
                          <div><span className="font-medium">Completed on:</span> {new Date(task.completedAt).toLocaleDateString()}</div>
                        )}
                        {task.feedback && (
                          <div className="md:col-span-2">
                            <span className="font-medium">Feedback:</span> {task.feedback}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks assigned yet</h3>
                <p className="mt-1 text-sm text-gray-500">Your admin will assign tasks to you here.</p>
              </div>
            )}
          </div>
        </div>

        

       
        {/* Certificate Preview Section */}
        {certificates.length > 0 && certificates.some(cert => cert.filename) && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Certificate Preview</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {certificates.filter(cert => cert.filename).slice(0, 2).map((certificate, index) => (
                <div key={index} className="border-2 border-yellow-400 rounded-lg p-6 bg-gradient-to-br from-yellow-50 to-blue-50">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold tracking-wide text-gray-900 mb-1">CERTIFICATE</h3>
                    <div className="text-base font-semibold text-gray-700 mb-2">Of Achievement</div>
                    <div className="text-gray-700 mb-2">This Certificate is Proudly Presented To</div>
                    <div className="text-3xl font-bold text-blue-900 mb-2">{user?.name}</div>
                    <div className="text-gray-700 mb-2">
                      for successfully completing the project/course
                      <span className="font-semibold text-blue-800"> "{certificate.course?.courseName || certificate.project?.title || certificate.title || 'Project'}"</span>
                    </div>
                    <div className="text-gray-600 mb-2">
                      at <span className="font-semibold">{certificate.student?.college || dashboardData?.student?.college || '-'}</span>
                    </div>
                    {certificate.project?.duration && (
                      <div className="text-gray-600 mb-2">
                        Duration: <span className="font-semibold">{certificate.project.duration}</span>
                      </div>
                    )}
                    <div className="text-gray-600 mb-2">
                      Completion Date: <span className="font-semibold">{certificate.completionDate ? new Date(certificate.completionDate).toLocaleDateString() : '-'}</span>
                    </div>
                    <div className="text-gray-600 mb-2">
                      Certificate ID: <span className="font-semibold">{certificate.certificateId}</span>
                    </div>
                    <div className="text-gray-600 mb-2">
                      Issued By: <span className="font-semibold">Digitern Platform</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Certificates */}
      
        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Transactions</h2>
          <div className="space-y-4">
            {dashboardData?.earningsSummary?.recentTransactions?.map((transaction, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">{transaction.description}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(transaction.date).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-lg font-semibold text-green-600">
                  +${transaction.amount}
                </span>
              </div>
            ))}
            {(!dashboardData?.earningsSummary?.recentTransactions || dashboardData.earningsSummary.recentTransactions.length === 0) && (
              <p className="text-gray-500 text-center py-4">No recent transactions</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard; 