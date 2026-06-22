# Stage 1: Build the Go binary
FROM golang:1.23-alpine AS builder

WORKDIR /app
COPY backend/go.mod backend/go.sum ./
RUN go mod download
COPY backend/ .
RUN CGO_ENABLED=0 GOOS=linux go build -o /neuralbay -ldflags="-s -w" .

# Stage 2: Minimal runtime
FROM alpine:3.20

RUN apk --no-cache add ca-certificates tzdata curl

WORKDIR /app

# Data directory for SQLite
RUN mkdir -p /data

COPY --from=builder /neuralbay .

EXPOSE 3000

# Render provides PORT env var; health check uses /api/status
HEALTHCHECK --interval=15s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -sf http://localhost:${PORT:-3000}/api/status || exit 1

CMD ["./neuralbay"]
