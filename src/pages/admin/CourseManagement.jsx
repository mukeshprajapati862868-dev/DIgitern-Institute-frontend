import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import courseService from '../../services/courseService';

const CourseManagement = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('courses');
  const [courses, setCourses] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [feedback, setFeedback] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    duration: '',
    difficulty: '',
    skills: '',
    prerequisites: '',
    maxStudents: 50
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [coursesRes, applicationsRes] = await Promise.all([
        courseService.getAllCourses(),
        courseService.getAllApplications()
      ]);
      
      setCourses(coursesRes.data.courses || []);
      setApplications(applicationsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const courseData = {
        ...formData,
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill),
        prerequisites: formData.prerequisites.split(',').map(prereq => prereq.trim()).filter(prereq => prereq)
      };

      await courseService.createCourse(courseData);
      setShowCreateForm(false);
      setFormData({
        name: '',
        description: '',
        category: '',
        duration: '',
        difficulty: '',
        skills: '',
        prerequisites: '',
        maxStudents: 50
      });
      fetchData();
      alert('Course created successfully!');
    } catch (error) {
      console.error('Error creating course:', error);
      alert(error.response?.data?.message || 'Failed to create course');
    }
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    try {
      const courseData = {
        ...formData,
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill),
        prerequisites: formData.prerequisites.split(',').map(prereq => prereq.trim()).filter(prereq => prereq)
      };

      await courseService.updateCourse(editingCourse._id, courseData);
      setEditingCourse(null);
      setFormData({
        name: '',
        description: '',
        category: '',
        duration: '',
        difficulty: '',
        skills: '',
        prerequisites: '',
        maxStudents: 50
      });
      fetchData();
      alert('Course updated successfully!');
    } catch (error) {
      console.error('Error updating course:', error);
      alert(error.response?.data?.message || 'Failed to update course');
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await courseService.deleteCourse(courseId);
        fetchData();
        alert('Course deleted successfully!');
      } catch (error) {
        console.error('Error deleting course:', error);
        alert(error.response?.data?.message || 'Failed to delete course');
      }
    }
  };

  const handleApplicationStatus = async (applicationId, status) => {
    try {
      await courseService.updateApplicationStatus(applicationId, status, feedback);
      setFeedback('');
      fetchData();
      alert(`Application ${status} successfully!`);
    } catch (error) {
      console.error('Error updating application status:', error);
      alert(error.response?.data?.message || 'Failed to update application status');
    }
  };

  const editCourse = (course) => {
    setEditingCourse(course);
    setFormData({
      name: course.name,
      description: course.description,
      category: course.category,
      duration: course.duration,
      difficulty: course.difficulty,
      skills: course.skills?.join(', ') || '',
      prerequisites: course.prerequisites?.join(', ') || '',
      maxStudents: course.maxStudents
    });
  };

  const cancelEdit = () => {
    setEditingCourse(null);
    setFormData({
      name: '',
      description: '',
      category: '',
      duration: '',
      difficulty: '',
      skills: '',
      prerequisites: '',
      maxStudents: 50
    });
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
          <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
          <p className="text-gray-600 mt-2">Manage courses and review applications</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('courses')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'courses'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Courses ({courses.length})
              </button>
              <button
                onClick={() => setActiveTab('applications')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'applications'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Applications ({applications.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'courses' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-medium text-gray-900">All Courses</h2>
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create New Course
                  </button>
                </div>

                {/* Create/Edit Course Form */}
                {(showCreateForm || editingCourse) && (
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      {editingCourse ? 'Edit Course' : 'Create New Course'}
                    </h3>
                    <form onSubmit={editingCourse ? handleUpdateCourse : handleCreateCourse}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Course Name
                          </label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                          </label>
                          <select
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select Category</option>
                            <option value="Web Development">Web Development</option>
                            <option value="Mobile Development">Mobile Development</option>
                            <option value="Data Science">Data Science</option>
                            <option value="AI/ML">AI/ML</option>
                            <option value="DevOps">DevOps</option>
                            <option value="Cybersecurity">Cybersecurity</option>
                            <option value="UI/UX">UI/UX</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Duration
                          </label>
                          <input
                            type="text"
                            value={formData.duration}
                            onChange={(e) => setFormData({...formData, duration: e.target.value})}
                            placeholder="e.g., 8 weeks"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Difficulty
                          </label>
                          <select
                            value={formData.difficulty}
                            onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select Difficulty</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Max Students
                          </label>
                          <input
                            type="number"
                            value={formData.maxStudents}
                            onChange={(e) => setFormData({...formData, maxStudents: parseInt(e.target.value)})}
                            min="1"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                          </label>
                          <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            required
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Skills (comma-separated)
                          </label>
                          <input
                            type="text"
                            value={formData.skills}
                            onChange={(e) => setFormData({...formData, skills: e.target.value})}
                            placeholder="e.g., React, Node.js, MongoDB"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Prerequisites (comma-separated)
                          </label>
                          <input
                            type="text"
                            value={formData.prerequisites}
                            onChange={(e) => setFormData({...formData, prerequisites: e.target.value})}
                            placeholder="e.g., Basic JavaScript, HTML/CSS"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-3 mt-6">
                        <button
                          type="button"
                          onClick={editingCourse ? cancelEdit : () => setShowCreateForm(false)}
                          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          {editingCourse ? 'Update Course' : 'Create Course'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Courses List */}
                <div className="space-y-4">
                  {courses.map((course) => (
                    <div key={course._id} className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-medium text-gray-900">{course.name}</h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              course.difficulty === 'Beginner' 
                                ? 'bg-green-100 text-green-800'
                                : course.difficulty === 'Intermediate'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {course.difficulty}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {course.category}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              course.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {course.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          
                          <p className="text-gray-600 mb-3">{course.description}</p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-700">Duration:</span>
                              <p className="text-gray-600">{course.duration}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Skills:</span>
                              <p className="text-gray-600">{course.skills?.join(', ') || 'N/A'}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Prerequisites:</span>
                              <p className="text-gray-600">{course.prerequisites?.join(', ') || 'None'}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Enrollment:</span>
                              <p className="text-gray-600">{course.currentEnrollment}/{course.maxStudents}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="ml-6 flex space-x-2">
                          <button
                            onClick={() => editCourse(course)}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course._id)}
                            className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'applications' && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-6">Course Applications</h2>
                
                <div className="space-y-4">
                  {applications.map((application) => (
                    <div key={application._id} className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-medium text-gray-900">{application.courseName}</h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              application.status === 'approved' 
                                ? 'bg-green-100 text-green-800'
                                : application.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {application.status}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                            <div>
                              <span className="font-medium text-gray-700">Student:</span>
                              <p className="text-gray-600">{application.studentName}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Email:</span>
                              <p className="text-gray-600">{application.studentEmail}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">College:</span>
                              <p className="text-gray-600">{application.college}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Applied:</span>
                              <p className="text-gray-600">{new Date(application.appliedAt).toLocaleDateString()}</p>
                            </div>
                          </div>

                          {application.feedback && (
                            <div className="bg-gray-50 rounded p-3 mb-3">
                              <span className="font-medium text-gray-700">Feedback:</span>
                              <p className="text-gray-600">{application.feedback}</p>
                            </div>
                          )}
                        </div>
                        
                        {application.status === 'pending' && (
                          <div className="ml-6 flex flex-col space-y-2">
                            <textarea
                              value={feedback}
                              onChange={(e) => setFeedback(e.target.value)}
                              placeholder="Add feedback (optional)"
                              className="w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              rows="3"
                            />
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleApplicationStatus(application._id, 'approved')}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleApplicationStatus(application._id, 'rejected')}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseManagement; 