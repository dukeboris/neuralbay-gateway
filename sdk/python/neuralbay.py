# NeuralBay Python SDK
# Installation: pip install neuralbay

import os
import json
import httpx
from typing import Optional, AsyncIterator

class NeuralBay:
    def __init__(
        self,
        api_key: Optional[str] = None,
        base_url: str = "https://api.neuralbay.io",
    ):
        self.api_key = api_key or os.getenv("NEURALBAY_API_KEY")
        self.base_url = base_url
        self.client = httpx.Client(timeout=120.0)
        self._headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

    def chat(
        self,
        model: str,
        messages: list,
        stream: bool = False,
        temperature: float = 1.0,
        max_tokens: Optional[int] = None,
    ) -> dict:
        payload = {
            "model": model,
            "messages": messages,
            "stream": stream,
            "temperature": temperature,
        }
        if max_tokens:
            payload["max_tokens"] = max_tokens

        response = self.client.post(
            f"{self.base_url}/api/v1/chat/completions",
            headers=self._headers,
            json=payload,
        )
        return response.json()

    def stream_chat(
        self, model: str, messages: list, **kwargs
    ) -> AsyncIterator[dict]:
        payload = {
            "model": model,
            "messages": messages,
            "stream": True,
            **kwargs,
        }
        with self.client.stream(
            "POST",
            f"{self.base_url}/api/v1/chat/completions",
            headers=self._headers,
            json=payload,
        ) as response:
            for line in response.iter_lines():
                if line.startswith("data: "):
                    yield json.loads(line[6:])

    def models(self) -> list:
        response = self.client.get(
            f"{self.base_url}/api/v1/models",
            headers=self._headers,
        )
        return response.json()["models"]

    def usage(self) -> dict:
        response = self.client.get(
            f"{self.base_url}/api/v1/usage",
            headers=self._headers,
        )
        return response.json()

    def billing(self) -> dict:
        response = self.client.get(
            f"{self.base_url}/api/v1/billing",
            headers=self._headers,
        )
        return response.json()
