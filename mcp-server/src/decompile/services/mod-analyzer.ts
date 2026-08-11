/**
 * 模组 jar 元数据分析（analyze_mod_jar / decompile_mod_jar 前置）。
 *
 * 读取本地 jar（zip central directory，零依赖）：
 * - fabric.mod.json → id/version/name/entrypoints/depends/mixins
 * - META-INF/mods.toml / neoforge.mods.toml → modLoader/[[mods]]/[[dependencies.<id>]]
 * - 根目录 *.mixins.json、*.accesswidener、*_at.cfg 引用
 *
 * 仅本地绝对路径；不下载、不写盘、不反编译。
 */

import { existsSync, readFileSync, statSync } from "fs";
import { isAbsolute } from "path";
import { actionable, type ActionEnvelope } from "../../utils/actionable.js";
import { readZip, listZipEntries } from "../zip-util.js";
import { parseModsToml } from "./toml-parse.js";

export interface ModDependency {
  id: string;
  version?: string;
  versionRange?: string;
  optional?: boolean;
  side?: string;
  /** mods.toml 依赖块所属 modId（[[dependencies.<owner>]]） */
  owner?: string;
}

export interface MixinRef {
  file: string;
  config: boolean;
}

export interface ModMetadata {
  found: boolean;
  jarPath: string;
  fileSize: number;
  entryCount: number;
  loaders: string[];
  modId?: string;
  modName?: string;
  modVersion?: string;
  description?: string;
  entrypoints?: Record<string, string[]>;
  mixins: MixinRef[];
  dependencies: ModDependency[];
  accessWideners: string[];
  accessTransformers: string[];
  warnings: string[];
  error?: string;
  action?: ActionEnvelope;
}

// ── jar 分析 ──────────────────────────────────────────────────────────────────

function invalidAction(message: string, nextSteps: string[]): ActionEnvelope {
  return actionable("INVALID_INPUT", message, nextSteps);
}

function notFoundAction(message: string, nextSteps: string[]): ActionEnvelope {
  return actionable("NOT_FOUND", message, nextSteps);
}

function emptyMeta(jarPath: string): ModMetadata {
  return {
    found: false,
    jarPath,
    fileSize: 0,
    entryCount: 0,
    loaders: [],
    mixins: [],
    dependencies: [],
    accessWideners: [],
    accessTransformers: [],
    warnings: [],
  };
}

export interface AnalyzeResult extends ModMetadata {}

export function analyzeModJar(jarPath: string): AnalyzeResult {
  if (!jarPath) {
    return {
      ...emptyMeta(jarPath),
      action: invalidAction("jarPath 不能为空", ["传入本地 jar 的绝对路径"]),
    };
  }
  if (!isAbsolute(jarPath)) {
    return {
      ...emptyMeta(jarPath),
      action: invalidAction(
        `jarPath 必须是本地绝对路径（收到「${jarPath}」）`,
        ["传绝对路径，例如 H:/mods/my-mod.jar", "v1 不支持 URL 下载"],
      ),
    };
  }
  if (!existsSync(jarPath)) {
    return {
      ...emptyMeta(jarPath),
      action: notFoundAction(`jar 不存在: ${jarPath}`, ["核对路径后重试"]),
    };
  }

  let buffer: Buffer;
  try {
    buffer = readFileSync(jarPath);
  } catch (err) {
    return {
      ...emptyMeta(jarPath),
      action: notFoundAction(`jar 读取失败: ${(err as Error).message}`, ["确认文件可读（非目录/被占用）"]),
    };
  }

  const meta: AnalyzeResult = {
    ...emptyMeta(jarPath),
    found: true,
    fileSize: statSync(jarPath).size,
  };

  let entries: Map<string, Buffer>;
  try {
    entries = readZip(buffer);
  } catch (err) {
    return {
      ...meta,
      found: false,
      action: invalidAction(`不是有效的 zip/jar: ${(err as Error).message}`, ["确认文件是完整未损坏的 mod jar"]),
    };
  }
  meta.entryCount = entries.size;

  // ── fabric.mod.json ─────────────────────────────────────────────────────────
  const fabricJson = entries.get("fabric.mod.json");
  if (fabricJson) {
    try {
      const fabric = JSON.parse(fabricJson.toString("utf8")) as Record<string, unknown>;
      meta.loaders.push("fabric");
      if (typeof fabric.id === "string") meta.modId = fabric.id;
      if (typeof fabric.version === "string") meta.modVersion = fabric.version;
      if (typeof fabric.name === "string") meta.modName = fabric.name;
      if (typeof fabric.description === "string") meta.description = fabric.description;

      const entrypoints = fabric.entrypoints;
      if (entrypoints && typeof entrypoints === "object") {
        const eps: Record<string, string[]> = {};
        for (const [side, list] of Object.entries(entrypoints as Record<string, unknown>)) {
          if (Array.isArray(list)) {
            eps[side] = list.filter((x): x is string => typeof x === "string");
          }
        }
        meta.entrypoints = eps;
      }

      const depends = fabric.depends;
      if (depends && typeof depends === "object") {
        for (const [id, range] of Object.entries(depends as Record<string, unknown>)) {
          if (typeof id === "string") {
            meta.dependencies.push({
              id,
              versionRange: typeof range === "string" ? range : undefined,
              optional: typeof range === "object" && range !== null && (range as { optional?: boolean }).optional === true,
            });
          }
        }
      }

      const mixins = fabric.mixins;
      if (Array.isArray(mixins)) {
        for (const m of mixins) {
          if (typeof m === "string") meta.mixins.push({ file: m, config: false });
          else if (m && typeof m === "object") {
            const file = (m as { config?: string }).config;
            if (typeof file === "string") meta.mixins.push({ file, config: true });
          }
        }
      }
    } catch (err) {
      meta.warnings.push(`fabric.mod.json 解析失败: ${(err as Error).message}`);
    }
  }

  // ── META-INF/mods.toml / neoforge.mods.toml ────────────────────────────────
  const neoforgeToml = entries.get("META-INF/neoforge.mods.toml");
  const forgeToml = entries.get("META-INF/mods.toml");
  const tomlSource = neoforgeToml ?? forgeToml;
  if (tomlSource) {
    try {
      const toml = parseModsToml(tomlSource.toString("utf8"));
      meta.loaders.push(neoforgeToml ? "neoforge" : "forge");
      if (!meta.modId && toml.mods[0]?.modId) meta.modId = toml.mods[0].modId;
      if (!meta.modVersion && toml.mods[0]?.version) meta.modVersion = toml.mods[0].version;
      if (!meta.modName && toml.mods[0]?.displayName) meta.modName = toml.mods[0].displayName;
      if (!meta.description && toml.mods[0]?.description) meta.description = toml.mods[0].description;
      for (const dep of toml.dependencies) meta.dependencies.push(dep);
    } catch (err) {
      meta.warnings.push(`${neoforgeToml ? "neoforge.mods.toml" : "mods.toml"} 解析失败: ${(err as Error).message}`);
    }
  }

  // ── 根级 mixins.json / accesswidener / *_at.cfg ────────────────────────────
  for (const name of entries.keys()) {
    if (name.endsWith(".mixins.json") && !name.includes("/")) {
      if (!meta.mixins.some((m) => m.file === name)) meta.mixins.push({ file: name, config: true });
    } else if (name.endsWith(".accesswidener") && !name.includes("/")) {
      meta.accessWideners.push(name);
    } else if (/_at\.cfg$/.test(name) && !name.includes("/")) {
      meta.accessTransformers.push(name);
    }
  }

  if (meta.loaders.length === 0) {
    meta.warnings.push("未识别 loader（无 fabric.mod.json / mods.toml / neoforge.mods.toml），可能是库 jar 或资源包");
  }
  if (meta.loaders.length > 1) {
    meta.warnings.push(`同时存在多个 loader 元数据: ${meta.loaders.join(", ")}`);
  }

  return meta;
}

/** 仅条目名扫描版（快速判断 jar 类型，不展开数据） */
export function listJarEntries(jarPath: string): string[] {
  if (!existsSync(jarPath)) return [];
  return listZipEntries(readFileSync(jarPath));
}
