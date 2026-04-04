# Docker Run Guide

## Overview

This guide provides step-by-step instructions to run the hostel management backend application using Docker and Docker Compose. The application uses MongoDB for data storage and Redis for job queuing.

## Prerequisites

- Docker installed on your system
- Docker Compose installed
- At least 2GB free RAM
- Ports 27017 (MongoDB) and 6379 (Redis) available

## Quick Start

### 1. Clone and Navigate to Backend Directory

```bash
cd /path/to/your/backend/directory
```

### 2. Start Docker Services

```bash
docker compose up -d
```

This command will:

- Download MongoDB 8.0 and Redis 7-alpine images
- Create persistent volumes for data storage
- Start containers in detached mode

### 3. Verify Services are Running

```bash
docker ps
```

Expected output should show:

```
CONTAINER ID   IMAGE          COMMAND                  CREATED         STATUS         PORTS                      NAMES
abc123def456   mongo:8.0      "docker-entrypoint.s…"   2 minutes ago   Up 2 minutes   0.0.0.0:27017->27017/tcp   mongodb
def456ghi789   redis:7-alpine "docker-entrypoint.s…"   2 minutes ago   Up 2 minutes   0.0.0.0:6379->6379/tcp    redis
```

### 4. Test Database Connections

**Test MongoDB:**

```bash
docker exec -it mongodb mongosh -u admin -p password --authenticationDatabase admin
```

**Test Redis:**

```bash
docker exec -it redis redis-cli ping
```

Should respond with `PONG`

## Environment Setup

### 1. Copy Environment File

```bash
cp env.example .env
```

### 2. Configure Environment Variables

Edit the `.env` file with your settings:

```env
# Database
DB_HOST=localhost
DB_PORT=27017
DB_NAME=hostel_management
DB_USER=admin
DB_PASS=password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Email Configuration (choose one)
# For Gmail:
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-app-password

# For Mailtrap (testing):
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your-mailtrap-user
SMTP_PASS=your-mailtrap-password

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# Server
PORT=3000
NODE_ENV=development
```

## Running the Application

### Development Mode

```bash
npm install
npm run dev
```

### Production Mode

```bash
npm install
npm start
```

## Docker Commands Reference

### Start Services

```bash
docker compose up -d
```

### Stop Services

```bash
docker compose down
```

### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f mongodb
docker compose logs -f redis
```

### Restart Services

```bash
docker compose restart
```

### Remove Everything (including volumes)

```bash
docker compose down -v
```

### Clean Up

```bash
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune

# Remove unused volumes
docker volume prune
```

## Troubleshooting

### Port Conflicts

If ports 27017 or 6379 are already in use:

1. Check what's using the ports:

```bash
lsof -i :27017
lsof -i :6379
```

2. Stop conflicting services or change ports in `docker-compose.yml`

### Database Connection Issues

1. Ensure MongoDB container is running:

```bash
docker ps | grep mongodb
```

2. Check MongoDB logs:

```bash
docker compose logs mongodb
```

3. Test connection manually:

```bash
docker exec -it mongodb mongosh -u admin -p password --authenticationDatabase admin
```

### Redis Connection Issues

1. Ensure Redis container is running:

```bash
docker ps | grep redis
```

2. Check Redis logs:

```bash
docker compose logs redis
```

3. Test connection:

```bash
docker exec -it redis redis-cli ping
```

### Application Won't Start

1. Check Node.js version (requires 18+):

```bash
node --version
```

2. Verify environment variables in `.env`

3. Check application logs:

```bash
tail -f logs/combined.log
tail -f logs/error.log
```

## Data Persistence

- MongoDB data is stored in `mongo_data` volume
- Redis data is stored in `redis_data` volume
- Data persists between container restarts
- To completely reset data: `docker compose down -v`

## Production Deployment

For production deployment:

1. Use environment-specific `.env` files
2. Configure proper logging
3. Set up monitoring
4. Use Docker secrets for sensitive data
5. Configure reverse proxy (nginx)
6. Set up SSL certificates

## Support

If you encounter issues:

1. Check the logs using the commands above
2. Verify your `.env` configuration
3. Ensure all prerequisites are met
4. Check that ports are available
