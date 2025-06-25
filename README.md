# Rextract

Rextract is a mobile application that allows users to take a photo of a recipe and have the title, ingredients, and method extracted from the image. The extracted information is then saved and can be viewed within the app.

This project is built as a learning exercise to gain experience with Symfony 6 and modern PHP development practices.

## Project Structure

-   `/backend`: A Symfony 6 application that serves as the API.
-   `/frontend`: An Expo (React Native) application (runs in Docker for local development).

## Technology Stack

### Backend

-   **Framework:** Symfony 6.4.22 (Long-Term Support)
-   **Database:** PostgreSQL 13 (development and production)
-   **ORM:** Doctrine 3
-   **Containerisation:** Docker with Docker Compose
-   **Web Server:** Nginx
-   **Application Server:** PHP-FPM 8.4

### Frontend

-   **Framework:** Expo (React Native)
-   **Language:** TypeScript
-   **Containerisation:** Docker with Docker Compose

## Architecture

```
┌─────────────────┐    HTTP Request/Response    ┌─────────────────┐
│                 │◄────────────────────────────►│                 │
│   Frontend      │                              │   Backend       │
│   (Expo App)    │                              │   (Symfony 6)   │
│                 │                              │                 │
└─────────────────┘                              └─────────────────┘
                                                           │
                                                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Symfony Application                          │
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │   Routing   │───►│ Controller  │───►│    Model    │         │
│  │             │    │ (Custom API │    │ (Entities & │         │
│  └─────────────┘    │  Endpoints) │    │ Repositories│         │
│                     └─────────────┘    └─────────────┘         │
│                              │                │                │
│                              ▼                ▼                │
│                     ┌─────────────┐    ┌─────────────┐         │
│                     │    View     │    │  Database   │         │
│                     │ (JSON Output│    │ (PostgreSQL)│         │
│                     │ Serializer) │    │             │         │
│                     └─────────────┘    └─────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

**Data Flow:**
1. Mobile app sends HTTP request to Symfony backend
2. Symfony routing directs request to appropriate controller
3. Controller interacts with model (entities/repositories)
4. Model queries database for data
5. Data is serialized to JSON
6. JSON response sent back to mobile app

## Getting Started

### Prerequisites

You need a Docker client installed and running. Several options are available:

#### Option 1: Docker Desktop (Recommended for beginners)
-   [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop/)
-   Easiest to set up and use
-   Includes Docker Compose and other tools out of the box

#### Option 2: Colima (Lightweight alternative)
-   [Colima](https://github.com/abiosoft/colima) - A container runtime for macOS
-   Lighter on system resources than Docker Desktop
-   Install with Homebrew: `brew install colima`
-   Start with: `colima start`

#### Option 3: Other Docker Clients
-   [Lazydocker](https://github.com/jesseduffield/lazydocker) - A simple terminal UI for Docker
-   [Podman](https://podman.io/) - A daemonless container engine
-   [Lima](https://github.com/lima-vm/lima) - Linux virtual machines on macOS

### Quick Start (Recommended)

1. **Build and start all services in development mode:**
    ```bash
    docker compose up --build
    ```
    
    Or use the convenience script:
    ```bash
    ./bin/start
    ```
    
    This will:
    - Build and start all services (backend and frontend)
    - Show real-time logs from all containers
    - Display Expo CLI instructions and QR code
    - Keep the terminal active for monitoring

2. **Access your applications:**
    - **Frontend (Expo):** Open your browser to [http://localhost:8081](http://localhost:8081)
    - **Backend (Symfony):** Open your browser to [http://localhost:8080](http://localhost:8080)

3. **Stop the application:**
    - Press `Ctrl+C` in the terminal to stop all services
    - Or use the convenience script: `./bin/stop`

### Alternative: Backend-Only Setup

If you only want to work on the backend:

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install PHP Dependencies:**
    The project uses Docker and Composer to manage dependencies. You don't need PHP installed locally.
    ```bash
    ./bin/setup
    ```

3.  **Run the Application:**

    The following command starts the Symfony development web server in the background using Docker Compose.

    ```bash
    ./bin/start
    ```

    Once the server is running, you can access the application in your browser:
    -   [http://localhost:8080](http://localhost:8080)

4.  **Stop the Application**

    To stop the server and shut down the containers, run:
    ```bash
    ./bin/stop
    ```

### Frontend-Only Setup

If you only want to work on the frontend:

```bash
docker compose up frontend --build
```

This will start only the frontend service and show the Expo CLI output.

## Development

### Running Symfony Console Commands

All Symfony console commands should be run through Docker Compose using the `exec` command:

```bash
# List all available commands
docker compose exec backend-app php bin/console list

# Clear cache
docker compose exec backend-app php bin/console cache:clear

# Run any other Symfony command
docker compose exec backend-app php bin/console [command]
```

### Creating Entities

To create new entities for your recipe extraction app:

```bash
docker compose exec backend-app php bin/console make:entity Recipe
docker compose exec backend-app php bin/console make:entity Ingredient
```

### Database Migrations

When you create or modify entities, generate and run migrations:

```bash
docker compose exec backend-app php bin/console make:migration
docker compose exec backend-app php bin/console doctrine:migrations:migrate
```

### Making Frontend Changes

- Any changes to the frontend code will be reflected automatically (hot reload)
- If you add new dependencies, rebuild the frontend image:
  ```bash
  docker compose build frontend
  docker compose up frontend
  ```

## Current Status

### ✅ Completed
-   Symfony 6.4.22 backend with Docker setup
-   PostgreSQL database integration
-   Nginx web server configuration
-   Development environment scripts
-   Basic test endpoint at http://localhost:8080
-   Expo React Native frontend running in Docker at http://localhost:8081
-   Frontend-backend API communication with CORS configured

### 🚧 In Progress
-   Entity creation for recipes and ingredients
-   API endpoint development
-   Recipe extraction logic

### 📋 Planned
-   User authentication system
-   Image processing and OCR integration
-   Recipe photo capture and processing

## API Endpoints

Currently available:
-   `GET /` - Test endpoint returning JSON response

More endpoints will be added as the application develops.