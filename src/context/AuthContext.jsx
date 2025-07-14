import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    // Clear invalid data if token exists but no user data
    if (token && !userData) {
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
      setLoading(false);
      return;
    }
    
    if (token && userData && !verifying) {
      try {
        const parsedUser = JSON.parse(userData);
        // Verify token with backend
        verifyToken(token, parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        logout();
      }
    } else {
      setLoading(false);
    }
  }, [verifying]);

  const verifyToken = async (token, userData) => {
    if (verifying) return; // Prevent multiple verification attempts
    
    setVerifying(true);
    try {
      // Verify token with backend based on user role
      let response;
      if (userData.role === 'admin' || userData.role === 'super_admin') {
        response = await apiService.get('/admin/profile');
      } else if (userData.role === 'student') {
        response = await apiService.get('/student/profile');
      } else {
        throw new Error('Invalid user role');
      }
      
      if (response && response.data) {
        // Handle both old and new response formats
        const userInfo = response.data.data || response.data;
        setUser(userInfo);
        localStorage.setItem('user', JSON.stringify(userInfo));
      } else {
        throw new Error('Invalid token');
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      // Clear invalid data immediately
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userType');
      setUser(null);
    } finally {
      setLoading(false);
      setVerifying(false);
    }
  };

  const login = async (email, password, userType = 'student') => {
    try {
      setLoading(true);
      
      let response;
      if (userType === 'admin') {
        response = await apiService.post('/admin/login', { email, password });
      } else {
        response = await apiService.post('/student/login', { email, password });
      }

      // Handle new response format with success flag
      if (response.data.success) {
        const userData = response.data.data;
        const token = userData.token;
        
        // Remove token from user data before storing
        const { token: _, ...userInfo } = userData;
        
        // Store user data and token
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userInfo));
        localStorage.setItem('userType', userType);
        
        setUser(userInfo);
        setLoading(false);
        
        return { user: userInfo, token };
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      setLoading(false);
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      
      console.log('Sending registration data:', userData);
      const response = await apiService.post('/student/register', userData);
      
      // Handle new response format with success flag
      if (response.data.success) {
        const user = response.data.data;
        const token = user.token;
        
        // Remove token from user data before storing
        const { token: _, ...userInfo } = user;
        
        // Store user data and token
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userInfo));
        localStorage.setItem('userType', 'student');
        
        setUser(userInfo);
        setLoading(false);
        
        return { user: userInfo, token };
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      setLoading(false);
      console.error('Registration error:', error.response?.data || error.message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    setUser(null);
    setLoading(false);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 