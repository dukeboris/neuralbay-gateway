FROM golang:1.23-alpine AS builder

WORKDIR /app
COPY backend/go.mod backend/go.sum ./
RUN go mod download
COPY backend/ .
RUN CGO_ENABLED=0 GOOS=linux go build -o /new-api -ldflags="-s -w" .

FROM alpine:3.20
RUN apk --no-cache add ca-certificates tzdata
WORKDIR /app
COPY --from=builder /new-api .
COPY --from=builder /app/i18n ./i18n
EXPOSE 3000
CMD ["./new-api"]
