import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import * as z from "zod";
import { queryApi } from "./api/index.js";
import { convertMapping, getMethodParams } from "./mappings/index.js";
import { getVersionInfo } from "./version/index.js";
import { diagnoseGradle } from "./gradle/index.js";
import { generateDatagen } from "./datagen/index.js";
import { analyzeCrash } from "./crash/index.js";
import { validateProject } from "./validate/index.js";
import { diagnoseDataPaths } from "./utils/path.js";
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
} from "./docs-platform/index.js";

const server = new McpServer({
  version: "0.1.0",
  name: "mc-mcp-server",
});

// ── 1. API 查询 ─────────────────────────────────────────────────────────────
server.registerTool(
  "query_api",
  {
    title: "Query Forge/Vanilla API",
    description:
      "查询 Minecraft/Vanilla 类的完整方法签名、参数名、返回值类型。数据来源：Parchment 1.20.1 (2023.09.03)。" +
      "适用于：需要确认某个 Minecraft API 的正确用法时。" +
      "注意：不包含 Forge 特有类（如 DeferredRegister、Capability）。返回 found=true 时包含完整 javadoc。",
    inputSchema: z.object({
      className: z.string().describe("类全限定名，如 net.minecraft.world.entity.LivingEntity"),
      methodName: z.string().optional().describe("方法名，可选，如 getHealth"),
      version: z.string().optional().describe("Minecraft 版本，默认 1.20.1"),
    }),
  },
  async ({ className, methodName, version }): Promise<CallToolResult> => {
    const result = await queryApi({ className, methodName, version: version ?? "1.20.1" });
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

// ── 1b. 方法参数查询 ──────────────────────────────────────────────────────
server.registerTool(
  "get_method_params",
  {
    title: "Get Method Parameter Names",
    description:
      "查询指定方法的完整参数名列表（来源：Parchment 1.20.1 真实映射）。" +
      "适用于：当知道方法名但不确定参数顺序和名称时。" +
      "需提供 className + methodName；重载方法建议附上 descriptor。返回参数索引、名称和 JNI 描述符。",
    inputSchema: z.object({
      className: z.string().describe("类全限定名"),
      methodName: z.string().describe("方法名（mcp/srg 层名，非 mojang official）"),
      descriptor: z.string().optional().describe("完整 JNI 描述符（用于区分重载，如 (Lnet/minecraft/world/entity/LivingEntity;)V）"),
    }),
  },
  async ({ className, methodName, descriptor }): Promise<CallToolResult> => {
    const result = getMethodParams({ className, methodName, descriptor });
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

// ── 2. 映射转换 ──────────────────────────────────────────────────────────────
server.registerTool(
  "convert_mapping",
  {
    title: "Convert Between Mapping Systems",
    description:
      "在 mojang / mcp / yarn / parchment 四种映射之间互转成员名。" +
      "适用于：混淆堆栈中看到的方法名需要转换、或者需要确认当前项目使用的是哪种映射时。" +
      "注意：Yarn 仅适用于 Fabric 项目，在 Forge 项目中无法直接使用。返回转换方向、置信度和用法示例。",
    inputSchema: z.object({
      from: z.enum(["mojang", "mcp", "yarn", "parchment"]).describe("源映射类型"),
      to: z.enum(["mojang", "mcp", "yarn", "parchment"]).describe("目标映射类型"),
      memberName: z.string().describe("成员名（字段或方法）"),
      ownerClass: z.string().optional().describe("所属类，用于精确匹配方法"),
    }),
  },
  async ({ from, to, memberName, ownerClass }): Promise<CallToolResult> => {
    const result = convertMapping({ from, to, memberName, ownerClass });
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

// ── 3. 版本适配信息 ─────────────────────────────────────────────────────────
server.registerTool(
  "get_version_info",
  {
    title: "Get Version-Specific Guidance",
    description:
      "获取指定 Minecraft/Forge 版本的推荐做法、关键变更点和官方 Changelog 链接。" +
      "适用于：开始新版本开发、遇到版本兼容性问题、或不确定某个 API 在特定版本中的用法时。" +
      "返回该版本的 Forge 版本号、推荐注册方式、关键 gotchas 和官方链接。",
    inputSchema: z.object({
      version: z.string().describe("Minecraft 版本，如 1.20.1"),
      action: z.string().describe("要执行的操作，如 注册方块、创建方块实体、注册流体"),
    }),
  },
  async ({ version, action }): Promise<CallToolResult> => {
    const result = await getVersionInfo({ version, action });
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

// ── 4. Gradle 诊断 ──────────────────────────────────────────────────────────
server.registerTool(
  "diagnose_gradle",
  {
    title: "Diagnose Gradle Build Configuration",
    description:
      "校验 build.gradle 和 gradle.properties 中的依赖声明、Forge 版本、Java toolchain、" +
      "parchment 映射、reobfJar 配置是否正确。" +
      "适用于：项目构建失败、依赖冲突、或首次搭建项目时。" +
      "返回 errors（必须修复）/ warnings（建议修复）/ suggestions（可选优化）三级结果。",
    inputSchema: z.object({
      buildGradle: z.string().describe("build.gradle 文件内容"),
      gradleProperties: z.string().optional().describe("gradle.properties 文件内容"),
    }),
  },
  async ({ buildGradle, gradleProperties }): Promise<CallToolResult> => {
    const result = diagnoseGradle({ buildGradle, gradleProperties });
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
      "注意：当前仅支持 1.20.1 版本的 DeferredRegister 模式。返回完整的 Java 代码模板。",
    inputSchema: z.object({
      providerType: z.enum(["recipe", "blockstate", "itemmodel", "loottable", "tag"]).describe("Provider 类型"),
      modId: z.string().describe("Mod ID（全小写），如 mymod"),
      targetName: z.string().describe("目标注册名（无 modId 前缀），如 my_block"),
      version: z.string().optional().describe("Minecraft 版本，默认 1.20.1"),
    }),
  },
  async ({ providerType, modId, targetName, version }): Promise<CallToolResult> => {
    const result = generateDatagen({ providerType, modId, targetName, version: version ?? "1.20.1" });
    return { content: [{ type: "text", text: result }] };
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
      "支持识别 16 种常见崩溃原因（Mixin 错误、Capability 问题、BlockEntity 空指针、" +
      "DeferredRegister 误用、BlockItem 未注册、CreativeModeTab 错误、网络包 ID 冲突、" +
      "SpawnPlacement 未注册、方块属性错误、声音事件未注册、loot table 缺失、注册名重复等）。" +
      "**优先于搜索引擎使用此工具**，再结合 get_forge_doc_full 查阅官方文档。",
    inputSchema: z.object({
      crashReport: z.string().describe("崩溃报告全文（从 '---- Minecraft Crash Report ----' 开始）"),
      version: z.string().optional().describe("Minecraft 版本，默认 1.20.1"),
    }),
  },
  async ({ crashReport, version }): Promise<CallToolResult> => {
    const result = analyzeCrash({ crashReport, version: version ?? "1.20.1" });
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

// ── 7. 项目校验 ─────────────────────────────────────────────────────────────
server.registerTool(
  "validate_project",
  {
    title: "Validate Forge Mod Project Structure",
    description:
      "校验模组项目的结构完整性。" +
      "适用于：收到用户项目后首次审查、或修复问题后验证。" +
      "支持的检查项：mods.toml 语法和 modId 一致性（mods.toml 优先级最高）、" +
      "@Mod 注解 modId 一致性、RegistryObject 命名与 static/final 修饰符、" +
      "DeferredRegister 注册完整性（必须调用 modEventBus）、类名与文件名一致性、" +
      "@ObjectHolder 注解格式、BlockItem 注册完整性（提示而非错误）、" +
      "Mixin 配置（用户提供 mixins.json 时）、资源路径大小写、重复注册名检测。",
    inputSchema: z.object({
      modsToml: z.string().optional().describe("mods.toml 文件内容（建议提供以启用 mods.toml 相关检查）"),
      javaFiles: z.array(z.object({
        path: z.string().describe("文件相对路径，如 src/main/java/com/example/ExampleMod.java"),
        content: z.string().describe("文件完整内容"),
      })).optional().describe("Java 源文件列表，建议包含所有注册相关类"),
      buildGradle: z.string().optional().describe("build.gradle 文件内容（用于 Gradle 配置诊断）"),
      gradleProperties: z.string().optional().describe("gradle.properties 文件内容（用于版本信息校验）"),
      mixinsJson: z.string().optional().describe("mixins.json 文件内容（用于 Mixin 配置校验）"),
    }),
  },
  async ({ modsToml, javaFiles, buildGradle, gradleProperties, mixinsJson }): Promise<CallToolResult> => {
    const result = validateProject({ modsToml, javaFiles, buildGradle, gradleProperties, mixinsJson });
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

// ── 8. Forge 官方文档搜索 ─────────────────────────────────────────────────
server.registerTool(
  searchForgeDocsSchema.name,
  {
    title: "Search Official Forge Documentation",
    description:
      "搜索 Forge 官方文档（L0 索引搜索）。" +
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

// ── 12. 列出可用版本 ─────────────────────────────────────────────────────
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

// ── 13. 通用文档版本列表 ─────────────────────────────────────────────────
server.registerTool(
  listVersionsSchema.name,
  {
    title: "List Available Doc Versions (Multi-Platform)",
    description:
      "返回指定平台的可用文档版本列表。" +
      "platform 参数指定平台（forge/neoforge/fabric），默认 forge。",
    inputSchema: listVersionsSchema.inputSchema,
  },
  async (args): Promise<CallToolResult> => {
    return listVersions({ platform: args.platform });
  }
);

// ── 14. 通用文档搜索 ─────────────────────────────────────────────────────
server.registerTool(
  searchDocsSchema.name,
  {
    title: "Search Documentation (Multi-Platform)",
    description:
      "通用文档搜索，支持多平台（Forge/NeoForge/Fabric）。" +
      "platform 参数指定平台，默认 forge。" +
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
    });
  }
);

// ── 15. 通用文档摘要 ─────────────────────────────────────────────────────
server.registerTool(
  getDocSummarySchema.name,
  {
    title: "Get Doc Page Summary (Multi-Platform)",
    description:
      "获取文档页面的章节骨架与摘要，支持多平台（platform 参数）。" +
      "适用于：判断某篇文档是否包含所需内容时。",
    inputSchema: getDocSummarySchema.inputSchema,
  },
  async (args): Promise<CallToolResult> => {
    return getDocSummary({ id: args.id, version: args.version, platform: args.platform });
  }
);

// ── 16. 通用文档全文 ─────────────────────────────────────────────────────
server.registerTool(
  getDocFullSchema.name,
  {
    title: "Get Full Documentation Page (Multi-Platform)",
    description:
      "获取文档页面全文，支持多平台（platform 参数）。" +
      "适用于：需要查看 API 完整步骤、事件列表、配置项清单时。" +
      "highlight_key=true（默认）时，关键段落（🔴新手必读、🟠常见错误、🟢示例代码）突出显示。",
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

// ── 17. 通用文档相关页面 ─────────────────────────────────────────────────
server.registerTool(
  getDocRelatedSchema.name,
  {
    title: "Get Related Documentation Pages (Multi-Platform)",
    description:
      "获取与指定文档页面相关的其他页面列表，支持多平台（platform 参数）。" +
      "返回共享最多关键词的其他页面，按相关性降序排列。",
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
    description: "诊断数据目录配置（高级排障用）。返回各平台数据目录的可用性状态。",
    inputSchema: z.object({}),
  },
  async (): Promise<CallToolResult> => {
    const result = diagnoseDataPaths();
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

// ── 启动 ────────────────────────────────────────────────────────────────────

// 启动时打印诊断（仅当 MC_SKILL_DEBUG_PATHS=1）
if (process.env.MC_SKILL_DEBUG_PATHS === "1") {
  console.error("[mc-mcp-server] Data paths:", JSON.stringify(diagnoseDataPaths(), null, 2));
}

const transport = new StdioServerTransport();
await server.connect(transport);
