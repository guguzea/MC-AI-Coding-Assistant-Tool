/**
 * 发布前机器检查（不上传、不调 Curse/Modrinth API）。
 */
import { existsSync, readdirSync, readFileSync, statSync } from "fs";
import { join } from "path";
import { loadModProject, preferExplicit, resolveProjectDir } from "../utils/project-files.js";
import { loadPublishingChecklist } from "./publishing-checklist.js";

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
  publishing?: {
    source: string;
    available: boolean;
    fields: string[];
    missing: string[];
    manual: string[];
    reason?: string;
  };
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

interface ProvidedMetadata {
  name: string;
  text: string;
}

/** publishing.md 用文件名点明要求；按后缀匹配本工程实有元数据（neoforge.mods.toml 也算 mods.toml）。 */
function metadataMatching(all: ProvidedMetadata[], fileToken: string): ProvidedMetadata[] {
  return all.filter((m) => m.name.endsWith(fileToken));
}

function hasField(meta: ProvidedMetadata, field: string): boolean {
  const source = meta.name.endsWith(".json")
    ? `"${field}"\\s*:`
    : `^\\s*${field}\\s*=`;
  return new RegExp(source, meta.name.endsWith(".json") ? "" : "im").test(meta.text);
}

/** 清单要求 logoFile 声明后文件可被加载：只核声明值在资源根是否存在。 */
function checkLogoFile(projectRoot: string, all: ProvidedMetadata[]): Array<{ missing: string; warning: string }> {
  const out: Array<{ missing: string; warning: string }> = [];
  for (const meta of all) {
    if (meta.name.endsWith(".json")) continue;
    for (const m of meta.text.matchAll(/^\s*logoFile\s*=\s*"([^"]+)"/gim)) {
      const declared = m[1].replace(/^\/+/, "");
      if (!declared || declared.includes("..")) continue;
      const candidates = [
        join(projectRoot, "src", "main", "resources", declared),
        join(projectRoot, declared),
      ];
      if (!candidates.some((p) => existsSync(p))) {
        out.push({
          missing: `${meta.name}:logoFile=${declared}`,
          warning: `publishing.md「资源」要求 logoFile 可被加载：${meta.name} 声明 ${declared}，在 src/main/resources 与工程根都没找到`,
        });
      }
    }
  }
  return out;
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

  let projectRoot: string | undefined;
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
    projectRoot = resolved.root;
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

  const provided: ProvidedMetadata[] = [
    { name: "mods.toml", text: modsToml ?? "" },
    { name: "neoforge.mods.toml", text: neoModsToml ?? "" },
    { name: "fabric.mod.json", text: fabricModJson ?? "" },
    { name: "quilt.mod.json", text: quiltModJson ?? "" },
  ].filter((m) => m.text.trim());

  const meta = provided.map((m) => m.text).join("\n");
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

  const checklist = loadPublishingChecklist();
  const fields: string[] = [];
  const missing: string[] = [];
  if (checklist.available) {
    for (const req of checklist.requirements) {
      const targets = metadataMatching(provided, req.file);
      if (targets.length === 0) continue;
      for (const field of req.fields) {
        if (!fields.includes(field)) fields.push(field);
        for (const target of targets) {
          if (hasField(target, field)) continue;
          missing.push(`${target.name}:${field}`);
          warnings.push(`publishing.md「元数据」要求 ${target.name} 有 ${field}：未看到`);
        }
      }
    }
    if (checklist.logoFileRule) {
      if (!fields.includes("logoFile")) fields.push("logoFile");
      if (projectRoot) {
        for (const hit of checkLogoFile(projectRoot, provided)) {
          missing.push(hit.missing);
          warnings.push(hit.warning);
        }
      }
    }
    checks.push(`community_knowledge publishing.md 清单（${fields.length} 项可机器核对）`);
  } else {
    warnings.push(
      `未取到发布清单字段要求（${checklist.source}：${checklist.reason ?? "未知原因"}）；本次只做了 license/version/build/libs 检查`,
    );
  }

  warnings.push("本工具不上传、不调用 CurseForge/Modrinth API");
  const ready = errors.length === 0;
  return {
    ok: ready,
    ready,
    errors,
    warnings,
    checks,
    jars: jars.length ? jars : undefined,
    publishing: {
      source: checklist.source,
      available: checklist.available,
      fields,
      missing,
      manual: checklist.manual,
      ...(checklist.reason ? { reason: checklist.reason } : {}),
    },
  };
}
