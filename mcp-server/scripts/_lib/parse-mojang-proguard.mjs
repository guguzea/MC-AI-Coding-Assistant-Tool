/**
 * Parse Mojang official ProGuard mappings (client.txt / server.txt).
 *
 * Format:
 *   named.class.Path -> obf:
 *       returnType methodName(argType,argType) -> obfMethod
 *       type fieldName -> obfField
 *
 * Used by parchment-extractor to translate Yarn Tiny official (obf) members
 * into Mojang named names for Forge/Parchment api-index.
 */
import fs from "node:fs";
import readline from "node:readline";
import { Readable } from "node:stream";

/**
 * @typedef {{
 *   obfToNamed: Map<string, string>,
 *   namedToObf: Map<string, string>,
 *   methodsByObf: Map<string, { name: string, descriptor: string }>,
 *   fieldsByObf: Map<string, { name: string, descriptor: string }>,
 * }} MojangMaps
 *
 * methodsByObf / fieldsByObf key: `${obfOwner}\t${obfDesc}\t${obfName}`
 */

/** @param {string} type */
function proguardTypeToJvm(type, namedToObf) {
  const t = type.trim();
  if (!t) return "";
  if (t.endsWith("[]")) {
    return "[" + proguardTypeToJvm(t.slice(0, -2), namedToObf);
  }
  switch (t) {
    case "void":
      return "V";
    case "boolean":
      return "Z";
    case "byte":
      return "B";
    case "char":
      return "C";
    case "short":
      return "S";
    case "int":
      return "I";
    case "long":
      return "J";
    case "float":
      return "F";
    case "double":
      return "D";
    default: {
      const slash = t.replace(/\./g, "/");
      const obf = namedToObf.get(slash) ?? slash;
      return `L${obf};`;
    }
  }
}

/**
 * @param {string} returnType
 * @param {string} argsInsideParens
 * @param {Map<string, string>} namedToObf
 */
function proguardSigToObfDesc(returnType, argsInsideParens, namedToObf) {
  const args = argsInsideParens.trim()
    ? argsInsideParens.split(",").map((a) => proguardTypeToJvm(a, namedToObf)).join("")
    : "";
  return `(${args})${proguardTypeToJvm(returnType, namedToObf)}`;
}

/**
 * Remap JVM descriptor class refs with a slash-path map (obf→named or named→obf).
 * @param {string} descriptor
 * @param {Map<string, string>} classMap
 */
export function remapDescriptor(descriptor, classMap) {
  if (!descriptor) return descriptor;
  return descriptor.replace(/L([^;]+);/g, (_, cls) => {
    const mapped = classMap.get(cls);
    return mapped ? `L${mapped};` : `L${cls};`;
  });
}

/**
 * @param {import('node:stream').Readable|string|Buffer} input
 * @returns {Promise<MojangMaps>}
 */
export async function parseMojangProguard(input) {
  /** @type {Map<string, string>} */
  const obfToNamed = new Map();
  /** @type {Map<string, string>} */
  const namedToObf = new Map();
  /** @type {Array<{ namedOwner: string, returnType: string, name: string, args: string, obfName: string }>} */
  const pendingMethods = [];
  /** @type {Array<{ namedOwner: string, type: string, name: string, obfName: string }>} */
  const pendingFields = [];

  const stream =
    typeof input === "string" || Buffer.isBuffer(input)
      ? Readable.from([typeof input === "string" ? input : input.toString("utf8")])
      : input;

  let currentNamed = null;
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });
  for await (const raw of rl) {
    if (!raw || raw.startsWith("#")) continue;
    if (!raw.startsWith("    ") && !raw.startsWith("\t")) {
      // class line: named -> obf:
      const m = raw.match(/^(\S+)\s*->\s*(\S+):?\s*$/);
      if (!m) continue;
      const named = m[1].replace(/\./g, "/");
      const obf = m[2].replace(/:$/, "");
      currentNamed = named;
      obfToNamed.set(obf, named);
      namedToObf.set(named, obf);
      continue;
    }
    if (!currentNamed) continue;
    const line = raw.trim();
    // Strip optional Mojang source range prefix: "123:456:returnType name(args) -> obf"
    const withoutRange = line.replace(/^\d+:\d+:/, "");
    // method: ret name(args) -> obf
    const methodMatch = withoutRange.match(/^(.+?)\s+(\S+)\((.*)\)\s*->\s*(\S+)\s*$/);
    if (methodMatch) {
      pendingMethods.push({
        namedOwner: currentNamed,
        returnType: methodMatch[1].trim(),
        name: methodMatch[2],
        args: methodMatch[3],
        obfName: methodMatch[4],
      });
      continue;
    }
    // field: type name -> obf  （无括号；含内部类 Outer$Inner 与数组）
    const fieldMatch = withoutRange.match(/^(.+?)\s+(\S+)\s*->\s*(\S+)\s*$/);
    if (fieldMatch) {
      pendingFields.push({
        namedOwner: currentNamed,
        type: fieldMatch[1].trim(),
        name: fieldMatch[2],
        obfName: fieldMatch[3],
      });
    }
  }

  /** @type {Map<string, { name: string, descriptor: string }>} */
  const methodsByObf = new Map();
  for (const pm of pendingMethods) {
    const obfOwner = namedToObf.get(pm.namedOwner);
    if (!obfOwner) continue;
    const obfDesc = proguardSigToObfDesc(pm.returnType, pm.args, namedToObf);
    const namedDesc = remapDescriptor(obfDesc, obfToNamed);
    const key = `${obfOwner}\t${obfDesc}\t${pm.obfName}`;
    methodsByObf.set(key, { name: pm.name, descriptor: namedDesc });
  }

  /** @type {Map<string, { name: string, descriptor: string }>} */
  const fieldsByObf = new Map();
  for (const pf of pendingFields) {
    const obfOwner = namedToObf.get(pf.namedOwner);
    if (!obfOwner) continue;
    const obfDesc = proguardTypeToJvm(pf.type, namedToObf);
    const namedDesc = remapDescriptor(obfDesc, obfToNamed);
    const key = `${obfOwner}\t${obfDesc}\t${pf.obfName}`;
    fieldsByObf.set(key, { name: pf.name, descriptor: namedDesc });
  }

  return { obfToNamed, namedToObf, methodsByObf, fieldsByObf };
}

/**
 * Codepoint ordering, not localeCompare: the emitted Tiny is a cached artifact,
 * so the byte output must be identical on every machine and ICU locale.
 * @param {string} a
 * @param {string} b
 */
function compareOrdinal(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * Bucket `${obfOwner}\t${obfDesc}\t${obfName}` keyed members by owner in ONE pass
 * and sort each bucket once — the per-class output order is unchanged, but the
 * emitter stays linear instead of rescanning every member for every class.
 * @param {Map<string, { name: string }> | undefined} byObf
 * @returns {Map<string, Array<{ desc: string, obfName: string, named: string }>>}
 */
function bucketMembersByOwner(byObf) {
  /** @type {Map<string, Array<{ desc: string, obfName: string, named: string }>>} */
  const out = new Map();
  if (!byObf) return out;
  for (const [key, val] of byObf) {
    const sep1 = key.indexOf("\t");
    const sep2 = key.indexOf("\t", sep1 + 1);
    if (sep1 < 0 || sep2 < 0) continue;
    const owner = key.slice(0, sep1);
    const desc = key.slice(sep1 + 1, sep2);
    const obfName = key.slice(sep2 + 1);
    const bucket = out.get(owner);
    if (bucket) bucket.push({ desc, obfName, named: val.name });
    else out.set(owner, [{ desc, obfName, named: val.name }]);
  }
  for (const bucket of out.values()) {
    bucket.sort((a, b) => compareOrdinal(a.obfName, b.obfName) || compareOrdinal(a.desc, b.desc));
  }
  return out;
}

/**
 * Emit Tiny v2 (two namespaces: official = obfuscated, named = Mojang).
 * Descriptor on members is in the official (obf) namespace, as Tiny v2 requires.
 * @param {MojangMaps} maps
 * @param {string} [fromNs]
 * @param {string} [toNs]
 */
export function emitTinyV2(maps, fromNs = "official", toNs = "named") {
  const methodsByOwner = bucketMembersByOwner(maps.methodsByObf);
  const fieldsByOwner = bucketMembersByOwner(maps.fieldsByObf);
  const lines = [`tiny\t2\t0\t${fromNs}\t${toNs}`];
  const classes = [...maps.obfToNamed.keys()].sort(compareOrdinal);
  for (const obf of classes) {
    lines.push(`c\t${obf}\t${maps.obfToNamed.get(obf)}`);
    for (const m of methodsByOwner.get(obf) ?? []) {
      lines.push(`\tm\t${m.desc}\t${m.obfName}\t${m.named}`);
    }
    for (const f of fieldsByOwner.get(obf) ?? []) {
      lines.push(`\tf\t${f.desc}\t${f.obfName}\t${f.named}`);
    }
  }
  return lines.join("\n") + "\n";
}

/**
 * A header-only Tiny v2 is syntactically valid but maps nothing; tiny-remapper
 * then "succeeds" and emits an obfuscated jar. Callers must reject such files.
 * @param {string} text
 */
export function tinyV2HasClasses(text) {
  return /^c\t/m.test(text);
}

/**
 * @param {string} filePath
 */
export async function parseMojangProguardFile(filePath) {
  return parseMojangProguard(fs.createReadStream(filePath, { encoding: "utf8" }));
}

/**
 * Lookup Mojang method for an obfuscated Tiny METHOD triple.
 * @param {MojangMaps} maps
 * @param {string} ownerOfficial
 * @param {string} descriptorOfficial
 * @param {string} nameOfficial
 */
export function lookupMojangMethod(maps, ownerOfficial, descriptorOfficial, nameOfficial) {
  const key = `${ownerOfficial}\t${descriptorOfficial}\t${nameOfficial}`;
  return maps.methodsByObf.get(key) ?? null;
}
