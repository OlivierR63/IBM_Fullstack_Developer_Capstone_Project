# Full-Stack Automobile Dealership Application

This repository contains the source code for a full-stack web application designed to manage an automobile dealership, including dealer details, customer reviews, and car inventory. The application is built using a modern stack: **React (Frontend)**, **Django (Backend API Gateway)**, and **Node.js/Express (Database Microservice)**, orchestrated via **Docker Compose**.

## Architecture and Deployment

The entire application runs as a collection of interconnected services managed by Docker Compose.

| Service Name | Technology | Role | Port (External/Host) |
| :--- | :--- | :--- | :--- |
| `frontend` | React/Vite | User Interface | `3000` |
| `django_backend` | Python/Django | API Gateway, Business Logic, and Authentication | `8000` |
| `database_api` | Node.js/Express | Database API and Cloudant/CouchDB Interface | `3030` |
| `sentiment_analyzer` | Python/Flask | Microservice for Review Sentiment Analysis | `5000` |

---

## 1. `frontend` (React Application)

The frontend is a single-page application (SPA) built with React. It provides the user interface for browsing dealers, viewing details, and submitting reviews.

### Core Component Breakdown

| Component | Role | Data Fetched | Key Logic |
| :--- | :--- | :--- | :--- |
| `App.jsx` | Main Router | None | Defines routes using `react-router-dom`. |
| `Dealers.jsx` | Dealer List | `/djangoapp/get_dealers/` | Displays all dealers or filters by state. Handles routing to `Dealer.jsx`. |
| `Dealer.jsx` | Dealer Detail | `/djangoapp/dealer/<id>` and `/djangoapp/reviews/dealer/<id>` | Displays dealer information, location, and associated customer reviews. |
| `PostReview.jsx` | Review Submission | `/djangoapp/add_review` (POST) | Handles form state for submitting a new review. Requires user authentication. |

### API Interaction

Data fetching is handled using the `axios` library. All API calls target the **Django Backend** (`http://localhost:8000`), which acts as an API gateway, routing requests to the appropriate microservices (Node.js/Database or Sentiment Analyzer).

### Performance Optimization (Async Calls)

Data fetching within `Dealer.jsx` is optimized using **`Promise.all()`** to execute independent API calls (Dealer Details and Reviews) concurrently, significantly reducing loading time.

---

## 2. `server/djangoapp` (Django Backend / API Gateway)

This is the central service responsible for authentication, business logic routing, and serving as the primary API interface for the React frontend.

### A. Routing and Views (`urls.py` and `views.py`)

| Endpoint Path | Method | View Function | Role |
| :--- | :--- | :--- | :--- |
| `/login` | POST | `login_user` | Authenticates user credentials. |
| `/logout` | GET | `logout_request` | Clears the user session. |
| `/registration` | POST | `registration` | Creates a new user account. |
| `/get_dealers/` | GET | `get_dealerships` | Fetches list of all dealers or dealers by state. |
| `/dealer/<int:id>` | GET | `get_dealer_details` | Retrieves details for a single dealer. |
| `/reviews/dealer/<int:id>`| GET | `get_dealer_reviews` | Fetches reviews for a dealer, including sentiment analysis. |
| `/add_review` | POST | `add_review` | Submits a new review to the database microservice. **Requires `@csrf_exempt`**. |
| `/get_cars` | GET | `get_cars` | Retrieves a list of available car makes and models. |

### B. External API Calls (`restapis.py`)

The `restapis.py` file contains helper functions that abstract the HTTP calls to external microservices.

| Function | Destination | Purpose | Key Feature |
| :--- | :--- | :--- | :--- |
| `get_request` | Node.js API (`http://database_api:3030`) | Generic GET request (e.g., fetching dealers, reviews). | Handles network exceptions and returns JSON data. |
| `post_review` | Node.js API (`http://database_api:3030`) | Sends the new review payload for insertion. | **Critical:** Must return a structured failure dictionary (e.g., `{"status": 503, "message": "..."}`) instead of implicitly returning `None` on error. |
| `analyze_review_sentiments`| Sentiment Microservice (`http://sentiment_analyzer:5000`) | Sends review text for sentiment analysis. | Uses `requests.get` with the `params` argument for safe URL encoding. |

### C. Common Errors and Debugging

* **`403 Forbidden` on POST requests (`/add_review`)**: Indicates that the **CSRF protection** is blocking the request. The solution is to add the **`@csrf_exempt`** decorator to the relevant view function (`add_review`) in `views.py`.
* **`500 Internal Server Error` / `OperationalError: no such table: djangoapp_carmake`**: Indicates the database schema is not set up. This is resolved by applying database migrations: `docker compose exec django_backend python manage.py migrate`.

---

## 3. `sentiment_analyzer` (Python/Flask Microservice)

This lightweight service is dedicated solely to running the Natural Language Processing (NLP) model for sentiment analysis.

| Element | Description |
| :--- | :--- |
| **Rôle** | Executes sentiment analysis on text strings. |
| **Port** | `5000` |
| **Framework** | Python/Flask |
| **Input** | Raw text string (the customer review). |
| **Output** | JSON object containing the determined sentiment (e.g., `"positive"`, `"negative"`, `"neutral"`). |

### API Call Safety

The function `analyze_review_sentiments(text)` in the Django backend must use **URL parameters** (`params={'text': text}`) instead of concatenating the raw text directly into the URL path. This ensures proper URL encoding for spaces and special characters, preventing injection risks and runtime errors.

---

## 4. `server/database` (Database API Microservice)

This Node.js/Express service acts as the direct interface to the external database (Cloudant/CouchDB). It handles the storage and retrieval of all application data.

| Element | Description |
| :--- | :--- |
| **Rôle** | Node.js/Express REST API (Data Access Layer). |
| **Port** | **3030** (Used by the Django Backend). |
| **Framework** | Node.js/Express with the `ibm-cloudant` library. |
| **Entités Gérées** | `dealerships`, `reviews`, and `inventory` (car makes/models). |

### Structure du Répertoire

The `server/database` directory contains the **Node.js/Express** application files,
dependencies configuration (via `package.json`), and the **Docker setup** for
the database microservice.

server/database/
├── app.js               # Main entry point, initializes Express and defines routes
├── inventory.js         # Mongoose schema and model for 'cars' collection
├── Dockerfile           # Instructions for building the Node.js Docker image
├── package.json         # Node.js dependencies (express, mongoose, mongodb)
├── package-lock.json    # Detailed dependency tree lock file
└── data/                # Initial data used to populate MongoDB on startup
    └── car_records.json # Initial car inventory data


### Key API Endpoints Provided

| Endpoint | Method | Purpose |
| :--- | :--- | :--- |
| `/fetchDealers` | GET | Retrieve all dealers. |
| `/fetchReviews/dealer/:id`| GET | Retrieve reviews for a specific dealer. |
| `/insert_review` | POST | Write a new review document to the database. |
| `/cars` and variations | GET | Retrieve inventory data (cars by make, model, year, etc.). |

### Deployment (`Dockerfile`)

The service is built on a Node.js base image, installs dependencies via `npm install`, and exposes port `3030`. The startup command is defined as `CMD [ "node", "app.js" ]`.