import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import * as z from "zod";
import { missingMcVersion, versionRequiredAction } from "./utils/actionable.js";
import { getBuildStatus } from "./utils/build-status.js";
import { assertToolRegistrationComplete, patchToolCollection } from "./tool-handlers.js";
import { queryApi, warmupApi, listApiPreloadStatuses, getApiPreloadStatus } from "./api/index.js";
import { convertMapping, getMethodParams } from "./mappings/index.js";
import { readableSignature, returnType, parameterTypes } from "./utils/descriptor.js";
import { getUpdateHint } from "./update/index.js";
import { getVersionInfo } from "./version/index.js";
import { diagnoseGradle } from "./gradle/index.js";
import { generateDatagen } from "./datagen/index.js";
import { maybeWriteGeneratorResult } from "./generators/write-helper.js";
import { analyzeCrash } from "./crash/index.js";
import { validateProject } from "./validate/index.js";
import { resolveLibSkillsSchema, RESOLVE_LIB_SKILLS_DESCRIPTION } from "./lib-skills/index.js";
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
import { probeJava } from "./decompile/java/java-process.js";
import { getSemanticIndexStatus } from "./docs-platform/semantic/status.js";
import { analyzePortingPath, portProject } from "./porting/index.js";
import { queryUpstreamReleases } from "./upstream/releases.js";
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
  analyzeBedrockContentLog,
  analyzeBedrockContentLogSchema,
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
      "language",
    ])
    .describe("Provider 类型"),
  modId: z.string().describe("Mod ID（全小写），如 mymod"),
  targetName: z.string().describe("目标注册名（无 modId 前缀），如 my_block"),
  version: z.string().describe("Minecraft 版本，必填，禁止默认 1.20.1"),
  platform: z.enum(["forge", "neoforge", "fabric", "quilt"]).describe("loader 平台，必填，禁止默认 forge"),
  write: z.boolean().optional().describe("默认 false。true 时写入 projectPath（须 confirmed + MC_SKILL_ALLOW_WRITE=1 + MC_SKILL_PROJECT_ROOT；projectPath 不能替代后者）"),
  confirmed: z.boolean().optional().describe("write=true 时必填 true"),
  projectPath: z.string().optional().describe("写入目标工程根（须在 MC_SKILL_PROJECT_ROOT 内）"),
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
  neoforgeVersion: z.string().optional().describe("init_architectury 写入 gradle.properties 的 neoforge_version；缺省则拒绝"),
});

export const queryUpstreamReleasesSchema = z.object({
  source: z
    .enum(["forge", "neoforge", "fabric-loader", "fabric-yarn", "quilt-loader", "parchment", "modrinth"])
    .describe("上游发布源。forge 走 maven-metadata.xml（全量，可选按 MC 过滤）；neoforge 同（注意 NeoForge 编号去掉前导 1.：MC 1.21.1 → 21.1.x）；fabric-loader / fabric-yarn / quilt-loader / parchment 的端点按 MC 版本分列，**必须带 minecraftVersion**；modrinth 走 project slug 查任意第三方模组/库"),
  minecraftVersion: z
    .string()
    .min(1)
    .optional()
    .describe('Minecraft 版本，如 "1.20.1"。fabric-loader / fabric-yarn / quilt-loader / parchment 必填（后两者按 artifact 名分列）；forge / neoforge / modrinth 可选（传了就只回该 MC 的版本，不传回全表）'),
  slug: z.string().optional().describe("modrinth 专用：project slug（小写字母数字与连字符，如 fabric-api）。其它源忽略。CLI 侧故意不叫 project —— --project 在本仓 CLI 是 projectPath 的保留别名，会被吞掉"),
  limit: z.number().int().min(1).max(200).optional().default(12).describe("最多回几条（按版本号降序取前 N），默认 12；total 始终是过滤后的总条数"),
});

/**
 * P0-2 分层输出：仓库首个 outputSchema。text 仍是完整 JSON（CLI 的 unwrapHandlerResult
 * 与 isToolFailure 靠它），structuredContent 给宿主同构对象 —— 省 token 靠
 * releases 截断到 limit + total/truncated/latest 把「截断」这件事说破，不是靠少给字段。
 */
export const queryUpstreamReleasesOutputSchema = z.object({
  ok: z.boolean(),
  source: z.enum(["forge", "neoforge", "fabric-loader", "fabric-yarn", "quilt-loader", "parchment", "modrinth"]),
  url: z.string(),
  minecraftVersion: z.string().optional(),
  available: z.boolean(),
  total: z.number().int().min(0),
  releases: z.array(
    z.object({
      version: z.string(),
      maven: z.string().optional(),
      timestamp: z.string().optional(),
      stable: z.boolean().optional(),
      gameVersions: z.array(z.string()).optional(),
      loaders: z.array(z.string()).optional(),
    }),
  ),
  latest: z.string().optional(),
  truncated: z.boolean().optional(),
  matchRule: z.string().optional(),
  httpStatus: z.number().int().optional(),
  via: z.enum(["fetch", "curl"]).optional(),
  redirectedTo: z.string().optional(),
  error: z.object({ code: z.string(), message: z.string(), hint: z.string().optional() }).optional(),
  fetchedAt: z.string(),
});

function communityDocError(e: unknown): CallToolResult {
  if (e instanceof CommunityDocNotFoundError) {
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          ok: false,
          id: e.id,
          error: {
            code: e.code,
            message: e.message,
            hint: "请用 search_community_docs 或 list_community_sources 确认 id",
          },
        }, null, 2),
      }],
    };
  }
  return {
    content: [{
      type: "text",
      text: JSON.stringify({
        ok: false,
        error: {
          code: "INTERNAL_ERROR",
          // 非 Error 抛出值（字符串/对象）也能拿到可读 message，而非 "undefined"。
          message: e instanceof Error ? e.message : String(e),
          hint: "请检查 community_knowledge 路径与索引",
        },
      }, null, 2),
    }],
  };
}

// ── 工具描述常量（registerTool 与 indexToolSchemas 共用；F-C01..C09）─────────
// 两处必须引用同一常量，禁止再各写一份字面量（test-cli.mjs 有逐工具一致性断言）。

const QUERY_API_DESC =
  "查询 Minecraft/Vanilla 类的完整方法签名、参数名、返回值类型。数据来源：按 version 加载的 Parchment extracted 索引（version 必填，禁止默认 1.20.1）。" +
  "适用于：需要确认某个 Minecraft API 的正确用法时。" +
  "注意：不包含 Forge 特有类（如 DeferredRegister、Capability）。返回 found=true 时包含完整 javadoc。" +
  "【边界】覆盖约 1.16.5–1.20.4。1.7.10–1.12.2 可能 found:true 但 methods 为空（类名空壳），不是完整 javadoc。" +
  "1.14.4/1.15.2 与 1.21+/26.1+ 无可用方法索引。found:false 表示本索引没有该类。" +
  "精确 FQCN 或唯一精确简名（如 Item）才 found:true（简名改写时带 autoCorrected+requestedClassName）；" +
  "Handler 等歧义子串 found:false 且 suggestions，不返回 methods。平台 API 请用 query_loader_api 或 search_*_docs。";

const GET_METHOD_PARAMS_DESC =
  "查询指定方法的完整参数名列表（来源：Parchment extracted，按 version 加载）。" +
  "适用于：当知道方法名但不确定参数顺序和名称时。" +
  "需提供 className + methodName；重载未传 descriptor 时 found:false + ambiguous + candidates，不静默取第一个。" +
  "返回参数索引、名称和 JNI 描述符。" +
  "【边界】与 query_api 同一索引，覆盖约 1.16.5–1.20.4；26.1+ / 无索引为 DATA_UNAVAILABLE，改口 search_*_docs。" +
  "found:false 表示索引没有该方法，不代表运行时不存在。";

const CONVERT_MAPPING_DESC =
  "在 mojang / mcp / yarn / parchment / obfuscated / intermediary 间互转类或方法名（预建 yarn-mappings.sqlite）。\n" +
  "obfuscated = Tiny official 混淆短名（er）；intermediary = method_6032 类。to=mojang 仍返回混淆短名（兼容），建议改用 to=obfuscated；可读名请用 to=yarn / query_api。\n" +
  "无 ownerClass 时 obfuscated/intermediary→yarn/mcp 走 method→field→class 全局反查（崩溃日志单 token）。26.1+ 无混淆层 → UNOBFUSCATED_NO_YARN。\n" +
  "mcp↔parchment 为同名层（identity）；参数名请用 get_method_params。\n" +
  "yarn-tiny 数据（fabric 1.14.4–1.21.x）无 MCP/Parchment 可读层：from 或 to 取 mcp/parchment 一律拒绝（YARN_TINY_NO_MCP_LAYER，反向会把 Yarn 名列当 MCP 列伪报 found:true），改用 query_api / get_method_params 或 to=yarn。\n" +
  "方法重载请传 descriptor；无 descriptor 且多重载时 found=false 且 ambiguous=true，返回 candidates。\n" +
  "1.12–1.13 SRG/TSRG+CSV：可带 ownerClass（MCP named→searge→obf）；1.14–1.15 纯 CSV 仅全局 searge↔named（勿传 owner）。\n" +
  "失败默认 converted=null；allow_fallback=true 时可回传原名并设 fallbackUsed（过渡期）。\n" +
  "@example 成功：from=mcp to=mojang memberName=getHealth ownerClass=net.minecraft.world.entity.LivingEntity version=1.20.1 → converted=er\n" +
  "@example obfuscated：from=intermediary to=obfuscated memberName=method_6032 → er；崩溃日志可用 lookup_obfuscated\n" +
  "@example 歧义：同名多重载且不传 descriptor → found=false ambiguous=true candidates=[...]\n" +
  "@example 1.12.2：getHealth + EntityLivingBase → obf（如 cd）；无 owner 的 getHealth → ambiguous\n" +
  "@example CSV：1.14.4 memberName=func_110143_aJ → getHealth；传 ownerClass → csv-no-owner（全量数据下带 owner 未命中时附 CSV 指引）\n" +
  "@example allow_fallback=true 且无表 → found=false converted=原名 fallbackUsed=true";

const GET_VERSION_INFO_DESC =
  "【Forge only】获取指定 Minecraft/Forge 版本的推荐做法、关键变更点和官方 Changelog 链接。" +
  "适用于：开始新版本开发、遇到版本兼容性问题、或不确定某个 API 在特定版本中的用法时。" +
  "返回该版本的 Forge 版本号、推荐注册方式、关键 gotchas 和官方链接。" +
  "【边界】仅 Forge。platform 必须为 forge，缺省或非 forge 返回 WRONG_TOOL。" +
  "不要用于 Fabric / NeoForge / Quilt / 基岩工程，请改用 search_*_docs。1.12.2 及以下版本注册是 RegistryEvent，不要套 DeferredRegister。" +
  "未知 version（含 constructor 等原型键）返回 forgeVersion=unknown，不是把 Object.prototype 当版本。";

const GENERATE_DATAGEN_DESC =
  "生成 DataGen Provider 类代码模板（RecipeProvider、BlockStateProvider、ItemModelProvider、LootTableProvider、BlockTagsProvider）。" +
  "适用于：需要为方块/物品生成资源文件时（配方、方块状态、物品模型、掉落表、方块标签）。" +
  "注意：platform 与 version 均必填。Forge 1.20.1（Consumer<FinishedRecipe>）与 1.20.4（仅 recipe，buildRecipes(RecipeOutput)）；" +
  "NeoForge 1.20.1 改口 search_neoforge_docs（禁止默写 Forge import）；NeoForge 1.20.4 / 1.20.6（均仅 recipe）/ 1.21.x / 26.1；" +
      "Fabric 精确档 1.21.1/1.21.3/1.21.4/1.21.8/1.21.10/1.21.11 与 26.1；Quilt 无足够 QSL 类名则 error。" +
  "其它 Forge 版本（含 1.12.2）返回 error。" +
  "返回完整的 Java 代码模板与 suggestedPath。" +
  "【边界】默认只返回 Java 模板文本；可选 write+confirmed 走沙箱写盘。不是所有 MC 版本的 DataGen API。Fabric/Quilt 改口文档，不生成 Forge DataGen。";

const VALIDATE_PROJECT_DESC =
  "校验模组项目结构。Forge：mods.toml / DeferredRegister / @Mod。" +
  "Fabric/Quilt：fabric.mod.json / quilt.mod.json 的 id 与 entrypoint 类；出现 Forge DeferredRegister 仅 WARN。" +
  "NeoForge：neoforge.mods.toml、@Mod + IEventBus 构造；RegistryObject 不推荐；禁止 SimpleChannel。" +
  "LiteLoader/Rift/ModLoader/基岩仍 skipped（基岩请用 validate_addon_manifest）。" +
  "坏 recipe 只 warning，不把整项目判 failed。Java 扫描上限默认 300，可用 MC_SKILL_JAVA_SCAN_MAX_FILES 提高。";

const LIST_DOC_VERSIONS_DESC =
  "返回指定平台的可用文档版本列表。" +
  "platform 参数指定平台（forge/neoforge/fabric/quilt/liteloader/rift/modloader），必填。基岩请用 search_bedrock_docs。";

/**
 * P0-1 上游可用性（2026-09-21 mcmap / mappings.dev / Linkie 审计里唯一值得吸收的能力）。
 * 描述必须把「本仓已入库」与「上游有没有」分开说，否则 agent 会拿 list_*_versions 的
 * 缺席当否定证据 —— 那正是本仓 VERSION_NOT_FOUND 载荷反复澄清的那个误读。
 */
const QUERY_UPSTREAM_RELEASES_DESC =
  "查上游发布源「某个加载器/映射/模组的哪个版本到底存在吗、最新出到第几 build」。" +
  "source 七选一：forge / neoforge（maven-metadata.xml，全量可查）、fabric-loader / fabric-yarn / quilt-loader / parchment（端点按 MC 版本分列，**必须带 minecraftVersion**；parchment 的 artifact 名是 parchment-<mc>，版本串本身是日期）、modrinth（需 slug，查任意第三方模组/库）。" +
  "【与 list_*_versions 的区别】那些列的是**本仓库已入库**的文档档位，不在清单 ≠ 上游没有；要回答「上游有没有 1.20.1 的 Forge 47.4.x」「yarn 对 1.21.4 出到第几 build」用本工具。" +
  "【三态必读】ok:false ⇒ 没查到（网络/HTTP/解析失败，原因在 error），不得据此断言上游没有；" +
  "ok:true + available:false ⇒ 上游确实没有该版本（404 或按 matchRule 过滤后 0 条）。" +
  "matchRule 回显本次用的版本归属规则（如 neoforge：MC 1.21.1 → 前缀 21.1.），核对判据用。" +
  "releases 按版本号降序、截断到 limit（默认 12），total 是过滤后总条数、truncated 说明是否被截。正式版排在同号的 nightly / beta 之前。" +
  "【边界】要联网；Node TLS 失败时自动回退 curl.exe --ssl-no-revoke，不改系统证书库或代理。入口与重定向落点都过主机白名单（parchment 的托管后端 ldtteam.jfrog.io 已显式登记），落点不在白名单 ⇒ 不读正文并报 URL_REJECTED。" +
  "不返回依赖坐标写法与 API 说明，那些仍走 search_*_docs / diagnose_gradle。";

/**
 * verbatim 逐字支撑位口径（四个检索工具共用；实现在 docs-platform/search-utils.ts 的 annotateVerbatim）。
 * 描述里必须说清三态：true / false / 无字段=未判定，否则 agent 会把 false 读成「语料里没有」。
 */
const VERBATIM_DESC =
  " verbatim 逐字支撑位：query 为单个标识符形态（类名 / 方法名 / FQCN / 资源路径；散文与 OR 分组不判）时，" +
  "每条命中带 verbatim 字段（true=该名字在该页正文逐字出现；false=读到正文且确认没有；无该字段=未判定，不等于语料没有），" +
  "顶层带 verbatim_summary{term,judged,hits}；hits=0 只说明这些页是模糊相关，不构成该名字存在的证据。" +
  "该位只事后标注，不改命中集合、顺序与 total。";

const SEARCH_DOCS_DESC =
  "通用文档搜索（hybrid：L0 关键词 + 语义检索，RRF 融合；无语义库时回退纯 L0）。" +
  "platform 含 forge/neoforge/fabric/quilt/liteloader/rift/modloader，必填，禁止默认 forge。" +
  "适用于：需要了解平台特有功能的官方说明时。" +
  "增强功能：支持 class:/event:/method: 前缀精确路由；支持 | OR 分组；自动去除 the/and/of 等停用词。" +
  "Quilt 问 QSL 时禁止把 Fabric Registry 当命中。基岩请用 search_bedrock_docs。语义索引过期时 warning 含 stale。";

const ANALYZE_PORTING_PATH_DESC =
  "分析 Minecraft Mod 项目，生成跨平台/跨版本移植路线图。" +
  "扫描 build.gradle、mods.toml、fabric.mod.json 和源码，识别当前平台、版本、" +
  "Mappings、是否使用 Architectury，并输出风险评估、动态 routeSteps、" +
  "参考链接和建议的 query_api 调用。" +
  "targetPlatform 必填（不做静默推断；Forge 1.20.1 与 NeoForge 1.20.1 元数据无法区分）。" +
  "routeSteps 是给人读的自然语言清单；nextSteps 是机器可读交接（tool + 可直接调用的 args）。" +
  "targetPlatform 可含 quilt；基岩/LiteLoader/Rift/ModLoader 返回 UNSUPPORTED_PORT。" +
  "适用于：用户询问如何将 Mod 移植到其他平台或版本时。";

const PORT_PROJECT_DESC =
  "执行移植步骤（init_architectury / extract_common / apply_version_migration）。" +
  "所有写文件操作默认 dryRun=true，仅输出 diff 预览。" +
  "实际写入需要：dryRun=false、confirmed=true、环境变量 MC_SKILL_ALLOW_WRITE=1，" +
  "且 projectPath 位于 MC_SKILL_PROJECT_ROOT 允许目录内。" +
  "适用于：接收到 analyze_porting_path 输出的 nextSteps 后，按步骤执行。" +
  "注意：extract_common 仅做静态分析，输出候选清单，不执行文件移动。" +
  "apply_version_migration 在确认写入时会真实执行包名替换（两阶段提交，失败自动回滚）；冲突文件在 confirmed 写入时会被拒绝。";

/** Z-2（sweep81 顺延）：MCP server 版本从 package.json 单源读取 —— 曾硬编码 0.1.0 而实际 1.0.4。 */
function pkgVersion(): string {
  try {
    const pj = JSON.parse(
      readFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", "package.json"), "utf8"),
    ) as { version?: string };
    return String(pj.version ?? "") || "0.0.0";
  } catch {
    return "0.0.0";
  }
}

export const server = new McpServer({
  version: pkgVersion(),
  name: "MC-AI-Coding-Assistant-Tool",
});

// 收集全部工具 handler 到模块级表（CLI 通用 dispatch 依赖；须在首个 registerTool 前）
patchToolCollection(server);

// ── 1. API 查询 ─────────────────────────────────────────────────────────────
server.registerTool(
  "query_api",
  {
    title: "Query Vanilla/Parchment API",
    description: QUERY_API_DESC,
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
    description: GET_METHOD_PARAMS_DESC,
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
    description: CONVERT_MAPPING_DESC,
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
        const action = versionRequiredAction();
        action.nextSteps = [
          "先调用 detect_mod_project 得到精确 minecraftVersion",
          ...action.nextSteps,
        ];
        action.relatedTools = ["detect_mod_project", ...(action.relatedTools ?? [])];
        return {
          content: [{ type: "text", text: JSON.stringify({ ok: false, action }, null, 2) }],
          isError: true,
        };
      }
      await warmupApi([version!.trim()]);
    }
    const focusVersion = String(version ?? "").trim();
    const javaProbe = await probeJava();
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
      java: {
        node: process.version,
        JAVA_HOME: process.env.JAVA_HOME ?? null,
        version: javaProbe.versionText,
        ready: javaProbe.ready,
        hint: javaProbe.ready
          ? "JDK 可用（反编译 / remap 需要 17+）。"
          : "反编译 / remap 需要 JDK 17+。未设置 JAVA_HOME 时请安装 Temurin 17+ 并加入 PATH。",
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
    description: GET_VERSION_INFO_DESC,
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
    description: GENERATE_DATAGEN_DESC,
    inputSchema: generateDatagenSchema,
  },
  async ({ providerType, modId, targetName, version, platform, write, confirmed, projectPath }): Promise<CallToolResult> => {
    const result = generateDatagen({
      providerType,
      modId,
      targetName,
      version,
      platform,
    });
    const classBase = `${targetName.replace(/(^|_)([a-z])/g, (_, __, c: string) => c.toUpperCase()).replace(/_/g, "")}`;
    const wrapped = maybeWriteGeneratorResult(
      {
        code: result.code,
        warnings: result.warnings,
        errors: result.errors,
      },
      { write, confirmed, projectPath },
      { singleFileName: `${classBase}Provider.java` },
    );
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              ...wrapped,
              usedModId: result.usedModId,
              usedTargetName: result.usedTargetName,
            },
            null,
            2,
          ),
        },
      ],
    };
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
    description: VALIDATE_PROJECT_DESC,
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
      "另外另有 query_api 工具，可直接查询 Vanilla/Parchment 类的参数名和 javadoc，适合在已知类名后精确查询某个方法的签名。" + VERBATIM_DESC,
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
      return communityDocError(e);
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
      return communityDocError(e);
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
      "增强功能：支持 class:/event:/method: 前缀精确路由；支持 | OR 分组；自动去除 the/and/of 等停用词。" + VERBATIM_DESC,
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
      "返回相关页面 ID 列表，每个结果包含标题、标签和相关性评分。" + VERBATIM_DESC,
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
    description: LIST_DOC_VERSIONS_DESC,
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
    description: SEARCH_DOCS_DESC + VERBATIM_DESC,
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

// ── 18b. 上游版本可用性查询（P0-1；仓库首个带 outputSchema 的工具）────────────
server.registerTool(
  "query_upstream_releases",
  {
    title: "Query Upstream Release Availability",
    description: QUERY_UPSTREAM_RELEASES_DESC,
    inputSchema: queryUpstreamReleasesSchema,
    outputSchema: queryUpstreamReleasesOutputSchema,
  },
  async (args): Promise<CallToolResult> => {
    const result = await queryUpstreamReleases({
      source: args.source,
      minecraftVersion: args.minecraftVersion,
      slug: args.slug,
      limit: args.limit,
    });
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      // SDK 把 structuredContent 声明成带索引签名的 {[k:string]: unknown}，具名 interface 不满足它
      structuredContent: { ...result },
    };
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
    description: ANALYZE_PORTING_PATH_DESC,
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
    description: PORT_PROJECT_DESC,
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
  "analyze_bedrock_log",
  {
    title: "Analyze Bedrock content log",
    description:
      "基岩版内容日志分析器（只读）。路径：logPath（content_log.txt 绝对路径）或 logsDir / projectPath（自动找最近的 content_log*.txt，有界读取）。" +
      "按 Bedrock content-log 行格式独立解析（[时间][级别][标签] 消息），给出级别统计、Top 标签、错误/警告样本与问题归类。" +
      "不是 Java 崩溃日志拆解。不写盘、不联网。",
    inputSchema: analyzeBedrockContentLogSchema,
  },
  async (args): Promise<CallToolResult> => ({
    content: [{ type: "text", text: JSON.stringify(analyzeBedrockContentLog(args), null, 2) }],
  }),
);
server.registerTool(
  "generate_addon_manifest",
  {
    title: "Generate Bedrock manifest JSON",
    description:
      "只吐 manifest JSON 文本与 suggestedPath；默认不写盘。可选 write+confirmed 走沙箱。默认 stable @minecraft/server；beta=true 才写 beta 依赖并提示世界 Beta APIs。",
    inputSchema: generateAddonManifestSchema,
  },
  async (args): Promise<CallToolResult> => {
    const result = generateAddonManifest(args);
    const filesRaw = (result.files as Record<string, unknown> | undefined) ?? {};
    const files: Record<string, string> = {};
    for (const [k, v] of Object.entries(filesRaw)) {
      files[k] = typeof v === "string" ? v : JSON.stringify(v, null, 2);
    }
    const wrapped = maybeWriteGeneratorResult(
      { code: null, files, warnings: result.warnings as string[] | undefined },
      { write: args.write, confirmed: args.confirmed, projectPath: args.projectPath },
      { resourcesPrefix: "." },
    );
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ ...result, ...wrapped, files: result.files }, null, 2),
        },
      ],
    };
  },
);
server.registerTool(
  "generate_bp_entity",
  {
    title: "Generate Bedrock BP entity JSON",
    description:
      "只吐 BP 实体 JSON 文本与 suggestedPath；默认不写盘。可选 write+confirmed 走沙箱。点名 Beta 爆炸事件时才给 script 片段，并附带 BP/manifest.json（@minecraft/server version=beta）。禁止写 experimentalGameplay。",
    inputSchema: generateBpEntitySchema,
  },
  async (args): Promise<CallToolResult> => {
    const result = generateBpEntity(args);
    const filesRaw = (result.files as Record<string, unknown> | undefined) ?? {};
    const files: Record<string, string> = {};
    for (const [k, v] of Object.entries(filesRaw)) {
      files[k] = typeof v === "string" ? v : JSON.stringify(v, null, 2);
    }
    const wrapped = maybeWriteGeneratorResult(
      {
        code: null,
        files,
        warnings: result.warnings as string[] | undefined,
        errors: result.errors as string[] | undefined,
      },
      { write: args.write, confirmed: args.confirmed, projectPath: args.projectPath },
      { resourcesPrefix: "." },
    );
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ ...result, ...wrapped, files: result.files }, null, 2),
        },
      ],
    };
  },
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
  { name: "query_api", description: QUERY_API_DESC, inputSchema: queryApiSchema },
  { name: "get_method_params", description: GET_METHOD_PARAMS_DESC, inputSchema: getMethodParamsSchema },
  { name: "convert_mapping", description: CONVERT_MAPPING_DESC, inputSchema: convertMappingSchema },
  { name: "get_server_status", description: "查看 API 索引预热状态、数据路径诊断与 descriptor 自检。适用于：调用失败排查、确认 schema/映射数据是否就绪。", inputSchema: getServerStatusSchema },
  { name: "get_version_info", description: GET_VERSION_INFO_DESC, inputSchema: getVersionInfoSchema },
  { name: "diagnose_gradle", description: "校验 ForgeGradle + Fabric/Quilt Loom + NeoGradle/ModDevGradle。Loom：插件 id（26.1 必须 net.fabricmc.fabric-loom）、Java toolchain（1.21=21，26.1=25）、Yarn vs 去混淆、26.1 禁止 modImplementation。Neo/MDG：插件 id、minecraft_version/neo_version、26.1 须能看出 buildPlugin、Java 21 vs 25。含 net.minecraftforge.gradle.liteloader 时走轻量模式。Rift / BaseMod / 基岩仍早退。", inputSchema: diagnoseGradleSchema },
  { name: "generate_datagen", description: GENERATE_DATAGEN_DESC, inputSchema: generateDatagenSchema },
  { name: "crash_analyze", description: "解析崩溃报告全文，通过内置模式库识别可能成因并返回修复建议。适用于：模组运行崩溃、收到玩家的崩溃日志时。支持识别常见崩溃原因（Mixin、Capability、BlockEntity、DeferredRegister、BlockItem、CreativeModeTab、网络包、SpawnPlacement、方块属性、声音、loot、注册名重复等），并推断 crashKind（fml/client/server/fabric/quilt/liteloader/rift/modloader/…）、缺前置/版本不兼容，以及 logHints。**优先于搜索引擎使用此工具**；实务分类可配合 search_community_docs。", inputSchema: crashAnalyzeSchema },
  { name: "validate_project", description: VALIDATE_PROJECT_DESC, inputSchema: validateProjectSchema },
  { name: "search_forge_docs", description: "搜索 Forge 官方文档（hybrid：L0 关键词 + 语义检索，RRF 融合；无语义库时回退纯 L0）。适用于：需要了解 Forge 特有功能（如 Capability、DeferredRegister、网络通信、DataGen）的官方说明时。返回相关页面 ID 列表，每个结果包含标题、摘要和标签。建议配合 get_forge_doc_summary 使用：先搜索，再对相关页面取摘要判断是否深入。增强功能：支持 class:/event:/method: 前缀精确路由；支持 | OR 分组；自动去除 the/and/of 等停用词。另外另有 query_api 工具，可直接查询 Vanilla/Parchment 类的参数名和 javadoc，适合在已知类名后精确查询某个方法的签名。" + VERBATIM_DESC, inputSchema: searchForgeDocsSchema.inputSchema },
  { name: "get_forge_doc_summary", description: "获取 Forge 文档页面的章节骨架与摘要。适用于：判断某篇文档是否包含所需内容时。返回每个 <h2> 章节的标题、150-200 字摘要和首段概述。建议：先 search_forge_docs 搜索关键词，再对相关页面取摘要，最后仅当摘要显示内容相关时才调用 get_forge_doc_full 获取全文。", inputSchema: getForgeDocSummarySchema.inputSchema },
  { name: "get_forge_doc_full", description: "获取 Forge 文档页面全文。适用于：需要查看 API 完整步骤、事件列表、配置项清单时。highlight_key=true（默认）时，关键段落（🔴新手必读、🟠常见错误、🟢示例代码）会突出显示在开头。**永远不要一次性加载超过 2 个 full page**，避免上下文溢出。", inputSchema: getForgeDocFullSchema.inputSchema },
  { name: "get_forge_doc_related", description: "获取与指定 Forge 文档页面相关的其他页面列表。适用于：想了解某个主题，但不知道还需要查阅哪些关联文档时。返回与目标页面共享最多 section 关键词的其他页面，按相关性降序排列。", inputSchema: getForgeDocRelatedSchema.inputSchema },
  { name: "list_forge_versions", description: "返回 data 目录下所有已加载的 Forge 文档版本列表（如 [\"1.20.1\"]）。用于确认当前 MCP 服务支持哪些版本，无需通过报错来发现。", inputSchema: listForgeVersionsSchema.inputSchema },
  { name: "list_community_sources", description: "列出 community_knowledge 已收录条目（permitted / authored / links）。用于了解可用社区资料与署名来源；正式 API 仍优先 search_forge_docs / search_fabric_docs。", inputSchema: listCommunitySourcesSchema },
  { name: "search_community_docs", description: "搜索社区知识库（许可提炼、自写笔记、外链索引）。不替代官方文档工具；适合发布/兼容/崩溃分类等实操问题。返回命中含 sourceKind、url、summary；links 仅外链。", inputSchema: searchCommunityDocsSchema },
  { name: "get_community_doc_summary", description: "获取社区知识条目摘要（含署名与 sourceKind）。links 条目仅返回元数据与外链。", inputSchema: getCommunityDocSummarySchema },
  { name: "get_community_doc_full", description: "获取社区知识全文。permitted/authored 返回仓库内 Markdown；links 仅返回 URL 与免责声明，不抓取网页正文。", inputSchema: getCommunityDocFullSchema },
  { name: "search_fabric_docs", description: "搜索 Fabric 官方文档（hybrid：L0 关键词 + 语义检索，RRF 融合；无语义库时回退纯 L0）。适用于：需要了解 Fabric 特有功能（如 Registry.register、Identifier、Mixin、网络通信）的官方说明时。返回相关页面 ID 列表，每个结果包含标题、摘要和标签。建议配合 get_fabric_doc_summary 使用：先搜索，再对相关页面取摘要判断是否深入。增强功能：支持 class:/event:/method: 前缀精确路由；支持 | OR 分组；自动去除 the/and/of 等停用词。" + VERBATIM_DESC, inputSchema: searchFabricDocsSchema.inputSchema },
  { name: "get_fabric_doc_summary", description: "获取 Fabric 文档页面的章节骨架与摘要，用于判断是否需要深入。", inputSchema: getFabricDocSummarySchema.inputSchema },
  { name: "get_fabric_doc_full", description: "获取 Fabric 文档页面全文。highlight_key=true（默认）时，关键段落（🔴🟠🟢⭐）突出显示。", inputSchema: getFabricDocFullSchema.inputSchema },
  { name: "get_fabric_doc_related", description: "返回与目标 Fabric 文档共享最多关键词的其他页面，按相关性降序排列。", inputSchema: getFabricDocRelatedSchema.inputSchema },
  { name: "list_fabric_versions", description: "返回 data 目录下所有已加载的 Fabric 文档版本列表（如 [\"1.20.1\"]）。", inputSchema: listFabricVersionsSchema.inputSchema },
  { name: "search_neoforge_docs", description: "搜索 NeoForge 官方文档（hybrid：L0 关键词 + 语义检索，RRF 融合；无语义库时回退纯 L0）。适用于：需要了解 NeoForge 特有功能（如 DeferredRegister、Data Components、Payload 网络）的官方说明时。返回相关页面 ID 列表，每个结果包含标题、标签和相关性评分。" + VERBATIM_DESC, inputSchema: searchNeoForgeDocsSchema.inputSchema },
  { name: "get_neoforge_doc_summary", description: "获取 NeoForge 文档页面的章节骨架与摘要（L1），用于判断是否需要深入。", inputSchema: getNeoForgeDocSummarySchema.inputSchema },
  { name: "get_neoforge_doc_full", description: "获取 NeoForge 文档页面全文（L2/L2+）。highlight_key=true（默认）时，关键段落（🔴新手必读、🟠常见错误、🟢示例代码）突出显示。**永远不要一次性加载超过 2 个 full page**。", inputSchema: getNeoForgeDocFullSchema.inputSchema },
  { name: "get_neoforge_doc_related", description: "返回与目标 NeoForge 文档共享最多标签关键词的其他页面，按相关性降序排列。", inputSchema: getNeoForgeDocRelatedSchema.inputSchema },
  { name: "list_neoforge_versions", description: "返回 data 目录下所有已加载的 NeoForge 文档版本列表（如 [\"26.1\", \"1.21.11\", \"1.20.4\", ...]）。注意：1.20.1 版本使用 Forge 1.20.1 数据（100% API 兼容）。", inputSchema: listNeoForgeVersionsSchema.inputSchema },
  { name: "list_doc_versions", description: LIST_DOC_VERSIONS_DESC, inputSchema: listVersionsSchema.inputSchema },
  { name: "search_docs", description: SEARCH_DOCS_DESC + VERBATIM_DESC, inputSchema: searchDocsSchema.inputSchema },
  { name: "get_doc_summary", description: getDocSummarySchema.description, inputSchema: getDocSummarySchema.inputSchema },
  { name: "get_doc_full", description: getDocFullSchema.description, inputSchema: getDocFullSchema.inputSchema },
  { name: "get_doc_related", description: getDocRelatedSchema.description, inputSchema: getDocRelatedSchema.inputSchema },
  { name: "diagnose_data_paths", description: "诊断数据目录配置（高级排障用）。返回各平台数据目录的可用性状态。诊断 MC_SKILL_DATA / MC_SKILL_COMMUNITY 解析结果，以及 forge/fabric/neoforge/quilt/liteloader/rift/modloader/bedrock/community 是 found / empty / not_found。", inputSchema: diagnoseDataPathsSchema },
  { name: "analyze_porting_path", description: ANALYZE_PORTING_PATH_DESC, inputSchema: analyzePortingPathSchema },
  { name: "port_project", description: PORT_PROJECT_DESC, inputSchema: portProjectSchema },
  { name: "query_upstream_releases", description: QUERY_UPSTREAM_RELEASES_DESC, inputSchema: queryUpstreamReleasesSchema },
  { name: "search_bedrock_docs", description: "搜索基岩版 Microsoft Learn Creator 文档（hybrid L0+语义）。每次返回 docsStatus 滞后标记。不是 search_forge_docs。", inputSchema: searchBedrockDocsSchema },
  { name: "get_bedrock_doc_summary", description: "基岩文档 L1 摘要。带 docsStatus。不是 get_forge_doc_summary。", inputSchema: getBedrockDocSummarySchema },
  { name: "get_bedrock_doc_full", description: "基岩文档全文。一次 ≤ 2 页。带 docsStatus。", inputSchema: getBedrockDocFullSchema },
  { name: "get_bedrock_doc_related", description: "基岩文档相关页。带 docsStatus。", inputSchema: getBedrockDocRelatedSchema },
  { name: "analyze_bedrock_log", description: "基岩版内容日志分析器（只读）。路径：logPath（content_log.txt 绝对路径）或 logsDir / projectPath（自动找最近的 content_log*.txt，有界读取）。按 Bedrock content-log 行格式独立解析（[时间][级别][标签] 消息），给出级别统计、Top 标签、错误/警告样本与问题归类。不是 Java 崩溃日志拆解。不写盘、不联网。", inputSchema: analyzeBedrockContentLogSchema },
  { name: "validate_addon_manifest", description: "校验基岩 manifest.json（header/modules/UUID/capabilities）。不是 validate_project。禁止 experimentalGameplay。", inputSchema: validateAddonManifestSchema },
  { name: "validate_bp_json", description: "精简校验 entity/block/item/recipe JSON。不是 validate_datapack_json（Java pack_format）。", inputSchema: validateBpJsonSchema },
  { name: "generate_addon_manifest", description: "只吐 manifest JSON 文本与 suggestedPath；默认不写盘。可选 write+confirmed 走沙箱。默认 stable @minecraft/server；beta=true 才写 beta 依赖并提示世界 Beta APIs。", inputSchema: generateAddonManifestSchema },
  { name: "generate_bp_entity", description: "只吐 BP 实体 JSON 文本与 suggestedPath；默认不写盘。可选 write+confirmed 走沙箱。点名 Beta 爆炸事件时才给 script 片段，并附带 BP/manifest.json（@minecraft/server version=beta）。禁止写 experimentalGameplay。", inputSchema: generateBpEntitySchema },
  { name: "resolve_lib_skills", description: RESOLVE_LIB_SKILLS_DESCRIPTION, inputSchema: resolveLibSkillsSchema },
];

/** 全部工具 schema（index + wave；基岩 9 个工具计入 index）。 */
export function listAllToolSchemas(): ToolSchemaEntry[] {
  return [...indexToolSchemas, ...waveToolSchemas];
}

// 注册完成断言（F-C17）：全部注册（含 wave）后校验收集表与合并 schema 清单一致；
// 不一致立即抛错，防止重构后 CLI 全部报「未知命令」而 MCP 正常的静默劣化。
assertToolRegistrationComplete(listAllToolSchemas().map((t) => t.name));

