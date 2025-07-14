import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import certificateService from '../../services/certificateService';

const CertificateDownload = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verificationId, setVerificationId] = useState('');

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await certificateService.getStudentCertificates();
        setCertificates(response.data || []);
      } catch (error) {
        console.error('Error fetching certificates:', error);
        setCertificates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  const handleDownload = async (certificate) => {
    try {
      if (!certificate.filename) {
        alert('Certificate file not available for download.');
        return;
      }

      const response = await certificateService.downloadCertificate(certificate.filename);
      
      // Create a blob from the response data
      const blob = new Blob([response.data], { type: 'application/pdf' });
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = certificate.filename || 'certificate.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading certificate:', error);
      alert('Failed to download certificate. Please try again.');
    }
  };

  const verifyCertificate = async (certificateId) => {
    try {
      const response = await certificateService.verifyCertificate(certificateId);
      if (response.data.valid) {
        const cert = response.data.certificate;
        alert(`✅ Certificate ${certificateId} is valid!\n\nStudent: ${cert.student?.name}\nProject: ${cert.project?.title || cert.course?.courseName}\nStatus: ${cert.status}`);
      } else {
        alert('❌ Certificate not found or invalid');
      }
    } catch (error) {
      console.error('Error verifying certificate:', error);
      alert('❌ Certificate not found or invalid');
    }
  };

  const shareCertificate = (certificate) => {
    const projectTitle = certificate.project?.title || certificate.course?.courseName || 'Project';
    const shareText = `I just completed my internship project "${projectTitle}" and earned a certificate from Digitern! Certificate ID: ${certificate.certificateId}`;
    const shareUrl = certificate.verificationUrl || `${window.location.origin}/verify/${certificate.certificateId}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Digitern Certificate',
        text: shareText,
        url: shareUrl
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(`${shareText}\n\nVerify at: ${shareUrl}`);
      alert('Certificate details copied to clipboard!');
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Certificates</h1>
          <p className="text-gray-600 mt-2">Download and manage your earned certificates</p>
        </div>

        {/* Certificate Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-semibold text-gray-900">{certificates.length}</p>
              </div>
            </div>
          </div>
        </div>

        {certificates.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No certificates yet</h3>
            <p className="text-gray-600 mb-6">
              Complete your internship projects to earn certificates
            </p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Browse Projects
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map((certificate, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                {/* Certificate Preview Section */}
                <div className="border-2 border-yellow-400 rounded-lg p-6 mb-6 bg-gradient-to-br from-yellow-50 to-blue-50">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold tracking-wide text-gray-900 mb-1">CERTIFICATE</h2>
                    <div className="text-base font-semibold text-gray-700 mb-2">Of Achievement</div>
                    <div className="text-gray-700 mb-2">This Certificate is Proudly Presented To</div>
                    <div className="text-3xl font-signature text-blue-900 font-bold mb-2">{certificate.student?.name || user?.name}</div>
                    <div className="text-gray-700 mb-2">
                      for successfully completing the project/course
                      <span className="font-semibold text-blue-800"> "{certificate.project?.title || certificate.course?.courseName || certificate.title || 'Project'}"</span>
                    </div>
                    <div className="text-gray-600 mb-2">
                      at <span className="font-semibold">{certificate.student?.college || '-'}</span>
                    </div>
                    <div className="text-gray-600 mb-2">
                      Duration: <span className="font-semibold">{certificate.project?.duration || '-'}</span>
                    </div>
                    <div className="text-gray-600 mb-2">
                      Completion Date: <span className="font-semibold">{certificate.completionDate ? new Date(certificate.completionDate).toLocaleDateString() : '-'}</span>
                    </div>
                    <div className="text-gray-600 mb-2">
                      Certificate ID: <span className="font-semibold">{certificate.certificateId}</span>
                    </div>
                    <div className="text-gray-600 mb-2">
                      Issued By: <span className="font-semibold">Digitern Platform</span>
                    </div>
                  </div>
                </div>
                {/* End Certificate Preview Section */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        {certificate.project?.title || certificate.course?.courseName || certificate.title || 'Certificate'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {certificate.project?.category || certificate.course?.courseName || 'Course'}
                      </p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    certificate.status === 'approved' 
                      ? 'bg-green-100 text-green-800'
                      : certificate.status === 'generated'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {certificate.status}
                  </span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Certificate ID:</span>
                    <span className="font-medium">{certificate.certificateId}</span>
                  </div>
                  {certificate.project?.difficulty && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Difficulty:</span>
                      <span className="font-medium">{certificate.project.difficulty}</span>
                    </div>
                  )}
                  {certificate.completionDate && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Completed:</span>
                      <span className="font-medium">
                        {new Date(certificate.completionDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {certificate.issueDate && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Issued:</span>
                      <span className="font-medium">
                        {new Date(certificate.issueDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {certificate.createdAt && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Created:</span>
                      <span className="font-medium">
                        {new Date(certificate.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {certificate.project?.category && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Category:</h4>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {certificate.project.category}
                    </span>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleDownload(certificate)}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                    disabled={!certificate.filename}
                  >
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {certificate.filename ? 'Download' : 'Not Available'}
                  </button>
                  <button
                    onClick={() => verifyCertificate(certificate.certificateId)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => shareCertificate(certificate)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Certificate Verification */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Verify Certificate</h2>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Enter certificate ID"
              value={verificationId}
              onChange={(e) => setVerificationId(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  verifyCertificate(verificationId);
                }
              }}
            />
            <button 
              onClick={() => verifyCertificate(verificationId)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Verify
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateDownload; 