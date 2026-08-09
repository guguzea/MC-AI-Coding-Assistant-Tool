/**
 * Import joined.tsrg (tab-indented Forge 1.13 style) into mapping sqlite.
 * Format verified against data/forge_1.13.2/mappings/joined.tsrg:
 *   class line (col 0):  obf mapped
 *   member (tab):        obf (desc) mapped   OR  obf mapped
 */
import readline from "node:readline";

/**
 * @param {import('node:sqlite').DatabaseSync} db
 * @param {import('node:stream').Readable} input
 * @param {{ version?: string, source?: string }} [meta]
 */
export async function importTsrgStream(db, input, meta = {}) {
  const insertClass = db.prepare(
    "INSERT OR REPLACE INTO classes(named, intermediary, official) VALUES (?, ?, ?)",
  );
  const insertMethod = db.prepare(
    `INSERT OR REPLACE INTO methods(
      owner_named, name_named, descriptor_named,
      name_official, descriptor_official, name_intermediary
    ) VALUES (?, ?, ?, ?, ?, ?)`,
  );
  const insertField = db.prepare(
    `INSERT OR REPLACE INTO fields(
      owner_named, name_named, descriptor_named,
      name_official, descriptor_official, name_intermediary
    ) VALUES (?, ?, ?, ?, ?, ?)`,
  );

  let currentNamed = null;
  let currentObf = null;
  let classCount = 0;
  let methodCount = 0;
  let fieldCount = 0;

  db.exec("BEGIN");
  const rl = readline.createInterface({ input, crlfDelay: Infinity });
  for await (const rawLine of rl) {
    if (!rawLine) continue;
    const isIndented = rawLine.startsWith("\t");
    if (!isIndented) {
      const tokens = rawLine.trim().split(/\s+/);
      if (tokens.length === 2) {
        const [obfName, mappedName] = tokens;
        if (!mappedName || obfName === mappedName) continue;
        currentObf = obfName;
        currentNamed = mappedName;
        insertClass.run(mappedName, mappedName, obfName);
        classCount++;
      }
      continue;
    }
    if (!currentNamed) continue;
    const tokens = rawLine.trim().split(/\s+/);
    if (tokens.length === 0) continue;
    if (tokens[0].startsWith("<")) continue;

    if (tokens.length === 3) {
      const [obfName, descriptor, mappedName] = tokens;
      if (!mappedName) continue;
      if (descriptor.includes("(") && descriptor.includes(")")) {
        insertMethod.run(currentNamed, mappedName, descriptor, obfName, descriptor, null);
        methodCount++;
      } else {
        insertField.run(currentNamed, mappedName, descriptor || "", obfName, descriptor || "", null);
        fieldCount++;
      }
      continue;
    }
    if (tokens.length === 2) {
      const [obfName, mappedName] = tokens;
      if (!mappedName) continue;
      insertField.run(currentNamed, mappedName, "", obfName, "", null);
      fieldCount++;
      continue;
    }
    if (tokens.length === 4) {
      const [obfName, , descriptor, mappedName] = tokens;
      if (!mappedName) continue;
      if (descriptor.includes("(") && descriptor.includes(")")) {
        insertMethod.run(currentNamed, mappedName, descriptor, obfName, descriptor, null);
        methodCount++;
      } else {
        insertField.run(currentNamed, mappedName, descriptor || "", obfName, descriptor || "", null);
        fieldCount++;
      }
    }
  }
  void currentObf;
  db.exec("COMMIT");
  return { classCount, methodCount, fieldCount, mappingEra: "tsrg", source: meta.source ?? "" };
}
