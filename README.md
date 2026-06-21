# NeuralBay AI Gateway 🍥

> **Next-Generation LLM Gateway and AI Asset Management System**

A unified AI model hub for aggregation & distribution. Cross-converts various LLMs into OpenAI-compatible, Claude-compatible, or Gemini-compatible formats. Centralized gateway for personal and enterprise model management.

## ✨ Features

- **🎯 200+ Models** — One API endpoint to access all major LLMs
- **🔄 Cross-Format Conversion** — Seamless translation between OpenAI/Claude/Gemini formats
- **🔑 Multi-Level Key Management** — Fine-grained API key control with quotas and IP whitelisting
- **⚖️ Load Balancing** — Distribute traffic across multiple upstream providers with automatic failover
- **📊 Usage Analytics** — Real-time token counting and cost tracking
- **💳 Flexible Billing** — Stripe + Crypto (USDT/SOL/ETH/BTC) payment support
- **🌍 Global Deployment** — Multi-region nodes for low-latency worldwide access
- **🛡️ Enterprise Security** — Rate limiting, JWT auth, Cloudflare Turnstile

## 🚀 Quick Start

### Using Docker Compose

```bash
# Clone the project
git clone https://github.com/neuralbay/gateway.git
cd gateway

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Start the service
docker compose up -d
```

### Configuration

See [.env.example](.env.example) for all configuration options.

### Access

| Service | URL |
|---|---|
| API Gateway | `http://localhost:3000` |
| Admin Dashboard | `http://localhost:3001` |

## 📦 Architecture

```
Client → Cloudflare CDN → Nginx → Go API Gateway → Redis (Cache)
                                                     │
                                              PostgreSQL (DB)
                                                     │
                                         Upstream AI Providers
```

## 📚 Documentation

- [API Reference](docs/api.md)
- [Deployment Guide](docs/deployment.md)
- [SDK Usage](docs/sdk.md)
- [Contributing](docs/contributing.md)

## 🛠 Tech Stack

| Component | Technology |
|---|---|
| Backend | Go 1.23 + Gin |
| Frontend | Next.js 15 + React 19 |
| Database | PostgreSQL / MySQL / SQLite |
| Cache | Redis 7 |
| Container | Docker + Kubernetes |
| CI/CD | GitHub Actions |
| Monitoring | Prometheus + Grafana |
| Payment | Stripe + Crypto (Solana/Ethereum) |

## 🤝 Ecosystem Partners

- [Cherry Studio](https://www.cherry-ai.com/) — Multi-platform AI client
- [LobeChat](https://lobehub.com/) — Modern AI chat framework
- [ChatBot UI](https://github.com/mckaywrigley/chatbot-ui) — Open source ChatGPT UI

## 📄 License

This project is licensed under AGPL-3.0 with additional terms.

## 🌟 Star History

Built with ❤️ by NeuralBay Team
