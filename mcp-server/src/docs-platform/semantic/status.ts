/**
 * 语义索引可用性探测（轻量 existsSync / 只读 sqlite meta，不加载嵌入模型）。
 */
import { existsSync, readdirSync, statSync } from "fs";
import { join } from "path";
import { DatabaseSync } from "node:sqlite";
import { EMBEDDING_MODEL } from "./embeddings.js";
import { semanticDbPath } from "./search.js";
import { isSemanticIndexStale } from "./fingerprint.js";

export type SemanticModeHint = "hybrid" | "fts5-only" | "l0-only";

export interface SemanticSample {
  platform: string;
  version: string;
  source: string;
  dbPath: string;
  exists: boolean;
  docs?: number;
  chunks?: number;
  embedded?: number;
  mode: "hybrid" | "fts5-only" | "missing";
  stale?: boolean;
  staleReason?: string;
}

export interface SemanticIndexStatus {
  modelsReady: boolean;
  modelsPath: string;
  embeddingModel: string;
  modeHint: SemanticModeHint;
  samples: SemanticSample[];
  presentCount: number;
  hybridCount: number;
  fts5OnlyCount: number;
  /** 缺库 / 缺模型时非空；缺库不抛错但必须 warning */
  /** 缺库 / 缺模型 / 索引过期时非空 */
  warnings: string[];
  staleCount: number;
}

const SAMPLE_TARGETS: Array<{ platform: string; version: string; source: string }> = [
  { platform: "forge", version: "1.20.1", source: "forge-docs" },
  { platform: "fabric", version: "1.20.1", source: "fabric-docs" },
  { platform: "fabric", version: "1.20.1", source: "fabric-wiki" },
  { platform: "neoforge", version: "1.20.4", source: "neoforge-docs" },
  { platform: "neoforge", version: "1.21.1", source: "neoforge-docs" },
  { platform: "quilt", version: "1.20.1", source: "quilt-docs" },
  { platform: "bedrock", version: "stable", source: "bedrock-docs" },
];

function modelsDirReady(dataRoot: string): boolean {
  const root = join(dataRoot, "_models", "Xenova", "all-MiniLM-L6-v2");
  if (!existsSync(root)) return false;
  // tokenizer + config 存在即视为可加载（onnx 权重可能较大，存在即可）
  return (
    existsSync(join(root, "config.json")) &&
    existsSync(join(root, "tokenizer.json"))
  );
}

function inspectDb(dbPath: string): Pick<SemanticSample, "docs" | "chunks" | "embedded" | "mode"> & {
  builtAt?: string;
  fingerprint?: string;
} {
  if (!existsSync(dbPath)) return { mode: "missing" };
  try {
    const db = new DatabaseSync(dbPath, { readOnly: true });
    const meta = (key: string) => {
      const row = db.prepare("SELECT value FROM meta WHERE key = ?").get(key) as
        | { value: string }
        | undefined;
      return row?.value;
    };
    const docs = Number(meta("docs") ?? 0);
    const chunks = Number(meta("chunks") ?? 0);
    let embedded = Number(meta("embedded") ?? 0);
    if (!embedded) {
      try {
        const row = db.prepare("SELECT COUNT(*) AS n FROM chunk_embeddings").get() as { n: number };
        embedded = Number(row?.n ?? 0);
      } catch {
        embedded = 0;
      }
    }
    const builtAt = meta("built_at");
    const fingerprint = meta("source_fingerprint");
    db.close();
    return {
      docs,
      chunks,
      embedded,
      builtAt,
      fingerprint,
      mode: embedded > 0 ? "hybrid" : chunks > 0 || docs > 0 ? "fts5-only" : "missing",
    };
  } catch {
    return { mode: "missing" };
  }
}

/** 扫描 dataRoot 下各文档树旁的 semantic/db.sqlite（轻量，供 diagnose） */
export function listSemanticDbPresence(dataRoot: string): Array<{
  platform: string;
  version: string;
  source: string;
  path: string;
  exists: boolean;
}> {
  const out: Array<{ platform: string; version: string; source: string; path: string; exists: boolean }> = [];
  if (!existsSync(dataRoot)) return out;
  const sourcesByPrefix: Record<string, string[]> = {
    forge_: ["forge-docs"],
    fabric_: ["fabric-docs", "fabric-wiki"],
    neoforge_: ["neoforge-docs"],
    quilt_: ["quilt-docs"],
    liteloader_: ["liteloader-docs"],
    rift_: ["rift-docs"],
    modloader_: ["modloader-docs"],
    bedrock_: ["bedrock-docs"],
  };
  let entries: string[] = [];
  try {
    entries = readdirSync(dataRoot).filter((n) => {
      try {
        return statSync(join(dataRoot, n)).isDirectory();
      } catch {
        return false;
      }
    });
  } catch {
    return out;
  }
  for (const name of entries) {
    for (const [prefix, sources] of Object.entries(sourcesByPrefix)) {
      if (!name.startsWith(prefix)) continue;
      const platform = prefix.slice(0, -1);
      const version = name.slice(prefix.length);
      if (!version) continue;
      if (!/^\d/.test(version) && version !== "stable") continue;
      for (const source of sources) {
        const sourceDir = join(dataRoot, name, source);
        if (!existsSync(sourceDir)) continue;
        const dbPath = semanticDbPath(dataRoot, platform, version, source);
        out.push({
          platform,
          version,
          source,
          path: dbPath,
          exists: existsSync(dbPath),
        });
      }
    }
  }
  return out;
}

/** 规范：语义库缺失必须 warning（不抛错、不假装 hybrid） */
export function buildSemanticWarnings(opts: {
  present: number;
  total: number;
  modelsReady: boolean;
  missingSamples?: Array<{ platform: string; version: string; source: string }>;
}): string[] {
  const warnings: string[] = [];
  if (opts.total <= 0) {
    warnings.push(
      "未扫描到任何文档树旁的 semantic/db.sqlite 探测点（可能尚未下载平台数据包）。search_*_docs 仅 L0。",
    );
    return warnings;
  }
  if (opts.present < opts.total) {
    const miss = opts.total - opts.present;
    const extra = opts.missingSamples
      ?.slice(0, 8)
      .map((s) => `${s.platform}_${s.version}/${s.source}`)
      .join(", ");
    warnings.push(
      `语义索引缺库：${opts.present}/${opts.total} 个 db.sqlite 存在（缺 ${miss}）${extra ? `，例如 ${extra}` : ""}。缺库版本的 search_*_docs 回退 L0。补齐：在 mcp-server 执行 npm run build:semantic-index`,
    );
  }
  if (!opts.modelsReady) {
    warnings.push(
      "嵌入模型未就绪（data/_models/Xenova/all-MiniLM-L6-v2），即使有语义库也只能 FTS5 而非 hybrid。可执行 npm run fetch:embedding-model",
    );
  }
  return warnings;
}

export function missingSemanticDbWarning(missing: boolean): string | undefined {
  if (!missing) return undefined;
  return "语义索引缺库，本次已回退 L0 关键词检索。详见 diagnose_data_paths.semantic.warnings；补齐可运行 npm run build:semantic-index";
}

/** search_docs 命中带 stale warning（不静默重建） */
export function semanticStaleSearchWarning(
  dataRoot: string,
  platform: string,
  version: string,
  source: string,
): string | undefined {
  const dbPath = semanticDbPath(dataRoot, platform, version, source);
  if (!existsSync(dbPath)) return undefined;
  const info = inspectDb(dbPath);
  if (info.mode === "missing") return undefined;
  const versionDir = join(dataRoot, `${platform}_${version}`, source, version);
  const stale = isSemanticIndexStale({
    builtAtIso: info.builtAt,
    storedFingerprint: info.fingerprint,
    versionDir,
  });
  if (!stale.stale) return undefined;
  return `语义索引过期（stale）${stale.reason ? `：${stale.reason}` : ""}。命中可能不是最新 processed/。请运行 npm run build:semantic-index -- --platform=${platform} --version=${version} --force`;
}

export function getSemanticIndexStatus(dataRoot: string): SemanticIndexStatus {
  const modelsPath = join(dataRoot, "_models");
  const modelsReady = modelsDirReady(dataRoot);
  const samples: SemanticSample[] = SAMPLE_TARGETS.filter((t) =>
    existsSync(join(dataRoot, `${t.platform}_${t.version}`, t.source)),
  ).map((t) => {
    const dbPath = semanticDbPath(dataRoot, t.platform, t.version, t.source);
    const info = inspectDb(dbPath);
    const versionDir = join(dataRoot, `${t.platform}_${t.version}`, t.source, t.version);
    const staleInfo =
      info.mode === "missing"
        ? { stale: false as const }
        : isSemanticIndexStale({
            builtAtIso: info.builtAt,
            storedFingerprint: info.fingerprint,
            versionDir,
          });
    return {
      ...t,
      dbPath,
      exists: info.mode !== "missing",
      docs: info.docs,
      chunks: info.chunks,
      embedded: info.embedded,
      mode: info.mode,
      stale: staleInfo.stale,
      staleReason: staleInfo.reason,
    };
  });
  const presentCount = samples.filter((s) => s.exists).length;
  const hybridCount = samples.filter((s) => s.mode === "hybrid").length;
  const fts5OnlyCount = samples.filter((s) => s.mode === "fts5-only").length;
  const staleCount = samples.filter((s) => s.stale).length;
  let modeHint: SemanticModeHint = "l0-only";
  if (hybridCount > 0 && modelsReady) modeHint = "hybrid";
  else if (presentCount > 0) modeHint = "fts5-only";
  else modeHint = "l0-only";
  const presence = listSemanticDbPresence(dataRoot);
  const presentAll = presence.filter((s) => s.exists).length;
  const missingSamples = presence.filter((s) => !s.exists);
  const warnings = buildSemanticWarnings({
    present: presence.length > 0 ? presentAll : presentCount,
    total: presence.length > 0 ? presence.length : samples.length,
    modelsReady,
    missingSamples: presence.length > 0 ? missingSamples : samples.filter((s) => !s.exists),
  });
  for (const s of samples.filter((x) => x.stale)) {
    warnings.push(
      `语义索引过期（stale）：${s.platform}_${s.version}/${s.source}${s.staleReason ? `（${s.staleReason}）` : ""}。processed/ 新于 sqlite 或指纹不一致。请运行 npm run build:semantic-index -- --platform=${s.platform} --version=${s.version} --force`,
    );
  }
  return {
    modelsReady,
    modelsPath,
    embeddingModel: EMBEDDING_MODEL,
    modeHint,
    samples,
    presentCount,
    hybridCount,
    fts5OnlyCount,
    staleCount,
    warnings,
  };
}
