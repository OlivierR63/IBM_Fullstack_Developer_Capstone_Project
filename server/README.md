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

## Microservices Architecture

The system uses a containerized microservices architecture. The Django Backend acts as the **API Gateway**, centralizing requests from the React Frontend and distributing them to the specialized internal services.

## 1. Component Architecture Diagram

The system follows a **Decoupled SPA (Single Page Application)** architecture. It is essential to distinguish between the **initial load** (downloading the UI) and the **runtime** (data exchange).

* **Initial Load**: The browser requests the static React assets from the `frontend` service (port 3000).
* **Runtime**: Once loaded, the React application runs directly in the user's browser and performs direct API calls to the **Django API Gateway** (port 8000) using Axios.

```mermaid
graph TD
    subgraph User_Machine [User's Computer / Browser]
        UI[React UI - Running in Browser]
    end

    subgraph Docker_Network [Docker Network]
        direction TB
        Frontend_Srv(Frontend Service - :3000)
        Django_GW(Django API Gateway - :8000)
        
        subgraph Internal_Microservices [Internal Microservices]
            Sentiment(Sentiment Flask - :5000)
            Inventory(Inventory Node - :3050)
            Data_API(Database Node - :3030)
        end
        
        DB[(MongoDB - :27017)]
    end

    %% Flow of files
    User_Machine -- 1. Downloads JS/HTML Bundle --> Frontend_Srv
    
    %% Flow of data
    UI -- 2. Direct API Calls (Axios) --> Django_GW
    
    %% Internal orchestration
    Django_GW -- REST --> Sentiment
    Django_GW -- REST --> Inventory
    Django_GW -- REST --> Data_API
    
    Inventory -- Mongoose --> DB
    Data_API -- Mongoose --> DB

    style UI fill:#cceeff,stroke:#3377ff
    style Django_GW fill:#aaffcc,stroke:#00aa44
    style DB fill:#f0f0f0,stroke:#666666
```

## 2. Service Roles (Server Context)

| Component | Description | Exposed Port (Host) |
| :--- | :--- | :--- |
| **DjangoBackend** | Main API Entry point, Authentication, and Orchestration. | 8000 |
| **SentimentAPI** | Python Flask microservice for text analysis (NLP). | 5000 |
| **InventoryAPI** | Node.js microservice for managing car inventory. | 3050 |
| **DatabaseAPI** | Node.js service for dealership and review documents. | 3030 |
| **MongoDB** | NoSQL Data storage for dealerships and reviews. | 27018 |


## Development Notes

* **Docker Build**: The `Dockerfile` in this directory builds the Django image. It copies the entire `server/` content into the container's `/app` folder.
* **Entrypoint**: The `entrypoint.sh` script automates database migrations and collects static files before launching the Django server.
* **Database Dual-Storage**: 
    * **SQLite**: Used locally within Django for User Auth and Car Models.
    * **MongoDB**: Used by Node.js microservices for unstructured Dealership and Review data.
