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
import {
  getMinecraftSourceHandler,
  analyzeModJarHandler,
  decompileModJarHandler,
  searchModCodeHandler,
} from "../decompile/index.js";

// ── Wave 工具 inputSchema（导出供 CLI list-tools / schema 驱动解析复用）────────
export const queryRegistrySchema = z.object({
  query: z.string().describe("资源 ID 或子串，如 stone、minecraft:diamond"),
  registry: z.string().optional().describe("限定注册表名，如 blocks、items"),
  version: z.string().optional().describe("MC 版本，默认 1.20.1"),
  limit: z.number().optional(),
});
export const mixinAnalyzeSchema = z.object({
  javaFiles: z
    .array(z.object({ path: z.string(), content: z.string() }))
    .optional(),
  mixinsJson: z.string().optional(),
  version: z.string().optional(),
  deep: z
    .boolean()
    .optional()
    .describe("true 时基于已缓存 remapped 客户端 jar 做字节码级校验（默认 false；jar 未缓存返回 CACHE_MISS 引导，不自动下载）"),
  jarPath: z
    .string()
    .optional()
    .describe("客户端 jar 绝对路径（deep:true 时优先于缓存扫描）"),
});
export const auditResourcesSchema = z.object({
  resourceRoot: z.string().describe("assets 根目录，如 src/main/resources/assets/<modid>"),
  modId: z.string().optional(),
});
export const validateDatapackJsonSchema = z.object({
  jsonContent: z.string(),
  kind: z.enum(["recipe", "loot_table", "advancement", "tag"]),
  version: z.string().optional(),
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
export const generateModelSchema = z.object({ modId: z.string(), blockName: z.string() });
export const generateLangSchema = z.object({
  modId: z.string(),
  entries: z.record(z.string()),
});
export const generateNetworkPacketSchema = z.object({
  modId: z.string(),
  packetName: z.string(),
  platform: z.enum(["forge_1.20.1", "neoforge_1.21"]).optional(),
});
export const generateCapabilitySchema = z.object({
  modId: z.string(),
  name: z.string(),
  neoforge: z.boolean().optional(),
});
export const generateConfigSchema = z.object({
  modId: z.string(),
  loader: z.enum(["forge", "neoforge", "fabric"]).optional(),
});
export const generateEntityRendererSchema = z.object({ modId: z.string(), entityName: z.string() });
export const generateWorldgenSchema = z.object({ modId: z.string(), featureName: z.string() });
export const analyzeLogSchema = z.object({
  logText: z.string(),
  version: z.string().optional(),
});
export const getMigrationGuideSchema = z.object({ route: z.string() });
export const checkDependenciesSchema = z.object({
  buildGradle: z.string().describe("build.gradle 全文"),
  modsToml: z.string().optional().describe("mods.toml 全文（Forge；NeoForge 内容也可并入）"),
  fabricModJson: z.string().optional().describe("fabric.mod.json 全文（Fabric 工程；loader 冲突检测必需）"),
  neoModsToml: z.string().optional().describe("neoforge.mods.toml 全文（可选；亦可并入 modsToml）"),
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
export const lookupObfuscatedSchema = z.object({
  name: z.string().describe("混淆/中间名 token，如 method_6032、er、func_110143_aJ、field_100013_f"),
  version: z.string().optional().describe("MC 版本，默认 1.20.1"),
});
// ── T2 反编译工具族（wave 21–24）──────────────────────────────────────────────
export const getMinecraftSourceSchema = z.object({
  version: z.string().optional().describe("MC 版本，默认 1.20.1（支持 1.14–1.21.11 与 26.1+）"),
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
  version: z.string().optional().describe("MC 版本，默认 1.20.1（用于定位缓存 jar）"),
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
  version: z.string().optional().describe("MC 版本，默认 1.20.1（用于定位缓存 jar）"),
  jarPath: z
    .string()
    .optional()
    .describe("客户端 jar 绝对路径（优先于 $MC_SKILL_CACHE 缓存扫描）"),
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
        "recipe / loot_table / advancement / tag 的精简 JSON 校验（1.20.1 / 1.21.1）。" +
        "【边界】不是全 pack_format 官方 schema。",
      inputSchema: validateDatapackJsonSchema,
    },
    async (args): Promise<CallToolResult> => jsonResult(validateDatapackJson(args)),
  );

  server.registerTool(
    "get_workflow_template",
    {
      title: "Get workflow template (Prompt fallback)",
      description: "返回与 MCP Prompt 同名的工作流全文；Cursor 等仅支持 tools 时使用。",
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
      inputSchema: readKnowledgeResourceSchema,
    },
    async ({ uri }): Promise<CallToolResult> => jsonResult(readKnowledgeResource(uri)),
  );

  // ── Wave C: generators ───────────────────────────────────────────────────

  server.registerTool("generate_model", {
    title: "Generate block model JSON templates",
    description: "Generate block model JSON templates。返回方块模型 JSON 骨架文本，不写盘。",
    inputSchema: generateModelSchema,
  }, async (a) => jsonResult(generateModel(a.modId, a.blockName)));

  server.registerTool("generate_lang", {
    title: "Generate en_us + zh_cn lang JSON",
    description: "Generate en_us + zh_cn lang JSON。返回 en_us/zh_cn lang JSON 骨架，不写盘、无机器翻译。",
    inputSchema: generateLangSchema,
  }, async (a) => jsonResult(generateLang(a.modId, a.entries)));

  server.registerTool("generate_network_packet", {
    title: "Generate network packet skeleton",
    description: "Generate network packet skeleton。返回网络包 Java 骨架文本，不写盘。",
    inputSchema: generateNetworkPacketSchema,
  }, async (a) =>
    jsonResult(generateNetworkPacket(a.modId, a.packetName, a.platform ?? "forge_1.20.1")));

  server.registerTool("generate_capability", {
    title: "Generate Capability / DataAttachment skeleton",
    description: "Generate Capability / DataAttachment skeleton。返回 Capability/DataAttachment 骨架文本，不写盘。",
    inputSchema: generateCapabilitySchema,
  }, async (a) => jsonResult(generateCapability(a.modId, a.name, a.neoforge ?? false)));

  server.registerTool("generate_config", {
    title: "Generate config spec skeleton",
    description: "Generate config spec skeleton。返回配置规范骨架文本，不写盘。",
    inputSchema: generateConfigSchema,
  }, async (a) => jsonResult(generateConfig(a.modId, a.loader ?? "forge")));

  server.registerTool("generate_entity_renderer", {
    title: "Generate entity renderer skeleton",
    description: "Generate entity renderer skeleton。返回实体渲染器骨架文本，不写盘。",
    inputSchema: generateEntityRendererSchema,
  }, async (a) => jsonResult(generateEntityRenderer(a.modId, a.entityName)));

  server.registerTool("generate_worldgen", {
    title: "Generate worldgen JSON templates",
    description: "Generate worldgen JSON templates。返回世界生成 JSON 骨架，不写盘。",
    inputSchema: generateWorldgenSchema,
  }, async (a) => jsonResult(generateWorldgen(a.modId, a.featureName)));

  // ── Wave C: diagnostics ──────────────────────────────────────────────────
  server.registerTool("analyze_log", {
    title: "Analyze game / crash log excerpt",
    inputSchema: analyzeLogSchema,
  }, async (a) => jsonResult(analyzeLog(a)));

  server.registerTool("get_migration_guide", {
    title: "Get built-in migration guide summary",
    inputSchema: getMigrationGuideSchema,
  }, async (a) => jsonResult(getMigrationGuide(a.route)));

  server.registerTool("check_dependencies", {
    title: "Check Gradle / mods.toml dependency hints",
    description:
      "根据 build.gradle / mods.toml / fabric.mod.json / neoforge.mods.toml 提示依赖问题：loader 判定、" +
      "库模组识别（library-catalog 接线）、跨加载器冲突（owo/CCA/Polymer/Trinkets 等）与陷阱（Trinkets 停更、Bookshelf 重名、Cloth 冷冻）。" +
      "请传入与工程匹配的清单文件（buildGradle 必填；Fabric 工程建议 fabricModJson，Forge 工程建议 modsToml），以便 loader 冲突检测。" +
      "【边界】启发式 + catalog，不是 Gradle 依赖解析器；未收录库可能漏报。",
    inputSchema: checkDependenciesSchema,
  }, async (a) => jsonResult(checkDependencies(a.buildGradle, a.modsToml, a.fabricModJson, a.neoModsToml)));

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
        "解析本地 mod jar 元数据：fabric.mod.json / mods.toml / neoforge.mods.toml、mixins.json 引用、entrypoints、依赖、accesswidener/AT。\n" +
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
    if (!res.uri.startsWith("mcskill://workflow/")) {
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
}

/** Wave 工具 schema 清单（供 CLI list-tools / schema 驱动解析；与上方注册共用同一 schema 常量）。description 需与上方 registerTool 保持一致。 */
export const waveToolSchemas: Array<{ name: string; description: string; inputSchema: z.ZodTypeAny }> = [
  { name: "query_registry", description: "查询 Vanilla 注册表资源 ID（minecraft:stone）。nameLayer=registry_id；类/方法映射请用 convert_mapping。【边界】不是模组 DeferredRegister / Fabric Registry。", inputSchema: queryRegistrySchema },
  { name: "mixin_analyze", description: "解析 mixins.json 与 @Mixin 源码，校验 @Inject/@Redirect 等方法目标（多映射层）。高风险工具，见 supportMatrix。deep:true 时基于已缓存 remapped 客户端 jar 做字节码级校验；jar 未缓存返回 CACHE_MISS 引导。", inputSchema: mixinAnalyzeSchema },
  { name: "audit_resources", description: "静态检查模型引用的纹理、孤儿纹理、modId 命名等问题。", inputSchema: auditResourcesSchema },
  { name: "validate_datapack_json", description: "recipe / loot_table / advancement / tag 的精简 JSON 校验（1.20.1 / 1.21.1）。【边界】不是全 pack_format 官方 schema。", inputSchema: validateDatapackJsonSchema },
  { name: "get_workflow_template", description: "返回与 MCP Prompt 同名的工作流全文；Cursor 等仅支持 tools 时使用。", inputSchema: getWorkflowTemplateSchema },
  { name: "localize_mod", description: "自有模组 diff/draft_zh，或第三方 jar extract/pack_draft。无机器翻译；标 needsTranslation。无 en_us 时回退其它语言文件作源。默认只返回文本/files，不写盘。", inputSchema: localizeModSchema },
  { name: "list_knowledge_resources", description: "列出 mcskill:// 资源 URI；配合 read_knowledge_resource 读取正文。", inputSchema: listKnowledgeResourcesSchema },
  { name: "read_knowledge_resource", description: "Read knowledge resource by URI", inputSchema: readKnowledgeResourceSchema },
  { name: "generate_model", description: "Generate block model JSON templates。返回方块模型 JSON 骨架文本，不写盘。", inputSchema: generateModelSchema },
  { name: "generate_lang", description: "Generate en_us + zh_cn lang JSON。返回 en_us/zh_cn lang JSON 骨架，不写盘、无机器翻译。", inputSchema: generateLangSchema },
  { name: "generate_network_packet", description: "Generate network packet skeleton。返回网络包 Java 骨架文本，不写盘。", inputSchema: generateNetworkPacketSchema },
  { name: "generate_capability", description: "Generate Capability / DataAttachment skeleton。返回 Capability/DataAttachment 骨架文本，不写盘。", inputSchema: generateCapabilitySchema },
  { name: "generate_config", description: "Generate config spec skeleton。返回配置规范骨架文本，不写盘。", inputSchema: generateConfigSchema },
  { name: "generate_entity_renderer", description: "Generate entity renderer skeleton。返回实体渲染器骨架文本，不写盘。", inputSchema: generateEntityRendererSchema },
  { name: "generate_worldgen", description: "Generate worldgen JSON templates。返回世界生成 JSON 骨架，不写盘。", inputSchema: generateWorldgenSchema },
  { name: "analyze_log", description: "Analyze game / crash log excerpt", inputSchema: analyzeLogSchema },
  { name: "get_migration_guide", description: "Get built-in migration guide summary", inputSchema: getMigrationGuideSchema },
  { name: "check_dependencies", description: "根据 build.gradle / mods.toml / fabric.mod.json / neoforge.mods.toml 提示依赖问题：loader 判定、库模组识别（library-catalog 接线）、跨加载器冲突（owo/CCA/Polymer/Trinkets 等）与陷阱（Trinkets 停更、Bookshelf 重名、Cloth 冷冻）。请传入与工程匹配的清单文件（buildGradle 必填；Fabric 工程建议 fabricModJson，Forge 工程建议 modsToml），以便 loader 冲突检测。【边界】启发式 + catalog，不是 Gradle 依赖解析器；未收录库可能漏报。", inputSchema: checkDependenciesSchema },
  { name: "mc_skill_update", description: "检查 GitHub Release 是否有新版本；确认后可更新 tooling（git ff-only + npm build）与 data（zip+SHA256）。默认 channel=stable（忽略预发布）。apply 默认 dryRun；真写需 confirmed=true + MC_SKILL_ALLOW_WRITE=1 + MC_SKILL_PROJECT_ROOT=仓库根。", inputSchema: mcSkillUpdateSchema },
  { name: "lookup_obfuscated", description: "崩溃日志反混淆：单 token 反查混淆短名（er）/ intermediary（method_6032）/ SRG（func_110143_aJ）→ yarn 可读名 + ownerClass + descriptor。\n方法优先 → 字段 → 类；多命中返回 AMBIGUOUS。26.1+ 无混淆层，返回 UNOBFUSCATED_NO_YARN。", inputSchema: lookupObfuscatedSchema },
  { name: "get_minecraft_source", description: "按需下载/重映射/反编译真实 MC 源码并返回类源码片段（支持行区间）。默认零下载：仅显式调用才下载到 $MC_SKILL_CACHE。\n支持矩阵：1.14–1.21.11 → yarn（两步 remap official→intermediary→named）或 mojmap；26.1+ → mojmap-only（免 remap）。\n首次约 3–10 分钟，同版本缓存命中 <1s。需 Java 17+；缺失时返回 TOOLCHAIN_MISSING 安装指引。\n⚠️ 仅当需要完整源码/反编译时才用本工具；仅查方法签名请用 query_api / get_method_params\n⚠️ 下载量大。1.16.5–1.20.4 Vanilla 签名用 query_api；平台 API 用 search_*_docs；26.1+ 无 query_api 索引。", inputSchema: getMinecraftSourceSchema },
  { name: "analyze_mod_jar", description: "解析本地 mod jar 元数据：fabric.mod.json / mods.toml / neoforge.mods.toml、mixins.json 引用、entrypoints、依赖、accesswidener/AT。\n纯 Node 解析（zip），无需 Java、零下载、不写盘。仅本地绝对路径。\n⚠️ 仅当需要完整源码/反编译时才用本工具；仅查方法签名请用 query_api / get_method_params\n⚠️ 只解析元数据，不反编译、不给方法体。要源码用 decompile_mod_jar。", inputSchema: analyzeModJarSchema },
  { name: "decompile_mod_jar", description: "按需反编译本地 mod jar → $MC_SKILL_CACHE/decompiled-mods/<modId>/<version>/，返回源码树摘要。\n可选 remap（需匹配 MC 版本；26.1+ 免 remap）。需 Java 17+（VineFlower）；默认零下载（仅显式调用时下载工具 jar）。\n⚠️ 仅当需要完整源码/反编译时才用本工具；仅查方法签名请用 query_api / get_method_params\n⚠️ 下载量大。不给 jar 元数据（用 analyze_mod_jar）；26.1+ Vanilla 签名不要指望 query_api。", inputSchema: decompileModJarSchema },
  { name: "search_mod_code", description: "对已反编译的模组源码做行级检索（子串或正则），返回 file:line 命中。\n入口二选一：decompiledDir（反编译目录）或 jarPath（须先 decompile_mod_jar 并缓存）。纯 Node，无 Java 需求。\n⚠️ 仅当需要完整源码/反编译时才用本工具；仅查方法签名请用 query_api / get_method_params\n⚠️ 源码未反编译时返回 NOT_FOUND，不会自动 decompile。", inputSchema: searchModCodeSchema },
  { name: "validate_at", description: "校验 Forge/NeoForge `*_at.cfg`：目标类/成员存在性（继承成员/record/内部类）、映射层不匹配建议、跨文件冲突告警。jar 来源：jarPath > $MC_SKILL_CACHE 缓存；未缓存返回 CACHE_MISS 引导。", inputSchema: validateAtSchema },
  { name: "validate_aw", description: "校验 Fabric `.accesswidener`：header/namespace、条目类型、目标存在性、transitive、跨文件冲突告警。jar 来源：jarPath > $MC_SKILL_CACHE 缓存；未缓存返回 CACHE_MISS 引导。", inputSchema: validateAwSchema },
];
