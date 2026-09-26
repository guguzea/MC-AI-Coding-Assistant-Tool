/**
 * 数据目录解析工具
 *
 * 本文件解决 MCP Server 运行时数据目录定位问题。
 * 策略（按可靠性从高到低）：
 * 1. MC_SKILL_DATA 环境变量
 * 2. import.meta.url 推导（运行时）
 * 3. process.cwd() 回退
 */

import { existsSync, readdirSync, readFileSync, statSync } from "fs";
import { homedir } from "os";
import { join, dirname, resolve, relative, isAbsolute } from "path";
import { fileURLToPath } from "url";
import {
  getSemanticIndexStatus,
  listSemanticDbPresence,
  buildSemanticWarnings,
  isIntentionallyClearedTree,
  inspectSemanticDb,
} from "../docs-platform/semantic/status.js";
import { semanticDbPath } from "../docs-platform/semantic/search.js";

function getSelfDir(): string {
  try {
    return dirname(fileURLToPath(import.meta.url));
  } catch {
    return process.cwd();
  }
}

function getDataDirFromSelf(): string {
  // 推导 data 目录：
  // - dist/utils/path.js → dist/utils/ → dist/ → mcp-server/ → MC_skill/ → data/
  const selfDir = getSelfDir();
  return join(selfDir, "..", "..", "..", "data");
}

let warnedMissingDataEnv = false;
/** G-2：MC_SKILL_DATA 已设但目录暂不存在（半交换/未下载）时只告警一次。 */
let warnedMissingDataDir = false;

function getDataDirFromEnv(): string | null {
  const envPath = process.env.MC_SKILL_DATA;
  if (!envPath) {
    if (!warnedMissingDataEnv) {
      warnedMissingDataEnv = true;
      console.error(
        "[mc-mcp-server] WARN: 未设置 MC_SKILL_DATA，将尝试从安装路径或 cwd 推导 data/。" +
          "推荐设置 MC_SKILL_DATA 为 data 目录的绝对路径。",
      );
    }
    return null;
  }
  const abs = resolve(envPath);
  // G-2（sweep81）：**不再要求目录存在**。半交换态（`data/` 缺失）恰恰是「存在性检查」失效的场景 ——
  // 那时 existsSync(abs) 为假 ⇒ 回退 `<cwd>/data`，于是 update 的 `recoverPartialSwap` 去找**错位置**
  // 的 `data.prev`（C5 自愈不可达），apply 还可能把数据写到别处。用户显式声明的根必须以它为准；
  // 「目录不存在」由下游按「数据不可用」处理（各工具本就逐一 existsSync / found 判定）。
  if (!existsSync(abs) && !warnedMissingDataDir) {
    warnedMissingDataDir = true;
    console.error(
      `[mc-mcp-server] WARN: MC_SKILL_DATA=${envPath} 当前不存在，仍按该路径解析（未下载 / 半交换残留）。` +
        `若这不是你想要的根，请设为 data 目录的绝对路径（例如 D:/MC_skill/data）。`,
    );
  }
  return abs;
}

function getDataDirFromCwd(): string {
  return join(process.cwd(), "data");
}

function getRepoRootFromSelf(): string {
  // dist/utils → dist → mcp-server → repo root
  return join(getSelfDir(), "..", "..", "..");
}

/** 仓库根目录（含 forge/、data/、community_knowledge/） */
export function resolveRepoRoot(): string {
  return getRepoRootFromSelf();
}

/**
 * Windows 长路径前缀（\\?\）。非 win32 原样返回。
 * UNC 用 \\?\UNC\server\share。已带前缀的路径不重复添加。
 */
export function winLongPath(p: string): string {
  if (process.platform !== "win32") return p;
  if (p.startsWith("\\\\?\\")) return p;
  const abs = resolve(p);
  if (abs.startsWith("\\\\")) return `\\\\?\\UNC\\${abs.slice(2)}`;
  return `\\\\?\\${abs}`;
}

/** candidate 必须落在 root 内：relative() 不得以 `..` 开头，也不得是绝对路径。 */
export function isResolvedInside(root: string, candidate: string): boolean {
  const rel = relative(resolve(root), resolve(candidate));
  if (!rel) return true;
  return !rel.startsWith("..") && !isAbsolute(rel);
}

/**
 * 工具缓存根（更新状态、反编译产物）。不写仓库 data/。
 * 优先级：MC_SKILL_CACHE → Win %APPDATA%/mc-skill-cache → ~/.config/mc-skill-cache
 */
export function resolveCacheRoot(): string {
  const env = process.env.MC_SKILL_CACHE;
  if (env) return isAbsolute(env) ? env : resolve(env);
  if (process.platform === "win32") {
    const appData = process.env.APPDATA;
    if (appData) return join(appData, "mc-skill-cache");
    return join(homedir(), "mc-skill-cache");
  }
  return join(homedir(), ".config", "mc-skill-cache");
}

/**
 * 解析数据目录路径（外部调用接口）
 * 按以下优先级：
 * 1. MC_SKILL_DATA 环境变量
 * 2. 从 import.meta.url 推导
 * 3. process.cwd()/data
 *
 * @param subpaths  可选子路径，join 到数据根目录之后
 *                  示例：resolveDataDir("forge_1.20.1", "extracted") → data/forge_1.20.1/extracted
 *
 * C-3（2026-09-22 S9/T1）：**数据根围栏**。调用方普遍把外部输入插进子路径首段
 * （`resolveDataDir(\`vanilla_${v}\`, "registries")`、`resolveDataDir(\`forge_${version}\`, "extracted")`），
 * 实跑的逃逸向量是**开头的 `/`** 而不是 `..`：`vanilla_../x` 里的 `vanilla_..` 只是一个**普通目录名**
 * （不穿越），但 `vanilla_/../../x` 里那个 `/` 先关掉了首段，于是紧随的 `..` 真的能跳出 `data/`。
 * 现在复用 `isResolvedInside`（此前只被 `src/prompts/index.ts` 用过）在返回前判定，越界即抛。
 * 严重性口径：这条泄漏给出的是「文件系统布局 + 目录存在性探测原语」，**不是**任意写 / RCE ——
 * 本函数只用于读路径。
 * 错误信息**不回显**解析后的路径（也不回显入参）：泄漏被拦的同时不得再把它印到信封里。
 */
export function resolveDataDir(...subpaths: string[]): string {
  // 策略 1：环境变量
  const fromEnv = getDataDirFromEnv();
  const base = fromEnv ? fromEnv : (existsSync(getDataDirFromSelf()) ? getDataDirFromSelf() : getDataDirFromCwd());

  if (subpaths.length === 0) return base;
  const joined = join(base, ...subpaths);
  if (!isResolvedInside(base, joined)) {
    throw new Error(
      "resolveDataDir: 子路径会逃出数据根目录，已拒绝（越界路径不回显，避免泄露文件系统布局）。" +
        "子路径只接受 data/ 内的相对片段，例如 resolveDataDir(\"forge_1.20.1\", \"extracted\")。",
    );
  }
  return joined;
}

/**
 * 社区知识库目录（community_knowledge/）
 * 优先级：
 * 1. MC_SKILL_COMMUNITY
 * 2. dirname(MC_SKILL_DATA)/community_knowledge
 * 3. 仓库根 / community_knowledge
 * 4. cwd/community_knowledge
 */
export function resolveCommunityDir(...subpaths: string[]): string {
  const env = process.env.MC_SKILL_COMMUNITY;
  let base: string | null = null;
  if (env && existsSync(env)) {
    base = resolve(env);
  } else {
    const dataDir = resolveDataDir();
    const sibling = join(dirname(dataDir), "community_knowledge");
    if (existsSync(sibling)) base = sibling;
    else {
      const fromSelf = join(getRepoRootFromSelf(), "community_knowledge");
      if (existsSync(fromSelf)) base = fromSelf;
      else base = join(process.cwd(), "community_knowledge");
    }
  }
  if (subpaths.length === 0) return base;
  return join(base, ...subpaths);
}

/**
 * 诊断数据目录配置（供 MCP 工具 diagnose_data_paths 使用）
 * 返回各平台数据目录的可用性状态。
 */
export function diagnoseDataPaths(): {
  resolvedDataDir: string;
  sources: string[];
  platforms: Record<string, { status: string; path: string; details: string }>;
  community: { status: string; path: string; details: string; env: string | null };
  /** 各文档树旁 semantic/db.sqlite 存在性（轻量，不加载模型） */
  semantic: {
    modeHint: string;
    modelsReady: boolean;
    /** A-38：只读侧诊断计数（开库/预编译是否仍与文档树数量解耦） */
    stats: NonNullable<ReturnType<typeof getSemanticIndexStatus>["readStats"]>;
    present: number;
    totalChecked: number;
    samples: ReturnType<typeof listSemanticDbPresence>;
    warnings: string[];
  };
  /** 缺语义库等必须出现的警告（规范：缺库必 warning） */
  warnings: string[];
} {
  const sources: string[] = [];
  const envPath = process.env.MC_SKILL_DATA;
  if (envPath) sources.push(`MC_SKILL_DATA=${envPath}`);
  const communityEnv = process.env.MC_SKILL_COMMUNITY;
  if (communityEnv) sources.push(`MC_SKILL_COMMUNITY=${communityEnv}`);
  sources.push(`cwd=${process.cwd()}`);
  sources.push(`self=${getSelfDir()}`);

  const dataDir = resolveDataDir();
  const platforms: Record<string, { status: string; path: string; details: string }> = {};

  for (const platform of ["forge", "fabric", "neoforge", "quilt", "liteloader", "rift", "modloader", "bedrock"] as const) {
    const prefix = `${platform}_`;
    let status = "not_found";
    let details = "";
    let path = "";
    try {
      if (existsSync(dataDir)) {
        const entries = readdirSync(dataDir, { withFileTypes: true });
        // B-6：版本门——剥掉平台前缀后必须以数字开头（或 stable），
        // 排除 forge_javadoc / fabric_porting / neoforge_primers 这类特殊目录
        const matching = entries.filter(
          (e) =>
            e.isDirectory() &&
            e.name.startsWith(prefix) &&
            (() => {
              const rest = e.name.slice(prefix.length);
              return /^\d/.test(rest) || rest === "stable";
            })(),
        );
        if (matching.length > 0) {
          status = "found";
          path = join(dataDir, matching[0].name);
          details = `Found ${matching.length} version(s): ${matching.map(e => e.name).join(", ")}`;
        } else {
          status = "empty";
          details =
            `Directory ${dataDir} exists but no ${prefix}* documentation indexes found. ` +
            `Document tools for ${platform} will return PLATFORM_DATA_MISSING until you download that platform's data pack.`;
        }
      } else {
        status = "not_found";
        details = `Data directory not found at ${dataDir}`;
      }
    } catch (err) {
      status = "error";
      details = String(err);
    }
    platforms[platform] = { status, path, details };
  }

  const communityPath = resolveCommunityDir();
  const communityIndex = join(communityPath, "indexes", "index-l0.json");
  let communityStatus = "not_found";
  let communityDetails = "";
  try {
    if (!existsSync(communityPath)) {
      communityStatus = "not_found";
      communityDetails = `Community directory not found at ${communityPath}`;
    } else if (!existsSync(communityIndex)) {
      communityStatus = "empty";
      communityDetails = `Directory exists but indexes/index-l0.json missing`;
    } else {
      communityStatus = "found";
      communityDetails = `index-l0.json present`;
    }
  } catch (err) {
    communityStatus = "error";
    communityDetails = String(err);
  }

  const semanticPresence = listSemanticDbPresence(dataDir);
  const semanticStatus = getSemanticIndexStatus(dataDir);
  const present = semanticPresence.filter((s) => s.exists).length;
  // B-5：刻意置空（L0 白名单 / index-l0=[] / failures.json）与真缺库分开计数与提示
  const cleared = semanticPresence.filter(
    (s) => !s.exists && isIntentionallyClearedTree(dataDir, s.platform, s.version, s.source),
  );
  const missingReal = semanticPresence.filter(
    (s) => !s.exists && !isIntentionallyClearedTree(dataDir, s.platform, s.version, s.source),
  );
  const semanticWarnings = buildSemanticWarnings({
    present,
    total: Math.max(semanticPresence.length - cleared.length, present),
    modelsReady: semanticStatus.modelsReady,
    missingSamples: missingReal,
  });
  if (cleared.length) {
    semanticWarnings.push(
      `下列 ${cleared.length} 棵文档树为刻意置空（index-l0 为 [] 或有 failures.json 凭据；search 已回落 wiki/带警示，不是缺库）：${cleared
        .map((s) => `${s.platform}_${s.version}/${s.source}`)
        .join(", ")}。`,
    );
  }

  return {
    resolvedDataDir: dataDir,
    sources,
    platforms,
    community: {
      status: communityStatus,
      path: communityPath,
      details: communityDetails,
      env: communityEnv ?? null,
    },
    semantic: {
      modeHint: semanticStatus.modeHint,
      modelsReady: semanticStatus.modelsReady,
      stats: semanticStatus.readStats,
      present,
      totalChecked: semanticPresence.length,
      samples: semanticPresence.filter((s) => s.exists).slice(0, 40),
      warnings: semanticWarnings,
    },
    warnings: semanticWarnings,
  };
}

/** True if data root contains at least one platform version directory. */
export function hasAnyPlatformData(dataDir = resolveDataDir()): boolean {
  if (!existsSync(dataDir)) return false;
  try {
    return readdirSync(dataDir, { withFileTypes: true }).some(
      (e) =>
        e.isDirectory() &&
        (e.name.startsWith("forge_") ||
          e.name.startsWith("fabric_") ||
          e.name.startsWith("neoforge_") ||
          e.name.startsWith("quilt_") ||
          e.name.startsWith("liteloader_") ||
          e.name.startsWith("rift_") ||
          e.name.startsWith("modloader_") ||
          e.name.startsWith("bedrock_")),
    );
  } catch {
    return false;
  }
}

const DATA_TREE_RE = /^(forge|fabric|neoforge|quilt|liteloader|rift|modloader|bedrock)_.+$/;

/**
 * S12/T1：规范位（`<platform>_<version>/<source>/<version>/index-l0.json`）的 l0 是否**有实质内容**。
 * 旧实现用 `findIndexL0Shallow` 在 4 层内摸到任一个能 `JSON.parse` 的文件就算过门，
 * 实测一棵只含 2 字节 `[]` 的假 `rift_1.13.2` 树足以骗过 STRICT 启动门。
 * 现在要求：数组、且条目对象带字符串 `id`（页面清单的真形状，见 data/forge_1.20.1 l0 的 `{id,version,label,…}`）。
 */
function substantiveL0Pages(dataDir: string, tree: string, source: string, version: string): number {
  const l0Path = join(dataDir, tree, source, version, "index-l0.json");
  if (!existsSync(l0Path)) return 0;
  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(l0Path, "utf8"));
  } catch {
    return 0;
  }
  if (!Array.isArray(parsed)) return 0;
  return parsed.filter(
    (e) => !!e && typeof e === "object" && typeof (e as { id?: unknown }).id === "string",
  ).length;
}

/** 扫 dataRoot，返回所有「规范位带非空 l0 页面清单」的平台树。 */
function listSubstantiveL0Trees(
  dataDir: string,
): Array<{ tree: string; platform: string; version: string; source: string; pages: number }> {
  const out: Array<{ tree: string; platform: string; version: string; source: string; pages: number }> = [];
  let trees: string[];
  try {
    trees = readdirSync(dataDir);
  } catch {
    return out;
  }
  for (const tree of trees) {
    if (!DATA_TREE_RE.test(tree)) continue;
    const platform = tree.slice(0, tree.indexOf("_"));
    const treeDir = join(dataDir, tree);
    let sources: string[];
    try {
      if (!statSync(treeDir).isDirectory()) continue;
      sources = readdirSync(treeDir);
    } catch {
      continue;
    }
    for (const source of sources) {
      const sourceDir = join(treeDir, source);
      let versions: string[];
      try {
        if (!statSync(sourceDir).isDirectory()) continue;
        versions = readdirSync(sourceDir);
      } catch {
        continue;
      }
      for (const version of versions) {
        const pages = substantiveL0Pages(dataDir, tree, source, version);
        if (pages > 0) out.push({ tree, platform, version, source, pages });
      }
    }
  }
  return out;
}

/** `<source>/<version>/processed/` 下的 .md 页数 —— 区分「诚实空索引」与「真故障」的唯一判据。 */
function countProcessedPages(dataDir: string, platform: string, version: string, source: string): number {
  const dir = join(dataDir, `${platform}_${version}`, source, version, "processed");
  if (!existsSync(dir)) return 0;
  try {
    return (readdirSync(dir, { recursive: true, encoding: "utf8" }) as string[]).filter((p) =>
      /\.md$/i.test(p),
    ).length;
  } catch {
    return 0;
  }
}

/**
 * STRICT 启动门（S12/T1+T2 重写）。
 *
 * 两条独立判据，缺一不可：
 * 1. **实质语料**：至少一棵平台树在规范位带非空 index-l0 页面清单（假树过不了）。
 * 2. **语义库**：抽到的 db 若不可用，只在「该档 `processed/` 真有页面、索引却 0 行」时判红。
 *    本机 `data/fabric_1.20.1/fabric-docs/1.20.1/` 实况是 **没有 processed/ 目录**、整档只有
 *    `fabric-wiki/` 7 个 .md，其 semantic/db.sqlite 是 65,536 字节 0 行壳（built_at 2026-08-20）——
 *    根 AGENTS.md「Fabric 建档面」已登记「上游 `FabricMC/fabric-docs` 从来没有 1.20.1 的 docs 树」，
 *    所以那是**诚实的空索引**，不是抓取缺陷：按档面跳过并记进 info，不得拒绝启动。
 *    对照 `fabric_1.21.1`：processed/ 45 页 + chunks 563 / embedded 435 / docs 45，真建过库。
 *    ⇒ 若哪天某档 processed/ 有页而库是 0 行，仍必须红。这条能力由 `mcp-server/test-core.mjs`
 *    顶层小节「S12/T5 assertDataUsable 假树夹具双向钉」钉住（2026-09-24 起真存在：该节自造
 *    `fabric_9.9.9` 假树，红例 = processed/ 1 页 + 0 行库 ⇒ 判真故障并点名树；
 *    绿例 = processed/ 0 页 + 0 行库 ⇒ ok:true 且 info 记账。此前这半句是自述无对价的假话——
 *    全仓 grep `assertDataUsable` 在任何测试文件里 0 引用）。
 */
export function assertDataUsable(
  dataDir = resolveDataDir(),
): { ok: boolean; reason?: string; info?: string[] } {
  if (!hasAnyPlatformData(dataDir)) return { ok: false, reason: "未找到平台数据目录" };
  const trees = listSubstantiveL0Trees(dataDir);
  if (trees.length === 0) {
    return {
      ok: false,
      reason:
        "没有任何一棵平台树带非空 index-l0 页面清单（规范位 <platform>_<version>/<source>/<version>/index-l0.json）。空壳/假树/全置空不算已建语料。",
    };
  }
  const info: string[] = [];
  // 旧实现只抽 3 个硬编码档位（forge 1.20.1 / fabric 1.20.1 / neoforge 1.21.1），
  // 实测对第 4 棵树的坏库完全失明 ⇒ 投毒夹具（fabric_9.9.9：processed 有页 + 0 行库）能过门。
  // 现在遍历所有**有实质 l0 清单**的树（真故障判据只看这些；纯空壳树本来已在上面被挡掉），
  // 上限 MAX_SEMANTIC_TREES 防极端 dataRoot 下启动开销失控，超出量记进 info。
  const MAX_SEMANTIC_TREES = 64;
  let checked = 0;
  for (const t of trees) {
    if (checked >= MAX_SEMANTIC_TREES) break;
    const dbPath = semanticDbPath(dataDir, t.platform, t.version, t.source);
    if (!existsSync(dbPath)) continue;
    checked++;
    if (inspectSemanticDb(dbPath).mode !== "missing") continue;
    const processed = countProcessedPages(dataDir, t.platform, t.version, t.source);
    if (processed > 0) {
      return {
        ok: false,
        reason:
          `语义库不可用且该档有语料（${t.tree}/${t.source} 的 processed/ 有 ${processed} 页，索引却 0 行 = 真故障，须 npm run build:semantic-index -- --platform=${t.platform} --version=${t.version} --force）: ${dbPath}`,
      };
    }
    info.push(
      `语义库 0 行但 ${t.tree}/${t.source} 无 processed/ 页（上游没有该版 docs 正文，index-l0=${isIntentionallyClearedTree(dataDir, t.platform, t.version, t.source) ? "刻意置空/有 failures.json 凭据" : "非空"}）⇒ 按档面跳过，不算故障: ${dbPath}`,
    );
  }
  info.unshift(`assertDataUsable: 实质语料树 ${trees.length} 棵，语义库探测 ${checked} 个。`);
  if (trees.length > MAX_SEMANTIC_TREES) {
    info.push(`语义库探测按上限 ${MAX_SEMANTIC_TREES} 截断（实质语料树共 ${trees.length} 棵）。`);
  }
  return { ok: true, info };
}
