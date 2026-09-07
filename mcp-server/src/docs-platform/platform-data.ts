/**
 * 平台文档数据包缺失检测与统一错误响应。
 * 用户可只下载部分平台 data（如仅 forge_*），缺失平台应返回明确提示而非空列表/结构错误。
 */

import { existsSync, readdirSync, readFileSync } from "fs";
import { join } from "path";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { resolveDataDir, resolveRepoRoot } from "../utils/path.js";
import { ownGet } from "../utils/own-record.js";
import { ALL_DOC_PLATFORMS, PLATFORM_DOC_SUBDIR, type Platform } from "./platforms.js";

export type DocPlatform = Platform;

export class PlatformDataMissingError extends Error {
  readonly code = "PLATFORM_DATA_MISSING" as const;
  constructor(public readonly platform: DocPlatform) {
    super(`${platform} 文档数据未下载或不在当前 MC_SKILL_DATA 目录中`);
    this.name = "PlatformDataMissingError";
  }
}

const HINTS: Record<DocPlatform, string> = {
  forge:
    "请下载并解压 Forge 文档数据包到 data/forge_<version>/forge-docs/<version>/（含 index-l0.json），并确认 MC_SKILL_DATA 指向 data 根目录。可用 diagnose_data_paths 检查。",
  fabric:
    "请下载并解压 Fabric 文档数据包到 data/fabric_<version>/fabric-docs/<version>/（或 fabric-wiki），并确认 MC_SKILL_DATA 指向 data 根目录。可用 diagnose_data_paths 检查。",
  neoforge:
    "请下载并解压 NeoForge 文档数据包到 data/neoforge_<version>/neoforge-docs/<version>/；若只需 1.20.1，也可提供 forge_1.20.1。确认 MC_SKILL_DATA 指向 data 根目录。可用 diagnose_data_paths 检查。",
  quilt:
    "Quilt 官方树位于 data/quilt_<version>/quilt-docs/<version>/。无树时 search_docs(platform=quilt) 对非 QSL 查询可回退 Fabric（过滤 FAPI 专属类）；QSL 专用查询不会回退。可用 diagnose_data_paths 检查。",
  liteloader:
    "LiteLoader 文档树位于 data/liteloader_<version>/liteloader-docs/<version>/。页少时可仅 L0/社区短文 + loader-api-summaries。不要复制 forge_1.12.2 教程树。",
  rift:
    "Rift 文档树位于 data/rift_1.13.2/rift-docs/1.13.2/。无库时用仓库 rift/1.13.2/knowledge/common/ 已抓 wiki。不要回退 Fabric 文档。",
  modloader:
    "ModLoader 以仓库内安全 API 表为准（modloader/1.6.4/knowledge/common/safe-api.md），不把 found:false 当成类不存在。",
  bedrock:
    "基岩文档请用 search_bedrock_docs。数据位于 data/bedrock_*/bedrock-docs/；并查看 data/bedrock-docs-status.json 的滞后标记。",
};

export function platformDataMissingPayload(platform: DocPlatform) {
  return {
    ok: false as const,
    error: {
      code: "PLATFORM_DATA_MISSING" as const,
      platform,
      message: `${platform} 文档数据未下载或不在当前 MC_SKILL_DATA 目录中`,
      hint: ownGet(HINTS, platform) ?? "",
    },
  };
}

export function platformDataMissingResult(platform: DocPlatform): CallToolResult {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(platformDataMissingPayload(platform), null, 2),
      },
    ],
  };
}

/** 若为 PlatformDataMissingError 则转成工具结果，否则 null */
export function asPlatformDataMissingResult(e: unknown): CallToolResult | null {
  if (e instanceof PlatformDataMissingError) {
    return platformDataMissingResult(e.platform);
  }
  return null;
}

function hasPrefixedIndex(
  dataDir: string,
  prefix: string,
  sources: string[],
): boolean {
  for (const e of readdirSync(dataDir, { withFileTypes: true })) {
    if (!e.isDirectory() || !e.name.startsWith(`${prefix}_`)) continue;
    const ver = e.name.slice(`${prefix}_`.length);
    const base = join(dataDir, e.name);
    for (const src of sources) {
      if (existsSync(join(base, src, ver, "index-l0.json"))) return true;
    }
  }
  return false;
}

/**
 * 扫描 data 根下是否存在该平台的可用文档索引。
 * NeoForge 额外认可 forge_1.20.1（兼容回退）。
 * Quilt **不**把 Fabric 树算作「已有 Quilt 数据」（回退在 search_docs 里显式处理）。
 */
export function hasPlatformDocData(
  platform: DocPlatform,
  dataDir = resolveDataDir(),
): boolean {
  if (!existsSync(dataDir)) return false;
  try {
    if (platform === "forge") {
      for (const e of readdirSync(dataDir, { withFileTypes: true })) {
        if (!e.isDirectory()) continue;
        if (e.name.startsWith("forge_") && e.name !== "forge_javadoc") {
          const ver = e.name.slice("forge_".length);
          if (existsSync(join(dataDir, e.name, "forge-docs", ver, "index-l0.json"))) {
            return true;
          }
        }
        if (e.name === "forge_javadoc") {
          const jd = join(dataDir, "forge_javadoc");
          if (!existsSync(jd)) continue;
          for (const v of readdirSync(jd, { withFileTypes: true })) {
            if (v.isDirectory() && existsSync(join(jd, v.name, "index-l0.json"))) {
              return true;
            }
          }
        }
      }
      return false;
    }
    if (platform === "fabric") {
      return hasPrefixedIndex(dataDir, "fabric", ["fabric-docs", "fabric-wiki"]);
    }
    if (platform === "neoforge") {
      if (hasPrefixedIndex(dataDir, "neoforge", ["neoforge-docs"])) return true;
      return existsSync(
        join(dataDir, "forge_1.20.1", "forge-docs", "1.20.1", "index-l0.json"),
      );
    }
    const extraSources: Record<string, string[]> = {
      quilt: ["quilt-docs"],
      liteloader: ["liteloader-docs"],
      rift: ["rift-docs"],
      modloader: ["modloader-docs"],
      bedrock: ["bedrock-docs"],
    };
    const sources = ownGet(extraSources, platform) ?? [ownGet(PLATFORM_DOC_SUBDIR, platform) ?? `${platform}-docs`];
    return hasPrefixedIndex(dataDir, platform, sources);
  } catch {
    return false;
  }
}

export function listKnownDocPlatforms(): readonly string[] {
  return ALL_DOC_PLATFORMS;
}

// ── 版本清单说明（list_*_versions.notes）────────────────────────────────────

const VERSION_LIKE = /^\d+(\.\d+)*$/;

/** 该平台文档子目录（fabric 另有 wiki 语料）。 */
function docSourcesOf(platform: DocPlatform): string[] {
  const base = ownGet(PLATFORM_DOC_SUBDIR, platform) ?? `${platform}-docs`;
  return platform === "fabric" ? [base, "fabric-wiki"] : [base];
}

function l0Candidates(dataDir: string, platform: DocPlatform, version: string): string[] {
  const root = join(dataDir, `${platform}_${version}`);
  const out: string[] = [];
  for (const src of docSourcesOf(platform)) {
    out.push(join(root, src, version, "index-l0.json"));
    out.push(join(root, src, "index-l0.json"));
  }
  out.push(join(root, "index-l0.json"));
  if (platform === "forge") out.push(join(dataDir, "forge_javadoc", version, "index-l0.json"));
  // NeoForge 兼容档（如 1.20.1）无 neoforge_<ver> 树，正文走同名 forge_<ver>；口径必须跟着实际读取的语料。
  if (platform === "neoforge" && !existsSync(root)) {
    out.push(join(dataDir, `forge_${version}`, "forge-docs", version, "index-l0.json"));
  }
  return out;
}

function indexFileWithData(candidate: string): string | null {
  if (!existsSync(candidate)) return null;
  try {
    const data = JSON.parse(readFileSync(candidate, "utf8")) as unknown;
    return Array.isArray(data) && data.length > 0 ? candidate : null;
  } catch {
    return null;
  }
}

function firstIndexFile(dataDir: string, platform: DocPlatform, version: string): string | null {
  for (const p of l0Candidates(dataDir, platform, version)) {
    const withData = indexFileWithData(p);
    if (withData) return withData;
  }
  return null;
}

function hasSemanticDb(indexFile: string | null): boolean {
  if (!indexFile) return false;
  return existsSync(join(indexFile, "..", "semantic", "db.sqlite"));
}

/** 仓库内该平台的版本目录，连同「是否真有规则文件」。空壳（0 个 .mdc）= draft。 */
function ruleTreeVersions(platform: DocPlatform, repoRoot: string): { version: string; hasRules: boolean }[] {
  const dir = join(repoRoot, platform);
  if (!existsSync(dir)) return [];
  try {
    return readdirSync(dir, { withFileTypes: true })
      .filter((e) => e.isDirectory() && VERSION_LIKE.test(e.name))
      .map((e) => {
        const rulesDir = join(dir, e.name, ".cursor", "rules");
        let hasRules = false;
        try {
          hasRules = readdirSync(rulesDir, { withFileTypes: true }).some((r) => r.isFile() && r.name.endsWith(".mdc"));
        } catch {
          hasRules = false;
        }
        return { version: e.name, hasRules };
      });
  } catch {
    return [];
  }
}

function clipList(list: string[], max = 12): string {
  if (list.length <= max) return list.join(", ");
  return `${list.slice(0, max).join(", ")}…（共 ${list.length} 档）`;
}

/**
 * 给版本清单工具生成说明。全部从 data 目录与规则树实扫得出，写死文案会随语料变动失真。
 */
export function buildListVersionsNotes(
  platform: DocPlatform,
  versions: readonly string[],
  dataDir = resolveDataDir(),
  repoRoot = resolveRepoRoot(),
): string[] {
  const notes: string[] = [
    `本清单是本仓库**已入库**的 ${platform} 文档版本，不是「上游有文档的版本」。不在清单 = 本档无语料树，不等于上游没有文档；禁止拿邻版正文顶替。`,
  ];
  const indexed = new Map<string, string | null>();
  for (const v of versions) indexed.set(v, firstIndexFile(dataDir, platform, v));

  if (platform === "fabric") {
    const wikiOnly = versions.filter((v) => {
      const root = join(dataDir, `fabric_${v}`);
      const hasDocs = [join(root, "fabric-docs", v, "index-l0.json"), join(root, "fabric-docs", "index-l0.json")]
        .some((p) => indexFileWithData(p) !== null);
      if (hasDocs) return false;
      return [join(root, "fabric-wiki", v, "index-l0.json"), join(root, "fabric-wiki", "index-l0.json")]
        .some((p) => indexFileWithData(p) !== null);
    });
    if (wikiOnly.length > 0) {
      notes.push(
        `${wikiOnly.length} 档无版本化 fabric-docs 正文，只有 fabric-wiki 现行 Wiki（${clipList(wikiOnly)}）：Wiki 不是该版历史快照；命中行的 source 字段标明语料，用 get_fabric_doc_* 取全文须带 source:"fabric-wiki"。`,
      );
    }
  }
  if (platform === "neoforge" && versions.includes("1.20.1") && !existsSync(join(dataDir, "neoforge_1.20.1"))) {
    notes.push(
      "neoforge 1.20.1 无 data/neoforge_1.20.1：正文走 data/forge_1.20.1（结果带 forgeCompatible:true + versionFallback:false），按设计，不是半档。",
    );
  }
  const javadocVersions = platform === "forge"
    ? versions.filter((v) =>
      !existsSync(join(dataDir, `forge_${v}`, "forge-docs", v, "index-l0.json")) &&
      existsSync(join(dataDir, "forge_javadoc", v, "index-l0.json")),
    )
    : [];
  if (javadocVersions.length > 0) {
    notes.push(
      `${javadocVersions.length} 档无 forge-docs 树，正文在 data/forge_javadoc/<ver>/ 的 JavaDoc 索引（${clipList(javadocVersions)}）：布局不同，不是缺数据。build:semantic-index 只扫 <平台>_<版本>/ 目录，不覆盖 forge_javadoc 布局，所以这些档没有正文语义库是既定状态。`,
    );
  }

  const javadocSet = new Set(javadocVersions);
  const noSemantic = versions.filter((v) => !javadocSet.has(v) && !hasSemanticDb(indexed.get(v) ?? null));
  if (noSemantic.length > 0) {
    notes.push(
      `${noSemantic.length} 档缺语义索引 semantic/db.sqlite（${clipList(noSemantic)}）：这些档的检索只能按标题/标签/URL 与 L1 符号匹配，正文词项 0 命中不代表该 API 不存在；补齐在 mcp-server 执行 npm run build:semantic-index。`,
    );
  }

  const trees = ruleTreeVersions(platform, repoRoot);
  const treeOnly = trees.filter((t) => t.hasRules && !versions.includes(t.version)).map((t) => t.version).sort();
  if (treeOnly.length > 0) {
    const tail =
      platform === "quilt"
        ? "QSL 专用查询会改口同 <maj>.<min> 线已建档（上游按分支抓取，同线同源），非 QSL 查询回退同版 Fabric。"
        : "session 可激活该档规则树，但文档检索无本档语料。";
    notes.push(`规则树有 ${treeOnly.length} 档不在本清单（${clipList(treeOnly)}）：${tail}`);
  }
  const drafts = trees.filter((t) => !t.hasRules).map((t) => t.version).sort();
  if (drafts.length > 0) {
    notes.push(
      `${drafts.length} 档版本目录是空壳（无 .cursor/rules/*.mdc，draft）（${clipList(drafts)}）：activate_platform_pack session 返回 PACK_NOT_FOUND，文档检索也无本档语料；禁止拿邻版规则树顶替，也不要为填版本号克隆一棵新树。`,
    );
  }
  return notes;
}
