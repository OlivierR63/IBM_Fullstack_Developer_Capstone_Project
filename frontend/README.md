# Frontend Application (React)

## Overview
This directory contains the source code, configuration, and build artifacts for the single-page application (SPA). Following the project restructuring, this directory is now located at the **project root**, as a sibling to the `server` directory.

The UI is built using **React** and communicates with the Django backend via **Axios** (standard port `8000`).

---

## 1. Directory Structure



```text
frontend/
├── src/                # Core application source code
│   ├── components/     # Reusable UI components (Login, Register, etc.)
│   ├── images/         # Application-wide image assets
│   ├── App.js          # Main application component & Routing
│   ├── index.js        # Entry point for React rendering
│   └── App.css         # Global application styles
├── public/             # Static assets (HTML template, Favicon)
├── build/              # Optimized production build (generated)
├── node_modules/       # Third-party libraries (Dependencies)
├── Dockerfile          # Container instructions for the React app
├── package.json        # Project metadata and dependencies (Axios, React)
└── README.md           # This documentation
```




## 2. Key Components and Configuration

| File / Library | Role | Description |
| :--- | :--- | :--- |
| **Axios** | **Communication** | The primary HTTP client used to send asynchronous requests to the Django API (e.g., login, registration, and fetching dealer data). |
| `package.json` | **Manifest** | Manages project dependencies (`react`, `axios`, `bootstrap`) and defines automation scripts like `npm start` and `npm run build`. |
| `Dockerfile` | **Deployment** | Contains the multi-stage build instructions to compile the React app and serve it via a lightweight web server. |
| `App.js` | **Routing** | Acts as the main application hub, defining the navigation paths and linking components (Home, Dealers, Login) via `react-router-dom`. |

---

## 3. Detailed Directory Breakdown

### `src/` (Core Source Code)
This is where the application logic lives. It is structured to separate UI components from global styles.

* **`src/components/`**: Contains the functional React components such as `Login.jsx`, `Register.jsx`, and `Dealers.jsx`.
* **`src/components/assets/`**: Centralizes styling resources including `style.css` and `bootstrap.min.css`.
* **`src/images/`**: A dedicated pool for static graphical assets used across the interface.
* **`src/App.css`**: Defines global CSS rules that ensure a consistent look and feel.

### `build/` (Production Output)
This directory is automatically generated when running the production build command.
* **Source**: Created via `npm run build` or during the Docker build process.
* **Role**: Contains the final, minified, and optimized HTML, CSS, and JavaScript bundles. These files are the only ones served to the user in a production environment.

### `node_modules/` (Third-Party Dependencies)
* **Source**: Populated by running `npm install`.
* **Role**: Stores all external libraries required for the project. **Note:** This folder is excluded from version control via `.gitignore` and is managed by Docker volumes during development.

---

## 4. Environment & Integration

The frontend is fully integrated into the project's **Microservices Architecture** via the root `docker-compose.yaml`.

* **API Connection**: The frontend targets the Django Backend service. Communication is handled through the `REACT_APP_DJANGO_URL` environment variable, typically pointing to `http://localhost:8000`.
* **Development Mode**: In the Docker environment, the `./frontend` directory is mounted as a volume. This enables **Hot Reloading**, allowing UI changes to be reflected in real-time without restarting the container.
* **Legacy Files**: The `static/` directory contains legacy HTML/CSS files from previous non-React versions. These are kept for historical reference but are not involved in the current React build pipeline.

---

## 5. Scripts

If you have Node.js installed locally and wish to manage the frontend outside of Docker for specific tasks, you can use the following scripts from within the `frontend/` directory:

* **`npm install`**: Downloads and installs all dependencies listed in `package.json` into the `node_modules/` folder.
* **`npm start`**: Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.
* **`npm run build`**: Builds the application for production to the `build/` folder. It correctly bundles React in production mode and optimizes the build for the best performance.
* **`npm test`**: Launches the test runner in the interactive watch mode.