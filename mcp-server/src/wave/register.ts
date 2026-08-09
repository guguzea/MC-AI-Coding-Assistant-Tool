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
        "查询 Vanilla 注册表资源 ID（minecraft:stone）。nameLayer=registry_id；类/方法映射请用 convert_mapping。",
      inputSchema: z.object({
        query: z.string().describe("资源 ID 或子串，如 stone、minecraft:diamond"),
        registry: z.string().optional().describe("限定注册表名，如 blocks、items"),
        version: z.string().optional().describe("MC 版本，默认 1.20.1"),
        limit: z.number().optional(),
      }),
    },
    async (args): Promise<CallToolResult> => jsonResult(queryRegistry(args)),
  );

  server.registerTool(
    "mixin_analyze",
    {
      title: "Deep Mixin injection analysis",
      description:
        "解析 mixins.json 与 @Mixin 源码，校验 @Inject/@Redirect 等方法目标（多映射层）。高风险工具，见 supportMatrix。",
      inputSchema: z.object({
        javaFiles: z
          .array(z.object({ path: z.string(), content: z.string() }))
          .optional(),
        mixinsJson: z.string().optional(),
        version: z.string().optional(),
      }),
    },
    async (args): Promise<CallToolResult> => jsonResult(await mixinAnalyze(args)),
  );

  server.registerTool(
    "audit_resources",
    {
      title: "Audit mod resource pack graph",
      description: "静态检查模型引用的纹理、孤儿纹理、modId 命名等问题。",
      inputSchema: z.object({
        resourceRoot: z.string().describe("assets 根目录，如 src/main/resources/assets/<modid>"),
        modId: z.string().optional(),
      }),
    },
    async (args): Promise<CallToolResult> => jsonResult(auditResources(args)),
  );

  server.registerTool(
    "validate_datapack_json",
    {
      title: "Validate datapack JSON (lite schema)",
      description: "recipe / loot_table / advancement / tag 的精简 JSON 校验（1.20.1 / 1.21.1）。",
      inputSchema: z.object({
        jsonContent: z.string(),
        kind: z.enum(["recipe", "loot_table", "advancement", "tag"]),
        version: z.string().optional(),
      }),
    },
    async (args): Promise<CallToolResult> => jsonResult(validateDatapackJson(args)),
  );

  server.registerTool(
    "get_workflow_template",
    {
      title: "Get workflow template (Prompt fallback)",
      description: "返回与 MCP Prompt 同名的工作流全文；Cursor 等仅支持 tools 时使用。",
      inputSchema: z.object({
        name: z.enum([
          "mc-new-block",
          "mc-new-entity",
          "mc-new-gui",
          "mc-crash-triage",
          "mc-port-mod",
        ]),
      }),
    },
    async ({ name }): Promise<CallToolResult> => jsonResult(getWorkflowTemplate(name)),
  );

  server.registerTool(
    "list_knowledge_resources",
    {
      title: "List MCP knowledge resource URIs",
      description: "列出 mcskill:// 资源 URI；配合 read_knowledge_resource 读取正文。",
      inputSchema: z.object({}),
    },
    async (): Promise<CallToolResult> => jsonResult({ resources: listKnowledgeResources() }),
  );

  server.registerTool(
    "read_knowledge_resource",
    {
      title: "Read knowledge resource by URI",
      inputSchema: z.object({ uri: z.string() }),
    },
    async ({ uri }): Promise<CallToolResult> => jsonResult(readKnowledgeResource(uri)),
  );

  // ── Wave C: generators ───────────────────────────────────────────────────

  server.registerTool("generate_model", {
    title: "Generate block model JSON templates",
    inputSchema: z.object({ modId: z.string(), blockName: z.string() }),
  }, async (a) => jsonResult(generateModel(a.modId, a.blockName)));

  server.registerTool("generate_lang", {
    title: "Generate en_us + zh_cn lang JSON",
    inputSchema: z.object({
      modId: z.string(),
      entries: z.record(z.string()),
    }),
  }, async (a) => jsonResult(generateLang(a.modId, a.entries)));

  server.registerTool("generate_network_packet", {
    title: "Generate network packet skeleton",
    inputSchema: z.object({
      modId: z.string(),
      packetName: z.string(),
      platform: z.enum(["forge_1.20.1", "neoforge_1.21"]).optional(),
    }),
  }, async (a) =>
    jsonResult(generateNetworkPacket(a.modId, a.packetName, a.platform ?? "forge_1.20.1")));

  server.registerTool("generate_capability", {
    title: "Generate Capability / DataAttachment skeleton",
    inputSchema: z.object({
      modId: z.string(),
      name: z.string(),
      neoforge: z.boolean().optional(),
    }),
  }, async (a) => jsonResult(generateCapability(a.modId, a.name, a.neoforge ?? false)));

  server.registerTool("generate_config", {
    title: "Generate config spec skeleton",
    inputSchema: z.object({
      modId: z.string(),
      loader: z.enum(["forge", "neoforge", "fabric"]).optional(),
    }),
  }, async (a) => jsonResult(generateConfig(a.modId, a.loader ?? "forge")));

  server.registerTool("generate_entity_renderer", {
    title: "Generate entity renderer skeleton",
    inputSchema: z.object({ modId: z.string(), entityName: z.string() }),
  }, async (a) => jsonResult(generateEntityRenderer(a.modId, a.entityName)));

  server.registerTool("generate_worldgen", {
    title: "Generate worldgen JSON templates",
    inputSchema: z.object({ modId: z.string(), featureName: z.string() }),
  }, async (a) => jsonResult(generateWorldgen(a.modId, a.featureName)));

  // ── Wave C: diagnostics ──────────────────────────────────────────────────
  server.registerTool("analyze_log", {
    title: "Analyze game / crash log excerpt",
    inputSchema: z.object({
      logText: z.string(),
      version: z.string().optional(),
    }),
  }, async (a) => jsonResult(analyzeLog(a)));

  server.registerTool("get_migration_guide", {
    title: "Get built-in migration guide summary",
    inputSchema: z.object({ route: z.string() }),
  }, async (a) => jsonResult(getMigrationGuide(a.route)));

  server.registerTool("check_dependencies", {
    title: "Check Gradle / mods.toml dependency hints",
    inputSchema: z.object({
      buildGradle: z.string(),
      modsToml: z.string().optional(),
    }),
  }, async (a) => jsonResult(checkDependencies(a.buildGradle, a.modsToml)));

  server.registerTool(
    "mc_skill_update",
    {
      title: "Check / apply MC_skill tooling+data updates",
      description:
        "检查 GitHub Release 是否有新版本；确认后可更新 tooling（git ff-only + npm build）与 data（zip+SHA256）。" +
        "默认 channel=stable（忽略预发布）。apply 默认 dryRun；真写需 confirmed=true + MC_SKILL_ALLOW_WRITE=1 + MC_SKILL_PROJECT_ROOT=仓库根。",
      inputSchema: z.object({
        action: z.enum(["check", "apply"]).describe("check=只读探测；apply=预演或执行更新"),
        scope: z.enum(["tooling", "data", "all"]).optional().describe("默认 all"),
        dryRun: z.boolean().optional().describe("仅 apply：默认 true"),
        confirmed: z.boolean().optional().describe("apply 且 dryRun=false 时必须 true"),
        allowDirty: z.boolean().optional(),
        stashDirty: z.boolean().optional().describe("allowDirty 时可选先 stash 再 merge 再 pop"),
        channel: z.enum(["stable", "latest", "tag"]).optional().describe("默认 stable"),
        tagName: z.string().optional(),
        includePrerelease: z.boolean().optional().describe("true 时等价 channel=latest"),
      }),
    },
    async (args): Promise<CallToolResult> => jsonResult(await mcSkillUpdate(args)),
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
