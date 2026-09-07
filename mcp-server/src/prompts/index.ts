import { readFileSync, existsSync, readdirSync } from "fs";
import { join } from "path";
import { resolveDataDir, resolveCommunityDir, resolveRepoRoot, isResolvedInside } from "../utils/path.js";
import { getWorkflowTemplate, listWorkflowTemplateNames, WORKFLOW_TEMPLATES } from "./templates.js";
import { getCommunityDocStore } from "../docs-platform/community/store.js";

export { getWorkflowTemplate, listWorkflowTemplateNames, WORKFLOW_TEMPLATES };

export interface KnowledgeResource {
  uri: string;
  name: string;
  description: string;
}

/** §3.1-4：只有这三家平台树有 `code-patterns/`，与 catalog.ts 的 KNOWLEDGE_PLATFORM_DIRS 同集合。 */
const CODE_PATTERN_PLATFORMS = ["forge", "fabric", "neoforge"];
const CODE_PATTERN_PREFIX = "mcskill://code-patterns/";

/** 盘上实际有哪些 code-patterns 正文 → 仓库根相对路径（含 `code-patterns/` 段）。清单与读取都由它派生，工具输出因此不可能与实文件名脱钩。 */
function scanCodePatterns(repoRoot: string): string[] {
  const rels: string[] = [];
  const collect = (dir: string, relDir: string) => {
    let names: string[];
    try {
      names = readdirSync(dir);
    } catch {
      return;
    }
    for (const n of names.sort()) {
      if (n.endsWith(".md")) rels.push(`${relDir}/${n}`);
    }
  };
  for (const platform of CODE_PATTERN_PLATFORMS) {
    const platDir = join(repoRoot, platform);
    if (!existsSync(platDir)) continue;
    collect(join(platDir, "code-patterns"), `${platform}/code-patterns`);
    let versions: string[];
    try {
      versions = readdirSync(platDir).filter((v) => /^\d+(\.\d+)*$/.test(v)).sort();
    } catch {
      versions = [];
    }
    for (const v of versions) collect(join(platDir, v, "code-patterns"), `${platform}/${v}/code-patterns`);
  }
  return rels.sort();
}

function codePatternUri(rel: string): string {
  return CODE_PATTERN_PREFIX + rel.split("/").filter((s) => s !== "code-patterns").join("/");
}

/** `mcskill://code-patterns/<平台>[/<版本>]/<文件>.md` → 仓库根相对路径；非法输入返回 null（读工具入口，必须挡住穿越与任意文件读）。 */
function codePatternRel(uri: string): string | null {
  const rest = uri.slice(CODE_PATTERN_PREFIX.length);
  if (!rest || rest.includes("\\")) return null;
  const parts = rest.split("/");
  if (parts.length < 2 || parts.length > 3) return null;
  for (const p of parts) {
    if (!/^[\w.-]+$/.test(p) || p === "." || p === "..") return null;
  }
  const file = parts[parts.length - 1] ?? "";
  if (!file.endsWith(".md")) return null;
  if (parts.length === 3 && !/^\d+(\.\d+)*$/.test(parts[1] ?? "")) return null;
  return `${parts.slice(0, -1).join("/")}/code-patterns/${file}`;
}

export function listKnowledgeResources(): KnowledgeResource[] {
  const resources: KnowledgeResource[] = [
    { uri: "mcskill://matrix/mixin-support", name: "mixin-support-matrix", description: "mixin_analyze 支持矩阵摘要" },
    { uri: "mcskill://schema/sqlite", name: "mapping-sqlite-schema", description: "yarn-mappings.sqlite v2/v3 字段说明。必须带 ?version=<精确 MC 版本>；裸 URI 只返回参数缺失提示" },
    { uri: "mcskill://version-changes/1.21", name: "version-1.21", description: "1.21 变更专章；实读 fabric/1.21.11/knowledge/version-changes/1.21.x.md，仅该档，不代表其他 1.21 档" },
    { uri: "mcskill://antipatterns/registry", name: "antipattern-registry", description: "注册反模式短文；实读 forge/1.20.1/knowledge/antipatterns/registry.md，仅该档" },
    { uri: "mcskill://patterns/README", name: "patterns-index", description: "社区 patterns 索引；实读 community_knowledge/patterns/README.md，不是仓库根 knowledge/patterns/ 短片段库" },
  ];
  for (const rel of scanCodePatterns(resolveRepoRoot())) {
    const uri = codePatternUri(rel);
    const dir = rel.slice(0, rel.lastIndexOf("/code-patterns/"));
    const fileName = rel.slice(rel.lastIndexOf("/") + 1);
    const name = `code-patterns-${uri.slice(CODE_PATTERN_PREFIX.length).replace(/\//g, "-").replace(/\.md$/, "")}`;
    resources.push(
      fileName === "README.md"
        ? { uri, name, description: `实读 ${rel}；本目录「主题 → 文件」索引（其余 code-patterns 条从这里取主题归属）` }
        : { uri, name, description: `实读 ${rel}，仅 ${dir} 档适用；索引见 ${dir}/code-patterns/README.md` },
    );
  }
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

  if (uri === "mcskill://schema/sqlite" || uri.startsWith("mcskill://schema/sqlite?")) {
    const q = uri.includes("?") ? Object.fromEntries(new URLSearchParams(uri.split("?")[1] ?? "")) : {};
    const rawVer = String(q.version ?? "").trim();
    if (!rawVer) {
      return {
        found: false,
        uri,
        mimeType: "text/plain",
        text: "缺少 version 参数，禁止默认 1.20.1。请使用 mcskill://schema/sqlite?version=<精确 MC 版本>",
      };
    }
    const ver = rawVer.replace(/[^0-9.]/g, "");
    if (!ver) {
      return {
        found: false,
        uri,
        mimeType: "text/plain",
        text: `非法 version「${rawVer}」，禁止默认 1.20.1。`,
      };
    }
    const p = join(resolveDataDir(`forge_${ver}`, "mappings"), "yarn-mappings.sqlite");
    return {
      found: true,
      uri,
      mimeType: "text/plain",
      text: `映射库路径: ${p}\nschema v3: methods, fields, searge_fields；v2 只读 methods。`,
    };
  }

  if (uri.startsWith(CODE_PATTERN_PREFIX)) {
    const rel = codePatternRel(uri);
    if (!rel) {
      return {
        found: false,
        uri,
        mimeType: "text/plain",
        text: "非法 code-patterns URI：只接受 mcskill://code-patterns/<平台>[/<精确版本>]/<文件>.md，文件名请以 list_knowledge_resources 返回为准。",
      };
    }
    const root = resolveRepoRoot();
    const p = join(root, rel);
    if (!isResolvedInside(root, p) || !existsSync(p)) {
      const dir = rel.slice(0, rel.lastIndexOf("/"));
      const dirExists = isResolvedInside(root, join(root, dir)) && existsSync(join(root, dir));
      return {
        found: false,
        uri,
        mimeType: "text/markdown",
        text: dirExists
          ? `未找到 ${rel}；${dir}/ 存在但该档的 code-patterns 文件名以 list_knowledge_resources 返回为准（主题归属见 ${dir}/code-patterns/README.md）。禁止拿邻近版本的同主题文件顶上。`
          : `未找到 ${rel}。该档可能没有 code-patterns/；禁止拿邻近版本的同主题文件顶上，先跑 list_knowledge_resources 看实文件名。`,
      };
    }
    return { found: true, uri, mimeType: "text/markdown", text: readFileSync(p, "utf8") };
  }

  if (uri === "mcskill://version-changes/1.21") {
    const candidates = [
      join(resolveRepoRoot(), "fabric", "1.21.11", "knowledge", "version-changes", "1.21.x.md"),
      join(resolveRepoRoot(), "fabric", "1.21.11", "knowledge", "version-changes", "1.21.md"),
    ];
    for (const p of candidates) {
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
