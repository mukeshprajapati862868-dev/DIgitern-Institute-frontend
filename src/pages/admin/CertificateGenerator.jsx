import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Download, Search, RefreshCw, CheckCircle } from 'lucide-react';
import adminService from '../../services/adminService';

const CertificateGenerator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [approvedCertificates, setApprovedCertificates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingData, setIsLoadingData] = useState(true);
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    const loadData = async () => {
      setIsLoadingData(true);
      try {
        await Promise.all([
          fetchStudents(),
          fetchProjects(),
          fetchCertificates(),
          fetchApprovedCertificates()
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await adminService.getAllStudents();
      const approvedStudents = (response.data || []).filter(
        (student) => student.internshipStatus === 'approved' || student.internshipStatus === 'active'
      );
      setStudents(approvedStudents);
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([]);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await adminService.getAllProjects();
      setProjects(response.data?.projects || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    }
  };

  const fetchCertificates = async () => {
    try {
      const response = await adminService.getAllCertificates();
      setCertificates(response.data || []);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      setCertificates([]);
    }
  };

  const fetchApprovedCertificates = async () => {
    try {
      const response = await adminService.getAllCertificates();
      const approvedCerts = (response.data || []).filter(
        (cert) => cert.status === 'approved'
      );
      setApprovedCertificates(approvedCerts);
    } catch (error) {
      console.error('Error fetching approved certificates:', error);
      setApprovedCertificates([]);
    }
  };

  const autoFillCertificateData = (certificate) => {
    setValue('studentId', certificate.student?._id || certificate.student);
    setValue('projectId', certificate.project?._id || certificate.project);
    setValue('completionDate', certificate.completionDate ? 
      new Date(certificate.completionDate).toISOString().split('T')[0] : 
      new Date().toISOString().split('T')[0]
    );
    toast.success('Certificate data auto-filled!');
  };

  const generateCertificatePDF = async (certificateId) => {
    try {
      await adminService.generateCertificatePDF(certificateId);
      toast.success('Certificate PDF generated successfully!');
      await fetchApprovedCertificates();
    } catch (error) {
      console.error('Error generating certificate PDF:', error);
      toast.error('Failed to generate certificate PDF');
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // First create certificate
      const certificateResponse = await adminService.generateCertificate({
        studentId: data.studentId,
        projectId: data.projectId,
        completionDate: data.completionDate
      });
      
      // Then automatically generate PDF
      if (certificateResponse.data?._id) {
        await adminService.generateCertificatePDF(certificateResponse.data._id);
        toast.success('Certificate created and PDF generated successfully!');
      } else {
        toast.success('Certificate generated successfully!');
      }
      
      reset();
      await fetchCertificates();
      await fetchApprovedCertificates();
    } catch (error) {
      console.error('Certificate generation error:', error);
      toast.error(error.response?.data?.message || 'Failed to generate certificate');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadCertificate = async (certificate) => {
    try {
      const filename = certificate.filename || `certificate_${certificate.certificateId}.pdf`;
      const response = await adminService.downloadCertificate(filename);
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download certificate');
    }
  };

  const filteredCertificates = Array.isArray(certificates) ? certificates.filter(student =>
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.college?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Approved Certificates Section */}
        {approvedCertificates.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center mb-4">
              <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">Approved Certificates Ready for Generation</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {approvedCertificates.map((certificate) => (
                <div key={certificate._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">
                      {certificate.student?.name || 'Student Name'}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {certificate.certificateId}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {certificate.project?.title || 'Project Title'}
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => autoFillCertificateData(certificate)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      Auto-Fill
                    </button>
                    <button
                      onClick={() => generateCertificatePDF(certificate._id)}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                    >
                      Generate PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certificate Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Student Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Student</label>
                <select
                  {...register('studentId', { required: 'Student is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                >
                  <option value="">Select Student</option>
                  {students.map((student) => (
                    <option key={student._id} value={student._id}>
                      {student.name} - {student.studentId}
                    </option>
                  ))}
                </select>
                {errors.studentId && <p className="mt-1 text-sm text-red-600">{errors.studentId.message}</p>}
              </div>

              {/* Project Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Project</label>
                <select
                  {...register('projectId', { required: 'Project is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                >
                  <option value="">Select Project</option>
                  {projects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.title} - {project.category}
                    </option>
                  ))}
                </select>
                {errors.projectId && <p className="mt-1 text-sm text-red-600">{errors.projectId.message}</p>}
              </div>

              {/* Completion Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Completion Date</label>
                <input
                  type="date"
                  {...register('completionDate', { required: 'Completion date is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
                {errors.completionDate && <p className="mt-1 text-sm text-red-600">{errors.completionDate.message}</p>}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Generating...' : 'Generate Certificate'}
              </button>
            </div>
          </form>
        </div>

        {/* Certificate Table */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">All Certificates</h2>
              {!isLoadingData && (
                <p className="text-sm text-gray-500 mt-1">
                  {filteredCertificates.length} of {certificates.length} certificates shown
                  {searchTerm && ` for "${searchTerm}"`}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  setIsLoadingData(true);
                  Promise.all([
                    fetchCertificates(),
                    fetchApprovedCertificates()
                  ]).finally(() => setIsLoadingData(false));
                }}
                disabled={isLoadingData}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingData ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search certificates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">College</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCertificates.map((certificate) => (
                  <tr key={certificate._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{certificate.student?.name}</div>
                      <div className="text-sm text-gray-500">{certificate.student?.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{certificate.student?.studentId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{certificate.student?.college}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{certificate.project?.title}</div>
                        <div className="text-sm text-gray-500">{certificate.project?.category}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
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
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {certificate.status === 'generated' && (
                        <button
                          onClick={() => downloadCertificate(certificate)}
                          className="text-green-600 hover:text-green-900 flex items-center"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateGenerator;
