/**
 * T4 Access Transformer（Forge/NeoForge `*_at.cfg`）解析与字节码级校验。
 *
 * 行格式：`<access> <owner> [<member> [<descriptor>]]`，
 *   access ∈ {public, protected, private, public-f, protected-f, private-f,
 *             public-static, protected-static, private-static, ...}
 *
 * 校验（基于任务2 缓存的 remapped 客户端 jar）：
 *   (a) owner 类存在于 jar（支持 `Outer$Inner` / `Outer.Inner` 归一化）
 *   (b) member AT：目标成员存在——本类 + 父类继承链 + record 组件
 *   (c) 映射层不匹配（jar 为 yarn/mojmap 而 AT 用 SRG/混淆名）→ 提示 convert_mapping
 *   (d) 跨 AT 文件冲突：同一类/成员被不同 access 修改 → 冲突告警
 */

import type { JarIndex } from "./bytecode.js";

export interface AccessValidationError {
  target: string;
  issue: string;
  suggestion: string;
}

export interface AccessConflict {
  target: string;
  accessA: string;
  accessB: string;
}

export interface AccessValidationResult {
  valid: boolean;
  errors: AccessValidationError[];
  warnings: string[];
  checkedMembers: number;
  crossFileConflicts: AccessConflict[];
}

export interface MemberMatch {
  name: string;
  descriptor: string;
  owner: string;
  kind: "method" | "field" | "record";
}

export interface MemberLookupResult {
  found: boolean;
  /** 继承链上第一个声明者的类名 */
  declaredIn?: string;
  matches: MemberMatch[];
}

// ── 共享辅助（AW 复用）─────────────────────────────────────────────────────────

const SRG_METHOD_RE = /^func_\d+_[a-zA-Z]+$/;
const SRG_FIELD_RE = /^field_\d+_[a-zA-Z]+$/;
const YARN_METHOD_RE = /^method_\d+$/i;
const YARN_FIELD_RE = /^field_\d+$/i;
const MOJANG_METHOD_RE = /^m_\d+_$/;
const MOJANG_FIELD_RE = /^f_\d+_$/;

export function isObfuscatedName(name: string): boolean {
  return (
    SRG_METHOD_RE.test(name) ||
    SRG_FIELD_RE.test(name) ||
    YARN_METHOD_RE.test(name) ||
    YARN_FIELD_RE.test(name) ||
    MOJANG_METHOD_RE.test(name) ||
    MOJANG_FIELD_RE.test(name)
  );
}

/** 类名归一化候选：点号 → 斜杠；`Outer.Inner` → `Outer$Inner`。 */
export function normalizeOwnerCandidates(name: string): string[] {
  const trimmed = (name ?? "").trim().replace(/^L/, "").replace(/;$/, "");
  if (!trimmed) return [];
  const slashed = trimmed.replace(/\./g, "/");
  const out = [slashed];
  if (trimmed.includes(".")) {
    const dotIdx = trimmed.lastIndexOf(".");
    const innerMerged = `${trimmed.slice(0, dotIdx)}$${trimmed.slice(dotIdx + 1)}`.replace(/\./g, "/");
    if (!out.includes(innerMerged)) out.push(innerMerged);
  }
  return out;
}

/** 类名是否指向同一 owner（点号/斜杠/`Outer$Inner`）。 */
export function ownersMatch(a: string, b: string): boolean {
  if (!a || !b) return a === b;
  const left = new Set(normalizeOwnerCandidates(a));
  return normalizeOwnerCandidates(b).some((x) => left.has(x));
}

function accessTargetGroups<T extends { owner: string; kind: string; member?: string; descriptor?: string }>(
  entries: T[],
): T[][] {
  const groups: T[][] = [];
  for (const e of entries) {
    const hit = groups.find((g) => {
      const s = g[0];
      if (s.kind !== e.kind) return false;
      if ((s.member ?? "") !== (e.member ?? "")) return false;
      if ((s.descriptor ?? "") !== (e.descriptor ?? "")) return false;
      return ownersMatch(s.owner, e.owner);
    });
    if (hit) hit.push(e);
    else groups.push([e]);
  }
  return groups;
}

/** 在类及其父类继承链 + 接口闭包（含 record 组件）中查找成员（接口 default/静态成员是合法 AT/AW 目标，F-E108）。 */
export function lookupMemberInHierarchy(
  index: JarIndex,
  ownerInternal: string,
  member: string,
  descriptor?: string,
): MemberLookupResult {
  const seen = new Set<string>();
  const matches: MemberMatch[] = [];
  let declaredIn: string | undefined;

  const scanClass = (internal: string): void => {
    const info = index.getClass(internal);
    if (!info) return;
    for (const m of info.methods) {
      if (m.name !== member) continue;
      if (descriptor && m.descriptor !== descriptor) continue;
      if (!declaredIn) declaredIn = internal;
      matches.push({ name: m.name, descriptor: m.descriptor, owner: internal, kind: "method" });
    }
    for (const f of info.fields) {
      if (f.name !== member) continue;
      if (descriptor && f.descriptor !== descriptor) continue;
      if (!declaredIn) declaredIn = internal;
      matches.push({ name: f.name, descriptor: f.descriptor, owner: internal, kind: "field" });
    }
    for (const r of info.recordComponents) {
      if (r.name !== member) continue;
      if (descriptor && r.descriptor !== descriptor) continue;
      if (matches.some((m) => m.name === r.name && m.descriptor === r.descriptor)) continue;
      if (!declaredIn) declaredIn = internal;
      matches.push({ name: r.name, descriptor: r.descriptor, owner: internal, kind: "record" });
    }
  };

  // 先沿父类链上溯
  let current = ownerInternal;
  while (current && current !== "java/lang/Object" && !seen.has(current)) {
    seen.add(current);
    scanClass(current);
    if (matches.length) break;
    const info = index.getClass(current);
    current = info?.superName ?? "";
  }
  // 父类链未命中 → BFS 接口闭包（default 方法 / 接口静态成员/常量）
  if (matches.length === 0) {
    const queue: string[] = [];
    const seed = index.getClass(ownerInternal);
    if (seed) queue.push(...(seed.interfaces ?? []));
    while (queue.length > 0 && matches.length === 0) {
      const iface = queue.shift()!;
      if (!iface || seen.has(iface)) continue;
      seen.add(iface);
      scanClass(iface);
      const ifaceInfo = index.getClass(iface);
      if (ifaceInfo) {
        for (const parent of ifaceInfo.interfaces ?? []) {
          if (!seen.has(parent)) queue.push(parent);
        }
        if (ifaceInfo.superName && ifaceInfo.superName !== "java/lang/Object" && !seen.has(ifaceInfo.superName)) {
          queue.push(ifaceInfo.superName);
        }
      }
    }
  }
  return { found: matches.length > 0, declaredIn, matches };
}

/** jar 映射层不匹配时的可操作建议。 */
export function mappingMismatchSuggestion(member: string, mapping?: string): string {
  const layer = mapping ? `当前 jar 为 ${mapping} 层` : "当前 jar 的映射层未知";
  return (
    `${member} 看起来是混淆/SRG/中间名，${layer}，类内不存在该名字。` +
    `请用 convert_mapping（from=mcp|yarn|mojang，to 与 jar 映射层一致）转换后再写 AT，` +
    `或在 AT 中直接使用 jar 的映射层成员名。`
  );
}

// ── AT 解析 ───────────────────────────────────────────────────────────────────

const AT_ACCESS_RE = /^(public|protected|private)(-static|-f|-static-f)?$/;

export interface AccessTransformerEntry {
  access: string;
  owner: string;
  member?: string;
  descriptor?: string;
  kind: "class" | "member";
  raw: string;
  lineNo: number;
}

export function parseAccessTransformer(
  content: string,
): { entries: AccessTransformerEntry[]; errors: AccessValidationError[]; warnings: string[] } {
  const entries: AccessTransformerEntry[] = [];
  const errors: AccessValidationError[] = [];
  const warnings: string[] = [];
  const lines = content.split(/\r?\n/);

  lines.forEach((rawLine, idx) => {
    const lineNo = idx + 1;
    const line = rawLine.split("#")[0].trim();
    if (!line) return;
    const tokens = line.split(/\s+/);
    const access = tokens[0];
    if (!AT_ACCESS_RE.test(access)) {
      errors.push({
        target: line,
        issue: `无法识别的 access 修饰符「${access}」（第 ${lineNo} 行）`,
        suggestion: "AT access 应为 public / protected / private，可带 -f（字段）/ -static 后缀",
      });
      return;
    }
    if (tokens.length < 2) {
      errors.push({
        target: line,
        issue: `缺少目标类（第 ${lineNo} 行）`,
        suggestion: "格式：<access> <owner> [<member> [<descriptor>]]",
      });
      return;
    }
    if (tokens.length > 4) {
      warnings.push(`第 ${lineNo} 行 token 过多，多余部分忽略: ${line}`);
    }
    const owner = tokens[1];
    const member = tokens[2];
    const descriptor = tokens[3];
    entries.push({
      access,
      owner,
      member,
      descriptor,
      kind: member ? "member" : "class",
      raw: line,
      lineNo,
    });
  });
  return { entries, errors, warnings };
}

// ── 校验 ──────────────────────────────────────────────────────────────────────

export interface AccessValidateOptions {
  /** jar 映射层（从文件名推断：yarn / mojmap / official / unknown） */
  mapping?: string;
}

export function validateAccessTransformer(
  content: string,
  index: JarIndex,
  opts: AccessValidateOptions = {},
): AccessValidationResult {
  const { entries, errors, warnings } = parseAccessTransformer(content);
  const checkedMembers = entries.filter((e) => e.kind === "member").length;
  validateEntries(entries, index, opts, errors, warnings);
  return { valid: errors.length === 0, errors, warnings, checkedMembers, crossFileConflicts: [] };
}

export function validateAccessTransformerFiles(
  contents: string[],
  index: JarIndex,
  opts: AccessValidateOptions = {},
): AccessValidationResult {
  const errors: AccessValidationError[] = [];
  const warnings: string[] = [];
  const allEntries: AccessTransformerEntry[] = [];
  let checkedMembers = 0;
  contents.forEach((content, fileIdx) => {
    const parsed = parseAccessTransformer(content);
    errors.push(...parsed.errors);
    warnings.push(...parsed.warnings);
    for (const e of parsed.entries) {
      allEntries.push({ ...e, raw: e.raw });
      if (e.kind === "member") checkedMembers++;
    }
  });
  validateEntries(allEntries, index, opts, errors, warnings);
  const { conflicts, warnings: conflictWarnings } = detectCrossFileConflicts(allEntries);
  warnings.push(...conflictWarnings);
  return { valid: errors.length === 0, errors, warnings, checkedMembers, crossFileConflicts: conflicts };
}

function validateEntries(
  entries: AccessTransformerEntry[],
  index: JarIndex,
  opts: AccessValidateOptions,
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
    if (e.kind === "class") continue;

    const member = e.member!;
    const lookup = lookupMemberInHierarchy(index, ownerHit, member, e.descriptor);
    if (!lookup.found) {
      if (isObfuscatedName(member)) {
        errors.push({
          target: `${e.owner}#${member}${e.descriptor ? " " + e.descriptor : ""}`,
          issue: `成员不存在：${member}（可能是映射层不匹配）`,
          suggestion: mappingMismatchSuggestion(member, opts.mapping),
        });
      } else {
        const hint = e.descriptor
          ? `；若名字存在但 descriptor 不同，请核对 JNI descriptor`
          : "；若成员声明于更深的父类，请确认 jar 版本包含该父类";
        errors.push({
          target: `${e.owner}#${member}${e.descriptor ? " " + e.descriptor : ""}`,
          issue: `成员不存在于 ${ownerHit} 或其父类链`,
          suggestion: `检查成员名拼写与 MC 版本${hint}；映射名请用 convert_mapping 转换`,
        });
      }
      continue;
    }
    if (lookup.declaredIn && lookup.declaredIn !== ownerHit) {
      warnings.push(`成员 ${member} 声明于父类 ${lookup.declaredIn}（经 ${ownerHit} 继承可达，AT 生效）`);
    }
    if (e.member && e.descriptor && lookup.matches.length > 0) {
      // descriptor 精确匹配已由 lookup 保证；无需额外处理
    }
  }
}

function detectCrossFileConflicts(entries: AccessTransformerEntry[]): { conflicts: AccessConflict[]; warnings: string[] } {
  const conflicts: AccessConflict[] = [];
  const warnings: string[] = [];
  for (const list of accessTargetGroups(entries)) {
    if (list.length < 2) continue;
    const first = list[0];
    const target = first.kind === "class"
      ? first.owner
      : `${first.owner}#${first.member}${first.descriptor ?? ""}`;
    for (const e of list.slice(1)) {
      if (e.access === first.access) {
        warnings.push(`重复声明（相同 access）：${target}（第 ${e.lineNo} 行）`);
      } else if (e.access.replace(/-f$/, "") === first.access.replace(/-f$/, "")) {
        warnings.push(
          `同一目标 ${target} 可见性相同、仅 -f（去 final）不同：${first.access} vs ${e.access}（不视为冲突）`,
        );
      } else {
        conflicts.push({ target, accessA: first.access, accessB: e.access });
      }
    }
  }
  return { conflicts, warnings };
}

/** 单一 content 内的 `# ==== file: 名字 ====` 注释行作为文件边界，用于跨文件冲突检测。 */
export function splitAccessFiles(content: string): string[] {
  const segments = content.split(/^#\s*={3,}.*$/gm);
  return segments.map((s) => s.trim()).filter((s) => s.length > 0);
}
