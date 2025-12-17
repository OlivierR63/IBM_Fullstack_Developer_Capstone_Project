import React from 'react';
import Header from '../Header/Header'; // Import the dedicated Header component
// Import images from the src/images/ directory using relative path
import carsImage from '../../images/cars.jpeg';
import contactUsImage from '../../images/contactus.png';


const Contact = () => {

    // --- Custom styles converted to JavaScript objects (Inline Styles) ---

    // Equivalent to the .full-container CSS class
    const fullContainerStyle = {
        margin: '15px 0', // Uniform top and bottom margins
        width: '90vw',
        height: 'calc(80vh - 30px)', // Adjusts height taking into account the margins
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        overflow: 'hidden',
        borderRadius: '35px',
        boxShadow: '4px 0 8px rgba(0,0,0,0.5)',
        backgroundColor: 'white',
    };

    // Equivalent to the .upper-container CSS class
    const upperContainerStyle = {
        display: 'flex',
        height: '50%',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    };

    // Equivalent to the .lower-container CSS class
    const lowerContainerStyle = {
        height: '50%',
        overflow: 'hidden',
        display: 'flex',
        position: 'relative',
    };

    const lowerHalfStyle = { // Base style for lower-left and lower-right
        width: '50%',
        overflow: 'hidden',
    };

    // Equivalent to the .lower-left CSS class
    const lowerLeftStyle = {
        ...lowerHalfStyle,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        objectFit: 'contain',
    };

    // Equivalent to the .lower-left-inner CSS class
    const lowerLeftInnerStyle = {
        display: 'flex',
        height: '90%',
        width: '100%',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        objectFit: 'contain',
        borderRight: '5px solid blue',
    };

    // Equivalent to the .lower-right CSS class
    const lowerRightStyle = {
        ...lowerHalfStyle,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        overflow: 'hidden',
        padding: '10px 0',
    };

    // Combined image styles for the upper container
    const upperImageStyle = {
        maxWidth: '100%',
        width: 'auto',
        height: '90%',
        objectFit: 'contain'
    };

    // Combined image styles for the lower container
    const lowerImageStyle = {
        maxWidth: '100%',
        width: 'auto',
        height: '100%',
        objectFit: 'contain'
    };

    // --- JSX RENDER ---
    return (
        // Use a React Fragment since the <html> and <body> root elements are managed by index.html
        <>
            {/* 1. Inclusion of the Header component (replaces the static navbar) */}
            <Header />

            {/* 2. Conversion of the page body content */}
            <div style={fullContainerStyle}>

                {/* Upper Container */}
                <div style={upperContainerStyle}>
                    <img
                        className="img-fluid" // Use className instead of class
                        src={carsImage} // Use the imported image variable
                        alt="Parking area of the dealership"
                        style={upperImageStyle}
                    />
                </div>

                {/* Lower Container */}
                <div style={lowerContainerStyle}>
                    <div style={lowerLeftStyle}>
                        <div style={lowerLeftInnerStyle}>
                            <img
                                className="img-fluid"
                                src={contactUsImage} // Use the imported image variable
                                alt="Hotline call signage or contact icon"
                                style={lowerImageStyle}
                            />
                        </div>
                    </div>

                    <div style={lowerRightStyle}>
                        <div style={{ fontSize: '20px', color: 'blue' }}>
                            <strong>Contact Customer Service</strong><br />
                            support@bestcars.com<br />
                            <strong>Contact our National Advertising Team</strong><br />
                            NationalSales@bestcars.com<br />
                            <strong>Contact our Public Relations team</strong><br />
                            PR@bestcars.com<br />
                            <strong>Contact the bestcars.com offices</strong><br />
                            312-011-1111<br />
                            <strong>Become a bestcars.com car dealer</strong><br />
                            <strong>Visit growwithbestcars.com</strong>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Contact;