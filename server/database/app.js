/**
 * DATABASE API SERVER (Node.js/Express)
 * This service handles communication between the Django Backend and the MongoDB database.
 * It manages the database connection, initial data population, and CRUD operations via Express routes.
 */

// --- MODULE IMPORTS & SETUP ---

const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors'); // Middleware to allow cross-origin requests (essential for microservices)
const app = express();
const port = 3030; // Internal port exposed by this Docker service

// Configure Express middleware
app.use(cors()); // Enable CORS for all routes
// Use body-parser configuration to handle URL-encoded form data (though JSON parsing is handled later)
app.use(require('body-parser').urlencoded({ extended: false }));

// --- DATA INITIALIZATION ---

// Synchronously load static JSON data files into memory
const reviews_data = JSON.parse(fs.readFileSync("./data/reviews.json", 'utf8'));
const dealerships_data = JSON.parse(fs.readFileSync("./data/dealerships.json", 'utf8'));

// Connect to MongoDB using Mongoose.
// 'mongo_db' is the service name defined in docker-compose.yaml (Docker network hostname).
mongoose.connect("mongodb://mongo_db:27017/", { 'dbName': 'dealershipsDB' });

// Import Mongoose Models (Schemas)
// These models are used to interact with the respective MongoDB collections.
const Reviews = require('./review');
const Dealerships = require('./dealership');

// Data Population Logic: Clears and re-inserts initial data on every restart
try {
    // Delete all existing review documents, then insert the initial set of reviews
    Reviews.deleteMany({}).then(() => {
        Reviews.insertMany(reviews_data.reviews);
    });
    // Delete all existing dealership documents, then insert the initial set of dealerships
    Dealerships.deleteMany({}).then(() => {
        Dealerships.insertMany(dealerships_data.dealerships);
    });

} catch (error) {
    // Note: This catch block will only handle synchronous errors during the setup phase.
    res.status(500).json({ error: 'Error fetching documents' });
}

// --- EXPRESS API ROUTES (Endpoints for Django) ---

// Express route to home/base URL
app.get('/', async (req, res) => {
    res.send("Welcome to the Mongoose API"); // Simple confirmation endpoint
});

// Express route to fetch all reviews
app.get('/fetchReviews', async (req, res) => {
    try {
        // Retrieve all documents from the Reviews collection
        const documents = await Reviews.find();
        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching documents' });
    }
});

// Express route to fetch reviews by a particular dealer ID
app.get('/fetchReviews/dealer/:id', async (req, res) => {
    try {
        // Find reviews where the 'dealership' field matches the ID passed in the URL parameter
        const documents = await Reviews.find({ dealership: req.params.id });
        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching documents' });
    }
});

// Express route to fetch all dealerships
app.get('/fetchDealers', async (req, res) => {
    try {
        // Retrieve all documents from the Dealerships collection
        const dealers = await Dealerships.find();
        res.json(dealers);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching dealers' });
    }
});

// Express route to fetch Dealers by a particular state (e.g., /fetchDealers/Texas)
app.get('/fetchDealers/:state', async (req, res) => {
    try {
        // Find dealers where the 'state' field matches the state passed in the URL parameter
        const dealers = await Dealerships.find({ state: req.params.state });
        res.json(dealers);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching dealers' });
    }
});

// Express route to fetch dealer by a particular ID (e.g., /fetchDealer/5)
app.get('/fetchDealer/:id', async (req, res) => {
    try {
        // Find dealers where the 'id' field matches the ID passed in the URL parameter
        const dealers = await Dealerships.find({ id: req.params.id });
        res.json(dealers);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching dealers' });
    }
});

// Express route to insert a new review
// Uses express.raw() middleware to read the request body before JSON parsing
app.post('/insert_review', express.raw({ type: '*/*' }), async (req, res) => {
    data = JSON.parse(req.body);

    // Find the current highest ID and increment it to generate a new unique ID
    const documents = await Reviews.find().sort({ id: -1 });
    let new_id = documents[0].id + 1;

    // Create a new Mongoose document instance using the Reviews Model
    const review = new Reviews({
        "id": new_id,
        "name": data.name,
        "dealership": data.dealership,
        "review": data.review,
        "purchase": data.purchase,
        "purchase_date": data.purchase_date,
        "car_make": data.car_make,
        "car_model": data.car_model,
        "car_year": data.car_year,
    });

    try {
        // Save the new review document to the MongoDB collection
        const savedReview = await review.save();
        res.json(savedReview);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error inserting review' });
    }
});

// --- SERVER START ---

// Start the Express server, listening on the internal port 3030
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
