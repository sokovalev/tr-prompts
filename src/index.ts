import fs from "fs";
import path from "path";
import { config } from "dotenv";
import { OllamaClient } from "./OllamaClient";

// Load environment variables
config();

const ollamaConfig = {
  host: `http://${process.env.OLLAMA_HOST || "localhost"}:${
    process.env.OLLAMA_PORT || "11434"
  }`,
  model: process.env.OLLAMA_MODEL || "llama4",
  // systemPromptFile: process.env.SYSTEM_PROMPT || "system-prompt.txt",
  // formatSchemaFile: process.env.FORMAT_SCHEMA || "format.json",
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

async function main() {
  const ollamaClient = new OllamaClient(ollamaConfig);
  const format = loadResponseFormat();
  const systemPrompt = loadSystemPrompt();
  const files = getFiles();

  ollamaClient.setFormat(format);
  ollamaClient.setSystemPrompt(systemPrompt);

  for (let filename of files) {
    const fileContent = getFileContent(filename);
    const response = await ollamaClient.getResponse(fileContent);
    console.log(response);
  }
}

// Run the main function
if (require.main === module) {
  main().catch((error) => {
    console.error("❌ Fatal error:", error);
    process.exit(1);
  });
}

function loadResponseFormat() {
  try {
    const format = fs.readFileSync(
      path.join(process.cwd(), "format.json"),
      "utf8"
    );
    return JSON.parse(format);
  } catch (error) {
    console.error("❌ Error loading response format:", error);
    throw error;
  }
}

function getFiles() {
  try {
    const files = fs.readdirSync(path.join(process.cwd(), "data"));
    return files.filter((file) => file.endsWith(".txt"));
  } catch (error) {
    console.error("❌ Error getting files:", error);
    throw error;
  }
}

function getFileContent(file: string) {
  try {
    const content = fs.readFileSync(
      path.join(process.cwd(), "data", file),
      "utf8"
    );
    return content;
  } catch (error) {
    console.error("❌ Error getting file content:", error);
    throw error;
  }
}

function loadSystemPrompt() {
  try {
    const prompt = fs.readFileSync(
      path.join(
        process.cwd(),
        process.env.SYSTEM_PROMPT || "system-prompt.txt"
      ),
      "utf8"
    );
    return prompt;
  } catch (error) {
    console.error("❌ Error loading system prompt:", error);
    throw error;
  }
}
