/**
 * node:sqlite 的**运行期**加载入口（审计 NP-5，2026-09-17）。
 *
 * 背景：静态 `import { DatabaseSync } from "node:sqlite"` 的实例化发生在 ESM 的 link 阶段，
 * 早于**任何**用户模块体求值 ⇒ 入口第 1 行的 node-sqlite-guard 拿不到执行机会，22.5–22.12
 * 无 `--experimental-sqlite` 时只能看到 `No such built-in module: node:sqlite` 裸错误，
 * 守卫的醒目横幅不可达（node-sqlite-guard.ts 文件头 F-Z01 适用边界即此）。
 *
 * 现在只保留 `import type`（编译期擦除，不产生 link 期依赖），真取值走本模块：
 * 首次使用时 `createRequire("node:sqlite")`，取模前先跑守卫校验（版本/标志窗口 → 横幅 + exit 1）。
 * 于是 link 阶段不再触碰 node:sqlite，守卫一定先于任何 sqlite 使用执行。
 */
import { createRequire } from "node:module";
import { assertSqliteRuntimeReady } from "./node-sqlite-guard.js";

type NodeSqliteModule = typeof import("node:sqlite");

const requireNodeBuiltin = createRequire(import.meta.url);
let cached: NodeSqliteModule | undefined;

/** 惰性取 node:sqlite 模块（守卫先行；成功后缓存复用，首次调用后与静态导入等价）。 */
export function loadNodeSqlite(): NodeSqliteModule {
  if (!cached) {
    assertSqliteRuntimeReady();
    cached = requireNodeBuiltin("node:sqlite") as NodeSqliteModule;
  }
  return cached;
}

/**
 * `new DatabaseSync(path[, options])` 的唯一入口（保留原构造签名与返回类型）。
 * 各调用点原样传参即可，不做任何语义变化。
 */
export function openDatabaseSync(
  path: string,
  options?: ConstructorParameters<NodeSqliteModule["DatabaseSync"]>[1],
): InstanceType<NodeSqliteModule["DatabaseSync"]> {
  const { DatabaseSync } = loadNodeSqlite();
  return new DatabaseSync(path, options);
}
