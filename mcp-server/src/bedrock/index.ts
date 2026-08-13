/**
 * 基岩版 Add-On 文档 / 校验 / 生成（不是 Forge/Java 工具）。
 * search_bedrock_docs 每次带 docsStatus；滞后 Warning 不是拒绝令。
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { z } from "zod";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { FabricDocStore } from "../docs-platform/fabric/store.js";
import {
  hasPlatformDocData,
  platformDataMissingPayload,
} from "../docs-platform/platform-data.js";
import { resolveDataDir } from "../utils/path.js";
import { semanticSearch } from "../docs-platform/semantic/search.js";
import { joinSearchWarnings, mergeSemanticResults, type SearchResultLike } from "../docs-platform/search-utils.js";
import { missingSemanticDbWarning, semanticStaleSearchWarning } from "../docs-platform/semantic/status.js";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const STALE_MS = 14 * 24 * 60 * 60 * 1000;
const LEARN_PACK =
  "https://learn.microsoft.com/minecraft/creator/reference/content/packreferencetopics/packmanifest";
const LEARN_EXPERIMENTS =
  "https://learn.microsoft.com/en-us/minecraft/creator/documents/experimentalfeaturestoggle";

export interface BedrockDocsStatus {
  localRevision: string | null;
  remoteRevision: string | null;
  scriptApiStable: string | null;
  scriptApiBeta: string | null;
  fetchedAt: string | null;
  stale: boolean;
  warning?: string;
}

export function loadBedrockDocsStatus(dataRoot = resolveDataDir()): BedrockDocsStatus {
  const p = join(dataRoot, "bedrock-docs-status.json");
  const empty: BedrockDocsStatus = {
    localRevision: null,
    remoteRevision: null,
    scriptApiStable: null,
    scriptApiBeta: null,
    fetchedAt: null,
    stale: true,
    warning: "未找到 data/bedrock-docs-status.json；基岩文档可能尚未抓取。",
  };
  if (!existsSync(p)) return empty;
  try {
    const raw = JSON.parse(readFileSync(p, "utf8")) as Partial<BedrockDocsStatus>;
    const fetchedAt = typeof raw.fetchedAt === "string" ? raw.fetchedAt : null;
    const fetchedMs = fetchedAt ? Date.parse(fetchedAt) : NaN;
    const ageStale = !Number.isFinite(fetchedMs) || Date.now() - fetchedMs > STALE_MS;
    const revStale = Boolean(
      raw.remoteRevision && raw.localRevision && raw.remoteRevision !== raw.localRevision,
    );
    const stale = ageStale || revStale;
    const warning = stale
      ? "此文档可能滞后于当前正式版（Script API 约两周一个 Beta）。滞后 Warning 不是拒绝令；默认仍只生成 stable。"
      : undefined;
    return {
      localRevision: raw.localRevision ?? null,
      remoteRevision: raw.remoteRevision ?? null,
      scriptApiStable: raw.scriptApiStable ?? null,
      scriptApiBeta: raw.scriptApiBeta ?? null,
      fetchedAt,
      stale,
      warning,
    };
  } catch {
    return { ...empty, warning: "bedrock-docs-status.json 解析失败" };
  }
}

function jsonOk(payload: unknown): CallToolResult {
  return { content: [{ type: "text", text: JSON.stringify(payload, null, 2) }] };
}

function withStatus<T extends Record<string, unknown>>(body: T): T & { docsStatus: BedrockDocsStatus } {
  const docsStatus = loadBedrockDocsStatus();
  const warning = joinSearchWarnings(
    typeof body.warning === "string" ? body.warning : undefined,
    docsStatus.warning,
  );
  return { ...body, docsStatus, warning };
}

function getStore(version = "stable"): FabricDocStore {
  return new FabricDocStore(resolveDataDir(), version, "bedrock-docs", "bedrock");
}

export const searchBedrockDocsSchema = z.object({
  query: z.string().describe("搜索关键词（Microsoft Learn Creator / Script API / pack manifest）"),
  version: z.string().optional().describe("文档树版本，默认 stable（不要用 Java 的 1.20.1 冒充）"),
  tags: z.array(z.string()).optional(),
});

export async function searchBedrockDocs(
  args: z.infer<typeof searchBedrockDocsSchema>,
): Promise<CallToolResult> {
  const version = args.version ?? "stable";
  const dataRoot = resolveDataDir();
  if (!hasPlatformDocData("bedrock", dataRoot)) {
    return jsonOk(
      withStatus({
        ...platformDataMissingPayload("bedrock"),
        query: args.query,
        version,
      }),
    );
  }
  const store = getStore(version);
  const detailed = store.searchIndexDetailed(args.query, version, args.tags);
  let results: SearchResultLike[] = detailed.results;
  const semanticHits = await semanticSearch(
    args.query,
    "bedrock",
    detailed.resolvedVersion,
    "bedrock-docs",
    dataRoot,
  );
  if (semanticHits) {
    results = mergeSemanticResults(results, semanticHits, {
      tags: args.tags,
      limit: 20,
      version: detailed.resolvedVersion,
    });
  }
  return jsonOk(
    withStatus({
      ok: true,
      query: args.query,
      version,
      resolvedVersion: detailed.resolvedVersion,
      platform: "bedrock",
      semantic: semanticHits !== null,
      total: results.length,
      results,
      warning: joinSearchWarnings(
        missingSemanticDbWarning(semanticHits === null),
        semanticStaleSearchWarning(dataRoot, "bedrock", detailed.resolvedVersion, "bedrock-docs"),
      ),
    }),
  );
}

export const getBedrockDocSummarySchema = z.object({
  id: z.string().describe("页面 ID，来自 search_bedrock_docs 的 results[].id"),
  version: z.string().optional().describe("默认 stable"),
});

export async function getBedrockDocSummary(
  args: z.infer<typeof getBedrockDocSummarySchema>,
): Promise<CallToolResult> {
  const version = args.version ?? "stable";
  if (!hasPlatformDocData("bedrock")) {
    return jsonOk(withStatus({ ...platformDataMissingPayload("bedrock") }));
  }
  try {
    const summary = getStore(version).loadSummary(args.id, version);
    return jsonOk(withStatus({ ok: true, platform: "bedrock", ...summary, version }));
  } catch (e) {
    return jsonOk(withStatus({ ok: false, error: String(e) }));
  }
}

export const getBedrockDocFullSchema = z.object({
  id: z.string(),
  version: z.string().optional(),
  highlight_key: z.boolean().optional(),
});

export async function getBedrockDocFull(
  args: z.infer<typeof getBedrockDocFullSchema>,
): Promise<CallToolResult> {
  const version = args.version ?? "stable";
  if (!hasPlatformDocData("bedrock")) {
    return jsonOk(withStatus({ ...platformDataMissingPayload("bedrock") }));
  }
  try {
    const full = await getStore(version).loadFullDoc(args.id, version, args.highlight_key !== false);
    return jsonOk(withStatus({ ok: true, platform: "bedrock", ...full, version }));
  } catch (e) {
    return jsonOk(withStatus({ ok: false, error: String(e) }));
  }
}

export const getBedrockDocRelatedSchema = z.object({
  id: z.string(),
  version: z.string().optional(),
  limit: z.number().optional(),
});

export async function getBedrockDocRelated(
  args: z.infer<typeof getBedrockDocRelatedSchema>,
): Promise<CallToolResult> {
  const version = args.version ?? "stable";
  if (!hasPlatformDocData("bedrock")) {
    return jsonOk(withStatus({ ...platformDataMissingPayload("bedrock") }));
  }
  try {
    const related = getStore(version).getRelatedDocs(args.id, version, args.limit ?? 8);
    return jsonOk(withStatus({ ok: true, platform: "bedrock", version, related }));
  } catch (e) {
    return jsonOk(withStatus({ ok: false, error: String(e) }));
  }
}

export const validateAddonManifestSchema = z.object({
  manifestJson: z.string().describe("manifest.json 全文"),
});

export function validateAddonManifest(manifestJson: string): Record<string, unknown> {
  const errors: string[] = [];
  const warnings: string[] = [];
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(manifestJson) as Record<string, unknown>;
  } catch (e) {
    return { ok: false, errors: [`JSON 解析失败: ${(e as Error).message}`], warnings };
  }
  if (parsed.format_version == null) errors.push("缺少 format_version");
  const header = parsed.header as Record<string, unknown> | undefined;
  if (!header) errors.push("缺少 header");
  else {
    if (typeof header.uuid !== "string" || !UUID_RE.test(header.uuid)) {
      errors.push("header.uuid 必须是标准 UUID");
    }
    if (!Array.isArray(header.version) || header.version.length < 3) {
      errors.push("header.version 应为长度为 3 的数字数组");
    }
    if (typeof header.name !== "string") errors.push("缺少 header.name");
    if (header.min_engine_version && !Array.isArray(header.min_engine_version)) {
      errors.push("min_engine_version 应为 [major, minor, patch] 数组");
    }
  }
  const modules = parsed.modules;
  if (!Array.isArray(modules) || modules.length === 0) {
    errors.push("缺少 modules 数组");
  } else {
    for (const [i, m] of modules.entries()) {
      const mod = m as Record<string, unknown>;
      const t = mod.type;
      if (t !== "resources" && t !== "data" && t !== "script" && t !== "world_template") {
        errors.push(`modules[${i}].type 无效（允许 resources/data/script/world_template）`);
      }
      if (typeof mod.uuid === "string" && !UUID_RE.test(mod.uuid)) {
        errors.push(`modules[${i}].uuid 不是标准 UUID`);
      }
    }
  }
  if (Object.prototype.hasOwnProperty.call(parsed, "experimentalGameplay")) {
    errors.push(
      "禁止写入 experimentalGameplay。世界 Beta APIs 在 level.dat 的 experiments.gametest / 游戏设置 → Experiments，pack JSON 打不开该开关。",
    );
  }
  const caps = parsed.capabilities;
  if (Array.isArray(caps)) {
    const allowed = new Set(["chemistry", "script_eval", "raytraced", "pbr"]);
    for (const c of caps) {
      if (typeof c === "string" && !allowed.has(c)) {
        warnings.push(`未知 capability「${c}」；现行 Learn packmanifest 列出 chemistry / script_eval / raytraced / pbr`);
      }
    }
  }
  warnings.push(`对照 Learn pack manifest：${LEARN_PACK}`);
  return { ok: errors.length === 0, errors, warnings, docsStatus: loadBedrockDocsStatus() };
}

export const validateBpJsonSchema = z.object({
  kind: z.enum(["entity", "block", "item", "recipe"]).describe("BP JSON 类型"),
  json: z.string().describe("JSON 全文"),
});

export function validateBpJson(kind: "entity" | "block" | "item" | "recipe", json: string): Record<string, unknown> {
  const errors: string[] = [];
  const warnings: string[] = ["精简 schema，不是全量官方 JSON schema；正式字段以 Microsoft Learn 为准"];
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(json) as Record<string, unknown>;
  } catch (e) {
    return { ok: false, errors: [`JSON 解析失败: ${(e as Error).message}`], warnings };
  }
  if (parsed.format_version == null) errors.push("缺少 format_version");
  const key =
    kind === "entity"
      ? "minecraft:entity"
      : kind === "block"
        ? "minecraft:block"
        : kind === "item"
          ? "minecraft:item"
          : "minecraft:recipe_shaped";
  if (kind === "recipe") {
    const hasRecipe = Object.keys(parsed).some((k) => k.startsWith("minecraft:recipe"));
    if (!hasRecipe) errors.push("合成 JSON 应含 minecraft:recipe_* 键");
  } else if (!parsed[key]) {
    errors.push(`缺少 ${key}`);
  } else {
    const desc = (parsed[key] as Record<string, unknown>)?.description as Record<string, unknown> | undefined;
    if (!desc || typeof desc.identifier !== "string" || !desc.identifier.includes(":")) {
      errors.push(`${key}.description.identifier 必须是 namespace:name`);
    }
  }
  if (Object.prototype.hasOwnProperty.call(parsed, "experimentalGameplay")) {
    errors.push("禁止在 BP JSON 写 experimentalGameplay");
  }
  return { ok: errors.length === 0, errors, warnings, docsStatus: loadBedrockDocsStatus() };
}

export const generateAddonManifestSchema = z.object({
  packName: z.string().describe("header.name"),
  description: z.string().optional(),
  packType: z.enum(["resources", "data", "both", "script"]).describe("resources=RP data=BP both=各一份 script=BP+script 模块"),
  minEngineVersion: z.array(z.number()).optional().describe("默认 [1, 21, 0]"),
  beta: z.boolean().optional().describe("仅当用户明确要 Beta / @minecraft/server-beta 时为 true"),
  scriptEval: z.boolean().optional().describe("仅当需要 eval 时写入 capabilities: [script_eval]"),
  headerUuid: z.string().optional(),
  moduleUuid: z.string().optional(),
});

function fakeUuid(seed: string): string {
  const hex = Buffer.from(seed.padEnd(16, "0")).toString("hex").slice(0, 32);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-a${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
}

export function generateAddonManifest(args: z.infer<typeof generateAddonManifestSchema>): Record<string, unknown> {
  const min = args.minEngineVersion ?? [1, 21, 0];
  const status = loadBedrockDocsStatus();
  const warnings: string[] = [];
  if (args.beta) {
    warnings.push(
      "该功能依赖实验性玩法 / Beta APIs。必须在世界设置打开「Beta APIs」。禁止把 experimentalGameplay 写入 pack JSON。世界实验在 level.dat 的 experiments.gametest（见 wiki.bedrock.dev/nbt/enabling-experiments）。Learn：" +
        LEARN_EXPERIMENTS,
    );
  }
  if (min[0] < 1 || (min[0] === 1 && min[1] < 19) || (min[0] === 1 && min[1] === 19 && min[2] < 80)) {
    warnings.push(
      "min_engine_version 低于约 1.19.80：不要把现行 capabilities 列表倒灌到旧引擎；生成前对照该引擎版本的 Learn/wiki 归档。",
    );
  }
  const stableVer = status.scriptApiStable ?? "1.11.0";
  warnings.push(
    `默认 @minecraft/server 版本取自 bedrock-docs-status.scriptApiStable（当前 ${stableVer}）。入库可能滞后，发布前对照 Learn。`,
  );

  const headerUuid = args.headerUuid && UUID_RE.test(args.headerUuid) ? args.headerUuid : fakeUuid(`hdr-${args.packName}`);
  const moduleUuid = args.moduleUuid && UUID_RE.test(args.moduleUuid) ? args.moduleUuid : fakeUuid(`mod-${args.packName}`);

  function one(type: "resources" | "data" | "script"): Record<string, unknown> {
    const modules: Record<string, unknown>[] = [
      {
        type: type === "script" ? "script" : type,
        uuid: moduleUuid,
        version: [1, 0, 0],
        ...(type === "script" ? { language: "javascript", entry: "scripts/main.js" } : {}),
      },
    ];
    const manifest: Record<string, unknown> = {
      format_version: 2,
      header: {
        name: args.packName,
        description: args.description ?? args.packName,
        uuid: headerUuid,
        version: [1, 0, 0],
        min_engine_version: min,
      },
      modules,
    };
    if (type === "script" || args.packType === "script") {
      manifest.dependencies = [
        args.beta
          ? { module_name: "@minecraft/server", version: "beta" }
          : { module_name: "@minecraft/server", version: stableVer },
      ];
    }
    if (args.scriptEval) {
      manifest.capabilities = ["script_eval"];
    }
    return manifest;
  }

  const files: Record<string, unknown> = {};
  if (args.packType === "resources") files["RP/manifest.json"] = one("resources");
  else if (args.packType === "data") files["BP/manifest.json"] = one("data");
  else if (args.packType === "script") files["BP/manifest.json"] = one("script");
  else {
    files["RP/manifest.json"] = one("resources");
    files["BP/manifest.json"] = one("data");
  }

  return {
    ok: true,
    files,
    warnings,
    docsStatus: status,
    note: "只返回 JSON 文本，不写盘。不要创建 worldgen/experimental.json 当作 Beta 开关。",
  };
}

export const generateBpEntitySchema = z.object({
  identifier: z.string().describe("如 demo:widget"),
  betaExplodeEvent: z.boolean().optional().describe("仅当用户点名方块爆炸等仍属 Beta 的事件"),
});

export function generateBpEntity(args: z.infer<typeof generateBpEntitySchema>): Record<string, unknown> {
  const warnings: string[] = [];
  if (!args.identifier.includes(":")) {
    return { ok: false, errors: ["identifier 必须是 namespace:name"], files: {} };
  }
  const entity = {
    format_version: "1.21.0",
    "minecraft:entity": {
      description: {
        identifier: args.identifier,
        is_spawnable: true,
        is_summonable: true,
      },
      components: {
        "minecraft:health": { value: 20, max: 20 },
        "minecraft:physics": {},
      },
    },
  };
  const files: Record<string, unknown> = {
    [`BP/entities/${args.identifier.replace(":", "_")}.json`]: entity,
  };
  if (args.betaExplodeEvent) {
    files["script-snippet.js"] =
      `import { world } from "@minecraft/server";\n// Beta：BlockExplodeAfterEvent 等需 @minecraft/server-beta\n// 必须在世界设置打开 Beta APIs；pack 侧 dependencies 用 beta 模块。\nworld.afterEvents.blockExplode?.subscribe((ev) => {\n  console.warn("block exploded", ev.block);\n});\n`;
    const man = generateAddonManifest({
      packName: `${args.identifier} scripts`,
      packType: "script",
      beta: true,
      minEngineVersion: [1, 21, 0],
    });
    const bpMan = (man.files as Record<string, unknown> | undefined)?.["BP/manifest.json"];
    if (bpMan) files["BP/manifest.json"] = bpMan;
    if (Array.isArray(man.warnings)) {
      for (const w of man.warnings) {
        if (typeof w === "string") warnings.push(w);
      }
    }
    warnings.push(
      "BlockExplodeAfterEvent 等属于 Beta。允许生成，但必须：1) BP manifest dependencies 已声明 @minecraft/server 的 beta 版本（见 BP/manifest.json）；2) 用户在世界设置打开 Beta APIs；3) 不要写 experimentalGameplay 或虚构 worldgen/experimental.json。",
    );
  }
  return { ok: true, files, warnings, docsStatus: loadBedrockDocsStatus() };
}
