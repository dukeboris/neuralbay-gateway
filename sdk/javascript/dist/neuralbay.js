// NeuralBay JavaScript SDK
// Installation: npm install neuralbay
export class NeuralBay {
    constructor(config = {}) {
        this.apiKey = config.apiKey || process.env.NEURABAY_API_KEY || "";
        this.baseURL = config.baseURL || "https://api.neuralbay.io";
    }
    async chat(options) {
        const response = await fetch(`${this.baseURL}/api/v1/chat/completions`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${this.apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(options),
        });
        if (!response.ok) {
            throw new Error(`NeuralBay API error: ${response.status}`);
        }
        return response.json();
    }
    async *streamChat(options) {
        const response = await fetch(`${this.baseURL}/api/v1/chat/completions`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${this.apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...options, stream: true }),
        });
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        while (true) {
            const { done, value } = await reader.read();
            if (done)
                break;
            const chunk = decoder.decode(value);
            const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));
            for (const line of lines) {
                if (line.includes("[DONE]"))
                    return;
                yield JSON.parse(line.slice(6));
            }
        }
    }
    async listModels() {
        const response = await fetch(`${this.baseURL}/api/v1/models`, {
            headers: { Authorization: `Bearer ${this.apiKey}` },
        });
        const data = await response.json();
        return data.models;
    }
    async getUsage() {
        const response = await fetch(`${this.baseURL}/api/v1/usage`, {
            headers: { Authorization: `Bearer ${this.apiKey}` },
        });
        return response.json();
    }
}
export default NeuralBay;
