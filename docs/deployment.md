# Deployment Guide

## Prerequisites

- Docker & Docker Compose
- Domain name with DNS
- Stripe account (optional)
- Crypto wallet (optional)

## Quick Deploy

### Option 1: Docker Compose (Recommended)

```bash
# Clone repository
git clone https://github.com/neuralbay/gateway.git
cd gateway

# Configure
cp .env.example .env
nano .env  # Set your config values

# Start services
docker compose up -d

# Verify
curl http://localhost:3000/health
```

### Option 2: Kubernetes

```bash
kubectl create namespace ai-gateway
kubectl apply -k deploy/k8s/
```

### Option 3: Single Server

```bash
docker run -d --name neuralbay \
  -p 3000:3000 \
  -e DB_TYPE=sqlite \
  -e SESSION_SECRET=your-secret \
  -v ./data:/data \
  neuralbay/gateway:latest
```

## Multi-Region Deployment

For global low-latency access, deploy in multiple regions:

- US West (Oregon)
- US East (N. Virginia)
- Europe (Frankfurt)
- Asia Pacific (Tokyo)
- Asia Pacific (Singapore)

Each region runs the full stack with a shared PostgreSQL and Redis cluster.
