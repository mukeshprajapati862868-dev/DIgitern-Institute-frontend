import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Upload, Users, CheckCircle, AlertCircle } from 'lucide-react';
import adminService from '../../services/adminService';

const BulkStudentRegistration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Parse the students data
      let students;
      if (data.studentsFile) {
        const file = data.studentsFile[0];
        const text = await file.text();
        students = JSON.parse(text);
      } else {
        // Manual entry
        students = [{
          name: data.name,
          email: data.email,
          password: data.password,
          college: data.college,
          course: data.course,
          year: parseInt(data.year),
          phone: data.phone,
          skills: data.skills ? data.skills.split(',').map(s => s.trim()) : [],
          interests: data.interests ? data.interests.split(',').map(s => s.trim()) : []
        }];
      }

      const response = await adminService.bulkRegisterStudents({ students });
      setResults(response);
      toast.success(`Successfully registered ${response.registered.length} students`);
      reset();
    } catch (error) {
      console.error('Bulk registration error:', error);
      toast.error(error.response?.data?.message || 'Failed to register students');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-6">
            <Users className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Bulk Student Registration</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* File Upload Option */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Upload Students File</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Upload a JSON file with student data or fill the form below
                </p>
                <div className="mt-4">
                  <input
                    type="file"
                    accept=".json"
                    {...register('studentsFile')}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>
            </div>

            {/* Manual Entry Form */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Manual Entry</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    {...register('password', { 
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">College</label>
                  <input
                    type="text"
                    {...register('college', { required: 'College is required' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.college && <p className="mt-1 text-sm text-red-600">{errors.college.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Course</label>
                  <input
                    type="text"
                    {...register('course', { required: 'Course is required' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.course && <p className="mt-1 text-sm text-red-600">{errors.course.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Year</label>
                  <select
                    {...register('year', { required: 'Year is required' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                  {errors.year && <p className="mt-1 text-sm text-red-600">{errors.year.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    {...register('phone', { required: 'Phone is required' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Skills (comma-separated)</label>
                  <input
                    type="text"
                    {...register('skills')}
                    placeholder="JavaScript, React, Node.js"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Interests (comma-separated)</label>
                  <input
                    type="text"
                    {...register('interests')}
                    placeholder="Web Development, AI, Data Science"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Registering...
                  </>
                ) : (
                  <>
                    <Users className="h-4 w-4 mr-2" />
                    Register Students
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Results Display */}
          {results && (
            <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Registration Results</h3>
              
              <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                  <span className="text-green-800 font-medium">{results.message}</span>
                </div>
              </div>

              {results.registered.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Successfully Registered:</h4>
                  <div className="bg-white border rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">College</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {results.registered.map((student, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.studentId}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.college}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {results.errors.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Errors:</h4>
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    {results.errors.map((error, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <AlertCircle className="h-4 w-4 text-red-400 mr-2" />
                        <span className="text-red-800 text-sm">{error.email}: {error.error}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkStudentRegistration; 