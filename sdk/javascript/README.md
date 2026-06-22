# NeuralBay JavaScript SDK

JavaScript/TypeScript client for the NeuralBay AI Gateway.

## Installation

```bash
npm install @neuralbay/sdk
```

## Quick Start

```typescript
import { NeuralBay } from "@neuralbay/sdk";

const client = new NeuralBay({ apiKey: "sk-..." });

// Chat completion
const response = await client.chat({
  model: "gpt-4o",
  messages: [{ role: "user", content: "Hello!" }],
});

// Stream chat
for await (const chunk of client.streamChat({
  model: "gpt-4o",
  messages: [{ role: "user", content: "Hello!" }],
})) {
  console.log(chunk);
}

// List models
const models = await client.listModels();

// Get usage
const usage = await client.getUsage();
```
