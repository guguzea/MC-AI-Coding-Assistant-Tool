/**
 * Import joined.srg (CL:/MD:/FD:) into mapping sqlite.
 * Format verified against data/forge_1.12.2/mappings/joined.srg.
 */
import readline from "node:readline";

/**
 * @param {import('node:sqlite').DatabaseSync} db
 * @param {import('node:stream').Readable} input
 * @param {{ version?: string, source?: string }} [meta]
 */
export async function importForgeSrgStream(db, input, meta = {}) {
  const insertClass = db.prepare(
    "INSERT OR REPLACE INTO classes(named, intermediary, official) VALUES (?, ?, ?)",
  );
  const insertMethod = db.prepare(
    `INSERT OR REPLACE INTO methods(
      owner_named, name_named, descriptor_named,
      name_official, descriptor_official, name_intermediary
    ) VALUES (?, ?, ?, ?, ?, ?)`,
  );

  let classCount = 0;
  let methodCount = 0;
  let fieldCount = 0;

  db.exec("BEGIN");
  const rl = readline.createInterface({ input, crlfDelay: Infinity });
  for await (const line of rl) {
    if (!line) continue;
    const colonIdx = line.indexOf(":");
    if (colonIdx < 0) continue;
    const code = line.slice(0, colonIdx + 1);
    const rest = line.slice(colonIdx + 1).trim();
    if (!rest) continue;
    const tokens = rest.split(/\s+/);

    if (code === "PK:") continue;

    if (code === "CL:") {
      if (tokens.length === 2 && tokens[0] !== tokens[1]) {
        const [obf, mapped] = tokens;
        insertClass.run(mapped, mapped, obf);
        classCount++;
      }
      continue;
    }

    if (code === "MD:") {
      // MD: obfClass/obfMethod descriptor mappedClass/mappedMethod descriptor
      if (tokens.length === 4) {
        const obfFull = tokens[0];
        const descObf = tokens[1];
        const mappedFull = tokens[2];
        const descMapped = tokens[3];
        const slash = obfFull.lastIndexOf("/");
        const mappedSlash = mappedFull.lastIndexOf("/");
        const obfMethod = slash >= 0 ? obfFull.slice(slash + 1) : obfFull;
        const mappedClass = mappedSlash >= 0 ? mappedFull.slice(0, mappedSlash) : mappedFull;
        const mappedMethod = mappedSlash >= 0 ? mappedFull.slice(mappedSlash + 1) : mappedFull;
        if (mappedMethod.startsWith("<")) continue;
        insertMethod.run(
          mappedClass,
          mappedMethod,
          descMapped || "",
          obfMethod,
          descObf || descMapped || "",
          null,
        );
        methodCount++;
      } else if (tokens.length === 2) {
        const mappedFull = tokens[1];
        const mappedSlash = mappedFull.lastIndexOf("/");
        const mappedClass = mappedSlash >= 0 ? mappedFull.slice(0, mappedSlash) : mappedFull;
        const mappedMethod = mappedSlash >= 0 ? mappedFull.slice(mappedSlash + 1) : mappedFull;
        const obfFull = tokens[0];
        const slash = obfFull.lastIndexOf("/");
        const obfMethod = slash >= 0 ? obfFull.slice(slash + 1) : obfFull;
        if (mappedMethod.startsWith("<")) continue;
        insertMethod.run(mappedClass, mappedMethod, "", obfMethod, "", null);
        methodCount++;
      }
      continue;
    }

    if (code === "FD:") {
      fieldCount++;
      continue;
    }
  }
  db.exec("COMMIT");
  return { classCount, methodCount, fieldCount, mappingEra: "forge-srg", source: meta.source ?? "" };
}
