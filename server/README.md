# Application Service Root / Server Context

## Overview

This `server` directory serves as the **root context** for the primary application service.
It contains both the frontend (React client) and the backend (Django API) codebases.

In a containerized environment (like Docker), this folder is often used as the build context, ensuring that all necessary sub-directories and files (client and server code) are available to build the final application image.

This directory's main purpose is to centralize the code for the main web application service.

## Key Subdirectories

The core components of the application are structured here:

| Directory | Role | 
| ----- | ----- | 
| **`frontend`** | Contains the source code for the **React.js client application**. This is the user interface accessible on `http://localhost:3000`. | 
| **`djangoproj`** | Contains the global configuration and settings for the **Django backend project**. | 
| **`djangoapp`** | Contains the specific application logic, including Models, Views (API endpoints), and data retrieval functions for the **Django backend**. | 
| **`database`** | Scripts for database initialization or configuration. | 

## Running via Docker

When using Docker Compose, this directory likely defines the context for building the main application image, which runs the combined client and server or coordinates their respective services.

* **API Backend Port:** `8000`

* **Frontend Client Port:** `3000` (Typically accessed by the end-user)

### Important Note on Development

When performing local development, commands like `npm install` must be executed inside the **`frontend`** directory, and Python commands related to the API must be executed within the **`djangoproj`** or **`djangoapp`** context.

To modify the client-side UI, refer to **`frontend`**.
To modify the API logic or data handling, refer to **`djangoproj`** and **`djangoapp`**.

# Microservices Architecture

This project is built on a containerized microservices architecture using Docker Compose. The diagram below illustrates the main components and their communication within the Docker network.

The Front-End (React) communicates only with the Back-End (Django), which acts as an "API Gateway" to route requests to the specific services (Sentiment Analysis and Car Inventory).

## 1. Component Architecture Diagram

This diagram shows how the different services (containers) are interconnected via the Docker network.

```mermaid
graph LR
    subgraph Host Machine
        Browser(Web Browser)
    end
    
    subgraph Docker Network
        Frontend(React Application -:3000)
        DjangoBackend(Django API -:8000)
        SentimentAPI(Flask/Sentiment Analysis -:5000)
        InventoryAPI(Node/Inventory -:3050)
        MongoDB(MongoDB Database -:27017)
    end
    
    Browser -- HTTP/HTTPS --> Frontend
    Browser -- API Calls (via Port 8000) --> DjangoBackend
    
    DjangoBackend -- Inter-Container REST --> SentimentAPI
    DjangoBackend -- Inter-Container REST --> InventoryAPI
    
    InventoryAPI -- Data Access --> MongoDB
    
    style Frontend fill:#cceeff,stroke:#3377ff
    style DjangoBackend fill:#aaffcc,stroke:#00aa44
    style SentimentAPI fill:#ffccaa,stroke:#ff6600
    style InventoryAPI fill:#ffccaa,stroke:#ff6600
    style MongoDB fill:#f0f0f0,stroke:#666666

## 2. Service Roles

| Component | Description | Exposed Port (Host) | 
| ----- | ----- | ----- | 
| **Frontend** | User Interface (React), handles rendering and interactions. | 3000 | 
| **DjangoBackend** | API Gateway and session management. Entry point for Front-End API requests. | 8000 | 
| **SentimentAPI** | Python Flask microservice for text analysis. | 5000 | 
| **InventoryAPI** | Node.js/Express microservice for managing dealership data. | 3050 | 
| **MongoDB** | Data storage (dealerships and reviews). | 27018 (Mapped to 27017) |

