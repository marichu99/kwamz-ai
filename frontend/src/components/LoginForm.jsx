// LoginForm.js
import React, { useState } from 'react';
import axios from 'axios';

const LoginForm = ({ onSuccess, onCancel }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage('');

    // Client-side validation
    const newErrors = {};
    if (!username.trim()) newErrors.username = 'Username is required';
    if (!password.trim()) newErrors.password = 'Password is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/login`, {
        username: username.trim(),
        password: password.trim()
      });
      
      const { access_token, username: user, id, email, phone_number, date_of_birth } = response.data;
      
      // Store token and user data in localStorage
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify({ 
        id, 
        username: user, 
        email, 
        phone_number, 
        date_of_birth 
      }));
      
      setMessage('Login successful!');
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ 
        general: error.response?.data?.error || error.response?.data?.message || 'Login failed. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {errors.general && <p className="error">{errors.general}</p>}
      {message && <p className="success">{message}</p>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="login-username">Username</label>
          <input
            type="text"
            id="login-username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            disabled={isSubmitting}
            required
          />
          {errors.username && <p className="error">{errors.username}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="login-password">Password</label>
          <input
            type="password"
            id="login-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            disabled={isSubmitting}
            required
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>
        
        <div className="modal-buttons">
          <button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging In...' : 'Log In'}
          </button>
          <button 
            type="button"
            className="cancel-button" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;