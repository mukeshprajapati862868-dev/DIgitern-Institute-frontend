import { apiService } from './api';

export const taskService = {
  // Admin functions
  assignTask: (taskData) =>
    apiService.post('/tasks/assign', taskData),

  getAllTasks: () =>
    apiService.get('/tasks'),

  downloadTaskFile: (taskId) =>
    apiService.get(`/tasks/${taskId}/download`, { responseType: 'blob' }),

  // Student functions
  getStudentTasks: () =>
    apiService.get('/tasks/student/me'),

  submitTask: (taskId, formData) =>
    apiService.put(`/tasks/${taskId}/submit`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  // Common functions
  getTaskById: (taskId) =>
    apiService.get(`/tasks/${taskId}`)
};

export default taskService; 