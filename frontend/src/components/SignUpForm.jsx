import React, { useState } from 'react';
import axios from 'axios';

const SignUpForm = ({onSuccess}) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phoneNumber: '',
        dateOfBirth: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({});

    const validate = (name, value) => {
        const newErrors = { ...errors };

        if (name === 'username') {
            newErrors.username = value.length < 3 ? 'Username must be at least 3 characters' : '';
        }

        if (name === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            newErrors.email = !emailRegex.test(value) ? 'Invalid email address' : '';
        }

        if (name === 'phoneNumber') {
            const phoneRegex = /^\d{9,14}$/;
            newErrors.phoneNumber = phoneRegex.test(formData.phoneNumber)
                ? ''
                : 'Phone number must be between 9 and 14 digits.';
        }

        if (name === 'password') {
            const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
            newErrors.password = passwordRegex.test(value)
                ? ''
                : 'Password must be at least 8 characters, include a number and a special character.';
        }

        if (name === 'confirmPassword') {
            newErrors.confirmPassword =
                value !== formData.password ? 'Passwords do not match' : '';
        }

        if (name === 'dateOfBirth') {
            const today = new Date();
            const dob = new Date(value);
            const age = today.getFullYear() - dob.getFullYear();
            const m = today.getMonth() - dob.getMonth();
            const d = today.getDate() - dob.getDate();

            const isOldEnough =
                age > 18 ||
                (age === 18 && (m > 0 || (m === 0 && d >= 0)));

            newErrors.dateOfBirth = isOldEnough ? '' : 'You must be at least 18 years old.';

        }

        setErrors(newErrors);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        validate(name, value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const allErrors = Object.values(errors).filter(Boolean);
        if (allErrors.length === 0 && Object.values(formData).every(Boolean)) {
            console.log('Form submitted', formData);
            try {
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/`, {
                    formData
                });
                const { access_token, username: user, id, email: userEmail, phone_number, date_of_birth } = response.data;
                // Store token and user data in localStorage
                localStorage.setItem('token', access_token);
                localStorage.setItem('user', JSON.stringify({ id, username: user, email: userEmail, phone_number, date_of_birth }));
                onSuccess(); // Call onSuccess callback
            } catch (error) {
                setErrors({ general: error.response?.data?.error || 'Signup failed' });
            }
        } else {
            alert('Please fix the errors before submitting.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="signup-form">
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
                    />
                    {errors[name] && <small className="error">{errors[name]}</small>}
                </div>
            ))}

            <button type="submit" className="submit-button">
                Sign Up
            </button>
        </form>
    );
};

export default SignUpForm;
