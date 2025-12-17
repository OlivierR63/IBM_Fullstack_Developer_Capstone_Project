import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'; // Import Axios for consistent HTTP requests
import Header from '../Header/Header';

const SearchCars = () => {
    // --- STATE MANAGEMENT ---
    const [cars, setCars] = useState([]);
    const [originalCars, setOriginalCars] = useState([]); // Stores the full original inventory
    const [makes, setMakes] = useState([]);
    const [models, setModels] = useState([]);
    const [dealer, setDealer] = useState({ "full_name": "" });
    const [message, setMessage] = useState("Loading Cars ...");
    const [loading, setLoading] = useState(true);

    // --- HOOKS & CONSTANTS ---
    // 1. Extract ID using destructuring
    const { id } = useParams();

    // 2. Define base DJANGO URL (Robustness via environment variable)
    const DJANGO_URL = process.env.REACT_APP_DJANGO_URL || "http:localhost:8000";
    const normalized_DJANGO_URL = DJANGO_URL.replace(/\/$/, '');  // Remove trailing slash if present, to avoid double slashes

    // 3. Construct API URLs
    const dealerDetailUrl = `${normalized_DJANGO_URL}/djangoapp/dealer/${id}`;
    const inventoryUrl = `${normalized_DJANGO_URL}/djangoapp/get_inventory/${id}`;

    // --- HELPER FUNCTION ---
    // Function to populate the Makes and Models dropdowns
    const populateMakesAndModels = (carList) => {
        let tmpmakes = [];
        let tmpmodels = [];
        carList.forEach((car) => {
            tmpmakes.push(car.make);
            tmpmodels.push(car.model);
        });
        // Use Set to ensure unique values, then convert back to Array for state
        setMakes(Array.from(new Set(tmpmakes)));
        setModels(Array.from(new Set(tmpmodels)));
    };

    // --- DATA FETCHING FUNCTION (using useCallback and axios) ---
    const fetchInitialData = useCallback(async () => {
        setLoading(true);
        setMessage("Loading Cars ...");

        try {
            // API Call 1: Fetch Dealer Details
            const dealerResponse = await axios.get(dealerDetailUrl);
            if (dealerResponse.data.status === 200 && dealerResponse.data.dealer.length > 0) {
                setDealer({ "full_name": dealerResponse.data.dealer[0].full_name });
            }

            // API Call 2: Fetch Car Inventory
            console.log("Function SearchCars.jsx : Fetching car inventory from ", inventoryUrl);
            const inventoryResponse = await axios.get(inventoryUrl);
            console.log("Inventory response data:", inventoryResponse.data);
            const carList = inventoryResponse.data.cars;
            console.log("Fetched car inventory:", carList);

            if (inventoryResponse.data.status === 200 && carList.length > 0) {
                setOriginalCars(carList);
                setCars(carList);
                populateMakesAndModels(carList);
                setMessage("");
            } else {
                setCars([]);
                setOriginalCars([]);
                setMessage("No cars found in this dealer's inventory.");
            }
        } catch (error) {
            console.error("Error loading car data:", error);
            setMessage("An error occurred while loading the inventory.");
        } finally {
            setLoading(false);
        }
    }, [dealerDetailUrl, inventoryUrl]);

    // --- FILTERING LOGIC ---

    const SearchCarsByMake = useCallback((e) => {
        const selected_make = e.target.value;
        if (selected_make === 'all') {
            setCars(originalCars);
        } else {
            const filteredCars = originalCars.filter(car => car.make === selected_make);
            setCars(filteredCars);
        }
    }, [originalCars]);

    const SearchCarsByModel = useCallback((e) => {
        const selected_model = e.target.value;
        if (selected_model === 'all') {
            setCars(originalCars);
        } else {
            const filteredCars = originalCars.filter(car => car.model === selected_model);
            setCars(filteredCars);
        }
    }, [originalCars]);

    const SearchCarsByPrice = useCallback((e) => {
        const selected_price_range = e.target.value;
        if (selected_price_range === 'all') {
            setCars(originalCars);
            return;
        }

        let minPrice = 0;
        let maxPrice = Infinity;

        // Define price ranges
        switch (selected_price_range) {
            case '20000':
                maxPrice = 20000;
                break;
            case '40000':
                minPrice = 20000;
                maxPrice = 40000;
                break;
            case '60000':
                minPrice = 40000;
                maxPrice = 60000;
                break;
            case '80000':
                minPrice = 60000;
                maxPrice = 80000;
                break;
            case '80001':
                minPrice = 80000;
                maxPrice = Infinity;
                break;
            default:
                break;
        }

        const filteredCars = originalCars.filter(car => {
            const price = parseFloat(car.price);
            return price > minPrice && price <= maxPrice;
        });
        setCars(filteredCars);
    }, [originalCars]);


    // Reset function (uses the original state)
    const reset = () => {
        setCars(originalCars);
        // Optional: Reset select states if managed separately
    };

    // --- EFFECT HOOK ---
    // Call the initial data fetch function once on mount
    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    // --- RENDER LOGIC ---

    if (loading) {
        return (
            <div>
                <Header />
                <div style={{ margin: "20px" }}>
                    <h2>{message}</h2>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Header />
            <div style={{ margin: '10px', marginTop: '20px' }}>
                <h2 style={{ marginLeft: '10px', color: 'darkblue' }}>
                    Inventory for {dealer.full_name}
                </h2>

                {/* Search Filters */}
                <div style={{ display: 'flex', marginLeft: '10px', marginTop: '20px' }}>

                    {/* Filter by Make */}
                    <span>Make: </span>
                    <select name="make" id="make" onChange={SearchCarsByMake} style={{ marginLeft: '10px' }}>
                        <option value='all'> -- All -- </option>
                        {makes.map(make => (
                            <option key={make} value={make}>{make}</option>
                        ))}
                    </select>

                    {/* Filter by Model */}
                    <span style={{ marginLeft: '20px' }}>Model: </span>
                    <select name="model" id="model" onChange={SearchCarsByModel} style={{ marginLeft: '10px' }}>
                        <option value='all'> -- All -- </option>
                        {models.map(model => (
                            <option key={model} value={model}>{model}</option>
                        ))}
                    </select>

                    {/* Filter by Price */}
                    <span style={{ marginLeft: '20px' }}>Price: </span>
                    <select
                        name="price"
                        id="price"
                        style={{ marginLeft: '10px' }}
                        onChange={SearchCarsByPrice}
                    >
                        <option value='all'> -- All -- </option>
                        <option value='20000'>Under 20000</option>
                        <option value='40000'>20000 - 40000</option>
                        <option value='60000'>40000 - 60000</option>
                        <option value='80000'>60000 - 80000</option>
                        <option value='80001'>Over 80000</option>
                    </select>

                    <button style={{ marginLeft: '20px', padding: '5px 10px' }} onClick={reset}>Reset</button>

                </div>

                {/* Display Results */}
                <div style={{ marginLeft: '10px', marginRight: '10px', marginTop: '20px' }} >
                    {cars.length === 0 ? (
                        <p style={{ marginLeft: '10px', marginRight: '10px', marginTop: '20px' }}>{message}</p>
                    ) : (
                        <div>
                            <hr />
                            {cars.map((car) => (
                                <div key={car._id} className="car_card"> {/* Added class for styling */}
                                    <h3>{car.make} {car.model}</h3>
                                    <p>Year: **{car.year}**</p>
                                    <p>Mileage: **{car.mileage}**</p>
                                    <p>Price: **${car.price.toLocaleString('en-US')}**</p>
                                    {/* Add more car details here if needed */}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SearchCars