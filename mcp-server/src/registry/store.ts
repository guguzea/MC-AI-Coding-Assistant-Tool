import { existsSync } from "fs";
import type { DatabaseSync } from "node:sqlite";
import { openDatabaseSync } from "../utils/sqlite-runtime.js";
import { vanillaRegistrySqlitePath } from "./builder.js";

const _cache = new Map<string, DatabaseSync>();
/** A-7 Y-1：每个损坏库只告警一次（注册表检索会被频繁调用）。 */
const _openWarned = new Set<string>();
/** Y-1 结构化通道：记录「最后一次打开失败」的原因（成功打开即清除），供 queryRegistry 区分「缺数据」与「库损坏」。 */
const _openError = new Map<string, string>();
export const REGISTRY_DB_CAP = 8;

function openRegistryDb(version: string): DatabaseSync | null {
  const path = vanillaRegistrySqlitePath(version);
  if (!existsSync(path)) return null;
  const cached = _cache.get(path);
  if (cached) {
    _cache.delete(path);
    _cache.set(path, cached);
    return cached;
  }
  let db: DatabaseSync | null = null;
  try {
    db = openDatabaseSync(path, { readOnly: true });
    // Y-1：sqlite 的 open 是**惰性成功**——垃圾文件要到首条查询才抛 `file is not a database`
    // （errcode 26）。这里立刻做一次廉价探测查询，把损坏拦截在 open 层（与缺失/损坏的区分才成立）。
    db.prepare("SELECT name FROM sqlite_master LIMIT 1").all();
  } catch (err) {
    // A-7 Y-1（成立）：损坏/不兼容的 sqlite 此前**裸抛** ⇒ 宿主看到的是 tool_failure（像服务坏了），
    // 而 builder.ts:83-86 对同条件是有 catch 的。这里按「本档注册表不可用」降级（每次路径只告警一次）。
    _openError.set(path, (err as Error).message);
    // 打开失败（尤其惰性损坏被探测查询拦下时）句柄可能已建——不 close 会在 Windows 上锁文件
    // （rmSync 报 EBUSY），测试沙盒与换库重试都会被卡住。
    try {
      db?.close();
    } catch {
      /* 句柄本就未建/已关 */
    }
    if (!_openWarned.has(path)) {
      _openWarned.add(path);
      console.warn(`[registry] 打开 registry sqlite 失败，本档注册表按不可用处理: ${path} —— ${(err as Error).message}`);
    }
    return null;
  }
  _openError.delete(path);
  if (db === null) return null; // 不可达（catch 已 return），仅为类型收窄
  _cache.set(path, db);
  while (_cache.size > REGISTRY_DB_CAP) {
    const oldest = _cache.keys().next().value;
    if (oldest === undefined) break;
    const old = _cache.get(oldest);
    _cache.delete(oldest);
    try {
      old?.close();
    } catch {
      /* ignore */
    }
  }
  return db;
}

export interface RegistryMatch {
  registry: string;
  id: string;
  translationKey?: string | null;
}

function rankRegistryMatch(id: string, q: string): number {
  const lower = id.toLowerCase();
  const colon = lower.indexOf(":");
  const path = colon >= 0 ? lower.slice(colon + 1) : lower;
  if (lower === q || lower === `minecraft:${q}`) return 0;
  if (path === q) return 1;
  if (path.startsWith(q + "_") || path.startsWith(q + "/")) return 2;
  if (path.startsWith(q) || path.endsWith("/" + q)) return 3;
  return 4;
}

export interface RegistrySearchResult {
  rows: RegistryMatch[];
  /** L76②：同一 WHERE（exact ∪ like，按行去重前）的**真命中条数**；载荷里以 `totalMatches` 回显 */
  totalMatches: number;
  /** 排序实际看得见多少条（= 取件窗）。`fetchLimit >= totalMatches` ⇒ 排序看的是全池 */
  fetchLimit: number;
}

/**
 * L76②：先 `COUNT(*)` 命中数，命中数不超过本上限就**整批取**（让相关性排序看见全池，
 * 消除「`ORDER BY registry,id LIMIT 窗` 先截、JS 再排序」劫持前 N 名的缺陷）；
 * 只有超过上限才退回放大窗，并由载荷的 `truncated` 点名。
 * 实测 1.20.1 `entries` 全表 **3963** 行（sound_events 1474 / items 1255 / blocks 1003 / …）⇒ 本仓库任何单档查询都落在上限内。
 */
export const REGISTRY_FULL_POOL_CAP = 20_000;

export function searchRegistryEntries(
  version: string,
  registry: string | undefined,
  query: string,
  limit = 25,
): RegistrySearchResult {
  /** 实现层钳制：小数向下取整、非正数按 1（schema 侧另有 .int().min(1).max() 第一道） */
  const take = Math.max(1, Math.floor(limit));
  const db = openRegistryDb(version);
  if (!db) return { rows: [], totalMatches: 0, fetchLimit: 0 };
  const q = query.trim().toLowerCase();
  if (!q) return { rows: [], totalMatches: 0, fetchLimit: 0 };

  // 剥掉 % LIKE 通配符；保留 `_` 并转义为字面量（P3-094）
  const like = `%${q.replace(/%/g, "").replace(/_/g, "\\_")}%`;
  const exactNs = q.includes(":") ? q : `minecraft:${q}`;
  const exactSql = registry
    ? `SELECT registry, id, translation_key AS translationKey FROM entries
         WHERE registry = ? AND (LOWER(id) = ? OR LOWER(id) = ?)`
    : `SELECT registry, id, translation_key AS translationKey FROM entries
         WHERE LOWER(id) = ? OR LOWER(id) = ?`;
  const exactRows = (
    registry
      ? (db.prepare(exactSql).all(registry, q, exactNs) as unknown as RegistryMatch[])
      : (db.prepare(exactSql).all(q, exactNs) as unknown as RegistryMatch[])
  );

  // L76②：真命中数 = 同一条 WHERE 的 union 计数（exact ∪ like），与下面 merged 的集合同义
  const regClause = registry ? "registry = ? AND " : "";
  const regParams: string[] = registry ? [registry] : [];
  const totalMatches = (
    db
      .prepare(
        `SELECT COUNT(*) AS c FROM entries
         WHERE ${regClause}((LOWER(id) = ? OR LOWER(id) = ?)
            OR (LOWER(id) LIKE ? ESCAPE '\\' OR LOWER(COALESCE(translation_key,'')) LIKE ? ESCAPE '\\'))`,
      )
      .get(...regParams, q, exactNs, like, like) as unknown as { c: number }
  ).c;
  const fetchLimit = totalMatches <= REGISTRY_FULL_POOL_CAP ? totalMatches : Math.max(take * 8, 200);
  const likeRows = registry
    ? (db
        .prepare(
          `SELECT registry, id, translation_key AS translationKey FROM entries
         WHERE registry = ? AND (LOWER(id) LIKE ? ESCAPE '\\' OR LOWER(COALESCE(translation_key,'')) LIKE ? ESCAPE '\\')
         ORDER BY registry, id
         LIMIT ?`,
        )
        .all(registry, like, like, fetchLimit) as unknown as RegistryMatch[])
    : (db
        .prepare(
          `SELECT registry, id, translation_key AS translationKey FROM entries
         WHERE LOWER(id) LIKE ? ESCAPE '\\' OR LOWER(COALESCE(translation_key,'')) LIKE ? ESCAPE '\\'
         ORDER BY registry, id
         LIMIT ?`,
        )
        .all(like, like, fetchLimit) as unknown as RegistryMatch[]);

  const seen = new Set(exactRows.map((r) => `${r.registry}\0${r.id}`));
  const merged = [...exactRows];
  for (const r of likeRows) {
    const k = `${r.registry}\0${r.id}`;
    if (seen.has(k)) continue;
    seen.add(k);
    merged.push(r);
  }

  return {
    rows: merged
      .sort((a, b) => {
        const ra = rankRegistryMatch(a.id, q);
        const rb = rankRegistryMatch(b.id, q);
        if (ra !== rb) return ra - rb;
        if (a.id.length !== b.id.length) return a.id.length - b.id.length;
        return a.registry.localeCompare(b.registry) || a.id.localeCompare(b.id);
      })
      .slice(0, take),
    totalMatches,
    fetchLimit,
  };
}

export function listRegistryNames(version: string): string[] {
  const db = openRegistryDb(version);
  if (!db) return [];
  const rows = db.prepare("SELECT DISTINCT registry FROM entries ORDER BY registry").all() as Array<{
    registry: string;
  }>;
  return rows.map((r) => r.registry);
}

export function registryDataAvailable(version: string): boolean {
  return openRegistryDb(version) !== null;
}

/**
 * Y-1（结构化信封）：该档 registry sqlite 的**打开失败原因**；null = 文件缺失或打开正常。
 * 与 `registryDataAvailable` 配合使用可区分「没建索引」与「建了但损坏」。
 */
export function registryOpenError(version: string): string | null {
  openRegistryDb(version); // 触发一次打开，填充/清除 _openError
  const path = vanillaRegistrySqlitePath(version);
  return _openError.get(path) ?? null;
}

export function closeRegistryDbs(): void {
  // 信号处理里调用：一条 close() 抛错不能影响其余句柄（A-19）
  for (const db of _cache.values()) {
    try {
      db.close();
    } catch {
      /* 已关闭或句柄损坏 */
    }
  }
  _cache.clear();
}
