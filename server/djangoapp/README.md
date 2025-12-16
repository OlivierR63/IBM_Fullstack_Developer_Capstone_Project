Django Application (`server/djangoapp`)

This directory houses the main Django application, which serves as the **API Gateway** for the entire system. It handles user authentication, business logic orchestration, and routes all external requests from the React Frontend to the appropriate data microservices.

## 1. Directory Structure

The structure adheres to standard Django conventions while isolating the specialized Sentiment Analyzer microservice.

server/djangoapp/

├── admin.py               # Django Admin configuration

├── apps.py                # Application configuration

├── models.py              # ORM Database Models (CarMake, CarModel)

├── populate.py            # Script for initial database population

├── restapis.py            # External API Client Layer

├── urls.py                # API Routing Definitions

├── views.py               # API Controller / Business Logic Views

├── migrations/            # Database schema history (managed by Django)

└── microservices/         # Sentiment Analyzer Microservice (Flask)

├── app.py             # Flask application entry point

├── Dockerfile         # Docker build instructions for the Flask app

├── requirements.txt   # Python dependencies for the Flask app

└── sentiments/        # NLTK data files (VADER lexicon)

## 2. Core Django Application Files

| File | Role | Details |
| :--- | :--- | :--- |
| `views.py` | **API Controller** | Contains all the Django view functions. This layer handles user requests, performs authentication (`login_user`, `registration`), and orchestrates the application's workflow by calling the external API client functions in `restapis.py`. |
| `urls.py` | **API Router** | Defines the URL patterns for all REST endpoints exposed by the Django service (e.g., `/login`, `/get_dealers/`, `/add_review`). It maps these paths to the corresponding functions in `views.py`. |
| `restapis.py` | **External API Client** | Functions as the abstraction layer for HTTP requests. It contains reusable functions (`get_request`, `post_review`, etc.) that use the `requests` library to communicate with the Node.js Database API and the Flask Sentiment Analyzer. It manages network connectivity and error handling for external calls. |
| `models.py` | **Database ORM** | Defines the Object-Relational Mapping (ORM) classes: `CarMake` (manufacturer details) and `CarModel` (specific vehicle details, including a foreign key relationship to `CarMake`). Used to define the database schema (via `migrations`). |
| `populate.py` | **Data Seeder** | Contains the `initiate()` function, which is responsible for populating the `CarMake` and `CarModel` tables with initial, default inventory data. This ensures the application has baseline data upon first run. |
| `admin.py` | **Admin Configuration** | Registers the `CarMake` and `CarModel` models with the built-in Django administrative interface, allowing easy data management by developers or administrators. |
| `migrations/` | **Schema History** | Standard Django directory holding the automatically generated Python files that track and manage changes to the database schema defined in `models.py`. |

## 3. The Sentiment Analyzer Microservice (`microservices/`)

This nested service is a standalone, lightweight Flask application dedicated solely to performing Natural Language Processing (NLP) on customer review text.

| File / Directory | Role | Details |
| :--- | :--- | :--- |
| `app.py` | **Flask App Logic** | Defines the Flask application and the primary route (`/analyze/<input_txt>`). It initializes and uses the `SentimentIntensityAnalyzer` (from NLTK) to classify review text into 'positive', 'negative', or 'neutral' sentiment. |
| `Dockerfile` | **Container Build** | Instructions for creating the Docker image for the Sentiment Analyzer, ensuring a consistent environment with all necessary Python dependencies and NLTK data. |
| `requirements.txt` | **Dependencies** | Specifies the necessary Python packages, including `Flask` for the server and `nltk` for the NLP tasks. |
| `sentiments/` | **NLTK Data** | This directory contains the necessary NLTK data files (specifically the VADER lexicon) required for sentiment analysis. It ensures the microservice can function correctly within its container without requiring runtime downloads. |

