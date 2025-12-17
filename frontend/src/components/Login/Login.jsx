// --- Imports for React and External Libraries ---
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // For routing and programmatic navigation
import axios from 'axios';  // For robust and consistent HTTP requests

// --- Imports for Styles and Components ---
import "./Login.css";
import Header from '../Header/Header';

/**
 * Login Component
 * Handles user authentication by submitting credentials (userName, password)
 * to the Django backend API.
 * Uses React Hooks for state management and navigation.
 */
const Login = () => {

    // --- STATE MANAGEMENT ---
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    // Hook for programmatic navigation
    const navigate = useNavigate();

    // --- CONFIGURATION & URLS ---
    // Base URL for Django API calls (Retrieved from environment variables)
    const DJANGO_URL = process.env.REACT_APP_DJANGO_URL || '';
    const normalized_DJANGO_URL = DJANGO_URL.replace(/\/$/, '');  // Remove trailing slash if present, to avoid double slashes

    // Full URL for the login endpoint
    const login_url = `${normalized_DJANGO_URL}/djangoapp/login`;

    // --- LOGIN LOGIC ---
    /**
     * Handles form submission for user login.
     * Sends credentials via Axios POST request.
     * @param {Event} e - The form submission event.
     */
    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent default browser form submission (page reload)

        try {
            // Send POST request with user credentials
            const res = await axios.post(login_url, {
                "userName": userName,
                "password": password
            });

            // Check the 'status' field in the response data from the backend
            if (res.data.status === "Authenticated") {
                // Store username in session storage upon successful login
                sessionStorage.setItem('username', res.data.userName);
                alert(`Welcome, ${res.data.userName}!`);

                // Redirect user to the home page (path '/')
                navigate('/');
            }
            else {
                // Authentication failed based on backend payload
                alert("The user could not be authenticated.")
            }
        } catch (error) {
            // Handle network errors or server-side exceptions (4xx/5xx responses)
            console.error("Login failed:", error);

            // Extract specific error message from the response object or use a generic one
            const errorMessage = error.response?.data?.message || "An error occurred during login.";
            alert(errorMessage);
        }
    };

    // --- RENDER ---
    return (
        <div>
            <Header />
            {/* Login Form: Uses handleLogin on submission */}
            <form className="login_panel" onSubmit={handleLogin} style={{}}>
                <h3>Login</h3>
                <div>
                    <span className="input_field">Username </span>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        className="input_field"
                        onChange={(e) => setUserName(e.target.value)}
                        required
                    />
                </div>
                <div style={{ marginTop: '10px' }}>
                    <span className="input_field">Password </span>
                    <input
                        name="psw"
                        type="password"
                        placeholder="Password"
                        className="input_field"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div style={{ marginTop: '20px' }}>
                    {/* Submit Button */}
                    <input className="action_button" type="submit" value="Login" />

                    {/* Cancel Button: Navigates back to home page using the navigate hook */}
                    <input
                        className="action_button"
                        type="button"
                        value="Cancel"
                        onClick={() => navigate('/')}
                        style={{ marginLeft: '10px' }}
                    />
                </div>
                {/* Link to the Registration page using React Router's Link component */}
                <Link className="loginlink" to="/register" style={{ display: 'block', marginTop: '15px' }}>Register Now</Link>
            </form>
        </div>
    );
};

export default Login;