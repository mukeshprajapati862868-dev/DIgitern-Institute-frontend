import { apiService } from './api';

const studentService = {
  // Authentication
  login: (email, password) => 
    apiService.post('/student/login', { email, password }),

  register: (userData) => 
    apiService.post('/student/register', userData),

  // Profile
  getProfile: () => 
    apiService.get('/student/profile'),

  updateProfile: (userData) => 
    apiService.put('/student/profile', userData),

  // Resume
  uploadResume: (formData) => 
    apiService.upload('/student/resume', formData),

  // Projects
  getAvailableProjects: (params = {}) => 
    apiService.get('/student/projects', { params }),

  // Dashboard
  getDashboard: () => 
    apiService.get('/student/dashboard'),

  // Earnings
  getEarnings: () => 
    apiService.get('/student/earnings'),

  // Certificates
  getCertificates: () =>
    apiService.get('/certificates/student/me'),

  // NEW: Submit completed project for certificate
  submitProjectForCertificate: (formData) =>
    apiService.upload('/certificates/submit', formData),
};

export default studentService;
