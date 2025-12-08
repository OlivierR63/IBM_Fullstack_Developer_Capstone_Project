# Car Inventory API Microservice

## Overview

This directory contains a dedicated backend service (a microservice) responsible for managing the application's car inventory data. It is implemented in **Node.js** using the **Express.js framework** and **Mongoose** (an ODM) to interact with a **MongoDB** database.

This service acts as the source of truth for all car-related data, allowing the main Django backend to query inventory based on dealer ID, make, model, year, and price.

## Key Technologies

| Technology | Role |
| :--- | :--- |
| **Node.js / Express.js** | The runtime environment and framework for serving the REST API endpoints. |
| **MongoDB / Mongoose** | The database system (MongoDB) and the Object Data Modeling (Mongoose) library used to manage the car data schema. |
| **CORS** | Configured to allow cross-origin requests, likely from the main Django application. |

## Code Structure and Data Management

| File | Function |
| :--- | :--- |
| **`app.js`** | The main entry point. It handles MongoDB connection, database seeding, and defines all Express API routes. |
| **`inventory.js`** | Defines the **Mongoose Schema** (`cars`) for car records, including fields like `make`, `model`, `year`, `mileage`, and `price`. |
| **`package.json`** | Defines Node.js dependencies (`express`, `mongoose`, `cors`). |
| `mongod.conf` | Configuration file for the underlying MongoDB daemon (e.g., storage engine, network settings). |
| `car_records.json` (Assumed) | The JSON file containing the initial seed data for the inventory. |

### Initial Data Seeding

The `app.js` file is configured to perform the following critical action upon successful connection to MongoDB:
1.  **Clear Existing Data:** `Cars.deleteMany({})`
2.  **Insert Initial Data:** `Cars.insertMany(carsData.cars)` from `car_records.json`.
This ensures a fresh and consistent inventory dataset every time the service is started.

## REST API Endpoints

The service exposes its inventory data via several REST endpoints, running on port **3050** within the Docker network.

| HTTP Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/cars/:id` | Get all cars for a specific dealer ID. |
| `GET` | `/carsbymake/:id/:make` | Get cars by dealer ID and specific make. |
| `GET` | `/carsbyprice/:id/:price` | Get cars by dealer ID and price condition (range). |
| `GET` | `/carsbyyear/:id/:year` | Get cars by dealer ID and minimum year. |

## Containerization

The service is fully containerized for deployment and consistency.

* **`Dockerfile`:** Uses the `node:18.12.1-bullseye-slim` base image, installs dependencies, copies the application and seed data, and exposes port **3050**.
* **Startup:** The service starts by executing `node app.js`.

The Django backend service communicates with this inventory service using the internal network address and port 3050 (e.g., `http://carsinventory_service:3050/cars/...`).