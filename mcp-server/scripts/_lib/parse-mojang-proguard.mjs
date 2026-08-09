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
 * }} MojangMaps
 *
 * methodsByObf key: `${obfOwner}\t${obfDesc}\t${obfName}`
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
    // fields ignored for now
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

  return { obfToNamed, namedToObf, methodsByObf };
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
