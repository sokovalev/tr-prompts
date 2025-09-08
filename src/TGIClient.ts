import { InferenceClient } from "@huggingface/inference";

export class TGIHfClient {
  private host: string;
  private model: string;
  private systemPrompt?: string;
  private format?: Record<string, unknown>;
  private hf: InferenceClient;
  private temperature: number;
  private maxTokens: number;

  constructor() {
    this.host =
      `http://${process.env.TGI_HOST}:${process.env.TGI_PORT}` ||
      "http://localhost:8080";

    this.model = process.env.TGI_MODEL || "tgi";
    this.temperature = parseFloat(process.env.TGI_TEMPERATURE || "0.3");
    this.maxTokens = parseInt(process.env.TGI_MAX_NEW_TOKENS || "512");
    this.hf = new InferenceClient("", { endpointUrl: this.host });
  }

  setSystemPrompt(systemPrompt: string) {
    this.systemPrompt = systemPrompt;
  }

  setFormat(format: Record<string, unknown>) {
    this.format = format;
  }

  /**
   * Non-streaming chat completion
   */
  async getResponse(userMessage: string): Promise<string> {
    if (!userMessage) {
      throw new Error("User message is required");
    }

    if (!this.format) {
      throw new Error("Format is required");
    }

    if (!this.systemPrompt) {
      throw new Error("System prompt is required");
    }

    const messages = [];
    if (this.systemPrompt) {
      messages.push({ role: "system", content: this.systemPrompt });
    }
    messages.push({ role: "user", content: userMessage });

    const res = await this.hf.chatCompletion({
      model: this.model,
      messages,
      response_format: {
        type: "json_schema",
        value: {
          schema: this.format,
          name: "response_schema",
          strict: true,
        },
      },
      temperature: this.temperature,
      max_tokens: this.maxTokens,
    });

    const content = res.choices?.[0]?.message?.content ?? "";
    return content;
  }

  async *getResponseStream(userMessage: string): AsyncGenerator<string> {
    const systemContent =
      (this.systemPrompt ?? "You are a helpful assistant.") +
      (this.format
        ? `\n\nWhen responding, use this format:\n${this.format}`
        : "");

    for await (const chunk of this.hf.chatCompletionStream({
      model: this.model,
      messages: [
        { role: "system", content: systemContent },
        { role: "user", content: userMessage },
      ],
      temperature: this.temperature,
      max_tokens: this.maxTokens,
    })) {
      const delta = chunk.choices?.[0]?.delta?.content ?? "";
      if (delta) yield delta;
    }
  }
}
