/**
 * Convert `mappings/mappings.tiny` (yarn tiny v1) into the legacy
 * `yarn-mappings.json` shape used by `mcp-server`.
 *
 * The on-disk shape today is:
 *   {
 *     version, format, source, classCount, methodCount,
 *     classMap: { <named>: { officialClass, intermediaryClass, namedClass } }
 *   }
 *
 * The classMap entries hold class-level metadata only; member counts are
 * reflected at the top level (classCount, methodCount). This mirrors the
 * existing yarn-mappings.json files committed to the repo.
 *
 * tiny columns:
 *   CLASS   owner | intermediary | named
 *   FIELD   owner | desc | intermediary-name | mcp-name? | named
 *   METHOD  owner | desc | intermediary-name | mcp-name? | named
 *
 * FIELD/METHOD rows continue to belong to the most recent CLASS line.
 */
import fs from "node:fs";
import path from "node:path";

/** Parse tiny v1 text into { classMap, classCount, methodCount }. */
export function parseTinyToClassMap(text) {
  const lines = text.split(/\r?\n/);
  const classMap = Object.create(null);
  let classCount = 0;
  let methodCount = 0;
  for (const line of lines) {
    if (!line) continue;
    if (line.startsWith("v1\t")) continue; // header
    const cols = line.split("\t");
    const tag = cols[0];
    if (tag === "CLASS") {
      const info = {
        officialClass: cols[1],
        intermediaryClass: cols[2],
        namedClass: cols[3],
      };
      classMap[info.namedClass] = info;
      classCount++;
    } else if (tag === "METHOD") {
      methodCount++;
    }
    // FIELD rows do not change classCount / methodCount in the legacy shape.
  }
  return { classMap, classCount, methodCount };
}

/** Read tiny file from disk and parse. */
export function buildYarnMappingFromTinyFile(tinyPath) {
  return parseTinyToClassMap(fs.readFileSync(tinyPath, "utf8"));
}

/** Render legacy yarn-mappings.json string. */
export function renderYarnMappingJson(parsed, meta) {
  const out = {
    version: meta.version,
    format: meta.format ?? "yarn-tiny-v1",
    source: meta.source ?? null,
    classCount: parsed.classCount,
    methodCount: parsed.methodCount,
    classMap: parsed.classMap,
  };
  return JSON.stringify(out);
}

if (process.argv[1] && process.argv[1].endsWith("build-yarn-mappings.mjs")) {
  const [, , tiny, out, ...flags] = process.argv;
  if (!tiny || !out) {
    console.error("usage: build-yarn-mappings.mjs <tiny> <outJson> [--version=X] [--source=url] [--format=...]");
    process.exit(2);
  }
  const meta = { version: null, source: null, format: "yarn-tiny-v1" };
  for (const f of flags) {
    if (f.startsWith("--version=")) meta.version = f.slice(10);
    else if (f.startsWith("--source=")) meta.source = f.slice(9);
    else if (f.startsWith("--format=")) meta.format = f.slice(9);
  }
  if (!meta.version) {
    console.error("--version required");
    process.exit(2);
  }
  const parsed = buildYarnMappingFromTinyFile(path.resolve(tiny));
  const json = renderYarnMappingJson(parsed, meta);
  fs.writeFileSync(out, json);
  console.log(`wrote ${out}: classes=${parsed.classCount} methods=${parsed.methodCount}`);
}
