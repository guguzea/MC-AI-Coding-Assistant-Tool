/**
 * T4 Access Widener（Fabric `.accesswidener`）解析与字节码级校验。
 *
 * 格式：
 *   header:  accessWidener v2 <namespace>   （v1/v2；namespace ∈ named|intermediary|official）
 *   条目:    [transitive ]<type> <class> [<member> <descriptor>]
 *   type ∈ {accessible, extendable, mutable}
 *
 * 校验核心与 AT 同框架（继承成员 / record 组件 / 内部类可达性 / 跨文件冲突），
 * 另加 Fabric 语义：transitive 前缀、namespace 合法性、extendable 目标不得为 final。
 */

import type { JarIndex } from "./bytecode.js";
import {
  normalizeOwnerCandidates,
  lookupMemberInHierarchy,
  isObfuscatedName,
  mappingMismatchSuggestion,
  type AccessValidationError,
  type AccessConflict,
  type AccessValidationResult,
} from "./access-transformer.js";

export { type AccessValidationError, type AccessConflict, type AccessValidationResult };

const AW_TYPE_RE = /^(accessible|extendable|mutable)$/;
const AW_NAMESPACES = ["named", "intermediary", "official"];

export interface AccessWidenerEntry {
  type: "accessible" | "extendable" | "mutable";
  owner: string;
  member?: string;
  descriptor?: string;
  kind: "class" | "member";
  transitive: boolean;
  raw: string;
  lineNo: number;
}

export function parseAccessWidener(
  content: string,
): { entries: AccessWidenerEntry[]; errors: AccessValidationError[]; warnings: string[]; namespace?: string; version?: number } {
  const entries: AccessWidenerEntry[] = [];
  const errors: AccessValidationError[] = [];
  const warnings: string[] = [];
  let namespace: string | undefined;
  let version: number | undefined;
  let headerSeen = false;

  const lines = content.split(/\r?\n/);
  for (let idx = 0; idx < lines.length; idx++) {
    const lineNo = idx + 1;
    const line = lines[idx].split("#")[0].trim();
    if (!line) continue;

    if (!headerSeen) {
      const m = line.match(/^accessWidener\s+v([12])\s+(\S+)$/);
      if (!m) {
        errors.push({
          target: line,
          issue: `首行应为 accessWidener header（第 ${lineNo} 行）`,
          suggestion: "格式：accessWidener v2 <namespace>，namespace ∈ named / intermediary / official",
        });
        continue;
      }
      headerSeen = true;
      version = Number(m[1]);
      namespace = m[2];
      if (!AW_NAMESPACES.includes(namespace)) {
        warnings.push(`namespace「${namespace}」不是标准值（named / intermediary / official），按字面处理`);
      }
      continue;
    }

    let tokens = line.split(/\s+/);
    let transitive = false;
    if (tokens[0] === "transitive") {
      transitive = true;
      tokens = tokens.slice(1);
      if (version === 1) {
        warnings.push(`第 ${lineNo} 行：transitive 仅在 accessWidener v2 支持（当前 v1）`);
      }
    }
    if (tokens.length < 3) {
      errors.push({
        target: line,
        issue: `无法解析 AW 条目（第 ${lineNo} 行）`,
        suggestion: "格式：[transitive ]<accessible|extendable|mutable> <class|method|field> <owner> [<member> <descriptor>]",
      });
      continue;
    }
    const type = tokens[0];
    if (!AW_TYPE_RE.test(type)) {
      errors.push({
        target: line,
        issue: `未知 AW 类型「${type}」（第 ${lineNo} 行）`,
        suggestion: "AW 类型应为 accessible / extendable / mutable",
      });
      continue;
    }
    const kindToken = tokens[1];
    if (!/^(class|method|field)$/.test(kindToken)) {
      errors.push({
        target: line,
        issue: `未知成员种类「${kindToken}」（第 ${lineNo} 行）`,
        suggestion: "AW 条目第二个 token 应为 class / method / field",
      });
      continue;
    }
    if (tokens.length > 5) {
      warnings.push(`第 ${lineNo} 行 token 过多，多余部分忽略: ${line}`);
    }
    entries.push({
      type: type as AccessWidenerEntry["type"],
      owner: tokens[2],
      member: tokens[3],
      descriptor: tokens[4],
      kind: kindToken === "class" ? "class" : "member",
      transitive,
      raw: line,
      lineNo,
    });
  }
  if (!headerSeen) {
    errors.push({ target: "(header)", issue: "缺少 accessWidener header", suggestion: "首行应为：accessWidener v2 <namespace>" });
  }
  return { entries, errors, warnings, namespace, version };
}

export interface AwValidateOptions {
  mapping?: string;
}

export function validateAccessWidener(
  content: string,
  index: JarIndex,
  opts: AwValidateOptions = {},
): AccessValidationResult {
  const parsed = parseAccessWidener(content);
  const errors = [...parsed.errors];
  const warnings = [...parsed.warnings];
  const checkedMembers = parsed.entries.filter((e) => e.kind === "member").length;
  validateWidenerEntries(parsed.entries, index, opts, errors, warnings);
  return { valid: errors.length === 0, errors, warnings, checkedMembers, crossFileConflicts: [] };
}

export function validateAccessWidenerFiles(
  contents: string[],
  index: JarIndex,
  opts: AwValidateOptions = {},
): AccessValidationResult {
  const errors: AccessValidationError[] = [];
  const warnings: string[] = [];
  const allEntries: AccessWidenerEntry[] = [];
  let checkedMembers = 0;
  contents.forEach((content) => {
    const parsed = parseAccessWidener(content);
    errors.push(...parsed.errors);
    warnings.push(...parsed.warnings);
    for (const e of parsed.entries) {
      allEntries.push(e);
      if (e.kind === "member") checkedMembers++;
    }
  });
  validateWidenerEntries(allEntries, index, opts, errors, warnings);
  const { conflicts, warnings: conflictWarnings } = detectWidenerConflicts(allEntries);
  warnings.push(...conflictWarnings);
  return { valid: errors.length === 0, errors, warnings, checkedMembers, crossFileConflicts: conflicts };
}

function validateWidenerEntries(
  entries: AccessWidenerEntry[],
  index: JarIndex,
  opts: AwValidateOptions,
  errors: AccessValidationError[],
  warnings: string[],
): void {
  for (const e of entries) {
    const owners = normalizeOwnerCandidates(e.owner);
    const ownerHit = owners.find((o) => index.hasClass(o));
    if (!ownerHit) {
      errors.push({
        target: e.owner,
        issue: `类不存在于 jar${e.kind === "member" ? `（成员 ${e.member}）` : ""}`,
        suggestion: owners.length > 1
          ? "检查内部类写法（Outer$Inner）与包路径；若使用映射名，请先 convert_mapping 确认类名"
          : "检查包路径/类名拼写；若使用映射名，请先 convert_mapping 确认类名",
      });
      continue;
    }
    const info = index.getClass(ownerHit);
    if (e.type === "extendable" && info && (info.accessFlags & 0x0010) !== 0) {
      warnings.push(`extendable 目标 ${ownerHit} 是 final 类，无法被继承扩展`);
    }
    if (e.type === "mutable" && e.kind === "member" && e.member?.includes("(")) {
      warnings.push(`mutable 通常用于字段；${e.member} 看起来是方法`);
    }
    if (e.kind === "class") continue;

    const lookup = lookupMemberInHierarchy(index, ownerHit, e.member!, e.descriptor);
    if (!lookup.found) {
      if (isObfuscatedName(e.member!)) {
        errors.push({
          target: `${e.owner}#${e.member}`,
          issue: `成员不存在：${e.member}（可能是映射层不匹配）`,
          suggestion: mappingMismatchSuggestion(e.member!, opts.mapping),
        });
      } else {
        errors.push({
          target: `${e.owner}#${e.member}${e.descriptor ? " " + e.descriptor : ""}`,
          issue: `成员不存在于 ${ownerHit} 或其父类链`,
          suggestion: "检查成员名拼写与 MC 版本；映射名请用 convert_mapping 转换",
        });
      }
      continue;
    }
    if (lookup.declaredIn && lookup.declaredIn !== ownerHit) {
      warnings.push(`成员 ${e.member} 声明于父类 ${lookup.declaredIn}（经 ${ownerHit} 继承可达）`);
    }
  }
}

function detectWidenerConflicts(entries: AccessWidenerEntry[]): { conflicts: AccessConflict[]; warnings: string[] } {
  const byKey = new Map<string, AccessWidenerEntry[]>();
  for (const e of entries) {
    const key = e.kind === "class"
      ? `class:${e.owner}`
      : `member:${e.owner}#${e.member}${e.descriptor ?? ""}`;
    const list = byKey.get(key) ?? [];
    list.push(e);
    byKey.set(key, list);
  }
  const conflicts: AccessConflict[] = [];
  const warnings: string[] = [];
  for (const [key, list] of byKey) {
    if (list.length < 2) continue;
    const target = key.replace(/^(class|member):/, "");
    const first = list[0];
    const firstTransitive = first.transitive;
    for (const e of list.slice(1)) {
      if (e.type !== first.type) {
        conflicts.push({ target, accessA: first.type, accessB: e.type });
      } else if (e.transitive !== firstTransitive) {
        warnings.push(`同一目标 ${target} 的 transitive 标记不一致（transitive 冲突需人工确认）`);
      } else {
        warnings.push(`重复声明（相同类型）：${target}（第 ${e.lineNo} 行）`);
      }
    }
  }
  return { conflicts, warnings };
}

/** 单一 content 内 `# ==== file: 名字 ====` 注释行作为文件边界，用于跨文件冲突检测。 */
export function splitWidenerFiles(content: string): string[] {
  const segments = content.split(/^#\s*={3,}.*$/gm);
  return segments.map((s) => s.trim()).filter((s) => s.length > 0);
}
