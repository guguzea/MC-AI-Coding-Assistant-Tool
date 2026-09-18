/**
 * 统一数据根解析（审计 NP-6，2026-09-17）。
 *
 * 优先级：`--data-root=<dir>`（也接受 `--data-root <dir>`）> 环境变量 `MC_SKILL_DATA` > `<repo>/data`。
 * 与 mcp-server 的 TS 侧 `resolveDataDir()` 同口径（CLI/MCP 用那份），供 scripts/ 下的
 * 抓取/处理脚本共用 —— provision-26x-docs.mjs 的删除段与抓取段因此落在同一个数据根上，
 * 不再出现「删除段进沙盒、抓取段写真 data/」的半截沙盒。
 */
import { dirname, isAbsolute, join, resolve } from "path";
import { fileURLToPath } from "url";

const HERE = dirname(fileURLToPath(import.meta.url)); // <repo>/mcp-server/scripts/_lib
export const REPO_ROOT = resolve(HERE, "..", "..", "..");
export const DEFAULT_DATA_DIR = join(REPO_ROOT, "data");

const DATA_ROOT_USAGE =
  "用法：--data-root <dir> 或 --data-root=<dir>（如 --data-root=./sandbox-data）；也可用环境变量 MC_SKILL_DATA。<dir> 不能为空、也不能以 - 开头。";

/** 从 argv 里取 --data-root（等号或空格两种写法）。未指定 ⇒ undefined（未指定 ≠ 指定了无效值）；
 *  指定但无有效值（缺值 / --data-root= 空 / 取值以 - 开头）⇒ 抛错（C20 fail-closed，不回落默认）。 */
export function parseDataRootArg(argv = process.argv.slice(2)) {
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--data-root") {
      const v = argv[i + 1];
      if (v === undefined || v === "" || v.startsWith("-")) {
        throw new Error(`--data-root 缺少有效取值（收到「${v ?? "(无)"}」）。${DATA_ROOT_USAGE}`);
      }
      return v;
    }
    if (a.startsWith("--data-root=")) {
      const v = a.slice("--data-root=".length);
      if (v === "" || v.startsWith("-")) {
        throw new Error(`--data-root= 取值无效（收到「${v}」）。${DATA_ROOT_USAGE}`);
      }
      return v;
    }
  }
  return undefined;
}

/** 解析数据根（相对路径按 cwd 解析；都缺省时回 <repo>/data）。参数无效时抛错，不回落默认。 */
export function resolveDataRoot(argv = process.argv.slice(2)) {
  const fromArg = parseDataRootArg(argv);
  if (fromArg && String(fromArg).trim()) {
    const v = String(fromArg).trim();
    return isAbsolute(v) ? v : resolve(v);
  }
  const env = (process.env.MC_SKILL_DATA ?? "").trim();
  if (env) return isAbsolute(env) ? env : resolve(env);
  return DEFAULT_DATA_DIR;
}
