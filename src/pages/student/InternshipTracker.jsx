import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const InternshipTracker = () => {
  const { user } = useAuth();
  const [trackerData, setTrackerData] = useState({
    currentPhase: 'Planning',
    progress: 25,
    milestones: [
      { id: 1, title: 'Project Planning', status: 'completed', date: '2024-01-15' },
      { id: 2, title: 'Environment Setup', status: 'completed', date: '2024-01-20' },
      { id: 3, title: 'Core Development', status: 'in_progress', date: '2024-02-01' },
      { id: 4, title: 'Testing & Debugging', status: 'pending', date: null },
      { id: 5, title: 'Documentation', status: 'pending', date: null },
      { id: 6, title: 'Final Presentation', status: 'pending', date: null }
    ]
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Internship Tracker</h1>
          <p className="text-gray-600 mt-2">Track your internship progress and milestones</p>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Overall Progress</h2>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{trackerData.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${trackerData.progress}%` }}
                ></div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{trackerData.progress}%</div>
              <div className="text-sm text-gray-600">Complete</div>
            </div>
          </div>
        </div>

        {/* Current Phase */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Phase</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">{trackerData.currentPhase}</h3>
                <p className="text-gray-600">You're currently in the {trackerData.currentPhase.toLowerCase()} phase</p>
              </div>
            </div>
          </div>
        </div>

        {/* Milestones */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Milestones</h2>
          <div className="space-y-6">
            {trackerData.milestones.map((milestone, index) => (
              <div key={milestone.id} className="flex items-start space-x-4">
                {/* Status Icon */}
                <div className="flex-shrink-0">
                  {milestone.status === 'completed' ? (
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  ) : milestone.status === 'in_progress' ? (
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">{milestone.title}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      milestone.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : milestone.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {milestone.status.replace('_', ' ')}
                    </span>
                  </div>
                  {milestone.date && (
                    <p className="text-sm text-gray-600 mt-1">
                      Completed: {new Date(milestone.date).toLocaleDateString()}
                    </p>
                  )}
                </div>

                {/* Connector Line */}
                {index < trackerData.milestones.length - 1 && (
                  <div className="absolute left-4 top-8 w-0.5 h-12 bg-gray-200"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipTracker; 