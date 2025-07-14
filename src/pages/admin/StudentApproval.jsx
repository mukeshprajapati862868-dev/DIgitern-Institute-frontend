import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminService } from '../../services/adminService';

const StudentApproval = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await adminService.getAllStudents({ status: 'pending' });
        setStudents(response.data.students || []);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleStatusUpdate = async (studentId, status) => {
    try {
      await adminService.updateStudentStatus(studentId, status);
      // Refresh the list
      const response = await adminService.getAllStudents({ status: 'pending' });
      setStudents(response.data.students || []);
    } catch (error) {
      console.error('Error updating student status:', error);
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Student Approvals</h1>
          <p className="text-gray-600 mt-2">Review and approve student applications</p>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Pending Approvals ({students.length})</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {students.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-500">No pending approvals</p>
              </div>
            ) : (
              students.map((student) => (
                <div key={student._id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-lg font-medium text-gray-600">
                          {student.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{student.name}</h3>
                        <p className="text-sm text-gray-600">{student.email}</p>
                        <p className="text-sm text-gray-500">
                          {student.college} - {student.course} (Year {student.year})
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStatusUpdate(student._id, 'approved')}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(student._id, 'rejected')}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentApproval; 