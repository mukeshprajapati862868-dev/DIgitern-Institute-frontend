import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Search, Filter, CheckCircle, XCircle, Eye, Download } from 'lucide-react';
import adminService from '../../services/adminService';

const CourseApproval = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [studentsRes, applicationsRes] = await Promise.all([
        adminService.getAllStudents(),
        adminService.getAllCourseApplications()
      ]);
      
      setStudents(studentsRes.data?.students || []);
      setApplications(applicationsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, status, feedback = '') => {
    try {
      setProcessing(true);
      await adminService.updateCourseApplicationStatus(applicationId, status, feedback);
      
      // Refresh data
      await fetchData();
      
      toast.success(`Application ${status} successfully`);
    } catch (error) {
      console.error('Error updating application status:', error);
      toast.error(error.response?.data?.message || 'Failed to update application status');
    } finally {
      setProcessing(false);
    }
  };

  const getStudentDetails = (studentId) => {
    return students.find(student => student._id === studentId);
  };

  const filteredApplications = applications.filter(application => {
    const student = getStudentDetails(application.student);
    const matchesSearch = 
      student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.courseName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || application.status === statusFilter;
    const matchesCourse = !courseFilter || application.courseName === courseFilter;
    
    return matchesSearch && matchesStatus && matchesCourse;
  });

  const getStatusCount = (status) => {
    return applications.filter(app => app.status === status).length;
  };

  const uniqueCourses = [...new Set(applications.map(app => app.courseName))];

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
          <h1 className="text-3xl font-bold text-gray-900">Course Application Management</h1>
          <p className="text-gray-600 mt-2">Review and approve student course applications</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-semibold text-gray-900">{applications.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Eye className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">{getStatusCount('pending')}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-semibold text-gray-900">{getStatusCount('approved')}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-semibold text-gray-900">{getStatusCount('rejected')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="inline h-4 w-4 mr-1" />
                Search
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by student name, email, or course..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="inline h-4 w-4 mr-1" />
                Status
              </label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">
                Course
              </label>
              <select
                id="course"
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Courses</option>
                {uniqueCourses.map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchData}
                disabled={loading}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Refresh'}
              </button>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Course Applications ({filteredApplications.length})
            </h2>
          </div>
          
          {filteredApplications.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No applications found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredApplications.map((application) => {
                const student = getStudentDetails(application.student);
                
                return (
                  <div key={application._id} className="px-6 py-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-3">
                          <h3 className="text-xl font-semibold text-gray-900">{application.courseName}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            application.status === 'approved' 
                              ? 'bg-green-100 text-green-800'
                              : application.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {application.status === 'pending' ? 'Pending Approval' : application.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                          <div>
                            <span className="font-medium text-gray-700">Student:</span>
                            <p className="text-gray-600">{student?.name || 'Unknown'}</p>
                            <p className="text-gray-500">{student?.email || 'No email'}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">College:</span>
                            <p className="text-gray-600">{student?.college || 'Not specified'}</p>
                            <p className="text-gray-500">{student?.course} (Year {student?.year})</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Applied On:</span>
                            <p className="text-gray-600">{new Date(application.appliedAt).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Student ID:</span>
                            <p className="text-gray-600">{student?.studentId || 'Not assigned'}</p>
                          </div>
                        </div>

                        {application.feedback && (
                          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-900">Feedback:</p>
                            <p className="text-sm text-gray-600">{application.feedback}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-6 flex flex-col items-end space-y-2">
                        {application.status === 'pending' && (
                          <>
                            <button
                              onClick={() => {
                                const feedback = prompt('Enter approval feedback (optional):');
                                handleStatusUpdate(application._id, 'approved', feedback);
                              }}
                              disabled={processing}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                const feedback = prompt('Enter rejection feedback (optional):');
                                handleStatusUpdate(application._id, 'rejected', feedback);
                              }}
                              disabled={processing}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </button>
                          </>
                        )}
                        
                        {application.status === 'approved' && (
                          <div className="flex flex-col space-y-2">
                            <span className="inline-flex items-center px-3 py-1 border border-green-300 text-sm font-medium rounded-md text-green-700 bg-green-50">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approved
                            </span>
                            <button
                              onClick={() => window.open(`/admin/certificate-upload?studentId=${application.student}&courseName=${application.courseName}`, '_blank')}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Upload Certificate
                            </button>
                          </div>
                        )}
                        
                        {application.status === 'rejected' && (
                          <span className="inline-flex items-center px-3 py-1 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50">
                            <XCircle className="h-4 w-4 mr-1" />
                            Rejected
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseApproval; 