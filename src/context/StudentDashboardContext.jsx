import React, { createContext, useContext, useState, useEffect } from 'react';
import studentService from '../services/studentService';
import { useAuth } from './AuthContext';

const StudentDashboardContext = createContext();

export const useStudentDashboard = () => useContext(StudentDashboardContext);

export const StudentDashboardProvider = ({ children }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      // Only fetch data if user is logged in and is a student
      if (!user || user.role !== 'student') {
        setLoading(false);
        return;
      }

      try {
        const response = await studentService.getDashboard();
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setDashboardData({
          student: {},
          recentTasks: [],
          earningsSummary: {},
          performanceStats: {}
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user]);

  return (
    <StudentDashboardContext.Provider value={{ dashboardData, setDashboardData, loading }}>
      {children}
    </StudentDashboardContext.Provider>
  );
}; 