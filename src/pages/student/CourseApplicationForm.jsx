import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { BookOpen, Clock, Users, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import courseService from '../../services/courseService';

const CourseApplicationForm = () => {
  const { user } = useAuth();
  const [courseApplications, setCourseApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await courseService.getMyApplications(user._id); // Adjust based on your API
        setCourseApplications(response.data || []);
      } catch (error) {
        console.error('Error fetching applications:', error);
        toast.error('Failed to load your course applications');
      }
    };

    if (user) {
      fetchApplications();
    }
  }, [user]);

  return (
    <div>
      {/* Course Applications */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Available Courses</h2>
          <Link to="/student/courses" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All Courses
          </Link>
        </div>

        {/* Frontend Development */}
        <CourseCategory
          color="blue"
          title="Frontend Development"
          courses={[
            {
              name: "React.js Fundamentals",
              desc: "Learn React hooks, components, and state management for modern web applications.",
              level: "Beginner",
              button: "Apply Now",
            },
            {
              name: "Advanced React & Redux",
              desc: "Master Redux state management, advanced patterns, and performance optimization.",
              level: "Intermediate",
              button: "View Details",
            },
            {
              name: "TypeScript for React",
              desc: "Build type-safe React apps with TypeScript and modern development practices.",
              level: "Intermediate",
              button: "Apply Now",
            },
          ]}
        />

        {/* Backend Development */}
        <CourseCategory
          color="green"
          title="Backend Development"
          courses={[
            {
              name: "Flask Web Development",
              desc: "Build RESTful APIs and web apps using Python Flask framework.",
              level: "Beginner",
              button: "Apply Now",
            },
            {
              name: "Django Full Stack",
              desc: "Master Django framework for full-stack web apps with admin panel.",
              level: "Intermediate",
              button: "View Details",
            },
            {
              name: "FastAPI & Async Python",
              desc: "Build high-performance APIs with FastAPI and async Python.",
              level: "Advanced",
              button: "Apply Now",
            },
          ]}
        />

        {/* Database & DevOps */}
        <CourseCategory
          color="purple"
          title="Database & DevOps"
          courses={[
            {
              name: "PostgreSQL Mastery",
              desc: "Learn advanced PostgreSQL features and optimization techniques.",
              level: "Intermediate",
              button: "Apply Now",
            },
            {
              name: "Git & Version Control",
              desc: "Master Git workflows, branching, and collaborative development.",
              level: "Beginner",
              button: "View Details",
            },
            {
              name: "Docker & Containerization",
              desc: "Deploy apps with Docker containers and orchestration basics.",
              level: "Intermediate",
              button: "Apply Now",
            },
          ]}
        />

        {/* Full Stack */}
        <CourseCategory
          color="orange"
          title="Advanced Full Stack"
          courses={[
            {
              name: "Python Full Stack with React",
              desc: "Complete full-stack development using Django/Flask + React.",
              level: "Advanced",
              button: "Apply Now",
            },
            {
              name: "Microservices Architecture",
              desc: "Design scalable microservices with Python & modern tools.",
              level: "Advanced",
              button: "View Details",
            },
            {
              name: "Cloud Deployment (AWS/Azure)",
              desc: "Deploy full-stack apps to cloud with CI/CD pipelines.",
              level: "Advanced",
              button: "Apply Now",
            },
          ]}
        />

        {/* My Applications Summary */}
        {courseApplications.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              My Applications ({courseApplications.length})
            </h3>
            <div className="space-y-3">
              {courseApplications.slice(0, 3).map((application, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{application.courseName}</h4>
                    <p className="text-sm text-gray-600">
                      Applied on {new Date(application.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      application.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : application.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {application.status === 'pending' ? 'Pending Approval' : application.status}
                  </span>
                </div>
              ))}

              {courseApplications.length > 3 && (
                <div className="text-center">
                  <Link to="/student/courses" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View all {courseApplications.length} applications →
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CourseCategory = ({ title, courses, color }) => {
  const colorMap = {
    blue: 'from-blue-50 to-indigo-50 border-blue-200 bg-blue-100 text-blue-800',
    green: 'from-green-50 to-emerald-50 border-green-200 bg-green-100 text-green-800',
    purple: 'from-purple-50 to-violet-50 border-purple-200 bg-purple-100 text-purple-800',
    orange: 'from-orange-50 to-amber-50 border-orange-200 bg-orange-100 text-orange-800',
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <div className={`w-2 h-6 bg-${color}-500 rounded mr-3`}></div>
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br ${colorMap[color]} border rounded-lg p-4 hover:shadow-md transition-shadow`}
          >
            <h4 className="font-semibold text-gray-900 mb-2">{course.name}</h4>
            <p className="text-sm text-gray-600 mb-3">{course.desc}</p>
            <div className="flex items-center justify-between">
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  course.level === 'Beginner'
                    ? colorMap[color]
                    : course.level === 'Intermediate'
                    ? colorMap['yellow']
                    : colorMap['red']
                }`}
              >
                {course.level}
              </span>
              <button className={`text-${color}-600 hover:text-${color}-700 text-sm font-medium`}>
                {course.button}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseApplicationForm;
