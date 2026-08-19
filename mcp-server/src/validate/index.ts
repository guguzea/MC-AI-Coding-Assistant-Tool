/**
 * 项目校验模块
 *
 * 对应已 deprecated 的 Phase 1.5 Python CLI（forge/<ver>/scaffold/cli/validate_project.py）。
 * 请改用本模块或 node mcp-server/dist/cli.js validate_project --project .
 *
 * 校验规则：
 * A. DeferredRegister 注册完整性（ERROR）
 * B. @Mod 入口类检查（ERROR）
 * C. BlockEntity 注册顺序（WARN）
 * D. BlockItem 注册完整性（WARN）
 * E. @ObjectHolder 注解检查（INFO/WARN）
 * F. Mixin 配置检查（用户提供 mixins.json 时，WARN）
 * G. 重复注册名检测（WARN）
 * H. DeferredRegister 自动检测
 */

import {
  detectProjectLoaders,
  javaBlobFromFiles,
  type CheckDependenciesExtras,
  type DetectedLoader,
} from "../diagnostics/index.js";
import { analyzeCrash, type CrashResult } from "../crash/index.js";
import type { ActionEnvelope } from "../utils/actionable.js";
import { actionable, ActionCodes } from "../utils/actionable.js";
import {
  loadModProject,
  mergeJavaFiles,
  preferExplicit,
  resolveProjectDir,
} from "../utils/project-files.js";
import { detectMinecraftVersion } from "../utils/minecraft-version.js";
import {
  datapackRecipeWarnings,
  validateFabricOrQuilt,
  validateNeoForge,
} from "./loaders.js";

export interface ValidateQuery {
  /** mods.toml 文件内容 */
  modsToml?: string;
  neoModsToml?: string;
  fabricModJson?: string;
  quiltModJson?: string;
  /** Java 源文件列表，建议包含所有注册相关类 */
  javaFiles?: Array<{ path: string; content: string }>;
  /** build.gradle 文件内容（用于 Gradle 配置诊断） */
  buildGradle?: string;
  /** gradle.properties 文件内容（用于版本信息校验） */
  gradleProperties?: string;
  /** mixins.json 文件内容（用于 Mixin 配置校验） */
  mixinsJson?: string;
  /** 模组项目根目录：扫盘填缺失正文（显式正文优先） */
  projectPath?: string;
  /** 是否同时分析 crash-reports 目录 */
  includeCrashAnalysis?: boolean;
}

export interface ValidationResult {
  status: "passed" | "failed" | "skipped";
  skipped?: boolean;
  passed: boolean;
  errors: string[];
  warnings: string[];
  checks: string[];
  ok?: boolean;
  action?: ActionEnvelope;
  crashAnalyses?: Array<{ path: string } & CrashResult>;
}

// ── 辅助函数 ────────────────────────────────────────────────────────────────

function extractModIdFromModsToml(modsToml: string): string | null {
  const match = modsToml.match(/modId\s*=\s*"([^"]+)"/);
  return match ? match[1] : null;
}

function extractModIdFromJava(content: string): string | null {
  const match = content.match(
    /public\s+static\s+final\s+String\s+MOD_ID\s*=\s*"([^"]+)"/,
  );
  return match ? match[1] : null;
}

function extractClassName(content: string): string | null {
  const match = content.match(/public\s+class\s+(\w+)/);
  return match ? match[1] : null;
}

function fileStem(path: string): string {
  const parts = path.split(/[/\\]/);
  const file = parts[parts.length - 1];
  return file.replace(/\.java$/i, "");
}

function extractBlockNamesFromBlockEntity(
  content: string,
): Array<{ name: string; line: number }> {
  const results: Array<{ name: string; line: number }> = [];
  const lines = content.split("\n");
  const bePattern =
    /BlockEntityType\.Builder\.of\s*\(\s*([^,)]+)\s*,\s*([^)]+)\s*\)/g;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(
      /BlockEntityType\.Builder\.of\s*\(\s*([^,)]+)\s*,\s*([^)]+)\s*\)/,
    );
    if (match) {
      results.push({ name: match[1].trim(), line: i + 1 });
    }
  }
  return results;
}

function findBlockRegistryNames(
  content: string,
): Map<string, { line: number }> {
  const map = new Map<string, { line: number }>();
  const lines = content.split("\n");
  // 匹配 DeferredRegister 模式：BLOCKS.register("name", ...)
  const pattern =
    /(?:BLOCKS|BlockReg)\s*\.\s*register\s*\(\s*"([^"]+)"\s*,/g;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let match;
    pattern.lastIndex = 0;
    while ((match = pattern.exec(line)) !== null) {
      map.set(match[1], { line: i + 1 });
    }
  }
  return map;
}

function findItemRegistryNames(
  content: string,
): Map<string, { line: number }> {
  const map = new Map<string, { line: number }>();
  const lines = content.split("\n");
  const pattern =
    /(?:ITEMS|ItemReg)\s*\.\s*register\s*\(\s*"([^"]+)"\s*,/g;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let match;
    pattern.lastIndex = 0;
    while ((match = pattern.exec(line)) !== null) {
      map.set(match[1], { line: i + 1 });
    }
  }
  return map;
}

// ── 校验规则实现 ───────────────────────────────────────────────────────────

/**
 * A. DeferredRegister 注册完整性（ERROR）
 * 检测 DeferredRegister.create / createBlocks / createItems 字段是否挂到 modEventBus。
 * 条目注册 register("id", …) 不得计入 bus 次数。
 */
function extractDeferredRegisterFields(content: string): string[] {
  const names = new Set<string>();
  const fieldRe = /DeferredRegister(?:\s*<[^>]+>)?\s+(\w+)\s*=/g;
  let m: RegExpExecArray | null;
  while ((m = fieldRe.exec(content)) !== null) {
    names.add(m[1]);
  }
  const createRe = /(\w+)\s*=\s*DeferredRegister\.(?:create|createBlocks|createItems)\s*\(/g;
  while ((m = createRe.exec(content)) !== null) {
    names.add(m[1]);
  }
  return [...names];
}

function hasBusRegister(content: string, field: string): boolean {
  const re = new RegExp(String.raw`\b${field}\s*\.\s*register\s*\(\s*(?!["'])`);
  return re.test(content);
}

function checkDeferredRegisterIntegrity(
  javaFiles: Array<{ path: string; content: string }>,
  errors: string[],
  _warnings: string[],
): void {
  const allContent = javaFiles.map((f) => f.content).join("\n");
  const fields = extractDeferredRegisterFields(allContent);
  if (!fields.length) return;

  for (const field of fields) {
    if (hasBusRegister(allContent, field)) continue;
    const declared = javaFiles.find((f) => {
      const re = new RegExp(String.raw`DeferredRegister(?:\s*<[^>]+>)?\s+${field}\s*=`);
      return re.test(f.content) || new RegExp(String.raw`${field}\s*=\s*DeferredRegister\.`).test(f.content);
    });
    const path = declared?.path ?? javaFiles[0]?.path ?? "(unknown)";
    errors.push(
      `[${path}] DeferredRegister 字段 '${field}' 未调用 ${field}.register(modEventBus)` +
        "（或 FMLJavaModLoadingContext.get().getModEventBus()）。条目 register(\"id\", …) 不能代替挂 bus。",
    );
  }
}

function resolveModIdConstant(
  expr: string,
  javaFiles: Array<{ path: string; content: string }>,
  currentContent: string,
): string | null {
  const simple = expr.trim();
  const fromCurrent = currentContent.match(
    new RegExp(String.raw`public\s+static\s+final\s+String\s+${simple}\s*=\s*"([^"]+)"`),
  );
  if (!simple.includes(".") && fromCurrent) return fromCurrent[1];

  const dotted = simple.match(/^(\w+)\.(\w+)$/);
  if (dotted) {
    const [, className, field] = dotted;
    for (const f of javaFiles) {
      if (!new RegExp(String.raw`\bclass\s+${className}\b`).test(f.content)) continue;
      const m = f.content.match(
        new RegExp(String.raw`public\s+static\s+final\s+String\s+${field}\s*=\s*"([^"]+)"`),
      );
      if (m) return m[1];
    }
  }

  if (!simple.includes(".")) {
    for (const f of javaFiles) {
      const m = f.content.match(
        new RegExp(String.raw`public\s+static\s+final\s+String\s+${simple}\s*=\s*"([^"]+)"`),
      );
      if (m) return m[1];
    }
  }
  return null;
}

/**
 * B. @Mod 入口类检查（ERROR）
 * 检查 @Mod 注解的 modId 是否与 mods.toml 一致。常量引用无法解析时 WARN。
 */
function checkModAnnotation(
  javaFiles: Array<{ path: string; content: string }>,
  modsTomlModId: string | null,
  errors: string[],
  warnings: string[],
): void {
  if (!modsTomlModId) return;

  for (const { path, content } of javaFiles) {
    const stringMatches = content.matchAll(/@Mod\s*\(\s*"([^"]+)"\s*\)/g);
    for (const m of stringMatches) {
      const modIdInAnnotation = m[1];
      if (modIdInAnnotation !== modsTomlModId) {
        errors.push(
          `[${path}] @Mod 注解 modId='${modIdInAnnotation}' 与 mods.toml modId='${modsTomlModId}' 不一致`,
        );
      }
    }

    const constMatches = content.matchAll(/@Mod\s*\(\s*([A-Za-z_][\w.]*)\s*\)/g);
    for (const m of constMatches) {
      const expr = m[1];
      const resolved = resolveModIdConstant(expr, javaFiles, content);
      if (!resolved) {
        warnings.push(
          `[${path}] @Mod(${expr}) 无法解析常量，已跳过与 mods.toml 的硬比对`,
        );
        continue;
      }
      if (resolved !== modsTomlModId) {
        errors.push(
          `[${path}] @Mod(${expr}) 解析为 '${resolved}'，与 mods.toml modId='${modsTomlModId}' 不一致`,
        );
      }
    }
  }
}

/**
 * C. BlockEntity 注册顺序（WARN）
 * 检查 BlockEntityType.Builder.of(...) 中引用的 Block 是否已注册
 */
function checkBlockEntityReferences(
  javaFiles: Array<{ path: string; content: string }>,
  errors: string[],
  warnings: string[],
): void {
  for (const { path, content } of javaFiles) {
    const blockRefs = extractBlockNamesFromBlockEntity(content);
    const allLines = content;

    // 收集文件中所有注册的 Block 名称
    const registeredBlocks = new Set<string>();
    const blockMatches = allLines.matchAll(
      /(?:BLOCKS|BlockReg)\s*\.\s*register\s*\(\s*"([^"]+)"\s*,/g,
    );
    for (const bm of blockMatches) {
      registeredBlocks.add(bm[1]);
    }

    // 收集文件中通过 RegistryObject 引用的 Block
    const roMatches = allLines.matchAll(
      /RegistryObject\s*<\s*Block\s*>\s+([A-Z_][A-Z0-9_]*)/g,
    );
    for (const rm of roMatches) {
      // 假设 RegistryObject 名称是 BLOCK 形式（去后缀），对应小写注册名
      const name = rm[1];
      // MY_BLOCK -> my_block
      const regName = name
        .replace(/^([A-Z]+)_/, (_, prefix) => prefix.toLowerCase() + "_")
        .replace(/_/g, "_")
        .toLowerCase()
        .replace(/([A-Z])/g, "_$1")
        .toLowerCase()
        .replace(/^_/, "");
      // 简化：如果 RegistryObject 名为 EXAMPLE_BLOCK，提取 example_block
      const simple = name.replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, "");
      if (simple.includes("_block")) {
        registeredBlocks.add(simple.replace("_block", ""));
      }
    }

    for (const ref of blockRefs) {
      // 尝试多种匹配方式
      const refName = ref.name.trim();
      const asRegName = refName
        .replace(/([A-Z])/g, "_$1")
        .toLowerCase()
        .replace(/^_/, "");

      const found =
        registeredBlocks.has(refName) ||
        registeredBlocks.has(asRegName) ||
        registeredBlocks.has(refName.replace(/\.get\(\)$/, ""));

      if (!found) {
        warnings.push(
          `[${path}:${ref.line}] BlockEntityType.Builder.of(...) 引用了 '${refName}'，但未在同文件中找到对应的 BLOCKS.register()`,
        );
      }
    }
  }
}

/**
 * D. BlockItem 注册完整性（WARN）
 * 检查每个 BLOCKS.register("name", ...) 是否有对应的 ITEMS.register("name", ...)
 */
function checkBlockItemIntegrity(
  javaFiles: Array<{ path: string; content: string }>,
  warnings: string[],
): void {
  for (const { path, content } of javaFiles) {
    const blockNames = findBlockRegistryNames(content);
    const itemNames = findItemRegistryNames(content);

    for (const [blockName] of blockNames) {
      if (!itemNames.has(blockName)) {
        warnings.push(
          `[${path}] 方块 '${blockName}' 注册了 Block 但未找到对应的 ITEMS.register('${blockName}', ...)。` +
            "如该方块不需要物品形态（如技术性方块），可忽略此提示",
        );
      }
    }
  }
}

/**
 * E. @ObjectHolder 注解检查（INFO/WARN）
 * 检查 value 是否符合 namespace:name 格式
 */
function checkObjectHolder(
  javaFiles: Array<{ path: string; content: string }>,
  modsTomlModId: string | null,
  warnings: string[],
): void {
  const allModIds = new Set<string>();
  if (modsTomlModId) allModIds.add(modsTomlModId);

  for (const { path, content } of javaFiles) {
    const mid = extractModIdFromJava(content);
    if (mid) allModIds.add(mid);

    // 匹配 @ObjectHolder("value") 和 @ObjectHolder(value="...", registryName="...")
    const ohMatches = content.matchAll(
      /@ObjectHolder\s*(?:\(\s*"([^"]+)"\s*\)|\(\s*(?:value\s*=\s*"([^"]+)"|registryName\s*=\s*"([^"]+)")[^)]*\))/g,
    );

    for (const m of ohMatches) {
      const value = m[1] || m[2]; // @ObjectHolder("value") 或 value="..."
      const registryName = m[3]; // registryName="..." 单独出现

      if (value) {
        if (value.includes(":")) {
          const [ns, name] = value.split(":");
          if (ns && ns !== ns.toLowerCase()) {
            warnings.push(
              `[${path}] @ObjectHolder value='${value}' 的命名空间 '${ns}' 包含大写，应全小写`,
            );
          }
          if (!allModIds.has(ns)) {
            warnings.push(
              `[${path}] @ObjectHolder value='${value}' 的命名空间 '${ns}' 与已知的 modId 不匹配`,
            );
          }
        } else {
          // 无命名空间时，命名空间应为 mods.toml modId
          if (modsTomlModId) {
            warnings.push(
              `[${path}] @ObjectHolder value='${value}' 未指定命名空间，默认为 '${modsTomlModId}:${value}'，` +
                "建议显式写为 '@ObjectHolder(\"${modsTomlModId}:${value}\")' 以避免歧义",
            );
          }
        }
      }

      if (registryName) {
        // registryName 属性是标准用法，给予正向提示而非错误
        if (registryName !== registryName.toLowerCase()) {
          warnings.push(
            `[${path}] @ObjectHolder registryName='${registryName}' 应全小写`,
          );
        }
      }
    }
  }
}

/**
 * F. Mixin 配置检查（WARN）
 * 检查 mixin 类是否在 src 中实际存在
 */
function checkMixinConfig(
  mixinsJson: string | undefined,
  javaFiles: Array<{ path: string; content: string }>,
  warnings: string[],
): void {
  if (!mixinsJson) return;

  try {
    const config = JSON.parse(mixinsJson);
    const mixinClasses = new Set<string>();

    // 收集所有 mixin 类
    for (const ref of [
      config.client,
      config.server,
      config.compat,
      config.refmap,
    ] as string[]) {
      if (Array.isArray(ref)) {
        for (const m of ref) {
          if (typeof m === "string") mixinClasses.add(m);
        }
      }
    }
    for (const key of Object.keys(config)) {
      if (Array.isArray(config[key])) {
        for (const m of config[key]) {
          if (typeof m === "string") mixinClasses.add(m);
        }
      }
    }

    // 收集所有 Java 文件中的类名
    const existingClasses = new Set<string>();
    for (const { path: p, content } of javaFiles) {
      const classMatch = content.match(/public\s+class\s+(\w+)/);
      if (classMatch) {
        existingClasses.add(classMatch[1]);
      }
    }

    for (const mixin of mixinClasses) {
      // 提取类名（最后一个 . 后的部分）
      const className = mixin.includes(".")
        ? mixin.slice(mixin.lastIndexOf(".") + 1)
        : mixin;

      if (!existingClasses.has(className)) {
        warnings.push(
          `mixins.json 中引用了 mixin 类 '${mixin}'，但在提供的 Java 文件中未找到对应的类定义`,
        );
      }

      // 检查目标类格式
      const rawMixins = config.mixins as unknown;
      if (Array.isArray(rawMixins)) {
        for (const entry of rawMixins) {
          if (typeof entry === "object" && entry !== null && "mixin" in entry) {
            const target = (entry as { mixin: string; target: string }).target;
            if (target && target.startsWith(".")) {
              warnings.push(
                `mixins.json 中 target='${target}' 以 '.' 开头，应使用完整类名如 'net.minecraft.world.entity.Entity'`,
              );
            }
          }
        }
      }
    }
  } catch {
    warnings.push("mixins.json 格式解析失败，请检查 JSON 语法");
  }
}

/**
 * G. 重复注册名检测（WARN）
 * 扫描同一 Registry 类型中的所有 .register("name") 调用，检测同名注册
 */
function checkDuplicateRegistryNames(
  javaFiles: Array<{ path: string; content: string }>,
  warnings: string[],
): void {
  for (const { path, content } of javaFiles) {
    const blockRegs: Array<{ name: string; line: number }> = [];
    const itemRegs: Array<{ name: string; line: number }> = [];

    const lines = content.split("\n");
    const blockPattern =
      /(?:BLOCKS|BlockReg)\s*\.\s*register\s*\(\s*"([^"]+)"\s*,/g;
    const itemPattern =
      /(?:ITEMS|ItemReg)\s*\.\s*register\s*\(\s*"([^"]+)"\s*,/g;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      let match;
      blockPattern.lastIndex = 0;
      while ((match = blockPattern.exec(line)) !== null) {
        blockRegs.push({ name: match[1], line: i + 1 });
      }
      itemPattern.lastIndex = 0;
      while ((match = itemPattern.exec(line)) !== null) {
        itemRegs.push({ name: match[1], line: i + 1 });
      }
    }

    // 检测同名 Block 注册
    const seenBlock = new Map<string, number>();
    for (const reg of blockRegs) {
      if (seenBlock.has(reg.name)) {
        warnings.push(
          `[${path}:${reg.line}] Block 注册名 '${reg.name}' 与第 ${seenBlock.get(
            reg.name,
          )} 行重复，后注册的会覆盖前面的`,
        );
      } else {
        seenBlock.set(reg.name, reg.line);
      }
    }

    // 检测同名 Item 注册
    const seenItem = new Map<string, number>();
    for (const reg of itemRegs) {
      if (seenItem.has(reg.name)) {
        warnings.push(
          `[${path}:${reg.line}] Item 注册名 '${reg.name}' 与第 ${seenItem.get(
            reg.name,
          )} 行重复，后注册的会覆盖前面的`,
        );
      } else {
        seenItem.set(reg.name, reg.line);
      }
    }
  }
}

/**
 * 通用 mods.toml 检查（原有逻辑增强）
 */
function checkModsToml(
  modsToml: string | undefined,
  errors: string[],
  warnings: string[],
): string | null {
  if (!modsToml) return null;

  const checks: string[] = [];

  if (!modsToml.includes('modLoader="javafml"')) {
    errors.push("mods.toml 必须声明 modLoader=\"javafml\"");
  }
  if (!modsToml.includes("loaderVersion=")) {
    errors.push("mods.toml 必须包含 loaderVersion 声明");
  }
  if (!modsToml.includes("[[mods]]")) {
    errors.push("mods.toml 必须包含 [[mods]] 表");
  }
  if (!modsToml.includes("modId=")) {
    errors.push("[[mods]] 表必须包含 modId 字段");
  }
  if (!modsToml.includes("version=")) {
    errors.push("[[mods]] 表必须包含 version 字段");
  }

  const modId = extractModIdFromModsToml(modsToml);
  if (modId && !/^[a-z][a-z0-9_]*$/.test(modId)) {
    errors.push(`mods.toml modId='${modId}' 必须全小写、只能含字母/数字/下划线`);
  }
  if (modId && modId.includes("-")) {
    errors.push(`mods.toml modId='${modId}' 不能含横杠（-），用下划线替代`);
  }

  return modId;
}

const SKIPPED_LOADERS = new Set<DetectedLoader>([
  "liteloader",
  "liteloader_forge",
  "rift",
  "modloader",
  "bedrock",
]);

function warningForSkippedLoader(loader: DetectedLoader): string {
  switch (loader) {
    case "liteloader":
    case "liteloader_forge":
      return 'validate_project 不覆盖 LiteLoader。请改用 search_docs({platform:"liteloader"})。';
    case "rift":
      return 'validate_project 不覆盖 Rift。请改用 search_docs({platform:"rift"})。';
    case "modloader":
      return "validate_project 不覆盖 Risugami's ModLoader。请改用 search_docs({platform:\"modloader\"})。";
    case "bedrock":
      return "validate_project 不是基岩校验器。请改用 validate_addon_manifest / search_bedrock_docs。";
    default:
      return "validate_project 不覆盖该加载器。请改用对应平台的文档/校验工具。";
  }
}

/** 用已有输入调 detectProjectLoaders（含 Java 补强），与 detect_mod_project 共用判定。 */
export function detectValidateLoader(query: ValidateQuery): DetectedLoader {
  const gradle = query.buildGradle ?? "";
  const extras: CheckDependenciesExtras = {};
  if (query.quiltModJson) extras.quiltModJson = query.quiltModJson;
  const javaBlob = javaBlobFromFiles(query.javaFiles);
  if (/"format_version"/.test(javaBlob) && /"modules"/.test(javaBlob)) {
    extras.addonManifest = javaBlob;
  }
  if (/quilt_loader/.test(javaBlob)) {
    extras.quiltModJson = extras.quiltModJson ?? javaBlob;
  }
  if (/\bLiteMod\b|litemod\.json/i.test(javaBlob)) {
    extras.litemodJson = javaBlob;
  }
  if (/RiftLoader|riftmod\.json|rift\.mod\.json/i.test(javaBlob)) {
    extras.riftmodJson = javaBlob;
  }
  const extraText = `${query.modsToml ?? ""}\n${query.gradleProperties ?? ""}`;
  if (/"format_version"/.test(extraText) && /"modules"/.test(extraText)) {
    extras.addonManifest = extras.addonManifest ?? extraText;
  }
  const { primary } = detectProjectLoaders({
    buildGradle: gradle,
    modsToml: query.modsToml,
    fabricModJson: query.fabricModJson,
    neoModsToml: query.neoModsToml,
    extras,
    javaBlob,
  });
  return primary;
}

// ── 主函数 ────────────────────────────────────────────────────────────────

function fillValidateQuery(
  query: ValidateQuery,
): { query: ValidateQuery; javaWarning?: string; crashReports: Array<{ path: string; content: string }> } | { error: ValidationResult } {
  if (!query.projectPath) return { query, crashReports: [] };
  const resolved = resolveProjectDir(query.projectPath);
  if (!resolved.ok) {
    return {
      error: {
        status: "failed",
        passed: false,
        ok: false,
        errors: [resolved.action.message],
        warnings: [],
        checks: [],
        action: resolved.action,
      },
    };
  }
  const loaded = loadModProject(resolved.root);
  if (loaded.javaWarning) {
    process.stderr.write(`${loaded.javaWarning}\n`);
  }
  return {
    query: {
      ...query,
      modsToml: preferExplicit(query.modsToml, loaded.modsToml),
      neoModsToml: preferExplicit(query.neoModsToml, loaded.neoModsToml),
      fabricModJson: preferExplicit(query.fabricModJson, loaded.fabricModJson),
      quiltModJson: preferExplicit(query.quiltModJson, loaded.quiltModJson),
      buildGradle: preferExplicit(query.buildGradle, loaded.buildGradle),
      gradleProperties: preferExplicit(query.gradleProperties, loaded.gradleProperties),
      mixinsJson: preferExplicit(query.mixinsJson, loaded.mixinsJson),
      javaFiles: mergeJavaFiles(query.javaFiles, loaded.javaFiles),
    },
    javaWarning: loaded.javaWarning,
    crashReports: loaded.crashReports,
  };
}

export function validateProject(query: ValidateQuery): ValidationResult {
  const filled = fillValidateQuery(query);
  if ("error" in filled) return filled.error;
  const javaWarning = filled.javaWarning;
  const crashReports = filled.crashReports;
  const {
    modsToml,
    javaFiles = [],
    gradleProperties,
    mixinsJson,
    includeCrashAnalysis,
  } = filled.query;
  query = filled.query;

  const loader = detectValidateLoader(query);
  const recipeWarnings = datapackRecipeWarnings(query.projectPath);
  if (loader === "fabric" || loader === "quilt") {
    const r = validateFabricOrQuilt(query, loader);
    if (javaWarning) r.warnings.unshift(javaWarning);
    r.warnings.push(...recipeWarnings);
    return r;
  }
  if (loader === "neoforge") {
    const r = validateNeoForge(query);
    if (javaWarning) r.warnings.unshift(javaWarning);
    r.warnings.push(...recipeWarnings);
    return r;
  }
  if (SKIPPED_LOADERS.has(loader)) {
    const warnings = [warningForSkippedLoader(loader)];
    if (javaWarning) warnings.push(javaWarning);
    return {
      status: "skipped",
      skipped: true,
      passed: false,
      ok: false,
      errors: [],
      warnings,
      checks: ["loader 识别（未跑校验）"],
      action: actionable(
        ActionCodes.WRONG_TOOL,
        "请先看 status/skipped，不要只看 passed；这不是项目损坏，而是本工具未跑检查。" +
          warningForSkippedLoader(loader),
        [
          "改用对应平台文档或校验工具（search_docs / validate_addon_manifest）",
        ],
        ["search_docs", "validate_addon_manifest"],
      ),
    };
  }

  const errors: string[] = [];
  const warnings: string[] = [];
  if (javaWarning) warnings.push(javaWarning);
  const checks: string[] = [
    "mods.toml 语法",
    "mod ID 一致性",
    "Registry 命名",
    "DeferredRegister 注册完整性",
    "@Mod 注解",
    "BlockEntity 注册顺序",
    "BlockItem 注册完整性",
    "@ObjectHolder 注解",
    "Mixin 配置",
    "重复注册名检测",
  ];

  // 1. mods.toml 基础检查，提取 modId
  const modsTomlModId = checkModsToml(modsToml, errors, warnings);

  // 2. gradle.properties modId 提取（优先级低于 mods.toml）
  let gradleModId: string | null = null;
  if (gradleProperties) {
    const match = gradleProperties.match(/mod_id\s*=\s*(.+)/);
    if (match) {
      gradleModId = match[1].trim();
    }
    if (gradleModId && modsTomlModId && gradleModId !== modsTomlModId) {
      warnings.push(
        `gradle.properties 中 mod_id='${gradleModId}' 与 mods.toml modId='${modsTomlModId}' 不一致，以 mods.toml 为准`,
      );
    }
  }

  // 3. Java 文件基础检查（原有逻辑）
  for (const { path, content } of javaFiles) {
    // 多个 MOD_ID 声明
    const modIdMatches = content.match(
      /public\s+static\s+final\s+String\s+MOD_ID\s*=\s*"([^"]+)"/g,
    );
    if (modIdMatches && modIdMatches.length > 1) {
      errors.push(`[${path}] 发现多个 MOD_ID 声明`);
    }

    // RegistryObject 命名（全大写检查）
    const registryMatches = content.matchAll(
      /RegistryObject<[^>]+>\s+([A-Z][A-Z0-9_]+)\s*=/g,
    );
    for (const m of registryMatches) {
      if (!/^[A-Z][A-Z0-9_]+$/.test(m[1])) {
        warnings.push(
          `[${path}] RegistryObject '${m[1]}' 应使用全大写下划线命名（如 EXAMPLE_ITEM）`,
        );
      }
    }

    // RegistryObject 缺少 static/final
    // 两阶段方案：1. 提取包含 RegistryObject 的声明行；2. 分析修饰符和变量名
    // 支持嵌套泛型：<Supplier<Block>>，通过 [^<>]+(?:<[^<>]+>)* 匹配
    const roDeclPattern =
      /((?:private|public|protected)\s+)?((?:static|final)\s+)*(RegistryObject\s*<[^<>]+(?:<[^<>]+>)*>\s+([A-Z_][A-Z0-9_]*))/gm;
    let rm;
    while ((rm = roDeclPattern.exec(content)) !== null) {
      const [full, visibility, modifiers, , name] = rm;
      const hasStatic = /\bstatic\b/.test(modifiers ?? "");
      const hasFinal = /\bfinal\b/.test(modifiers ?? "");
      // 接口中的字段默认 static，不警告
      const isInterfaceField = /\binterface\b/.test(
        content.substring(Math.max(0, rm.index - 200), rm.index)
      );
      if (!hasStatic && !isInterfaceField) {
        warnings.push(
          `[${path}] RegistryObject '${name}' 缺少 static 修饰符`,
        );
      }
      if (!hasFinal) {
        warnings.push(
          `[${path}] RegistryObject '${name}' 缺少 final 修饰符`,
        );
      }
    }

    // Registry 名称检查（全小写）
    const regNamePattern =
      /(?:BLOCKS|ITEMS|ENTITIES|BlockReg|ItemReg|EntityReg)\s*\.\s*register\s*\(\s*"([^"]+)"\s*,/g;
    let rnm;
    while ((rnm = regNamePattern.exec(content)) !== null) {
      const name = rnm[1];
      if (!/^[a-z][a-z0-9_]*$/.test(name)) {
        errors.push(
          `[${path}] Registry 名称 '${name}' 必须全小写、下划线分隔`,
        );
      }
      if (name.includes("-")) {
        errors.push(
          `[${path}] Registry 名称 '${name}' 包含横杠（-），改为下划线（_）`,
        );
      }
    }

    // 类名与文件名一致性
    const declaredClass = extractClassName(content);
    const expectedClass = fileStem(path);
    if (declaredClass && declaredClass !== expectedClass) {
      errors.push(
        `[${path}] 文件名 '${expectedClass}.java' 与类名 '${declaredClass}' 不匹配`,
      );
    }

    // MOD_ID 与 mods.toml 不一致
    const javaModId = extractModIdFromJava(content);
    if (javaModId && modsTomlModId && javaModId !== modsTomlModId) {
      warnings.push(
        `[${path}] MOD_ID='${javaModId}' 与 mods.toml modId='${modsTomlModId}' 不一致`,
      );
    }
  }

  // 4. 增强校验规则
  checkDeferredRegisterIntegrity(javaFiles, errors, warnings);
  checkModAnnotation(javaFiles, modsTomlModId, errors, warnings);
  checkBlockEntityReferences(javaFiles, errors, warnings);
  checkBlockItemIntegrity(javaFiles, warnings);
  checkObjectHolder(javaFiles, modsTomlModId, warnings);
  checkMixinConfig(mixinsJson, javaFiles, warnings);
  checkDuplicateRegistryNames(javaFiles, warnings);
  warnings.push(...recipeWarnings);

  let crashAnalyses: ValidationResult["crashAnalyses"];
  if (includeCrashAnalysis && crashReports.length > 0) {
    const crashVersion = detectMinecraftVersion({
      gradleProperties: query.gradleProperties,
      buildGradle: query.buildGradle,
    });
    crashAnalyses = crashReports.map((c) => ({
      path: c.path,
      ...analyzeCrash({
        crashReport: c.content,
        ...(crashVersion !== "unknown" ? { version: crashVersion } : {}),
      }),
    }));
  }

  const passed = errors.length === 0;
  return {
    status: passed ? "passed" : "failed",
    passed,
    ok: passed,
    errors,
    warnings,
    checks,
    ...(crashAnalyses ? { crashAnalyses } : {}),
  };
}
