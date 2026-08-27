import { createHash } from "crypto";
import { mergeInjectMethodAndDesc, parseMethodArrayLiteral, parseMethodReference, type ParsedMethodRef } from "./method-string.js";
import { parseJsonUtf8 } from "../utils/json-utf8.js";

export interface MixinClassRef {
  className: string;
  target?: string;
  file?: string;
}

export interface InjectionSite {
  kind:
    | "Inject"
    | "Redirect"
    | "ModifyVariable"
    | "ModifyArg"
    | "ModifyArgs"
    | "ModifyConstant"
    | "Overwrite"
    | "Accessor"
    | "Invoker"
    | "Unknown";
  methodRefs: ParsedMethodRef[];
  at?: string;
  lineHint?: number;
}

export interface ParsedMixinSource {
  mixinClass: string;
  targetClass?: string;
  injections: InjectionSite[];
  warnings?: string[];
}

export interface MixinsJsonSummary {
  package?: string;
  mixinClasses: string[];
  common: string[];
  client: string[];
  server: string[];
  warnings: string[];
}

const PARSE_CACHE_MAX = 32;
type LruEntry<T> = { key: string; value: T };
const jsonCache: LruEntry<MixinsJsonSummary>[] = [];
const javaCache: LruEntry<ParsedMixinSource>[] = [];

function lruGet<T>(lru: LruEntry<T>[], key: string): T | undefined {
  const i = lru.findIndex((e) => e.key === key);
  if (i < 0) return undefined;
  const [e] = lru.splice(i, 1);
  lru.push(e);
  return e.value;
}

function lruSet<T>(lru: LruEntry<T>[], key: string, value: T): void {
  const i = lru.findIndex((e) => e.key === key);
  if (i >= 0) lru.splice(i, 1);
  lru.push({ key, value });
  while (lru.length > PARSE_CACHE_MAX) lru.shift();
}

function contentHash(path: string, content: string, mtime?: number): string {
  return createHash("sha256").update(`${path}\0${mtime ?? ""}\0${content}`).digest("hex");
}

export function parseMixinsJson(
  content: string,
  cacheMeta?: { path?: string; mtime?: number },
): MixinsJsonSummary {
  const key = contentHash(cacheMeta?.path ?? "", content, cacheMeta?.mtime);
  const hit = lruGet(jsonCache, key);
  if (hit) return hit;

  const warnings: string[] = [];
  const mixinClasses = new Set<string>();
  const common: string[] = [];
  const client: string[] = [];
  const server: string[] = [];
  let pkg: string | undefined;

  let config: Record<string, unknown>;
  try {
    config = parseJsonUtf8(content) as Record<string, unknown>;
  } catch {
    const failed: MixinsJsonSummary = {
      mixinClasses: [],
      common: [],
      client: [],
      server: [],
      warnings: ["mixins.json JSON 解析失败"],
    };
    lruSet(jsonCache, key, failed);
    return failed;
  }

  if (typeof config.package === "string") pkg = config.package;

  const collect = (arr: unknown, bucket: string[]) => {
    if (!Array.isArray(arr)) return;
    for (const m of arr) {
      if (typeof m === "string") {
        mixinClasses.add(m);
        bucket.push(m);
      } else if (typeof m === "object" && m !== null && "mixin" in m) {
        const entry = m as { mixin: string; target?: string };
        mixinClasses.add(entry.mixin);
        bucket.push(entry.mixin);
        if (entry.target?.startsWith(".")) {
          warnings.push(`mixins.json: target '${entry.target}' 应以完整类名开头`);
        }
      }
    }
  };

  collect(config.mixins, common);
  collect(config.client, client);
  collect(config.server, server);

  const parsed: MixinsJsonSummary = {
    package: pkg,
    mixinClasses: [...mixinClasses],
    common,
    client,
    server,
    warnings,
  };
  lruSet(jsonCache, key, parsed);
  return parsed;
}

export type JavaAnnBlock = { inner: string | null };

const OPTIONAL_PAREN_KINDS = new Set(["Overwrite", "Accessor", "Invoker"]);

/**
 * 抽取 `@Name(...)` 注解块。跳过行注释、块注释与字符串字面量；
 * 无括号的 `@Inject` 不算注入（javadoc/行注释里的同名 token 不得占 nth 槽）。
 * `@Overwrite` / `@Accessor` / `@Invoker` 允许无括号。
 */
export function extractJavaAnnotationBlocks(source: string, name: string): JavaAnnBlock[] {
  const blocks: JavaAnnBlock[] = [];
  const needle = `@${name}`;
  const n = source.length;
  let i = 0;
  type Scan = "code" | "line" | "block" | "str" | "chr";
  let state: Scan = "code";

  while (i < n) {
    const c = source[i];
    const next = source[i + 1];
    if (state === "line") {
      if (c === "\n") state = "code";
      i++;
      continue;
    }
    if (state === "block") {
      if (c === "*" && next === "/") {
        state = "code";
        i += 2;
        continue;
      }
      i++;
      continue;
    }
    if (state === "str") {
      if (c === "\\") {
        i += 2;
        continue;
      }
      if (c === '"') state = "code";
      i++;
      continue;
    }
    if (state === "chr") {
      if (c === "\\") {
        i += 2;
        continue;
      }
      if (c === "'") state = "code";
      i++;
      continue;
    }
    if (c === "/" && next === "/") {
      state = "line";
      i += 2;
      continue;
    }
    if (c === "/" && next === "*") {
      state = "block";
      i += 2;
      continue;
    }
    if (c === '"') {
      state = "str";
      i++;
      continue;
    }
    if (c === "'") {
      state = "chr";
      i++;
      continue;
    }

    if (c === "@" && source.startsWith(needle, i)) {
      const afterName = i + needle.length;
      const boundary = source[afterName];
      if (boundary && /[A-Za-z0-9_]/.test(boundary)) {
        i++;
        continue;
      }
      let k = afterName;
      while (k < n && /\s/.test(source[k])) k++;
      if (source[k] !== "(") {
        if (OPTIONAL_PAREN_KINDS.has(name)) blocks.push({ inner: null });
        i = k === afterName ? afterName : k;
        continue;
      }
      let depth = 0;
      let j = k;
      let inStr = false;
      let inChr = false;
      for (; j < n; j++) {
        const ch = source[j];
        if (inStr) {
          if (ch === "\\") {
            j++;
            continue;
          }
          if (ch === '"') inStr = false;
          continue;
        }
        if (inChr) {
          if (ch === "\\") {
            j++;
            continue;
          }
          if (ch === "'") inChr = false;
          continue;
        }
        if (ch === '"') {
          inStr = true;
          continue;
        }
        if (ch === "'") {
          inChr = true;
          continue;
        }
        if (ch === "(") depth++;
        else if (ch === ")") {
          depth--;
          if (depth === 0) {
            blocks.push({ inner: source.slice(k + 1, j) });
            break;
          }
        }
      }
      i = j + 1;
      continue;
    }
    i++;
  }
  return blocks;
}

function parseAtValue(block: string, key: string): string | undefined {
  const re = new RegExp(`${key}\\s*=\\s*"([^"]*)"`, "s");
  const m = block.match(re);
  return m?.[1];
}

function parseMethodValue(block: string): string[] {
  const methodEq = block.match(/method\s*=\s*(\{[^}]+\}|"[^"]+")/s);
  if (!methodEq) return [];
  const val = methodEq[1].trim();
  if (val.startsWith("{")) return parseMethodArrayLiteral(val);
  if (val.startsWith('"')) return [val.slice(1, -1)];
  return [];
}

export function parseMixinJavaSource(
  source: string,
  filePath?: string,
  mtime?: number,
): ParsedMixinSource | null {
  const key = contentHash(filePath ?? "", source, mtime);
  const cached = lruGet(javaCache, key);
  if (cached) return cached;

  const classMatch = source.match(/(?:public\s+)?class\s+(\w+)/);
  if (!classMatch) return null;

  const mixinAnn = source.match(/@Mixin\s*\(\s*([^)]+)\s*\)/s);
  let targetClass: string | undefined;
  if (mixinAnn) {
    const inner = mixinAnn[1];
    const valueMatch = inner.match(/value\s*=\s*([\w.$]+\.class)/);
    if (valueMatch) targetClass = valueMatch[1].replace(/\.class$/, "");
    else {
      const targetsMatch = inner.match(/targets\s*=\s*"([^"]+)"/);
      if (targetsMatch) targetClass = targetsMatch[1];
      else {
        const simple = inner.match(/([\w.$]+)\.class/);
        if (simple) targetClass = simple[1];
      }
    }
  }

  const injections: InjectionSite[] = [];
  const warnings: string[] = [];
  const kinds = [
    "Inject",
    "Redirect",
    "ModifyVariable",
    "ModifyArg",
    "ModifyArgs",
    "ModifyConstant",
    "Overwrite",
    "Accessor",
    "Invoker",
  ] as const;

  for (const kind of kinds) {
    for (const { inner } of extractJavaAnnotationBlocks(source, kind)) {
      if (inner === null) {
        injections.push({ kind, methodRefs: [] });
        continue;
      }
      const at = parseAtValue(inner, "at") ?? parseAtValue(inner, "target");
      const desc = parseAtValue(inner, "desc");
      const methods = parseMethodValue(inner);
      const methodRefs: ParsedMethodRef[] = [];
      if (methods.length) {
        for (const m of methods) {
          methodRefs.push(parseMethodReference(m, desc));
        }
      } else {
        const single = parseAtValue(inner, "method");
        if (single) methodRefs.push(mergeInjectMethodAndDesc(single, desc) ?? parseMethodReference(single, desc));
      }
      injections.push({
        kind,
        methodRefs,
        at,
      });
    }
  }

  const extras = ["ModifyExpressionValue", "WrapOperation", "WrapWithCondition", "ModifyReturnValue"];
  for (const name of extras) {
    const found = extractJavaAnnotationBlocks(source, name);
    if (found.length) {
      warnings.push(`MixinExtras @${name} 记为 Unknown，不要当成 @Inject`);
      for (const { inner } of found) {
        injections.push({
          kind: "Unknown",
          methodRefs: inner ? parseMethodValue(inner).map((m) => parseMethodReference(m)) : [],
        });
      }
    }
  }

  const parsed: ParsedMixinSource = {
    mixinClass: classMatch[1],
    targetClass,
    injections,
    warnings: warnings.length ? warnings : undefined,
  };
  lruSet(javaCache, key, parsed);
  return parsed;
}

export function findMixinClassInFiles(
  mixinName: string,
  javaFiles: Array<{ path: string; content: string }>,
): { path: string; content: string } | undefined {
  const simple = mixinName.includes(".") ? mixinName.slice(mixinName.lastIndexOf(".") + 1) : mixinName;
  return javaFiles.find(
    (f) => f.path.replace(/\\/g, "/").endsWith(`/${simple}.java`) || f.content.includes(`class ${simple}`),
  );
}
