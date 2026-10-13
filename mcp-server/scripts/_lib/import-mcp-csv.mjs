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
  // 列数/引号错误不得被 `void errors` 丢弃：坏行会 object-ify 成 r[i] ?? ""，缺 searge/name 静默 continue、
  // 右移情形则把错值写进列 ⇒ 以错值入库而覆盖度看着正常。fail-closed。
  if (errors.length > 0) {
    throw new Error(`methods.csv parse errors (${errors.length}): ${errors.slice(0, 3).join("; ")}${errors.length > 3 ? " …" : ""} (${csvPath})`);
  }

  const insert = db.prepare(
    "INSERT OR REPLACE INTO searge_methods(searge, name_named, descriptor_named) VALUES (?, ?, ?)",
  );

  let methodCount = 0;
  let skipped = 0;
  db.exec("BEGIN");
  for (const row of rows) {
    const searge = row.searge ?? "";
    const name = row.name ?? "";
    const desc = row.desc ?? "";
    if (!searge || !name) { skipped++; continue; }
    insert.run(searge, name, desc || "");
    methodCount++;
  }
  db.exec("COMMIT");
  if (skipped > 0) console.warn(`import-mcp-csv: methods ${skipped} 行缺 searge/name 被跳过 (${meta.source ?? csvPath})`);
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
  const { headers, rows, errors } = parseCSV(text);
  if (!headers.includes("searge") || !headers.includes("name")) {
    throw new Error(`fields.csv missing searge/name columns: ${csvPath}`);
  }
  if (errors.length > 0) {
    throw new Error(`fields.csv parse errors (${errors.length}): ${errors.slice(0, 3).join("; ")}${errors.length > 3 ? " …" : ""} (${csvPath})`);
  }

  const insert = db.prepare(
    "INSERT OR REPLACE INTO searge_fields(searge, name_named, descriptor_named) VALUES (?, ?, ?)",
  );

  let fieldCount = 0;
  let skipped = 0;
  db.exec("BEGIN");
  for (const row of rows) {
    const searge = row.searge ?? "";
    const name = row.name ?? "";
    const desc = row.desc ?? "";
    if (!searge || !name) { skipped++; continue; }
    insert.run(searge, name, desc || "");
    fieldCount++;
  }
  db.exec("COMMIT");
  if (skipped > 0) console.warn(`import-mcp-csv: fields ${skipped} 行缺 searge/name 被跳过 (${meta.source ?? csvPath})`);
  return {
    classCount: 0,
    methodCount: 0,
    fieldCount,
    mappingEra: "mcp-csv",
    source: meta.source ?? csvPath,
  };
}
