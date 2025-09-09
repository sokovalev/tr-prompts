import { config } from "dotenv";
import Database from "better-sqlite3";
import { TGIHfClient } from "./TGIClient";
import path from "path";
import { loadResponseFormat, loadSystemPrompt } from "./utils";

config();

export class DBProcessor {
  private db: Database.Database;
  private tgiClient: TGIHfClient;

  constructor() {
    this.tgiClient = new TGIHfClient();
    this.tgiClient.setFormat(loadResponseFormat());
    this.tgiClient.setSystemPrompt(loadSystemPrompt());

    this.db = new Database(path.resolve(process.cwd(), "data/creditors.db"));
    addColumnIfNotExists(this.db, "credit_requirement", "llm_response");
    addColumnIfNotExists(this.db, "credit_requirement", "llm_ocherednost");
  }

  async processDatabase() {
    try {
      const result = this.db
        .prepare(
          "SELECT COUNT(*) as rowsCount FROM credit_requirement WHERE is_processed = 1 and llm_response IS NULL"
        )
        .get() as { rowsCount: number };

      console.log("Rows to process:", result.rowsCount);

      const entriesWithPDFTextIds = this.db
        .prepare<
          undefined[],
          {
            id: number;
          }
        >(
          "SELECT id, pdf_text as pdfText, ocherednost FROM credit_requirement WHERE is_processed = 1 and llm_response IS NULL"
        )
        .all();

      let processed = 0;
      let matching = 0;
      let errored = 0;
      const getEntryQuery = this.db.prepare<
        {},
        {
          pdfText: string;
          ocherednost: string;
          id: number;
        }
      >(
        `SELECT pdf_text as pdfText, ocherednost FROM credit_requirement WHERE id = ?`
      );

      for (const { id } of entriesWithPDFTextIds) {
        console.log("Processing entry:", id);
        const entry = getEntryQuery.get(id);
        if (!entry) continue;

        try {
          const llmResponse = await this.tgiClient.getResponse(entry.pdfText);
          const responseJson = JSON.parse(llmResponse);
          console.log("ORIGINAL:", entry.ocherednost);
          console.log("LLM ocherednost:", getOcherednost(responseJson));
          processed++;
          if (entry.ocherednost === getOcherednost(responseJson)) {
            matching++;
          }

          await this.db
            .prepare(
              "UPDATE credit_requirement SET llm_response = ?, llm_ocherednost = ? WHERE id = ?"
            )
            .run(llmResponse, getOcherednost(responseJson), id);
        } catch (error) {
          errored += 1;
          console.error("❌ Error processing entry:", error);
        } finally {
          console.log({
            errored,
            processed,
            matching,
            precision: matching / processed,
          });
        }
      }
    } catch (error) {
      console.error("❌ Error processing database:", error);
      throw error;
    } finally {
      this.db.close();
    }
  }
}
(function main() {
  const dbProcessor = new DBProcessor();
  dbProcessor.processDatabase();
})();

function getOcherednost(llmResponse: {
  требования: {
    подгруппа: string;
    сумма: number;
  }[];
}) {
  return llmResponse["требования"]
    .map((order) => order["подгруппа"])
    .sort()
    .join("|");
}

function addColumnIfNotExists(
  db: Database.Database,
  table: string,
  column: string
) {
  const dbExistsCheck = db
    .prepare(
      `
  SELECT COUNT(*) as columnExists
  FROM pragma_table_info('${table}') 
  WHERE name = '${column}';
`
    )
    .get() as { columnExists: number };

  if (dbExistsCheck.columnExists !== 1) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} TEXT;`);
  }
}
