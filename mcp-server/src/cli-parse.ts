/**
 * mc-skill CLI 参数解析：flags、kebab→camel、按 Zod 类型 coerce、JSON Schema 导出。
 * 不含 IO（@file / stdin / --project 在 cli.ts 适配层）。
 */
import * as z from "zod";
import { parseBooleanToken, parseFlagTruthy, InvalidBooleanFlagError } from "./utils/flags.js";
import { ownGet } from "./utils/own-record.js";

export { parseFlagTruthy, parseBooleanToken, InvalidBooleanFlagError } from "./utils/flags.js";

export type FlagScalar = string | boolean;
export type FlagValue = FlagScalar | FlagScalar[];
export type RawFlags = Record<string, FlagValue>;

/** 不进工具 schema 的全局 flag（version 在有子命令时是工具字段，不在此列） */
export const GLOBAL_FLAG_KEYS = new Set([
  "help",
  "h",
  "json",
  "compact",
  "fail-on-error",
  "failOnError",
  "project",
  "file",
  "raw",
  "output-format",
  "outputFormat",
  "quiet",
  "timeout",
  "stdin-json",
  "stdinJson",
]);

/** `--output-format` 当前唯一合法值；其它值必须 exit 2，不得静默按 json 处理 */
export const LEGAL_OUTPUT_FORMATS = new Set(["json"]);

/**
 * 与全局 flag 同名的工具字段 —— 在该工具上这个名字归字段所有，全局剥离让位。
 * 这是一份显式声明（解析阶段还没有 schema 可用），test-cli-parse 的枚举门断言它
 * 等于 80 个 schema 字段名与 GLOBAL_FLAG_KEYS 的实际交集；新增同名字段必须同时改这里。
 */
export const FIELD_OWNED_GLOBALS: Record<string, string[]> = {
  validate_bp_json: ["json"],
};

export function fieldOwnedGlobals(cmd: string | undefined): Set<string> | undefined {
  if (!cmd) return undefined;
  const { tool } = mapShortCommand(cmd);
  const names = FIELD_OWNED_GLOBALS[tool] ?? FIELD_OWNED_GLOBALS[cmd];
  return names ? new Set(names) : undefined;
}

/** 裸 flag 为 true，且不得吞掉下一个非 -- 参数（避免 `--compact convert` 把 convert 当值） */
export const BOOLEAN_GLOBAL_KEYS = new Set([
  "help",
  "h",
  "json",
  "compact",
  "fail-on-error",
  "failOnError",
  "quiet",
  "stdin-json",
  "stdinJson",
]);

/** 旧 CLI 短名 → schema 字段；仅当目标键在 schema 中且原键不在 schema 中时生效。
 *  纯分隔符/大小写差异（allow-fallback、allowFallback → allow_fallback）由
 *  resolveFlagKey 的归一化回退接管，不要再往这里加。 */
export const FLAG_ALIASES: Record<string, string> = {
  name: "memberName",
  owner: "ownerClass",
  kind: "memberKind",
  confirm: "confirmed",
  tag: "tagName",
  "dry-run": "dryRun",
  "allow-dirty": "allowDirty",
  "stash-dirty": "stashDirty",
  "include-prerelease": "includePrerelease",
  class: "className",
  method: "methodName",
};

export const SHORT_COMMANDS: Record<string, { tool: string; inject?: Record<string, unknown> }> = {
  query: { tool: "query_api" },
  convert: { tool: "convert_mapping" },
  update: { tool: "mc_skill_update" },
  status: { tool: "get_server_status" },
  warmup: { tool: "get_server_status", inject: { warmup: true } },
};

export function kebabToCamel(key: string): string {
  return key.replace(/-([a-zA-Z0-9])/g, (_, c: string) => c.toUpperCase());
}

export function mapShortCommand(cmd: string): { tool: string; inject: Record<string, unknown> } {
  const m = ownGet(SHORT_COMMANDS, cmd);
  if (!m) return { tool: cmd, inject: {} };
  return { tool: m.tool, inject: { ...(m.inject ?? {}) } };
}

function appendFlag(flags: RawFlags, key: string, value: FlagScalar): void {
  const prev = flags[key];
  if (prev === undefined) {
    flags[key] = value;
    return;
  }
  if (Array.isArray(prev)) {
    prev.push(value);
    return;
  }
  flags[key] = [prev, value];
}

/** 单连字符 flag 形 token（-className）：漏写一个 - 的 flag，不是值也不是位置参数 */
const FLAG_LIKE_TOKEN = /^-[A-Za-z][A-Za-z0-9_.-]*$/;

export function isFlagLikeToken(token: string): boolean {
  return FLAG_LIKE_TOKEN.test(token);
}

/**
 * flags 解析：--key value / --key=value / 裸 --key→true；
 * 重复 key 追加为数组。非 -- 开头归入 positional，
 * 但 -className 这类漏写连字符的 token 记入 suspectFlags：
 * 归入 positional 会被旧位置参数兼容当成查询值，静默给出错误结果。
 */
export function parseFlags(argv: string[], fieldOwned?: Set<string>): {
  flags: RawFlags;
  positional: string[];
  suspectFlags: string[];
} {
  const flags: RawFlags = {};
  const positional: string[] = [];
  const suspectFlags: string[] = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--") {
      positional.push(...argv.slice(i + 1));
      break;
    }
    if (a === "-h") {
      appendFlag(flags, "help", true);
      continue;
    }
    if (a.startsWith("--")) {
      const eq = a.indexOf("=");
      if (eq > 0) {
        appendFlag(flags, a.slice(2, eq), a.slice(eq + 1));
      } else {
        const key = a.slice(2);
        const next = argv[i + 1];
        if ((BOOLEAN_GLOBAL_KEYS.has(key) || BOOLEAN_GLOBAL_KEYS.has(kebabToCamel(key))) && !fieldOwned?.has(key)) {
          appendFlag(flags, key, true);
        } else if (next !== undefined && (!next.startsWith("-") || /^-?\d+(\.\d+)?$/.test(next))) {
          appendFlag(flags, key, next);
          i++;
        } else {
          appendFlag(flags, key, true);
        }
      }
    } else if (isFlagLikeToken(a)) {
      suspectFlags.push(a.slice(1));
    } else {
      positional.push(a);
    }
  }
  return { flags, positional, suspectFlags };
}

export function unwrapZod(schema: z.ZodTypeAny): z.ZodTypeAny {
  let s: z.ZodTypeAny = schema;
  for (let i = 0; i < 8; i++) {
    if (s instanceof z.ZodOptional || s instanceof z.ZodDefault) {
      s = s._def.innerType as z.ZodTypeAny;
      continue;
    }
    if (s instanceof z.ZodEffects) {
      s = s._def.schema as z.ZodTypeAny;
      continue;
    }
    break;
  }
  return s;
}

export function schemaObjectShape(schema: z.ZodTypeAny | undefined): Record<string, z.ZodTypeAny> | undefined {
  if (!schema) return undefined;
  const inner = unwrapZod(schema);
  const shape = (inner as { shape?: Record<string, z.ZodTypeAny> }).shape;
  return shape;
}

export function schemaPropertyType(schema: z.ZodTypeAny | undefined, key: string): string | undefined {
  const shape = schemaObjectShape(schema);
  let prop = shape?.[key];
  if (!prop) return undefined;
  prop = unwrapZod(prop);
  if (prop instanceof z.ZodNumber || prop instanceof z.ZodBigInt) return "number";
  if (prop instanceof z.ZodBoolean) return "boolean";
  if (prop instanceof z.ZodTuple) return "tuple";
  if (prop instanceof z.ZodArray) return "array";
  if (prop instanceof z.ZodRecord) return "object";
  if (prop instanceof z.ZodObject) return "object";
  if (prop instanceof z.ZodUnion) return "union";
  return "string";
}

/**
 * JSON-schema 节点能否承载文本 / JSON 内容 —— 决定 `@文件` 与 stdin 展开是否适用。
 * 接受：非 enum 的 string、object / record、以及以上元素组成的 array 或 union 分支。
 * 排除：number、boolean、enum（值域是闭集，`@x` 只可能是字面量）、tuple（items 为数组形式）。
 */
function jsonSchemaTakesText(node: unknown): boolean {
  if (!node || typeof node !== "object" || Array.isArray(node)) return false;
  const n = node as Record<string, unknown>;
  if (Array.isArray(n.anyOf)) return n.anyOf.some(jsonSchemaTakesText);
  if (n.type === "object") return true;
  if (n.type === "string") return n.enum === undefined;
  if (n.type === "array") return jsonSchemaTakesText(n.items);
  return false;
}

/**
 * 该工具 schema 中允许 `@文件` / stdin 展开的字段名。
 * 返回 undefined = 拿不到扁平 object shape，调用方按旧行为全量展开。
 * 类型读取走 zodToJsonSchema，不另写一套 Zod 遍历。
 */
export function expandableFlags(schema: z.ZodTypeAny | undefined): Set<string> | undefined {
  const shape = schemaObjectShape(schema);
  if (!shape) return undefined;
  const out = new Set<string>();
  for (const [key, prop] of Object.entries(shape)) {
    if (jsonSchemaTakesText(zodToJsonSchema(prop))) out.add(key);
  }
  return out;
}

function parseArrayish(value: string): unknown[] {
  try {
    const parsed: unknown = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    /* 非 JSON → 逗号拆分 */
  }
  return value.split(",").map((part) => part.trim());
}

/**
 * 按 schema 字段类型转换 flag 值。
 * coerce 必须先看字段 Zod 类型：union 不把 "123" 提前转 number；空字符串不转成 0。
 */
export function coerceFlagValue(value: string, expectedType?: string, itemType?: string): unknown {
  switch (expectedType) {
    case "number":
    case "integer": {
      if (value.trim() === "") return value;
      const num = Number(value);
      return Number.isNaN(num) ? value : num;
    }
    case "boolean": {
      const b = parseBooleanToken(value);
      if (b === undefined) throw new InvalidBooleanFlagError(value);
      return b;
    }
    case "array":
    case "tuple": {
      const parts = parseArrayish(value);
      if (itemType === "number" || expectedType === "tuple") {
        return parts.map((p) => {
          if (typeof p === "number") return p;
          if (typeof p !== "string") return p;
          if (p.trim() === "") return p;
          const n = Number(p);
          return Number.isNaN(n) ? p : n;
        });
      }
      return parts;
    }
    case "object": {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    case "union": {
      const t = value.trim();
      if ((t.startsWith("{") && t.endsWith("}")) || (t.startsWith("[") && t.endsWith("]"))) {
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      }
      return value;
    }
    default:
      return value;
  }
}

export function tupleItemType(schema: z.ZodTypeAny | undefined, key: string): string | undefined {
  const shape = schemaObjectShape(schema);
  const prop = shape?.[key];
  if (!prop) return undefined;
  const inner = unwrapZod(prop);
  if (!(inner instanceof z.ZodTuple)) return undefined;
  const items = (inner._def as { items?: z.ZodTypeAny[] }).items ?? [];
  const first = items[0] ? unwrapZod(items[0]) : undefined;
  if (first instanceof z.ZodNumber || first instanceof z.ZodBigInt) return "number";
  return undefined;
}

/**
 * 失败信封的错误分类（只增键，退出码契约 0/1/2 不变）。
 * 可由退出码反推：2 → usage | validation，1 → tool_failure | timeout。
 * timeout 走 1 而不是新造第三种码：`&&` / `$LASTEXITCODE -ne 0` 型消费者不能遇见预料外的码。
 */
export type CliErrorKind = "usage" | "validation" | "tool_failure" | "timeout";

/**
 * `--timeout` 取值语义：不设或 0 = 不限，其余必须是十进制非负整数毫秒。
 * 返回 error 而不是抛异常：调用方要用统一的 usage 信封（exit 2）报出去。
 */
export function parseTimeoutMs(value: FlagScalar | undefined): { ms: number; error: string | null } {
  if (value === undefined) return { ms: 0, error: null };
  if (typeof value !== "string") {
    return { ms: 0, error: "--timeout 需要毫秒数（如 --timeout=30000；0 表示不限）" };
  }
  const s = value.trim();
  if (!/^\d+$/.test(s)) {
    return { ms: 0, error: `--timeout ${JSON.stringify(value)} 不是毫秒数（要求十进制非负整数，0 表示不限）` };
  }
  const ms = Number(s);
  if (!Number.isSafeInteger(ms)) {
    return { ms: 0, error: `--timeout ${value} 超出可表示范围（上限 ${Number.MAX_SAFE_INTEGER} 毫秒）` };
  }
  return { ms, error: null };
}

/** flag 名归一化：忽略连字符、下划线与大小写（allow-fallback / allowFallback / allow_fallback 同形） */
export function canonicalFlagName(key: string): string {
  return key.replace(/[_-]/g, "").toLowerCase();
}

/** schema 中与 rawKey 归一化同形的字段名（升序，供唯一性判定与错误文案） */
export function flagKeyCandidates(rawKey: string, schemaKeys: Set<string>): string[] {
  const c = canonicalFlagName(rawKey);
  return [...schemaKeys].filter((k) => canonicalFlagName(k) === c).sort();
}

/** 归一化后仍对应多个字段：宁可报错，也不静默改写到其中某一个 */
export class AmbiguousFlagError extends Error {
  constructor(
    readonly flag: string,
    readonly candidates: string[],
  ) {
    super(
      `参数 --${flag} 有歧义，可对应 ${candidates.map((c) => `--${c}`).join(" / ")}，请改用其中精确写法`,
    );
  }
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[b.length];
}

/** 按编辑距离挑出的近似 flag 名（最多 3 个）；距离阈值随输入长度放宽 */
export function nearFlagNames(input: string, known: string[], limit = 3): string[] {
  const lower = input.toLowerCase();
  const threshold = Math.max(1, Math.floor(input.length / 3));
  return known
    .map((k) => ({ k, d: levenshtein(lower, k.toLowerCase()) }))
    .filter((x) => x.d <= threshold)
    .sort((x, y) => x.d - y.d || x.k.localeCompare(y.k))
    .slice(0, limit)
    .map((x) => x.k);
}

/** 可复制执行的取参数清单入口（与文档同一形式：仓库根可解析） */
export function flagHelpPointer(tool: string): string {
  return `查看全部参数：node mcp-server/dist/cli.js ${tool} --help`;
}

export interface UnknownFlagDetails {
  tool?: string;
  knownFlags?: string[];
}

export class UnknownFlagError extends Error {
  readonly nearFlags: string[];
  readonly knownFlags: string[];
  constructor(
    readonly flag: string,
    readonly typedAs?: string,
    readonly details?: UnknownFlagDetails,
  ) {
    const known = details?.knownFlags ?? [];
    const near = known.length > 0 ? nearFlagNames(flag, known) : [];
    let message =
      typedAs === undefined
        ? `未知参数 --${flag}`
        : `未知参数 ${typedAs}：疑似漏写一个连字符，请改用 --${flag}`;
    if (near.length > 0) message += `；近似：${near.map((n) => `--${n}`).join(" / ")}`;
    if (details?.tool) message += `；${flagHelpPointer(details.tool)}`;
    else if (typedAs !== undefined) message += `（全部参数见 --help）`;
    super(message);
    this.nearFlags = near;
    this.knownFlags = known;
  }
}

export function resolveFlagKey(
  rawKey: string,
  schemaKeys: Set<string>,
  aliases: Record<string, string> = FLAG_ALIASES,
): string | undefined {
  if (schemaKeys.has(rawKey)) return rawKey;
  const camel = kebabToCamel(rawKey);
  if (schemaKeys.has(camel)) return camel;
  const aliased = ownGet(aliases, rawKey) ?? ownGet(aliases, camel);
  if (aliased && schemaKeys.has(aliased)) return aliased;
  const candidates = flagKeyCandidates(rawKey, schemaKeys);
  if (candidates.length === 1) return candidates[0];
  if (candidates.length > 1) throw new AmbiguousFlagError(rawKey, candidates);
  return undefined;
}

function flattenFlagValues(v: FlagValue): FlagScalar[] {
  return Array.isArray(v) ? v : [v];
}

export function extractGlobalFlags(raw: RawFlags, fieldOwned?: Set<string>): {
  globals: {
    help: boolean;
    json: boolean;
    compact: boolean;
    failOnError: boolean;
    quiet: boolean;
    stdinJson: boolean;
    project?: string;
    outputFormat?: FlagScalar;
    timeout?: FlagScalar;
    file: string[];
    raw: FlagScalar[];
  };
  rest: RawFlags;
} {
  const rest: RawFlags = {};
  const file: string[] = [];
  const rawFields: FlagScalar[] = [];
  let help = false;
  let json = false;
  let compact = false;
  let failOnError = false;
  let quiet = false;
  let stdinJson = false;
  let project: string | undefined;
  let outputFormat: FlagScalar | undefined;
  let timeout: FlagScalar | undefined;
  for (const [k, v] of Object.entries(raw)) {
    const camel = kebabToCamel(k);
    if (fieldOwned?.has(k)) {
      rest[k] = v;
      continue;
    }
    if (k === "help" || k === "h") {
      help = parseFlagTruthy(v, k);
      continue;
    }
    if (k === "json") {
      json = parseFlagTruthy(v, "json");
      continue;
    }
    if (k === "compact") {
      compact = parseFlagTruthy(v, "compact");
      continue;
    }
    if (k === "fail-on-error" || camel === "failOnError") {
      failOnError = parseFlagTruthy(v, "fail-on-error");
      continue;
    }
    if (k === "quiet") {
      quiet = parseFlagTruthy(v, "quiet");
      continue;
    }
    if (k === "stdin-json" || camel === "stdinJson") {
      stdinJson = parseFlagTruthy(v, "stdin-json");
      continue;
    }
    if (k === "timeout") {
      const last = flattenFlagValues(v).at(-1);
      if (last !== undefined) timeout = last;
      continue;
    }
    if (k === "project") {
      const last = flattenFlagValues(v).at(-1);
      if (typeof last === "string") project = last;
      continue;
    }
    if (k === "output-format" || camel === "outputFormat") {
      const last = flattenFlagValues(v).at(-1);
      if (last !== undefined) outputFormat = last;
      continue;
    }
    if (k === "file") {
      for (const item of flattenFlagValues(v)) {
        if (typeof item === "string") file.push(item);
      }
      continue;
    }
    if (k === "raw") {
      rawFields.push(...flattenFlagValues(v));
      continue;
    }
    rest[k] = v;
  }
  return {
    globals: { help, json, compact, failOnError, quiet, stdinJson, project, outputFormat, timeout, file, raw: rawFields },
    rest,
  };
}

/**
 * 将 raw flags 映射到 schema 字段并按类型 coerce。未知键抛 UnknownFlagError。
 * extraInject 先写入，用户 flags 覆盖（warmup 短名注入 warmup=true，用户 --warmup=false 优先）。
 */
export function coerceFlags(
  raw: RawFlags,
  schema: z.ZodTypeAny | undefined,
  extraInject: Record<string, unknown> = {},
  aliases: Record<string, string> = FLAG_ALIASES,
  toolName?: string,
): Record<string, unknown> {
  const shape = schemaObjectShape(schema);
  const schemaKeys = new Set(shape ? Object.keys(shape) : []);
  const collected: Record<string, FlagScalar[]> = {};
  for (const [k, v] of Object.entries(raw)) {
    const key = resolveFlagKey(k, schemaKeys, aliases);
    if (!key) {
      throw new UnknownFlagError(k, undefined, { tool: toolName, knownFlags: [...schemaKeys] });
    }
    collected[key] = [...(collected[key] ?? []), ...flattenFlagValues(v)];
  }
  const out: Record<string, unknown> = { ...extraInject };
  for (const [key, values] of Object.entries(collected)) {
    const expected = schemaPropertyType(schema, key);
    const itemType = tupleItemType(schema, key);
    if (expected === "array" || expected === "tuple") {
      const acc: unknown[] = [];
      for (const v of values) {
        if (typeof v === "boolean") {
          acc.push(v);
          continue;
        }
        const coerced = coerceFlagValue(v, expected, itemType);
        if (Array.isArray(coerced)) acc.push(...coerced);
        else acc.push(coerced);
      }
      out[key] = acc;
      continue;
    }
    const last = values.at(-1);
    if (typeof last === "boolean") {
      out[key] = last;
      continue;
    }
    if (typeof last === "string") {
      out[key] = coerceFlagValue(last, expected, itemType);
    }
  }
  return out;
}

export function applyPositionalCompat(
  cmd: string,
  params: Record<string, unknown>,
  positional: string[],
): Record<string, unknown> {
  const out = { ...params };
  if (cmd === "query" || cmd === "query_api") {
    if (typeof out.className !== "string" && positional[0]) out.className = positional[0];
    if (typeof out.methodName !== "string" && positional[1]) out.methodName = positional[1];
  } else if (cmd === "convert" || cmd === "convert_mapping") {
    if (typeof out.memberName !== "string" && positional[0]) out.memberName = positional[0];
  } else if (cmd === "update" || cmd === "mc_skill_update") {
    if (typeof out.action !== "string" && (positional[0] === "check" || positional[0] === "apply")) {
      out.action = positional[0];
    }
  } else if (cmd === "descriptor") {
    if (typeof out.descriptor !== "string" && positional[0]) out.descriptor = positional[0];
  } else if (cmd === "warmup" || cmd === "status" || cmd === "get_server_status") {
    if (typeof out.version !== "string" && positional[0]) out.version = positional[0];
  }
  return out;
}

/** 位置参数里未被 applyPositionalCompat 消费的剩余项（供 CLI stderr 警告）。 */
export function unusedPositionals(cmd: string, positional: string[]): string[] {
  let used = 0;
  if (cmd === "query" || cmd === "query_api") used = Math.min(2, positional.length);
  else if (
    cmd === "convert" ||
    cmd === "convert_mapping" ||
    cmd === "descriptor" ||
    cmd === "warmup" ||
    cmd === "status" ||
    cmd === "get_server_status"
  ) {
    used = Math.min(1, positional.length);
  } else if (cmd === "update" || cmd === "mc_skill_update") {
    used = positional[0] === "check" || positional[0] === "apply" ? 1 : 0;
  }
  return positional.slice(used);
}

export function isToolFailure(result: unknown, isError: boolean, failOnError: boolean): boolean {
  if (isError) return true;
  if (!result || typeof result !== "object") return false;
  const r = result as Record<string, unknown>;
  if (r.ok === false) return true;
  if (r.status === "skipped") return false;
  if (r.passed === false) return true;
  const nestedErr = r.error;
  const hasErrorCode =
    nestedErr && typeof nestedErr === "object" && nestedErr !== null && "code" in nestedErr;
  if (r.found === false && hasErrorCode && r.ok !== true) return true;
  if (r.found === false && !failOnError) return false;
  if (hasErrorCode && r.ok !== true) return true;
  if (failOnError) {
    if (r.found === false) return true;
    if (Array.isArray(r.errors) && r.errors.length > 0) return true;
  }
  return false;
}

/**
 * zod inputSchema → JSON schema。
 * 覆盖 string/number/boolean/enum/array/tuple/object/record/union/literal + optional/default。
 */
export function zodToJsonSchema(schema: z.ZodTypeAny): Record<string, unknown> {
  const def = schema._def as {
    description?: string;
    innerType?: z.ZodTypeAny;
    schema?: z.ZodTypeAny;
    type?: z.ZodTypeAny;
    items?: z.ZodTypeAny[];
    values?: readonly string[] | Record<string, string>;
    options?: z.ZodTypeAny[];
    value?: unknown;
    defaultValue?: unknown;
  };
  let out: Record<string, unknown>;
  if (schema instanceof z.ZodDefault) {
    out = zodToJsonSchema(def.innerType!);
    const dv = typeof def.defaultValue === "function" ? (def.defaultValue as () => unknown)() : def.defaultValue;
    out.default = dv;
  } else if (schema instanceof z.ZodOptional) {
    out = zodToJsonSchema(def.innerType!);
  } else if (schema instanceof z.ZodEffects) {
    out = zodToJsonSchema(def.schema!);
  } else if (schema instanceof z.ZodString) {
    out = { type: "string" };
  } else if (schema instanceof z.ZodNumber || schema instanceof z.ZodBigInt) {
    out = { type: "number" };
  } else if (schema instanceof z.ZodBoolean) {
    out = { type: "boolean" };
  } else if (schema instanceof z.ZodEnum) {
    out = { type: "string", enum: [...(def.values as readonly string[])] };
  } else if (schema instanceof z.ZodNativeEnum) {
    out = { type: "string", enum: Object.values(def.values as Record<string, string>).filter((v) => typeof v === "string") };
  } else if (schema instanceof z.ZodTuple) {
    const items = (def.items ?? []).map((item) => zodToJsonSchema(item));
    out = { type: "array", items, minItems: items.length, maxItems: items.length };
  } else if (schema instanceof z.ZodArray) {
    out = { type: "array", items: zodToJsonSchema(def.type!) };
  } else if (schema instanceof z.ZodObject) {
    const shape = (schema as { shape: Record<string, z.ZodTypeAny> }).shape;
    const props: Record<string, unknown> = {};
    const required: string[] = [];
    for (const [k, v] of Object.entries(shape)) {
      props[k] = zodToJsonSchema(v);
      if (!(v instanceof z.ZodOptional) && !(v instanceof z.ZodDefault)) required.push(k);
    }
    out = { type: "object", properties: props, ...(required.length > 0 ? { required } : {}) };
  } else if (schema instanceof z.ZodRecord) {
    out = { type: "object" };
  } else if (schema instanceof z.ZodUnion) {
    out = { anyOf: def.options!.map((o) => zodToJsonSchema(o)) };
  } else if (schema instanceof z.ZodLiteral) {
    out = { const: def.value };
  } else {
    out = {};
  }
  if (def.description) out.description = def.description;
  return out;
}

export const MIGRATION_NOTICE = "旧位置参数用法将在未来移除，请改用 --key value 形式";

export const POSITIONAL_COMMANDS = new Set([
  "query",
  "query_api",
  "convert",
  "convert_mapping",
  "descriptor",
  "update",
  "mc_skill_update",
  "warmup",
  "status",
  "get_server_status",
]);

/**
 * 调用前可能依赖 MC_SKILL_DATA 的工具（help/descriptor 不在此列）。
 * 刻意不含 activate_platform_pack / detect_mod_project：实测把 MC_SKILL_DATA 指向空目录后
 * 两者仍按仓库根 <platform>/<ver> 规则树（resolveRepoRoot）工作并自报 PACK_NOT_FOUND /
 * packFound:false，数据目录提示对它们是误导。枚举门（test-cli.mjs）钉住这条边界。
 */
export const DATA_DIR_TOOLS = new Set([
  "query_api",
  "get_method_params",
  "convert_mapping",
  "get_server_status",
  "get_version_info",
  "search_forge_docs",
  "get_forge_doc_summary",
  "get_forge_doc_full",
  "get_forge_doc_related",
  "list_forge_versions",
  "search_fabric_docs",
  "get_fabric_doc_summary",
  "get_fabric_doc_full",
  "get_fabric_doc_related",
  "list_fabric_versions",
  "search_neoforge_docs",
  "get_neoforge_doc_summary",
  "get_neoforge_doc_full",
  "get_neoforge_doc_related",
  "list_neoforge_versions",
  "list_doc_versions",
  "search_docs",
  "get_doc_summary",
  "get_doc_full",
  "get_doc_related",
  "search_community_docs",
  "get_community_doc_summary",
  "get_community_doc_full",
  "list_community_sources",
  "search_bedrock_docs",
  "get_bedrock_doc_summary",
  "get_bedrock_doc_full",
  "get_bedrock_doc_related",
  "lookup_obfuscated",
  "query_registry",
  "get_minecraft_source",
  "get_workflow_template",
  "read_knowledge_resource",
  "list_knowledge_resources",
  "get_migration_guide",
  "mc_skill_update",
  "download_official_mdk",
  "search_mod_code",
  "decompile_mod_jar",
  "diagnose_data_paths",
  "query_loader_api",
  "search_loader_api",
]);
