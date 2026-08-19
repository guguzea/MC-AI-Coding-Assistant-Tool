/**
 * Wave B/C/D MCP tool, prompt, and resource registration.
 */
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import * as z from "zod";
import { queryRegistry } from "../registry/index.js";
import { mixinAnalyze } from "../mixin/index.js";
import { auditResources } from "../audit-resources/index.js";
import { validateDatapackJson } from "../datapack/index.js";
import {
  generateModel,
  generateLang,
  generateNetworkPacket,
  generateCapability,
  generateConfig,
  generateEntityRenderer,
  generateWorldgen,
} from "../generators/index.js";
import { analyzeLog, getMigrationGuide, checkDependencies } from "../diagnostics/index.js";
import { getWorkflowTemplate, listKnowledgeResources, readKnowledgeResource } from "../prompts/index.js";
import { WORKFLOW_TEMPLATES } from "../prompts/templates.js";
import { mcSkillUpdate } from "../update/index.js";
import { localizeMod } from "../localize/index.js";
import { lookupObfuscated } from "../mappings/index.js";
import { validateAtHandler, validateAwHandler } from "../mixin/index.js";
import { downloadOfficialMdk } from "../mdk/index.js";
import {
  getMinecraftSourceHandler,
  analyzeModJarHandler,
  decompileModJarHandler,
  searchModCodeHandler,
} from "../decompile/index.js";
import { queryLoaderApi, searchLoaderApi, ingestLoaderApi } from "../loader-api/index.js";
import { detectModProject } from "../platform-pack/detect.js";
import { activatePlatformPack } from "../platform-pack/index.js";
import { checkPublishReady } from "../publish/index.js";
import { inspectRuntime } from "../runtime-inspect/index.js";

// ── Wave 工具 inputSchema（导出供 CLI list-tools / schema 驱动解析复用）────────
export const queryRegistrySchema = z.object({
  query: z.string().describe("资源 ID 或子串，如 stone、minecraft:diamond"),
  registry: z.string().optional().describe("限定注册表名，如 blocks、items"),
  version: z.string().optional().describe("MC 版本，必填，禁止默认 1.20.1"),
  limit: z.number().optional(),
});
export const mixinAnalyzeSchema = z.object({
  javaFiles: z
    .array(z.object({ path: z.string(), content: z.string() }))
    .optional(),
  mixinsJson: z.string().optional(),
  version: z.string().optional().describe("MC 版本，必填，禁止默认 1.20.1"),
  deep: z
    .boolean()
    .optional()
    .describe("true 时基于已缓存 remapped 客户端 jar 做字节码级校验（默认 false；jar 未缓存返回 CACHE_MISS 引导，不自动下载）"),
  jarPath: z
    .string()
    .optional()
    .describe("客户端 jar 绝对路径（deep:true 时优先于缓存扫描）"),
  projectPath: z.string().optional().describe("模组项目根：扫 mixin 相关 java 与 mixins.json（显式正文优先）"),
});
export const auditResourcesSchema = z.object({
  resourceRoot: z.string().describe("assets 根目录，如 src/main/resources/assets/<modid>"),
  modId: z.string().optional(),
});
export const validateDatapackJsonSchema = z.object({
  jsonContent: z.string(),
  kind: z.enum(["recipe", "loot_table", "advancement", "tag"]),
  version: z.string().optional().describe("MC 版本，必填，禁止默认 1.20.1"),
});
export const getWorkflowTemplateSchema = z.object({
  name: z.enum([
    "mc-new-block",
    "mc-new-entity",
    "mc-new-gui",
    "mc-crash-triage",
    "mc-port-mod",
    "mc-build-mod",
    "mc-ingame-iterate",
    "mc-localize-mod",
    "mc-decompile-mod",
    "mc-new-item",
    "mc-new-blockentity",
    "mc-mixin",
    "mc-worldgen",
    "mc-config",
    "mc-gametest",
    "mc-publish",
    "mc-setup-env",
    "mc-networking",
    "mc-capability",
    "mc-recipe-data",
    "mc-audio-vfx",
    "mc-commands",
    "mc-dimension-structure",
    "mc-access",
    "mc-bedrock-addon",
    "mc-full-mod",
  ]),
});
export const localizeModSchema = z.object({
  mode: z.enum(["own", "third_party"]),
  action: z.enum(["diff", "draft_zh", "extract", "pack_draft"]),
  modId: z.string().optional(),
  sourceJson: z.union([z.string(), z.record(z.string())]).optional()
    .describe("源语言 JSON（优先于 enUsJson）"),
  enUsJson: z.union([z.string(), z.record(z.string())]).optional()
    .describe("源语言 JSON（兼容名）"),
  zhCnJson: z.union([z.string(), z.record(z.string())]).optional(),
  jarPath: z.string().optional().describe("third_party：本地 jar 绝对路径"),
  namespace: z.string().optional(),
  sourceLocale: z.string().optional().describe("强制源语种，如 en_gb / de_de"),
  existingZhJson: z.union([z.string(), z.record(z.string())]).optional(),
  mcVersion: z.string().optional().describe("用于 pack_format 默认映射"),
});
export const listKnowledgeResourcesSchema = z.object({});
export const readKnowledgeResourceSchema = z.object({ uri: z.string() });
export const ANALYZE_LOG_DESCRIPTION = "Analyze game / crash log excerpt";
export const READ_KNOWLEDGE_RESOURCE_DESCRIPTION = "Read knowledge resource by URI";
export const generateModelSchema = z.object({
  modId: z.string(),
  blockName: z.string(),
  version: z.string().describe("必填 MC 版本"),
});
export const generateLangSchema = z.object({
  modId: z.string(),
  entries: z.record(z.string()),
  version: z.string().describe("必填 MC 版本"),
});
export const generateNetworkPacketSchema = z.object({
  modId: z.string(),
  packetName: z.string(),
  platform: z
    .enum(["forge_1.20.1", "neoforge_1.20.4", "neoforge_1.21", "neoforge_26.1", "fabric_1.21", "fabric_26.1"])
    .describe("必填。须带版本后缀；禁止只传 fabric / neoforge"),
});
export const generateCapabilitySchema = z.object({
  modId: z.string(),
  name: z.string(),
  platform: z.enum(["forge", "neoforge", "fabric", "quilt"]).describe("必填。forge=Capability；neoforge=1.20.4+ Data Attachment；fabric/quilt 改口 CCA"),
  version: z.string().describe("必填。forge 1.20.1 Capability；neoforge 仅 1.20.4+ Attachment"),
});
export const generateConfigSchema = z.object({
  modId: z.string(),
  loader: z.enum(["forge", "neoforge", "fabric", "quilt"]).describe("必填，禁止默认 forge"),
  version: z.string().describe("必填。neoforge 1.20.4 用 ForgeConfigSpec+neoforged；1.21+/26.1 用 ModConfigSpec；fabric/quilt 为 Cloth Config 骨架"),
});
export const generateEntityRendererSchema = z.object({
  modId: z.string(),
  entityName: z.string(),
  platform: z.enum(["forge", "neoforge", "fabric", "quilt"]).describe("必填。forge 1.20.1/1.20.4 与 neoforge 26.1 生成代码"),
  version: z.string().describe("必填。forge 仅 1.20.1 / 1.20.4；neoforge 仅 26.1"),
});
export const generateWorldgenSchema = z.object({
  modId: z.string(),
  featureName: z.string(),
  platform: z.enum(["forge", "neoforge", "fabric", "quilt"]).describe("必填。fabric/quilt 不出 forge/biome_modifier"),
  version: z.string().describe("必填 MC 版本"),
});
export const analyzeLogSchema = z.object({
  logText: z.string().optional().describe("日志全文（与 logPath 二选一）"),
  logPath: z.string().optional().describe("日志文件路径（与 logText 二选一）"),
  version: z.string().optional().describe("MC 版本，必填，禁止默认 1.20.1"),
});
export const getMigrationGuideSchema = z.object({
  route: z.string().describe("迁移路线，如 1.21.11->26.1 或 forge->neoforge"),
  full: z.boolean().optional().describe("默认 false：只返回 Primer 目录；true 才返回全文。与 section 同时传时以 section 为准"),
  section: z.string().optional().describe("只返回匹配该标题的一章（子串匹配 toc）；不要一次拉整篇 26.2"),
  platform: z.string().optional().describe("forge / neoforge / fabric，写入返回 JSON"),
});
export const checkDependenciesSchema = z.object({
  buildGradle: z.string().optional().describe("build.gradle 全文（基岩包可传空字符串或占位；与 projectPath 二选一）"),
  modsToml: z.string().optional().describe("mods.toml 全文（Forge；NeoForge 内容也可并入）"),
  fabricModJson: z.string().optional().describe("fabric.mod.json 全文（Fabric 工程；loader 冲突检测必需）"),
  neoModsToml: z.string().optional().describe("neoforge.mods.toml 全文（可选；亦可并入 modsToml）"),
  quiltModJson: z.string().optional().describe("quilt.mod.json 全文"),
  litemodJson: z.string().optional().describe("litemod.json 全文"),
  riftmodJson: z.string().optional().describe("riftmod.json 全文"),
  addonManifest: z.string().optional().describe("基岩 manifest.json 全文"),
  projectPath: z.string().optional().describe("模组项目根：扫 gradle 与元数据（显式正文优先）"),
});
export const mcSkillUpdateSchema = z.object({
  action: z.enum(["check", "apply"]).describe("check=只读探测；apply=预演或执行更新"),
  scope: z.enum(["tooling", "data", "all"]).optional().describe("默认 all"),
  dryRun: z.boolean().optional().describe("仅 apply：默认 true"),
  confirmed: z.boolean().optional().describe("apply 且 dryRun=false 时必须 true"),
  allowDirty: z.boolean().optional(),
  stashDirty: z.boolean().optional().describe("allowDirty 时可选先 stash 再 merge 再 pop"),
  channel: z.enum(["stable", "latest", "tag"]).optional().describe("默认 stable"),
  tagName: z.string().optional(),
  includePrerelease: z.boolean().optional().describe("true 时等价 channel=latest"),
});
export const downloadOfficialMdkSchema = z.object({
  platform: z.enum(["forge", "neoforge", "fabric", "quilt", "liteloader", "rift"]),
  minecraftVersion: z.string().describe("精确 MC 版本，禁止用邻版 MDK 冒充"),
  buildPlugin: z
    .enum(["moddevgradle", "neogradle", "forgegradle", "loom", "quilt-loom"])
    .optional()
    .describe("26.1.1/26.1.2/26.2 均同时提供 ModDevGradle 与 NeoGradle，必须显式选择"),
  dryRun: z.boolean().optional().default(true),
  confirmed: z.boolean().optional().describe("写入用户工程时必须 true"),
  destPath: z.string().optional().describe("可选：解压到用户工程（需 ALLOW_WRITE）"),
  allowCacheFallback: z.boolean().optional().describe("官方 URL 404 时仅允许同一 platform+version 的 cache"),
});
export const lookupObfuscatedSchema = z.object({
  name: z.string().describe("混淆/中间名 token，如 method_6032、er、func_110143_aJ、field_100013_f"),
  version: z.string().describe("MC 版本（必填，禁止默认 1.20.1）。先 list_forge_versions / list_fabric_versions"),
});
// ── T2 反编译工具族（wave 21–24）──────────────────────────────────────────────
export const getMinecraftSourceSchema = z.object({
  version: z.string().optional().describe("MC 版本，必填，禁止默认 1.20.1（支持 1.14–1.21.11 与 26.1+）"),
  className: z.string().describe("完整类名，如 net.minecraft.world.item.Item"),
  mapping: z
    .enum(["yarn", "mojmap", "auto"])
    .optional()
    .describe("默认 auto：1.14–1.21.11 → yarn；26.1+ → mojmap（免 remap）"),
  lines: z
    .tuple([z.number(), z.number()])
    .optional()
    .describe("[start, end] 1-based 行区间，默认前 120 行"),
  force: z.boolean().optional().describe("true 时忽略缓存重新反编译"),
});
export const analyzeModJarSchema = z.object({
  jarPath: z.string().describe("本地 jar 绝对路径（v1 仅本地，不支持 URL）"),
  version: z.string().optional().describe("MC 版本（保留字段，暂不影响解析）"),
});
export const decompileModJarSchema = z.object({
  jarPath: z.string().describe("本地 jar 绝对路径"),
  version: z.string().optional().describe("匹配的 MC 版本（可选 remap 用；26.1+ 免 remap）"),
  mapping: z.enum(["yarn", "mojmap"]).optional().describe("remap 映射层，默认 yarn（仅 1.14–1.21.11）"),
  force: z.boolean().optional().describe("true 时忽略缓存重新反编译"),
});
export const searchModCodeSchema = z.object({
  jarPath: z.string().optional().describe("本地 jar 绝对路径（须先 decompile_mod_jar）"),
  decompiledDir: z.string().optional().describe("已反编译源码目录绝对路径（优先于 jarPath）"),
  query: z.string().describe("检索词（默认子串匹配；pattern=true 时为正则）"),
  pattern: z.boolean().optional().describe("true 时 query 视为正则"),
  maxResults: z.number().optional().describe("最大命中数，默认 100，上限 500"),
});
// ── T4 字节码级校验（wave 25–26）──────────────────────────────────────────────
export const validateAtSchema = z.object({
  atContent: z
    .string()
    .optional()
    .describe("Forge/NeoForge `*_at.cfg` 内容（多个文件可用 `# ===== file: 名字 =====` 分隔以检测跨文件冲突）"),
  projectPath: z
    .string()
    .optional()
    .describe("模组项目根目录：只读扫描 `**/META-INF/*_at.cfg`（跳过 node_modules/build/.gradle 等）；可与 atContent 合并"),
  version: z.string().describe("MC 版本（必填，禁止默认 1.20.1，用于定位缓存 jar）"),
  jarPath: z
    .string()
    .optional()
    .describe("客户端 jar 绝对路径（优先于 $MC_SKILL_CACHE 缓存扫描）"),
});
export const validateAwSchema = z.object({
  awContent: z
    .string()
    .optional()
    .describe("Fabric `.accesswidener` 内容（多个文件可用 `# ===== file: 名字 =====` 分隔以检测跨文件冲突）"),
  projectPath: z
    .string()
    .optional()
    .describe("模组项目根目录：只读扫描 `**/*.accesswidener`（跳过构建/IDE 目录）；可与 awContent 合并"),
  version: z.string().describe("MC 版本（必填，禁止默认 1.20.1，用于定位缓存 jar）"),
  jarPath: z
    .string()
    .optional()
    .describe("客户端 jar 绝对路径（优先于 $MC_SKILL_CACHE 缓存扫描）"),
});

export const queryLoaderApiSchema = z.object({
  platform: z.string().describe("forge / neoforge / fabric / quilt / liteloader / rift / modloader（必填，无默认）"),
  minecraftVersion: z.string().describe("精确 MC 版本，如 1.21.1 / 26.1（必填，无默认 Forge 1.20.1）"),
  className: z.string().describe("FQCN 或 simpleName；嵌套类用 Outer$Inner"),
});
export const searchLoaderApiSchema = z.object({
  platform: z.string().optional().describe("search 必填；mode=list 时可省略以列出全部已索引档"),
  minecraftVersion: z.string().optional(),
  query: z.string().optional().describe("fqcnIndex 子串（mode=search 必填）"),
  mode: z.enum(["search", "list"]).optional().describe("默认 search；list 列出已索引/skipped/overlay"),
  limit: z.number().optional().describe("默认 20，封顶 50"),
  offset: z.number().optional(),
});
export const ingestLoaderApiSchema = z.object({
  platform: z.string(),
  minecraftVersion: z.string(),
  jarPath: z.string().describe("自备 jar 绝对路径（不要用 --file）"),
  mappingsVersion: z.string().describe("必填，禁止猜 Yarn/MCP"),
  mappingsSource: z.string().optional(),
  dryRun: z.boolean().optional().default(true),
  confirmed: z.boolean().optional(),
});
export const detectModProjectSchema = z.object({
  projectPath: z
    .string()
    .optional()
    .describe("模组工程绝对路径（CLI --project 注入此字段）。优先于 MC_SKILL_PROJECT_ROOT"),
});
export const activatePlatformPackSchema = z.object({
  action: z.enum(["list", "session", "write", "deactivate"]),
  platform: z.string().optional().describe("session/write 必填"),
  minecraftVersion: z.string().optional(),
  hosts: z
    .array(z.string())
    .optional()
    .describe("write/deactivate 必填：cursor|claude|continue|trae|opencode|codex|zcode|pi，或 all。禁止默认 Cursor"),
  topics: z
    .array(z.string())
    .optional()
    .describe(
      "session：只追加规则号到底座 00/01/09（并集，永不替换）。永远不注入 skillBodies。mixin 只作 skill hint→nextReads。",
    ),
  includeAllRules: z.boolean().optional().describe("session：true 灌 00–10 规则全文，仍不自动灌全部 Skill 正文。"),
  task: z
    .string()
    .optional()
    .describe(
      "session：只追加其映射规则号（与 topics 并集）。建议 skill 名可进 skillBodies。未知 task 仍 ok，rulesMode=base。",
    ),
  skillNames: z
    .array(z.string())
    .optional()
    .describe(
      "session：与 task 建议名去重后注入 skillBodies（总条数上限 6）。先查平台包 skills[]，未命中再查已按版本过滤的 libSkills[]。",
    ),
  includeSkills: z.boolean().optional().describe("deprecated：仅 write。仅当未传 writeSkillStubs 时映射为 stub 开关。不要和 session 的 skillNames 混用。"),
  writeSkillStubs: z.boolean().optional().describe("write：写 Skill stub。二者都传时以本字段为准。未传 writeSkillStubs 且未传 includeSkills 时默认 true。"),
  includeSkillBodies: z.boolean().optional().describe("write：true 才写 Skill 全文；默认 false（只写 stub）。"),
  dryRun: z.boolean().optional().default(true),
  confirmed: z.boolean().optional(),
  projectPath: z.string().optional().describe("用户模组工程绝对路径（CLI --project）。write 真写只认此 allowlist"),
});
export const checkPublishReadySchema = z.object({
  projectPath: z.string().optional().describe("模组工程根：扫元数据与 build/libs"),
  modsToml: z.string().optional(),
  fabricModJson: z.string().optional(),
  quiltModJson: z.string().optional(),
  neoModsToml: z.string().optional(),
});
export const inspectRuntimeSchema = z.object({
  logsDir: z.string().optional().describe("用户确认的日志目录（优先，只读该路径）"),
  crashReportsDir: z.string().optional().describe("crash-reports 目录"),
  projectPath: z.string().optional().describe("未传 logsDir 时有界探测 run/logs 等，禁止全盘"),
  maxLines: z.number().optional().describe("日志尾部行数，默认 200，封顶 2000"),
  maxBytes: z.number().optional().describe("读取字节上限，默认 512KiB"),
  version: z.string().optional().describe("MC 版本（可选）。缺省仍读日志/crashKind，analysisComplete=false"),
});

function jsonResult(obj: unknown): CallToolResult {
  return { content: [{ type: "text", text: JSON.stringify(obj, null, 2) }] };
}

export function registerWaveExtensions(server: McpServer): void {
  // ── Wave B: P0 tools ─────────────────────────────────────────────────────
  server.registerTool(
    "query_registry",
    {
      title: "Query Vanilla Registry IDs",
      description:
        "查询 Vanilla 注册表资源 ID（minecraft:stone）。nameLayer=registry_id；类/方法映射请用 convert_mapping。" +
        "【边界】不是模组 DeferredRegister / Fabric Registry。",
      inputSchema: queryRegistrySchema,
    },
    async (args): Promise<CallToolResult> => jsonResult(queryRegistry(args)),
  );

  server.registerTool(
    "mixin_analyze",
    {
      title: "Deep Mixin injection analysis",
      description:
        "解析 mixins.json 与 @Mixin 源码，校验 @Inject/@Redirect 等方法目标（多映射层）。高风险工具，见 supportMatrix。\n" +
        "deep:true 时基于已缓存 remapped 客户端 jar 做字节码级校验（目标类/方法选择器/@At 调用点）；jar 未缓存返回 CACHE_MISS 引导，不自动下载。",
      inputSchema: mixinAnalyzeSchema,
    },
    async (args): Promise<CallToolResult> => jsonResult(await mixinAnalyze(args)),
  );

  server.registerTool(
    "audit_resources",
    {
      title: "Audit mod resource pack graph",
      description: "静态检查模型引用的纹理、孤儿纹理、modId 命名等问题。",
      inputSchema: auditResourcesSchema,
    },
    async (args): Promise<CallToolResult> => jsonResult(auditResources(args)),
  );

  server.registerTool(
    "validate_datapack_json",
    {
      title: "Validate datapack JSON (lite schema)",
      description:
        "recipe / loot_table / advancement / tag 的精简 JSON 校验。" +
        "minecraft:crafting_special_* 与 smithing_trim 等无 result 不报错；普通 crafting_shaped 缺 result 仍报。" +
        "【边界】不是全 pack_format 官方 schema。",
      inputSchema: validateDatapackJsonSchema,
    },
    async (args): Promise<CallToolResult> => jsonResult(validateDatapackJson(args)),
  );

  server.registerTool(
    "get_workflow_template",
    {
      title: "Get workflow template (Prompt fallback)",
      description:
        "返回与 MCP Prompt 同名的工作流全文；Cursor 等仅支持 tools 时使用。" +
        "仅在用户要完整流程（从零建模组、崩溃分诊、移植）时调用；给已有工程加方块/改代码不要调。",
      inputSchema: getWorkflowTemplateSchema,
    },
    async ({ name }): Promise<CallToolResult> => jsonResult(getWorkflowTemplate(name)),
  );

  server.registerTool(
    "localize_mod",
    {
      title: "Localize mod lang (diff / draft / jar pack)",
      description:
        "自有模组 diff/draft_zh，或第三方 jar extract/pack_draft。无机器翻译；标 needsTranslation。" +
        "无 en_us 时回退其它语言文件作源。默认只返回文本/files，不写盘。",
      inputSchema: localizeModSchema,
    },
    async (args): Promise<CallToolResult> => jsonResult(localizeMod(args)),
  );

  server.registerTool(
    "list_knowledge_resources",
    {
      title: "List MCP knowledge resource URIs",
      description: "列出 mcskill:// 资源 URI；配合 read_knowledge_resource 读取正文。",
      inputSchema: listKnowledgeResourcesSchema,
    },
    async (): Promise<CallToolResult> => jsonResult({ resources: listKnowledgeResources() }),
  );

  server.registerTool(
    "read_knowledge_resource",
    {
      title: "Read knowledge resource by URI",
      description: READ_KNOWLEDGE_RESOURCE_DESCRIPTION,
      inputSchema: readKnowledgeResourceSchema,
    },
    async ({ uri }): Promise<CallToolResult> => jsonResult(readKnowledgeResource(uri)),
  );

  // ── Wave C: generators ───────────────────────────────────────────────────

  server.registerTool("generate_model", {
    title: "Generate block model JSON templates",
    description: "Generate block model JSON templates。version 必填。返回方块模型 JSON 骨架文本，不写盘。",
    inputSchema: generateModelSchema,
  }, async (a) => jsonResult(generateModel(a.modId, a.blockName, a.version)));

  server.registerTool("generate_lang", {
    title: "Generate en_us + zh_cn lang JSON",
    description: "Generate en_us + zh_cn lang JSON。version 必填。返回 en_us/zh_cn lang JSON 骨架，不写盘、无机器翻译。",
    inputSchema: generateLangSchema,
  }, async (a) => jsonResult(generateLang(a.modId, a.entries, a.version)));

  server.registerTool("generate_network_packet", {
    title: "Generate network packet skeleton",
    description: "Generate network packet skeleton。返回网络包 Java 骨架文本，不写盘。",
    inputSchema: generateNetworkPacketSchema,
  }, async (a) =>
    jsonResult(generateNetworkPacket(a.modId, a.packetName, a.platform)));

  server.registerTool("generate_capability", {
    title: "Generate Capability / DataAttachment skeleton",
    description:
      "Generate Capability / DataAttachment skeleton。platform 与 version 必填。" +
      "forge 1.20.1 Capability；neoforge 1.20.4+ Attachment；fabric/quilt → error 改口 CCA。返回骨架文本，不写盘。",
    inputSchema: generateCapabilitySchema,
  }, async (a) => jsonResult(generateCapability(a.modId, a.name, a.platform, a.version)));

  server.registerTool("generate_config", {
    title: "Generate config spec skeleton",
    description:
      "Generate config spec skeleton。loader 与 version 必填，禁止默认 forge。" +
      "neoforge 1.21+/26.1 用 ModConfigSpec；1.20.4 用 ForgeConfigSpec + net.neoforged。fabric/quilt 改口 mc-config。不写盘。",
    inputSchema: generateConfigSchema,
  }, async (a) => jsonResult(generateConfig(a.modId, a.loader, a.version)));

  server.registerTool("generate_entity_renderer", {
    title: "Generate entity renderer skeleton",
    description:
      "Generate entity renderer skeleton。platform 与 version 必填。支持 forge 1.20.1 / 1.20.4（@OnlyIn）与 neoforge 26.1（EntityRenderer + Identifier）。" +
      "fabric/quilt 直接 error。返回实体渲染器骨架文本，不写盘。",
    inputSchema: generateEntityRendererSchema,
  }, async (a) => jsonResult(generateEntityRenderer(a.modId, a.entityName, a.platform, a.version)));

  server.registerTool("generate_worldgen", {
    title: "Generate worldgen JSON templates",
    description:
      "Generate worldgen JSON templates。platform 与 version 必填。Fabric/Quilt 只出 feature JSON，禁止 forge biome_modifier。返回骨架文本，不写盘。",
    inputSchema: generateWorldgenSchema,
  }, async (a) => jsonResult(generateWorldgen(a.modId, a.featureName, a.platform, a.version)));

  // ── Wave C: diagnostics ──────────────────────────────────────────────────
  server.registerTool("analyze_log", {
    title: "Analyze game / crash log excerpt",
    description: ANALYZE_LOG_DESCRIPTION,
    inputSchema: analyzeLogSchema,
  }, async (a) => jsonResult(analyzeLog(a)));

  server.registerTool("get_migration_guide", {
    title: "Get built-in migration guide summary",
    description:
      "迁移路线摘要。默认返回 Primer 章节目录（toc）；section 只返回该章；full=true 才全文。" +
      "route 如 1.21.11->26.1 / 26.2 / forge->neoforge。platform 写入返回 JSON。同轮最多 1–2 hop，不要把 26.2 四千行复述给用户。",
    inputSchema: getMigrationGuideSchema,
  }, async (a) => jsonResult(getMigrationGuide(a.route, { full: a.full, platform: a.platform, section: a.section })));

  server.registerTool("check_dependencies", {
    title: "Check Gradle / mods.toml dependency hints",
    description:
      "根据 build.gradle / mods.toml / fabric.mod.json / quilt.mod.json / litemod.json / riftmod.json / 基岩 manifest 提示依赖问题：loader 判定、" +
      "库模组识别（library-catalog 接线）、跨加载器冲突（owo/CCA/Polymer/Trinkets 等）与陷阱。" +
      "Quilt 在 Fabric 前；LiteLoader 混合只认 net.minecraftforge.gradle.liteloader。" +
      "【边界】启发式 + catalog，不是 Gradle 依赖解析器；未收录库可能漏报。",
    inputSchema: checkDependenciesSchema,
  }, async (a) => jsonResult(checkDependencies(a.buildGradle ?? "", a.modsToml, a.fabricModJson, a.neoModsToml, {
    quiltModJson: a.quiltModJson,
    litemodJson: a.litemodJson,
    riftmodJson: a.riftmodJson,
    addonManifest: a.addonManifest,
    projectPath: a.projectPath,
  })));

  server.registerTool(
    "mc_skill_update",
    {
      title: "Check / apply MC_skill tooling+data updates",
      description:
        "检查 GitHub Release 是否有新版本；确认后可更新 tooling（git ff-only + npm build）与 data（zip+SHA256）。" +
        "默认 channel=stable（忽略预发布）。apply 默认 dryRun；真写需 confirmed=true + MC_SKILL_ALLOW_WRITE=1 + MC_SKILL_PROJECT_ROOT=仓库根。",
      inputSchema: mcSkillUpdateSchema,
    },
    async (args): Promise<CallToolResult> => jsonResult(await mcSkillUpdate(args)),
  );

  server.registerTool(
    "download_official_mdk",
    {
      title: "Download official MDK (pinned commit, cache only)",
      description:
        "下载官方 MDK 到 $MC_SKILL_CACHE/mdk/<platform>/<version>/<plugin>/。" +
        "GitHub 必须 pin commit SHA（见 data/mdk-checksums.json），不对 branch HEAD zip 做校验和。" +
        "默认 dryRun。26.1.1 / 26.1.2 / 26.2 均同时提供 ModDevGradle 与 NeoGradle，须传 buildPlugin。" +
        "白名单落到具体 repo：NeoForgeMDKs/MDK-*、MinecraftForge/MinecraftForge、FabricMC/fabric-example-mod、QuiltMC/quilt-template-mod。" +
        "写入用户工程需 confirmed + MC_SKILL_ALLOW_WRITE + MC_SKILL_PROJECT_ROOT。LiteLoader 禁止再分发。",
      inputSchema: downloadOfficialMdkSchema,
    },
    async (args): Promise<CallToolResult> => jsonResult(await downloadOfficialMdk(args)),
  );

  server.registerTool(
    "lookup_obfuscated",
    {
      title: "Lookup obfuscated / intermediary mapping (crash-log deobfuscation)",
      description:
        "崩溃日志反混淆：单 token 反查混淆短名（er）/ intermediary（method_6032）/ SRG（func_110143_aJ）→ yarn 可读名 + ownerClass + descriptor。\n" +
        "方法优先 → 字段 → 类；多命中返回 AMBIGUOUS。26.1+ 无混淆层，返回 UNOBFUSCATED_NO_YARN。",
      inputSchema: lookupObfuscatedSchema,
    },
    async (args): Promise<CallToolResult> => jsonResult(lookupObfuscated(args)),
  );

  // ── Wave C: decompile tools (T2) ───────────────────────────────────────────
  server.registerTool(
    "get_minecraft_source",
    {
      title: "Get decompiled Minecraft source (on-demand download + remap)",
      description:
        "按需下载/重映射/反编译真实 MC 源码并返回类源码片段（支持行区间）。默认零下载：仅显式调用才下载到 $MC_SKILL_CACHE。\n" +
        "支持矩阵：1.14–1.21.11 → yarn（两步 remap official→intermediary→named）或 mojmap；26.1+ → mojmap-only（免 remap）。\n" +
        "首次约 3–10 分钟，同版本缓存命中 <1s。需 Java 17+；缺失时返回 TOOLCHAIN_MISSING 安装指引。\n" +
        "⚠️ 仅当需要完整源码/反编译时才用本工具；仅查方法签名请用 query_api / get_method_params\n" +
        "⚠️ 下载量大。1.16.5–1.20.4 Vanilla 签名用 query_api；平台 API 用 search_*_docs；26.1+ 无 query_api 索引。",
      inputSchema: getMinecraftSourceSchema,
    },
    async (args): Promise<CallToolResult> => jsonResult(await getMinecraftSourceHandler(args)),
  );

  server.registerTool(
    "analyze_mod_jar",
    {
      title: "Analyze mod jar metadata (fabric/forge/neoforge)",
      description:
        "解析本地 mod jar 元数据：quilt.mod.json / fabric.mod.json / mods.toml / litemod.json / riftmod.json / 基岩 manifest.json、mixins、依赖、AT/AW。\n" +
        "同时有 Forge 与 litemod.json 时 loaders 含 forge+liteloader。纯 Node zip 解析，不写盘。\n" +
        "纯 Node 解析（zip），无需 Java、零下载、不写盘。仅本地绝对路径。\n" +
        "⚠️ 仅当需要完整源码/反编译时才用本工具；仅查方法签名请用 query_api / get_method_params\n" +
        "⚠️ 只解析元数据，不反编译、不给方法体。要源码用 decompile_mod_jar。",
      inputSchema: analyzeModJarSchema,
    },
    async (args): Promise<CallToolResult> => jsonResult(analyzeModJarHandler(args)),
  );

  server.registerTool(
    "decompile_mod_jar",
    {
      title: "Decompile mod jar with VineFlower (on-demand)",
      description:
        "按需反编译本地 mod jar → $MC_SKILL_CACHE/decompiled-mods/<modId>/<version>/，返回源码树摘要。\n" +
        "可选 remap（需匹配 MC 版本；26.1+ 免 remap）。需 Java 17+（VineFlower）；默认零下载（仅显式调用时下载工具 jar）。\n" +
        "⚠️ 仅当需要完整源码/反编译时才用本工具；仅查方法签名请用 query_api / get_method_params\n" +
        "⚠️ 下载量大。不给 jar 元数据（用 analyze_mod_jar）；26.1+ Vanilla 签名不要指望 query_api。",
      inputSchema: decompileModJarSchema,
    },
    async (args): Promise<CallToolResult> => jsonResult(await decompileModJarHandler(args)),
  );

  server.registerTool(
    "search_mod_code",
    {
      title: "Search already-decompiled mod source (grep)",
      description:
        "对已反编译的模组源码做行级检索（子串或正则），返回 file:line 命中。\n" +
        "入口二选一：decompiledDir（反编译目录）或 jarPath（须先 decompile_mod_jar 并缓存）。纯 Node，无 Java 需求。\n" +
        "⚠️ 仅当需要完整源码/反编译时才用本工具；仅查方法签名请用 query_api / get_method_params\n" +
        "⚠️ 源码未反编译时返回 NOT_FOUND，不会自动 decompile。",
      inputSchema: searchModCodeSchema,
    },
    async (args): Promise<CallToolResult> => jsonResult(searchModCodeHandler(args)),
  );

  // ── Wave D: 字节码级校验（T4）──────────────────────────────────────────────
  server.registerTool(
    "validate_at",
    {
      title: "Validate Forge Access Transformer against client jar bytecode",
      description:
        "校验 `*_at.cfg`：目标类/成员必须存在于 remapped 客户端 jar（含继承成员、record 组件、Outer$Inner 内部类）；" +
        "SRG/混淆名与 jar 映射层不匹配时给出 convert_mapping 建议；多文件冲突告警。\n" +
        "jar 来源：jarPath 参数 > $MC_SKILL_CACHE 缓存扫描；未缓存返回 CACHE_MISS 引导（先调 get_minecraft_source，不自动下载）。",
      inputSchema: validateAtSchema,
    },
    async (args): Promise<CallToolResult> => jsonResult(validateAtHandler(args)),
  );

  server.registerTool(
    "validate_aw",
    {
      title: "Validate Fabric Access Widener against client jar bytecode",
      description:
        "校验 `.accesswidener`：header/namespace、accessible/extendable/mutable/transitive 条目、目标类/成员存在性" +
        "（含继承成员、record 组件、内部类）、跨文件冲突告警。\n" +
        "jar 来源：jarPath 参数 > $MC_SKILL_CACHE 缓存扫描；未缓存返回 CACHE_MISS 引导（先调 get_minecraft_source，不自动下载）。",
      inputSchema: validateAwSchema,
    },
    async (args): Promise<CallToolResult> => jsonResult(validateAwHandler(args)),
  );

  server.registerTool(
    "query_loader_api",
    {
      title: "Query loader / modding API class (not Vanilla query_api)",
      description:
        "查询 Forge/NeoForge/Fabric-API/QSL 等 loader 摘要中的类与 MethodInfo。必填 platform+minecraftVersion，无默认 1.20.1。" +
        "不是 query_api（Parchment Vanilla）。found:false 不代表游戏里没有该类。LiteLoader/Rift/ModLoader 无摘要时 PLATFORM_SKIPPED（可 ingest）。",
      inputSchema: queryLoaderApiSchema,
    },
    async (args): Promise<CallToolResult> => jsonResult(queryLoaderApi(args)),
  );
  server.registerTool(
    "search_loader_api",
    {
      title: "Search loader-api FQCN index or list indexed packs",
      description:
        "在 loader-api-summaries 的 fqcnIndex 上子串搜索（limit 默认 20 封顶 50）。mode=list 列出已索引档、skipped、cache overlay。必填 platform+version（list 可省略以列出全部）。",
      inputSchema: searchLoaderApiSchema,
    },
    async (args): Promise<CallToolResult> => jsonResult(searchLoaderApi(args)),
  );
  server.registerTool(
    "ingest_loader_api",
    {
      title: "Ingest a user-provided loader jar into cache overlay",
      description:
        "把用户自备的 LiteLoader/Rift/ModLoader（等官方不代下）jar 抽成摘要，只写 $MC_SKILL_CACHE/loader-api-summaries overlay，禁止写仓库 data/。" +
        "jarPath 绝对路径 + mappingsVersion 必填。默认 dryRun。",
      inputSchema: ingestLoaderApiSchema,
    },
    async (args): Promise<CallToolResult> => jsonResult(await ingestLoaderApi(args)),
  );
  server.registerTool(
    "detect_mod_project",
    {
      title: "Detect mod loader / MC version / platform pack",
      description:
        "只读探测用户模组工程：Quilt 在 Fabric 前；LiteLoader 混合插件。projectPath（CLI --project）优先于 MC_SKILL_PROJECT_ROOT。" +
        "对不上规则树 → PACK_NOT_FOUND，禁止邻档 00–10。",
      inputSchema: detectModProjectSchema,
    },
    async (args): Promise<CallToolResult> => jsonResult(detectModProject(args)),
  );
  server.registerTool(
    "activate_platform_pack",
    {
      title: "Activate platform rules for session or write into a mod project",
      description:
        "list / session / write / deactivate。session 不写盘、不依赖项目根：默认规则 00/01/09 + Skill 索引。" +
        "topics/task 只追加规则到底座（并集），永不替换。skillNames 与 task 建议名去重后注入 skillBodies（总条数上限 6）；topics 永不注入正文。" +
        "库 Skill 不进 nextReads，只有显式 skillNames 才注入库正文。" +
        "includeSkills 已 deprecated，仅在未传 writeSkillStubs 时映射为 stub 开关。write 默认写 Skill stub（未传 writeSkillStubs 且未传 includeSkills 时）。includeSkillBodies 才写全文。" +
        "ok=true 且带「仅底座」warning = 平台包可用但规则未按任务扩展（不要当失败，也不要当已灌 02–10）。" +
        "rulesMode：includeAllRules=true→all；否则有效 task/topics 且规则集大于底座→extended；否则 base。" +
        "write 默认 dryRun；hosts 必填；目标只能是用户模组工程（拒绝知识库根）。不能开关 IDE 扫描器。",
      inputSchema: activatePlatformPackSchema,
    },
    async (args): Promise<CallToolResult> => jsonResult(activatePlatformPack(args)),
  );
  server.registerTool(
    "check_publish_ready",
    {
      title: "Check publish checklist (no upload)",
      description:
        "发布前机器检查：license/version 字段、build/libs 是否像正式 jar。默认不写盘、不调 Curse/Modrinth 上传 API。对照 community_knowledge/authored/publishing.md。",
      inputSchema: checkPublishReadySchema,
    },
    async (args): Promise<CallToolResult> => jsonResult(checkPublishReady(args)),
  );
  server.registerTool(
    "inspect_runtime",
    {
      title: "Inspect latest.log / crash-reports (log-based, no JVM attach)",
      description:
        "日志型 runtime inspector。优先只读用户确认的 logsDir/crashReportsDir；否则在 projectPath 下有界探测 run/logs、runs/client/logs、build/run/logs。" +
        "禁止向上走到盘符根、禁止全盘。默认只读文件尾部 N 行并设字节上限。复用 analyze_log / crash_analyze。不做 JDWP attach。",
      inputSchema: inspectRuntimeSchema,
    },
    async (args): Promise<CallToolResult> => jsonResult(inspectRuntime(args)),
  );

  // ── Wave B: Prompts + Resources (protocol) ───────────────────────────────
  for (const [name, meta] of Object.entries(WORKFLOW_TEMPLATES)) {
    server.registerPrompt(
      name,
      { title: meta.title, description: `MC mod workflow: ${name}` },
      async () => ({
        messages: [
          {
            role: "user",
            content: { type: "text", text: meta.body },
          },
        ],
      }),
    );
  }

  for (const res of listKnowledgeResources()) {
    if (res.uri.startsWith("mcskill://workflow/")) continue;
    if (res.uri.startsWith("mcskill://community/")) continue;
    server.registerResource(
      res.name,
      res.uri,
      { description: res.description, mimeType: "text/plain" },
      async (uri) => {
        const href = typeof uri === "string" ? uri : uri.href;
        const body = readKnowledgeResource(href);
        return {
          contents: [
            {
              uri: href,
              mimeType: body.mimeType,
              text: body.text,
            },
          ],
        };
      },
    );
  }
}

/** Wave 工具 schema 清单（供 CLI list-tools / schema 驱动解析；与上方注册共用同一 schema 常量）。description 需与上方 registerTool 保持一致。 */
export const waveToolSchemas: Array<{ name: string; description: string; inputSchema: z.ZodTypeAny }> = [
  { name: "query_registry", description: "查询 Vanilla 注册表资源 ID（minecraft:stone）。nameLayer=registry_id；类/方法映射请用 convert_mapping。【边界】不是模组 DeferredRegister / Fabric Registry。", inputSchema: queryRegistrySchema },
  { name: "mixin_analyze", description: "解析 mixins.json 与 @Mixin 源码，校验 @Inject/@Redirect 等方法目标（多映射层）。高风险工具，见 supportMatrix。deep:true 时基于已缓存 remapped 客户端 jar 做字节码级校验；jar 未缓存返回 CACHE_MISS 引导。", inputSchema: mixinAnalyzeSchema },
  { name: "audit_resources", description: "静态检查模型引用的纹理、孤儿纹理、modId 命名等问题。", inputSchema: auditResourcesSchema },
  { name: "validate_datapack_json", description: "recipe / loot_table / advancement / tag 的精简 JSON 校验。minecraft:crafting_special_* 与 smithing_trim 等无 result 不报错；普通 crafting_shaped 缺 result 仍报。【边界】不是全 pack_format 官方 schema。", inputSchema: validateDatapackJsonSchema },
  { name: "get_workflow_template", description: "返回与 MCP Prompt 同名的工作流全文；Cursor 等仅支持 tools 时使用。仅在用户要完整流程（从零建模组、崩溃分诊、移植）时调用；给已有工程加方块/改代码不要调。", inputSchema: getWorkflowTemplateSchema },
  { name: "localize_mod", description: "自有模组 diff/draft_zh，或第三方 jar extract/pack_draft。无机器翻译；标 needsTranslation。无 en_us 时回退其它语言文件作源。默认只返回文本/files，不写盘。", inputSchema: localizeModSchema },
  { name: "list_knowledge_resources", description: "列出 mcskill:// 资源 URI；配合 read_knowledge_resource 读取正文。", inputSchema: listKnowledgeResourcesSchema },
  { name: "read_knowledge_resource", description: READ_KNOWLEDGE_RESOURCE_DESCRIPTION, inputSchema: readKnowledgeResourceSchema },
  { name: "generate_model", description: "Generate block model JSON templates。version 必填。返回方块模型 JSON 骨架文本，不写盘。", inputSchema: generateModelSchema },
  { name: "generate_lang", description: "Generate en_us + zh_cn lang JSON。version 必填。返回 en_us/zh_cn lang JSON 骨架，不写盘、无机器翻译。", inputSchema: generateLangSchema },
  { name: "generate_network_packet", description: "Generate network packet skeleton。platform 必填且须带版本后缀（forge_1.20.1 / neoforge_1.20.4 / neoforge_1.21 / neoforge_26.1 / fabric_1.21 / fabric_26.1）。只传 fabric 会 error。返回 Java 骨架文本，不写盘。", inputSchema: generateNetworkPacketSchema },
  { name: "generate_capability", description: "Generate Capability / DataAttachment skeleton。platform 与 version 必填。forge 1.20.1 Capability；neoforge 仅 1.20.4+ Data Attachment（不是 Forge Capability）；fabric/quilt → error 改口 CCA。返回骨架文本，不写盘。", inputSchema: generateCapabilitySchema },
  { name: "generate_config", description: "Generate config spec skeleton。loader 与 version 必填，禁止默认 forge。neoforge 1.21+/26.1 用 ModConfigSpec；1.20.4 用 ForgeConfigSpec + net.neoforged。fabric/quilt 生成 Cloth Config 最小骨架并 warning 声明依赖。不写盘。", inputSchema: generateConfigSchema },
  { name: "generate_entity_renderer", description: "Generate entity renderer skeleton。platform 与 version 必填。支持 forge 1.20.1 / 1.20.4（@OnlyIn）与 neoforge 26.1（EntityRenderer + Identifier）。fabric/quilt 直接 error。返回实体渲染器骨架文本，不写盘。", inputSchema: generateEntityRendererSchema },
  { name: "generate_worldgen", description: "Generate worldgen JSON templates。platform 与 version 必填。Fabric/Quilt 只出 feature JSON，禁止 forge biome_modifier。返回骨架文本，不写盘。", inputSchema: generateWorldgenSchema },
  { name: "analyze_log", description: ANALYZE_LOG_DESCRIPTION, inputSchema: analyzeLogSchema },
  { name: "get_migration_guide", description: "迁移路线摘要。默认返回 Primer 章节目录（toc）；section 只返回该章；full=true 才全文。route 如 1.21.11->26.1 / 26.2 / forge->neoforge。", inputSchema: getMigrationGuideSchema },
  { name: "download_official_mdk", description: "下载官方 MDK 到 $MC_SKILL_CACHE。GitHub pin commit SHA；26.1.x/26.2 须选 ModDevGradle 或 NeoGradle。默认 dryRun。", inputSchema: downloadOfficialMdkSchema },
  { name: "check_dependencies", description: "根据 build.gradle / mods.toml / fabric.mod.json / quilt.mod.json / litemod.json / riftmod.json / 基岩 manifest 提示依赖问题：loader 判定、库模组识别（library-catalog 接线）、跨加载器冲突（owo/CCA/Polymer/Trinkets 等）与陷阱。Quilt 在 Fabric 前；LiteLoader 混合只认 net.minecraftforge.gradle.liteloader。【边界】启发式 + catalog，不是 Gradle 依赖解析器；未收录库可能漏报。", inputSchema: checkDependenciesSchema },
  { name: "mc_skill_update", description: "检查 GitHub Release 是否有新版本；确认后可更新 tooling（git ff-only + npm build）与 data（zip+SHA256）。默认 channel=stable（忽略预发布）。apply 默认 dryRun；真写需 confirmed=true + MC_SKILL_ALLOW_WRITE=1 + MC_SKILL_PROJECT_ROOT=仓库根。", inputSchema: mcSkillUpdateSchema },
  { name: "lookup_obfuscated", description: "崩溃日志反混淆：单 token 反查混淆短名（er）/ intermediary（method_6032）/ SRG（func_110143_aJ）→ yarn 可读名 + ownerClass + descriptor。\n方法优先 → 字段 → 类；多命中返回 AMBIGUOUS。26.1+ 无混淆层，返回 UNOBFUSCATED_NO_YARN。", inputSchema: lookupObfuscatedSchema },
  { name: "get_minecraft_source", description: "按需下载/重映射/反编译真实 MC 源码并返回类源码片段（支持行区间）。默认零下载：仅显式调用才下载到 $MC_SKILL_CACHE。\n支持矩阵：1.14–1.21.11 → yarn（两步 remap official→intermediary→named）或 mojmap；26.1+ → mojmap-only（免 remap）。\n首次约 3–10 分钟，同版本缓存命中 <1s。需 Java 17+；缺失时返回 TOOLCHAIN_MISSING 安装指引。\n⚠️ 仅当需要完整源码/反编译时才用本工具；仅查方法签名请用 query_api / get_method_params\n⚠️ 下载量大。1.16.5–1.20.4 Vanilla 签名用 query_api；平台 API 用 search_*_docs；26.1+ 无 query_api 索引。", inputSchema: getMinecraftSourceSchema },
  { name: "analyze_mod_jar", description: "解析本地 mod jar 元数据：quilt.mod.json / fabric.mod.json / mods.toml / litemod.json / riftmod.json / 基岩 manifest.json、mixins、依赖、AT/AW。\n同时有 Forge 与 litemod.json 时 loaders 含 forge+liteloader。纯 Node zip 解析，不写盘。\n⚠️ 仅当需要完整源码/反编译时才用本工具；仅查方法签名请用 query_api / get_method_params\n⚠️ 只解析元数据，不反编译、不给方法体。要源码用 decompile_mod_jar。", inputSchema: analyzeModJarSchema },
  { name: "decompile_mod_jar", description: "按需反编译本地 mod jar → $MC_SKILL_CACHE/decompiled-mods/<modId>/<version>/，返回源码树摘要。\n可选 remap（需匹配 MC 版本；26.1+ 免 remap）。需 Java 17+（VineFlower）；默认零下载（仅显式调用时下载工具 jar）。\n⚠️ 仅当需要完整源码/反编译时才用本工具；仅查方法签名请用 query_api / get_method_params\n⚠️ 下载量大。不给 jar 元数据（用 analyze_mod_jar）；26.1+ Vanilla 签名不要指望 query_api。", inputSchema: decompileModJarSchema },
  { name: "search_mod_code", description: "对已反编译的模组源码做行级检索（子串或正则），返回 file:line 命中。\n入口二选一：decompiledDir（反编译目录）或 jarPath（须先 decompile_mod_jar 并缓存）。纯 Node，无 Java 需求。\n⚠️ 仅当需要完整源码/反编译时才用本工具；仅查方法签名请用 query_api / get_method_params\n⚠️ 源码未反编译时返回 NOT_FOUND，不会自动 decompile。", inputSchema: searchModCodeSchema },
  { name: "validate_at", description: "校验 Forge/NeoForge `*_at.cfg`：目标类/成员存在性（继承成员/record/内部类）、映射层不匹配建议、跨文件冲突告警。jar 来源：jarPath > $MC_SKILL_CACHE 缓存；未缓存返回 CACHE_MISS 引导。", inputSchema: validateAtSchema },
  { name: "validate_aw", description: "校验 Fabric `.accesswidener`：header/namespace、条目类型、目标存在性、transitive、跨文件冲突告警。jar 来源：jarPath > $MC_SKILL_CACHE 缓存；未缓存返回 CACHE_MISS 引导。", inputSchema: validateAwSchema },
  { name: "query_loader_api", description: "查询 Forge/NeoForge/Fabric-API/QSL 等 loader 摘要中的类与 MethodInfo。必填 platform+minecraftVersion，无默认 1.20.1。不是 query_api（Parchment Vanilla）。found:false 不代表游戏里没有该类。LiteLoader/Rift/ModLoader 无摘要时 PLATFORM_SKIPPED（可 ingest）。", inputSchema: queryLoaderApiSchema },
  { name: "search_loader_api", description: "在 loader-api-summaries 的 fqcnIndex 上子串搜索（limit 默认 20 封顶 50）。mode=list 列出已索引档、skipped、cache overlay。必填 platform+version（list 可省略以列出全部）。", inputSchema: searchLoaderApiSchema },
  { name: "ingest_loader_api", description: "把用户自备的 LiteLoader/Rift/ModLoader（等官方不代下）jar 抽成摘要，只写 $MC_SKILL_CACHE/loader-api-summaries overlay，禁止写仓库 data/。jarPath 绝对路径 + mappingsVersion 必填。默认 dryRun。", inputSchema: ingestLoaderApiSchema },
  { name: "detect_mod_project", description: "只读探测用户模组工程：Quilt 在 Fabric 前；LiteLoader 混合插件。projectPath（CLI --project）优先于 MC_SKILL_PROJECT_ROOT。对不上规则树 → PACK_NOT_FOUND，禁止邻档 00–10。", inputSchema: detectModProjectSchema },
  { name: "activate_platform_pack", description: "list / session / write / deactivate。session 不写盘、不依赖项目根：默认规则 00/01/09 + Skill 索引。topics/task 只追加规则到底座（并集），永不替换。skillNames 与 task 建议名去重后注入 skillBodies（总条数上限 6）；topics 永不注入正文。库 Skill 不进 nextReads，只有显式 skillNames 才注入库正文。write：writeSkillStubs 优先于 includeSkills（deprecated）；二者都未传时默认写 stub；includeSkillBodies 才写全文。ok=true 且带「仅底座」warning = 平台包可用但规则未按任务扩展（不要当失败，也不要当已灌 02–10）。rulesMode：includeAllRules=true→all；否则有效 task/topics 且规则集大于底座→extended；否则 base。write 默认 dryRun；hosts 必填。目标只能是用户模组工程（拒绝知识库根）。不能开关 IDE 扫描器。", inputSchema: activatePlatformPackSchema },
  { name: "check_publish_ready", description: "发布前机器检查：license/version 字段、build/libs 是否像正式 jar。默认不写盘、不调 Curse/Modrinth 上传 API。对照 community_knowledge/authored/publishing.md。", inputSchema: checkPublishReadySchema },
  { name: "inspect_runtime", description: "日志型 runtime inspector。优先只读用户确认的 logsDir/crashReportsDir；否则在 projectPath 下有界探测 run/logs、runs/client/logs、build/run/logs。禁止向上走到盘符根、禁止全盘。默认只读文件尾部 N 行并设字节上限。复用 analyze_log / crash_analyze。不做 JDWP attach。", inputSchema: inspectRuntimeSchema },
];
