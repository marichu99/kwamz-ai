// SignUpForm.js
import React, { useState } from 'react';
import axios from 'axios';

const SignUpForm = ({ onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phoneNumber: '',
        dateOfBirth: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validate = (name, value) => {
        const newErrors = { ...errors };

        if (name === 'username') {
            newErrors.username = value.length < 3 ? 'Username must be at least 3 characters' : '';
        }

        if (name === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            newErrors.email = !emailRegex.test(value) && value.length > 0 ? 'Invalid email address' : '';
        }

        if (name === 'phoneNumber') {
            const phoneRegex = /^\d{9,14}$/;
            newErrors.phoneNumber = !phoneRegex.test(value) && value.length > 0
                ? 'Phone number must be between 9 and 14 digits.'
                : '';
        }

        if (name === 'password') {
            const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
            newErrors.password = !passwordRegex.test(value) && value.length > 0
                ? 'Password must be at least 8 characters, include a number and a special character.'
                : '';
        }

        if (name === 'confirmPassword') {
            newErrors.confirmPassword =
                value !== formData.password && value.length > 0 ? 'Passwords do not match' : '';
        }

        if (name === 'dateOfBirth') {
            if (value) {
                const today = new Date();
                const dob = new Date(value);
                const age = today.getFullYear() - dob.getFullYear();
                const monthDiff = today.getMonth() - dob.getMonth();
                const dayDiff = today.getDate() - dob.getDate();

                const isOldEnough =
                    age > 18 ||
                    (age === 18 && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)));

                newErrors.dateOfBirth = !isOldEnough ? 'You must be at least 18 years old.' : '';
            } else {
                newErrors.dateOfBirth = '';
            }
        }

        setErrors(newErrors);
    };

    const validateAll = () => {
        const newErrors = {};

        // Validate username
        if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Invalid email address';
        }

        // Validate phone number
        const phoneRegex = /^\d{9,14}$/;
        if (!phoneRegex.test(formData.phoneNumber)) {
            newErrors.phoneNumber = 'Phone number must be between 9 and 14 digits.';
        }

        // Validate password
        const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            newErrors.password = 'Password must be at least 8 characters, include a number and a special character.';
        }

        // Validate confirm password
        if (formData.confirmPassword !== formData.password) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        // Validate date of birth
        if (formData.dateOfBirth) {
            const today = new Date();
            const dob = new Date(formData.dateOfBirth);
            const age = today.getFullYear() - dob.getFullYear();
            const monthDiff = today.getMonth() - dob.getMonth();
            const dayDiff = today.getDate() - dob.getDate();

            const isOldEnough =
                age > 18 ||
                (age === 18 && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)));

            if (!isOldEnough) {
                newErrors.dateOfBirth = 'You must be at least 18 years old.';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        validate(name, value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Clear any previous general errors
        const newErrors = { ...errors };
        delete newErrors.general;
        setErrors(newErrors);

        // Validate all fields
        const isValid = validateAll();
        
        // Check if all required fields are filled
        const allFieldsFilled = Object.values(formData).every(field => field.trim() !== '');
        
        if (!allFieldsFilled) {
            setErrors(prev => ({ ...prev, general: 'Please fill in all fields.' }));
            return;
        }

        if (!isValid) {
            setErrors(prev => ({ ...prev, general: 'Please fix the errors before submitting.' }));
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/`, formData);
            const { access_token, username: user, id, email: userEmail, phone_number, date_of_birth } = response.data;
            
            // Store token and user data in localStorage
            localStorage.setItem('token', access_token);
            localStorage.setItem('user', JSON.stringify({ 
                id, 
                username: user, 
                email: userEmail, 
                phone_number, 
                date_of_birth 
            }));
            
            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            console.error('Signup error:', error);
            setErrors(prev => ({ 
                ...prev, 
                general: error.response?.data?.error || error.response?.data?.message || 'Signup failed. Please try again.' 
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="signup-form">
            {errors.general && (
                <div className="error-message general-error">
                    {errors.general}
                </div>
            )}
            
            {[
                { name: 'username', type: 'text', label: 'Username' },
                { name: 'email', type: 'email', label: 'Email' },
                { name: 'phoneNumber', type: 'tel', label: 'Phone Number' },
                { name: 'dateOfBirth', type: 'date', label: 'Date of Birth' },
                { name: 'password', type: 'password', label: 'Password' },
                { name: 'confirmPassword', type: 'password', label: 'Confirm Password' },
            ].map(({ name, type, label }) => (
                <div className="form-group" key={name}>
                    <label htmlFor={name}>{label}</label>
                    <input
                        type={type}
                        name={name}
                        id={name}
                        value={formData[name]}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                    />
                    {errors[name] && <small className="error">{errors[name]}</small>}
                </div>
            ))}

            <div className="modal-buttons">
                <button 
                    type="submit" 
                    className="submit-button"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Signing Up...' : 'Sign Up'}
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
    );
};

export default SignUpForm;