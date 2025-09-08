import fs from "fs";
import path from "path";
import { config } from "dotenv";

config();

export function loadSystemPrompt() {
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
