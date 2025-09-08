import fs from "fs";
import path from "path";
import { config } from "dotenv";

config();

export function loadResponseFormat() {
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
