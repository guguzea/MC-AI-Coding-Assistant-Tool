/**
 * Shared Yarn Tiny v1 parser (A/C 唯一入口).
 *
 * Tiny columns (v1 official/intermediary/named):
 *   CLASS   official | intermediary | named
 *   METHOD  ownerOfficial | descriptor | nameOfficial | nameIntermediary | nameNamed
 *   FIELD   ownerOfficial | descriptor | nameOfficial | nameIntermediary | nameNamed
 *
 * Usage:
 *   const r = await parseTiny(pathOrStream, { strict: false });
 */
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import readline from "node:readline";
import { Readable } from "node:stream";

/**
 * @typedef {{
 *   official: string,
 *   intermediary: string,
 *   named: string,
 * }} TinyClass
 *
 * @typedef {{
 *   ownerOfficial: string,
 *   ownerNamed: string,
 *   nameOfficial: string,
 *   nameIntermediary: string,
 *   nameNamed: string,
 *   descriptorOfficial: string,
 *   descriptorNamed: string,
 * }} TinyMethod
 *
 * @typedef {{
 *   ownerOfficial: string,
 *   ownerNamed: string,
 *   nameOfficial: string,
 *   nameIntermediary: string,
 *   nameNamed: string,
 *   descriptorOfficial: string,
 *   descriptorNamed: string,
 * }} TinyField
 *
 * @typedef {{
 *   classes: TinyClass[],
 *   methods: TinyMethod[],
 *   fields: TinyField[],
 *   warnings: string[],
 *   headerNamespaces: string[],
 * }} ParseTinyResult
 */

function pushWarning(warnings, strict, msg) {
  if (strict) throw new Error(msg);
  warnings.push(msg);
}

/**
 * Parse one Tiny line given current class context.
 * @returns {{ kind: 'class'|'method'|'field'|'skip'|'header', value?: any }}
 */
export function parseTinyLine(line, currentClass, { strict = false, warnings = [] } = {}) {
  if (!line || !line.trim()) return { kind: "skip" };
  if (line.startsWith("v1\t") || line.startsWith("tiny\t")) {
    const ns = line.split("\t").slice(1);
    return { kind: "header", value: ns };
  }
  const cols = line.split("\t");
  const tag = cols[0];
  if (tag === "CLASS") {
    if (cols.length < 4) {
      pushWarning(warnings, strict, `CLASS line has <4 columns: ${line.slice(0, 80)}`);
      return { kind: "skip" };
    }
    return {
      kind: "class",
      value: {
        official: cols[1] ?? "",
        intermediary: cols[2] ?? "",
        named: cols[3] ?? "",
      },
    };
  }
  if (tag === "METHOD") {
    if (!currentClass) {
      pushWarning(warnings, strict, `METHOD before any CLASS: ${line.slice(0, 80)}`);
      return { kind: "skip" };
    }
    if (cols.length < 5) {
      pushWarning(warnings, strict, `METHOD line has <5 columns: ${line.slice(0, 80)}`);
      return { kind: "skip" };
    }
    const ownerOfficial = cols[1] ?? "";
    const descriptor = cols[2] ?? "";
    let nameOfficial = "";
    let nameIntermediary = "";
    let nameNamed = "";
    if (cols.length >= 6) {
      nameOfficial = cols[3] ?? "";
      nameIntermediary = cols[4] ?? "";
      nameNamed = cols[5] ?? "";
    } else {
      // 5 cols: owner, desc, inter, named (rare) or owner, desc, off, named
      nameOfficial = cols[3] ?? "";
      nameIntermediary = cols[3] ?? "";
      nameNamed = cols[4] ?? "";
    }
    if (!nameNamed) {
      pushWarning(warnings, strict, `METHOD missing named: ${line.slice(0, 80)}`);
      return { kind: "skip" };
    }
    return {
      kind: "method",
      value: {
        ownerOfficial: ownerOfficial || currentClass.official,
        ownerNamed: currentClass.named,
        nameOfficial,
        nameIntermediary,
        nameNamed,
        descriptorOfficial: descriptor,
        descriptorNamed: descriptor,
      },
    };
  }
  if (tag === "FIELD") {
    if (!currentClass) {
      pushWarning(warnings, strict, `FIELD before any CLASS: ${line.slice(0, 80)}`);
      return { kind: "skip" };
    }
    if (cols.length < 5) {
      pushWarning(warnings, strict, `FIELD line has <5 columns: ${line.slice(0, 80)}`);
      return { kind: "skip" };
    }
    const ownerOfficial = cols[1] ?? "";
    const descriptor = cols[2] ?? "";
    let nameOfficial = "";
    let nameIntermediary = "";
    let nameNamed = "";
    if (cols.length >= 6) {
      nameOfficial = cols[3] ?? "";
      nameIntermediary = cols[4] ?? "";
      nameNamed = cols[5] ?? "";
    } else {
      nameOfficial = cols[3] ?? "";
      nameIntermediary = cols[3] ?? "";
      nameNamed = cols[4] ?? "";
    }
    if (!nameNamed) {
      pushWarning(warnings, strict, `FIELD missing named: ${line.slice(0, 80)}`);
      return { kind: "skip" };
    }
    return {
      kind: "field",
      value: {
        ownerOfficial: ownerOfficial || currentClass.official,
        ownerNamed: currentClass.named,
        nameOfficial,
        nameIntermediary,
        nameNamed,
        descriptorOfficial: descriptor,
        descriptorNamed: descriptor,
      },
    };
  }
  // ignore COMMENT / PARAM / etc.
  return { kind: "skip" };
}

/**
 * @param {import('node:stream').Readable|string|Buffer} input
 * @param {{ strict?: boolean }} [opts]
 * @returns {Promise<ParseTinyResult>}
 */
export async function parseTinyStream(input, opts = {}) {
  const strict = opts.strict === true;
  /** @type {ParseTinyResult} */
  const result = {
    classes: [],
    methods: [],
    fields: [],
    warnings: [],
    headerNamespaces: [],
  };
  let currentClass = null;
  const stream =
    typeof input === "string" || Buffer.isBuffer(input)
      ? Readable.from([typeof input === "string" ? input : input.toString("utf8")])
      : input;

  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });
  let sawHeader = false;
  for await (const line of rl) {
    const parsed = parseTinyLine(line, currentClass, { strict, warnings: result.warnings });
    if (parsed.kind === "header") {
      sawHeader = true;
      result.headerNamespaces = parsed.value ?? [];
      continue;
    }
    if (parsed.kind === "class") {
      currentClass = parsed.value;
      if (currentClass.named) result.classes.push(currentClass);
      else pushWarning(result.warnings, strict, "CLASS missing named");
      continue;
    }
    if (parsed.kind === "method") {
      result.methods.push(parsed.value);
      continue;
    }
    if (parsed.kind === "field") {
      result.fields.push(parsed.value);
      continue;
    }
  }
  if (!sawHeader && result.classes.length === 0 && result.methods.length === 0) {
    const msg = "Tiny stream produced no classes/methods (missing/corrupt header?)";
    if (strict) throw new Error(msg);
    result.warnings.push(msg);
  }
  // Tiny METHOD/FIELD descriptor column is always in the first namespace (official).
  // Remap L...; refs to named class paths for descriptorNamed.
  // Also resolve ownerNamed by ownerOfficial — required for "flat" Tiny layouts
  // (Yarn 1.14–1.19: all CLASS lines first, then FIELD/METHOD) where currentClass
  // would otherwise stick on the last CLASS.
  const officialToNamed = new Map();
  for (const c of result.classes) {
    if (c.official && c.named) officialToNamed.set(c.official, c.named);
  }
  const remapDesc = (desc) =>
    desc.replace(/L([^;]+);/g, (_, cls) => {
      const named = officialToNamed.get(cls);
      return named ? `L${named};` : `L${cls};`;
    });
  for (const m of result.methods) {
    const ownerNamed = officialToNamed.get(m.ownerOfficial);
    if (ownerNamed) m.ownerNamed = ownerNamed;
    m.descriptorNamed = remapDesc(m.descriptorOfficial || m.descriptorNamed || "");
  }
  for (const f of result.fields) {
    const ownerNamed = officialToNamed.get(f.ownerOfficial);
    if (ownerNamed) f.ownerNamed = ownerNamed;
    f.descriptorNamed = remapDesc(f.descriptorOfficial || f.descriptorNamed || "");
  }
  return result;
}

/**
 * Find tiny file under a mappings directory.
 * @returns {{ path: string, gzip: boolean } | null}
 */
export function findTinyPath(mappingsDir) {
  if (!fs.existsSync(mappingsDir)) return null;
  const names = fs.readdirSync(mappingsDir);
  const gz = names.find((n) => n.endsWith("-tiny.gz") || n === "mappings.tiny.gz");
  if (gz) return { path: path.join(mappingsDir, gz), gzip: true };
  const tiny = names.find((n) => n === "mappings.tiny" || n.endsWith(".tiny"));
  if (tiny) return { path: path.join(mappingsDir, tiny), gzip: false };
  return null;
}

/**
 * @param {string} filePath
 * @param {{ strict?: boolean, gzip?: boolean }} [opts]
 * @returns {Promise<ParseTinyResult>}
 */
export async function parseTinyFile(filePath, opts = {}) {
  const gzip = opts.gzip ?? /\.gz$/i.test(filePath);
  const input = gzip
    ? fs.createReadStream(filePath).pipe(zlib.createGunzip())
    : fs.createReadStream(filePath, { encoding: "utf8" });
  return parseTinyStream(input, { strict: opts.strict === true });
}

/**
 * Resolve path or stream and parse.
 * @param {string|import('node:stream').Readable} source
 * @param {{ strict?: boolean, gzip?: boolean }} [opts]
 */
export async function parseTiny(source, opts = {}) {
  if (typeof source === "string") {
    return parseTinyFile(source, opts);
  }
  return parseTinyStream(source, opts);
}

/**
 * Locate getHealth (or any named method) under a named owner substring for tests.
 */
export function findNamedMethod(parsed, nameNamed, ownerNamedIncludes) {
  return (
    parsed.methods.find(
      (m) =>
        m.nameNamed === nameNamed &&
        (!ownerNamedIncludes || m.ownerNamed.includes(ownerNamedIncludes)),
    ) ?? null
  );
}
