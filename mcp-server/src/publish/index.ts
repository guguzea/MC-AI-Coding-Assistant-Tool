/**
 * 发布前机器检查（不上传、不调 Curse/Modrinth API）。
 */
import { existsSync, readdirSync, readFileSync, statSync } from "fs";
import { join } from "path";
import { loadModProject, preferExplicit, resolveProjectDir } from "../utils/project-files.js";

export interface PublishReadyQuery {
  projectPath?: string;
  modsToml?: string;
  fabricModJson?: string;
  quiltModJson?: string;
  neoModsToml?: string;
}

export interface PublishReadyResult {
  ok: boolean;
  ready: boolean;
  errors: string[];
  warnings: string[];
  checks: string[];
  jars?: string[];
}

function hasLicense(text: string): boolean {
  const lines = text.split(/\r?\n/).filter((l) => !/^\s*[#;]/.test(l) && !/^\s*\/\//.test(l));
  return lines.some((l) => /license\s*=/i.test(l) || /"license"\s*:/i.test(l));
}

function hasVersion(text: string): boolean {
  return /^\s*version\s*=/im.test(text) || /"version"\s*:/i.test(text);
}

function listReleaseJars(projectRoot: string): { jars: string[]; warnings: string[] } {
  const dir = join(projectRoot, "build", "libs");
  const warnings: string[] = [];
  if (!existsSync(dir)) return { jars: [], warnings };
  try {
    if (!statSync(dir).isDirectory()) return { jars: [], warnings };
  } catch {
    return { jars: [], warnings };
  }
  let names: string[] = [];
  try {
    names = readdirSync(dir);
  } catch {
    return { jars: [], warnings };
  }
  const candidates = names
    .filter((n) => n.endsWith(".jar"))
    .filter((n) => !/(-sources|-javadoc|-dev|-slim|-changelog|-obf)\.jar$/i.test(n));
  const regular = candidates.filter((n) => !/-all\.jar$/i.test(n));
  const allJars = candidates.filter((n) => /-all\.jar$/i.test(n));
  const regularSet = new Set(regular);
  const kept = [...regular];
  let onlyAll = false;
  for (const n of allJars) {
    const stem = n.replace(/-all\.jar$/i, ".jar");
    if (regularSet.has(stem)) continue;
    kept.push(n);
    onlyAll = true;
  }
  if (onlyAll) {
    warnings.push("仅找到 *-all.jar（可能是 shadow fat），发布前请确认不是把依赖打进包");
  }
  return { jars: kept.map((n) => `build/libs/${n}`), warnings };
}

export function checkPublishReady(query: PublishReadyQuery): PublishReadyResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const checks = ["license", "version", "build/libs 正式 jar"];
  let modsToml = query.modsToml;
  let fabricModJson = query.fabricModJson;
  let quiltModJson = query.quiltModJson;
  let neoModsToml = query.neoModsToml;
  let jars: string[] = [];

  if (query.projectPath) {
    const resolved = resolveProjectDir(query.projectPath);
    if (!resolved.ok) {
      return {
        ok: false,
        ready: false,
        errors: [resolved.action.message],
        warnings: [],
        checks,
      };
    }
    const loaded = loadModProject(resolved.root);
    modsToml = preferExplicit(modsToml, loaded.modsToml);
    fabricModJson = preferExplicit(fabricModJson, loaded.fabricModJson);
    quiltModJson = preferExplicit(quiltModJson, loaded.quiltModJson);
    neoModsToml = preferExplicit(neoModsToml, loaded.neoModsToml);
    const listed = listReleaseJars(resolved.root);
    jars = listed.jars;
    warnings.push(...listed.warnings);
    const licenseFile = ["LICENSE", "LICENSE.txt", "LICENSE.md"].some((n) => existsSync(join(resolved.root, n)));
    if (licenseFile) checks.push("根目录 LICENSE 文件");
  }

  const meta = [modsToml, neoModsToml, fabricModJson, quiltModJson].filter((s) => s?.trim()).join("\n");
  if (!meta.trim()) {
    errors.push("缺少 mods.toml / neoforge.mods.toml / fabric.mod.json / quilt.mod.json");
  } else {
    if (!hasLicense(meta)) {
      warnings.push("元数据未看到 license 字段；对照 community_knowledge/authored/publishing.md");
    }
    if (!hasVersion(meta)) {
      errors.push("元数据未看到 version 字段");
    }
  }

  if (query.projectPath) {
    if (jars.length === 0) {
      warnings.push("未在 build/libs 找到像正式包的 jar（排除 -sources/-javadoc/-dev）。请先 gradlew build，不要上传开发 jar");
    }
  } else {
    warnings.push("未传 projectPath，跳过 build/libs 扫描");
  }

  warnings.push("本工具不上传、不调用 CurseForge/Modrinth API");
  const ready = errors.length === 0;
  return { ok: ready, ready, errors, warnings, checks, jars: jars.length ? jars : undefined };
}
