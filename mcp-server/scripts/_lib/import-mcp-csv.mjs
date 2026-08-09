/**
 * Import MCP methods.csv / fields.csv into searge_methods / searge_fields.
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
  void errors;

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

/**
 * @param {import('node:sqlite').DatabaseSync} db
 * @param {string} csvPath
 * @param {{ version?: string, source?: string }} [meta]
 */
export function importMcpCsvFields(db, csvPath, meta = {}) {
  const text = fs.readFileSync(csvPath, "utf8");
  const { headers, rows } = parseCSV(text);
  if (!headers.includes("searge") || !headers.includes("name")) {
    throw new Error(`fields.csv missing searge/name columns: ${csvPath}`);
  }

  const insert = db.prepare(
    "INSERT OR REPLACE INTO searge_fields(searge, name_named, descriptor_named) VALUES (?, ?, ?)",
  );

  let fieldCount = 0;
  db.exec("BEGIN");
  for (const row of rows) {
    const searge = row.searge ?? "";
    const name = row.name ?? "";
    const desc = row.desc ?? "";
    if (!searge || !name) continue;
    insert.run(searge, name, desc || "");
    fieldCount++;
  }
  db.exec("COMMIT");
  return {
    classCount: 0,
    methodCount: 0,
    fieldCount,
    mappingEra: "mcp-csv",
    source: meta.source ?? csvPath,
  };
}
