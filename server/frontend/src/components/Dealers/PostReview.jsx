import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import axios from 'axios'; // Import Axios for consistent HTTP requests
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';


const PostReview = () => {
    // --- STATE MANAGEMENT ---
    const [dealer, setDealer] = useState({});
    const [review, setReview] = useState("");

    // carModelSelection holds the combined string "Make Model" from the select input
    const [carModelSelection, setCarModelSelection] = useState("");
    const [year, setYear] = useState("");
    const [date, setDate] = useState("");
    const [carmodels, setCarmodels] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- HOOKS & CONSTANTS ---
    // Extract ID using destructuring
    const { id } = useParams();
    const navigate = useNavigate(); // Hook for programmatic navigation

    // Define base DJANGO URL using environment variable (robustness)
    const DJANGO_URL = process.env.REACT_APP_DJANGO_URL || "http:localhost:8000";
    const normalized_DJANGO_URL = DJANGO_URL.replace(/\/$/, '');  // Remove trailing slash if present, to avoid double slashes

    // Construct API URLs
    const dealerDetailUrl = `${normalized_DJANGO_URL}/djangoapp/dealer/${id}`;
    const addReviewUrl = `${normalized_DJANGO_URL}/djangoapp/add_review`;
    const carModelsUrl = `${normalized_DJANGO_URL}/djangoapp/get_cars`;

    // Check if the user is logged in (required to post a review)
    const isLoggedIn = sessionStorage.getItem("username") != null;
    const currentYear = new Date().getFullYear();

    // --- DATA FETCHING FUNCTION ---
    // Fetch initial dealer and car models data (memoized)
    const fetchInitialData = useCallback(async () => {
        if (!isLoggedIn) {
            alert("You must be logged in to post a review.");
            navigate('/login');
            return;
        }
        setLoading(true);

        try {
            // API Call 1: Fetch Dealer Details (to display the dealer's name)
            const dealerResponse = await axios.get(dealerDetailUrl);
            const dealerData = dealerResponse.data;
            if (dealerData.status === 200 && dealerData.dealer.length > 0) {
                setDealer(dealerData.dealer[0]);
            }

            // API Call 2: Fetch Car Models (to populate the dropdown list)
            const carsResponse = await axios.get(carModelsUrl);
            const carsData = carsResponse.data;

            // Note: Assuming Django returns the car models list under the key 'CarModels'
            if (carsResponse.status === 200) {
                setCarmodels(carsData.CarModels);
            }

        } catch (error) {
            console.error("Error loading initial data:", error);
            // In a real app, display an error to the user

        } finally {
            setLoading(false);
        }
    }, [dealerDetailUrl, carModelsUrl, isLoggedIn, navigate]);

    // Effect hook to run data fetching once on mount
    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);


    // --- REVIEW POSTING FUNCTION ---
    const postReview = async (e) => {
        e.preventDefault(); // Prevent default form submission

        // 1. Get user identity: use username if first/last name are not available
        let name = sessionStorage.getItem("firstname") + " " + sessionStorage.getItem("lastname");
        if (name.includes("null") || !name.trim()) {
            name = sessionStorage.getItem("username");
        }

        // 2. Data Validation
        if (review === "" || date === "" || year === "" || carModelSelection === "") {
            alert("Please fill in all review fields (Review Text, Purchase Date, Car Model, and Car Year).");
            return;
        }

        // 3. Extract car make and model from the selected string ("Make Model")
        // Note: This relies on the convention of the carModels array from the Django API.
        const [car_make, car_model] = carModelSelection.split(" ");

        // 4. Construct payload (using snake_casing for Django API consistency)
        const payload = {
            review: review,
            car_make: car_make,
            car_model: car_model,
            car_year: year,
            purchase_date: date,
            dealer_id: id,
            name: name,
        };

        // 5. API Call (POST request using axios)
        try {
            console.log("addReviewUrl = ", addReviewUrl);
            console.log("Review payload =", payload);
            const res = await axios.post(addReviewUrl, payload);
            console.log("Review post response data:", res.data);

            if (res.data.status === 200) {
                alert("Review submitted successfully!");
                // Redirect back to the dealer detail page after success
                navigate(`/dealer/${id}`);
            } else {
                alert(`Review submission failed: ${res.data.message || 'Server error'}`);
            }
        } catch (error) {
            console.error("Review posting failed:", error);
            alert(`An error occurred while posting the review. Please check the console.`);
        }
    };

    // --- RENDER LOGIC ---

    // Render loading state (Early Return)
    if (loading) {
        return (
            <div>
                <Header />
                <div style={{ margin: "20px" }}>
                    <h2>Loading form data...</h2>
                </div>
            </div>
        );
    }

    // Main component render
    return (
        <div>
            <Header />
            <div style={{ margin: "5%" }}>
                <h1 style={{ color: "darkblue" }}>Post a Review for {dealer.full_name}</h1>

                {/* Use a proper HTML form to handle submission via 'Enter' key and 'Submit' button */}
                <form onSubmit={postReview}>

                    {/* Review Text Area */}
                    <textarea
                        id='review'
                        cols='50'
                        rows='7'
                        onChange={(e) => setReview(e.target.value)}
                        placeholder='Type your review here...'
                    ></textarea>

                    {/* Purchase Date Input */}
                    <div className='input_field'>
                        Purchase Date <input type="date" onChange={(e) => setDate(e.target.value)} required />
                    </div>

                    {/* Car Make/Model Select Input */}
                    <div className='input_field'>
                        Car Make and Model
                        <select
                            name="cars"
                            id="cars"
                            onChange={(e) => setCarModelSelection(e.target.value)}
                            value={carModelSelection}
                            required
                        >
                            <option value="" disabled hidden>Choose Car Make and Model</option>
                            {/* Map over car models fetched from the API */}
                            {carmodels.map(carmodel => (
                                <option
                                    key={`${carmodel.CarMake}-${carmodel.CarModel}`}
                                    // Combine Make and Model into one value for simplicity
                                    value={`${carmodel.CarMake} ${carmodel.CarModel}`}
                                >
                                    {carmodel.CarMake} {carmodel.CarModel}
                                </option>
                            ))}
                        </select>
                    </div >

                    {/* Car Year Input */}
                    <div className='input_field'>
                        Car Year <input
                            type="number"
                            onChange={(e) => setYear(e.target.value)}
                            max={currentYear} // Set max year to current year
                            min={2015}
                            placeholder="e.g., 2023"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <div>
                        {/* Type submit is crucial for triggering the form's onSubmit event */}
                        <button className='postreview' type="submit">Post Review</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default PostReview