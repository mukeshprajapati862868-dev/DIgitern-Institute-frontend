import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Upload, User, FileText, Calendar, Award, Download } from 'lucide-react';
import adminService from '../../services/adminService';

const CertificateUpload = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedCertificates, setUploadedCertificates] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();

  const watchStudentId = watch('studentId');

  useEffect(() => {
    const loadData = async () => {
      setIsLoadingData(true);
      try {
        await Promise.all([
          fetchStudents(),
          fetchUploadedCertificates()
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
      console.log('Fetching students for certificate upload...');
      const response = await adminService.getApprovedStudents();
      console.log('Students response:', response);
      setStudents(response.data || []);
      console.log('Students set:', response.data?.length || 0);
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([]);
    }
  };

  const fetchUploadedCertificates = async () => {
    try {
      const response = await adminService.getAllCertificates();
      const uploadedCerts = (response.data || []).filter(
        (cert) => cert.status === 'generated' && cert.filename
      );
      setUploadedCertificates(uploadedCerts);
    } catch (error) {
      console.error('Error fetching uploaded certificates:', error);
      setUploadedCertificates([]);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
        setSelectedFile(file);
        toast.success('File selected successfully!');
      } else {
        toast.error('Please select a PDF or image file');
        setSelectedFile(null);
      }
    }
  };

  const autoFillStudentData = (student) => {
    setValue('studentName', student.name);
    setValue('studentEmail', student.email);
    setValue('studentCollege', student.college);
    setValue('studentCourse', student.course);
    setValue('studentYear', student.year);
    setValue('studentPhone', student.phone);
    toast.success('Student data auto-filled!');
  };

  const onSubmit = async (data) => {
    if (!selectedFile) {
      toast.error('Please select a certificate file');
      return;
    }

    // If no student is selected but we have manual student details, create a temporary student ID
    let studentId = data.studentId;
    if (!studentId && data.studentName && data.studentEmail) {
      studentId = `TEMP-${Date.now()}`;
    }

    if (!studentId) {
      toast.error('Please select a student or provide student details');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('certificate', selectedFile);
      formData.append('studentId', studentId);
      formData.append('courseName', data.courseName);
      formData.append('completionDate', data.completionDate);
      formData.append('duration', data.duration);
      formData.append('projectTitle', data.projectTitle);
      formData.append('projectCategory', data.projectCategory);
      formData.append('projectDifficulty', data.projectDifficulty);
      formData.append('studentName', data.studentName);
      formData.append('studentEmail', data.studentEmail);
      formData.append('studentCollege', data.studentCollege);
      formData.append('studentCourse', data.studentCourse);
      formData.append('studentYear', data.studentYear);
      formData.append('studentPhone', data.studentPhone);

      const response = await adminService.uploadCertificateWithDetails(formData);
      
      toast.success('Certificate uploaded successfully!');
      reset();
      setSelectedFile(null);
      await fetchUploadedCertificates();
    } catch (error) {
      console.error('Certificate upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload certificate');
    } finally {
      setIsLoading(false);
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

  const selectedStudent = students.find(student => student._id === watchStudentId);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Certificate Upload</h1>
            <p className="text-gray-600 mt-2">Upload certificates with complete student details</p>
          </div>
          <button
            onClick={() => {
              setIsLoadingData(true);
              Promise.all([
                fetchStudents(),
                fetchUploadedCertificates()
              ]).finally(() => setIsLoadingData(false));
            }}
            disabled={isLoadingData}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 disabled:opacity-50"
          >
            {isLoadingData ? 'Loading...' : 'Refresh Data'}
          </button>
        </div>

        {/* Upload Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {isLoadingData && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
          {!isLoadingData && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Student Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline h-4 w-4 mr-1" />
                  Select Student
                </label>
                {students.length > 0 ? (
                  <select
                    {...register('studentId', { required: 'Student is required' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Choose a student...</option>
                    {students.map((student) => (
                      <option key={student._id} value={student._id}>
                        {student.name} - {student.studentId} ({student.college})
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="mt-1 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm text-yellow-800">
                      No students found. You can manually enter student details below.
                    </p>
                  </div>
                )}
                {errors.studentId && <p className="mt-1 text-sm text-red-600">{errors.studentId.message}</p>}
              </div>

              {selectedStudent && (
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => autoFillStudentData(selectedStudent)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Auto-Fill Student Data
                  </button>
                </div>
              )}
            </div>

            {/* Student Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Student Name</label>
                <input
                  type="text"
                  {...register('studentName', { required: 'Student name is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter student name"
                />
                {errors.studentName && <p className="mt-1 text-sm text-red-600">{errors.studentName.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Student Email</label>
                <input
                  type="email"
                  {...register('studentEmail', { required: 'Student email is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter student email"
                />
                {errors.studentEmail && <p className="mt-1 text-sm text-red-600">{errors.studentEmail.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">College/Institution</label>
                <input
                  type="text"
                  {...register('studentCollege', { required: 'College is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter college name"
                />
                {errors.studentCollege && <p className="mt-1 text-sm text-red-600">{errors.studentCollege.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Course</label>
                <input
                  type="text"
                  {...register('studentCourse', { required: 'Course is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter course name"
                />
                {errors.studentCourse && <p className="mt-1 text-sm text-red-600">{errors.studentCourse.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Year</label>
                <input
                  type="number"
                  {...register('studentYear', { required: 'Year is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter year"
                  min="1"
                  max="10"
                />
                {errors.studentYear && <p className="mt-1 text-sm text-red-600">{errors.studentYear.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  {...register('studentPhone', { required: 'Phone is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter phone number"
                />
                {errors.studentPhone && <p className="mt-1 text-sm text-red-600">{errors.studentPhone.message}</p>}
              </div>
            </div>

            {/* Certificate Details */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                <Award className="inline h-5 w-5 mr-2" />
                Certificate Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Course/Project Name</label>
                  <input
                    type="text"
                    {...register('courseName', { required: 'Course name is required' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter course or project name"
                  />
                  {errors.courseName && <p className="mt-1 text-sm text-red-600">{errors.courseName.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Project Title</label>
                  <input
                    type="text"
                    {...register('projectTitle')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter project title (optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Duration</label>
                  <input
                    type="text"
                    {...register('duration')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="e.g., 3 months, 6 weeks"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Project Category</label>
                  <select
                    {...register('projectCategory')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select category</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Mobile Development">Mobile Development</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Machine Learning">Machine Learning</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Difficulty Level</label>
                  <select
                    {...register('projectDifficulty')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select difficulty</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Completion Date
                  </label>
                  <input
                    type="date"
                    {...register('completionDate', { required: 'Completion date is required' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.completionDate && <p className="mt-1 text-sm text-red-600">{errors.completionDate.message}</p>}
                </div>
              </div>
            </div>

            {/* File Upload */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                <Upload className="inline h-5 w-5 mr-2" />
                Certificate File
              </h3>
              
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="certificate-file" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                      <span>Upload a file</span>
                      <input
                        id="certificate-file"
                        name="certificate-file"
                        type="file"
                        className="sr-only"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PDF, JPG, PNG up to 10MB</p>
                  {selectedFile && (
                    <p className="text-sm text-green-600 font-medium">
                      Selected: {selectedFile.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading || !selectedFile}
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Certificate
                  </>
                )}
              </button>
            </div>
          </form>
          )}
        </div>

        {/* Uploaded Certificates */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recently Uploaded Certificates</h2>
            <button
              onClick={fetchUploadedCertificates}
              disabled={isLoadingData}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 disabled:opacity-50"
            >
              Refresh
            </button>
          </div>

          {uploadedCertificates.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No certificates uploaded yet</h3>
              <p className="mt-1 text-sm text-gray-500">Upload your first certificate above.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course/Project</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Certificate ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {uploadedCertificates.map((certificate) => (
                    <tr key={certificate._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{certificate.student?.name}</div>
                        <div className="text-sm text-gray-500">{certificate.student?.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {certificate.course?.courseName || certificate.title}
                        </div>
                        <div className="text-sm text-gray-500">{certificate.student?.college}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {certificate.completionDate ? new Date(certificate.completionDate).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {certificate.certificateId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => downloadCertificate(certificate)}
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CertificateUpload; 