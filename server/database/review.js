/**
 * REVIEW Mongoose Schema Definition
 * This file defines the structure, data types, and validation rules
 * for the 'reviews' collection in the MongoDB database.
 */

const mongoose = require('mongoose');

// Get the Schema class from mongoose
const Schema = mongoose.Schema;

// Define the schema for the 'reviews' documents
const reviews = new Schema({
    // Unique identifier for the review document itself (separate from MongoDB's default _id)
    id: {
        type: Number,
        required: true,
    },

    // The name of the user who submitted the review
    name: {
        type: String,
        required: true
    },

    // Identifier linking the review to a specific dealership
    dealership: {
        type: Number,
        required: true,
    },

    // The main body text of the review
    review: {
        type: String,
        required: true
    },

    // Boolean flag indicating if the review is associated with a recent purchase
    purchase: {
        type: Boolean,
        required: true
    },

    // Date of the car purchase (required if 'purchase' is true, although currently always required)
    purchase_date: {
        type: String, // Storing as String might be simpler for non-date validation
        required: true
    },

    // Make of the car purchased (e.g., "Honda", "Ford")
    car_make: {
        type: String,
        required: true
    },

    // Model of the car purchased (e.g., "Civic", "F-150")
    car_model: {
        type: String,
        required: true
    },

    // Year the car was manufactured (e.g., 2023)
    car_year: {
        type: Number,
        required: true
    },

});

/**
 * Export the Mongoose Model.
 * This model allows the Node.js application (app.js) to interact with the MongoDB collection.
 * The first argument ('reviews') defines the name of the collection in the database.
 */
module.exports = mongoose.model('reviews', reviews);
