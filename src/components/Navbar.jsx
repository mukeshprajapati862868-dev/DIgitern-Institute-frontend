import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getNavLinks = () => {
    if (user?.role === 'admin' || user?.role === 'super_admin') {
      return [
        { name: 'Dashboard', href: '/admin/dashboard' },
        { name: 'Student Approvals', href: '/admin/approvals' },
        { name: 'Course Approval', href: '/admin/course-approval' },
        { name: 'Course Management', href: '/admin/courses' },
        { name: 'Certificate Upload', href: '/admin/certificate-upload' },
        { name: 'Certificate Generator', href: '/admin/certificate-generator' },
        { name: 'Task Assignment', href: '/admin/tasks' },
        { name: 'Certificates', href: '/admin/certificates' },
        { name: 'Bulk Registration', href: '/admin/bulk-registration' },
      ];
    } else if (user?.role === 'student') {
      return [
        { name: 'Dashboard', href: '/student/dashboard' },
        { name: 'Course Applications', href: '/student/courses' },
        { name: 'Internship Tracker', href: '/student/tracker' },
        { name: 'Certificates', href: '/student/certificates' },
        { name: 'Performance', href: '/student/performance' },
        // { name: 'Projects', href: '/fps/projects' },
        { name: 'Submit Work', href: '/fps/submit' },
      ];
    }
    return [];
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">Digitern</h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {getNavLinks().map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 focus:outline-none"
              >
                <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-indigo-600">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="hidden md:block text-sm font-medium">{user?.name}</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-gray-500">{user?.email}</p>
                    <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-indigo-600 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              {getNavLinks().map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 