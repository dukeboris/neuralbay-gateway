interface ChatMessage {
    role: "system" | "user" | "assistant";
    content: string;
}
interface ChatOptions {
    model: string;
    messages: ChatMessage[];
    stream?: boolean;
    temperature?: number;
    max_tokens?: number;
}
interface NeuralBayConfig {
    apiKey?: string;
    baseURL?: string;
}
export declare class NeuralBay {
    private apiKey;
    private baseURL;
    constructor(config?: NeuralBayConfig);
    chat(options: ChatOptions): Promise<Response>;
    streamChat(options: ChatOptions): AsyncGenerator<string>;
    listModels(): Promise<string[]>;
    getUsage(): Promise<any>;
}
export default NeuralBay;
