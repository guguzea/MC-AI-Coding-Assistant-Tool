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
  return /license\s*=/i.test(text) || /"license"\s*:/i.test(text);
}

function hasVersion(text: string): boolean {
  return /^\s*version\s*=/im.test(text) || /"version"\s*:/i.test(text);
}

function listReleaseJars(projectRoot: string): string[] {
  const dir = join(projectRoot, "build", "libs");
  if (!existsSync(dir)) return [];
  try {
    if (!statSync(dir).isDirectory()) return [];
  } catch {
    return [];
  }
  let names: string[] = [];
  try {
    names = readdirSync(dir);
  } catch {
    return [];
  }
  return names
    .filter((n) => n.endsWith(".jar"))
    .filter((n) => !/(-sources|-javadoc|-dev|-slim|-javadoc)\.jar$/i.test(n))
    .map((n) => `build/libs/${n}`);
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
    jars = listReleaseJars(resolved.root);
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
