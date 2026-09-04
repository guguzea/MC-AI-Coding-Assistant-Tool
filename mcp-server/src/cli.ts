#!/usr/bin/env node
/**
 * mc-skill CLI — 短名 alias + 全部 MCP 工具通用 dispatch。
 *
 * flags-only（--key value / --key=value / 裸 --key→true），参数类型按各工具的
 * zod inputSchema 驱动转换。输出 JSON 包装 {success, tool, result|error}。
 * 退出码 0=成功 / 1=工具失败 / 2=用法错误。
 * 失败信封另有 errorKind 分类键：usage / validation ↔ exit 2，tool_failure / timeout ↔ exit 1；
 * 成功时该键不出现。分类只加键，不新增第三种退出码。
 *
 * 旧位置参数形式仍兼容（stderr 迁移提示）。descriptor 为本地子命令，不经 MCP registry。
 */
import "./utils/node-sqlite-guard.js"; // 必须保持第一个 import：22.5–22.12 未带 --experimental-sqlite 时先给出指引再退出
import { existsSync, readFileSync, readSync, realpathSync, statSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import * as z from "zod";
import { toolHandlers } from "./tool-handlers.js";
import {
  AmbiguousFlagError,
  applyPositionalCompat,
  canonicalFlagName,
  coerceFlags,
  DATA_DIR_TOOLS,
  expandableFlags,
  extractGlobalFlags,
  fieldOwnedGlobals,
  isToolFailure,
  InvalidBooleanFlagError,
  LEGAL_OUTPUT_FORMATS,
  mapShortCommand,
  MIGRATION_NOTICE,
  parseFlags,
  parseTimeoutMs,
  POSITIONAL_COMMANDS,
  resolveFlagKey,
  schemaObjectShape,
  unusedPositionals,
  UnknownFlagError,
  zodToJsonSchema,
  type CliErrorKind,
  type FlagScalar,
  type RawFlags,
} from "./cli-parse.js";
import { parameterTypes, readableSignature, returnType } from "./utils/descriptor.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE_MAX_BYTES = 8 * 1024 * 1024;

const descriptorSchema = z.object({
  descriptor: z.string().optional(),
  name: z.string().optional(),
});

/** list-tools 是本命令的裁剪开关，不进任何工具 schema；只用于渲染 list-tools --help */
const listToolsSchema = z.object({
  "names-only": z.boolean().optional().describe("只回工具名清单，体积远小于全量 schema"),
  filter: z.string().optional().describe("按工具名或描述做子串过滤（忽略大小写），命中项回完整 schema"),
  tool: z.string().optional().describe("只吐这一个工具的完整 schema"),
});

class CliUsageError extends Error {
  constructor(
    readonly tool: string,
    message: string,
  ) {
    super(message);
  }
}

/** schema 校验失败：仍是 exit 2，但 errorKind 与「敲错 flag 名」区分开 */
class ValidationCliError extends CliUsageError {}

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
  "node mcp-server/dist/cli.js <tool> [--key=value ...] [--project <dir>] [--file field=path] [--raw <field>]",
  "node mcp-server/dist/cli.js --version",
  "node mcp-server/dist/cli.js query --className <className> [--methodName <methodName>] [--version=1.20.1]",
  "node mcp-server/dist/cli.js convert --from=mcp --to=mojang --name=getHealth [--owner=...] [--descriptor=()F]",
  "node mcp-server/dist/cli.js convert_mapping --from obfuscated --to yarn --name er --version 1.20.1",
  "node mcp-server/dist/cli.js descriptor --descriptor=<jniDescriptor> [--name=method]",
  "node mcp-server/dist/cli.js update --action=check|apply [--dry-run=false --confirm]",
  "node mcp-server/dist/cli.js validate_project --project .",
  "node mcp-server/dist/cli.js crash_analyze --crashReport @./crash-reports/latest.txt",
  "值前缀: @path 读文件，@- 或 =- 读 stdin，@@ 是字面 @（--className=@@Override → \"@Override\"）",
  "字面量逃生: --raw <field> 让该字段完全按字面传（连 @- 也不读 stdin）；裸 --raw 或 --raw=true 关闭全部 @ 展开，--raw=false 恢复",
  "字段优先: 工具 schema 里有同名 flag 时该 flag 归工具（validate_bp_json --json '<全文>' 的 json 是参数，不是输出开关）",
  "JSON 恒定: 工具输出始终为 JSON；--json 不改变工具输出，仅为兼容保留，它只在交互式终端下影响 --help 的呈现（人读摘要 → 机器可读 schema）",
  "输出格式: --output-format json 是表达格式意图的规范入口；当前唯一合法值是 json，其它值 exit 2 报「尚未实现」",
  "运行控制: --quiet 静音 stderr 上的进度行（running… 与 --timeout 心跳），错误与警告照旧；--timeout <ms> 给单次工具执行设上限，0 或不设 = 不限",
  "超时: 到点 exit 1 + errorKind timeout（写明是超时不是工具失败）；退出码仍是 0/1/2 三档，只靠 errorKind 细分",
  "仅可承载文本的字段接受 @（string / string[] / object / string 参与的 union）；number / boolean / enum / tuple 原样传",
  "结构化输入: --stdin-json 从 stdin 一次读入整个参数对象（键仍走同一套归一化与 schema 校验，值不做 @ 展开）；同名字段恒为命令行 > 载荷，与 @- / - / =- 同现 → exit 2（stdin 只能有一个所有者）",
  "node mcp-server/dist/cli.js list-tools [--names-only | --filter <kw> | --tool <name>]",
  "node mcp-server/dist/cli.js <任意MCP工具名> --key=value ...",
  "遗留用法（仍兼容，未来移除）: query Item getName / warmup 1.20.1；单连字符 -className 视为漏写 --，报用法错误 exit 2",
];

function printGlobalHelp(json: boolean, compact: boolean): void {
  if (json || !process.stdout.isTTY) {
    printJson({ usage: USAGE_LINES }, compact);
    return;
  }
  process.stdout.write(
    [
      "独立 CLI — 调用全部 MCP 工具（仓库根可运行形式：node mcp-server/dist/cli.js …）",
      "",
      "用法:",
      ...USAGE_LINES.map((l) => `  ${l}`),
      "",
      "全局 flag: --help  --version  --json（不改变工具输出，仅兼容保留）  --output-format json  --compact  --fail-on-error  --quiet  --timeout <ms>  --project <dir>  --file field=path  --raw <field>  --stdin-json",
      "布尔 flag 只接受 true/false/1/0/yes/no/on/off；裸 --flag 为 true；--flag=junk 拒绝（exit 2）",
      "字段优先: 工具 schema 有同名 flag 时归工具（如 validate_bp_json --json '<全文>'）；--output-format 当前只认 json",
      "文件输入: --crashReport @./latest.txt   --crashReport=-   --file crashReport=./latest.txt   @@ 为字面 @   --raw <field> 关闭展开   文件与 stdin 同受 8MB 上限",
      "退出码: 0 成功 / 1 工具失败或超时（errorKind tool_failure | timeout）/ 2 用法错误（errorKind usage | validation）",
      "",
    ].join("\n"),
  );
}

async function printNamedToolHelp(userCmd: string, json: boolean, compact: boolean): Promise<void> {
  if (userCmd === "list-tools") {
    printToolHelp("list-tools", "列出全部 MCP 工具及其 JSON Schema（可 --names-only / --filter / --tool 裁剪）", listToolsSchema, json, compact);
    return;
  }
  if (userCmd === "descriptor") {
    printToolHelp(
      "descriptor",
      "解析 JNI 描述符（本地命令，不加载 MCP 工具）",
      descriptorSchema,
      json,
      compact,
    );
    return;
  }
  const { tool: mapped } = mapShortCommand(userCmd);
  const reg = await loadRegistry();
  const entry = toolHandlers.get(mapped) ?? toolHandlers.get(userCmd);
  const listed = reg.listAllToolSchemas().find((t) => t.name === mapped || t.name === userCmd);
  if (!entry && !listed) {
    printJson({ success: false, tool: userCmd, error: `未知命令：${userCmd}`, errorKind: "usage" }, compact);
    process.exitCode = 2;
    return;
  }
  const schema = (entry?.inputSchema ?? listed?.inputSchema) as z.ZodTypeAny;
  const description = entry?.description ?? listed?.description ?? "";
  printToolHelp(mapped, description, schema, json, compact);
}

async function loadRegistry() {
  return import("./tool-registry.js");
}

function literalHint(field: string): string {
  return `若这是字面量而非文件引用，请改用 @@ 前缀或 --raw ${field}。`;
}

function readLimitedFile(path: string, ctx: ExpandCtx, field: string, rawValue: string): string {
  const where = `字段 ${field} 的值 ${JSON.stringify(rawValue)} → 路径 ${path}`;
  try {
    if (!existsSync(path) || !statSync(path).isFile()) {
      throw new CliUsageError(ctx.tool, `无法读取文件：${where}（不存在或不是普通文件）。${literalHint(field)}`);
    }
    const size = statSync(path).size;
    if (size > FILE_MAX_BYTES) {
      throw new CliUsageError(ctx.tool, `文件超过 8MB 上限：${where}（${size} 字节）。${literalHint(field)}`);
    }
    const content = readFileSync(path, "utf8");
    if (Buffer.byteLength(content, "utf8") > FILE_MAX_BYTES) {
      throw new CliUsageError(ctx.tool, `文件超过 8MB 上限：${where}。${literalHint(field)}`);
    }
    return content;
  } catch (err) {
    if (err instanceof CliUsageError) throw err;
    throw new CliUsageError(ctx.tool, `读取文件失败：${where}（${(err as Error).message}）。${literalHint(field)}`);
  }
}

interface StdinState {
  used: boolean;
}

/** `@` / stdin 展开的作用范围：字段名解析、可承载文本的字段集合、--raw 逃生名单 */
interface ExpandCtx {
  tool: string;
  stdin: StdinState;
  schemaKeys: Set<string>;
  expandable: Set<string> | undefined;
  rawFields: Set<string>;
  rawAll: boolean;
}

function makeExpandCtx(schema: z.ZodTypeAny, rawSpecs: FlagScalar[], tool: string): ExpandCtx {
  const schemaKeys = new Set(Object.keys(schemaObjectShape(schema) ?? {}));
  const expandable = expandableFlags(schema);
  const rawFields = new Set<string>();
  let rawAll = false;
  for (const spec of rawSpecs) {
    if (typeof spec !== "string") {
      rawAll = true;
      continue;
    }
    if (spec === "true" || spec === "false") {
      rawAll = spec === "true";
      continue;
    }
    const field = resolveFlagKey(spec, schemaKeys);
    if (!field) {
      throw new UnknownFlagError(spec, undefined, { tool, knownFlags: [...schemaKeys] });
    }
    rawFields.add(field);
  }
  return { tool, stdin: { used: false }, schemaKeys, expandable, rawFields, rawAll };
}

/**
 * stdin 是唯一没有 stat 前置检查的输入通道，必须自己分块计字节。
 * 与 readLimitedFile 共用 FILE_MAX_BYTES，超限当场报错而不是把内存读完。
 */
function readLimitedStdin(ctx: ExpandCtx, field: string): string {
  const chunks: Buffer[] = [];
  const buf = Buffer.alloc(64 * 1024);
  let total = 0;
  for (;;) {
    let n: number;
    try {
      n = readSync(0, buf, 0, buf.length, null);
    } catch (err) {
      throw new CliUsageError(ctx.tool, `读取 stdin 失败：字段 ${field}（${(err as Error).message}）`);
    }
    if (n === 0) break;
    total += n;
    if (total > FILE_MAX_BYTES) {
      throw new CliUsageError(ctx.tool, `stdin 超过 8MB 上限：字段 ${field}（已读 ${total} 字节）`);
    }
    chunks.push(Buffer.from(buf.subarray(0, n)));
  }
  return Buffer.concat(chunks, total).toString("utf8");
}

/**
 * `--stdin-json`：fd 0 一次读入整个参数对象，作为 flags 的基座（命令行同名恒胜）。
 * 载荷已经是结构化 JSON，所以它的值不再做 @ 展开——否则等于把 D2 复活一遍。
 */
function readStdinJsonPayload(ctx: ExpandCtx, rest: RawFlags, fileSpecs: string[]): Record<string, unknown> {
  const claimants: string[] = [];
  for (const [k, v] of Object.entries(rest)) {
    for (const item of Array.isArray(v) ? v : [v]) {
      if (item === "-" || item === "@-") claimants.push(`--${k}=${item}`);
    }
  }
  for (const spec of fileSpecs) {
    const path = spec.slice(spec.indexOf("=") + 1);
    if (path === "-" || path === "@-") claimants.push(`--file ${spec}`);
  }
  if (claimants.length > 0) {
    throw new CliUsageError(
      ctx.tool,
      `stdin 只能有一个所有者：--stdin-json 与 ${claimants.join(" / ")} 同现。` +
        `整个参数对象用 --stdin-json，单个字段用 @- / - / =-，不要同现。`,
    );
  }
  if (process.stdin.isTTY === true) {
    throw new CliUsageError(ctx.tool, "TTY 下 --stdin-json 会挂起等待输入：请管道喂 JSON，或逐条写 --key=value。");
  }
  const text = readLimitedStdin(ctx, "--stdin-json");
  if (text.trim() === "") {
    throw new CliUsageError(ctx.tool, "stdin 载荷为空（--stdin-json 需要一个 JSON 对象）");
  }
  let payload: unknown;
  try {
    payload = JSON.parse(text);
  } catch (err) {
    throw new CliUsageError(ctx.tool, `stdin 载荷不是合法 JSON（--stdin-json）：${(err as Error).message}`);
  }
  if (payload === null || typeof payload !== "object" || Array.isArray(payload)) {
    throw new CliUsageError(
      ctx.tool,
      `stdin 载荷顶层必须是 JSON 对象（实得 ${Array.isArray(payload) ? "array" : String(payload)}）`,
    );
  }
  const out: Record<string, unknown> = {};
  for (const [rawKey, value] of Object.entries(payload as Record<string, unknown>)) {
    const key = resolveFlagKey(rawKey, ctx.schemaKeys);
    if (!key) {
      throw new UnknownFlagError(rawKey, undefined, { tool: ctx.tool, knownFlags: [...ctx.schemaKeys] });
    }
    out[key] = value;
  }
  return out;
}

function expandStringValue(value: string, ctx: ExpandCtx, field: string): string {
  if (value === "-" || value === "@-") {
    if (ctx.stdin.used) {
      throw new CliUsageError(
        ctx.tool,
        `stdin 只能用一次（字段 ${field} 的值 ${JSON.stringify(value)} 再次要求读 stdin）`,
      );
    }
    if (process.stdin.isTTY === true) {
      throw new CliUsageError(
        ctx.tool,
        `TTY 下不能用 @- / - 读 stdin（字段 ${field}，会挂起等待输入）。请改 --file ${field}=path 或管道输入。`,
      );
    }
    ctx.stdin.used = true;
    return readLimitedStdin(ctx, field);
  }
  if (value.startsWith("@@")) return value.slice(1);
  if (value.startsWith("@")) return readLimitedFile(value.slice(1), ctx, field, value);
  return value;
}

function applyFileSpecs(rest: RawFlags, fileSpecs: string[], ctx: ExpandCtx): void {
  for (const spec of fileSpecs) {
    const eq = spec.indexOf("=");
    if (eq <= 0) {
      throw new CliUsageError(ctx.tool, "--file 需要 field=path 形式（如 --file crashReport=./latest.txt）");
    }
    const rawField = spec.slice(0, eq);
    const field = resolveFlagKey(rawField, ctx.schemaKeys);
    if (!field) {
      throw new UnknownFlagError(rawField, undefined, { tool: ctx.tool, knownFlags: [...ctx.schemaKeys] });
    }
    if (ctx.rawAll || ctx.rawFields.has(field)) {
      throw new CliUsageError(ctx.tool, `--raw 与 --file ${field}= 冲突：--raw 下 ${field} 只会按字面量传入`);
    }
    if (ctx.expandable && !ctx.expandable.has(field)) {
      throw new CliUsageError(
        ctx.tool,
        `--file ${field}：该字段不承载文件内容（number / boolean / enum / tuple 原样传），--file 无意义`,
      );
    }
    const path = spec.slice(eq + 1);
    rest[field] = path === "-" || path.startsWith("@") ? path : `@${path}`;
  }
}

/**
 * 只对「能承载文本」的字段展开 `@` / stdin（expandableFlags 按 schema 类型判定）。
 * 未知 flag 这里跳过：它会在 coerceFlags 那里得到未知参数报错，且展开会先碰文件系统。
 * schema 不是扁平 object 时（expandableFlags 返回 undefined）保持旧行为，全量展开。
 */
function expandFlagFiles(rest: RawFlags, ctx: ExpandCtx): void {
  const gated = ctx.expandable !== undefined;
  for (const [k, v] of Object.entries(rest)) {
    const resolved = gated ? resolveFlagKey(k, ctx.schemaKeys) : k;
    if (gated && !resolved) continue;
    const field = resolved ?? k;
    if (ctx.rawAll || ctx.rawFields.has(field)) continue;
    if (ctx.expandable && !ctx.expandable.has(field)) continue;
    if (Array.isArray(v)) {
      rest[k] = v.map((item) => (typeof item === "string" ? expandStringValue(item, ctx, field) : item));
    } else if (typeof v === "string") {
      rest[k] = expandStringValue(v, ctx, field);
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
    const { hasAnyPlatformData, resolveDataDir } = await import("./utils/path.js");
    if (!hasAnyPlatformData()) {
      process.stderr.write(
        `提示: 本进程实际查阅的数据目录 ${resolveDataDir()} 下没有任何平台数据目录（形如 forge_1.20.1 / fabric_1.21.11）。` +
          `未设置 MC_SKILL_DATA 时该值按安装位置或 cwd 推导；数据仓库在别处请设置 MC_SKILL_DATA 指向其 data 目录。\n`,
      );
    }
  } catch {
    /* ignore */
  }
}

/** 人读摘要只要类型骨架：枚举标 enum，数组带 []，union 用 | 连接，不铺 enum/默认值全文 */
function humanTypeLabel(node: Record<string, unknown>): string {
  if (Array.isArray(node.enum)) return "enum";
  if (typeof node.type === "string") {
    if (node.type === "array") {
      const items = node.items as Record<string, unknown> | unknown[] | undefined;
      if (Array.isArray(items)) return "tuple";
      return items ? `${humanTypeLabel(items)}[]` : "any[]";
    }
    return node.type;
  }
  if (Array.isArray(node.anyOf)) {
    return node.anyOf.map((b) => humanTypeLabel(b as Record<string, unknown>)).join("|");
  }
  return "any";
}

function oneLine(text: unknown, max = 90): string {
  const s = String(text ?? "").replace(/\s+/g, " ").trim();
  return s.length > max ? s.slice(0, max - 1) + "…" : s;
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
  const props = (parameters as { properties?: Record<string, Record<string, unknown>> }).properties ?? {};
  const order = Object.keys(props).sort((a, b) => Number(required.includes(b)) - Number(required.includes(a)));
  const lines = [
    `${name}`,
    description,
    required.length ? `必填: ${required.join(", ")}` : "无必填字段",
    `参数 (${order.length}):`,
  ];
  for (const key of order) {
    const note = oneLine(props[key].description);
    lines.push(`  ${key} (${humanTypeLabel(props[key])})${note ? ` — ${note}` : ""}`);
  }
  lines.push("参数 schema 见：node mcp-server/dist/cli.js " + name + " --help --json", "");
  process.stdout.write(lines.join("\n"));
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

/** 全量清单、--filter 命中、--tool 单查共用同一渲染，避免裁剪路径与清单漂移 */
function toolEntryView(t: { name: string; description: string; inputSchema: z.ZodTypeAny }) {
  return { name: t.name, description: t.description, parameters: zodToJsonSchema(t.inputSchema) };
}

const LIST_TOOLS_FLAGS = ["names-only", "filter", "tool"];

function lastScalar(v: FlagScalar | FlagScalar[] | undefined): FlagScalar | undefined {
  return Array.isArray(v) ? v.at(-1) : v;
}

/** 开关写法：裸 --flag / =true 为开，=false 为关；其它值必须报错，不得静默当成关键词 */
function listToolsSwitch(value: FlagScalar | undefined, flag: string): boolean {
  if (value === undefined || value === false || value === "false") return false;
  if (value === true || value === "true") return true;
  throw new CliUsageError(
    "list-tools",
    `--${flag} 是开关，只接受裸写法或 true/false（收到 ${JSON.stringify(value)}）。想按关键词筛请写 --filter=${String(value)}`,
  );
}

async function runListTools(rest: RawFlags, positional: string[], compact: boolean): Promise<void> {
  const known = LIST_TOOLS_FLAGS.map((f) => canonicalFlagName(f));
  for (const k of Object.keys(rest)) {
    if (!known.includes(canonicalFlagName(k))) {
      throw new UnknownFlagError(k, undefined, { tool: "list-tools", knownFlags: LIST_TOOLS_FLAGS });
    }
  }
  if (positional.length > 0) {
    throw new CliUsageError(
      "list-tools",
      `list-tools 不收位置参数（多余：${positional.join(" ")}）。看单个工具用 --tool=${positional[0]}，按词筛用 --filter=${positional[0]}`,
    );
  }
  const get = (flag: string): FlagScalar | undefined => {
    const want = canonicalFlagName(flag);
    const hit = Object.keys(rest).find((k) => canonicalFlagName(k) === want);
    return hit === undefined ? undefined : lastScalar(rest[hit]);
  };
  const namesOnly = listToolsSwitch(get("names-only"), "names-only");
  const toolArg = get("tool");
  const filterArg = get("filter");

  const reg = await loadRegistry();
  const tools = reg.listAllToolSchemas();

  if (toolArg !== undefined) {
    if (namesOnly || filterArg !== undefined) {
      throw new CliUsageError("list-tools", "list-tools --tool 与 --names-only / --filter 互斥（--tool 只吐单个工具）");
    }
    if (typeof toolArg !== "string") {
      throw new CliUsageError("list-tools", "list-tools --tool 需要工具名（--tool=<name>）");
    }
    const want = mapShortCommand(toolArg).tool;
    const found = tools.find((t) => t.name === want) ?? tools.find((t) => t.name === toolArg);
    if (!found) {
      throw new CliUsageError(
        "list-tools",
        `未知工具：${toolArg}（查看全部名字：node mcp-server/dist/cli.js list-tools --names-only）`,
      );
    }
    printJson({ success: true, tool: "list-tools", result: toolEntryView(found) }, compact);
    return;
  }

  if (filterArg !== undefined && typeof filterArg !== "string") {
    throw new CliUsageError("list-tools", `--filter 需要关键词（--filter=<kw>），收到 ${JSON.stringify(filterArg)}`);
  }
  if (typeof filterArg === "string" && filterArg.trim() === "") {
    throw new CliUsageError("list-tools", "--filter 关键词不能为空（空串会静默命中全部，那不是过滤）");
  }

  let list = tools;
  if (filterArg !== undefined) {
    const q = filterArg.toLowerCase();
    list = tools.filter(
      (t) => t.name.toLowerCase().includes(q) || oneLine(t.description, 100000).toLowerCase().includes(q),
    );
    if (list.length === 0) {
      printJson(
        {
          success: false,
          tool: "list-tools",
          error:
            `无匹配：--filter ${JSON.stringify(filterArg)} 在 ${tools.length} 个工具的名字与描述里都没命中` +
            `（子串、忽略大小写）。查看全部名字：node mcp-server/dist/cli.js list-tools --names-only`,
          errorKind: "tool_failure",
        },
        compact,
      );
      process.exitCode = 1;
      return;
    }
  }

  if (namesOnly) {
    printJson({ success: true, tool: "list-tools", result: { names: list.map((t) => t.name), total: list.length } }, compact);
    return;
  }
  const result: Record<string, unknown> = { tools: list.map(toolEntryView), total: list.length };
  if (filterArg !== undefined) {
    result.query = filterArg;
    result.matched = list.length;
    result.of = tools.length;
  }
  printJson({ success: true, tool: "list-tools", result }, compact);
}

/**
 * 命令名要先于 schema 才知道 `--json` 之类是不是工具字段，而解析阶段没有 schema 可查，
 * 于是先用默认规则做一次纯词法扫描定位 positional[0]，再按声明集合重新解析。
 * 只有该命令声明了字段优先名才会走第二遍，普通命令不付这个钱。
 */
function probeThenParse(argv: string[]): ReturnType<typeof parseFlags> {
  const probe = parseFlags(argv);
  const owned = fieldOwnedGlobals(probe.positional[0]);
  if (!owned) return probe;
  return parseFlags(argv, owned);
}

function outputFormatError(value: FlagScalar | undefined): string | null {
  if (value === undefined) return null;
  if (typeof value !== "string") {
    return `--output-format 需要显式取值（当前唯一合法值：${[...LEGAL_OUTPUT_FORMATS].join(" / ")}）`;
  }
  const normalized = value.toLowerCase();
  if (!LEGAL_OUTPUT_FORMATS.has(normalized)) {
    return `--output-format ${value} 尚未实现；当前唯一合法值是 ${[...LEGAL_OUTPUT_FORMATS].join(" / ")}（CLI 输出只有 JSON）`;
  }
  return null;
}

/** 到点只放弃等待：绝不 process.exit，否则 run 路径 finally 的资源回收不会跑 */
class TimeoutCliError extends Error {
  constructor(
    readonly ms: number,
    readonly tool: string,
  ) {
    super(
      `超时：${tool} 未在 --timeout ${ms}ms 内完成。这是超时，不是工具失败（工具没有产出结果）；` +
        `放宽请调大 --timeout，或不带该 flag（默认不限时长）`,
    );
  }
}

/**
 * 心跳节奏取预算的一半（夹在 50ms..5s）：这样「真的超时了」必然意味着至少吐过一行进度，
 * 长任务则退化成每 5s 一行。上限的存在是防止小时级预算下心跳变成刷屏。
 */
function heartbeatMs(budgetMs: number): number {
  return Math.min(5000, Math.max(50, Math.ceil(budgetMs / 2)));
}

/**
 * 退出纪律（S6）：定时器 unref + 一次性 + finally 清；--timeout 关闭时一个定时器都不建。
 * 心跳只在显式开启 --timeout 后才吐，且受 --quiet 管辖（默认零额外输出）。
 */
async function withRunBudget<T>(
  task: Promise<T>,
  budgetMs: number,
  tool: string,
  quiet: boolean,
): Promise<T> {
  if (budgetMs <= 0) return await task;
  const started = Date.now();
  let timer: ReturnType<typeof setTimeout> | undefined;
  let beat: ReturnType<typeof setInterval> | undefined;
  // 超时后 handler 仍可能 reject；不挂这个 catch 就变成 unhandledRejection，退出码与信封都会失真
  task.catch(() => undefined);
  const guard = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(() => reject(new TimeoutCliError(budgetMs, tool)), budgetMs);
    timer.unref?.();
    if (!quiet) {
      beat = setInterval(() => {
        process.stderr.write(`  … ${tool} 仍在运行 ${Date.now() - started}ms（--timeout ${budgetMs}ms）\n`);
      }, heartbeatMs(budgetMs));
      beat.unref?.();
    }
  });
  try {
    return await Promise.race([task, guard]);
  } finally {
    if (timer) clearTimeout(timer);
    if (beat) clearInterval(beat);
  }
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  if (argv[0] === "--version" || argv[0] === "-V") {
    process.stdout.write(cliVersion() + "\n");
    return;
  }

  const { flags: rawFlags, positional, suspectFlags } = probeThenParse(argv);
  let globals: ReturnType<typeof extractGlobalFlags>["globals"];
  let rest: ReturnType<typeof extractGlobalFlags>["rest"];
  try {
    const extracted = extractGlobalFlags(rawFlags, fieldOwnedGlobals(positional[0]));
    globals = extracted.globals;
    rest = extracted.rest;
  } catch (err) {
    if (err instanceof InvalidBooleanFlagError) {
      printJson({ success: false, tool: positional[0] ?? "cli", error: err.message, errorKind: "usage" }, false);
      process.exitCode = 2;
      return;
    }
    throw err;
  }

  const formatError = outputFormatError(globals.outputFormat);
  if (formatError) {
    printJson({ success: false, tool: positional[0] ?? "cli", error: formatError, errorKind: "usage" }, false);
    process.exitCode = 2;
    return;
  }
  const budget = parseTimeoutMs(globals.timeout);
  if (budget.error) {
    printJson({ success: false, tool: positional[0] ?? "cli", error: budget.error, errorKind: "usage" }, false);
    process.exitCode = 2;
    return;
  }
  const machineHelp = globals.json || globals.outputFormat === "json";

  if (positional.length === 0 && (rawFlags.version === true || rawFlags.version === "true")) {
    process.stdout.write(cliVersion() + "\n");
    return;
  }

  if (positional.length === 0) {
    if (globals.help || argv[0] === "help") {
      printGlobalHelp(machineHelp, globals.compact);
      return;
    }
    printGlobalHelp(machineHelp, globals.compact);
    process.exitCode = 2;
    return;
  }

  const userCmd = positional[0];
  const cmdPositional = positional.slice(1);

  if (userCmd === "help") {
    const helpTarget = cmdPositional[0];
    if (!helpTarget) {
      printGlobalHelp(machineHelp, globals.compact);
      return;
    }
    await printNamedToolHelp(helpTarget, machineHelp, globals.compact);
    return;
  }

  if (globals.help) {
    await printNamedToolHelp(userCmd, machineHelp, globals.compact);
    return;
  }

  // 过了这里才是要真跑命令的路径：pendingRestart marker 仍按旧行为清掉。
  // update 链静态可达 node:sqlite，所以只读早退路径（--version / --help / help <tool>）
  // 不能碰它——否则 `node dist/cli.js --version` 也要付一行 ExperimentalWarning。
  try {
    const { clearPendingRestart } = await import("./update/index.js");
    clearPendingRestart();
  } catch {
    /* 无待重启状态文件时忽略 */
  }

  const { tool: mappedTool, inject } = mapShortCommand(userCmd);

  if (cmdPositional.length > 0 && POSITIONAL_COMMANDS.has(userCmd)) {
    process.stderr.write(MIGRATION_NOTICE + "\n");
  }

  try {
    if (suspectFlags.length > 0) {
      const typed = `-${suspectFlags[0]}`;
      throw new UnknownFlagError(typed.slice(1), typed, { tool: userCmd });
    }

    if (userCmd === "list-tools") {
      if (globals.stdinJson) {
        throw new CliUsageError(userCmd, "list-tools 没有参数对象，不接受 --stdin-json（要裁剪结果请用 --names-only / --filter / --tool）");
      }
      await runListTools(rest, cmdPositional, globals.compact);
      return;
    }

    if (userCmd === "descriptor") {
      const ctx = makeExpandCtx(descriptorSchema, globals.raw, userCmd);
      const payload = globals.stdinJson ? readStdinJsonPayload(ctx, rest, globals.file) : {};
      applyFileSpecs(rest, globals.file, ctx);
      expandFlagFiles(rest, ctx);
      const params = coerceFlags(rest, descriptorSchema, payload, undefined, userCmd);
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
    const ctx = makeExpandCtx(schema, globals.raw, userCmd);
    const payload = globals.stdinJson ? readStdinJsonPayload(ctx, rest, globals.file) : {};
    applyFileSpecs(rest, globals.file, ctx);
    expandFlagFiles(rest, ctx);
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
      coerceFlags(rest, schema, { ...inject, ...payload }, undefined, userCmd),
      cmdPositional,
    );
    const leftover = unusedPositionals(userCmd, cmdPositional);
    if (leftover.length > 0) {
      process.stderr.write(`警告: 忽略多余位置参数: ${leftover.join(" ")}\n`);
    }
    const parsed = schema.safeParse(params);
    if (!parsed.success) {
      const issues = parsed.error.issues.map((i) => `${i.path.join(".") || "(root)"}：${i.message}`).join("；");
      throw new ValidationCliError(userCmd, `参数校验失败：${issues}（可用 list-tools 或 ${userCmd} --help 查看 schema）`);
    }

    await maybeHintDataDir(mappedTool);
    if (!globals.quiet) process.stderr.write(`running ${mappedTool}...\n`);
    try {
      const raw = await withRunBudget(
        Promise.resolve(entry.handler(parsed.data as Record<string, unknown>)),
        budget.ms,
        mappedTool,
        globals.quiet,
      );
      const { result, isError } = unwrapHandlerResult(raw);
      const failed = isToolFailure(result, isError, globals.failOnError);
      printJson(
        { success: !failed, tool: userCmd, result, ...(failed ? { errorKind: "tool_failure" } : {}) },
        globals.compact,
      );
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
    const toolName = positional[0] ?? "cli";
    const compact = globals.compact;
    const isUsage =
      err instanceof UnknownFlagError ||
      err instanceof AmbiguousFlagError ||
      err instanceof InvalidBooleanFlagError ||
      err instanceof CliUsageError;
    const errorKind: CliErrorKind =
      err instanceof TimeoutCliError
        ? "timeout"
        : !isUsage
          ? "tool_failure"
          : err instanceof ValidationCliError
            ? "validation"
            : "usage";
    const envelope: Record<string, unknown> = {
      success: false,
      tool: err instanceof CliUsageError ? err.tool : toolName,
      error: err instanceof Error ? err.message : String(err),
      errorKind,
    };
    if (err instanceof UnknownFlagError) {
      if (err.nearFlags.length > 0) envelope.nearFlags = err.nearFlags;
      if (err.knownFlags.length > 0) envelope.knownFlags = err.knownFlags;
    }
    printJson(envelope, compact);
    process.exitCode = isUsage ? 2 : 1;
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
