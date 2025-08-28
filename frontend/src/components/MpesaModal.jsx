import React, { useState } from 'react';
import axios from 'axios';
import '../styles/form.css';

const MpesaModal = ({ onClose, onSubmit }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!phoneNumber) {
      setError('Phone number is required');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to initiate payment');
      return;
    }

    function sanitizePhoneNumber(phoneNumber) {
      if (phoneNumber.startsWith('0')) {
        return '254' + phoneNumber.substring(1);
      } else if (phoneNumber.startsWith('+')) {
        return phoneNumber.substring(1);
      } else if (!phoneNumber.startsWith('254')) {
        return '254' + phoneNumber;
      }
      return phoneNumber;
    }

    const sanitizedPhoneNumber = sanitizePhoneNumber(phoneNumber);

    function validatePhoneNumber(phone) {
      return /^\d{10,}$/.test(phone);
    }

    if (!validatePhoneNumber(sanitizedPhoneNumber)) {
      setError('Invalid phone number format');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/mpesa/stkpush`,
        {
          phone_number: sanitizedPhoneNumber,
          amount: 1
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );
      setLoading(false);
      console.log("the response mpesa modal",response.data)
      onSubmit(response.data);
    } catch (error) {
      setLoading(false);
      console.error('STK Push Error:', error);
      setError(error.response?.data?.error || 'Failed to initiate M-Pesa payment');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Enter Phone Number for M-Pesa Payment</h3>
        {error && <p className="error">{error}</p>}
        {loading && (
          <div className="spinner-overlay">
            <div className="spinner"></div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="e.g., +254123456789"
            />
          </div>
          <div className="modal-buttons">
            <button type="submit">Send STK Push</button>
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MpesaModal;