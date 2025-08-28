import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import AppRouter from './AppRouter';
import './styles/form.css';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await axios({
            method: 'get',
            url: `${process.env.REACT_APP_API_URL}/users/verify-token`,
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          setIsAuthenticated(true);
          if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup') {
            navigate('/dashboard');
          }
        } catch (error) {
          console.error('Verify token failed:', error.response?.data || error.message);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setIsAuthenticated(false);
          navigate('/');
        }
      } else {
        setIsAuthenticated(false);
        if (location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/signup') {
          navigate('/');
        }
      }
      setIsLoading(false);
    };
    verifyToken();
  }, [navigate, location.pathname]);


  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app-container">
      {isAuthenticated  && <Sidebar />}
      <div className="main-content">
        {isAuthenticated && <Topbar />}
          <main className="page-content">
            <AppRouter />
          </main>
      </div>
    </div>
  );
};

export default App;