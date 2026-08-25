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
const MAX_WALK_FILES = 8000;

function isDangerousRegex(src: string): boolean {
  if (/\([^)]*[+*][^)]*\)[+*]/.test(src)) return true;
  if (/\(\.\*\)[+*]|(\.\*){2}/.test(src)) return true;
  if (/\([^?][^)]*\{[^)]*\}[^)]*\)[+*{]/.test(src)) return true;
  return false;
}

function walkFiltered(dir: string, extensions: string[]): { files: string[]; truncated: boolean } {
  const out: string[] = [];
  let truncated = false;
  const stack = [dir];
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
        const dot = e.name.lastIndexOf(".");
        const ext = dot >= 0 ? e.name.slice(dot).toLowerCase() : "";
        if (!extensions.includes(ext)) continue;
        if (out.length >= MAX_WALK_FILES) {
          truncated = true;
          return { files: out, truncated };
        }
        out.push(full);
      }
    }
  }
  return { files: out, truncated };
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
    if ((args.query ?? "").length > 512) {
      return fail(
        actionable(
          "INVALID_INPUT",
          "pattern 超长（>512 字符）可能引发灾难回溯，建议去掉 pattern 用子串匹配或缩短表达式",
          ["不带 pattern 的子串匹配", "拆分多次查询"],
        ),
      );
    }
    if (isDangerousRegex(query)) {
      return fail(
        actionable(
          "INVALID_INPUT",
          "拒绝嵌套量词 / 未转义 .*.* 类正则（灾难回溯风险）",
          ["去掉 pattern 用子串匹配", "改写为无嵌套量词的表达式"],
        ),
      );
    }
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
  const walked = walkFiltered(root, extensions);
  if (walked.truncated) truncated = true;
  const started = Date.now();
  const deadline = started + 1500;
  for (const file of walked.files) {
    if (hits.length >= maxResults) {
      truncated = true;
      break;
    }
    if (Date.now() > deadline) {
      truncated = true;
      break;
    }
    let content: string;
    try {
      const size = statSync(file).size;
      if (size > 8 * 1024 * 1024) continue;
      content = readFileSync(file, "utf8");
    } catch {
      continue;
    }
    const lines = content.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      const lineText = lines[i];
      if (lineText.length > MAX_LINE_LEN && re) continue;
      if (re) re.lastIndex = 0;
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
