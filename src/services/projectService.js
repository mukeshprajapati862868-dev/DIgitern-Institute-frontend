import { apiService } from './api';

export const projectService = {
  // Project CRUD
  createProject: (projectData) => 
    apiService.post('/projects', projectData),

  getAllProjects: (params = {}) => 
    apiService.get('/projects', { params }),

  getProjectById: (id) => 
    apiService.get(`/projects/${id}`),

  updateProject: (id, projectData) => 
    apiService.put(`/projects/${id}`, projectData),

  // Project Management
  assignStudentToProject: (projectId, studentId, role) => 
    apiService.post(`/projects/${projectId}/assign`, { studentId, role }),

  getProjectAnalytics: (projectId) => 
    apiService.get(`/projects/${projectId}/analytics`),

  // Task Management
  createTask: (projectId, taskData) => 
    apiService.post(`/projects/${projectId}/tasks`, taskData),

  updateTask: (projectId, taskId, taskData) => 
    apiService.put(`/projects/${projectId}/tasks/${taskId}`, taskData),

  submitWork: (projectId, taskId, formData) => 
    apiService.upload(`/projects/${projectId}/tasks/${taskId}/submit`, formData),

  // Certificate Generation
  generateCertificate: (projectId, studentId) => 
    apiService.post(`/projects/${projectId}/certificate`, { studentId }),

  getRecentTasks: () => apiService.get('/projects/recent-tasks'),
}; 