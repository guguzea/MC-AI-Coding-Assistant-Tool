/**
 * 发布前机器检查（不上传、不调 Curse/Modrinth API）。
 */
import { existsSync, readdirSync, readFileSync, statSync } from "fs";
import { join, relative, sep } from "path";
import { actionable } from "../utils/actionable.js";
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
  /** 硬项（元数据存在、version 字段、可解析的 projectPath）通过。 */
  ok: boolean;
  /**
   * 可发布就绪：`ok` **且**（当给了 projectPath 时）扫描目录里有像正式包的 jar。
   * 与 `ok` 的差异只在「硬项都过但没扫到正式 jar」这一种状态（A19-S3-8 修复：
   * 此前 ok 与 ready 是同一表达式的两个字段）。
   */
  ready: boolean;
  errors: string[];
  warnings: string[];
  checks: string[];
  jars?: string[];
  /** A19-S3-4（I-3）：早退路径也带结构化 action，不再只给裸 errors 字符串。 */
  action?: ReturnType<typeof actionable>;
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

/**
 * C-32：产出 jar 目录的**唯一来源**。显示串一律由实际扫描的 dir 反推，
 * 不再在 return / checks / warnings 里各写一遍字面量 "build/libs"。
 */
const RELEASE_JAR_SEGMENTS = ["build", "libs"];
const RELEASE_JAR_DISPLAY_DEFAULT = RELEASE_JAR_SEGMENTS.join("/");

function toPosix(p: string): string {
  return p.split(sep).join("/");
}

/** 返回实际扫描目录与其相对工程根的 posix 显示串（相对化失败时退回段拼接）。 */
function releaseJarDirOf(projectRoot: string): { dir: string; display: string } {
  const dir = join(projectRoot, ...RELEASE_JAR_SEGMENTS);
  let rel = "";
  try {
    rel = relative(projectRoot, dir);
  } catch {
    rel = "";
  }
  const display = rel && !rel.startsWith("..") ? toPosix(rel) : RELEASE_JAR_DISPLAY_DEFAULT;
  return { dir, display };
}

function listReleaseJars(projectRoot: string): {
  jars: string[];
  warnings: string[];
  dirDisplay: string;
} {
  const { dir, display } = releaseJarDirOf(projectRoot);
  const warnings: string[] = [];
  if (!existsSync(dir)) return { jars: [], warnings, dirDisplay: display };
  try {
    if (!statSync(dir).isDirectory()) return { jars: [], warnings, dirDisplay: display };
  } catch {
    return { jars: [], warnings, dirDisplay: display };
  }
  let names: string[] = [];
  try {
    names = readdirSync(dir);
  } catch {
    return { jars: [], warnings, dirDisplay: display };
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
  return { jars: kept.map((n) => `${display}/${n}`), warnings, dirDisplay: display };
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

/**
 * W2-2④（2026-09-20）：`publishing.md` 的人工清单里混着平台专属项 ——
 * Forge 族：`[[dependencies.*]]` 声明 / `reobfJar` / 「`logoFile` 若在 toml 声明」；
 * Fabric/Quilt 族：「依赖声明（Fabric/Quilt）：`depends` / `suggests`」。
 * 按工程实际元数据面过滤，避免给 Fabric 工程念 Forge 清单（反之亦然）。
 * 中性项（产物路径 / changelog / 自测 / 资源尺寸）两边都保留。
 */
const MANUAL_FORGE_ONLY = /\[\[dependencies|reobfJar|reobf 后|mods\.toml|neoforge\.mods\.toml|\btoml\b/i;
const MANUAL_JSON_ONLY = /depends|suggests|fabric\.mod\.json|quilt\.mod\.json|Fabric\/Quilt/i;

function filterManualByPlatform(
  manual: string[],
  hasToml: boolean,
  hasJson: boolean,
): { kept: string[]; dropped: string[] } {
  if (hasToml && hasJson) return { kept: manual, dropped: [] };
  const dropped: string[] = [];
  const kept = manual.filter((m) => {
    const forgeOnly = MANUAL_FORGE_ONLY.test(m) && !MANUAL_JSON_ONLY.test(m);
    const jsonOnly = MANUAL_JSON_ONLY.test(m) && !MANUAL_FORGE_ONLY.test(m);
    if (hasJson && !hasToml && forgeOnly) {
      dropped.push(m);
      return false;
    }
    if (hasToml && !hasJson && jsonOnly) {
      dropped.push(m);
      return false;
    }
    return true;
  });
  return { kept, dropped };
}

export function checkPublishReady(query: PublishReadyQuery): PublishReadyResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let jarDirDisplay = RELEASE_JAR_DISPLAY_DEFAULT;
  const checks = ["license", "version", `${jarDirDisplay} 正式 jar`];
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
        // A19-S3-4（I-3）：早退必须带结构化 action，不再是裸 errors 字符串
        action: resolved.action,
      };
    }
    projectRoot = resolved.root;
    const loaded = loadModProject(resolved.root);
    modsToml = preferExplicit(modsToml, loaded.modsToml);
    fabricModJson = preferExplicit(fabricModJson, loaded.fabricModJson);
    quiltModJson = preferExplicit(quiltModJson, loaded.quiltModJson);
    neoModsToml = preferExplicit(neoModsToml, loaded.neoModsToml);
    const listed = listReleaseJars(resolved.root);
    jarDirDisplay = listed.dirDisplay;
    checks[2] = `${jarDirDisplay} 正式 jar`;
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

  if (provided.length === 0) {
    errors.push("缺少 mods.toml / neoforge.mods.toml / fabric.mod.json / quilt.mod.json");
  } else {
    // AA 修复（sweep81 A19-S2-6）：**逐文件**核，替代旧的 join("\n") 后统一查 ——
    // 旧实现「任一文件有 license/version」就会替其余文件判过（跨文件并集误判）。
    const missingVersion = provided.filter((m) => !hasVersion(m.text)).map((m) => m.name);
    if (missingVersion.length) {
      errors.push(`元数据未看到 version 字段：${missingVersion.join(", ")}`);
    }
    const missingLicense = provided.filter((m) => !hasLicense(m.text)).map((m) => m.name);
    if (missingLicense.length) {
      warnings.push(
        `元数据未看到 license 字段：${missingLicense.join(", ")}；对照 community_knowledge/authored/publishing.md`,
      );
    }
  }

  if (query.projectPath) {
    if (jars.length === 0) {
      warnings.push(`未在 ${jarDirDisplay} 找到像正式包的 jar（排除 -sources/-javadoc/-dev）。请先 gradlew build，不要上传开发 jar`);
    }
  } else {
    warnings.push(`未传 projectPath，跳过 ${jarDirDisplay} 扫描`);
  }

  const checklist = loadPublishingChecklist();
  const fields: string[] = [];
  const missing: string[] = [];
  let manual: string[] = checklist.manual;
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
    // W2-2③（2026-09-20）：logoFile 只能从 toml 族声明里核（checkLogoFile 对 `.json` 直接 continue）。
    // 纯 json 工程把 logoFile 计进 fields 属**幻影计数** —— 声称「已机核」，实际无从核。
    const hasTomlMeta = provided.some((m) => !m.name.endsWith(".json"));
    if (checklist.logoFileRule && hasTomlMeta) {
      if (!fields.includes("logoFile")) fields.push("logoFile");
      if (projectRoot) {
        for (const hit of checkLogoFile(projectRoot, provided)) {
          missing.push(hit.missing);
          warnings.push(hit.warning);
        }
      }
    }
    // N8（2026-09-19 裁定「修复完整深层」）：publishing.md 已点名 fabric.mod.json / quilt.mod.json 的
    // 机核字段 ⇒ 纯 Fabric/Quilt 工程不再 0 项被机核。守卫保留：若哪天清单又只剩 mods.toml 族
    // （文档被改回 / 字段行被删），这里必须**说破**「json 元数据 0 项被机核 + manual 含 Forge 专属文案」，
    // 不得静默 —— 判据是「requirements 里没有任何 .json 目标」，与提供的元数据无关。
    const jsonOnly = provided.length > 0 && provided.every((m) => m.name.endsWith(".json"));
    const jsonReqs = checklist.requirements.filter((r) => r.file.endsWith(".json"));
    if (jsonOnly && jsonReqs.length === 0) {
      warnings.push(
        "publishing.md 清单的可机核字段只点 mods.toml 族 ⇒ 本工程（纯 Fabric/Quilt 元数据）0 项被机核；" +
          "人工清单已按平台过滤，但机核字段面的缺口仍在 —— 发布前按平台自行核对，不要把这份清单当全平台清单",
      );
    }
    // W2-2④（2026-09-20）：manual[] 按工程元数据面过滤，并把过滤条数说破（不静默）。
    const hasJsonMeta = provided.some((m) => m.name.endsWith(".json"));
    const filteredManual = filterManualByPlatform(checklist.manual, hasTomlMeta, hasJsonMeta);
    manual = filteredManual.kept;
    if (filteredManual.dropped.length > 0) {
      warnings.push(
        `publishing.md 人工清单已按平台过滤 ${filteredManual.dropped.length} 条` +
          `（本工程元数据面 = ${hasJsonMeta ? "json 族" : "toml 族"}，被过滤项属另一平台；需要全平台口径请直接读 publishing.md）`,
      );
    }
    checks.push(`community_knowledge publishing.md 清单（${fields.length} 项可机器核对）`);
  } else {
    warnings.push(
      `未取到发布清单字段要求（${checklist.source}：${checklist.reason ?? "未知原因"}）；本次只做了 license/version/${jarDirDisplay} 检查`,
    );
  }

  warnings.push("本工具不上传、不调用 CurseForge/Modrinth API");
  const ok = errors.length === 0;
  // AA 修复（sweep81 A19-S3-8）：ok 与 ready 曾恒为同一表达式。拆分语义：
  //   ok    = 硬项通过（元数据存在 / version 字段 / projectPath 可解析）；
  //   ready = 可发布就绪 —— ok 且（给了 projectPath 时）扫到了像正式包的 jar。
  // 未给 projectPath 时产物未经检查（已有「跳过扫描」warning），ready 与 ok 同判。
  const ready = ok && (!query.projectPath || jars.length > 0);
  return {
    ok,
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
      manual,
      ...(checklist.reason ? { reason: checklist.reason } : {}),
    },
  };
}
