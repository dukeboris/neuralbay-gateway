# NeuralBay Python SDK

Python client for the NeuralBay AI Gateway.

## Installation

```bash
pip install neuralbay
```

## Quick Start

```python
from neuralbay import NeuralBay

client = NeuralBay(api_key="sk-...")

# Chat completion
response = client.chat(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello!"}]
)

# Stream chat
for chunk in client.stream_chat(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello!"}]
):
    print(chunk)

# List models
models = client.list_models()

# Get usage
usage = client.get_usage()
```
