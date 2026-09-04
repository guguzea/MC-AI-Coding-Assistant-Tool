/**
 * 基岩版 Add-On 文档 / 校验 / 生成（不是 Forge/Java 工具）。
 * search_bedrock_docs 每次带 docsStatus；滞后 Warning 不是拒绝令。
 */
import { existsSync, readFileSync } from "fs";
import { randomUUID } from "crypto";
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

/**
 * 官方 pack-manifest capabilities 表（本仓缓存页 data/bedrock_stable/bedrock-docs/stable/processed/pack-manifest.md）。
 * test-core 会重新解析该页并比对本常量，官方增删时先改页再改这里。
 * 缓存页无 script_eval，故不收录；命中表外值只 warning，不判错。
 */
export const BEDROCK_CAPABILITIES = [
  "chemistry",
  "editorExtension",
  "experimental_custom_ui",
  "raytraced",
  "pbr",
];

export interface BedrockDocsStatus {
  localRevision: string | null;
  remoteRevision: string | null;
  scriptApiStable: string | null;
  scriptApiBeta: string | null;
  fetchedAt: string | null;
  stale: boolean;
  warning?: string;
  code?: "NOT_FETCHED" | "CORRUPT" | "STALE" | "OK";
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
    code: "NOT_FETCHED",
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
      code: stale ? "STALE" : "OK",
    };
  } catch {
    return { ...empty, warning: "bedrock-docs-status.json 损坏或无法解析", code: "CORRUPT" };
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
    "Microsoft Learn view=minecraft-bedrock-stable 是现行稳定版，不是某个历史快照。不要用 Java 资源包文档去修正 RP。",
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
      allowedIds: new Set(results.map((r) => r.id)),
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
  else if (typeof parsed.format_version !== "number" || !Number.isInteger(parsed.format_version) || parsed.format_version < 1) {
    errors.push("format_version 必须是正整数");
  }
  const header = parsed.header as Record<string, unknown> | undefined;
  if (!header) errors.push("缺少 header");
  else {
    if (typeof header.uuid !== "string" || !UUID_RE.test(header.uuid)) {
      errors.push("header.uuid 必须是标准 UUID");
    }
    if (!Array.isArray(header.version) || header.version.length !== 3 || !header.version.every((n) => typeof n === "number" && Number.isFinite(n))) {
      errors.push("header.version 应为长度为 3 的数字数组");
    }
    if (typeof header.name !== "string") errors.push("缺少 header.name");
    if (header.min_engine_version) {
      const mev = header.min_engine_version;
      if (!Array.isArray(mev) || mev.length !== 3 || !mev.every((n) => typeof n === "number" && Number.isInteger(n))) {
        errors.push("min_engine_version 应为三维整数数组 [major, minor, patch]");
      }
    }
  }
  const modules = parsed.modules;
  if (!Array.isArray(modules) || modules.length === 0) {
    errors.push("缺少 modules 数组");
  } else {
    for (const [i, m] of modules.entries()) {
      const mod = m as Record<string, unknown>;
      const t = mod.type;
      // F-E206："skin"（皮肤包）与 legacy "client_data" 是合法/遗留 type，不按 invalid 报错
      if (t === "skin") {
        // 皮肤包合法类型
      } else if (t === "client_data") {
        warnings.push(`modules[${i}].type 为 legacy "client_data"，建议迁移到 "data"`);
      } else if (t !== "resources" && t !== "data" && t !== "script" && t !== "world_template") {
        errors.push(`modules[${i}].type 无效（允许 resources/data/script/world_template/skin）`);
      }
      if (typeof mod.uuid !== "string" || !UUID_RE.test(mod.uuid)) {
        errors.push(`modules[${i}].uuid 必须是标准 UUID`);
      }
      if (!Array.isArray(mod.version) || mod.version.length !== 3 || !mod.version.every((n) => typeof n === "number" && Number.isFinite(n))) {
        errors.push(`modules[${i}].version 应为长度为 3 的数字数组`);
      }
    }
  }
  if (Object.prototype.hasOwnProperty.call(parsed, "experimentalGameplay")) {
    errors.push(
      "禁止写入 experimentalGameplay。世界 Beta APIs 须在游戏 UI 打开；level.dat 实验键名按社区权威 wiki.bedrock.dev/nbt/enabling-experiments 为 experiments compound + byte=1（「Beta APIs」= gametest），非 Microsoft Learn 官方，不得当 API 规范写进 pack。pack JSON 打不开该开关。",
    );
  }
  const caps = parsed.capabilities;
  if (Array.isArray(caps)) {
    for (const c of caps) {
      if (typeof c === "string" && !BEDROCK_CAPABILITIES.includes(c)) {
        warnings.push(
          `未知 capability「${c}」；官方 pack-manifest capabilities 表只列 ${BEDROCK_CAPABILITIES.join(" / ")}`,
        );
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
  minEngineVersion: z
    .tuple([z.number().int(), z.number().int(), z.number().int()])
    .optional()
    .describe("必须长度为 3 的整数数组；默认 [1, 21, 80]"),
  beta: z.boolean().optional().describe("仅当用户明确要 pack 侧 @minecraft/server 的 version: \"beta\"（须在世界打开 Beta APIs）时为 true。不是 @minecraft/server-beta 包名。"),
  scriptEval: z.boolean().optional().describe("仅当需要 eval 时写入 capabilities: [script_eval]"),
  headerUuid: z.string().optional().describe("packType=resources/both 时写进 RP header；packType=data/script 时（只有 BP）直接写进 BP header。非法 UUID 会被忽略并随机生成。"),
  moduleUuid: z.string().optional().describe("同 headerUuid，作用于 module 条目。"),
  bpHeaderUuid: z.string().optional().describe("仅 packType=both：写进 BP/manifest.json 的 header uuid（不与 RP 共用，两包 header 同 uuid 会互相顶掉）。packType=data/script/resources 时被忽略并回 Warning。"),
  bpModuleUuid: z.string().optional().describe("仅 packType=both：写进 BP/manifest.json 的 module uuid。packType=data/script/resources 时被忽略并回 Warning。"),
  write: z.boolean().optional().describe("默认 false。true 时写入 projectPath（须 confirmed + MC_SKILL_ALLOW_WRITE=1 + MC_SKILL_PROJECT_ROOT；projectPath 不能替代后者）"),
  confirmed: z.boolean().optional().describe("write=true 时必填 true"),
  projectPath: z.string().optional().describe("写入目标工程根（须在 MC_SKILL_PROJECT_ROOT 内）"),
});

/**
 * C-29：**未钉住**的 uuid 一律现生成（crypto.randomUUID），不可复现；调用方传了合法 UUID 就原样采用。
 * 旧名 `fakeUuid(seed)` 带一个从不使用的 seed 形参，读起来像「同 seed → 同 uuid」，
 * 实测相反：`node dist/cli.js generate_addon_manifest --packName=demo --packType=both`
 * 连跑两次，RP/BP 的 4 个 uuid **全部不同**。故改名 freshUuid 并去掉假 seed 参数。
 */
function freshUuid(): string {
  return randomUUID();
}

export function generateAddonManifest(args: z.infer<typeof generateAddonManifestSchema>): Record<string, unknown> {
  const min = args.minEngineVersion ?? [1, 21, 80];
  const status = loadBedrockDocsStatus();
  const warnings: string[] = [];
  if (args.beta) {
    warnings.push(
      "该功能依赖实验性玩法 / Beta APIs。必须在世界设置打开「Beta APIs」。禁止把 experimentalGameplay 写入 pack JSON。Minecraft Education / BDS 无该 GUI，只能手改 level.dat：experiments compound 里加对应 byte=1（「Beta APIs」= gametest；键名出处 wiki.bedrock.dev = 社区权威，非 Learn 官方）。Learn：" +
        LEARN_EXPERIMENTS,
    );
  }
  if (min[0] < 1 || (min[0] === 1 && min[1] < 19) || (min[0] === 1 && min[1] === 19 && min[2] < 80)) {
    warnings.push(
      "min_engine_version 低于约 1.19.80：不要把现行 capabilities 列表倒灌到旧引擎；生成前对照该引擎版本的 Learn/wiki 归档。",
    );
  }
  if (args.scriptEval && args.packType === "resources") {
    warnings.push("script_eval 只写入行为包（BP）；资源包（RP）不会写入 capabilities。");
  }
  const stableVer = status.scriptApiStable ?? "1.11.0";
  warnings.push(
    `默认 @minecraft/server 版本取自 bedrock-docs-status.scriptApiStable（当前 ${stableVer}）。入库可能滞后，发布前对照 Learn。`,
  );

  /** C-29：哪个槽位是调用方钉住的、哪个是现生成的、哪个传值被拒 */
  const generatedUuidSlots: string[] = [];
  const rejectedUuidArgs: string[] = [];
  function pickUuid(caller: string | undefined, slot: string): string {
    if (caller && UUID_RE.test(caller)) return caller;
    if (caller) rejectedUuidArgs.push(slot);
    generatedUuidSlots.push(slot);
    return freshUuid();
  }
  const headerUuid = pickUuid(args.headerUuid, "headerUuid");
  const moduleUuid = pickUuid(args.moduleUuid, "moduleUuid");

  function one(type: "resources" | "data" | "script", hdr: string, mod: string): Record<string, unknown> {
    const modules: Record<string, unknown>[] = [
      {
        type: type === "script" ? "script" : type,
        uuid: mod,
        version: [1, 0, 0],
        ...(type === "script" ? { language: "javascript", entry: "scripts/main.js" } : {}),
      },
    ];
    const manifest: Record<string, unknown> = {
      format_version: 2,
      header: {
        name: args.packName,
        description: args.description ?? args.packName,
        uuid: hdr,
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
    if (args.scriptEval && type !== "resources") {
      manifest.capabilities = ["script_eval"];
      warnings.push(
        `script_eval 不在官方 pack-manifest capabilities 表（表内只有 ${BEDROCK_CAPABILITIES.join(" / ")}）；` +
          `validate_addon_manifest 会把它报成未知 capability。引擎是否真接受未核实，请对照目标引擎版本。`,
      );
    }
    return manifest;
  }

  const uuids: Record<"RP" | "BP", [string, string]> = { RP: [headerUuid, moduleUuid], BP: [headerUuid, moduleUuid] };
  const ignoredUuidArgs: string[] = [];
  if (args.packType === "both") {
    uuids.BP = [pickUuid(args.bpHeaderUuid, "bpHeaderUuid"), pickUuid(args.bpModuleUuid, "bpModuleUuid")];
  } else {
    for (const [slot, val] of [
      ["bpHeaderUuid", args.bpHeaderUuid],
      ["bpModuleUuid", args.bpModuleUuid],
    ] as const) {
      if (val) ignoredUuidArgs.push(slot);
    }
  }

  const files: Record<string, unknown> = {};
  if (args.packType === "resources") files["RP/manifest.json"] = one("resources", ...uuids.RP);
  else if (args.packType === "data") files["BP/manifest.json"] = one("data", ...uuids.BP);
  else if (args.packType === "script") files["BP/manifest.json"] = one("script", ...uuids.BP);
  else {
    files["RP/manifest.json"] = one("resources", ...uuids.RP);
    files["BP/manifest.json"] = one("data", ...uuids.BP);
  }

  if (generatedUuidSlots.length) {
    const pinArgs =
      args.packType === "data" || args.packType === "script"
        ? "headerUuid / moduleUuid"
        : args.packType === "both"
          ? "headerUuid / moduleUuid（RP）与 bpHeaderUuid / bpModuleUuid（BP）"
          : "headerUuid / moduleUuid";
    warnings.push(
      `uuid 槽位 ${generatedUuidSlots.join(" / ")} 由 crypto.randomUUID() 现生成，**不可复现**：` +
        `同参数再调一次得到的是另一组 uuid（实测连跑两次 generate_addon_manifest，RP/BP 四个 uuid 全变）。` +
        `pack 身份靠 uuid 识别，uuid 变了引擎会当成新 pack；要把同一包反复覆盖升级，请把本次返回值里的 uuid` +
        `在下次调用时用 ${pinArgs} 显式钉回。`,
    );
  }
  if (rejectedUuidArgs.length) {
    warnings.push(
      `${rejectedUuidArgs.join(" / ")} 传入值不是标准 UUID（需 8-4-4-4-12 十六进制），已忽略并改为现生成（同样不可复现）。`,
    );
  }
  if (ignoredUuidArgs.length) {
    warnings.push(
      `${ignoredUuidArgs.join(" / ")} 只在 packType=both（同时出 RP+BP）时生效；本次 packType=${args.packType} 只有一个包，` +
        `BP 的槽位是 headerUuid / moduleUuid，上述参数已完全忽略——若你以为已经钉住 BP uuid，请改用 headerUuid / moduleUuid 重调。`,
    );
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
  write: z.boolean().optional().describe("默认 false。true 时写入 projectPath（须 confirmed + MC_SKILL_ALLOW_WRITE=1 + MC_SKILL_PROJECT_ROOT；projectPath 不能替代后者）"),
  confirmed: z.boolean().optional().describe("write=true 时必填 true"),
  projectPath: z.string().optional().describe("写入目标工程根（须在 MC_SKILL_PROJECT_ROOT 内）"),
});

export function generateBpEntity(args: z.infer<typeof generateBpEntitySchema>): Record<string, unknown> {
  const warnings: string[] = [];
  const ident = args.identifier.replace(/\\/g, "/").split("/").pop() ?? args.identifier;
  const cleaned = ident.replace(/\.\./g, "").replace(/[^a-z0-9_:-]/gi, "");
  if (!cleaned.includes(":")) {
    return { ok: false, errors: ["identifier 必须是 namespace:name"], files: {} };
  }
  const entity = {
    format_version: "1.21.0",
    "minecraft:entity": {
      description: {
        identifier: cleaned,
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
    [`BP/entities/${cleaned.replace(":", "_")}.json`]: entity,
  };
  if (args.betaExplodeEvent) {
    files["script-snippet.js"] =
      `import { world } from "@minecraft/server";\n// Beta：BlockExplodeAfterEvent 等需 pack 侧 dependencies 声明 @minecraft/server version=beta，并在世界打开 Beta APIs。\nworld.afterEvents.blockExplode?.subscribe((ev) => {\n  console.warn("block exploded", ev.block);\n});\n`;
    const man = generateAddonManifest({
      packName: `${cleaned} scripts`,
      packType: "script",
      beta: true,
      minEngineVersion: [1, 21, 80],
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

export * from "./content-log.js";
