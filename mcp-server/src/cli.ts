#!/usr/bin/env node
/**
 * mc-skill CLI — 短名 alias + 全部 MCP 工具通用 dispatch。
 *
 * flags-only（--key value / --key=value / 裸 --key→true），参数类型按各工具的
 * zod inputSchema 驱动转换。输出 JSON 包装 {success, tool, result|error}。
 * 退出码 0=成功 / 1=工具失败 / 2=用法错误。
 *
 * 旧位置参数形式仍兼容（stderr 迁移提示）。descriptor 为本地子命令，不经 MCP registry。
 */
import "./utils/node-sqlite-guard.js"; // 必须保持第一个 import：22.5–22.12 未带 --experimental-sqlite 时先给出指引再退出
import { existsSync, readFileSync, realpathSync, statSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import * as z from "zod";
import { toolHandlers } from "./tool-handlers.js";
import {
  applyPositionalCompat,
  coerceFlags,
  DATA_DIR_TOOLS,
  extractGlobalFlags,
  isToolFailure,
  mapShortCommand,
  MIGRATION_NOTICE,
  parseFlags,
  POSITIONAL_COMMANDS,
  resolveFlagKey,
  schemaObjectShape,
  UnknownFlagError,
  zodToJsonSchema,
  type RawFlags,
} from "./cli-parse.js";
import { parameterTypes, readableSignature, returnType } from "./utils/descriptor.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE_MAX_BYTES = 8 * 1024 * 1024;

const descriptorSchema = z.object({
  descriptor: z.string().optional(),
  name: z.string().optional(),
});

class CliUsageError extends Error {
  constructor(
    readonly tool: string,
    message: string,
  ) {
    super(message);
  }
}

function cliVersion(): string {
  try {
    const pkg = JSON.parse(readFileSync(join(__dirname, "..", "package.json"), "utf8")) as { version?: string };
    return pkg.version ?? "0.0.0";
  } catch {
    return "0.0.0";
  }
}

function printJson(obj: unknown, compact: boolean): void {
  process.stdout.write(JSON.stringify(obj, null, compact ? undefined : 2) + "\n");
}

const USAGE_LINES = [
  "mc-skill <tool> [--key=value ...] [--project <dir>] [--file field=path]",
  "mc-skill query --className <className> [--methodName <methodName>] [--version=1.20.1]",
  "mc-skill convert --from=mcp --to=mojang --name=getHealth [--owner=...] [--descriptor=()F]",
  "mc-skill convert_mapping --from obfuscated --to yarn --name er --version 1.20.1",
  "mc-skill descriptor --descriptor=<jniDescriptor> [--name=method]",
  "mc-skill update --action=check|apply [--dry-run=false --confirm]",
  "mc-skill validate_project --project .",
  "mc-skill crash_analyze --crashReport @./crash-reports/latest.txt",
  "mc-skill list-tools",
  "mc-skill <任意MCP工具名> --key=value ...",
];

function printGlobalHelp(json: boolean, compact: boolean): void {
  if (json || !process.stdout.isTTY) {
    printJson({ usage: USAGE_LINES }, compact);
    return;
  }
  process.stdout.write(
    [
      "mc-skill — 调用 MCP 工具的独立 CLI",
      "",
      "用法:",
      ...USAGE_LINES.map((l) => `  ${l}`),
      "",
      "全局 flag: --help  --version  --json  --compact  --fail-on-error  --project <dir>  --file field=path",
      "文件输入: --crashReport @./latest.txt   --crashReport=-   --file crashReport=./latest.txt",
      "退出码: 0 成功 / 1 工具失败 / 2 用法错误",
      "",
    ].join("\n"),
  );
}

async function loadRegistry() {
  return import("./tool-registry.js");
}

function readLimitedFile(path: string, tool: string): string {
  try {
    if (!existsSync(path) || !statSync(path).isFile()) {
      throw new CliUsageError(tool, `无法读取文件：${path}`);
    }
    const size = statSync(path).size;
    if (size > FILE_MAX_BYTES) {
      throw new CliUsageError(tool, `文件超过 8MB 上限：${path}`);
    }
    const content = readFileSync(path, "utf8");
    if (Buffer.byteLength(content, "utf8") > FILE_MAX_BYTES) {
      throw new CliUsageError(tool, `文件超过 8MB 上限：${path}`);
    }
    return content;
  } catch (err) {
    if (err instanceof CliUsageError) throw err;
    throw new CliUsageError(tool, `读取文件失败：${path}（${(err as Error).message}）`);
  }
}

interface StdinState {
  used: boolean;
}

function expandStringValue(value: string, tool: string, stdin: StdinState): string {
  if (value === "-" || value === "@-") {
    if (stdin.used) {
      throw new CliUsageError(tool, "stdin 只能用一次（不要同时对多个字段使用 @- 或 =-）");
    }
    if (process.stdin.isTTY === true) {
      throw new CliUsageError(
        tool,
        "TTY 下不能用 @- / - 读 stdin（会挂起等待输入）。请改 --file field=path 或管道输入。",
      );
    }
    stdin.used = true;
    return readFileSync(0, "utf8");
  }
  if (value.startsWith("@@")) return value.slice(1);
  if (value.startsWith("@")) return readLimitedFile(value.slice(1), tool);
  return value;
}

function applyFileSpecs(
  rest: RawFlags,
  fileSpecs: string[],
  tool: string,
  schema: z.ZodTypeAny,
): void {
  const shape = schemaObjectShape(schema);
  const keys = new Set(Object.keys(shape ?? {}));
  for (const spec of fileSpecs) {
    const eq = spec.indexOf("=");
    if (eq <= 0) {
      throw new CliUsageError(tool, "--file 需要 field=path 形式（如 --file crashReport=./latest.txt）");
    }
    const rawField = spec.slice(0, eq);
    const field = resolveFlagKey(rawField, keys);
    if (!field) {
      throw new UnknownFlagError(rawField);
    }
    const path = spec.slice(eq + 1);
    rest[field] = path === "-" || path.startsWith("@") ? path : `@${path}`;
  }
}

function expandFlagFiles(rest: RawFlags, tool: string, stdin: StdinState): void {
  for (const [k, v] of Object.entries(rest)) {
    if (Array.isArray(v)) {
      rest[k] = v.map((item) => (typeof item === "string" ? expandStringValue(item, tool, stdin) : item));
    } else if (typeof v === "string") {
      rest[k] = expandStringValue(v, tool, stdin);
    }
  }
}

function unwrapHandlerResult(raw: unknown): { result: unknown; isError: boolean } {
  if (raw && typeof raw === "object" && "content" in raw) {
    const r = raw as { isError?: boolean; content?: Array<{ type?: string; text?: string }> };
    const isError = r.isError === true;
    const text = r.content?.[0]?.text;
    if (typeof text === "string") {
      try {
        return { result: JSON.parse(text), isError };
      } catch {
        return { result: { text }, isError };
      }
    }
    return { result: raw, isError };
  }
  return { result: raw, isError: false };
}

async function maybeHintDataDir(mappedTool: string): Promise<void> {
  if (!DATA_DIR_TOOLS.has(mappedTool)) return;
  try {
    const { hasAnyPlatformData } = await import("./utils/path.js");
    if (!hasAnyPlatformData()) {
      process.stderr.write(
        "提示: 未检测到平台数据目录。请设置 MC_SKILL_DATA 为 data 目录绝对路径，例如 MC_SKILL_DATA=H:/MC_skill/data\n",
      );
    }
  } catch {
    /* ignore */
  }
}

function printToolHelp(
  name: string,
  description: string,
  schema: z.ZodTypeAny,
  json: boolean,
  compact: boolean,
): void {
  const parameters = zodToJsonSchema(schema);
  if (json || !process.stdout.isTTY) {
    printJson({ tool: name, description, parameters }, compact);
    return;
  }
  const required = Array.isArray((parameters as { required?: string[] }).required)
    ? (parameters as { required: string[] }).required
    : [];
  process.stdout.write(
    [
      `${name}`,
      description,
      required.length ? `必填: ${required.join(", ")}` : "无必填字段",
      "参数 schema 见：mc-skill " + name + " --help --json",
      "",
    ].join("\n"),
  );
}

async function runDescriptor(params: Record<string, unknown>, positional: string[]): Promise<unknown> {
  const merged = applyPositionalCompat("descriptor", params, positional);
  const desc = typeof merged.descriptor === "string" ? merged.descriptor : undefined;
  if (!desc) {
    throw new CliUsageError("descriptor", "缺少必填参数 descriptor（--descriptor <jniDescriptor>）");
  }
  const name = typeof merged.name === "string" ? merged.name : "method";
  return {
    descriptor: desc,
    returnType: returnType(desc),
    parameterTypes: parameterTypes(desc),
    readableSignature: readableSignature(name, desc),
  };
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  if (argv[0] === "--version" || argv[0] === "-V") {
    process.stdout.write(cliVersion() + "\n");
    return;
  }

  const { flags: rawFlags, positional } = parseFlags(argv);
  const { globals, rest } = extractGlobalFlags(rawFlags);

  if (positional.length === 0 && (rawFlags.version === true || rawFlags.version === "true")) {
    process.stdout.write(cliVersion() + "\n");
    return;
  }

  if (positional.length === 0) {
    if (globals.help || argv[0] === "help") {
      printGlobalHelp(globals.json, globals.compact);
      return;
    }
    printGlobalHelp(globals.json, globals.compact);
    process.exitCode = 2;
    return;
  }

  const userCmd = positional[0];
  const cmdPositional = positional.slice(1);

  if (userCmd === "help") {
    printGlobalHelp(globals.json, globals.compact);
    return;
  }

  if (globals.help) {
    if (userCmd === "list-tools") {
      printToolHelp("list-tools", "列出全部 MCP 工具及其 JSON Schema", z.object({}), globals.json, globals.compact);
      return;
    }
    if (userCmd === "descriptor") {
      printToolHelp(
        "descriptor",
        "解析 JNI 描述符（本地命令，不加载 MCP 工具）",
        descriptorSchema,
        globals.json,
        globals.compact,
      );
      return;
    }
    const { tool: mapped } = mapShortCommand(userCmd);
    const reg = await loadRegistry();
    const entry = toolHandlers.get(mapped) ?? toolHandlers.get(userCmd);
    const listed = reg.listAllToolSchemas().find((t) => t.name === mapped || t.name === userCmd);
    if (!entry && !listed) {
      printJson({ success: false, tool: userCmd, error: `未知命令：${userCmd}` }, globals.compact);
      process.exitCode = 2;
      return;
    }
    const schema = (entry?.inputSchema ?? listed?.inputSchema) as z.ZodTypeAny;
    const description = entry?.description ?? listed?.description ?? "";
    printToolHelp(mapped, description, schema, globals.json, globals.compact);
    return;
  }

  const { tool: mappedTool, inject } = mapShortCommand(userCmd);

  if (cmdPositional.length > 0 && POSITIONAL_COMMANDS.has(userCmd)) {
    process.stderr.write(MIGRATION_NOTICE + "\n");
  }

  try {
    if (userCmd === "list-tools") {
      const reg = await loadRegistry();
      const tools = reg.listAllToolSchemas();
      printJson(
        {
          success: true,
          tool: userCmd,
          result: {
            tools: tools.map((t) => ({
              name: t.name,
              description: t.description,
              parameters: zodToJsonSchema(t.inputSchema),
            })),
            total: tools.length,
          },
        },
        globals.compact,
      );
      return;
    }

    if (userCmd === "descriptor") {
      applyFileSpecs(rest, globals.file, userCmd, descriptorSchema);
      expandFlagFiles(rest, userCmd, { used: false });
      const params = coerceFlags(rest, descriptorSchema, {});
      const result = await runDescriptor(params, cmdPositional);
      printJson({ success: true, tool: userCmd, result }, globals.compact);
      return;
    }

    await loadRegistry();
    const entry = toolHandlers.get(mappedTool);
    if (!entry) {
      throw new CliUsageError(userCmd, `未知命令：${userCmd}`);
    }
    const schema = entry.inputSchema as z.ZodTypeAny;
    applyFileSpecs(rest, globals.file, userCmd, schema);
    expandFlagFiles(rest, userCmd, { used: false });
    const shape = schemaObjectShape(schema);
    if (globals.project) {
      if (shape && "projectPath" in shape) {
        if (rest.projectPath === undefined) rest.projectPath = globals.project;
      } else {
        process.stderr.write(`警告: 该工具不支持 --project（${mappedTool} 无 projectPath 字段）\n`);
      }
    }

    const params = applyPositionalCompat(
      userCmd,
      coerceFlags(rest, schema, inject),
      cmdPositional,
    );
    const parsed = schema.safeParse(params);
    if (!parsed.success) {
      const issues = parsed.error.issues.map((i) => `${i.path.join(".") || "(root)"}：${i.message}`).join("；");
      throw new CliUsageError(userCmd, `参数校验失败：${issues}（可用 list-tools 或 ${userCmd} --help 查看 schema）`);
    }

    await maybeHintDataDir(mappedTool);
    process.stderr.write(`running ${mappedTool}...\n`);
    try {
      const raw = await entry.handler(parsed.data as Record<string, unknown>);
      const { result, isError } = unwrapHandlerResult(raw);
      if (
        result &&
        typeof result === "object" &&
        ((result as { action?: { code?: string } }).action?.code === "DATA_UNAVAILABLE" ||
          (result as { error?: { code?: string } }).error?.code === "DATA_UNAVAILABLE" ||
          (result as { error?: { code?: string } }).error?.code === "PLATFORM_DATA_MISSING")
      ) {
        await maybeHintDataDir(mappedTool);
      }
      const failed = isToolFailure(result, isError, globals.failOnError);
      printJson({ success: !failed, tool: userCmd, result }, globals.compact);
      if (failed) process.exitCode = 1;
    } finally {
      try {
        const { disposeApiData } = await import("./api/index.js");
        disposeApiData();
      } catch {
        /* ignore */
      }
      try {
        const { closeAllYarnDbs } = await import("./mappings/yarn-sqlite.js");
        closeAllYarnDbs();
      } catch {
        /* ignore */
      }
    }
  } catch (err) {
    if (err instanceof UnknownFlagError) {
      printJson({ success: false, tool: userCmd, error: err.message }, globals.compact);
      process.exitCode = 2;
      return;
    }
    if (err instanceof CliUsageError) {
      printJson({ success: false, tool: err.tool, error: err.message }, globals.compact);
      process.exitCode = 2;
      return;
    }
    printJson(
      { success: false, tool: userCmd, error: err instanceof Error ? err.message : String(err) },
      globals.compact,
    );
    process.exitCode = 1;
  }
}

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

export { parseFlags, coerceFlags } from "./cli-parse.js";
