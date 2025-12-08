/**
 * DEALERSHIP Mongoose Schema Definition
 * This file defines the structure, data types, and validation rules
 * for the 'dealerships' collection in the MongoDB database.
 */

const mongoose = require('mongoose');

// Get the Schema class from mongoose
const Schema = mongoose.Schema;

// Define the schema for the 'dealerships' documents
const dealerships = new Schema({
    // Unique identifier for the dealership (used for linking reviews)
    id: {
        type: Number,
        required: true,
    },

    // The city where the dealership is located
    city: {
        type: String,
        required: true
    },

    // The state where the dealership is located (e.g., "Texas", "California")
    state: {
        type: String,
        required: true
    },

    // The physical street address of the dealership
    address: {
        type: String,
        required: true
    },

    // The postal code of the dealership's location
    zip: {
        type: String,
        required: true
    },

    // Latitude coordinate of the dealership's location
    // (stored as String for consistency / precision)
    lat: {
        type: String,
        required: true
    },

    // Longitude coordinate of the dealership's location
    // (stored as String for consistency / precision)
    long: {
        type: String,
        required: true
    },

    // A short, abbreviated name for the dealership (optional field)
    short_name: {
        type: String,
        // 'required: false' is implied if not present
    },

    // The complete, official name of the dealership
    full_name: {
        type: String,
        required: true
    }
});

/**
 * Export the Mongoose Model.
 * This model allows the Node.js application (app.js) to interact with the MongoDB collection.
 * The first argument ('dealerships') defines the name of the collection in the database.
 */
module.exports = mongoose.model('dealerships', dealerships);
