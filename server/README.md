# Server & Microservices Context

## Overview

This `server` directory serves as the **backend core** of the application. It hosts the Django API Gateway and coordinates various microservices. Following the architectural optimization, the **frontend has been moved to the project root** to ensure a clean separation of concerns.

In the Docker ecosystem, this directory provides the build context for the Django application, managing the orchestration between the relational data (SQLite) and external microservices.

---

## Key Subdirectories

The backend logic and internal services are structured as follows:

| Directory | Role | Description |
| :--- | :--- | :--- |
| **`djangoapp/`** | **Application Logic** | Contains Models, Views (API endpoints), and the core business logic for the Django backend. |
| **`djangoproj/`** | **Configuration** | Global settings, URL routing, and WSGI/ASGI configurations for the Django project. |
| **`database/`** | **Node.js Data Service** | Microservice managing Dealership and Review data (connected to MongoDB). |
| **`carsInventory/`** | **Inventory Service** | Node.js microservice specifically for managing vehicle inventory. |
| **`djangoapp/microservices/`** | **Sentiment Analysis** | Flask-based NLP service for evaluating customer feedback tone. |

---

## Microservices Orchestration

The `server` directory acts as the **API Gateway** and service mesh. While the Frontend is hosted independently, all data requests are centralized here.

### Internal Service Communication
The Django Backend orchestrates requests to the following specialized services within the Docker network:

1. **Sentiment Analysis**: Flask service (Port 5000) for NLP.
2. **Car Inventory**: Node.js service (Port 3050) for vehicle management.
3. **Dealership Data**: Node.js service (Port 3030) for MongoDB interactions.

All internal communication between Django and these services is performed via **REST API** calls using the Python `Requests` library.

---

## Development Notes

* **Docker Build**: The `Dockerfile` in this directory builds the Django image. It copies the entire `server/` content into the container's `/app` folder.
* **Entrypoint**: The `entrypoint.sh` script automates database migrations and collects static files before launching the Django server.
* **Database Dual-Storage**: 
    * **SQLite**: Used locally within Django for User Auth and Car Models.
    * **MongoDB**: Used by Node.js microservices for unstructured Dealership and Review data (accessible on host port 27018).
