import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { resolveDataDir, resolveCommunityDir, resolveRepoRoot } from "../utils/path.js";
import { getWorkflowTemplate, listWorkflowTemplateNames, WORKFLOW_TEMPLATES } from "./templates.js";
import { getCommunityDocStore } from "../docs-platform/community/store.js";

export { getWorkflowTemplate, listWorkflowTemplateNames, WORKFLOW_TEMPLATES };

export interface KnowledgeResource {
  uri: string;
  name: string;
  description: string;
}

export function listKnowledgeResources(): KnowledgeResource[] {
  const resources: KnowledgeResource[] = [
    { uri: "mcskill://matrix/mixin-support", name: "mixin-support-matrix", description: "mixin_analyze 支持矩阵摘要" },
    { uri: "mcskill://schema/sqlite", name: "mapping-sqlite-schema", description: "yarn-mappings.sqlite v2/v3 字段说明" },
    { uri: "mcskill://version-changes/1.21", name: "version-1.21", description: "1.21 变更专章（知识库）" },
    { uri: "mcskill://antipatterns/registry", name: "antipattern-registry", description: "注册反模式短文" },
    { uri: "mcskill://patterns/README", name: "patterns-index", description: "代码模式库索引" },
  ];
  for (const name of listWorkflowTemplateNames()) {
    resources.push({
      uri: `mcskill://workflow/${name}`,
      name: `workflow-${name}`,
      description: WORKFLOW_TEMPLATES[name].title,
    });
  }
  for (const e of getCommunityDocStore().listReadableEntries()) {
    resources.push({
      uri: `mcskill://community/${e.id}`,
      name: e.id.replace(/\//g, "-"),
      description: e.label || e.summary,
    });
  }
  return resources;
}

export function readKnowledgeResource(uri: string): { found: boolean; uri: string; mimeType: string; text: string } {
  if (uri.startsWith("mcskill://workflow/")) {
    const name = uri.replace("mcskill://workflow/", "");
    const t = getWorkflowTemplate(name);
    return {
      found: t.found,
      uri,
      mimeType: "text/plain",
      text: t.body ?? "",
    };
  }

  if (uri === "mcskill://matrix/mixin-support") {
    return {
      found: true,
      uri,
      mimeType: "text/plain",
      text: "mixin_analyze 支持: SRG, Yarn intermediary, Mojang m_*, readable+MCP, descriptor 一体, method+desc 分离, method 数组",
    };
  }

  if (uri === "mcskill://schema/sqlite") {
    const p = join(resolveDataDir("forge_1.20.1", "mappings"), "yarn-mappings.sqlite");
    return {
      found: true,
      uri,
      mimeType: "text/plain",
      text: `映射库路径: ${p}\nschema v3: methods, fields, searge_fields；v2 只读 methods。`,
    };
  }

  if (uri === "mcskill://version-changes/1.21") {
    const candidates = [
      join(resolveRepoRoot(), "fabric", "1.21.11", "knowledge", "version-changes", "1.21.x.md"),
      join(resolveRepoRoot(), "fabric", "1.21.11", "knowledge", "version-changes", "1.21.md"),
    ];
    for (const p of candidates) {
      const norm = p.replace(/\\/g, "/");
      if (/\/1\.20\.x\.md$/i.test(norm)) continue;
      if (existsSync(p)) {
        return { found: true, uri, mimeType: "text/markdown", text: readFileSync(p, "utf8") };
      }
    }
    return {
      found: false,
      uri,
      mimeType: "text/plain",
      text: "1.21 专章尚未写入知识库（禁止回退 1.20.x.md）",
    };
  }

  if (uri === "mcskill://antipatterns/registry") {
    const p = join(resolveRepoRoot(), "forge", "1.20.1", "knowledge", "antipatterns", "registry.md");
    if (existsSync(p)) {
      return { found: true, uri, mimeType: "text/markdown", text: readFileSync(p, "utf8") };
    }
  }

  if (uri.startsWith("mcskill://community/")) {
    const id = uri.replace("mcskill://community/", "");
    try {
      const full = getCommunityDocStore().getFull(id);
      if (full.linkOnly) {
        return {
          found: false,
          uri,
          mimeType: "text/plain",
          text: "请使用 get_community_doc_full；links 条目不内联网页正文（AGENT_USAGE.md）",
        };
      }
      return { found: true, uri, mimeType: "text/markdown", text: full.content };
    } catch {
      return {
        found: false,
        uri,
        mimeType: "text/plain",
        text: "请使用 get_community_doc_full；links 条目不内联网页正文（AGENT_USAGE.md）",
      };
    }
  }

  if (uri === "mcskill://patterns/README") {
    const p = join(resolveCommunityDir(), "patterns", "README.md");
    if (existsSync(p)) {
      return { found: true, uri, mimeType: "text/markdown", text: readFileSync(p, "utf8") };
    }
    return {
      found: false,
      uri,
      mimeType: "text/markdown",
      text: "# patterns\n\n未找到 community_knowledge/patterns/README.md（检查 MC_SKILL_COMMUNITY）。",
    };
  }

  return { found: false, uri, mimeType: "text/plain", text: "未知 URI" };
}
