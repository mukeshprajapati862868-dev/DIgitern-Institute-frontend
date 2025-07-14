import { apiService } from './api';

export const adminService = {
  // ✅ Authentication
  login: (email, password) =>
    apiService.post('/admin/login', { email, password }),

  register: (userData) =>
    apiService.post('/admin/register', userData),

  // ✅ Profile
  getProfile: () =>
    apiService.get('/admin/profile'),

  updateProfile: (userData) =>
    apiService.put('/admin/profile', userData),

  // ✅ Student Management
  getAllStudents: (params = {}) =>
    apiService.get('/admin/students', { params }),

  getStudentById: (id) =>
    apiService.get(`/admin/students/${id}`),

  updateStudentStatus: (id, status) =>
    apiService.put(`/admin/students/${id}/status`, { internshipStatus: status }),

  // ✅ Bulk Student Registration
  bulkRegisterStudents: (studentsData) =>
    apiService.post('/admin/students/bulk-register', studentsData),

  // ✅ Project Management
  getAllProjects: (params = {}) =>
    apiService.get('/admin/projects', { params }),

  // ✅ Certificate Management
  generateCertificate: (certificateData) =>
    apiService.post('/admin/certificates/generate', certificateData),

  getAllCertificates: () =>
    apiService.get('/certificates'),

  downloadCertificate: (filename) =>
    apiService.get(`/certificates/download/${filename}`, { responseType: 'blob' }),

  approveCertificate: (id, feedback) =>
    apiService.put(`/certificates/${id}/approve`, { feedback }),

  rejectCertificate: (id, feedback) =>
    apiService.put(`/certificates/${id}/reject`, { feedback }),

  generateCertificatePDF: (id) =>
    apiService.post(`/certificates/${id}/generate`),

  uploadCertificate: (formData) =>
    apiService.post('/certificates/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  uploadCertificateWithDetails: (formData) =>
    apiService.post('/certificates/upload-with-details', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  getApprovedStudents: () =>
    apiService.get('/certificates/students/approved'),

  // ✅ Dashboard
  getDashboardStats: () =>
    apiService.get('/admin/dashboard'),

  // ✅ Course Application Management
  getAllCourseApplications: () =>
    apiService.get('/courses/applications'),

  updateCourseApplicationStatus: (applicationId, status, feedback) =>
    apiService.put(`/courses/applications/${applicationId}/status`, { status, feedback }),

  // ✅ Admin Management
  getAllAdmins: () =>
    apiService.get('/admin/admins'),

  updateAdminPermissions: (id, permissions) =>
    apiService.put(`/admin/admins/${id}/permissions`, permissions),
};

// ✅ Default export
export default adminService;
