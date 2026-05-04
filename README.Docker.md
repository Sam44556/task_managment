# Docker Setup Guide for MERN Stack Application

This guide will help you run the application using Docker and push images to Docker Hub.

## Prerequisites

- Docker installed ([Download Docker](https://www.docker.com/products/docker-desktop))
- Docker Compose installed (included with Docker Desktop)
- Docker Hub account ([Sign up](https://hub.docker.com/))

## Quick Start

### Run with Docker Compose

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v
```

The application will be available at:
- Frontend: http://localhost:5173 (with hot reload)
- Backend API: http://localhost:3000
- MongoDB: localhost:27017

## Environment Variables

### Backend (.env)
Create `backend/.env` file:
```env
MONGODB_URI=mongodb://admin:admin123@mongodb:27017/vooshfoods?authSource=admin
PORT=3000
JWT_SECRET=your_jwt_secret_key_change_this
COOKIE_SECRET=your_cookie_secret_change_this
FRONTEND_BASE_URL=http://localhost:5173
```

### Frontend (.env)
Create `frontend/.env` file:
```env
VITE_BACKEND_BASE_URL=http://localhost:3000
VITE_FIREBASE_API_KEY=your_firebase_api_key
```

## Building Individual Images

### Backend
```bash
cd backend
docker build -t your-dockerhub-username/mern-backend:latest .
```

### Frontend
```bash
cd frontend
docker build -t your-dockerhub-username/mern-frontend:latest .
```

## Pushing to Docker Hub

### 1. Login to Docker Hub
```bash
docker login
# Enter your Docker Hub username and password
```

### 2. Tag Your Images
```bash
# Tag backend image
docker tag mern-backend:latest your-dockerhub-username/mern-backend:latest
docker tag mern-backend:latest your-dockerhub-username/mern-backend:v1.0.0

# Tag frontend image
docker tag mern-frontend:latest your-dockerhub-username/mern-frontend:latest
docker tag mern-frontend:latest your-dockerhub-username/mern-frontend:v1.0.0
```

### 3. Push Images to Docker Hub
```bash
# Push backend
docker push your-dockerhub-username/mern-backend:latest
docker push your-dockerhub-username/mern-backend:v1.0.0

# Push frontend
docker push your-dockerhub-username/mern-frontend:latest
docker push your-dockerhub-username/mern-frontend:v1.0.0
```

## Complete Build and Push Script

Create a script to automate the process:

```bash
#!/bin/bash

# Set your Docker Hub username
DOCKER_USERNAME="your-dockerhub-username"
VERSION="v1.0.0"

# Login to Docker Hub
echo "Logging in to Docker Hub..."
docker login

# Build images
echo "Building backend image..."
docker build -t $DOCKER_USERNAME/mern-backend:latest -t $DOCKER_USERNAME/mern-backend:$VERSION ./backend

echo "Building frontend image..."
docker build -t $DOCKER_USERNAME/mern-frontend:latest -t $DOCKER_USERNAME/mern-frontend:$VERSION ./frontend

# Push images
echo "Pushing backend image..."
docker push $DOCKER_USERNAME/mern-backend:latest
docker push $DOCKER_USERNAME/mern-backend:$VERSION

echo "Pushing frontend image..."
docker push $DOCKER_USERNAME/mern-frontend:latest
docker push $DOCKER_USERNAME/mern-frontend:$VERSION

echo "Done! Images pushed to Docker Hub."
```

Save as `docker-push.sh` and run:
```bash
chmod +x docker-push.sh
./docker-push.sh
```

## Using Images from Docker Hub

Update `docker-compose.yml` to use your Docker Hub images:

```yaml
services:
  backend:
    image: your-dockerhub-username/mern-backend:latest
    # Remove the build section
    
  frontend:
    image: your-dockerhub-username/mern-frontend:latest
    # Remove the build section
```

Then run:
```bash
docker-compose pull
docker-compose up -d
```

## Useful Docker Commands

```bash
# View running containers
docker ps

# View all containers
docker ps -a

# View images
docker images

# Remove unused images
docker image prune

# Remove all stopped containers
docker container prune

# View logs for specific service
docker-compose logs backend
docker-compose logs frontend

# Restart a service
docker-compose restart backend

# Execute command in running container
docker exec -it mern-backend sh

# View MongoDB data
docker exec -it mern-mongodb mongosh -u admin -p admin123
```

## Troubleshooting

### Port Already in Use
If ports are already in use, modify the port mappings in `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Change host port
```

### MongoDB Connection Issues
Ensure MongoDB is healthy:
```bash
docker-compose logs mongodb
```

### Frontend Can't Connect to Backend
Check that `VITE_BACKEND_BASE_URL` matches your backend URL.

### Rebuild After Code Changes
```bash
docker-compose up -d --build
```

## Production Deployment

For production deployment:

1. Update environment variables with production values
2. Use proper secrets management (not hardcoded)
3. Set up SSL/TLS certificates
4. Configure proper CORS origins
5. Use Docker secrets or environment variable injection
6. Set up monitoring and logging
7. Use orchestration tools like Kubernetes or Docker Swarm for scaling

## Security Notes

⚠️ **Important**: 
- Change default MongoDB credentials
- Use strong JWT and cookie secrets
- Never commit `.env` files to version control
- Use Docker secrets for sensitive data in production
- Keep Docker images updated regularly

## License

This Docker configuration is part of the MERN stack application.
