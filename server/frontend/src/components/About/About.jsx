import React from 'react';
import Header from '../Header/Header'; // Import the reusable Header component
// Import team member images from src/images/ directory
import JoeImage from '../../images/Joe.jpg';
import JackImage from '../../images/Jack.jpg';
import PeggyImage from '../../images/Peggy.jpg';

const About = () => {
    return (
        // Use a React Fragment to wrap the content, as the root HTML elements are managed by index.html
        <>
            {/* 1. Include the Header (replaces the static navbar from About.html) */}
            <Header />

            {/* 2. Main content section, converted from the static HTML body */}
            <div className="card" style={{ width: '80%', margin: 'auto', marginTop: '5%' }}>

                {/* 'About Us' section header */}
                <div className="banner" name="about-header">
                    <h1>About Us</h1>
                    Welcome to Best Cars dealership, home to the best cars in North America. We deal in sale of domestic and imported cars at reasonable prices.
                </div>

                {/* Team member cards container (Flex layout) */}
                <div style={{ display: 'flex', flexDirection: 'row', margin: 'auto' }}>

                    {/* Card for Joe GOLD (CEO) */}
                    <div className="card" style={{ width: '30%' }}>
                        {/* Use the imported variable for the image source */}
                        <img className="card-img-top" src={JoeImage} alt="Joe GOLD, CEO" />
                        <div className="card-body">
                            <p className="title">Joe GOLD</p>
                            <p><strong>CEO</strong></p>
                            <p className="card-text">Joe's the boss. He does nothing, lets nothing be done, makes everything be done.</p>
                            <p><em>jgold@example.com</em></p>
                        </div>
                    </div>

                    {/* Card for Jack DALTON (Head of Sales) */}
                    <div className="card" style={{ width: '30%' }}>
                        {/* Use the imported variable for the image source */}
                        <img className="card-img-top" src={JackImage} alt="Jack DALTON, Head of Sales" />
                        <div className="card-body">
                            <p className="title">Jack DALTON</p>
                            <p><strong>Head of Sales</strong></p>
                            <p className="card-text">Responsible for the company's pricing policy</p>
                            <p><em>jdalton@example.com</em></p>
                        </div>
                    </div>

                    {/* Card for Peggy SUE (Head of finances) */}
                    <div className="card" style={{ width: '30%' }}>
                        {/* Use the imported variable for the image source */}
                        <img className="card-img-top" src={PeggyImage} alt="Peggy SUE, Head of finances" />
                        <div className="card-body">
                            <p className="title">Peggy SUE</p>
                            <p><strong>Head of finances</strong></p>
                            <p className="card-text">Avoid asking her for a raise</p>
                            <p><em>psue@example.com</em></p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default About;