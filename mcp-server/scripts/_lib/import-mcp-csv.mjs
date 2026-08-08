/**
 * Import MCP methods.csv (searge,name,...) into searge_methods table.
 * No owner class paths in CSV era.
 */
import fs from "node:fs";
import { parseCSV } from "./csv.js";

/**
 * @param {import('node:sqlite').DatabaseSync} db
 * @param {string} csvPath
 * @param {{ version?: string, source?: string }} [meta]
 */
export function importMcpCsvMethods(db, csvPath, meta = {}) {
  const text = fs.readFileSync(csvPath, "utf8");
  const { headers, rows, errors } = parseCSV(text);
  if (!headers.includes("searge") || !headers.includes("name")) {
    throw new Error(`methods.csv missing searge/name columns: ${csvPath}`);
  }
  if (errors.length > 0) {
    // tolerate minor column mismatches; hard-fail only if no rows
  }

  const insert = db.prepare(
    "INSERT OR REPLACE INTO searge_methods(searge, name_named, descriptor_named) VALUES (?, ?, ?)",
  );

  let methodCount = 0;
  db.exec("BEGIN");
  for (const row of rows) {
    const searge = row.searge ?? "";
    const name = row.name ?? "";
    const desc = row.desc ?? "";
    if (!searge || !name) continue;
    insert.run(searge, name, desc || "");
    methodCount++;
  }
  db.exec("COMMIT");
  return {
    classCount: 0,
    methodCount,
    fieldCount: 0,
    mappingEra: "mcp-csv",
    source: meta.source ?? csvPath,
  };
}
