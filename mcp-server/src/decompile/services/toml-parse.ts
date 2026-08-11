/**
 * 极简 TOML 解析（覆盖 mods.toml / neoforge.mods.toml 所需子集）。
 *
 * 支持：注释、顶层 key = value、[table] / [[array-of-tables]] 段；
 * 值仅需字符串/数字/布尔（引号串原样保留）。不做完整 TOML 规范。
 */

interface TomlRow {
  table: string;
  key: string;
  value: string;
}

function parseTomlValue(raw: string): string {
  const v = raw.trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    return v.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\");
  }
  return v;
}

function parseTomlRows(text: string): { sections: Map<string, TomlRow[]> } {
  const sections = new Map<string, TomlRow[]>();
  let current: string | null = null;

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    if (line.startsWith("[[")) {
      current = line.slice(2, line.length - 2).trim();
      sections.set(current, []);
      continue;
    }
    if (line.startsWith("[")) {
      current = line.slice(1, line.length - 1).trim();
      sections.set(current, []);
      continue;
    }
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const row: TomlRow = { table: current ?? "", key: line.slice(0, eq).trim(), value: parseTomlValue(line.slice(eq + 1)) };
    if (current && sections.has(current)) sections.get(current)!.push(row);
  }
  return { sections };
}

export interface ParsedModsToml {
  modLoader?: string;
  loaderVersion?: string;
  license?: string;
  mods: Array<{ modId: string; version?: string; displayName?: string; description?: string }>;
  dependencies: Array<{ id: string; owner: string; version?: string; versionRange?: string; optional?: boolean; side?: string }>;
}

/**
 * 解析 mods.toml：
 * - 顶层 modLoader / loaderVersion / license
 * - [[mods]] 段 → modId/version/displayName/description（modId 行开启新对象）
 * - [[dependencies.<owner>]] 段 → 依赖块；块内 modId 字段才是依赖的 id
 */
export function parseModsToml(text: string): ParsedModsToml {
  const { sections } = parseTomlRows(text);
  const result: ParsedModsToml = { mods: [], dependencies: [] };

  const topLevel = sections.get("") ?? [];
  for (const row of topLevel) {
    if (row.key === "modLoader") result.modLoader = row.value;
    else if (row.key === "loaderVersion") result.loaderVersion = row.value;
    else if (row.key === "license") result.license = row.value;
  }

  const modsRows = sections.get("mods") ?? [];
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
    const owner = tableName.slice("dependencies.".length);
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
