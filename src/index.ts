import fs from "fs";
import path from "path";
import { config } from "dotenv";
import { TGIHfClient } from "./TGIClient";
import { loadResponseFormat, loadSystemPrompt } from "./utils";

// Load environment variables
config();

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

async function main() {
  const tgiClient = new TGIHfClient();
  tgiClient.setFormat(loadResponseFormat());
  tgiClient.setSystemPrompt(loadSystemPrompt());
  const files = getFiles();

  for (let filename of files) {
    const fileContent = getFileContent(filename);
    const response = await tgiClient.getResponse(fileContent);
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
