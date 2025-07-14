import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import taskService from '../../services/taskService';

const MyTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [selectedTask, setSelectedTask] = useState(null);
  const [submissionData, setSubmissionData] = useState({
    file: null,
    feedback: ''
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskService.getStudentTasks();
      setTasks(response.data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSubmissionData(prev => ({
      ...prev,
      file: file
    }));
  };

  const handleFeedbackChange = (e) => {
    setSubmissionData(prev => ({
      ...prev,
      feedback: e.target.value
    }));
  };

  const handleSubmitTask = async (e) => {
    e.preventDefault();
    
    if (!submissionData.file) {
      setError('Please select a file to upload');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      setMessage('');

      const formData = new FormData();
      formData.append('submission', submissionData.file);
      if (submissionData.feedback) {
        formData.append('feedback', submissionData.feedback);
      }

      await taskService.submitTask(selectedTask._id, formData);
      
      setMessage('Task submitted successfully!');
      setSelectedTask(null);
      setSubmissionData({ file: null, feedback: '' });
      
      // Refresh tasks list
      fetchTasks();
    } catch (error) {
      console.error('Error submitting task:', error);
      setError(error.response?.data?.message || 'Failed to submit task');
    } finally {
      setSubmitting(false);
    }
  };

  const openSubmissionModal = (task) => {
    setSelectedTask(task);
    setSubmissionData({ file: null, feedback: '' });
    setError('');
    setMessage('');
  };

  const closeSubmissionModal = () => {
    setSelectedTask(null);
    setSubmissionData({ file: null, feedback: '' });
    setError('');
    setMessage('');
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
          <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
          <p className="text-gray-600 mt-2">View and submit your assigned tasks</p>
        </div>

        {/* Success/Error Messages */}
        {message && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks assigned</h3>
              <p className="mt-1 text-sm text-gray-500">You don't have any tasks assigned yet.</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div key={task._id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{task.taskTitle}</h3>
                  {getStatusBadge(task.status)}
                </div>
                
                <p className="text-gray-600 mb-4">{task.description}</p>
                
                <div className="space-y-2 text-sm text-gray-500 mb-4">
                  <div>Assigned by: {task.assignedBy?.name || 'Unknown Admin'}</div>
                  <div>Assigned on: {new Date(task.assignedAt).toLocaleDateString()}</div>
                  {task.completedAt && (
                    <div className="text-green-600">
                      Completed on: {new Date(task.completedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>

                {task.submissionFile && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
                    <div className="text-sm font-medium text-green-800">Submitted File:</div>
                    <div className="text-sm text-green-700">{task.submissionFile.originalName}</div>
                    {task.feedback && (
                      <div className="text-sm text-green-600 mt-1">
                        Your feedback: {task.feedback}
                      </div>
                    )}
                  </div>
                )}

                {task.status === 'pending' && (
                  <button
                    onClick={() => openSubmissionModal(task)}
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Submit Task
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {/* Submission Modal */}
        {selectedTask && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Submit Task: {selectedTask.taskTitle}
                </h3>
                
                <form onSubmit={handleSubmitTask} className="space-y-4">
                  <div>
                    <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                      Upload File *
                    </label>
                    <input
                      type="file"
                      id="file"
                      onChange={handleFileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
                      Feedback (Optional)
                    </label>
                    <textarea
                      id="feedback"
                      value={submissionData.feedback}
                      onChange={handleFeedbackChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Add any feedback or comments about the task..."
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={closeSubmissionModal}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Submitting...' : 'Submit Task'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTasks; 