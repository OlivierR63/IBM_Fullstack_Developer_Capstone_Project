import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import for making HTTP requests
import { Link } from 'react-router-dom'; // Import Link for navigation


const Header = () => {
    // Get the username from session storage upon component initialization
    const initialUsername = sessionStorage.getItem('username');
    const [currentUser, setCurrentUser] = useState(initialUsername);
    const navigate = useNavigate(); // Hook for programmatic navigation

    // Base URL for Django API calls (should be set in .env as REACT_APP_DJANGO_URL)
    // Fallback to empty string if not defined
    const DJANGO_URL = process.env.REACT_APP_DJANGO_URL || '';
    const normalized_DJANGO_URL = DJANGO_URL.replace(/\/$/, '');  // Remove trailing slash if present, to avoid double slashes

    // --- LOGOUT LOGIC ---
    const logout = async () => {
        let logout_url = `${normalized_DJANGO_URL}/djangoapp/logout`;

        try {
            // Send GET request to the Django logout endpoint
            const res = await axios.get(logout_url);

            if (res.status === 200) {
                // Clear session and local state
                sessionStorage.removeItem('username');
                setCurrentUser(null);

                alert(`Logging out ${initialUsername}...`);

                // Redirect to the home page (path '/')
                navigate('/');

            } else {
                alert("The user could not be logged out.");
            }
        } catch (error) {
            console.error("Logout failed:", error);
            alert("An error occurred during logout.");
        }
    };

    // --- RENDERING AUTH LINKS LOGIC ---
    const renderAuthLinks = () => {
        if (currentUser) {
            // User is logged in: display username and Logout button
            return (
                <>
                    <span className="homepage_links" style={{ marginRight: '10px' }}>{currentUser}</span>
                    {/* Note: onClick calls the JS function, to="#" prevents full page reload */}
                    <Link className="homepage_links" onClick={logout} to="#">Logout</Link>
                </>
            );
        } else {
            // User is logged out: display Login and Register links
            return (
                <>
                    <Link className="homepage_links" to="/login" style={{ marginRight: '10px' }}>Login</Link>
                    <Link className="homepage_links" to="/register">Register</Link>
                </>
            );
        }
    };

    // useEffect hook to synchronize local state after mounting
    // This is the React equivalent of the HTML onload="checkSession()"
    useEffect(() => {
        setCurrentUser(sessionStorage.getItem("username"));
    }, []);


    // --- JSX RENDER OF THE NAVBAR ---
    return (
        <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: 'darkturquoise', height: '1in' }}>
            <div className="container-fluid">
                <h2 style={{ paddingRight: '5%' }}>Dealerships</h2>

                {/* ... Other Bootstrap navigation elements (Toggler button) ... */}
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarText">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {/* Navigation links using "to"" for React Router handling */}
                        <li className="nav-item">
                            <Link className="nav-link active" style={{ fontSize: 'larger' }} aria-current="page" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" style={{ fontSize: 'larger' }} to="/about">About Us</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" style={{ fontSize: 'larger' }} to="/contact">Contact Us</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" style={{ fontSize: 'larger' }} to="/dealers">View Dealers</Link>
                        </li>
                    </ul>

                    <span className="navbar-text">
                        <div className="loginlink" id="loginlogout">
                            {renderAuthLinks()} {/* Call the function to display auth links */}
                        </div>
                    </span>
                </div>
            </div>
        </nav>
    );
};

export default Header;