import { Ollama } from "ollama";
import { Agent } from "undici";

const noTimeoutFetch = (
  input: string | URL | globalThis.Request,
  init?: RequestInit
) => {
  const someInit = init || {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return fetch(input, {
    ...someInit,
    dispatcher: new Agent({ keepAliveMaxTimeout: 60e3 }) as any,
  });
};

type OllamaClientConfig = {
  host: string;
  model: string;
};

export class OllamaClient {
  private systemPrompt: string | undefined;
  private format: string | undefined;
  private ollama: Ollama;
  private model: string;

  constructor(config: OllamaClientConfig) {
    this.ollama = new Ollama({ host: config.host, fetch: noTimeoutFetch });
    this.model = config.model;
  }

  async getResponse(userMessage: string) {
    const response = await this.ollama.chat({
      model: this.model,
      messages: [
        {
          role: "system",
          content: this.systemPrompt || "You are a helpful assistant.",
        },
        { role: "user", content: userMessage },
      ],
      stream: false,
      format: this.format || { type: "string" },
      options: {
        temperature: parseFloat(process.env.OLLAMA_TEMPERATURE || "0.3"),
        num_ctx: parseInt(process.env.OLLAMA_NUM_CTX || "128000"),
      },
    });
    return response.message.content;
  }

  setFormat(format: string) {
    this.format = format;
  }

  setSystemPrompt(systemPrompt: string) {
    this.systemPrompt = systemPrompt;
  }
}
