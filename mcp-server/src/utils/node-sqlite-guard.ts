/**
 * Node 22.5–22.12 以及 23.0–23.3 的 node:sqlite 需要 --experimental-sqlite
 *（22.13+ / 23.4+ 默认开启）。该区间的 Node 若未带标志，`import "node:sqlite"` 会直接抛
 * `No such built-in module` 裸堆栈。本模块必须作为入口（index.ts / cli.ts）的
 * **第一个 import**（ESM 按导入顺序求值依赖），在任何 sqlite import 之前给出
 * 醒目指引并以非零码退出（F-Z01 运行时兜底）。
 *
 * F-Z01 的适用边界（实测，Node v22.18.0）：静态 `import "node:sqlite"` 的实例化发生在
 * `ModuleJob._link` 阶段，早于**任何**用户模块体求值，因此守卫体里的 console.error +
 * process.exit 无法抢在它前面 —— 同构复现：入口写 `import "./guard.mjs"; import "./不存在.mjs";`
 * 时守卫体的输出一行都不会出现（link 报错先抛）。守卫真正覆盖的是 sqlite 经**动态** import
 * 或运行期再次 emit 的警告（见本文件末尾与 test-decompile.mjs 的 D-53 子进程用例）。
 * 要把链接期那一行也消掉，只有两条路：进程级 `--disable-warning=ExperimentalWarning`，
 * 或把 sqlite 边界改成动态 import —— 两者都改动用户可见签名，本波不做。
 */
const parts = process.versions.node.split(".").map(Number);
const major = parts[0] ?? 0;
const minor = parts[1] ?? 0;

if (major < 22 || (major === 22 && minor < 5)) {
  // eslint-disable-next-line no-console
  console.error(
    [
      "",
      "==================================================================",
      "  当前 Node.js " + process.versions.node + " 低于本项目要求（需要 >= 22.5）",
      "  内置 node:sqlite 从 22.5 起可用；22.5–22.12 还需 --experimental-sqlite。",
      "",
      "  请升级到 Node 22.13+ / 24 LTS 后再启动 MCP/CLI。",
      "  详见仓库 README「快速开始」与 AUTO_SETUP.md 前置条件。",
      "==================================================================",
      "",
    ].join("\n"),
  );
  process.exit(1);
}

const inSqliteFlagWindow =
  (major === 22 && minor >= 5 && minor <= 12) || (major === 23 && minor <= 3);
const hasSqliteFlag =
  process.execArgv.includes("--experimental-sqlite") ||
  /(^|\s)--experimental-sqlite(\s|=|$)/.test(process.env.NODE_OPTIONS ?? "");

if (inSqliteFlagWindow && !hasSqliteFlag) {
  // eslint-disable-next-line no-console
  console.error(
    [
      "",
      "==================================================================",
      "  当前 Node.js " + process.versions.node + " 的 node:sqlite 需要 --experimental-sqlite 标志",
      "  （22.13+ / 23.4+ 默认开启，无需手动添加；22.5–22.12 与 23.0–23.3 必须加标志）",
      "",
      "  两种解法（任选其一）：",
      "  1. 升级 Node 到 22.13+ / 24 LTS（推荐）",
      "  2. 启动时加标志，例如：",
      "     node --experimental-sqlite dist/index.js",
      "     或设置环境变量 NODE_OPTIONS=--experimental-sqlite 后再启动 MCP/CLI",
      "",
      "  详见仓库 README「快速开始」与 AUTO_SETUP.md 前置条件。",
      "==================================================================",
      "",
    ].join("\n"),
  );
  process.exit(1);
}

/**
 * 抑制**运行期**经 `process.emitWarning` 抵达的 node:sqlite ExperimentalWarning（D-53）。
 * 链接期那一行不归本补丁管，原因见文件头 F-Z01 适用边界。
 *
 * 旧条件 `/sqlite/i.test(text) && /ExperimentalWarning/i.test(\`${ctorName} ${typeName} ${text}\`)`
 * 的第二条腿把**自由文本**也算进类型判定：任何 message 里恰好出现「ExperimentalWarning」
 * 字样的警告都会被静默吞掉（例如第三方库转述本警告、或 `--trace-warnings` 提示串）。
 * 现在两侧各自只看自己的结构化槽位：
 * - 类型槽：`warning.code` / `warning.name` / `warning.constructor.name`
 *   / `emitWarning` 的第 2、3 位置参数 / options 的 `type`、`code` —— **全等**比较，不做子串；
 * - 正文槽：首参字符串 / `warning.message` / `warning.detail` / options 形态的 `detail`
 *   —— 只在这里找 sqlite。
 * 两槽都命中才抑制；类型命中但 detail/message 不提 sqlite 的 ExperimentalWarning 照常打印。
 *
 * 实测（Node v22.18.0）`import("node:sqlite")` 的调用形态是
 * `emitWarning("SQLite is an experimental feature and might change at any time", "ExperimentalWarning", null, null)`。
 */
const EXPERIMENTAL_WARNING_TYPE = "ExperimentalWarning";
const SQLITE_BODY_RE = /sqlite/i;

function warningTypeSlots(warning: string | Error | null | undefined, rest: unknown[]): string[] {
  const slots: string[] = [];
  if (typeof warning === "object" && warning) {
    const w = warning as { code?: unknown; name?: unknown; constructor?: { name?: unknown } };
    if (typeof w.code === "string") slots.push(w.code);
    if (typeof w.name === "string") slots.push(w.name);
    if (typeof w.constructor?.name === "string") slots.push(w.constructor.name);
  }
  // process.emitWarning(msg, type, code, ctor) / (msg, { type, code, detail })
  const first = rest[0];
  if (typeof first === "string") slots.push(first);
  else if (first && typeof first === "object") {
    const o = first as { type?: unknown; code?: unknown };
    if (typeof o.type === "string") slots.push(o.type);
    if (typeof o.code === "string") slots.push(o.code);
  }
  const second = rest[1];
  if (typeof second === "string") slots.push(second);
  return slots;
}

function warningBodySlots(warning: string | Error | null | undefined, rest: unknown[]): string {
  const parts: string[] = [];
  if (typeof warning === "string") parts.push(warning);
  else if (warning && typeof warning === "object") {
    const w = warning as { message?: unknown; detail?: unknown };
    if (typeof w.message === "string") parts.push(w.message);
    if (typeof w.detail === "string") parts.push(w.detail);
  }
  // `emitWarning(msg, { type, code, detail })` 形态：detail 挂在 options 上而非 warning 实例，
  // 不补这一槽就会漏判（正文含 sqlite 的 options 形态警告照样打印出来）。
  const opts = rest[0];
  if (opts && typeof opts === "object") {
    const d = (opts as { detail?: unknown }).detail;
    if (typeof d === "string") parts.push(d);
  }
  return parts.join(" ");
}

const origEmitWarning = process.emitWarning.bind(process);
process.emitWarning = ((warning: string | Error, ...rest: unknown[]) => {
  const isExperimental = warningTypeSlots(warning, rest).some((s) => s === EXPERIMENTAL_WARNING_TYPE);
  if (isExperimental && SQLITE_BODY_RE.test(warningBodySlots(warning, rest))) {
    return;
  }
  return (origEmitWarning as (...a: unknown[]) => void)(warning, ...rest);
}) as typeof process.emitWarning;

export {};
