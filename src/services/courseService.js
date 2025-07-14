import api from './api';

const courseService = {
  // Get all available courses
  getAllCourses: (params = {}) => {
    return api.get('/courses', { params });
  },

  // Get course by ID
  getCourseById: (courseId) => {
    return api.get(`/courses/${courseId}`);
  },

  // Apply for a course
  applyForCourse: (courseId) => {
    return api.post(`/courses/${courseId}/apply`);
  },

  // Get student's course applications
  getStudentApplications: () => {
    return api.get('/courses/applications/student');
  },

  // Admin: Create a new course
  createCourse: (courseData) => {
    return api.post('/courses', courseData);
  },

  // Admin: Update course
  updateCourse: (courseId, courseData) => {
    return api.put(`/courses/${courseId}`, courseData);
  },

  // Admin: Delete course
  deleteCourse: (courseId) => {
    return api.delete(`/courses/${courseId}`);
  },

  // Admin: Get all course applications
  getAllApplications: () => {
    return api.get('/courses/admin/applications');
  },

  // Admin: Update application status
  updateApplicationStatus: (applicationId, status, feedback = '') => {
    return api.put(`/courses/applications/${applicationId}`, { status, feedback });
  }
};

export default courseService; 