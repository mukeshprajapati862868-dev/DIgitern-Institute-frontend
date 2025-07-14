import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { CheckCircle } from 'lucide-react';
import studentService from '../../services/studentService';
// Removed TaskAssign import as it was deleted

const ProjectSubmission = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [description, setDescription] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submittedProject, setSubmittedProject] = useState(null); // NEW

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await studentService.getAvailableProjects();
      const completedProjects = (response.data?.projects || []).filter(project => {
        const completedTasks = project.tasks?.filter(task => task.status === 'completed').length || 0;
        const totalTasks = project.tasks?.length || 0;
        return totalTasks > 0 && completedTasks === totalTasks;
      });
      setProjects(completedProjects);
    } catch (error) {
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProject || !description.trim()) {
      return toast.error('Select project and add description');
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('projectId', selectedProject._id);
      formData.append('description', description);
      selectedFiles.forEach((file) => formData.append('files', file));

      const res = await studentService.submitProjectForCertificate(formData);
      toast.success('Project submitted successfully!');

      // Remove from available list and add to submittedProject state
      setProjects(prev => prev.filter(p => p._id !== selectedProject._id));
      setSubmittedProject(res.data.project); // Pass to admin page via props

      // Reset form
      setSelectedProject(null);
      setDescription('');
      setSelectedFiles([]);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Submit Project for Certificate</h1>

      {projects.length === 0 ? (
        <div className="text-center text-gray-600">
          <CheckCircle className="mx-auto w-10 h-10 text-gray-400" />
          No completed projects available
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={selectedProject?._id || ''}
            onChange={(e) =>
              setSelectedProject(projects.find(p => p._id === e.target.value))
            }
            className="border rounded w-full p-2"
            required
          >
            <option value="">Select Completed Project</option>
            {projects.map(project => (
              <option key={project._id} value={project._id}>{project.title}</option>
            ))}
          </select>

          <textarea
            rows="4"
            placeholder="Describe your work"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded w-full p-2"
            required
          />

          <input
            type="file"
            multiple
            onChange={handleFileSelect}
            className="block w-full text-sm"
          />

          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {submitting ? 'Submitting...' : 'Submit for Certificate'}
          </button>
        </form>
      )}

      {/* Show just submitted project immediately */}
      {submittedProject && (
        <div className="mt-10 border-t pt-6">
          <h2 className="text-xl font-bold mb-4">Submitted Project</h2>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{submittedProject.title}</h3>
            <p className="text-gray-600 mb-4">{submittedProject.description}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>Category: {submittedProject.category}</span>
              <span>Difficulty: {submittedProject.difficulty}</span>
              <span className="text-green-600 font-semibold">Status: Submitted</span>
            </div>
            {submittedProject.submission && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                <p className="text-sm font-medium text-green-800">Submission Description:</p>
                <p className="text-sm text-green-700">{submittedProject.submission.description}</p>
                {submittedProject.submission.files && submittedProject.submission.files.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-green-800">Files:</p>
                    <ul className="list-disc list-inside text-sm text-green-700">
                      {submittedProject.submission.files.map((fileUrl, idx) => (
                        <li key={idx}>
                          <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            View File {idx + 1}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectSubmission;
