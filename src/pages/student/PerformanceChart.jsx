import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import studentService from '../../services/studentService';

const PerformanceChart = () => {
  const { user } = useAuth();
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const response = await studentService.getDashboard();
        setPerformanceData(response.data);
      } catch (error) {
        console.error('Error fetching performance data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Mock data for demonstration
  const mockData = {
    overallScore: 85,
    tasksCompleted: 12,
    totalTasks: 15,
    completionRate: 80,
    weeklyProgress: [
      { week: 'Week 1', tasks: 3, completed: 3 },
      { week: 'Week 2', tasks: 4, completed: 3 },
      { week: 'Week 3', tasks: 3, completed: 2 },
      { week: 'Week 4', tasks: 5, completed: 4 }
    ],
    skillScores: [
      { skill: 'JavaScript', score: 90 },
      { skill: 'React', score: 85 },
      { skill: 'Node.js', score: 80 },
      { skill: 'MongoDB', score: 75 },
      { skill: 'Git', score: 95 }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Performance Analytics</h1>
          <p className="text-gray-600 mt-2">Track your progress and performance metrics</p>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Score</h3>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">{mockData.overallScore}%</div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${mockData.overallScore}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Completion</h3>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">{mockData.completionRate}%</div>
              <p className="text-gray-600">
                {mockData.tasksCompleted} of {mockData.totalTasks} tasks completed
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Rating</h3>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">4.2</div>
              <div className="flex justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`h-5 w-5 ${star <= 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Weekly Progress</h2>
          <div className="space-y-4">
            {mockData.weeklyProgress.map((week, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 text-sm font-medium text-gray-900">{week.week}</div>
                  <div className="flex-1 max-w-md">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Tasks: {week.completed}/{week.tasks}</span>
                      <span>{Math.round((week.completed / week.tasks) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(week.completed / week.tasks) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Scores */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Skill Assessment</h2>
          <div className="space-y-4">
            {mockData.skillScores.map((skill, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-24 text-sm font-medium text-gray-900">{skill.skill}</div>
                  <div className="flex-1 max-w-md">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Proficiency</span>
                      <span>{skill.score}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          skill.score >= 90 ? 'bg-green-600' :
                          skill.score >= 80 ? 'bg-blue-600' :
                          skill.score >= 70 ? 'bg-yellow-600' : 'bg-red-600'
                        }`}
                        style={{ width: `${skill.score}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    skill.score >= 90 ? 'bg-green-100 text-green-800' :
                    skill.score >= 80 ? 'bg-blue-100 text-blue-800' :
                    skill.score >= 70 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {skill.score >= 90 ? 'Expert' :
                     skill.score >= 80 ? 'Advanced' :
                     skill.score >= 70 ? 'Intermediate' : 'Beginner'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Insights */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Performance Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-blue-900 mb-2">Strengths</h3>
              <ul className="space-y-2 text-blue-800">
                <li className="flex items-center">
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Excellent problem-solving skills
                </li>
                <li className="flex items-center">
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Strong JavaScript fundamentals
                </li>
                <li className="flex items-center">
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Good communication skills
                </li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-yellow-900 mb-2">Areas for Improvement</h3>
              <ul className="space-y-2 text-yellow-800">
                <li className="flex items-center">
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  Database design concepts
                </li>
                <li className="flex items-center">
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  Advanced React patterns
                </li>
                <li className="flex items-center">
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  Testing methodologies
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart; 