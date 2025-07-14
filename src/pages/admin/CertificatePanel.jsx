import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import adminService from '../../services/adminService';

const CertificatePanel = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [actionType, setActionType] = useState(''); // 'approve' or 'reject'
  const [emailData, setEmailData] = useState({ email: '', subject: '', message: '' });
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllCertificates();
      setCertificates(response.data || []);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      toast.error('Failed to fetch certificates');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (certificateId) => {
    setSelectedCertificate(certificates.find(c => c._id === certificateId));
    setActionType('approve');
    setShowFeedbackModal(true);
  };

  const handleReject = async (certificateId) => {
    setSelectedCertificate(certificates.find(c => c._id === certificateId));
    setActionType('reject');
    setShowFeedbackModal(true);
  };

  const handleFeedbackSubmit = async () => {
    try {
      if (actionType === 'approve') {
        await adminService.approveCertificate(selectedCertificate._id, feedback);
        toast.success('Certificate approved successfully!');
      } else if (actionType === 'reject') {
        await adminService.rejectCertificate(selectedCertificate._id, feedback);
        toast.success('Certificate rejected');
      }
      
      setShowFeedbackModal(false);
      setFeedback('');
      await fetchCertificates();
    } catch (error) {
      console.error('Error updating certificate:', error);
      toast.error('Failed to update certificate');
    }
  };

  const generateCertificate = async (certificateId) => {
    try {
      await adminService.generateCertificatePDF(certificateId);
      toast.success('Certificate generated successfully!');
      await fetchCertificates();
    } catch (error) {
      console.error('Error generating certificate:', error);
      toast.error('Failed to generate certificate');
    }
  };

  const downloadCertificate = async (certificate) => {
    try {
      const response = await adminService.downloadCertificate(certificate.filename);
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = certificate.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download certificate');
    }
  };

  const sendEmail = async (certificate) => {
    setSelectedCertificate(certificate);
    setEmailData({
      email: certificate.student?.email || '',
      subject: `Certificate of Completion - ${certificate.project?.title}`,
      message: `Dear ${certificate.student?.name},\n\nCongratulations! Your certificate for the project "${certificate.project?.title}" has been approved and is ready for download.\n\nCertificate ID: ${certificate.certificateId}\n\nBest regards,\nDigitern Team`
    });
    setShowEmailModal(true);
  };

  const handleEmailSend = async () => {
    try {
      // Mock email sending
      console.log('Sending email:', emailData);
      toast.success('Email sent successfully!');
      setShowEmailModal(false);
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Error sending email');
    }
  };

  const verifyCertificate = (certificateId) => {
    // Mock certificate verification
    const certificate = certificates.find(cert => cert.certificateId === certificateId);
    if (certificate) {
      toast.success(`Certificate ${certificateId} is valid!\nStudent: ${certificate.student?.name}\nProject: ${certificate.project?.title}`);
    } else {
      toast.error('Certificate not found or invalid');
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
          <h1 className="text-3xl font-bold text-gray-900">Certificate Management</h1>
          <p className="text-gray-600 mt-2">Generate, approve, and manage student certificates</p>
        </div>

        {/* Certificate Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {certificates.filter(c => c.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {certificates.filter(c => c.status === 'approved').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Generated</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {certificates.filter(c => c.status === 'generated').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {certificates.filter(c => c.status === 'rejected').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Certificate List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Certificate Requests</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {certificates.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-500">No certificate requests</p>
              </div>
            ) : (
              certificates.map((certificate) => (
                <div key={certificate._id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{certificate.student?.name}</h3>
                          <p className="text-sm text-gray-600">{certificate.student?.email}</p>
                          <p className="text-sm text-gray-500">Project: {certificate.project?.title}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {certificate.project?.category}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {certificate.project?.difficulty}
                            </span>
                            <span className="text-xs text-gray-500">
                              ID: {certificate.certificateId}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        certificate.status === 'approved' 
                          ? 'bg-green-100 text-green-800'
                          : certificate.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : certificate.status === 'generated'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {certificate.status}
                      </span>
                      
                      {certificate.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApprove(certificate._id)}
                            className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors text-sm"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(certificate._id)}
                            className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors text-sm"
                          >
                            Reject
                          </button>
                        </div>
                      )}

                      {certificate.status === 'approved' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => generateCertificate(certificate._id)}
                            className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors text-sm"
                          >
                            Generate PDF
                          </button>
                        </div>
                      )}

                      {certificate.status === 'generated' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => downloadCertificate(certificate)}
                            className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors text-sm"
                          >
                            Download
                          </button>
                          <button
                            onClick={() => sendEmail(certificate)}
                            className="bg-purple-600 text-white px-3 py-1 rounded-md hover:bg-purple-700 transition-colors text-sm"
                          >
                            Email
                          </button>
                          <button
                            onClick={() => verifyCertificate(certificate.certificateId)}
                            className="bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-700 transition-colors text-sm"
                          >
                            Verify
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Certificate Verification */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Verify Certificate</h2>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Enter certificate ID"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const certificateId = e.target.value;
                  verifyCertificate(certificateId);
                }
              }}
            />
            <button 
              onClick={() => {
                const certificateId = document.querySelector('input[placeholder="Enter certificate ID"]').value;
                verifyCertificate(certificateId);
              }}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Verify
            </button>
          </div>
        </div>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Send Email</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">To:</label>
                  <input
                    type="email"
                    value={emailData.email}
                    onChange={(e) => setEmailData({...emailData, email: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Subject:</label>
                  <input
                    type="text"
                    value={emailData.subject}
                    onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Message:</label>
                  <textarea
                    rows="4"
                    value={emailData.message}
                    onChange={(e) => setEmailData({...emailData, message: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEmailSend}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Send Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {actionType === 'approve' ? 'Approve' : 'Reject'} Certificate
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Feedback (Optional):</label>
                  <textarea
                    rows="4"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder={`Enter feedback for ${actionType === 'approve' ? 'approval' : 'rejection'}...`}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowFeedbackModal(false);
                    setFeedback('');
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFeedbackSubmit}
                  className={`px-4 py-2 text-white rounded-md transition-colors ${
                    actionType === 'approve' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {actionType === 'approve' ? 'Approve' : 'Reject'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificatePanel; 