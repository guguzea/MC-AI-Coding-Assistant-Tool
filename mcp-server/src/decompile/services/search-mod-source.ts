/**
 * 已反编译模组源码检索（search_mod_code）。
 *
 * 简单行级 grep（v1 不引入 FTS5 —— 反编译目录规模有限，行级扫描足够）；
 * 支持子串（默认）与正则（pattern:true）两种模式。
 */

import { existsSync, readdirSync, readFileSync, statSync } from "fs";
import { join, relative, sep } from "path";
import { actionable, type ActionEnvelope } from "../../utils/actionable.js";

export interface SearchHit {
  file: string;
  relPath: string;
  line: number;
  text: string;
}

export interface SearchModSourceArgs {
  root: string;
  query: string;
  pattern?: boolean;
  maxResults?: number;
  /** 仅搜索这些后缀（默认 .java；.txt/.json 也可） */
  extensions?: string[];
}

export interface SearchModSourceResult {
  found: boolean;
  query: string;
  root: string;
  hits: SearchHit[];
  total: number;
  truncated: boolean;
  action?: ActionEnvelope;
}

const DEFAULT_EXTENSIONS = [".java", ".txt", ".json", ".toml", ".cfg"];

const MAX_LINE_LEN = 400;

function walk(dir: string): string[] {
  const out: string[] = [];
  let stack = [dir];
  while (stack.length > 0) {
    const cur = stack.pop()!;
    let entries;
    try {
      entries = readdirSync(cur, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const e of entries) {
      const full = join(cur, e.name);
      if (e.isDirectory()) {
        if (e.name === ".git" || e.name === "node_modules") continue;
        stack.push(full);
      } else if (e.isFile()) {
        out.push(full);
      }
    }
  }
  return out;
}

export function searchModSource(args: SearchModSourceArgs): SearchModSourceResult {
  const root = args.root;
  const query = args.query ?? "";
  const maxResults = Math.max(1, Math.min(args.maxResults ?? 100, 500));
  const extensions = args.extensions ?? DEFAULT_EXTENSIONS;

  const fail = (action: ActionEnvelope): SearchModSourceResult => ({
    found: false,
    query,
    root,
    hits: [],
    total: 0,
    truncated: false,
    action,
  });

  if (!query) {
    return fail(actionable("INVALID_INPUT", "query 不能为空", ["传入要搜索的类名/方法名/字段名或正则"]));
  }
  if (!existsSync(root) || !statSync(root).isDirectory()) {
    return fail(
      actionable(
        "NOT_FOUND",
        `反编译源码目录不存在: ${root}`,
        ["先调用 decompile_mod_jar 生成源码，或传入正确的 decompiledDir"],
        ["decompile_mod_jar", "get_minecraft_source"],
      ),
    );
  }

  let re: RegExp | null = null;
  if (args.pattern) {
    try {
      re = new RegExp(query, "i");
    } catch (err) {
      return fail(
        actionable("INVALID_INPUT", `正则无效: ${(err as Error).message}`, ["修正 pattern 后重试，或去掉 pattern 用子串匹配"]),
      );
    }
  }

  const hits: SearchHit[] = [];
  let truncated = false;
  const files = walk(root);
  for (const file of files) {
    if (hits.length >= maxResults) {
      truncated = true;
      break;
    }
    const ext = file.slice(file.lastIndexOf(".")).toLowerCase();
    if (!extensions.includes(ext)) continue;
    let content: string;
    try {
      const size = statSync(file).size;
      if (size > 8 * 1024 * 1024) continue; // 大文件跳过（防异常 jar 资源）
      content = readFileSync(file, "utf8");
    } catch {
      continue;
    }
    const lines = content.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      const lineText = lines[i];
      const matched = re ? re.test(lineText) : lineText.toLowerCase().includes(query.toLowerCase());
      if (matched) {
        hits.push({
          file,
          relPath: relative(root, file).split(sep).join("/"),
          line: i + 1,
          text: lineText.length > MAX_LINE_LEN ? lineText.slice(0, MAX_LINE_LEN) + "…" : lineText,
        });
        if (hits.length >= maxResults) {
          truncated = true;
          break;
        }
      }
    }
  }

  return {
    found: hits.length > 0,
    query,
    root,
    hits: hits.slice(0, maxResults),
    total: hits.length,
    truncated,
  };
}
