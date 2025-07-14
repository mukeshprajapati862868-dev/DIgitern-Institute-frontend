import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = () => {
    if (user) {
      if (user.role === 'admin' || user.role === 'super_admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } else {
      navigate('/login');
    }
  };

  const handleGetStarted = () => {
    if (user) {
      if (user.role === 'admin' || user.role === 'super_admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } else {
      navigate('/register');
    }
  };

  const handleExploreInternships = () => {
    navigate('/login');
  };

  const handleContactUs = () => {
    // You can add contact functionality here
    window.open('mailto:contact@digitern.com', '_blank');
  };

  const handleViewCourses = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">Digitern</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSignIn}
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={handleGetStarted}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Transform Your Future with</span>{' '}
                  <span className="block text-indigo-600 xl:inline">Digital Internships</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Join thousands of students gaining real-world experience through our innovative internship platform. 
                  Work on meaningful projects, earn certificates, and build your career.
                </p>
                <div className="mt-5 sm:mt-8 flex flex-wrap justify-center lg:justify-start gap-4">
                  <button
                    onClick={handleGetStarted}
                    className="flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 transition-colors"
                  >
                    Start Your Journey
                  </button>

                  <button
                    onClick={handleExploreInternships}
                    className="flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 md:py-4 md:text-lg md:px-10 transition-colors"
                  >
                    Explore Internships
                  </button>

                  <button
                    onClick={handleContactUs}
                    className="flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-white bg-green-500 hover:bg-green-600 md:py-4 md:text-lg md:px-10 transition-colors"
                  >
                    Contact Us
                  </button>

                  <button
                    onClick={handleViewCourses}
                    className="flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-white bg-pink-500 hover:bg-pink-600 md:py-4 md:text-lg md:px-10 transition-colors"
                  >
                    View Courses
                  </button>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* About Us Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* About Us */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">About Us</h2>
              <div className="w-20 h-1 bg-indigo-600 mb-6"></div>
              <p className="text-gray-600 leading-relaxed mb-6">
                Digitern is a modern, skill-based digital learning institute dedicated to transforming passionate individuals into industry-ready professionals. Founded in 2023, Digitern offers a range of cutting-edge programs in Full Stack Web Development, UI/UX Design, Data Science, Digital Marketing, Cloud Computing, and more.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Our mission is to empower the next generation with practical, job-oriented skills that bridge the gap between academic knowledge and real-world demands. We believe that true learning happens through hands-on experience, live projects, mentorship, and continuous innovation.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Whether you're a student, working professional, or career switcher, Digitern provides a flexible, immersive environment that helps you grow in the rapidly evolving tech landscape. With industry-expert trainers, personalized learning paths, and placement support, Digitern ensures that every learner not only learns but excels.
              </p>
              <button className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors">
                Read More
              </button>
            </div>

            {/* Director Message */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Director Message</h2>
              <div className="w-20 h-1 bg-indigo-600 mb-6"></div>
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <p className="text-gray-600 leading-relaxed mb-4">
                  Welcome to Digitern – your gateway to digital success.
                </p>
                <p className="text-gray-600 leading-relaxed mb-4">
                  At Digitern, we aim to empower students with real-world tech skills that prepare them for today's competitive world. Our focus is on practical learning, innovation, and career growth.
                </p>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Join us to learn, build, and lead in the digital future.
                </p>
                <div className="text-right">
                  <p className="text-indigo-600 font-semibold">— Mr. Mukesh Prajapati</p>
                  <p className="text-sm text-gray-500">Director, Digitern</p>
                </div>
              </div>
              <button className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors">
                Read More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Digitern?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the difference with our comprehensive internship platform designed for your success.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Real Projects</h3>
              <p className="text-gray-600">Work on actual industry projects and build a portfolio that stands out.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Mentorship</h3>
              <p className="text-gray-600">Learn from industry professionals with years of experience.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Certificates</h3>
              <p className="text-gray-600">Earn recognized certificates upon completion of your internships.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <div className="bg-indigo-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to dive in?</span>
            <span className="block">Start your internship today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-indigo-200">
            Join thousands of students who have already transformed their careers with our platform.
          </p>
          <button
            onClick={handleGetStarted}
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto transition-colors"
          >
            Sign up for free
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Digitern</h3>
              <p className="text-gray-400">
                Transforming education through digital internships and real-world experience.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><button onClick={handleGetStarted} className="text-gray-400 hover:text-white transition-colors">Get Started</button></li>
                <li><button onClick={handleExploreInternships} className="text-gray-400 hover:text-white transition-colors">Internships</button></li>
                <li><button onClick={handleViewCourses} className="text-gray-400 hover:text-white transition-colors">Courses</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><button onClick={handleContactUs} className="text-gray-400 hover:text-white transition-colors">Contact Us</button></li>
                <li><button className="text-gray-400 hover:text-white transition-colors">Help Center</button></li>
                <li><button className="text-gray-400 hover:text-white transition-colors">FAQ</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <button className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </button>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </button>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800">
            <p className="text-gray-400 text-center">
              © 2024 Digitern. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
