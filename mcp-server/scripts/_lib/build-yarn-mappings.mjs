/**
 * Convert a yarn tiny **v1** file (`mappings/mappings.tiny`, or the repo's
 * `*-tiny.gz`) into the legacy `yarn-mappings.json` shape used by `mcp-server`,
 * plus a `verify` subcommand that reconciles the artefact line-by-line with the
 * tiny source (D-1 = A: rebuild + full reconciliation gate).
 *
 * The on-disk shape:
 *   {
 *     version, format, source, classCount, methodCount, fieldCount,
 *     classMap: { <namedClass>: { officialClass, intermediaryClass, namedClass } },
 *     methodMap: {
 *       "<namedClass>.<intermediaryName>:<descriptor>": {
 *         officialClass, officialName, intermediaryClass, intermediaryName,
 *         namedClass, namedName, descriptor, kind: "method" | "field"
 *       }
 *     }
 *   }
 *
 * classMap entries stay exactly {officialClass, intermediaryClass, namedClass} —
 * build-yarn-sqlite.mjs#importLegacyJsonStream matches that key order with a
 * regex, so adding a key there silently breaks the legacy import path.
 *
 * tiny v1 columns (header `v1\tofficial\tintermediary\tnamed`; tags are the
 * whole words CLASS/FIELD/METHOD — `c`/`f`/`m` is the tiny *v2* spelling):
 *   CLASS   (4 cols) official | intermediary | named
 *   FIELD   (6 cols) ownerOfficial | descriptor | nameOfficial | nameIntermediary | nameNamed
 *   METHOD  (6 cols) ownerOfficial | descriptor | nameOfficial | nameIntermediary | nameNamed
 *
 * The named name is the LAST column (index 5). Reading index 4 instead is the
 * off-by-one that made the pre-2026 artefacts untrustworthy: it puts the
 * intermediary name in `namedName` and the official name in `intermediaryName`.
 *
 * FIELD/METHOD rows normally follow their CLASS line; flat layouts (Yarn
 * 1.14–1.19: all CLASS lines first) are resolved through official→named.
 */
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";

/** Expected column counts per tiny v1 tag. Any other count is an error. */
export const TINY_V1_COLUMNS = Object.freeze({ CLASS: 4, FIELD: 6, METHOD: 6 });

/**
 * "Legitimately unmapped" = yarn itself never named the member, so the named
 * column still carries the `method_<digits>` / `field_<digits>` id.
 * Matches sqlite: `name_named GLOB 'method_[0-9]*'` → 13,623 / 49,730 methods
 * and `field_[0-9]*` → 12,808 / 45,248 fields on 1.21.11+build.6.
 */
export function hasNoYarnName(kind, namedName) {
  return kind === "method" ? /^method_\d/.test(namedName) : /^field_\d/.test(namedName);
}

/** named column literally repeats the intermediary column (includes `<init>`). */
export function isSameAsIntermediary(namedName, intermediaryName) {
  return namedName === intermediaryName;
}

/**
 * Single pass over tiny v1 text.
 * @returns {{classes: any[], members: any[], badRows: any[], tagCounts: Record<string, number>,
 *            unmappedNamed: Record<string, number>, totalDataLines: number, otherTagLines: number}}
 */
export function parseTinyV1(text) {
  const lines = text.split(/\r?\n/);
  const classes = [];
  const members = [];
  /** @type {{line: string, lineNo: number, expected: number, actual: number, tag: string}[]} */
  const badRows = [];
  /** @type {Record<string, number>} */
  const tagCounts = Object.create(null);
  /** @type {Record<string, number>} */
  const unmappedNamed = Object.create(null);
  let totalDataLines = 0;
  let otherTagLines = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    const cols = line.split("\t");
    const tag = cols[0];
    if (tag === "v1" || tag === "tiny") continue; // header
    totalDataLines++;
    tagCounts[tag] = (tagCounts[tag] || 0) + 1;

    const expected = TINY_V1_COLUMNS[tag];
    if (expected === undefined) {
      // COMMENT / PARAM / unknown tag: counted, never parsed as a mapping row.
      otherTagLines++;
      continue;
    }
    if (cols.length !== expected) {
      // GATE: a wrong column count is an error, never a silent skip.
      badRows.push({ lineNo: i + 1, tag, expected, actual: cols.length, line: line.slice(0, 120) });
      continue;
    }

    if (tag === "CLASS") {
      classes.push({
        officialClass: cols[1],
        intermediaryClass: cols[2],
        namedClass: cols[3],
        lineNo: i + 1,
      });
      continue;
    }

    const kind = tag === "METHOD" ? "method" : "field";
    members.push({
      kind,
      ownerOfficial: cols[1],
      descriptor: cols[2],
      officialName: cols[3],
      intermediaryName: cols[4],
      namedName: cols[5], // last column
      lineNo: i + 1,
    });
  }

  unmappedNamed.CLASS = classes.filter((c) => isSameAsIntermediary(c.namedClass, c.intermediaryClass)).length;
  const selfEq = { method: 0, field: 0 };
  const unmapped = { method: 0, field: 0 };
  for (const m of members) {
    if (isSameAsIntermediary(m.namedName, m.intermediaryName)) selfEq[m.kind]++;
    if (hasNoYarnName(m.kind, m.namedName)) unmapped[m.kind]++;
  }
  unmappedNamed.methodSelfEq = selfEq.method;
  unmappedNamed.fieldSelfEq = selfEq.field;
  unmappedNamed.method = unmapped.method;
  unmappedNamed.field = unmapped.field;

  return {
    classes,
    members,
    badRows,
    tagCounts,
    unmappedNamed,
    totalDataLines,
    otherTagLines,
  };
}

/**
 * Parse tiny v1 text into the legacy yarn-mappings.json payload.
 * `strict` (default true) turns malformed rows into a thrown error instead of a
 * recorded `badRows` entry, so a build can never quietly drop lines.
 */
export function parseTinyToClassMap(text, opts = {}) {
  const strict = opts.strict !== false;
  const parsed = parseTinyV1(text);
  if (strict && parsed.badRows.length) {
    const first = parsed.badRows[0];
    throw new Error(
      `tiny v1 malformed rows: ${parsed.badRows.length} (first: line ${first.lineNo} tag=${first.tag} ` +
        `expected ${first.expected} columns, got ${first.actual})`,
    );
  }

  const officialToNamed = new Map();
  const officialToInfo = new Map();
  for (const c of parsed.classes) {
    officialToNamed.set(c.officialClass, c.namedClass);
    officialToInfo.set(c.officialClass, c);
  }

  const classMap = Object.create(null);
  for (const c of parsed.classes) classMap[c.namedClass] = {
    officialClass: c.officialClass,
    intermediaryClass: c.intermediaryClass,
    namedClass: c.namedClass,
  };

  const methodMap = Object.create(null);
  /** @type {{key: string, lineNo: number, reason: string}[]} */
  const unresolvedOwner = [];
  for (const m of parsed.members) {
    const owner = officialToInfo.get(m.ownerOfficial);
    if (!owner) {
      unresolvedOwner.push({
        key: `${m.ownerOfficial}.${m.intermediaryName}:${m.descriptor}`,
        lineNo: m.lineNo,
        reason: "ownerOfficial not found in any CLASS row",
      });
      continue;
    }
    const key = `${owner.namedClass}.${m.intermediaryName}:${m.descriptor}`;
    methodMap[key] = {
      officialClass: owner.officialClass,
      officialName: m.officialName,
      intermediaryClass: owner.intermediaryClass,
      intermediaryName: m.intermediaryName,
      namedClass: owner.namedClass,
      namedName: m.namedName,
      descriptor: m.descriptor,
      kind: m.kind,
    };
  }

  if (strict && unresolvedOwner.length) {
    throw new Error(
      `tiny v1 member rows with unresolvable owner: ${unresolvedOwner.length} (first: line ${unresolvedOwner[0].lineNo})`,
    );
  }

  const methodCount = parsed.tagCounts.METHOD || 0;
  const fieldCount = parsed.tagCounts.FIELD || 0;
  return {
    classMap,
    methodMap,
    classCount: parsed.classes.length,
    methodCount,
    fieldCount,
    memberCount: parsed.members.length,
    badRows: parsed.badRows,
    unresolvedOwner,
    tagCounts: parsed.tagCounts,
    unmappedNamed: parsed.unmappedNamed,
    totalDataLines: parsed.totalDataLines,
    otherTagLines: parsed.otherTagLines,
  };
}

function readTinyText(tinyPath) {
  const buf = fs.readFileSync(tinyPath);
  return /\.gz$/i.test(tinyPath) ? zlib.gunzipSync(buf).toString("utf8") : buf.toString("utf8");
}

/** Read tiny file (plain or .gz) from disk and parse. */
export function buildYarnMappingFromTinyFile(tinyPath, opts) {
  return parseTinyToClassMap(readTinyText(tinyPath), opts);
}

/** Render the yarn-mappings.json string. */
export function renderYarnMappingJson(parsed, meta) {
  const out = {
    version: meta.version,
    format: meta.format ?? "yarn-tiny-v1",
    source: meta.source ?? null,
    classCount: parsed.classCount,
    methodCount: parsed.methodCount,
    fieldCount: parsed.fieldCount,
    classMap: parsed.classMap,
    methodMap: parsed.methodMap,
  };
  return JSON.stringify(out);
}

// ── verify: bidirectional line-by-line reconciliation (tolerance 0) ─────────

const CLASS_FIELDS = ["officialClass", "intermediaryClass", "namedClass"];
const MEMBER_FIELDS = [
  "officialClass",
  "officialName",
  "intermediaryClass",
  "intermediaryName",
  "namedClass",
  "namedName",
  "descriptor",
  "kind",
];

/**
 * Which parsed rows does `build-yarn-sqlite.mjs#importTinyIntoDb` NOT insert?
 * - classes: empty `named`
 * - methods: empty owner/name **plus** constructor names starting with `<`
 * - fields: empty owner/name (no `<` rule)
 * Kept next to the builder rule on purpose: the sqlite leg of `verify` compares
 * "inserted subset" counts, and a silent change to either side must go red.
 */
export function isSkippedBySqliteBuilder(kind, row) {
  const owner = row?.namedClass;
  const name = kind === "class" ? row?.namedClass : row?.namedName;
  if (!owner || !name) return true;
  if (kind === "method" && String(name).startsWith("<")) return true;
  return false;
}

/**
 * Census computed from the parsed tiny source — the same two scopes as
 * `censusFromJson`: `total`, `selfEq`, `unmapped` over every mapping row, plus
 * `inserted`, `selfEqInserted`, `unmappedInserted` over the subset
 * `build-yarn-sqlite.mjs` actually writes. Exported separately so the sqlite leg
 * can run for 薄档 packs that ship no `yarn-mappings.json`.
 */
export function censusFromTiny(parsed) {
  const officialToClass = new Map();
  for (const c of parsed.classes) officialToClass.set(c.officialClass, c);
  const methodCount = parsed.tagCounts.METHOD || 0;
  const fieldCount = parsed.tagCounts.FIELD || 0;
  const inserted = {
    class: { n: 0, eq: 0 },
    method: { n: 0, eq: 0, un: 0 },
    field: { n: 0, eq: 0, un: 0 },
  };
  for (const c of parsed.classes) {
    const row = { namedClass: c.namedClass, intermediaryClass: c.intermediaryClass };
    if (isSkippedBySqliteBuilder("class", row)) continue;
    inserted.class.n++;
    if (isSameAsIntermediary(row.namedClass, row.intermediaryClass)) inserted.class.eq++;
  }
  for (const m of parsed.members) {
    const owner = officialToClass.get(m.ownerOfficial);
    const kind = m.kind === "field" ? "field" : "method";
    const row = { namedClass: owner?.namedClass ?? "", namedName: m.namedName };
    if (isSkippedBySqliteBuilder(kind, row)) continue;
    inserted[kind].n++;
    if (isSameAsIntermediary(m.namedName, m.intermediaryName)) inserted[kind].eq++;
    if (hasNoYarnName(kind, m.namedName)) inserted[kind].un++;
  }
  return {
    totalDataLines: parsed.totalDataLines,
    otherTagLines: parsed.otherTagLines,
    badColumnRows: parsed.badRows.length,
    class: {
      total: parsed.classes.length,
      selfEq: parsed.unmappedNamed.CLASS,
      unmapped: parsed.unmappedNamed.CLASS,
      inserted: inserted.class.n,
      selfEqInserted: inserted.class.eq,
      unmappedInserted: inserted.class.eq,
    },
    method: {
      total: methodCount,
      selfEq: parsed.unmappedNamed.methodSelfEq,
      unmapped: parsed.unmappedNamed.method,
      inserted: inserted.method.n,
      selfEqInserted: inserted.method.eq,
      unmappedInserted: inserted.method.un,
    },
    field: {
      total: fieldCount,
      selfEq: parsed.unmappedNamed.fieldSelfEq,
      unmapped: parsed.unmappedNamed.field,
      inserted: inserted.field.n,
      selfEqInserted: inserted.field.eq,
      unmappedInserted: inserted.field.un,
    },
  };
}

/**
 * Recompute the census purely from the JSON artefact rows. Used as an
 * independent cross-check: a generator that reads the wrong column changes
 * these numbers without changing the tiny-side ones.
 */
export function censusFromJson(jsonObj) {
  const classMap = jsonObj?.classMap || {};
  const methodMap = jsonObj?.methodMap || {};
  const c = {
    class: { total: 0, selfEq: 0, unmapped: 0, inserted: 0, selfEqInserted: 0, unmappedInserted: 0 },
    method: { total: 0, selfEq: 0, unmapped: 0, inserted: 0, selfEqInserted: 0, unmappedInserted: 0 },
    field: { total: 0, selfEq: 0, unmapped: 0, inserted: 0, selfEqInserted: 0, unmappedInserted: 0 },
  };
  for (const k of Object.keys(classMap)) {
    const r = classMap[k];
    c.class.total++;
    if (isSameAsIntermediary(r.namedClass, r.intermediaryClass)) c.class.selfEq++;
    if (!isSkippedBySqliteBuilder("class", r)) {
      c.class.inserted++;
      if (isSameAsIntermediary(r.namedClass, r.intermediaryClass)) c.class.selfEqInserted++;
    }
  }
  for (const k of Object.keys(methodMap)) {
    const r = methodMap[k];
    const kind = r.kind === "field" ? "field" : "method";
    c[kind].total++;
    if (isSameAsIntermediary(r.namedName, r.intermediaryName)) c[kind].selfEq++;
    if (hasNoYarnName(kind, r.namedName)) c[kind].unmapped++;
    if (!isSkippedBySqliteBuilder(kind, r)) {
      c[kind].inserted++;
      if (isSameAsIntermediary(r.namedName, r.intermediaryName)) c[kind].selfEqInserted++;
      if (hasNoYarnName(kind, r.namedName)) c[kind].unmappedInserted++;
    }
  }
  c.class.unmapped = c.class.selfEq;
  c.class.unmappedInserted = c.class.selfEqInserted;
  return c;
}

/**
 * Diff rebuilt JSON against the tiny source it claims to come from.
 * @returns {{errors: string[], census: any}} errors is empty on a green gate.
 */
export function reconcileTinyWithJson(tinyText, jsonObj) {
  const parsed = parseTinyV1(tinyText);
  /** @type {string[]} */
  const errors = [];
  const push = (msg) => {
    if (errors.length < 40) errors.push(msg);
    else if (errors.length === 40) errors.push("… (更多差异已省略，只报前 40 条)");
  };

  for (const b of parsed.badRows) {
    push(`tiny line ${b.lineNo}: tag=${b.tag} expected ${b.expected} columns, got ${b.actual}`);
  }

  const officialToClass = new Map();
  for (const c of parsed.classes) officialToClass.set(c.officialClass, c);

  const jsonClassMap = jsonObj?.classMap || {};
  const jsonMethodMap = jsonObj?.methodMap || {};

  // (1) tiny → JSON: every CLASS/FIELD/METHOD row present with all fields equal.
  let missingClasses = 0;
  for (const c of parsed.classes) {
    const j = jsonClassMap[c.namedClass];
    if (!j) {
      missingClasses++;
      if (missingClasses <= 5) push(`missing classMap row for ${c.namedClass} (tiny line ${c.lineNo})`);
      continue;
    }
    for (const f of CLASS_FIELDS) {
      if (j[f] !== c[f]) push(`classMap[${c.namedClass}].${f} json=${JSON.stringify(j[f])} tiny=${JSON.stringify(c[f])}`);
    }
  }
  let missingMembers = 0;
  for (const m of parsed.members) {
    const owner = officialToClass.get(m.ownerOfficial);
    if (!owner) {
      push(`tiny line ${m.lineNo}: member owner ${m.ownerOfficial} has no CLASS row`);
      continue;
    }
    const key = `${owner.namedClass}.${m.intermediaryName}:${m.descriptor}`;
    const j = jsonMethodMap[key];
    if (!j) {
      missingMembers++;
      if (missingMembers <= 5) push(`missing methodMap row ${key} (tiny line ${m.lineNo})`);
      continue;
    }
    for (const f of MEMBER_FIELDS) {
      const want = f === "kind" ? m.kind : f === "officialClass" ? owner.officialClass
        : f === "intermediaryClass" ? owner.intermediaryClass
        : f === "namedClass" ? owner.namedClass
        : m[f];
      if (j[f] !== want) {
        push(`methodMap[${key}].${f} json=${JSON.stringify(j[f])} tiny=${JSON.stringify(want)}`);
      }
    }
  }
  if (missingClasses) push(`classMap 缺失 ${missingClasses}/${parsed.classes.length} 条`);
  if (missingMembers) push(`methodMap 缺失 ${missingMembers}/${parsed.members.length} 条`);

  // (2) JSON → tiny: no orphan rows.
  const tinyClassKeys = new Set(parsed.classes.map((c) => c.namedClass));
  const tinyMemberKeys = new Set(
    parsed.members
      .map((m) => {
        const owner = officialToClass.get(m.ownerOfficial);
        return owner ? `${owner.namedClass}.${m.intermediaryName}:${m.descriptor}` : null;
      })
      .filter(Boolean),
  );
  const orphanClasses = Object.keys(jsonClassMap).filter((k) => !tinyClassKeys.has(k));
  const orphanMembers = Object.keys(jsonMethodMap).filter((k) => !tinyMemberKeys.has(k));
  for (const k of orphanClasses.slice(0, 5)) push(`orphan classMap row (tiny 里没有): ${k}`);
  for (const k of orphanMembers.slice(0, 5)) push(`orphan methodMap row (tiny 里没有): ${k}`);
  if (orphanClasses.length > 5 || orphanMembers.length > 5) {
    push(`orphan 总数 classMap=${orphanClasses.length} methodMap=${orphanMembers.length}`);
  }

  // (3) top-level counts must equal the parsed census.
  const methodCount = parsed.tagCounts.METHOD || 0;
  const fieldCount = parsed.tagCounts.FIELD || 0;
  if (jsonObj?.classCount !== parsed.classes.length) {
    push(`classCount json=${jsonObj?.classCount} tiny=${parsed.classes.length}`);
  }
  if (jsonObj?.methodCount !== methodCount) {
    push(`methodCount json=${jsonObj?.methodCount} tiny=${methodCount}`);
  }
  if (jsonObj?.fieldCount !== fieldCount) {
    push(`fieldCount json=${jsonObj?.fieldCount} tiny=${fieldCount}`);
  }
  if (Object.keys(jsonClassMap).length !== parsed.classes.length) {
    push(`classMap 行数 ${Object.keys(jsonClassMap).length} != tiny CLASS ${parsed.classes.length}`);
  }
  if (Object.keys(jsonMethodMap).length !== parsed.members.length) {
    push(`methodMap 行数 ${Object.keys(jsonMethodMap).length} != tiny FIELD+METHOD ${parsed.members.length}`);
  }

  // (4) census.
  // 「入库子集」= build-yarn-sqlite 真正写进 sqlite 的行（跳过空名与 `<init>` 构造器）。
  // sqlite 腿只比这组数，全量 total 仍比 meta.*，两套口径各自独立可见。
  const census = censusFromTiny(parsed);
  census.json = censusFromJson(jsonObj);
  errors.push(...compareCensusObjects(census, census.json, "tiny↔json"));
  return { errors, census, parsed };
}

/**
 * Compare two census objects of the same shape (class/method/field with
 * total / selfEq / unmapped). Tolerance is 0.
 */
export function compareCensusObjects(a, b, label = "census") {
  const out = [];
  for (const kind of ["class", "method", "field"]) {
    for (const metric of ["total", "selfEq", "unmapped", "inserted", "selfEqInserted", "unmappedInserted"]) {
      const av = a?.[kind]?.[metric];
      const bv = b?.[kind]?.[metric];
      if (av !== bv) out.push(`${label} census ${kind}.${metric}: ${av} !== ${bv}`);
    }
  }
  return out;
}

/** Second, independent measurement: the sqlite side built from the same tiny. */
export function sqliteCensus(sqlitePath) {
  const db = new DatabaseSync(sqlitePath, { readOnly: true });
  try {
    const one = (sql) => db.prepare(sql).get();
    const m = one(
      `SELECT COUNT(*) total,
        SUM(CASE WHEN name_named = name_intermediary THEN 1 ELSE 0 END) self_eq,
        SUM(CASE WHEN name_named GLOB 'method_[0-9]*' THEN 1 ELSE 0 END) unmapped
       FROM methods`,
    );
    const f = one(
      `SELECT COUNT(*) total,
        SUM(CASE WHEN name_named = name_intermediary THEN 1 ELSE 0 END) self_eq,
        SUM(CASE WHEN name_named GLOB 'field_[0-9]*' THEN 1 ELSE 0 END) unmapped
       FROM fields`,
    );
    const c = one(
      `SELECT COUNT(*) total, SUM(CASE WHEN named = intermediary THEN 1 ELSE 0 END) self_eq FROM classes`,
    );
    const meta = Object.fromEntries(
      db.prepare("SELECT key, value FROM meta").all().map((r) => [r.key, r.value]),
    );
    return {
      meta: {
        classCount: Number(meta.classCount || -1),
        methodCount: Number(meta.methodCount || -1),
        fieldCount: Number(meta.fieldCount || -1),
        schemaVersion: meta.schemaVersion ?? null,
      },
      class: { total: Number(c.total), selfEq: Number(c.self_eq), unmapped: Number(c.self_eq) },
      method: { total: Number(m.total), selfEq: Number(m.self_eq), unmapped: Number(m.unmapped) },
      field: { total: Number(f.total), selfEq: Number(f.self_eq), unmapped: Number(f.unmapped) },
    };
  } finally {
    db.close();
  }
}

/**
 * Compare the tiny/JSON census with the sqlite census. Tolerance is 0.
 * @returns {string[]} mismatches (empty = green)
 */
export function compareCensus(jsonCensus, sql) {
  const errors = [];
  const eq = (label, a, b) => {
    if (a !== b) errors.push(`census ${label}: json/tiny=${a} sqlite=${b}`);
  };
  // sqlite 表只装「入库子集」（构造器与空名行按 build-yarn-sqlite 规则跳过），
  // 所以这里比的是 inserted*，不是 total；meta.* 仍比全量（meta 记的是解析行数）。
  eq("classes.inserted", jsonCensus.class.inserted, sql.class.total);
  eq("classes.named===intermediary", jsonCensus.class.selfEqInserted, sql.class.selfEq);
  eq("methods.inserted", jsonCensus.method.inserted, sql.method.total);
  eq("methods.named===intermediary", jsonCensus.method.selfEqInserted, sql.method.selfEq);
  eq("methods.legitimately-unmapped", jsonCensus.method.unmappedInserted, sql.method.unmapped);
  eq("fields.inserted", jsonCensus.field.inserted, sql.field.total);
  eq("fields.named===intermediary", jsonCensus.field.selfEqInserted, sql.field.selfEq);
  eq("fields.legitimately-unmapped", jsonCensus.field.unmappedInserted, sql.field.unmapped);
  eq("meta.classCount", jsonCensus.class.total, sql.meta.classCount);
  eq("meta.methodCount", jsonCensus.method.total, sql.meta.methodCount);
  eq("meta.fieldCount", jsonCensus.field.total, sql.meta.fieldCount);
  return errors;
}

function printCensus(census) {
  const f = (n) => n.toLocaleString("en-US");
  console.log(
    `census: 数据行=${f(census.totalDataLines)} 非映射标签行=${f(census.otherTagLines)} 列数异常=${f(census.badColumnRows)}` +
      ` | CLASS ${f(census.class.total)}→入库 ${f(census.class.inserted)} (named===intermediary ${f(census.class.selfEq)})` +
      ` | METHOD ${f(census.method.total)}→入库 ${f(census.method.inserted)} (named===intermediary ${f(census.method.selfEq)}, 合法未映射 ${f(census.method.unmapped)})` +
      ` | FIELD ${f(census.field.total)}→入库 ${f(census.field.inserted)} (named===intermediary ${f(census.field.selfEq)}, 合法未映射 ${f(census.field.unmapped)})`,
  );
}

function defaultDataRoot() {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "data");
}

/**
 * Every pack under `dataRoot` whose sqlite artefact is supposed to come from a
 * yarn tiny source: a `*-tiny.gz` (or `mappings.tiny`) inside `mappings/`.
 * forge packs built from MCP csv / joined.srg carry no tiny file, so they are
 * out of scope for this reconciliation by construction — not silently skipped.
 */
export function findYarnTinyPacks(dataRoot) {
  const packs = [];
  for (const entry of fs.readdirSync(dataRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const dir = path.join(dataRoot, entry.name, "mappings");
    if (!fs.statSync(dir, { throwIfNoEntry: false })?.isDirectory()) continue;
    const files = fs.readdirSync(dir);
    const tinyName = files.find((f) => /-tiny\.gz$/.test(f) || f === "mappings.tiny");
    if (!tinyName) continue;
    packs.push({
      pack: entry.name,
      dir,
      tiny: path.join(dir, tinyName),
      json: files.includes("yarn-mappings.json") ? path.join(dir, "yarn-mappings.json") : null,
      sqlite: files.includes("yarn-mappings.sqlite") ? path.join(dir, "yarn-mappings.sqlite") : null,
    });
  }
  packs.sort((a, b) => a.pack.localeCompare(b.pack));
  return packs;
}

/**
 * Reconcile one pack with tolerance 0. With `yarn-mappings.json` present this is
 * the full tiny ⇄ JSON ⇄ sqlite leg; without one (薄档) only tiny ⇄ sqlite can be
 * compared, which `legs` reports so the shorter leg is visible in the log.
 */
export function verifyPack(pack) {
  const base = {
    pack: pack.pack,
    legs: pack.json ? "tiny⇄json⇄sqlite" : "tiny⇄sqlite",
    census: null,
    sql: null,
  };
  if (!pack.sqlite) {
    return { ...base, ok: false, errors: [`${pack.pack}: 有 tiny 源但缺 yarn-mappings.sqlite`] };
  }
  try {
    const tinyText = readTinyText(pack.tiny);
    let census;
    let errors;
    if (pack.json) {
      ({ errors, census } = reconcileTinyWithJson(tinyText, JSON.parse(fs.readFileSync(pack.json, "utf8"))));
    } else {
      const parsed = parseTinyV1(tinyText);
      census = censusFromTiny(parsed);
      errors = parsed.badRows.map(
        (b) => `tiny line ${b.lineNo}: tag=${b.tag} expected ${b.expected} columns, got ${b.actual}`,
      );
    }
    const sql = sqliteCensus(pack.sqlite);
    const all = errors.concat(compareCensus(census, sql));
    return { ...base, ok: all.length === 0, census, sql, errors: all };
  } catch (err) {
    // 读不动的产物同样是 RED：一个坏 pack 不得让整条链以堆栈退出、其余 pack 失声。
    return {
      ...base,
      ok: false,
      errors: [`${pack.pack}: 对账无法完成 —— ${err instanceof Error ? err.message : String(err)}`],
    };
  }
}

function main(argv) {
  const [cmd, ...rest] = argv;
  if (cmd === "verify-all") {
    const dataFlag = rest.find((a) => a.startsWith("--data="));
    const dataRoot = path.resolve(dataFlag ? dataFlag.slice("--data=".length) : defaultDataRoot());
    const results = findYarnTinyPacks(dataRoot).map(verifyPack);
    if (!results.length) {
      console.error(`VERIFY RED: ${dataRoot} 下找不到任何 tiny 源 pack（发现逻辑失效，不是没有映射）`);
      process.exit(1);
      return;
    }
    for (const r of results) {
      const counts =
        r.census && r.sql
          ? ` class ${r.census.class.inserted}=${r.sql.class.total}` +
            ` method ${r.census.method.inserted}=${r.sql.method.total}` +
            ` field ${r.census.field.inserted}=${r.sql.field.total}`
          : " (未取数)";
      console.log(`${r.ok ? "ok  " : "FAIL"} ${r.pack.padEnd(16)} ${r.legs}${counts}`);
      if (!r.ok) for (const e of r.errors) console.error(`       - ${e}`);
    }
    const bad = results.filter((r) => !r.ok);
    // 只重建一部分 pack 会让运行期按 pack 分叉（同一份查询在不同版本上索引/字段不同），
    // 所以 schema 必须整批一致 —— 不一致时优先报这条，而不是让 13 档各自沉默通过。
    const schemas = [...new Set(results.filter((r) => r.sql).map((r) => String(r.sql.meta.schemaVersion)))];
    if (schemas.length > 1) {
      console.error(
        `VERIFY RED: sqlite schemaVersion 不一致 —— ${schemas.join(" / ")}；` +
          `重建必须一次覆盖全部 pack（build-yarn-sqlite.mjs --all），不得只刷其中几档`,
      );
      process.exit(1);
      return;
    }
    if (bad.length) {
      console.error(`VERIFY RED: ${bad.length}/${results.length} 个 pack 对账失败（tolerance=0）`);
      process.exit(1);
      return;
    }
    console.log(
      `VERIFY GREEN: ${results.length}/${results.length} 个 tiny 源 pack 对账 0 差异，sqlite schema=${schemas[0] ?? "?"}` +
        `（${results.filter((r) => r.legs.includes("json")).length} 档三方、` +
        `${results.filter((r) => !r.legs.includes("json")).length} 薄档只有 tiny⇄sqlite）`,
    );
    return;
  }
  if (cmd === "verify") {
    const pos = rest.filter((a) => !a.startsWith("--"));
    const flags = rest.filter((a) => a.startsWith("--"));
    const tiny = pos[0];
    const json = pos[1];
    if (!tiny || !json) {
      console.error("usage: build-yarn-mappings.mjs verify <tiny[.gz]> <yarn-mappings.json> [--sqlite=path]");
      process.exit(2);
      return;
    }
    const sqliteFlag = flags.find((f) => f.startsWith("--sqlite="));
    const tinyText = readTinyText(path.resolve(tiny));
    const jsonObj = JSON.parse(fs.readFileSync(path.resolve(json), "utf8"));
    const { errors, census } = reconcileTinyWithJson(tinyText, jsonObj);
    printCensus(census);
    let all = errors;
    if (sqliteFlag) {
      const sql = sqliteCensus(path.resolve(sqliteFlag.slice("--sqlite=".length)));
      all = errors.concat(compareCensus(census, sql));
      console.log(
        `sqlite census: CLASS ${sql.class.total} / METHOD ${sql.method.total} / FIELD ${sql.field.total}` +
          ` (selfEq ${sql.class.selfEq}/${sql.method.selfEq}/${sql.field.selfEq}` +
          `, legitimately-unmapped ${sql.method.unmapped}/${sql.field.unmapped})`,
      );
    } else {
      all = errors.concat(["verify 必须带 --sqlite= 才能完成第二套机制核对（tolerance 0）"]);
    }
    if (all.length) {
      console.error(`VERIFY RED (${all.length} 条差异，tolerance=0):`);
      for (const e of all) console.error(`  - ${e}`);
      process.exit(1);
      return;
    }
    console.log("VERIFY GREEN: tiny ⇄ JSON ⇄ sqlite 三方逐行对账 0 差异");
    return;
  }

  const [tiny, out, ...flags] = argv;
  if (!tiny || !out) {
    console.error(
      "usage: build-yarn-mappings.mjs <tiny[.gz]> <outJson> [--version=X] [--source=url] [--format=...] | verify <tiny> <json> [--sqlite=path] | verify-all [--data=path]",
    );
    process.exit(2);
    return;
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
    return;
  }
  const parsed = buildYarnMappingFromTinyFile(path.resolve(tiny));
  fs.writeFileSync(out, renderYarnMappingJson(parsed, meta));
  printCensus({
    totalDataLines: parsed.totalDataLines,
    otherTagLines: parsed.otherTagLines,
    badColumnRows: parsed.badRows.length,
    class: { total: parsed.classCount, selfEq: parsed.unmappedNamed.CLASS },
    method: {
      total: parsed.methodCount,
      selfEq: parsed.unmappedNamed.methodSelfEq,
      unmapped: parsed.unmappedNamed.method,
    },
    field: {
      total: parsed.fieldCount,
      selfEq: parsed.unmappedNamed.fieldSelfEq,
      unmapped: parsed.unmappedNamed.field,
    },
  });
  console.log(
    `wrote ${out}: classes=${parsed.classCount} methods=${parsed.methodCount} fields=${parsed.fieldCount}`,
  );
}

if (process.argv[1] && process.argv[1].endsWith("build-yarn-mappings.mjs")) {
  main(process.argv.slice(2));
}
