import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import * as z from "zod";
import { missingMcVersion, versionRequiredAction } from "./utils/actionable.js";
import { getBuildStatus } from "./utils/build-status.js";
import { patchToolCollection } from "./tool-handlers.js";
import { queryApi, warmupApi, listApiPreloadStatuses, getApiPreloadStatus } from "./api/index.js";
import { convertMapping, getMethodParams } from "./mappings/index.js";
import { readableSignature, returnType, parameterTypes } from "./utils/descriptor.js";
import { getUpdateHint } from "./update/index.js";
import { getVersionInfo } from "./version/index.js";
import { diagnoseGradle } from "./gradle/index.js";
import { generateDatagen } from "./datagen/index.js";
import { analyzeCrash } from "./crash/index.js";
import { validateProject } from "./validate/index.js";
import {
  // 旧 Forge 别名（向后兼容）
  listForgeVersions,
  listForgeVersionsSchema,
  searchForgeDocs,
  searchForgeDocsSchema,
  getForgeDocSummary,
  getForgeDocSummarySchema,
  getForgeDocFull,
  getForgeDocFullSchema,
  getForgeDocRelated,
  getForgeDocRelatedSchema,
  // Fabric 专用工具
  listFabricVersions,
  listFabricVersionsSchema,
  searchFabricDocs,
  searchFabricDocsSchema,
  getFabricDocSummary,
  getFabricDocSummarySchema,
  getFabricDocFull,
  getFabricDocFullSchema,
  getFabricDocRelated,
  getFabricDocRelatedSchema,
  // NeoForge 专用工具
  listNeoForgeVersions,
  listNeoForgeVersionsSchema,
  searchNeoForgeDocs,
  searchNeoForgeDocsSchema,
  getNeoForgeDocSummary,
  getNeoForgeDocSummarySchema,
  getNeoForgeDocFull,
  getNeoForgeDocFullSchema,
  getNeoForgeDocRelated,
  getNeoForgeDocRelatedSchema,
  // 新通用工具
  listVersions,
  listVersionsSchema,
  searchDocs,
  searchDocsSchema,
  getDocSummary,
  getDocSummarySchema,
  getDocFull,
  getDocFullSchema,
  getDocRelated,
  getDocRelatedSchema,
  // 社区知识库
  listCommunitySources,
  listCommunitySourcesSchema,
  searchCommunityDocs,
  searchCommunityDocsSchema,
  getCommunityDocSummary,
  getCommunityDocSummarySchema,
  getCommunityDocFull,
  getCommunityDocFullSchema,
  CommunityDocNotFoundError,
} from "./docs-platform/index.js";
import { diagnoseDataPaths, resolveDataDir } from "./utils/path.js";
import { getSemanticIndexStatus } from "./docs-platform/semantic/status.js";
import { analyzePortingPath, portProject } from "./porting/index.js";
import { registerWaveExtensions, waveToolSchemas } from "./wave/register.js";
import {
  searchBedrockDocs,
  searchBedrockDocsSchema,
  getBedrockDocSummary,
  getBedrockDocSummarySchema,
  getBedrockDocFull,
  getBedrockDocFullSchema,
  getBedrockDocRelated,
  getBedrockDocRelatedSchema,
  validateAddonManifest,
  validateAddonManifestSchema,
  validateBpJson,
  validateBpJsonSchema,
  generateAddonManifest,
  generateAddonManifestSchema,
  generateBpEntity,
  generateBpEntitySchema,
  loadBedrockDocsStatus,
} from "./bedrock/index.js";

// ── 工具 inputSchema 常量（导出供 CLI list-tools / schema 驱动解析复用）────────

export const queryApiSchema = z.object({
  className: z.string().describe("类全限定名，如 net.minecraft.world.entity.LivingEntity"),
  methodName: z.string().optional().describe("方法名，可选，如 getHealth"),
  version: z.string().min(1).describe("Minecraft 版本，必填，禁止默认 1.20.1"),
});

export const getMethodParamsSchema = z.object({
  className: z.string().describe("类全限定名"),
  methodName: z.string().describe("方法名（Parchment/Mojang 层名；Yarn 名请先 convert_mapping）"),
  descriptor: z.string().optional().describe("完整 JNI 描述符（用于区分重载，如 (Lnet/minecraft/world/entity/LivingEntity;)V）"),
  version: z.string().min(1).describe("Minecraft 版本，必填，禁止默认 1.20.1"),
});

export const convertMappingSchema = z.object({
  from: z
    .enum(["mojang", "mcp", "yarn", "parchment", "obfuscated", "intermediary"])
    .describe("源映射类型；obfuscated=Tiny official 混淆短名；intermediary=method_6032 类"),
  to: z
    .enum(["mojang", "mcp", "yarn", "parchment", "obfuscated", "intermediary"])
    .describe("目标映射类型；to=mojang 与 obfuscated 同为混淆短名（兼容旧行为）"),
  memberName: z.string().describe("成员名（字段或方法）"),
  ownerClass: z.string().optional().describe("所属类；1.12–1.13 SRG+CSV 与 1.16+ 方法查询需要；纯 CSV（1.14–1.15）勿传"),
  descriptor: z.string().optional().describe("JNI 方法描述符，重载消歧强烈建议传入，如 ()F"),
  version: z.string().min(1).describe("Minecraft 版本，必填，禁止默认 1.20.1"),
  memberKind: z
    .enum(["class", "method", "field", "auto"])
    .optional()
    .describe("成员类型；field 需 schema v3；默认 auto 启发式"),
  allow_fallback: z
    .boolean()
    .optional()
    .describe("过渡参数：无映射时回传原名（found 仍为 false，fallbackUsed=true）"),
});

export const getServerStatusSchema = z.object({
  version: z.string().optional().describe("关注的 MC 版本；warmup 为 true 时必填，禁止默认 1.20.1"),
  warmup: z.boolean().optional().describe("仅当为 true 时预热该版本；缺省不预热"),
});

export const getVersionInfoSchema = z.object({
  version: z.string().describe("Minecraft 版本，如 1.20.1"),
  action: z.string().describe("要执行的操作，如 注册方块、创建方块实体、注册流体"),
  platform: z
    .string()
    .optional()
    .describe("必须为 forge。缺省或非 forge 返回 WRONG_TOOL；不要当跨平台顾问"),
});

export const diagnoseGradleSchema = z.object({
  buildGradle: z.string().optional().describe("build.gradle 文件内容（与 projectPath 二选一）"),
  gradleProperties: z.string().optional().describe("gradle.properties 文件内容"),
  litemodJson: z.string().optional().describe("litemod.json 全文（extras；gradle 正文看不到时仍按 LiteLoader 处理）"),
  riftmodJson: z.string().optional().describe("riftmod.json 全文"),
  addonManifest: z.string().optional().describe("基岩 manifest.json 全文"),
  quiltModJson: z.string().optional().describe("quilt.mod.json 全文"),
  projectPath: z.string().optional().describe("模组项目根：扫 gradle 与 extras（显式正文优先）"),
});

export const generateDatagenSchema = z.object({
  providerType: z
    .enum([
      "recipe",
      "blockstate",
      "itemmodel",
      "loottable",
      "tag",
      "advancement",
      "particle",
      "sound",
    ])
    .describe("Provider 类型"),
  modId: z.string().describe("Mod ID（全小写），如 mymod"),
  targetName: z.string().describe("目标注册名（无 modId 前缀），如 my_block"),
  version: z.string().describe("Minecraft 版本，必填，禁止默认 1.20.1"),
  platform: z.enum(["forge", "neoforge", "fabric", "quilt"]).describe("loader 平台，必填，禁止默认 forge"),
});

export const crashAnalyzeSchema = z.object({
  crashReport: z.string().optional().describe("崩溃报告全文（从 '---- Minecraft Crash Report ----' 开始；与 crashReportPath 二选一）"),
  crashReportPath: z.string().optional().describe("崩溃报告文件路径（与 crashReport 二选一）"),
  version: z.string().optional().describe("Minecraft 版本（可选）。缺省仍解析 crashKind，但不跑 lookup_obfuscated；analysisComplete=false"),
});

export const validateProjectSchema = z.object({
  modsToml: z.string().optional().describe("mods.toml 文件内容（建议提供以启用 mods.toml 相关检查）"),
  neoModsToml: z.string().optional().describe("neoforge.mods.toml 全文"),
  fabricModJson: z.string().optional().describe("fabric.mod.json 全文"),
  quiltModJson: z.string().optional().describe("quilt.mod.json 全文"),
  javaFiles: z.array(z.object({
    path: z.string().describe("文件相对路径，如 src/main/java/com/example/ExampleMod.java"),
    content: z.string().describe("文件完整内容"),
  })).optional().describe("Java 源文件列表，建议包含所有注册相关类"),
  buildGradle: z.string().optional().describe("build.gradle 文件内容（用于 Gradle 配置诊断）"),
  gradleProperties: z.string().optional().describe("gradle.properties 文件内容（用于版本信息校验）"),
  mixinsJson: z.string().optional().describe("mixins.json 文件内容（用于 Mixin 配置校验）"),
  projectPath: z.string().optional().describe("模组项目根：扫 mods.toml / gradle / mixins.json / src/main/java（显式正文优先）"),
  includeCrashAnalysis: z.boolean().optional().describe("true 时扫 crash-reports/ 并附崩溃摘要"),
});

export const diagnoseDataPathsSchema = z.object({});

export const analyzePortingPathSchema = z.object({
  projectPath: z.string().describe("项目根目录（绝对或相对路径）"),
  targetPlatform: z.enum(["fabric", "neoforge", "forge", "quilt", "liteloader", "rift", "modloader", "bedrock"]).optional().describe("目标平台（可选，未指定则自动推断）"),
  targetVersion: z.string().optional().describe("目标 MC 版本（如 1.20.4）"),
});

export const portProjectSchema = z.object({
  projectPath: z.string().describe("项目根目录"),
  targetPlatform: z.enum(["fabric", "neoforge", "forge", "quilt", "liteloader", "rift", "modloader", "bedrock"]).optional().describe("目标平台"),
  targetVersion: z.string().optional().describe("目标 MC 版本"),
  modId: z.string().optional().describe("init_architectury 的 modId（小写）；默认从目录名推导"),
  dryRun: z.boolean().optional().default(true).describe("默认 true：仅输出 diff 预览，不写入任何文件"),
  confirmed: z.boolean().optional().describe("仅在 dryRun=false 时有效，用户显式确认后才实际写入"),
  action: z.enum(["init_architectury", "extract_common", "apply_version_migration"]).describe("要执行的动作"),
});

function communityDocError(e: unknown): CallToolResult {
  if (e instanceof CommunityDocNotFoundError) {
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          ok: false,
          error: e.message,
          code: e.code,
          id: e.id,
          hint: "请用 search_community_docs 或 list_community_sources 确认 id",
        }, null, 2),
      }],
      isError: true,
    };
  }
  return {
    content: [{
      type: "text",
      text: JSON.stringify({
        ok: false,
        error: (e as Error).message,
        code: "INTERNAL_ERROR",
        hint: "请检查 community_knowledge 路径与索引",
      }, null, 2),
    }],
    isError: true,
  };
}

export const server = new McpServer({
  version: "0.1.0",
  name: "MC-AI-Coding-Assistant-Tool",
});

// 收集全部工具 handler 到模块级表（CLI 通用 dispatch 依赖；须在首个 registerTool 前）
patchToolCollection(server);

// ── 1. API 查询 ─────────────────────────────────────────────────────────────
server.registerTool(
  "query_api",
  {
    title: "Query Vanilla/Parchment API",
    description:
      "查询 Minecraft/Vanilla 类的完整方法签名、参数名、返回值类型。数据来源：按 version 加载的 Parchment extracted 索引（version 必填，禁止默认 1.20.1）。" +
      "适用于：需要确认某个 Minecraft API 的正确用法时。" +
      "注意：不包含 Forge 特有类（如 DeferredRegister、Capability）。返回 found=true 时包含完整 javadoc。" +
      "【边界】覆盖约 1.16.5–1.20.4。1.7.10–1.12.2 可能 found:true 但 methods 为空（类名空壳）。1.14.4/1.15.2 与 1.21+/26.1+ 无可用方法索引。found:false 表示本索引没有该类。平台 API 请用 query_loader_api 或 search_*_docs。",
    inputSchema: queryApiSchema,
  },
  async ({ className, methodName, version }): Promise<CallToolResult> => {
    const result = await queryApi({ className, methodName, version });
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

// ── 1b. 方法参数查询 ──────────────────────────────────────────────────────
server.registerTool(
  "get_method_params",
  {
    title: "Get Method Parameter Names",
    description:
      "查询指定方法的完整参数名列表（来源：Parchment extracted，按 version 加载）。" +
      "适用于：当知道方法名但不确定参数顺序和名称时。" +
      "需提供 className + methodName；重载方法建议附上 descriptor。返回参数索引、名称和 JNI 描述符。" +
      "【边界】与 query_api 同一索引，覆盖约 1.16.5–1.20.4；26.1+ 无索引。found:false 表示索引没有该方法，不代表运行时不存在。",
    inputSchema: getMethodParamsSchema,
  },
  async ({ className, methodName, descriptor, version }): Promise<CallToolResult> => {
    const result = getMethodParams({ className, methodName, descriptor, version });
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

// ── 2. 映射转换 ──────────────────────────────────────────────────────────────
server.registerTool(
  "convert_mapping",
  {
    title: "Convert Between Mapping Systems",
    description:
      "在 mojang / mcp / yarn / parchment / obfuscated / intermediary 间互转类或方法名（预建 yarn-mappings.sqlite）。\n" +
      "obfuscated = Tiny official 混淆短名（er）；intermediary = method_6032 类。to=mojang 仍返回混淆短名（兼容），建议改用 to=obfuscated；可读名请用 to=yarn / query_api。\n" +
      "无 ownerClass 时 obfuscated/intermediary→yarn/mcp 走 method→field→class 全局反查（崩溃日志单 token）。26.1+ 无混淆层 → UNOBFUSCATED_NO_YARN。\n" +
      "mcp↔parchment 为同名层（identity）；参数名请用 get_method_params。\n" +
      "方法重载请传 descriptor；无 descriptor 且多重载时 found=false 且 ambiguous=true，返回 candidates。\n" +
      "1.12–1.13 SRG/TSRG+CSV：可带 ownerClass（MCP named→searge→obf）；1.14–1.15 纯 CSV 仅全局 searge↔named（勿传 owner）。\n" +
      "失败默认 converted=null；allow_fallback=true 时可回传原名并设 fallbackUsed（过渡期）。\n" +
      "@example 成功：from=mcp to=mojang memberName=getHealth ownerClass=net.minecraft.world.entity.LivingEntity version=1.20.1 → converted=er\n" +
      "@example obfuscated：from=intermediary to=obfuscated memberName=method_6032 → er；崩溃日志可用 lookup_obfuscated\n" +
      "@example 歧义：同名多重载且不传 descriptor → found=false ambiguous=true candidates=[...]\n" +
      "@example 1.12.2：getHealth + EntityLivingBase → obf（如 cd）；无 owner 的 getHealth → ambiguous\n" +
      "@example CSV：1.14.4 memberName=func_110143_aJ → getHealth；传 ownerClass → csv-no-owner\n" +
      "@example allow_fallback=true 且无表 → found=false converted=原名 fallbackUsed=true",
    inputSchema: convertMappingSchema,
  },
  async ({ from, to, memberName, ownerClass, descriptor, version, memberKind, allow_fallback }): Promise<CallToolResult> => {
    const result = convertMapping({
      from,
      to,
      memberName,
      ownerClass,
      descriptor,
      version,
      memberKind,
      allow_fallback,
    });
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

// ── 2b. 服务器状态 / 预热 ───────────────────────────────────────────────────
server.registerTool(
  "get_server_status",
  {
    title: "Get MCP Server / Data Preload Status",
    description:
      "查看 API 索引预热状态、数据路径诊断与 descriptor 自检。" +
      "适用于：调用失败排查、确认 schema/映射数据是否就绪。",
    inputSchema: getServerStatusSchema,
  },
  async ({ version, warmup }): Promise<CallToolResult> => {
    if (warmup === true) {
      if (missingMcVersion(version)) {
        return {
          content: [{ type: "text", text: JSON.stringify({ ok: false, action: versionRequiredAction() }, null, 2) }],
        };
      }
      await warmupApi([version!.trim()]);
    }
    const focusVersion = String(version ?? "").trim();
    const result = {
      ok: true,
      focus: focusVersion ? getApiPreloadStatus(focusVersion) : { note: "未指定 focus version", preloaded: listApiPreloadStatuses() },
      api: listApiPreloadStatuses(),
      dataPaths: diagnoseDataPaths(),
      /** 语义索引可用性：hybrid | fts5-only | l0-only（缺库不抛错，但 warnings 必报） */
      semanticIndex: getSemanticIndexStatus(resolveDataDir()),
      bedrockDocsStatus: loadBedrockDocsStatus(),
      /** ② build 状态：dist 缺失/过期提示（src 修改未重新编译时 buildRequired=true） */
      buildStatus: getBuildStatus(),
      updateHint: getUpdateHint(),
      descriptorSelfCheck: {
        sample: "()F",
        returnType: returnType("()F"),
        readableSignature: readableSignature("getHealth", "()F"),
        parameterTypes: parameterTypes("(IF)V"),
      },
    };
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

// ── 3. 版本适配信息 ─────────────────────────────────────────────────────────
server.registerTool(
  "get_version_info",
  {
    title: "Get Version-Specific Guidance",
    description:
      "【Forge only】获取指定 Minecraft/Forge 版本的推荐做法、关键变更点和官方 Changelog 链接。" +
      "适用于：开始新版本开发、遇到版本兼容性问题、或不确定某个 API 在特定版本中的用法时。" +
      "返回该版本的 Forge 版本号、推荐注册方式、关键 gotchas 和官方链接。" +
      "【边界】仅 Forge。platform 必须为 forge，缺省或非 forge 返回 WRONG_TOOL。" +
      "不要用于 Fabric / NeoForge 工程，请改用 search_*_docs。1.12.2 及以下版本注册是 RegistryEvent，不要套 DeferredRegister。",
    inputSchema: getVersionInfoSchema,
  },
  async ({ version, action, platform }): Promise<CallToolResult> => {
    const result = await getVersionInfo({ version, action, platform });
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

// ── 4. Gradle 诊断 ──────────────────────────────────────────────────────────
server.registerTool(
  "diagnose_gradle",
  {
    title: "Diagnose Gradle Build Configuration",
    description:
      "校验 ForgeGradle + Fabric/Quilt Loom + NeoGradle/ModDevGradle。" +
      "Loom：插件 id（26.1 必须 net.fabricmc.fabric-loom）、Java toolchain（1.21=21，26.1=25）、Yarn vs 去混淆、26.1 禁止 modImplementation。" +
      "Neo/MDG：插件 id、minecraft_version/neo_version、26.1 须能看出 buildPlugin、Java 21 vs 25。" +
      "含 net.minecraftforge.gradle.liteloader 时走轻量模式。Rift / BaseMod / 基岩仍早退。",
    inputSchema: diagnoseGradleSchema,
  },
  async (args): Promise<CallToolResult> => {
    const result = diagnoseGradle(args);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

// ── 5. 数据生成辅助 ─────────────────────────────────────────────────────────
server.registerTool(
  "generate_datagen",
  {
    title: "Generate DataGen Provider Code",
    description:
      "生成 DataGen Provider 类代码模板（RecipeProvider、BlockStateProvider、ItemModelProvider、LootTableProvider、BlockTagsProvider）。" +
      "适用于：需要为方块/物品生成资源文件时（配方、方块状态、物品模型、掉落表、方块标签）。" +
      "注意：platform 与 version 均必填。Forge 1.20.1 与 1.20.4；NeoForge 1.20.4 / 1.20.6（均仅 recipe）/ 1.21.x / 26.1；Fabric 精确档 1.21.1/1.21.4/1.21.8/1.21.10/1.21.11 与 26.1；Quilt 无足够 QSL 类名则 error。" +
      "其它 Forge 版本（含 1.12.2）返回 error。" +
      "返回完整的 Java 代码模板。" +
      "【边界】只返回 Java 模板文本，不写盘；不是所有 MC 版本的 DataGen API。Fabric/Quilt 改口文档，不生成 Forge DataGen。",
    inputSchema: generateDatagenSchema,
  },
  async ({ providerType, modId, targetName, version, platform }): Promise<CallToolResult> => {
    const result = generateDatagen({
      providerType,
      modId,
      targetName,
      version,
      platform,
    });
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

// ── 6. 崩溃日志分析 ────────────────────────────────────────────────────────
server.registerTool(
  "crash_analyze",
  {
    title: "Analyze Minecraft Crash Report",
    description:
      "解析崩溃报告全文，通过内置模式库识别可能成因并返回修复建议。" +
      "适用于：模组运行崩溃、收到玩家的崩溃日志时。" +
      "支持识别常见崩溃原因（Mixin、Capability、BlockEntity、DeferredRegister、" +
      "BlockItem、CreativeModeTab、网络包、SpawnPlacement、方块属性、声音、loot、注册名重复等），" +
      "并推断 crashKind（fml/client/server/fabric/quilt/liteloader/rift/modloader/…）、缺前置/版本不兼容，以及 logHints。" +
      "**优先于搜索引擎使用此工具**；实务分类可配合 search_community_docs。",
    inputSchema: crashAnalyzeSchema,
  },
  async (args): Promise<CallToolResult> => {
    const result = analyzeCrash(args);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

// ── 7. 项目校验 ─────────────────────────────────────────────────────────────
server.registerTool(
  "validate_project",
  {
    title: "Validate Mod Project Structure",
    description:
      "校验模组项目结构。Forge：mods.toml / DeferredRegister / @Mod。" +
      "Fabric/Quilt：fabric.mod.json / quilt.mod.json 的 id 与 entrypoint 类；出现 Forge DeferredRegister 仅 WARN。" +
      "NeoForge：neoforge.mods.toml、@Mod + IEventBus 构造；RegistryObject 不推荐；禁止 SimpleChannel。" +
      "LiteLoader/Rift/ModLoader/基岩仍 skipped（基岩请用 validate_addon_manifest）。" +
      "坏 recipe 只 warning，不把整项目判 failed。Java 扫描上限默认 300，可用 MC_SKILL_JAVA_SCAN_MAX_FILES 提高。",
    inputSchema: validateProjectSchema,
  },
  async (args): Promise<CallToolResult> => {
    const result = validateProject(args);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

// ── 8. Forge 官方文档搜索 ─────────────────────────────────────────────────
server.registerTool(
  searchForgeDocsSchema.name,
  {
    title: "Search Official Forge Documentation",
    description:
      "搜索 Forge 官方文档（hybrid：L0 关键词 + 语义检索，RRF 融合；无语义库时回退纯 L0）。" +
      "适用于：需要了解 Forge 特有功能（如 Capability、DeferredRegister、网络通信、DataGen）的官方说明时。" +
      "返回相关页面 ID 列表，每个结果包含标题、摘要和标签。" +
      "建议配合 get_forge_doc_summary 使用：先搜索，再对相关页面取摘要判断是否深入。" +
      "增强功能：支持 class:/event:/method: 前缀精确路由；支持 | OR 分组；自动去除 the/and/of 等停用词。" +
      "另外另有 query_api 工具，可直接查询 Vanilla/Parchment 类的参数名和 javadoc，适合在已知类名后精确查询某个方法的签名。",
    inputSchema: searchForgeDocsSchema.inputSchema,
  },
  async (args): Promise<CallToolResult> => {
    return searchForgeDocs({
      query: args.query,
      version: args.version,
      tags: args.tags,
    });
  }
);

// ── 9. Forge 文档摘要 ─────────────────────────────────────────────────────
server.registerTool(
  getForgeDocSummarySchema.name,
  {
    title: "Get Forge Doc Page Summary",
    description:
      "获取 Forge 文档页面的章节骨架与摘要。" +
      "适用于：判断某篇文档是否包含所需内容时。" +
      "返回每个 <h2> 章节的标题、150-200 字摘要和首段概述。" +
      "建议：先 search_forge_docs 搜索关键词，再对相关页面取摘要，最后仅当摘要显示内容相关时才调用 get_forge_doc_full 获取全文。",
    inputSchema: getForgeDocSummarySchema.inputSchema,
  },
  async (args): Promise<CallToolResult> => {
    return getForgeDocSummary({ id: args.id, version: args.version });
  }
);

// ── 10. Forge 文档全文 ────────────────────────────────────────────────────
server.registerTool(
  getForgeDocFullSchema.name,
  {
    title: "Get Full Forge Documentation Page",
    description:
      "获取 Forge 文档页面全文。" +
      "适用于：需要查看 API 完整步骤、事件列表、配置项清单时。" +
      "highlight_key=true（默认）时，关键段落（🔴新手必读、🟠常见错误、🟢示例代码）会突出显示在开头。" +
      "**永远不要一次性加载超过 2 个 full page**，避免上下文溢出。",
    inputSchema: getForgeDocFullSchema.inputSchema,
  },
  async (args): Promise<CallToolResult> => {
    return getForgeDocFull({
      id: args.id,
      version: args.version,
      highlight_key: args.highlight_key,
    });
  }
);

// ── 11. Forge 文档相关页面 ─────────────────────────────────────────────────
server.registerTool(
  getForgeDocRelatedSchema.name,
  {
    title: "Get Related Forge Documentation Pages",
    description:
      "获取与指定 Forge 文档页面相关的其他页面列表。" +
      "适用于：想了解某个主题，但不知道还需要查阅哪些关联文档时。" +
      "返回与目标页面共享最多 section 关键词的其他页面，按相关性降序排列。",
    inputSchema: getForgeDocRelatedSchema.inputSchema,
  },
  async (args): Promise<CallToolResult> => {
    return getForgeDocRelated({ id: args.id, version: args.version, limit: args.limit });
  }
);

// ── 11b. 社区知识库（与官方文档分离；links 不抓网页正文）────────────────────
server.registerTool(
  "list_community_sources",
  {
    title: "List Community Knowledge Sources",
    description:
      "列出 community_knowledge 已收录条目（permitted / authored / links）。" +
      "用于了解可用社区资料与署名来源；正式 API 仍优先 search_forge_docs / search_fabric_docs。",
    inputSchema: listCommunitySourcesSchema,
  },
  async (): Promise<CallToolResult> => {
    try {
      const result = await listCommunitySources();
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    } catch (e) {
      return {
        content: [{ type: "text", text: `错误: ${(e as Error).message}` }],
        isError: true,
      };
    }
  }
);

server.registerTool(
  "search_community_docs",
  {
    title: "Search Community Knowledge",
    description:
      "搜索社区知识库（许可提炼、自写笔记、外链索引）。" +
      "不替代官方文档工具；适合发布/兼容/崩溃分类等实操问题。" +
      "返回命中含 sourceKind、url、summary；links 仅外链。",
    inputSchema: searchCommunityDocsSchema,
  },
  async (args): Promise<CallToolResult> => {
    try {
      const result = await searchCommunityDocs(args);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    } catch (e) {
      return {
        content: [{ type: "text", text: `错误: ${(e as Error).message}` }],
        isError: true,
      };
    }
  }
);

server.registerTool(
  "get_community_doc_summary",
  {
    title: "Get Community Doc Summary",
    description: "获取社区知识条目摘要（含署名与 sourceKind）。links 条目仅返回元数据与外链。",
    inputSchema: getCommunityDocSummarySchema,
  },
  async (args): Promise<CallToolResult> => {
    try {
      const result = await getCommunityDocSummary(args);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    } catch (e) {
      return communityDocError(e);
    }
  }
);

server.registerTool(
  "get_community_doc_full",
  {
    title: "Get Community Doc Full",
    description:
      "获取社区知识全文。permitted/authored 返回仓库内 Markdown；" +
      "links 仅返回 URL 与免责声明，不抓取网页正文。",
    inputSchema: getCommunityDocFullSchema,
  },
  async (args): Promise<CallToolResult> => {
    try {
      const result = await getCommunityDocFull(args);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    } catch (e) {
      return communityDocError(e);
    }
  }
);

// ── 9. Fabric 官方文档搜索 ─────────────────────────────────────────────────
server.registerTool(
  searchFabricDocsSchema.name,
  {
    title: "Search Official Fabric Documentation",
    description:
      "搜索 Fabric 官方文档（hybrid：L0 关键词 + 语义检索，RRF 融合；无语义库时回退纯 L0）。" +
      "适用于：需要了解 Fabric 特有功能（如 Registry.register、Identifier、Mixin、网络通信）的官方说明时。" +
      "返回相关页面 ID 列表，每个结果包含标题、摘要和标签。" +
      "建议配合 get_fabric_doc_summary 使用：先搜索，再对相关页面取摘要判断是否深入。" +
      "增强功能：支持 class:/event:/method: 前缀精确路由；支持 | OR 分组；自动去除 the/and/of 等停用词。",
    inputSchema: searchFabricDocsSchema.inputSchema,
  },
  async (args): Promise<CallToolResult> => {
    return searchFabricDocs({ query: args.query, version: args.version, tags: args.tags, source: args.source });
  }
);

// ── 10. Fabric 文档摘要 ──────────────────────────────────────────────────
server.registerTool(
  getFabricDocSummarySchema.name,
  {
    title: "Get Fabric Doc Summary",
    description: "获取 Fabric 文档页面的章节骨架与摘要，用于判断是否需要深入。",
    inputSchema: getFabricDocSummarySchema.inputSchema,
  },
  async (args): Promise<CallToolResult> => {
    return getFabricDocSummary({ id: args.id, version: args.version, source: args.source });
  }
);

// ── 11. Fabric 文档全文 ─────────────────────────────────────────────────
server.registerTool(
  getFabricDocFullSchema.name,
  {
    title: "Get Fabric Doc Full",
    description: "获取 Fabric 文档页面全文。highlight_key=true（默认）时，关键段落（🔴🟠🟢⭐）突出显示。",
    inputSchema: getFabricDocFullSchema.inputSchema,
  },
  async (args): Promise<CallToolResult> => {
    return getFabricDocFull({ id: args.id, version: args.version, highlight_key: args.highlight_key, source: args.source });
  }
);

// ── 12. Fabric 相关文档 ─────────────────────────────────────────────────
server.registerTool(
  getFabricDocRelatedSchema.name,
  {
    title: "Get Related Fabric Docs",
    description: "返回与目标 Fabric 文档共享最多关键词的其他页面，按相关性降序排列。",
    inputSchema: getFabricDocRelatedSchema.inputSchema,
  },
  async (args): Promise<CallToolResult> => {
    return getFabricDocRelated({ id: args.id, version: args.version, limit: args.limit, source: args.source });
  }
);

// ── 13. 列出可用版本 ─────────────────────────────────────────────────────
server.registerTool(
  listForgeVersionsSchema.name,
  {
    title: "List Available Forge Doc Versions",
    description:
      "返回 data 目录下所有已加载的 Forge 文档版本列表（如 [\"1.20.1\"]）。" +
      "用于确认当前 MCP 服务支持哪些版本，无需通过报错来发现。",
    inputSchema: listForgeVersionsSchema.inputSchema,
  },
  async (): Promise<CallToolResult> => {
    return listForgeVersions();
  }
);

// ── 13a. 列出 Fabric 可用版本 ──────────────────────────────────────────
server.registerTool(
  listFabricVersionsSchema.name,
  {
    title: "List Available Fabric Doc Versions",
    description:
      "返回 data 目录下所有已加载的 Fabric 文档版本列表（如 [\"1.20.1\"]）。",
    inputSchema: listFabricVersionsSchema.inputSchema,
  },
  async (): Promise<CallToolResult> => {
    return listFabricVersions();
  }
);

// ── 13b. 列出 NeoForge 可用版本 ─────────────────────────────────────────
server.registerTool(
  listNeoForgeVersionsSchema.name,
  {
    title: "List Available NeoForge Doc Versions",
    description:
      "返回 data 目录下所有已加载的 NeoForge 文档版本列表（如 [\"26.1\", \"1.21.11\", \"1.20.4\", ...]）。" +
      "注意：1.20.1 版本使用 Forge 1.20.1 数据（100% API 兼容）。",
    inputSchema: listNeoForgeVersionsSchema.inputSchema,
  },
  async (): Promise<CallToolResult> => {
    return listNeoForgeVersions();
  }
);

// ── 13c. NeoForge 文档搜索 ─────────────────────────────────────────────
server.registerTool(
  searchNeoForgeDocsSchema.name,
  {
    title: "Search Official NeoForge Documentation",
    description:
      "搜索 NeoForge 官方文档（hybrid：L0 关键词 + 语义检索，RRF 融合；无语义库时回退纯 L0）。" +
      "适用于：需要了解 NeoForge 特有功能（如 DeferredRegister、Data Components、Payload 网络）的官方说明时。" +
      "返回相关页面 ID 列表，每个结果包含标题、标签和相关性评分。",
    inputSchema: searchNeoForgeDocsSchema.inputSchema,
  },
  async (args): Promise<CallToolResult> => {
    return searchNeoForgeDocs({
      query: args.query,
      version: args.version,
      tags: args.tags,
    });
  }
);

// ── 13d. NeoForge 文档摘要 ──────────────────────────────────────────────
server.registerTool(
  getNeoForgeDocSummarySchema.name,
  {
    title: "Get NeoForge Doc Summary",
    description: "获取 NeoForge 文档页面的章节骨架与摘要（L1），用于判断是否需要深入。",
    inputSchema: getNeoForgeDocSummarySchema.inputSchema,
  },
  async (args): Promise<CallToolResult> => {
    return getNeoForgeDocSummary({ id: args.id, version: args.version });
  }
);

// ── 13e. NeoForge 文档全文 ──────────────────────────────────────────────
server.registerTool(
  getNeoForgeDocFullSchema.name,
  {
    title: "Get Full NeoForge Documentation Page",
    description:
      "获取 NeoForge 文档页面全文（L2/L2+）。" +
      "highlight_key=true（默认）时，关键段落（🔴新手必读、🟠常见错误、🟢示例代码）突出显示。" +
      "**永远不要一次性加载超过 2 个 full page**。",
    inputSchema: getNeoForgeDocFullSchema.inputSchema,
  },
  async (args): Promise<CallToolResult> => {
    return getNeoForgeDocFull({
      id: args.id,
      version: args.version,
      highlight_key: args.highlight_key,
    });
  }
);

// ── 13f. NeoForge 相关文档 ─────────────────────────────────────────────
server.registerTool(
  getNeoForgeDocRelatedSchema.name,
  {
    title: "Get Related NeoForge Docs",
    description: "返回与目标 NeoForge 文档共享最多标签关键词的其他页面，按相关性降序排列。",
    inputSchema: getNeoForgeDocRelatedSchema.inputSchema,
  },
  async (args): Promise<CallToolResult> => {
    return getNeoForgeDocRelated({ id: args.id, version: args.version, limit: args.limit });
  }
);

// ── 14. 通用文档版本列表 ─────────────────────────────────────────────────
server.registerTool(
  listVersionsSchema.name,
  {
    title: "List Available Doc Versions (Multi-Platform)",
    description:
      "返回指定平台的可用文档版本列表。" +
      "platform 参数指定平台（forge/neoforge/fabric/quilt/liteloader/rift/modloader），必填。基岩请用 search_bedrock_docs。",
    inputSchema: listVersionsSchema.inputSchema,
  },
  async (args): Promise<CallToolResult> => {
    return listVersions({ platform: args.platform });
  }
);

// ── 15. 通用文档搜索 ─────────────────────────────────────────────────────
server.registerTool(
  searchDocsSchema.name,
  {
    title: "Search Documentation (Multi-Platform)",
    description:
      "通用文档搜索（hybrid：L0 关键词 + 语义检索，RRF 融合；无语义库时回退纯 L0），支持多平台（Forge/NeoForge/Fabric）。" +
      "platform 参数指定平台，必填，禁止默认 forge。" +
      "适用于：需要了解平台特有功能的官方说明时。" +
      "增强功能：支持 class:/event:/method: 前缀精确路由；支持 | OR 分组；自动去除 the/and/of 等停用词。",
    inputSchema: searchDocsSchema.inputSchema,
  },
  async (args): Promise<CallToolResult> => {
    return searchDocs({
      query: args.query,
      version: args.version,
      platform: args.platform,
      tags: args.tags,
      source: args.source,
    });
  }
);

// ── 16. 通用文档摘要 ─────────────────────────────────────────────────────
server.registerTool(
  getDocSummarySchema.name,
  {
    title: "Get Doc Page Summary (Multi-Platform)",
    description: getDocSummarySchema.description,
    inputSchema: getDocSummarySchema.inputSchema,
  },
  async (args): Promise<CallToolResult> => {
    return getDocSummary({ id: args.id, version: args.version, platform: args.platform });
  }
);

// ── 17. 通用文档全文 ─────────────────────────────────────────────────────
server.registerTool(
  getDocFullSchema.name,
  {
    title: "Get Full Documentation Page (Multi-Platform)",
    description: getDocFullSchema.description,
    inputSchema: getDocFullSchema.inputSchema,
  },
  async (args): Promise<CallToolResult> => {
    return getDocFull({
      id: args.id,
      version: args.version,
      platform: args.platform,
      highlight_key: args.highlight_key,
    });
  }
);

// ── 18. 通用文档相关页面 ─────────────────────────────────────────────────
server.registerTool(
  getDocRelatedSchema.name,
  {
    title: "Get Related Documentation Pages (Multi-Platform)",
    description: getDocRelatedSchema.description,
    inputSchema: getDocRelatedSchema.inputSchema,
  },
  async (args): Promise<CallToolResult> => {
    return getDocRelated({ id: args.id, version: args.version, platform: args.platform, limit: args.limit });
  }
);

// ── 诊断工具（可选，高级排障用）──────────────────────────────────────────────

server.registerTool(
  "diagnose_data_paths",
  {
    title: "Diagnose Data Path Configuration",
    description:
      "诊断数据目录配置（高级排障用）。返回各平台数据目录的可用性状态。" +
      "诊断 MC_SKILL_DATA / MC_SKILL_COMMUNITY 解析结果，以及 forge/fabric/neoforge/quilt/liteloader/rift/modloader/bedrock/community 是 found / empty / not_found。",
    inputSchema: diagnoseDataPathsSchema,
  },
  async (): Promise<CallToolResult> => {
    const result = diagnoseDataPaths();
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

// ── 移植分析工具（port_project 模块）────────────────────────────────────────

server.registerTool(
  "analyze_porting_path",
  {
    title: "Analyze Mod Porting Path",
    description:
      "分析 Minecraft Mod 项目，生成跨平台/跨版本移植路线图。" +
      "扫描 build.gradle、mods.toml、fabric.mod.json 和源码，识别当前平台、版本、" +
      "Mappings、是否使用 Architectury，并输出风险评估、动态 routeSteps、" +
      "参考链接和建议的 query_api 调用。" +
      "targetPlatform 可含 quilt；基岩/LiteLoader/Rift/ModLoader 返回 UNSUPPORTED_PORT。" +
      "适用于：用户询问如何将 Mod 移植到其他平台或版本时。",
    inputSchema: analyzePortingPathSchema,
  },
  async (args): Promise<CallToolResult> => {
    const result = await analyzePortingPath(args);
    return { content: [{ type: "text", text: result }] };
  }
);

server.registerTool(
  "port_project",
  {
    title: "Execute Porting Step",
    description:
      "执行移植步骤（init_architectury / extract_common / apply_version_migration）。" +
      "所有写文件操作默认 dryRun=true，仅输出 diff 预览。" +
      "实际写入需要：dryRun=false、confirmed=true、环境变量 MC_SKILL_ALLOW_WRITE=1，" +
      "且 projectPath 位于 MC_SKILL_PROJECT_ROOT 允许目录内。" +
      "适用于：接收到 analyze_porting_path 输出的 routeSteps 后，按步骤执行。" +
      "注意：extract_common 仅做静态分析，输出候选清单，不执行文件移动。" +
      "apply_version_migration 在确认写入时会真实执行包名替换；冲突文件在 confirmed 写入时会被拒绝。",
    inputSchema: portProjectSchema,
  },
  async (args): Promise<CallToolResult> => {
    const result = await portProject(args);
    return { content: [{ type: "text", text: result }] };
  }
);

server.registerTool(
  "search_bedrock_docs",
  {
    title: "Search Bedrock Creator docs",
    description:
      "搜索基岩版 Microsoft Learn Creator 文档（hybrid L0+语义）。每次返回 docsStatus 滞后标记。不是 search_forge_docs。",
    inputSchema: searchBedrockDocsSchema,
  },
  async (args): Promise<CallToolResult> => searchBedrockDocs(args),
);
server.registerTool(
  "get_bedrock_doc_summary",
  {
    title: "Bedrock doc summary",
    description: "基岩文档 L1 摘要。带 docsStatus。不是 get_forge_doc_summary。",
    inputSchema: getBedrockDocSummarySchema,
  },
  async (args): Promise<CallToolResult> => getBedrockDocSummary(args),
);
server.registerTool(
  "get_bedrock_doc_full",
  {
    title: "Bedrock doc full page",
    description: "基岩文档全文。一次 ≤ 2 页。带 docsStatus。",
    inputSchema: getBedrockDocFullSchema,
  },
  async (args): Promise<CallToolResult> => getBedrockDocFull(args),
);
server.registerTool(
  "get_bedrock_doc_related",
  {
    title: "Related Bedrock docs",
    description: "基岩文档相关页。带 docsStatus。",
    inputSchema: getBedrockDocRelatedSchema,
  },
  async (args): Promise<CallToolResult> => getBedrockDocRelated(args),
);
server.registerTool(
  "validate_addon_manifest",
  {
    title: "Validate Bedrock pack manifest",
    description: "校验基岩 manifest.json（header/modules/UUID/capabilities）。不是 validate_project。禁止 experimentalGameplay。",
    inputSchema: validateAddonManifestSchema,
  },
  async (args): Promise<CallToolResult> => ({
    content: [{ type: "text", text: JSON.stringify(validateAddonManifest(args.manifestJson), null, 2) }],
  }),
);
server.registerTool(
  "validate_bp_json",
  {
    title: "Validate Bedrock BP JSON",
    description: "精简校验 entity/block/item/recipe JSON。不是 validate_datapack_json（Java pack_format）。",
    inputSchema: validateBpJsonSchema,
  },
  async (args): Promise<CallToolResult> => ({
    content: [{ type: "text", text: JSON.stringify(validateBpJson(args.kind, args.json), null, 2) }],
  }),
);
server.registerTool(
  "generate_addon_manifest",
  {
    title: "Generate Bedrock manifest JSON",
    description: "只吐 manifest JSON 文本，不写盘。默认 stable @minecraft/server；beta=true 才写 beta 依赖并提示世界 Beta APIs。",
    inputSchema: generateAddonManifestSchema,
  },
  async (args): Promise<CallToolResult> => ({
    content: [{ type: "text", text: JSON.stringify(generateAddonManifest(args), null, 2) }],
  }),
);
server.registerTool(
  "generate_bp_entity",
  {
    title: "Generate Bedrock BP entity JSON",
    description: "只吐 BP 实体 JSON 文本，不写盘。点名 Beta 爆炸事件时才给 script 片段，并附带 BP/manifest.json（@minecraft/server version=beta）。禁止写 experimentalGameplay。",
    inputSchema: generateBpEntitySchema,
  },
  async (args): Promise<CallToolResult> => ({
    content: [{ type: "text", text: JSON.stringify(generateBpEntity(args), null, 2) }],
  }),
);

registerWaveExtensions(server);

// ── 工具 schema 清单（供 CLI list-tools / schema 驱动解析；无副作用）──────────
// description 需与上方各 registerTool 的 description 保持一致（改动时同步）。
export type ToolSchemaEntry = {
  name: string;
  description: string;
  inputSchema: z.ZodTypeAny;
};

export const indexToolSchemas: ToolSchemaEntry[] = [
  { name: "query_api", description: "查询 Minecraft/Vanilla 类的完整方法签名、参数名、返回值类型。数据来源：按 version 加载的 Parchment extracted 索引（version 必填，禁止默认 1.20.1）。适用于：需要确认某个 Minecraft API 的正确用法时。注意：不包含 Forge 特有类（如 DeferredRegister、Capability）。返回 found=true 时包含完整 javadoc。【边界】覆盖约 1.16.5–1.20.4。1.7.10–1.12.2 可能 found:true 但 methods 为空（类名空壳），不是完整 javadoc。1.14.4/1.15.2 索引为空；1.21+ / 26.1+ 无索引。found:false 表示本索引没有该类。平台 API 请用 query_loader_api 或 search_*_docs。", inputSchema: queryApiSchema },
  { name: "get_method_params", description: "查询指定方法的完整参数名列表（来源：Parchment extracted，按 version 加载）。适用于：当知道方法名但不确定参数顺序和名称时。需提供 className + methodName；重载方法建议附上 descriptor。返回参数索引、名称和 JNI 描述符。【边界】与 query_api 同一索引，覆盖约 1.16.5–1.20.4；26.1+ 无索引。found:false 表示索引没有该方法，不代表运行时不存在。", inputSchema: getMethodParamsSchema },
  { name: "convert_mapping", description: "在 mojang / mcp / yarn / parchment / obfuscated / intermediary 间互转类或方法名（预建 yarn-mappings.sqlite）。\nobfuscated = Tiny official 混淆短名；intermediary = method_6032 类。to=mojang 仍返回混淆短名（兼容），建议 to=obfuscated；可读名用 to=yarn / query_api。\n无 ownerClass 时 obfuscated/intermediary 走 method→field→class 全局反查。26.1+ → UNOBFUSCATED_NO_YARN。\nmcp↔parchment 为同名层（identity）；参数名请用 get_method_params。\n方法重载请传 descriptor；无 descriptor 且多重载时 found=false 且 ambiguous=true，返回 candidates。\n失败默认 converted=null；allow_fallback=true 时可回传原名并设 fallbackUsed（过渡期）。\n@example from=mcp to=mojang memberName=getHealth ownerClass=net.minecraft.world.entity.LivingEntity → er\n@example from=intermediary to=obfuscated memberName=method_6032 → er", inputSchema: convertMappingSchema },
  { name: "get_server_status", description: "查看 API 索引预热状态、数据路径诊断与 descriptor 自检。适用于：调用失败排查、确认 schema/映射数据是否就绪。", inputSchema: getServerStatusSchema },
  { name: "get_version_info", description: "【Forge only】获取指定 Minecraft/Forge 版本的推荐做法、关键变更点和官方 Changelog 链接。适用于：开始新版本开发、遇到版本兼容性问题、或不确定某个 API 在特定版本中的用法时。返回该版本的 Forge 版本号、推荐注册方式、关键 gotchas 和官方链接。【边界】platform 必须为 forge，缺省或非 forge 返回 WRONG_TOOL。不要用于 Fabric / NeoForge 工程，请改用 search_*_docs。1.12.2 注册是 RegistryEvent，不要套 DeferredRegister。未知 version（含 constructor 等原型键）返回 forgeVersion=unknown，不是把 Object.prototype 当版本。", inputSchema: getVersionInfoSchema },
  { name: "diagnose_gradle", description: "校验 ForgeGradle + Fabric/Quilt Loom + NeoGradle/ModDevGradle。Loom：插件 id（26.1 必须 net.fabricmc.fabric-loom）、Java toolchain（1.21=21，26.1=25）、Yarn vs 去混淆、26.1 禁止 modImplementation。Neo/MDG：插件 id、minecraft_version/neo_version、26.1 须能看出 buildPlugin、Java 21 vs 25。含 net.minecraftforge.gradle.liteloader 时走轻量模式。Rift / BaseMod / 基岩仍早退。", inputSchema: diagnoseGradleSchema },
  { name: "generate_datagen", description: "生成 DataGen Provider 类代码模板（RecipeProvider、BlockStateProvider、ItemModelProvider、LootTableProvider、BlockTagsProvider）。适用于：需要为方块/物品生成资源文件时（配方、方块状态、物品模型、掉落表、方块标签）。注意：platform 与 version 均必填。Forge 1.20.1 与 1.20.4；NeoForge 1.20.4 / 1.20.6（均仅 recipe）/ 1.21.x / 26.1；Fabric 精确档 1.21.1/1.21.4/1.21.8/1.21.10/1.21.11 与 26.1；Quilt 无足够 QSL 类名则 error。其它 Forge 版本（含 1.12.2）返回 error。返回完整的 Java 代码模板。【边界】只返回 Java 模板文本，不写盘。", inputSchema: generateDatagenSchema },
  { name: "crash_analyze", description: "解析崩溃报告全文，通过内置模式库识别可能成因并返回修复建议。适用于：模组运行崩溃、收到玩家的崩溃日志时。支持识别常见崩溃原因（Mixin、Capability、BlockEntity、DeferredRegister、BlockItem、CreativeModeTab、网络包、SpawnPlacement、方块属性、声音、loot、注册名重复等），并推断 crashKind（fml/client/server/fabric/quilt/liteloader/rift/modloader/…）、缺前置/版本不兼容，以及 logHints。**优先于搜索引擎使用此工具**；实务分类可配合 search_community_docs。", inputSchema: crashAnalyzeSchema },
  { name: "validate_project", description: "校验模组项目结构。Forge：mods.toml / DeferredRegister / @Mod。Fabric/Quilt：fabric.mod.json / quilt.mod.json 的 id 与 entrypoint 类；出现 Forge DeferredRegister 仅 WARN。NeoForge：neoforge.mods.toml、@Mod + IEventBus 构造；RegistryObject 不推荐；禁止 SimpleChannel。LiteLoader/Rift/ModLoader/基岩仍 skipped（基岩请用 validate_addon_manifest）。坏 recipe 只 warning。Java 扫描上限默认 300，可用 MC_SKILL_JAVA_SCAN_MAX_FILES 提高。", inputSchema: validateProjectSchema },
  { name: "search_forge_docs", description: "搜索 Forge 官方文档（hybrid：L0 关键词 + 语义检索，RRF 融合；无语义库时回退纯 L0）。适用于：需要了解 Forge 特有功能（如 Capability、DeferredRegister、网络通信、DataGen）的官方说明时。返回相关页面 ID 列表，每个结果包含标题、摘要和标签。建议配合 get_forge_doc_summary 使用：先搜索，再对相关页面取摘要判断是否深入。增强功能：支持 class:/event:/method: 前缀精确路由；支持 | OR 分组；自动去除 the/and/of 等停用词。另外另有 query_api 工具，可直接查询 Vanilla/Parchment 类的参数名和 javadoc，适合在已知类名后精确查询某个方法的签名。", inputSchema: searchForgeDocsSchema.inputSchema },
  { name: "get_forge_doc_summary", description: "获取 Forge 文档页面的章节骨架与摘要。适用于：判断某篇文档是否包含所需内容时。返回每个 <h2> 章节的标题、150-200 字摘要和首段概述。建议：先 search_forge_docs 搜索关键词，再对相关页面取摘要，最后仅当摘要显示内容相关时才调用 get_forge_doc_full 获取全文。", inputSchema: getForgeDocSummarySchema.inputSchema },
  { name: "get_forge_doc_full", description: "获取 Forge 文档页面全文。适用于：需要查看 API 完整步骤、事件列表、配置项清单时。highlight_key=true（默认）时，关键段落（🔴新手必读、🟠常见错误、🟢示例代码）会突出显示在开头。**永远不要一次性加载超过 2 个 full page**，避免上下文溢出。", inputSchema: getForgeDocFullSchema.inputSchema },
  { name: "get_forge_doc_related", description: "获取与指定 Forge 文档页面相关的其他页面列表。适用于：想了解某个主题，但不知道还需要查阅哪些关联文档时。返回与目标页面共享最多 section 关键词的其他页面，按相关性降序排列。", inputSchema: getForgeDocRelatedSchema.inputSchema },
  { name: "list_forge_versions", description: "返回 data 目录下所有已加载的 Forge 文档版本列表（如 [\"1.20.1\"]）。用于确认当前 MCP 服务支持哪些版本，无需通过报错来发现。", inputSchema: listForgeVersionsSchema.inputSchema },
  { name: "list_community_sources", description: "列出 community_knowledge 已收录条目（permitted / authored / links）。用于了解可用社区资料与署名来源；正式 API 仍优先 search_forge_docs / search_fabric_docs。", inputSchema: listCommunitySourcesSchema },
  { name: "search_community_docs", description: "搜索社区知识库（许可提炼、自写笔记、外链索引）。不替代官方文档工具；适合发布/兼容/崩溃分类等实操问题。返回命中含 sourceKind、url、summary；links 仅外链。", inputSchema: searchCommunityDocsSchema },
  { name: "get_community_doc_summary", description: "获取社区知识条目摘要（含署名与 sourceKind）。links 条目仅返回元数据与外链。", inputSchema: getCommunityDocSummarySchema },
  { name: "get_community_doc_full", description: "获取社区知识全文。permitted/authored 返回仓库内 Markdown；links 仅返回 URL 与免责声明，不抓取网页正文。", inputSchema: getCommunityDocFullSchema },
  { name: "search_fabric_docs", description: "搜索 Fabric 官方文档（hybrid：L0 关键词 + 语义检索，RRF 融合；无语义库时回退纯 L0）。适用于：需要了解 Fabric 特有功能（如 Registry.register、Identifier、Mixin、网络通信）的官方说明时。返回相关页面 ID 列表，每个结果包含标题、摘要和标签。建议配合 get_fabric_doc_summary 使用：先搜索，再对相关页面取摘要判断是否深入。增强功能：支持 class:/event:/method: 前缀精确路由；支持 | OR 分组；自动去除 the/and/of 等停用词。", inputSchema: searchFabricDocsSchema.inputSchema },
  { name: "get_fabric_doc_summary", description: "获取 Fabric 文档页面的章节骨架与摘要，用于判断是否需要深入。", inputSchema: getFabricDocSummarySchema.inputSchema },
  { name: "get_fabric_doc_full", description: "获取 Fabric 文档页面全文。highlight_key=true（默认）时，关键段落（🔴🟠🟢⭐）突出显示。", inputSchema: getFabricDocFullSchema.inputSchema },
  { name: "get_fabric_doc_related", description: "返回与目标 Fabric 文档共享最多关键词的其他页面，按相关性降序排列。", inputSchema: getFabricDocRelatedSchema.inputSchema },
  { name: "list_fabric_versions", description: "返回 data 目录下所有已加载的 Fabric 文档版本列表（如 [\"1.20.1\"]）。", inputSchema: listFabricVersionsSchema.inputSchema },
  { name: "search_neoforge_docs", description: "搜索 NeoForge 官方文档（hybrid：L0 关键词 + 语义检索，RRF 融合；无语义库时回退纯 L0）。适用于：需要了解 NeoForge 特有功能（如 DeferredRegister、Data Components、Payload 网络）的官方说明时。返回相关页面 ID 列表，每个结果包含标题、标签和相关性评分。", inputSchema: searchNeoForgeDocsSchema.inputSchema },
  { name: "get_neoforge_doc_summary", description: "获取 NeoForge 文档页面的章节骨架与摘要（L1），用于判断是否需要深入。", inputSchema: getNeoForgeDocSummarySchema.inputSchema },
  { name: "get_neoforge_doc_full", description: "获取 NeoForge 文档页面全文（L2/L2+）。highlight_key=true（默认）时，关键段落（🔴新手必读、🟠常见错误、🟢示例代码）突出显示。**永远不要一次性加载超过 2 个 full page**。", inputSchema: getNeoForgeDocFullSchema.inputSchema },
  { name: "get_neoforge_doc_related", description: "返回与目标 NeoForge 文档共享最多标签关键词的其他页面，按相关性降序排列。", inputSchema: getNeoForgeDocRelatedSchema.inputSchema },
  { name: "list_neoforge_versions", description: "返回 data 目录下所有已加载的 NeoForge 文档版本列表（如 [\"26.1\", \"1.21.11\", \"1.20.4\", ...]）。注意：1.20.1 版本使用 Forge 1.20.1 数据（100% API 兼容）。", inputSchema: listNeoForgeVersionsSchema.inputSchema },
  { name: "list_doc_versions", description: "返回指定平台的可用文档版本列表。platform：forge/neoforge/fabric/quilt/liteloader/rift/modloader，必填。基岩请用 search_bedrock_docs。", inputSchema: listVersionsSchema.inputSchema },
  { name: "search_docs", description: "通用文档搜索（hybrid：L0 关键词 + 语义检索）。platform 含 forge/neoforge/fabric/quilt/liteloader/rift/modloader。Quilt 问 QSL 时禁止把 Fabric Registry 当命中。基岩请用 search_bedrock_docs。语义索引过期时 warning 含 stale。", inputSchema: searchDocsSchema.inputSchema },
  { name: "get_doc_summary", description: getDocSummarySchema.description, inputSchema: getDocSummarySchema.inputSchema },
  { name: "get_doc_full", description: getDocFullSchema.description, inputSchema: getDocFullSchema.inputSchema },
  { name: "get_doc_related", description: getDocRelatedSchema.description, inputSchema: getDocRelatedSchema.inputSchema },
  { name: "diagnose_data_paths", description: "诊断数据目录配置（高级排障用）。返回各平台数据目录的可用性状态。诊断 MC_SKILL_DATA / MC_SKILL_COMMUNITY 解析结果，以及 forge/fabric/neoforge/quilt/liteloader/rift/modloader/bedrock/community 是 found / empty / not_found。", inputSchema: diagnoseDataPathsSchema },
  { name: "analyze_porting_path", description: "分析 Minecraft Mod 项目移植路线。targetPlatform 可含 quilt；基岩/LiteLoader/Rift/ModLoader 返回 UNSUPPORTED_PORT。", inputSchema: analyzePortingPathSchema },
  { name: "port_project", description: "执行移植步骤。基岩/三老加载器目标返回 UNSUPPORTED_PORT。写盘默认 dryRun。", inputSchema: portProjectSchema },
  { name: "search_bedrock_docs", description: "搜索基岩版 Microsoft Learn Creator 文档（hybrid L0+语义）。每次返回 docsStatus 滞后标记。不是 search_forge_docs。", inputSchema: searchBedrockDocsSchema },
  { name: "get_bedrock_doc_summary", description: "基岩文档 L1 摘要。带 docsStatus。不是 get_forge_doc_summary。", inputSchema: getBedrockDocSummarySchema },
  { name: "get_bedrock_doc_full", description: "基岩文档全文。一次 ≤ 2 页。带 docsStatus。", inputSchema: getBedrockDocFullSchema },
  { name: "get_bedrock_doc_related", description: "基岩文档相关页。带 docsStatus。", inputSchema: getBedrockDocRelatedSchema },
  { name: "validate_addon_manifest", description: "校验基岩 manifest.json（header/modules/UUID/capabilities）。不是 validate_project。禁止 experimentalGameplay。", inputSchema: validateAddonManifestSchema },
  { name: "validate_bp_json", description: "精简校验 entity/block/item/recipe JSON。不是 validate_datapack_json（Java pack_format）。", inputSchema: validateBpJsonSchema },
  { name: "generate_addon_manifest", description: "只吐 manifest JSON 文本，不写盘。默认 stable @minecraft/server；beta=true 才写 beta 依赖并提示世界 Beta APIs。", inputSchema: generateAddonManifestSchema },
  { name: "generate_bp_entity", description: "只吐 BP 实体 JSON 文本，不写盘。点名 Beta 爆炸事件时才给 script 片段，并附带 BP/manifest.json（@minecraft/server version=beta）。禁止写 experimentalGameplay。", inputSchema: generateBpEntitySchema },
];

/** 全部工具 schema（index + wave；基岩 8 个工具计入 index）。 */
export function listAllToolSchemas(): ToolSchemaEntry[] {
  return [...indexToolSchemas, ...waveToolSchemas];
}

