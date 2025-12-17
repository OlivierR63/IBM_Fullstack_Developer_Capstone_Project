import React, { useState, useEffect, useCallback } from 'react';
import "./Dealers.css";
import "../assets/style.css";
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../Header/Header';
import review_icon from "../assets/reviewicon.png"

const Dealers = () => {
    const [dealersList, setDealersList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [originalDealers, setOriginalDealers] = useState([]);
    const isLoggedIn = sessionStorage.getItem("username") != null;

    const DJANGO_URL = process.env.REACT_APP_DJANGO_URL || "http:localhost:8000";
    const normalized_DJANGO_URL = DJANGO_URL.replace(/\/$/, '');  // Remove trailing slash if present, to avoid double slashes
    const dealer_url = `${normalized_DJANGO_URL}/djangoapp/get_dealers/`;

    // Function for handling changes in search input
    const handleInputChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        const filtered = originalDealers.filter(dealer =>
            dealer.state.toLowerCase().includes(query.toLowerCase())
          );
        setDealersList(filtered);
    };

    // Function to manage the loss of focus of the search input
    const handleLostFocus = () =>{
        if (!searchQuery){
            setDealersList(originalDealers);
        }
    };

    // Function to retrieve dealers from the API
    const fetchDealers = useCallback(async () => {
        try {
            const response = await axios.get(dealer_url);
            const responseData = response.data;

            // Votre logique de mise à jour de l'état (à vérifier)
            if (responseData.dealers && Array.isArray(responseData.dealers)) {
                setDealersList(responseData.dealers);
            } else {
                setDealersList([]);
            }
            setOriginalDealers(responseData);

        } catch (error) {
            console.error("Erreur lors du chargement des concessionnaires:", error);
        }
    }, [dealer_url])
    
    useEffect(() => {
        fetchDealers();
    },[fetchDealers]);  

    return(
    <div>
        <Header/>

        <div className='container'>
            <table className='table'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Dealer Name</th>
                        <th>City</th>
                        <th>Address</th>
                        <th>Zip</th>
                        <th>
                            <input type="text"
                                    placeholder="Search states..."
                                    onChange={handleInputChange}
                                    onBlur={handleLostFocus}
                                    value={searchQuery}
                                    />       
                        </th>
                        {
                            isLoggedIn && (
                                <th>Review Dealer</th>
                            )
                        }
                    </tr>
                </thead>
                <tbody>
                    {dealersList.map(dealer => (
                        <tr key={dealer.id}>
                            <td>{dealer.id}</td>
                            <td><Link to={`/dealer/${dealer.id}`}>{dealer.full_name}</Link></td>
                            <td>{dealer.city}</td>
                            <td>{dealer.address}</td>
                            <td>{dealer.zip}</td>
                            <td>{dealer.state}</td>
                            {
                                isLoggedIn && (
                                    <td>
                                        <Link to={`/postreview/${dealer.id}`}>
                                            <img src={review_icon} className="review_icon" alt="Post Review"/>
                                        </Link>
                                    </td>
                                )
                            }
                        </tr>
                    ))}
                </tbody>
            </table>;
        </div>
    </div>
    )
}

export default Dealers
