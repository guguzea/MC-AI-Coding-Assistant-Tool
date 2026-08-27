/**
 * Node 22.5–22.12 以及 23.0–23.3 的 node:sqlite 需要 --experimental-sqlite
 *（22.13+ / 23.4+ 默认开启）。该区间的 Node 若未带标志，`import "node:sqlite"` 会直接抛
 * `No such built-in module` 裸堆栈。本模块必须作为入口（index.ts / cli.ts）的
 * **第一个 import**（ESM 按导入顺序求值依赖），在任何 sqlite import 之前给出
 * 醒目指引并以非零码退出（F-Z01 运行时兜底）。
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

const origEmitWarning = process.emitWarning.bind(process);
process.emitWarning = ((warning: string | Error, ...rest: unknown[]) => {
  const text = typeof warning === "string" ? warning : warning?.message ?? "";
  const ctorName = typeof warning === "object" && warning && "name" in warning ? String((warning as Error).name) : "";
  const typeName = typeof rest[0] === "string" ? rest[0] : "";
  if (/sqlite/i.test(text) && /ExperimentalWarning/i.test(`${ctorName} ${typeName} ${text}`)) {
    return;
  }
  return (origEmitWarning as (...a: unknown[]) => void)(warning, ...rest);
}) as typeof process.emitWarning;

export {};
