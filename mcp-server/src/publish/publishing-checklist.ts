/**
 * 读取社区短文 community_knowledge/authored/publishing.md 的「发布前检查清单」，
 * 把清单里点名了元数据文件的条目转成机器可核的字段要求。
 *
 * 要求清单**来自该文档本身**（不写死字段名）：文档改了字段列表，检查结果随之变。
 * 每次调用都重读文件（不缓存），MC_SKILL_COMMUNITY 覆盖路径时立即生效。
 */
import { existsSync, readFileSync, statSync } from "fs";
import { join } from "path";
import { resolveCommunityDir } from "../utils/path.js";
import { stripLeadingFrontmatter } from "../docs-platform/community/store.js";

export const PUBLISHING_DOC_RELPOSIX = "authored/publishing.md";
const SECTION_TITLE = "发布前检查清单";

export interface PublishingRequirement {
  /** 文档点名的元数据文件名，如 mods.toml / fabric.mod.json */
  file: string;
  fields: string[];
}

export interface PublishingChecklist {
  available: boolean;
  /** 相对仓库根的 posix 路径；不可用时为诊断说明 */
  source: string;
  requirements: PublishingRequirement[];
  /** 清单里无法机器核的每条行（「条目标题：行原文」），确保没有清单行被静默丢弃 */
  manual: string[];
  /** 清单是否要求核 logoFile 指向的文件真实存在 */
  logoFileRule: boolean;
  reason?: string;
}

function unavailable(
  source: string,
  reason: string,
  parsed: Omit<PublishingChecklist, "available" | "source"> = { requirements: [], manual: [], logoFileRule: false },
): PublishingChecklist {
  return { available: false, source, ...parsed, reason };
}

function isBareIdentifier(token: string): boolean {
  return /^[A-Za-z][A-Za-z0-9_]*$/.test(token);
}

function backtickedTokens(line: string): string[] {
  return [...line.matchAll(/`([^`\n]+)`/g)].map((m) => m[1].trim()).filter(Boolean);
}

/** 按标题层级切出「发布前检查清单」小节；找不到返回 null。 */
export function extractChecklistSection(content: string): string[] | null {
  const lines = stripLeadingFrontmatter(content).split(/\r?\n/);
  let start = -1;
  let level = 0;
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^(#{1,6})\s*(.+?)\s*$/);
    if (!m) continue;
    if (start < 0) {
      if (m[2].includes(SECTION_TITLE)) {
        start = i + 1;
        level = m[1].length;
      }
      continue;
    }
    if (m[1].length <= level) break;
  }
  if (start < 0) return null;
  const body = lines.slice(start);
  const next = body.findIndex((l) => /^#{1,6}\s+/.test(l));
  return next < 0 ? body : body.slice(0, next);
}

export function parsePublishingChecklist(content: string): Omit<PublishingChecklist, "available" | "source"> {
  const section = extractChecklistSection(content);
  if (!section) {
    return { requirements: [], manual: [], logoFileRule: false };
  }
  const docText = section.join("\n");
  const requirements = new Map<string, Set<string>>();
  const manual: string[] = [];

  let current: { title: string; body: string[] } | null = null;
  const flush = () => {
    if (!current) return;
    for (const line of current.body) {
      const tokens = backtickedTokens(line);
      const files = tokens.filter((t) => /^[\w./-]+\.(toml|json)$/.test(t));
      const fields = tokens.filter((t) => isBareIdentifier(t) && !files.includes(t));
      if (files.length && fields.length) {
        for (const f of files) {
          const set = requirements.get(f) ?? new Set<string>();
          for (const field of fields) set.add(field);
          requirements.set(f, set);
        }
        continue;
      }
      manual.push(`${current.title}：${line}`);
    }
    current = null;
  };

  for (const line of section) {
    const item = line.match(/^\s*\d+\.\s+(.*)$/);
    if (item) {
      flush();
      current = { title: item[1].replace(/\*\*/g, "").trim(), body: [] };
      continue;
    }
    if (!current) continue;
    if (/^\s*[-*]\s+/.test(line) || /^\s{2,}\S/.test(line)) {
      current.body.push(line.replace(/^\s*[-*]\s+/, "").trim());
      continue;
    }
    const cont = line.trim();
    if (cont) current.body.push(cont);
  }
  flush();

  return {
    requirements: [...requirements.entries()].map(([file, fields]) => ({ file, fields: [...fields] })),
    manual,
    logoFileRule: /`logoFile`/.test(docText),
  };
}

export function loadPublishingChecklist(): PublishingChecklist {
  const dir = resolveCommunityDir();
  const file = join(dir, "authored", "publishing.md");
  const source = `community_knowledge/${PUBLISHING_DOC_RELPOSIX}`;
  if (!existsSync(file)) return unavailable(source, `未找到 ${file}`);
  let content: string;
  try {
    if (!statSync(file).isFile()) return unavailable(source, `${file} 不是文件`);
    content = readFileSync(file, "utf8");
  } catch (err) {
    return unavailable(source, `读取失败：${String(err)}`);
  }
  const parsed = parsePublishingChecklist(content);
  if (!parsed.requirements.length) {
    return unavailable(
      source,
      `「${SECTION_TITLE}」里没有条目同时点名元数据文件与字段，无法机器核`,
      parsed,
    );
  }
  return { available: true, source, ...parsed };
}
