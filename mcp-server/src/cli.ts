#!/usr/bin/env node
/**
 * mc-skill CLI — status / warmup / query / convert / descriptor / update / list-tools
 *
 * flags-only（--key value / --key=value / 裸 --key→true），参数类型按各工具的
 * zod inputSchema 驱动转换（string 保持字面，number/boolean/array/object 转换）。
 * 输出统一 JSON 包装 {success, tool, result|error}；退出码 0=成功 / 1=工具错误 / 2=用法错误。
 *
 * 旧位置参数形式仍兼容（stderr 输出迁移提示），结果 JSON 与 flags-only 形式一致。
 * 参数解析 / 类型转换 / isMainModule 模式参照 MCDxAI/minecraft-dev-mcp src/cli.ts（MIT，见 THIRD_PARTY_NOTICES.md）。
 */
import { realpathSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import * as z from "zod";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

/** 旧位置参数迁移提示（stderr） */
const MIGRATION_NOTICE = "⚠️ 旧位置参数用法将在未来移除，请改用 --key value 形式";

/** 有位置参数兼容映射的子命令 */
const POSITIONAL_COMMANDS = new Set(["query", "convert", "descriptor", "update"]);
const COMMANDS = ["status", "warmup", "query", "convert", "descriptor", "update", "list-tools"];

async function load() {
  const api = await import(pathToFileURL(join(root, "dist/api/index.js")).href);
  const mappings = await import(pathToFileURL(join(root, "dist/mappings/index.js")).href);
  const descriptor = await import(pathToFileURL(join(root, "dist/utils/descriptor.js")).href);
  const pathUtil = await import(pathToFileURL(join(root, "dist/utils/path.js")).href);
  const update = await import(pathToFileURL(join(root, "dist/update/index.js")).href);
  return { api, mappings, descriptor, pathUtil, update };
}

/**
 * 惰性加载工具 schema 注册表（dist/index.js）。该模块被 import 时不启动 MCP 服务
 * （bootstrap 已用 isMainModule() 守卫），故无副作用。
 */
async function schemaRegistry() {
  return import(pathToFileURL(join(root, "dist/index.js")).href);
}

function printJson(obj: unknown) {
  process.stdout.write(JSON.stringify(obj, null, 2) + "\n");
}

function usage() {
  printJson({
    usage: [
      "mc-skill status [--version=1.20.1]",
      "mc-skill warmup [--version=1.20.1]",
      "mc-skill query --className <className> [--methodName <methodName>] [--version=1.20.1]",
      "mc-skill convert --from=mcp|yarn|mojang|parchment|obfuscated|intermediary --to=... --name=getHealth [--owner=...] [--descriptor=()F] [--kind=method|field|class] [--version=1.20.1] [--allow-fallback]",
      "mc-skill convert --from=intermediary --to=obfuscated --name=method_6032 --version=1.20.1",
      "mc-skill convert --from=obfuscated --to=yarn --name=er --version=1.20.1   # 无 owner：method→field→class 全局反查",
      "mc-skill descriptor --descriptor=<jniDescriptor> [--name=method]",
      "mc-skill update --action=check|apply [--scope=all|tooling|data] [--channel=stable|latest|tag] [--tag=vX.Y.Z] [--dry-run] [--confirm] [--allow-dirty] [--stash-dirty]",
      "mc-skill list-tools",
    ],
  });
}

/**
 * flags 解析：--key value / --key=value / 裸 --key→true（值以 -- 开头时不吞并，
 * 视为裸 flag）；非 -- 开头参数归入 positional（旧位置参数兼容）。
 */
export function parseFlags(argv: string[]) {
  const flags: Record<string, string | boolean> = {};
  const positional: string[] = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const eq = a.indexOf("=");
      if (eq > 0) {
        flags[a.slice(2, eq)] = a.slice(eq + 1);
      } else {
        const key = a.slice(2);
        const next = argv[i + 1];
        if (next !== undefined && !next.startsWith("--")) {
          flags[key] = next;
          i++;
        } else {
          flags[key] = true;
        }
      }
    } else {
      positional.push(a);
    }
  }
  return { flags, positional };
}

/** 由 zod inputSchema 取字段的 JSON-schema type（string 保持字面，不猜值） */
function schemaPropertyType(schema: z.ZodTypeAny | undefined, key: string): string | undefined {
  const shape = (schema as { shape?: Record<string, z.ZodTypeAny> } | undefined)?.shape;
  let prop = shape?.[key];
  if (!prop) return undefined;
  while (prop instanceof z.ZodOptional || prop instanceof z.ZodDefault) {
    prop = prop._def.innerType as z.ZodTypeAny;
  }
  if (prop instanceof z.ZodNumber || prop instanceof z.ZodBigInt) return "number";
  if (prop instanceof z.ZodBoolean) return "boolean";
  if (prop instanceof z.ZodArray) return "array";
  if (prop instanceof z.ZodObject || prop instanceof z.ZodRecord) return "object";
  // string / enum / union → 保持字符串字面
  return "string";
}

/**
 * 按 schema 字段类型转换 flag 值（参照 MCDxAI coerceFlagValue，MIT）：
 * string 保持字面；number/boolean 转换；array 支持 JSON 数组与逗号分隔两种形式；
 * object 尝试 JSON.parse。数组 flag 重复出现时追加而非覆盖。
 */
export function coerceFlagValue(value: string, expectedType?: string): unknown {
  switch (expectedType) {
    case "number":
    case "integer": {
      const num = Number(value);
      return Number.isNaN(num) ? value : num;
    }
    case "boolean":
      return value === "true" || value === "1";
    case "array": {
      try {
        const parsed: unknown = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // 非 JSON → 按逗号拆分
      }
      return value
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean);
    }
    case "object": {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    default:
      return value;
  }
}

/** 旧 CLI flag 名 → 工具 schema 字段名 */
const ALIASES: Record<string, Record<string, string>> = {
  query: { class: "className", method: "methodName" },
  convert: { name: "memberName", owner: "ownerClass", kind: "memberKind", "allow-fallback": "allow_fallback" },
  update: {
    confirm: "confirmed",
    tag: "tagName",
    "dry-run": "dryRun",
    "allow-dirty": "allowDirty",
    "stash-dirty": "stashDirty",
    "include-prerelease": "includePrerelease",
  },
};

function coerceFlags(
  raw: Record<string, string | boolean>,
  schema: z.ZodTypeAny | undefined,
  aliases: Record<string, string>
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(raw)) {
    const key = aliases[k] ?? k;
    if (typeof v === "boolean") {
      out[key] = v; // 裸 flag → true
      continue;
    }
    out[key] = coerceFlagValue(v, schemaPropertyType(schema, key));
  }
  return out;
}

class CliToolError extends Error {
  constructor(
    readonly tool: string,
    message: string
  ) {
    super(message);
  }
}

/**
 * zod inputSchema → JSON schema（供 list-tools 的 parameters 输出）。
 * 覆盖本仓库 62 个工具用到的 zod 类型：string/number/boolean/enum/array/object/
 * record/union/literal + optional/default 包裹；保留 .describe() 描述与 required。
 */
function zodToJsonSchema(schema: z.ZodTypeAny): Record<string, unknown> {
  const def = schema._def as { description?: string; innerType?: z.ZodTypeAny; type?: z.ZodTypeAny; values?: readonly string[] | Record<string, string>; options?: z.ZodTypeAny[]; value?: unknown; shape?: Record<string, z.ZodTypeAny> };
  let out: Record<string, unknown>;
  if (schema instanceof z.ZodOptional || schema instanceof z.ZodDefault) {
    out = zodToJsonSchema(def.innerType!);
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

function str(v: unknown, fallback?: string): string | undefined {
  return typeof v === "string" ? v : fallback;
}

async function runCommand(
  cmd: string,
  flags: Record<string, string | boolean>,
  positional: string[]
): Promise<unknown> {
  switch (cmd) {
    case "status": {
      const { api, pathUtil, update } = await load();
      const reg = await schemaRegistry();
      const params = coerceFlags(flags, reg.getServerStatusSchema, {});
      const version = str(params.version, "1.20.1")!;
      await api.warmupApi([version]);
      const result = {
        ok: true,
        dataPaths: pathUtil.diagnoseDataPaths(),
        api: api.listApiPreloadStatuses(),
        focus: api.getApiPreloadStatus(version),
        updateHint: update.getUpdateHint(),
      };
      api.disposeApiData();
      return result;
    }

    case "warmup": {
      const { api } = await load();
      const reg = await schemaRegistry();
      const params = coerceFlags(flags, reg.getServerStatusSchema, {});
      const version = str(params.version, "1.20.1")!;
      const statuses = await api.warmupApi([version]);
      api.disposeApiData();
      return { ok: true, statuses };
    }

    case "query": {
      const { api } = await load();
      const reg = await schemaRegistry();
      const params = coerceFlags(flags, reg.queryApiSchema, ALIASES.query);
      const className = str(params.className) ?? positional[0];
      const methodName = str(params.methodName) ?? positional[1];
      if (typeof className !== "string" || !className) {
        throw new CliToolError("query", "缺少必填参数 className（--className <className>）");
      }
      const version = str(params.version, "1.20.1")!;
      const result = await api.queryApi({ className, methodName, version });
      api.disposeApiData();
      return result;
    }

    case "convert": {
      const { mappings } = await load();
      const reg = await schemaRegistry();
      const params = coerceFlags(flags, reg.convertMappingSchema, ALIASES.convert);
      const from = str(params.from, "");
      const to = str(params.to, "");
      const memberName = str(params.memberName) ?? positional[0];
      if (!from || !to) {
        throw new CliToolError("convert", "缺少必填参数 --from 与 --to（如 --from mcp --to mojang）");
      }
      if (typeof memberName !== "string" || !memberName) {
        throw new CliToolError("convert", "缺少必填参数 memberName（--name <memberName>）");
      }
      return mappings.convertMapping({
        from: from as "mojang" | "mcp" | "yarn" | "parchment",
        to: to as "mojang" | "mcp" | "yarn" | "parchment",
        memberName,
        ownerClass: str(params.ownerClass),
        descriptor: str(params.descriptor),
        version: str(params.version),
        memberKind: (str(params.memberKind) ?? "auto") as "class" | "method" | "field" | "auto",
        allow_fallback: params.allow_fallback === true,
      });
    }

    case "descriptor": {
      const { descriptor } = await load();
      const descriptorSchema = z.object({
        descriptor: z.string().optional(),
        name: z.string().optional(),
      });
      const params = coerceFlags(flags, descriptorSchema, {});
      const desc = str(params.descriptor) ?? positional[0];
      if (typeof desc !== "string" || !desc) {
        throw new CliToolError("descriptor", "缺少必填参数 descriptor（--descriptor <jniDescriptor>）");
      }
      const name = str(params.name, "method")!;
      return {
        descriptor: desc,
        returnType: descriptor.returnType(desc),
        parameterTypes: descriptor.parameterTypes(desc),
        readableSignature: descriptor.readableSignature(name, desc),
      };
    }

    case "update": {
      const { update } = await load();
      const reg = await schemaRegistry();
      const params = coerceFlags(flags, reg.mcSkillUpdateSchema, ALIASES.update);
      const action = str(params.action) ?? (positional[0] === "apply" || positional[0] === "check" ? positional[0] : undefined);
      if (action !== "check" && action !== "apply") {
        throw new CliToolError("update", "缺少必填参数 action（--action check|apply）");
      }
      const confirmed = params.confirmed === true;
      const dryRun = confirmed ? false : typeof params.dryRun === "boolean" ? params.dryRun : true;
      const result = await update.mcSkillUpdate({
        action,
        scope: str(params.scope, "all")!,
        channel: str(params.channel, "stable")!,
        tagName: str(params.tagName),
        dryRun: action === "apply" ? dryRun : undefined,
        confirmed,
        allowDirty: params.allowDirty === true,
        stashDirty: params.stashDirty === true,
        includePrerelease: params.includePrerelease === true,
      });
      return result;
    }

    case "list-tools": {
      const reg = await schemaRegistry();
      const tools = reg.listAllToolSchemas();
      return {
        tools: tools.map((t: { name: string; description: string; inputSchema: z.ZodTypeAny }) => ({
          name: t.name,
          description: t.description,
          parameters: zodToJsonSchema(t.inputSchema),
        })),
        total: tools.length,
      };
    }

    default:
      throw new CliToolError(cmd, `未知命令：${cmd}`);
  }
}

async function main() {
  const argv = process.argv.slice(2);
  const cmd = argv[0];
  if (cmd === "-h" || cmd === "--help" || cmd === "help") {
    usage();
    return;
  }
  if (!cmd || !COMMANDS.includes(cmd)) {
    usage();
    process.exit(2);
  }

  const { flags, positional } = parseFlags(argv.slice(1));
  if (positional.length > 0 && POSITIONAL_COMMANDS.has(cmd)) {
    process.stderr.write(MIGRATION_NOTICE + "\n");
  }

  try {
    const result = await runCommand(cmd, flags, positional);
    printJson({ success: true, tool: cmd, result });
  } catch (err) {
    if (err instanceof CliToolError) {
      printJson({ success: false, tool: err.tool, error: err.message });
      process.exit(1);
    }
    printJson({ success: false, tool: cmd, error: err instanceof Error ? err.message : String(err) });
    process.exit(1);
  }
}

// 仅直接执行时运行（被 import 时不启动）。比较 realpath 以兼容
// nvm-windows / npm link 的 symlink 安装（import.meta.url 解析到真实路径，
// 而 process.argv[1] 保留 symlink 路径）。
function isMainModule(): boolean {
  const entry = process.argv[1];
  if (!entry) return false;
  const here = fileURLToPath(import.meta.url);
  if (entry === here) return true;
  try {
    return realpathSync(entry) === here;
  } catch {
    return false;
  }
}

if (isMainModule()) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
