// LandingPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignupForm from '../components/SignUpForm';
import LoginForm from '../components/LoginForm';
import '../styles/form.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const toggleLogin = () => {
    setShowLogin(!showLogin);
    setShowSignup(false); 
  };

  const toggleSignup = () => {
    setShowSignup(!showSignup);
    setShowLogin(false); 
  };

  const closeModals = () => {
    setShowLogin(false);
    setShowSignup(false);
  };

  return (
    <div className="form-container landing-container">
      <h2>Welcome to Kwamz AI</h2>
      <p>Your future AI dashboard starts here.</p>
      <div className="modal-buttons">
        <button className="button" onClick={toggleLogin}>Login</button>
        <button className="button" onClick={toggleSignup}>Sign Up</button>
      </div>

      {showSignup && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Sign Up</h3>
            <SignupForm 
              onSuccess={() => {
                closeModals();
                navigate('/dashboard');
              }}
              onCancel={closeModals}
            />
          </div>
        </div>
      )}

      {showLogin && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Log In</h3>
            <LoginForm 
              onSuccess={() => {
                closeModals();
                navigate('/dashboard');
              }}
              onCancel={closeModals}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;