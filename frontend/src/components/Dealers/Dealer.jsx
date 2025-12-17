import React, { useState,useEffect, useCallback} from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import positive_icon from "../assets/positive.png"
import neutral_icon from "../assets/neutral.png"
import negative_icon from "../assets/negative.png"
import review_icon from "../assets/reviewbutton.png"
import Header from '../Header/Header';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dealer = () => {
    // State management for data and UI
    const [loading, setLoading] = useState(true);
    const [dealer, setDealer] = useState({});
    const [reviews, setReviews] = useState([]);
    const [unreviewed, setUnreviewed] = useState(false);

    // Extract Id from URL parameters
    const { id } = useParams();

    // Define base DJANGO URL (Consistent with Dealers.jsx)
    const DJANGO_URL = process.env.REACT_APP_DJANGO_URL || "http:localhost:8000";
    const normalized_DJANGO_URL = DJANGO_URL.replace(/\/$/, '');  // Remove trailing slash if present, to avoid double slashes

    // Construct API URLs
    const dealerDetailUrl = `${normalized_DJANGO_URL}/djangoapp/dealer/${id}`;
    const reviewListUrl = `${normalized_DJANGO_URL}/djangoapp/reviews/dealer/${id}`;
    const postReviewUrl = `/postreview/${id}`;

    // Check if the user is logged in
    const isLoggedIn = sessionStorage.getItem("username") != null;

    // Helper function to return the correct sentiment icon
    const senti_icon = (sentiment) => {
        let icon = sentiment === "positive" ? positive_icon :
            sentiment === "negative" ? negative_icon : neutral_icon;
        return icon;
    }

    // Data fetching function (using useCallback to memoize the function)
    const fetchDealerData = useCallback(async () => {
        setLoading(true);
        try {
            // API Call 1: Fetch dealer details
            const dealerResponse = await axios.get(dealerDetailUrl);
            const dealerData = dealerResponse.data;
            if (dealerData.status === 200 && dealerData.dealer.length > 0) {
                setDealer(dealerData.dealer[0]);
            } else {
                setDealer({});
            }

            // API Call 2: Fetch reviews for the dealer
            const reviewsResponse = await axios.get(reviewListUrl);
            const reviewsData = reviewsResponse.data;
            if (reviewsData.status === 200 && reviewsData.reviews.length > 0) {
                setReviews(reviewsData.reviews);
                setUnreviewed(false);
            } else {
                setReviews([]);
                setUnreviewed(true);
            }
        } catch (error) {
            console.error("Error fetching dealer data:", error);
        } finally {
            setLoading(false); // End loading state
        }
    }, [dealerDetailUrl, reviewListUrl]); // Dependancy array : URLs are stable for the component's lifecycle

    // Effect Hook : Run once after initial render to fetch data
    useEffect(() => {
        fetchDealerData();
    }, [fetchDealerData]);

    // Render loading state (Early return)
    if (loading) {
        return (
            < div >
                <Header />
                <div style={{ margin: "20px" }}>
                    <h4>Loading Dealer details and reviews...</h4>
                </div>
            </div >

        );
    }

    // Main component render after data is loaded
    return(
        <div style={{margin:"20px"}}>
            <Header />

            <div className = 'container'>
                <div style={{marginTop:"10px"}}>
                    <h1 style={{color:"grey"}}>
                        {dealer.full_name}
                    </h1>
                    <h4  style={{color:"grey"}}>
                        {dealer['city']},{dealer['address']}, Zip - {dealer['zip']}, {dealer['state']} 
                    </h4>
                </div>

                {/* Link to Search Cars page */ }
                <Link to={`/searchcars/${id}`}>Search Cars</Link>

                {/* Link to Post Review (only visible if logged in) */}
                {isLoggedIn && (
                    <div style={{ marginTop: "10px" }}>
                        <Link to={postReviewUrl}>
                            <img src={review_icon} className="review_icon" />
                            Post a review
                        </Link>
                    </div>
                )}

                <div className="reviews_panel">
                    {/* Conditional rendering for reviews */}
                    {unreviewed ? (
                        <div> No reviews available for this dealer.</div>
                    ) : (
                        reviews.map((review) => (
                            <div key={review.id} className='review_panel'>
                                <img src={senti_icon(review.sentiment)} className="emotion_icon" alt='Sentiment' />
                                <div className='review'>{review.review}</div>
                                <div className="reviewer">
                                    {review.name} - {review.car_make} {review.car_model} {review.car_year}
                                </div>
                            </div>
                        ))
                    )}
                </div> 
            </div>
        </div>
    )
}

export default Dealer
