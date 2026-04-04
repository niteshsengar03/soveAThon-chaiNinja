# Docker Setup Guide for Redis Queue System

## Overview

This guide explains how to set up and test the Redis-based email notification queue system for the hostel management backend.

## Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ for the application

## Quick Setup

1. **Start Docker services:**

   ```bash
   cd backend
   docker compose up -d
   ```

2. **Verify services are running:**

   ```bash
   docker ps
   ```

   You should see `mongodb` and `redis` containers running.

3. **Test Redis connection:**
   ```bash
   docker exec -it redis redis-cli ping
   ```
   Should respond with `PONG`.

## Redis Queue Architecture

### Components

- **BullMQ Queue**: Handles job queuing and processing
- **Redis**: Stores queue data and job states
- **Notification Worker**: Processes email jobs asynchronously
- **Scheduler**: Monitors resolved complaints daily

### Email Notification Flow

1. **Queue Job**: `queueNotification('complaint-assigned', data)`
2. **Store in Redis**: Job added to `complaint-notifications` queue
3. **Process Job**: Worker picks up job and sends email
4. **Log Result**: Success/failure logged via Winston

## Testing the Email Queue

### Test Endpoint

A test endpoint is available to verify the queue system:

```bash
curl -X POST http://localhost:4000/api/test-email \
  -H "Content-Type: application/json" \
  -d "{}"
```

**Expected Response:**

```json
{ "success": true, "message": "Test email queued successfully" }
```

### Check Logs

Monitor email processing:

```bash
# View application logs
tail -f logs/combined.log

# Expected successful processing:
# {"level":"info","message":"Notification queued: complaint-assigned",...}
# {"level":"info","message":"Notification sent successfully: complaint-assigned for complaint TEST-001",...}
```

### Troubleshooting

**Queue Not Processing:**

```bash
# Check Redis connectivity
docker exec -it redis redis-cli ping

# Check application logs
tail -20 logs/combined.log

# Restart services
docker compose down && docker compose up -d
```

**Email Authentication Failed:**

```bash
# Update .env with correct Gmail credentials
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Gmail setup:
# 1. Enable 2FA
# 2. Generate App Password
# 3. Use App Password (not regular password)
```

## Docker Commands Reference

```bash
# Start services
docker compose up -d

# Stop services
docker compose down

# View logs
docker logs redis
docker logs mongodb

# Access Redis CLI
docker exec -it redis redis-cli

# Clean restart
docker compose down && docker rm redis mongodb && docker compose up -d
```

## Configuration

### Environment Variables

```env
# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM_NAME=Hostel Management
SMTP_FROM_EMAIL=your_email@gmail.com

# Head of Hostels (for resolved complaint alerts)
HEAD_OF_HOSTELS_EMAIL=head@hostel.edu
```

### Queue Settings

- **Queue Name**: `complaint-notifications`
- **Retry Attempts**: 3 (default BullMQ)
- **Job Timeout**: 30 seconds
- **Remove Completed Jobs**: After 24 hours

## Monitoring

### Queue Status

Check active jobs:

```bash
# Via Redis CLI
docker exec -it redis redis-cli KEYS "bull:complaint-notifications:*"
```

### Application Metrics

- **Scheduled Jobs**: Daily at 9:00 AM for resolved complaints
- **Email Types**: `complaint-assigned`, `complaint-resolved-alert`
- **Log Levels**: `info`, `error`, `warn`

## Production Deployment

For production:

1. **Use managed Redis** (Redis Cloud, AWS ElastiCache)
2. **Configure SMTP** with transactional email service (SendGrid, Mailgun)
3. **Set up monitoring** for queue health
4. **Configure log aggregation** (ELK stack, CloudWatch)
5. **Set up alerts** for failed email deliveries

## Support

If you encounter issues:

1. Check Docker services: `docker ps`
2. Verify Redis: `docker exec -it redis redis-cli ping`
3. Check logs: `tail -f logs/combined.log`
4. Test manually: Use the `/api/test-email` endpoint
