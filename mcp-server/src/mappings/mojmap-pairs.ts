/**
 * 「mojmap 可读名」的第二档出处（2026-09-27 用户裁定：`from=mojang` 的 NOT_FOUND 会教人断言「该版本没有这个类」）。
 *
 * 表是**派生件**，不是上游原样拷贝：Mojang `client.txt` ⋈ `data/fabric_<v>/mappings/yarn-mappings.sqlite`
 * 的 obf 短名 join 得出，逐件 sha 钉在 `yarn-mojmap-pairs-provenance.json`；原始 `client.txt` 仍不入库。
 * 只含**类名三列**（obf / mojmap / yarn + 两侧 FQCN），所以：
 *  · 只在 SQLite 那条路**已经查过且未命中**之后点查（现有成功路径逐字不变，零回归面）；
 *  · 只答 pairs 真有的两档 —— `to=yarn` 给 yarnFqcn、`to=obfuscated` 给 obf 短名；`to=intermediary` 答不了（表里没这列）；
 *  · 一个 mojmap 短名在同档可有多条（1.21.11 现扫 9658 个短名里 26 个 >1）⇒ **绝不猜**，返回 ambiguous + 逐条候选。
 */
import { existsSync, readFileSync } from "node:fs";
import { resolveDataDir } from "../utils/path.js";

export interface MojmapPairRow {
  obf: string;
  mojmap: string;
  yarn: string;
  mojFqcn: string;
  yarnFqcn: string;
}

export type PairsLookup =
  | { status: "hit"; row: MojmapPairRow; table: string; total: number }
  | { status: "ambiguous"; rows: MojmapPairRow[]; table: string; total: number }
  | { status: "miss"; table: string; total: number }
  | { status: "no-table"; reason: string };

interface PairsIndexEntry {
  file: string;
  count: number;
  crossMapping?: number;
  source?: string;
  yarnSource?: string;
}

const DIR = "_yarn-mojmap-pairs";
const indexCache = new Map<string, Record<string, PairsIndexEntry> | null>();
const rowsCache = new Map<string, MojmapPairRow[] | null>();

function loadIndex(): Record<string, PairsIndexEntry> | null {
  if (indexCache.has("index")) return indexCache.get("index") ?? null;
  let out: Record<string, PairsIndexEntry> | null = null;
  try {
    const p = resolveDataDir(DIR, "index.json");
    if (existsSync(p)) {
      const j = JSON.parse(readFileSync(p, "utf8")) as { versions?: Record<string, PairsIndexEntry> };
      if (j && typeof j.versions === "object" && j.versions !== null) out = j.versions;
    }
  } catch {
    out = null;
  }
  indexCache.set("index", out);
  return out;
}

function loadRows(version: string): { rows: MojmapPairRow[]; table: string } | null {
  if (rowsCache.has(version)) {
    const cached = rowsCache.get(version);
    return cached ? { rows: cached, table: `${DIR}/${version}` } : null;
  }
  let out: { rows: MojmapPairRow[]; table: string } | null = null;
  const entry = loadIndex()?.[version];
  if (entry?.file) {
    try {
      const p = resolveDataDir(DIR, entry.file);
      if (existsSync(p)) {
        const j = JSON.parse(readFileSync(p, "utf8")) as { pairs?: MojmapPairRow[] };
        if (Array.isArray(j.pairs)) {
          out = { rows: j.pairs, table: entry.file };
          rowsCache.set(version, j.pairs);
        }
      }
    } catch {
      out = null;
    }
  }
  if (!out) rowsCache.set(version, null);
  return out;
}

/** 本档第二档表在哪个文件上（给 note 与门用）；不在盘返回 null。 */
export function mojmapPairsTable(version: string): string | null {
  return loadRows(version)?.table ?? null;
}

/** 该档第二档表的条目数（门用它核「index 自述 count ↔ 真行数」）；不在盘返回 null。 */
export function mojmapPairsCount(version: string): number | null {
  const hit = loadRows(version);
  if (!hit) return null;
  const declared = loadIndex()?.[version]?.count;
  return typeof declared === "number" ? declared : hit.rows.length;
}

/**
 * from=mojang 的类名点查。`name` 可以是 mojmap 短名（`Container`）或点分 FQCN
 * （`net.minecraft.world.Container`）—— 两侧格式不同（mojFqcn 用点，yarnFqcn 用斜杠），按点分匹配。
 */
export function lookupMojmapClassPair(version: string, name: string, to: string): PairsLookup {
  if (to !== "yarn" && to !== "obfuscated") {
    return { status: "no-table", reason: `第二档对照表只含 obf／mojmap／yarn 三列，答不了 to=${to}（要 intermediary 请走 SQLite 那条路）` };
  }
  const hit = loadRows(version);
  if (!hit) {
    return { status: "no-table", reason: `本档没有派生对照表（${DIR}/yarn-mojmap-${version}.json 不在盘或不可读）` };
  }
  const dotted = name.includes(".");
  const rows = hit.rows.filter((r) => (dotted ? r.mojFqcn === name : r.mojmap === name));
  if (rows.length === 1) return { status: "hit", row: rows[0], table: hit.table, total: hit.rows.length };
  if (rows.length > 1) return { status: "ambiguous", rows, table: hit.table, total: hit.rows.length };
  return { status: "miss", table: hit.table, total: hit.rows.length };
}
