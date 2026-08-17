/**
 * mc-skill CLI 参数解析：flags、kebab→camel、按 Zod 类型 coerce、JSON Schema 导出。
 * 不含 IO（@file / stdin / --project 在 cli.ts 适配层）。
 */
import * as z from "zod";
import { ownGet } from "./utils/own-record.js";

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
]);

/** 裸 flag 为 true，且不得吞掉下一个非 -- 参数（避免 `--compact convert` 把 convert 当值） */
export const BOOLEAN_GLOBAL_KEYS = new Set([
  "help",
  "h",
  "json",
  "compact",
  "fail-on-error",
  "failOnError",
]);

/** 旧 CLI 短名 → schema 字段；仅当目标键在 schema 中且原键不在 schema 中时生效 */
export const FLAG_ALIASES: Record<string, string> = {
  name: "memberName",
  owner: "ownerClass",
  kind: "memberKind",
  "allow-fallback": "allow_fallback",
  allowFallback: "allow_fallback",
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

/**
 * flags 解析：--key value / --key=value / 裸 --key→true；
 * 重复 key 追加为数组。非 -- 开头归入 positional。
 */
export function parseFlags(argv: string[]): { flags: RawFlags; positional: string[] } {
  const flags: RawFlags = {};
  const positional: string[] = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
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
        if (BOOLEAN_GLOBAL_KEYS.has(key) || BOOLEAN_GLOBAL_KEYS.has(kebabToCamel(key))) {
          appendFlag(flags, key, true);
        } else if (next !== undefined && !next.startsWith("-")) {
          appendFlag(flags, key, next);
          i++;
        } else {
          appendFlag(flags, key, true);
        }
      }
    } else {
      positional.push(a);
    }
  }
  return { flags, positional };
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

function parseBooleanToken(value: string): boolean | undefined {
  const v = value.trim().toLowerCase();
  if (v === "true" || v === "1" || v === "yes") return true;
  if (v === "false" || v === "0" || v === "no") return false;
  return undefined;
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
      return b === undefined ? value : b;
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

export class UnknownFlagError extends Error {
  constructor(readonly flag: string) {
    super(`未知参数 --${flag}`);
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
  return undefined;
}

function flattenFlagValues(v: FlagValue): FlagScalar[] {
  return Array.isArray(v) ? v : [v];
}

export function extractGlobalFlags(raw: RawFlags): {
  globals: {
    help: boolean;
    json: boolean;
    compact: boolean;
    failOnError: boolean;
    project?: string;
    file: string[];
  };
  rest: RawFlags;
} {
  const rest: RawFlags = {};
  const file: string[] = [];
  let help = false;
  let json = false;
  let compact = false;
  let failOnError = false;
  let project: string | undefined;
  for (const [k, v] of Object.entries(raw)) {
    const camel = kebabToCamel(k);
    if (k === "help" || k === "h") {
      help = true;
      continue;
    }
    if (k === "json") {
      json = true;
      continue;
    }
    if (k === "compact") {
      compact = true;
      continue;
    }
    if (k === "fail-on-error" || camel === "failOnError") {
      failOnError = true;
      continue;
    }
    if (k === "project") {
      const last = flattenFlagValues(v).at(-1);
      if (typeof last === "string") project = last;
      continue;
    }
    if (k === "file") {
      for (const item of flattenFlagValues(v)) {
        if (typeof item === "string") file.push(item);
      }
      continue;
    }
    rest[k] = v;
  }
  return { globals: { help, json, compact, failOnError, project, file }, rest };
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
): Record<string, unknown> {
  const shape = schemaObjectShape(schema);
  const schemaKeys = new Set(shape ? Object.keys(shape) : []);
  const collected: Record<string, FlagScalar[]> = {};
  for (const [k, v] of Object.entries(raw)) {
    const key = resolveFlagKey(k, schemaKeys, aliases);
    if (!key) {
      throw new UnknownFlagError(k);
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
  }
  return out;
}

export function isToolFailure(result: unknown, isError: boolean, failOnError: boolean): boolean {
  if (isError) return true;
  if (!result || typeof result !== "object") return false;
  const r = result as Record<string, unknown>;
  if (r.ok === false) return true;
  if (r.passed === false) return true;
  if (r.found === false && !failOnError) {
    /* 查询无命中默认成功 */
  } else if (r.found !== false) {
    const err = r.error;
    if (err && typeof err === "object" && err !== null && "code" in err && r.ok !== true) {
      return true;
    }
  }
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
]);

/** 调用前可能依赖 MC_SKILL_DATA 的工具（help/descriptor 不在此列） */
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
