# API Reference

## Base URL

`https://api.neuralbay.io/api/v1`

## Authentication

All API requests require a Bearer token in the Authorization header:

```
Authorization: Bearer sk-your-api-key
```

## Endpoints

### Chat Completions

Creates a model response for the given chat conversation.

```
POST /chat/completions
```

**Request Body:**
```json
{
  "model": "gpt-4o",
  "messages": [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Hello!"}
  ],
  "temperature": 0.7,
  "max_tokens": 1024,
  "stream": false
}
```

**Response:**
```json
{
  "id": "chatcmpl-xxx",
  "object": "chat.completion",
  "created": 1719000000,
  "model": "gpt-4o",
  "choices": [...],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 20,
    "total_tokens": 30
  }
}
```

### Streaming

Set `"stream": true` to receive SSE (Server-Sent Events).

### List Models

```
GET /models
```

### Usage

```
GET /usage
```

### Billing

```
GET /billing
```
