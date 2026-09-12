/**
 * 极简 TOML 解析（覆盖 mods.toml / neoforge.mods.toml 所需子集）。
 *
 * 支持：注释、顶层 key = value、[table] / [[array-of-tables]] 段；
 * 值仅需字符串/数字/布尔（引号串原样保留）+ 多行字符串 `''' … '''` / `""" … """`（含同行闭合）。不做完整 TOML 规范。
 */

interface TomlRow {
  table: string;
  key: string;
  value: string;
}

/** Strip `#` comments; do not cut `#` inside quoted strings (`"1.0#x"`). */
export function stripTomlCommentOutsideQuotes(raw: string): string {
  let inSingle = false;
  let inDouble = false;
  let escaped = false;
  for (let i = 0; i < raw.length; i++) {
    const c = raw[i];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (inDouble && c === "\\") {
      escaped = true;
      continue;
    }
    if (!inSingle && c === '"') {
      inDouble = !inDouble;
      continue;
    }
    if (!inDouble && c === "'") {
      inSingle = !inSingle;
      continue;
    }
    if (!inSingle && !inDouble && c === "#") return raw.slice(0, i);
  }
  return raw;
}

/**
 * TOML 基础字符串转义解码（D-23）。
 *
 * 旧实现是「两遍正则」：先折叠成对反斜杠，再把 \" 换成引号。与下面的单遍扫描
 * 用 node 逐序列对拍过（只列发散项）：
 * 1. \n / \t / \uXXXX 完全不解码——mods.toml 的 description 常写 \n，
 *    旧实现把字面「反斜杠 n」直接送进工具输出；
 * 2. 第二遍会吃掉第一遍刚产出的反斜杠：输入 a\\" 旧得 a"、新得 a\"；
 *    输入 \\"b 旧得 "b、新得 \"b。
 *    而 \\→\、\"→"、\\\"→\" 三类两遍与单遍结果一致（已对拍），
 *    发散只发生在「成对反斜杠后紧跟未转义引号」这一形态。
 * 故改成单趟扫描：一次读一个转义序列，未知转义原样保留，绝不回头重解。
 */
export function unescapeTomlBasicString(src: string): string {
  let out = "";
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (c !== "\\") {
      out += c;
      continue;
    }
    const n = src[i + 1];
    if (n === undefined) {
      out += "\\"; // 末尾孤立反斜杠：原样保留，不吞字符
      break;
    }
    switch (n) {
      case "b": out += "\b"; i++; continue;
      case "t": out += "\t"; i++; continue;
      case "n": out += "\n"; i++; continue;
      case "f": out += "\f"; i++; continue;
      case "r": out += "\r"; i++; continue;
      case '"': out += '"'; i++; continue;
      case "\\": out += "\\"; i++; continue;
      case "u":
      case "U": {
        const width = n === "u" ? 4 : 8;
        const hex = src.slice(i + 2, i + 2 + width);
        if (hex.length !== width || !/^[0-9a-fA-F]+$/.test(hex)) {
          out += "\\" + n; // 位数不足/非十六进制：不是合法转义，原样保留
          i++;
          continue;
        }
        const cp = parseInt(hex, 16);
        const valid = n === "u" ? cp <= 0xffff : cp <= 0x10ffff;
        if (!valid) {
          out += "\\" + n + hex;
          i += 1 + width;
          continue;
        }
        out += String.fromCodePoint(cp);
        i += 1 + width;
        continue;
      }
      default:
        out += "\\" + n; // 未知转义不猜语义，原样保留
        i++;
    }
  }
  return out;
}

export function parseTomlValue(raw: string): string {
  const v = raw.trim();
  if (v.startsWith("{") || v.startsWith("[")) {
    throw new Error("TOML_INLINE_UNSUPPORTED");
  }
  if (v.startsWith("'") && v.endsWith("'") && v.length >= 2) {
    return v.slice(1, -1);
  }
  if (v.startsWith('"') && v.endsWith('"') && v.length >= 2) {
    return unescapeTomlBasicString(v.slice(1, -1));
  }
  return v;
}

const MULTILINE_OPEN = /^\s*('''|""")/;

/** 多行基本字符串（"""）：先剥「行尾反斜杠续行」，再按 TOML 转义解码；字面字符串（'''）不解释转义。 */
function finalizeMultilineTomlValue(delim: string, content: string): string {
  if (delim === "'''") return content;
  return unescapeTomlBasicString(content.replace(/\\\n[ \t]*/g, ""));
}

/**
 * 从 `=` 右侧原始文本起读取多行字符串值。
 *
 * 返回 null = 该值不是多行字面量（交回单行路径）。未闭合一律抛错，不静默跳过。
 */
function readMultilineTomlValue(
  rawTail: string,
  lines: string[],
  index: number
): { value: string; nextIndex: number } | null {
  const open = MULTILINE_OPEN.exec(rawTail);
  if (!open) return null;
  const delim = open[1];
  const afterOpen = rawTail.slice(open[0].length);

  const closeSameLine = afterOpen.indexOf(delim);
  if (closeSameLine !== -1) {
    return {
      value: finalizeMultilineTomlValue(delim, afterOpen.slice(0, closeSameLine)),
      nextIndex: index,
    };
  }

  // 定界符后紧跟的首个换行不属于内容；同一行定界符后已有文字时该文字是内容起点。
  const parts: string[] = afterOpen.trim() === "" ? [] : [afterOpen];
  let closedAt = -1;
  for (let j = index + 1; j < lines.length; j++) {
    const closeAt = lines[j].indexOf(delim);
    if (closeAt === -1) {
      parts.push(lines[j]);
      continue;
    }
    parts.push(lines[j].slice(0, closeAt));
    closedAt = j;
    break;
  }
  if (closedAt === -1) throw new Error("TOML_MULTILINE_UNTERMINATED");
  return {
    value: finalizeMultilineTomlValue(delim, parts.join("\n")),
    nextIndex: closedAt,
  };
}

function parseTomlRows(text: string): { sections: Map<string, TomlRow[]>; inlineSkipped: string[] } {
  const sections = new Map<string, TomlRow[]>();
  const inlineSkipped: string[] = [];
  let current: string | null = null;
  const lines = text.split(/\r?\n/);

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = stripTomlCommentOutsideQuotes(rawLine).trim();
    if (!line || line.startsWith("#")) continue;
    if (line.startsWith("[[")) {
      const base = line.slice(2, line.length - 2).trim();
      let key = base;
      let n = 0;
      while (sections.has(key)) {
        n += 1;
        key = `${base}#${n}`;
      }
      current = key;
      sections.set(current, []);
      continue;
    }
    if (line.startsWith("[")) {
      current = line.slice(1, line.length - 1).trim();
      sections.set(current, []);
      continue;
    }
    const eq = line.indexOf("=");
    if (eq === -1) {
      if (line.includes('"""') || line.includes("'''")) throw new Error("TOML_MULTILINE_MALFORMED");
      continue;
    }
    // `=` 右侧取原始文本：多行字面量里的 `#` 是内容，不是注释。
    const rawEq = rawLine.indexOf("=", rawLine.length - rawLine.trimStart().length);
    const multi =
      rawEq === -1
        ? null
        : readMultilineTomlValue(rawLine.slice(rawEq + 1), lines, i);
    let value: string;
    if (multi) {
      i = multi.nextIndex;
      value = multi.value;
    } else {
      if (line.includes('"""') || line.includes("'''")) throw new Error("TOML_MULTILINE_MALFORMED");
      const rawVal = line.slice(eq + 1);
      const valueSrc = stripTomlCommentOutsideQuotes(rawVal);
      try {
        value = parseTomlValue(valueSrc);
      } catch (err) {
        if ((err as Error).message === "TOML_INLINE_UNSUPPORTED") {
          inlineSkipped.push(`${current ?? ""}${current ? "." : ""}${line.slice(0, eq).trim()}`);
          continue;
        }
        throw err;
      }
    }
    const row: TomlRow = { table: current ?? "", key: line.slice(0, eq).trim(), value };
    const tableKey = current ?? "";
    if (!sections.has(tableKey)) sections.set(tableKey, []);
    sections.get(tableKey)!.push(row);
  }
  return { sections, inlineSkipped };
}

export interface ParsedModsToml {
  modLoader?: string;
  loaderVersion?: string;
  license?: string;
  mods: Array<{ modId: string; version?: string; displayName?: string; description?: string }>;
  dependencies: Array<{ id: string; owner: string; version?: string; versionRange?: string; optional?: boolean; side?: string }>;
  /** 解析器不支持的语法（内联表 `k = { ... }`）被整行跳过的键名：不为空必须向上报警，否则依赖块静默蒸发。 */
  inlineSkipped: string[];
}

/**
 * 解析 mods.toml：
 * - 顶层 modLoader / loaderVersion / license
 * - [[mods]] 段 → modId/version/displayName/description（modId 行开启新对象）
 * - [[dependencies.<owner>]] 段 → 依赖块；块内 modId 字段才是依赖的 id
 */
export function parseModsToml(text: string): ParsedModsToml {
  const { sections, inlineSkipped } = parseTomlRows(text);
  const result: ParsedModsToml = { mods: [], dependencies: [], inlineSkipped };

  const topLevel = sections.get("") ?? [];
  for (const row of topLevel) {
    if (row.key === "modLoader") result.modLoader = row.value;
    else if (row.key === "loaderVersion") result.loaderVersion = row.value;
    else if (row.key === "license") result.license = row.value;
  }

  const modsRows: TomlRow[] = [];
  for (const [tableName, tableRows] of sections) {
    if (/^mods(#\d+)?$/.test(tableName)) modsRows.push(...tableRows);
  }
  for (const row of modsRows) {
    if (row.key === "modId") {
      result.mods.push({ modId: row.value });
    } else if (result.mods.length > 0) {
      const last = result.mods[result.mods.length - 1];
      if (row.key === "version") last.version = row.value;
      else if (row.key === "displayName") last.displayName = row.value;
      else if (row.key === "description") last.description = row.value;
    }
  }

  for (const [tableName, tableRows] of sections) {
    if (!tableName.startsWith("dependencies.")) continue;
    const owner = tableName.replace(/#\d+$/, "").slice("dependencies.".length);
    const dep: ParsedModsToml["dependencies"][number] = { id: owner, owner };
    for (const row of tableRows) {
      if (row.key === "modId") dep.id = row.value; // 依赖 id 在块内 modId 字段
      else if (row.key === "versionRange") dep.versionRange = row.value;
      else if (row.key === "version") dep.version = row.value;
      else if (row.key === "mandatory") dep.optional = row.value !== "true";
      else if (row.key === "side") dep.side = row.value;
    }
    result.dependencies.push(dep);
  }

  return result;
}
