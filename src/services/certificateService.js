import api from './api';

const certificateService = {
  // Get certificates for logged-in student
  getStudentCertificates: async () => {
    try {
      const response = await api.get('/certificates/student/me');
      return response;
    } catch (error) {
      console.error('Error fetching student certificates:', error);
      throw error;
    }
  },

  // Get certificate by ID
  getCertificateById: async (certificateId) => {
    try {
      const response = await api.get(`/certificates/${certificateId}`);
      return response;
    } catch (error) {
      console.error('Error fetching certificate:', error);
      throw error;
    }
  },

  // Download certificate
  downloadCertificate: async (certificateId) => {
    try {
      const response = await api.get(`/certificates/download/${certificateId}`, {
        responseType: 'blob'
      });
      return response;
    } catch (error) {
      console.error('Error downloading certificate:', error);
      throw error;
    }
  },

  // Verify certificate (public)
  verifyCertificate: async (certificateId) => {
    try {
      const response = await api.get(`/certificates/verify/${certificateId}`);
      return response;
    } catch (error) {
      console.error('Error verifying certificate:', error);
      throw error;
    }
  },

  // Submit project for certificate (student only)
  submitProjectForCertificate: async (projectData) => {
    try {
      const formData = new FormData();
      formData.append('projectId', projectData.projectId);
      formData.append('description', projectData.description);
      
      if (projectData.files) {
        projectData.files.forEach(file => {
          formData.append('files', file);
        });
      }

      const response = await api.post('/certificates/submit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response;
    } catch (error) {
      console.error('Error submitting project for certificate:', error);
      throw error;
    }
  }
};

export default certificateService; 