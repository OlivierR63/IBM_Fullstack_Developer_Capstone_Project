import React from 'react';
import Header from '../Header/Header'; // Import the dedicated Header component
import carDealershipImage from "../../images/car_dealership.jpg";
import { Link } from 'react-router-dom'; // Import Link for internal navigation


const Home = () => {
    return (
        <div>
            {/* The Header component contains the navigation bar and the authentication logic
                (Login/Logout/Register) managed by React Hooks (useState/useEffect).*/}
            <Header />

            {/* Main content section, converted from the old Home.html body */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="card" style={{ width: '50%', marginTop: '50px', alignSelf: 'center' }}>

                    {/* Image element from the original HTML. Path 'static/' needs to be 
            resolvable by the Webpack/Vite configuration for the React build. */}
                    <img src={carDealershipImage} className="card-img-top" alt="Car Dealership" />

                    <div className="banner">
                        <h5>Welcome to our Dealerships!</h5>

                        {/* Link to the Dealers route. Using a standard <a> tag with href="/dealers" 
                            allows React Router to intercept the navigation internally. */}
                        <Link to="/dealers" className="btn" style={{ backgroundColor: 'aqua', margin: '10px' }}>View Dealerships</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;