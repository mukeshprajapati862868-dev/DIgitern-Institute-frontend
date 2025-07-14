import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import taskService from '../../services/taskService';

const TaskManagement = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskService.getAllTasks();
      setTasks(response.data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadFile = async (taskId, filename) => {
    try {
      const response = await taskService.downloadTaskFile(taskId);
      
      // Create a blob from the response data
      const blob = new Blob([response.data]);
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file. Please try again.');
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'completed') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Completed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        Pending
      </span>
    );
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
          <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
          <p className="text-gray-600 mt-2">View and manage all assigned tasks</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Tasks Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Tasks</h2>
            <p className="text-sm text-gray-600 mt-1">
              Total Tasks: {tasks.length} | 
              Completed: {tasks.filter(task => task.status === 'completed').length} | 
              Pending: {tasks.filter(task => task.status === 'pending').length}
            </p>
          </div>
          
          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks found</h3>
              <p className="mt-1 text-sm text-gray-500">Start by assigning tasks to students.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Task Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submission
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tasks.map((task) => (
                    <tr key={task._id} className="hover:bg-gray-50">
                      {/* Student Info */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {task.studentId?.name || 'Unknown Student'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {task.studentId?.studentId || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {task.studentId?.email || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Task Details */}
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {task.taskTitle}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {task.description}
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                          Assigned: {new Date(task.assignedAt).toLocaleDateString()}
                        </div>
                        {task.completedAt && (
                          <div className="text-sm text-green-600 mt-1">
                            Completed: {new Date(task.completedAt).toLocaleDateString()}
                          </div>
                        )}
                      </td>

                      {/* Assigned By */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {task.assignedBy?.name || 'Unknown Admin'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {task.assignedBy?.email || 'N/A'}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(task.status)}
                      </td>

                      {/* Submission File */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {task.submissionFile ? (
                          <div className="text-sm text-gray-900">
                            <div className="font-medium">{task.submissionFile.originalName}</div>
                            {task.feedback && (
                              <div className="text-gray-500 mt-1">
                                Feedback: {task.feedback}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">No submission</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {task.submissionFile && (
                          <button
                            onClick={() => handleDownloadFile(task._id, task.submissionFile.originalName)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Download
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskManagement; 