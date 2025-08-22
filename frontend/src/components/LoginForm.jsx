import React, { useState } from 'react';
import axios from 'axios';
import '../styles/form.css';

const LoginForm = ({ onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage('');

    // Client-side validation
    const newErrors = {};
    if (!username) newErrors.username = 'Username is required';
    if (!password) newErrors.password = 'Password is required';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/login`, {
        username,
        password
      });
      const { access_token, username: user, id, email, phone_number, date_of_birth } = response.data;
      // Store token and user data in localStorage
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify({ id, username: user, email, phone_number, date_of_birth }));
      setMessage('Login successful!');
      onSuccess(); // Call onSuccess callback
    } catch (error) {
      setErrors({ general: error.response?.data?.error || 'Login failed' });
    }
  };

  return (
    <div>
      {errors.general && <p className="error">{errors.general}</p>}
      {message && <p className="success">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
          />
          {errors.username && <p className="error">{errors.username}</p>}
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>
        <button type="submit">Log In</button>
      </form>
    </div>
  );
};

export default LoginForm;