# NeuralBay AI Gateway 🍥

> **Next-Generation LLM Gateway and AI Asset Management System**

A unified AI model hub for aggregation & distribution. Cross-converts various LLMs into OpenAI-compatible, Claude-compatible, or Gemini-compatible formats. Centralized gateway for personal and enterprise model management.

## ✨ Features

- **🎯 200+ Models** — One API endpoint to access all major LLMs
- **🔄 Cross-Format Conversion** — Seamless translation between OpenAI/Claude/Gemini formats
- **🔑 Multi-Level Key Management** — Fine-grained API key control with quotas and IP whitelisting
- **⚖️ Load Balancing** — Distribute traffic across multiple upstream providers with automatic failover
- **📊 Real-Time Dashboard** — SSE-powered live stats with usage analytics
- **📡 Prometheus Metrics** — Built-in `/metrics` endpoint + Grafana dashboard template
- **💳 Flexible Billing** — Stripe + Crypto (USDT/SOL/ETH/BTC) payment support
- **🌍 Global Deployment** — Multi-region nodes for low-latency worldwide access
- **🛡️ Enterprise Security** — Rate limiting, JWT auth, Cloudflare Turnstile, gosec CI scan

## 🚀 Quick Start

### Using Docker Compose

```bash
# Clone the project
git clone https://github.com/dukeboris/neuralbay-gateway.git
cd neuralbay-gateway

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Start the service
docker compose up -d
```

### Configuration

See [`.env.example`](.env.example) for all configuration options.

### Access

| Service | URL |
|---|---|
| API Gateway | `http://localhost:3000` |
| Admin Dashboard | `http://localhost:3001` (dev) |
| Prometheus Metrics | `http://localhost:3000/metrics` |
| API Docs (OpenAPI) | `docs/openapi.yaml` |

## 📦 Architecture

```
Client → Cloudflare CDN → Nginx → Go API Gateway → Redis (Cache)
                                                     │
                                              PostgreSQL (DB)
                                                     │
                                         Upstream AI Providers
                                                     │
                                         Prometheus ← /metrics
```

## 📊 Monitoring

### Prometheus

```yaml
scrape_configs:
  - job_name: neuralbay
    static_configs:
      - targets: ['localhost:3000']
    metrics_path: /metrics
```

### Grafana

Import the dashboard from `deploy/grafana/dashboard.json`.

### Available Metrics

| Metric | Type | Description |
|---|---|---|
| `neuralbay_http_requests_total` | Counter | HTTP requests by method/path/status |
| `neuralbay_http_request_duration_seconds` | Histogram | Request latency distribution |
| `neuralbay_relay_requests_total` | Counter | Relay requests by model/channel/status |
| `neuralbay_relay_tokens_total` | Counter | Tokens processed by model/type |
| `neuralbay_active_channels` | Gauge | Active upstream channels |
| `neuralbay_active_users` | Gauge | Active users count |
| `neuralbay_db_connections` | Gauge | Database connections |

## 📚 Documentation

- [API Reference (OpenAPI)](docs/openapi.yaml)
- [Deployment Guide](docs/deployment.md)
- [SDK Usage](README.md#sdks)
- [Contributing](docs/contributing.md)

## 📦 SDKs

### Python

```bash
pip install neuralbay
```

```python
from neuralbay import NeuralBay

client = NeuralBay(api_key="sk-xxx")
client.chat(model="gpt-4o", messages=[{"role": "user", "content": "Hello!"}])
```

### JavaScript

```bash
npm install @neuralbay/sdk
```

```ts
import { NeuralBay } from "@neuralbay/sdk"

const client = new NeuralBay({ apiKey: "sk-xxx" })
await client.chat({ model: "gpt-4o", messages: [{ role: "user", content: "Hello!" }] })
```

### Go

```go
import "github.com/dukeboris/neuralbay-gateway/sdk/go"
```

## 🛠 Tech Stack

| Component | Technology |
|---|---|
| Backend | Go 1.23 + Gin |
| Frontend | Next.js 15 + React 19 + TailwindCSS 4 |
| Database | PostgreSQL / MySQL / SQLite |
| Cache | Redis 7 |
| Container | Docker + Kubernetes |
| CI/CD | GitHub Actions (lint + test + security + build) |
| Monitoring | Prometheus + Grafana |
| Payment | Stripe + Crypto (Solana/Ethereum) |

## 📄 License

This project is licensed under AGPL-3.0 with additional terms.

Built with ❤️ by NeuralBay Team
