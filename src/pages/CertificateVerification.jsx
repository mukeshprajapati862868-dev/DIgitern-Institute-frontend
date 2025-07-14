import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const CertificateVerification = () => {
  const { certificateId } = useParams();
  const navigate = useNavigate();
  const [verificationId, setVerificationId] = useState(certificateId || '');
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const verifyCertificate = async (id) => {
    if (!id.trim()) {
      setError('Please enter a certificate ID');
      return;
    }

    setLoading(true);
    setError('');
    setCertificate(null);

    try {
      const response = await api.get(`/certificates/verify/${id}`);
      setCertificate(response.data);
    } catch (error) {
      console.error('Verification error:', error);
      setError(error.response?.data?.message || 'Certificate not found or invalid');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    verifyCertificate(verificationId);
  };

  // Auto-verify if certificateId is provided in URL
  React.useEffect(() => {
    if (certificateId) {
      verifyCertificate(certificateId);
    }
  }, [certificateId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Certificate Verification</h1>
          <p className="text-xl text-gray-600">
            Verify the authenticity of certificates issued by Digitern
          </p>
        </div>

        {/* Verification Form */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="mb-6">
              <label htmlFor="certificateId" className="block text-sm font-medium text-gray-700 mb-2">
                Certificate ID
              </label>
              <input
                type="text"
                id="certificateId"
                value={verificationId}
                onChange={(e) => setVerificationId(e.target.value)}
                placeholder="Enter certificate ID (e.g., CERT-123456)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                loading
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {loading ? 'Verifying...' : 'Verify Certificate'}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-red-800">Verification Failed</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Certificate Details */}
        {certificate && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-green-800 mb-2">Certificate Verified</h2>
              <p className="text-green-600">This certificate is authentic and valid</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Student Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Student Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Name:</span>
                    <p className="text-gray-900">{certificate.student.name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Student ID:</span>
                    <p className="text-gray-900">{certificate.student.studentId}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">College:</span>
                    <p className="text-gray-900">{certificate.student.college}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Course:</span>
                    <p className="text-gray-900">{certificate.student.course}</p>
                  </div>
                </div>
              </div>

              {/* Certificate Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Certificate Details</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Certificate ID:</span>
                    <p className="text-gray-900 font-mono">{certificate.certificateId}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Title:</span>
                    <p className="text-gray-900">{certificate.title}</p>
                  </div>
                  {certificate.project && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Project:</span>
                      <p className="text-gray-900">{certificate.project.title}</p>
                    </div>
                  )}
                  {certificate.course && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Course:</span>
                      <p className="text-gray-900">{certificate.course.courseName}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-sm font-medium text-gray-500">Completion Date:</span>
                    <p className="text-gray-900">
                      {new Date(certificate.completionDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Issue Date:</span>
                    <p className="text-gray-900">
                      {new Date(certificate.issueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Status:</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      certificate.status === 'generated' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {certificate.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification URL */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Verification URL:</strong> {window.location.href}
              </p>
            </div>

            {/* Download Link */}
            {certificate.filename && (
              <div className="mt-6 text-center">
                <a
                  href={`/api/certificates/download/${certificate.filename}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Certificate
                </a>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">How to Verify a Certificate</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Enter Certificate ID</h4>
              <p className="text-sm text-gray-600">
                Find the certificate ID on the certificate document
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Click Verify</h4>
              <p className="text-sm text-gray-600">
                Submit the form to check certificate authenticity
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">View Results</h4>
              <p className="text-sm text-gray-600">
                See detailed certificate information and status
              </p>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default CertificateVerification; 