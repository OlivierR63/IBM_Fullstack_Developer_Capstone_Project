import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import axios from 'axios'; // Import Axios for robust HTTP requests
import "./Register.css";
import user_icon from "../assets/person.png"
import email_icon from "../assets/email.png"
import password_icon from "../assets/password.png"
import close_icon from "../assets/close.png" // This icon might be unnecessary if not used in a modal context
import Header from '../Header/Header'; // Assuming Header is used here as in other components

/**
 * Register Component
 * Handles user registration by collecting credentials and personal information,
 * then submitting them to the Django backend API.
 */
const Register = () => {

    // --- STATE MANAGEMENT ---
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    // Correcting state setter naming convention for consistency: setLastName
    const [lastName, setLastName] = useState("");

    // Hook for programmatic navigation
    const navigate = useNavigate();

    // --- CONFIGURATION & URLS ---
    // Base URL for Django API calls (Robustness via environment variable)
    const DJANGO_URL = process.env.REACT_APP_DJANGO_URL || '';
    const normalized_DJANGO_URL = DJANGO_URL.replace(/\/$/, '');  // Remove trailing slash if present, to avoid double slashes
    const register_url = `${normalized_DJANGO_URL}/djangoapp/register`;

    // --- NAVIGATION FUNCTION ---
    /**
     * Redirects the user to the home page (or login page after successful registration).
     */
    const goToHome = () => {
        navigate('/');
    }

    // --- REGISTRATION LOGIC ---
    /**
     * Handles form submission for user registration.
     * Sends user data via Axios POST request.
     * @param {Event} e - The form submission event.
     */
    const register = async (e) => {
        e.preventDefault(); // Prevent default browser form submission (page reload)

        // Data payload for the registration request (using snake_casing if required by backend, or camelCase)
        const payload = {
            "userName": userName,
            "password": password,
            "firstName": firstName,
            "lastName": lastName,
            "email": email
        };

        try {
            // Send POST request with registration data using Axios
            const res = await axios.post(register_url, payload);

            // Check the 'status' field in the response data from the backend
            if (res.data.status) {
                // Registration successful
                sessionStorage.setItem('username', res.data.userName);
                alert("Registration successful! You are now logged in.");

                // Redirect user to the home page (or login page if desired)
                navigate('/');
            } else {
                // Registration failed based on backend payload
                alert(`Registration failed: ${res.data.message || 'Username or email may already be in use.'}`);
            }
        } catch (error) {
            // Handle network errors or server-side exceptions (4xx/5xx responses)
            console.error("Registration failed:", error);
            const errorMessage = error.response?.data?.message || "An error occurred during registration. Please try again.";
            alert(errorMessage);
        }
    };

    // --- RENDER ---
    return (
        <div>
            <Header />

            {/* Registration Form: Uses register on submission */}
            <form className="register_panel" onSubmit={register}>

                <div className="title">
                    Register
                    {/* Cancel button now uses the navigate hook */}
                    <img src={close_icon} alt="Close" onClick={goToHome} style={{ cursor: 'pointer', float: 'right' }} />
                </div>

                <div className="inputs">
                    {/* Username Input */}
                    <div className="input">
                        <img src={user_icon} className="img_icon" alt='Username' />
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            className="input_field"
                            onChange={(e) => setUserName(e.target.value)}
                            required
                        />
                    </div>

                    {/* First Name Input */}
                    <div>
                        <img src={user_icon} className="img_icon" alt='First Name' />
                        <input
                            type="text"
                            name="first_name"
                            placeholder="First Name"
                            className="input_field"
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>

                    {/* Last Name Input (Corrected setter to setLastName) */}
                    <div>
                        <img src={user_icon} className="img_icon" alt='Last Name' />
                        <input
                            type="text"
                            name="last_name"
                            placeholder="Last Name"
                            className="input_field"
                            onChange={(e) => setLastName(e.target.value)} // setLastName now correct
                            required
                        />
                    </div>

                    {/* Email Input */}
                    <div>
                        <img src={email_icon} className="img_icon" alt='Email' />
                        <input
                            type="email"
                            name="email"
                            placeholder="email"
                            className="input_field"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div className="input">
                        <img src={password_icon} className="img_icon" alt='password' />
                        <input
                            name="psw"
                            type="password"
                            placeholder="Password"
                            className="input_field"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="submit_panel">
                    {/* Submit Button */}
                    <input className="action_button" type="submit" value="Register" />
                </div>
            </form>
        </div>
    );
};

export default Register;