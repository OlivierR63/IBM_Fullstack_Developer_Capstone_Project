# ⚛️ Frontend Application (React Framework)

## Overview

This directory contains the source code for the Single Page Application (SPA) built using the **React.js framework** 
(often referred to simply as React). It serves as the client interface for the Capstone Project, interacting with the Django REST API
to display dealer lists, car inventories, handle user authentication, and manage reviews.

The components have been modernized to use **functional components**, **React Hooks**, and industry-standard practices
for high performance and maintainability.

## Key Technologies

| Technology | Role |
| :--- | :--- |
| **React.js** | Core JavaScript library for building the user interface. |
| **React Router DOM** | Handles client-side navigation (e.g., `/dealer/:id`, `/login`). |
| **Axios** | Used for all robust HTTP requests (GET/POST) to the Django API. |
| **CSS Files** | Styling for the application components. |

## Core Dependencies

The application relies on the following major packages (installed via `npm install` in this directory):

* `axios`
* `react-router-dom`

## Code Structure

The source code is primarily located in the `src/` directory.

| Directory | Content |
| :--- | :--- |
| `src/components/Auth` | `Login.jsx` and `Register.jsx` components. |
| `src/components/Dealers`| Main dealer-related components: `Dealers.jsx`, `Dealer.jsx`, `PostReview.jsx`, `SearchCars.jsx`. |
| `src/components/Header` | The global navigation bar. |
| `src/assets` | Static assets like images and icons. |

### Optimized Components

The following files have been optimized to use modern React Hooks (`useCallback`, `useNavigate`, `useParams`),
**Axios**, and robust API pathing, ensuring code consistency:

* `Login.jsx`
* `Register.jsx`
* `Dealers.jsx`
* `Dealer.jsx`
* `PostReview.jsx`
* `SearchCars.jsx`

## Local Development (Outside Docker)

If you wish to run the frontend independently for rapid development, follow these steps from the root of the `frontend` directory:

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Start the Development Server:**
    ```bash
    npm start
    ```
    The application will usually open at `http://localhost:3000`.
    **Note:** For the API calls to work, your Django backend must be running, accessible via `http://localhost:8000`,
    or the `REACT_APP_DJANGO_URL` must be defined in your local environment shell.

## Docker Integration

The build process is managed by Docker Compose.
The `Dockerfile` within this directory builds the application, and the `docker-compose.yaml` injects the necessary
environment variables (`REACT_APP_DJANGO_URL`) to ensure connectivity with the `backend` service.