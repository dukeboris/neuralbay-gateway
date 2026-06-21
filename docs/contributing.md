# Contributing to NeuralBay Gateway

We welcome contributions! Here how you can help:

## Development Setup

```bash
# Backend (requires Go 1.23+)
cd backend
go mod download
go run main.go

# Frontend (requires Node.js 24+)
cd web
npm install
npm run dev
```

## Project Structure

```
.
├── backend/          # Go API gateway (Gin framework)
│   ├── common/       # Config, logger, database, cache
│   ├── controller/   # HTTP handlers
│   ├── middleware/    # Auth, rate limiting, CORS
│   ├── model/        # Data models
│   ├── relay/        # AI provider relay engine
│   │   └── adapters/ # Format converters
│   └── router/       # Route definitions
├── web/              # Next.js admin dashboard
│   └── src/app/      # Pages
├── deploy/           # Docker, K8s configs
├── sdk/              # Multi-language SDKs
└── docs/             # Documentation
```

## Pull Request Guidelines

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## Code Style

- **Go**: Follow standard `gofmt` formatting
- **TypeScript**: Use ESLint + Prettier
- **SDKs**: Maintain parity across languages

## Testing

- Backend: `cd backend && go test ./...`
- Frontend: `cd web && npm test`

## Need Help?

Join our [Discord](https://discord.gg/neuralbay) or open a [GitHub Discussion](https://github.com/neuralbay/gateway/discussions).
