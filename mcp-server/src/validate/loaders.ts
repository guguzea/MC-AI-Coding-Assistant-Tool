/**
 * Fabric / Quilt / NeoForge 结构校验（Plan 2 C2）。
 * LiteLoader / Rift / ModLoader / 基岩仍走 validate_project 的 skipped。
 */
import { existsSync, readFileSync, statSync } from "fs";
import { validateDatapackJson } from "../datapack/index.js";
import { walkProjectFiles } from "../utils/project-files.js";
import { escapeRegExp } from "../utils/regex.js";
import type { ValidateQuery, ValidationResult } from "./index.js";

function finish(
  errors: string[],
  warnings: string[],
  checks: string[],
): ValidationResult {
  const passed = errors.length === 0;
  return {
    status: passed ? "passed" : "failed",
    passed,
    ok: passed,
    errors,
    warnings,
    checks,
  };
}

function parseJsonObject(raw: string | undefined): Record<string, unknown> | null {
  if (!raw?.trim()) return null;
  try {
    const v = JSON.parse(raw) as unknown;
    if (v && typeof v === "object" && !Array.isArray(v)) return v as Record<string, unknown>;
  } catch {
    return null;
  }
  return null;
}

function classLooksPresent(
  javaFiles: Array<{ path: string; content: string }>,
  fqcn: string,
): boolean {
  const simple = fqcn.split(".").pop() ?? fqcn;
  const needle = escapeRegExp(simple.replace(/\$/g, ""));
  // 嵌套类（Outer$Inner）文件名为 Outer$Inner.java，按包路径 + $ 名精确匹配（审计 B22：剥 $ 会永远找不到）
  const nestedFile = fqcn.includes("$")
    ? `${fqcn.includes(".") ? fqcn.split(".").slice(0, -1).join("/") + "/" : ""}${simple}`
    : null;
  return javaFiles.some((f) => {
    const p = f.path.replace(/\\/g, "/");
    if (p.endsWith(`/${needle}.java`) || p.endsWith(`${needle}.java`)) return true;
    if (nestedFile && p.endsWith(`/${nestedFile}.java`)) return true;
    try {
      return new RegExp(`\\bclass\\s+${needle}\\b`).test(f.content);
    } catch {
      // 转义后仍非法（理论上不可达）：按「类不存在」处理而非让整个校验崩溃
      return false;
    }
  });
}

function entrypointNames(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) {
    return value.flatMap((v) => {
      if (typeof v === "string") return [v];
      if (v && typeof v === "object" && "value" in v && typeof (v as { value: unknown }).value === "string") {
        return [(v as { value: string }).value];
      }
      return [];
    });
  }
  return [];
}

export function datapackRecipeWarnings(projectRoot: string | undefined): string[] {
  if (!projectRoot) return [];
  try {
    if (!existsSync(projectRoot) || !statSync(projectRoot).isDirectory()) return [];
  } catch {
    return [];
  }
  const absFiles = walkProjectFiles(projectRoot, (rel, name) => {
    if (!name.endsWith(".json")) return false;
    const n = rel.replace(/\\/g, "/");
    return /\/data\/[^/]+\/recipes?\//.test(`/${n}`);
  });
  const warnings: string[] = [];
  let n = 0;
  let bytes = 0;
  const maxFiles = 80;
  const maxBytes = 1024 * 1024;
  for (const abs of absFiles) {
    if (n >= maxFiles || bytes >= maxBytes) {
      warnings.push("数据包 recipe 扫描达到上限，其余未检查（不因此判 failed）");
      break;
    }
    let content: string;
    try {
      content = readFileSync(abs, "utf8");
    } catch {
      continue;
    }
    bytes += Buffer.byteLength(content, "utf8");
    n += 1;
    const rel = abs.replace(/\\/g, "/");
    const r = validateDatapackJson({ jsonContent: content, kind: "recipe", version: "unknown" });
    for (const e of r.errors) {
      warnings.push(`数据包 JSON（warning，不判 failed）${rel}: ${e}`);
    }
  }
  return warnings;
}

export function validateFabricOrQuilt(query: ValidateQuery, loader: "fabric" | "quilt"): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const checks = [
    `${loader === "quilt" ? "quilt.mod.json" : "fabric.mod.json"}`,
    "entrypoint 类存在",
    "禁止把 DeferredRegister 当本平台错误（仅 WARN）",
  ];
  const javaFiles = query.javaFiles ?? [];
  const raw = loader === "quilt" ? query.quiltModJson : query.fabricModJson;
  const json = parseJsonObject(raw);
  if (!json) {
    errors.push(loader === "quilt" ? "缺少或无法解析 quilt.mod.json" : "缺少或无法解析 fabric.mod.json");
    return finish(errors, warnings, checks);
  }

  let id: string | undefined;
  let entrypoints: Record<string, unknown> = {};
  if (loader === "quilt") {
    const ql = json.quilt_loader;
    if (!ql || typeof ql !== "object") {
      errors.push("quilt.mod.json 缺少 quilt_loader");
    } else {
      const loaderObj = ql as Record<string, unknown>;
      id = typeof loaderObj.id === "string" ? loaderObj.id : undefined;
      if (loaderObj.entrypoints && typeof loaderObj.entrypoints === "object") {
        entrypoints = loaderObj.entrypoints as Record<string, unknown>;
      }
    }
  } else {
    id = typeof json.id === "string" ? json.id : undefined;
    if (json.entrypoints && typeof json.entrypoints === "object") {
      entrypoints = json.entrypoints as Record<string, unknown>;
    }
  }

  if (!id) {
    errors.push(loader === "quilt" ? "quilt_loader.id 缺失" : "fabric.mod.json id 缺失");
  } else if (!/^[a-z][a-z0-9_]*$/.test(id)) {
    errors.push(`mod id='${id}' 必须全小写、只能含字母/数字/下划线`);
  }

  const names = Object.values(entrypoints).flatMap(entrypointNames);
  if (names.length === 0) {
    warnings.push("未声明 entrypoints；若尚未写入口类可忽略");
  }
  for (const fqcn of names) {
    const cls = fqcn.split("::")[0];
    if (javaFiles.length > 0 && !classLooksPresent(javaFiles, cls)) {
      errors.push(`entrypoint 类未在提供的 Java 源中找到：${cls}`);
    }
  }

  const blob = javaFiles.map((f) => f.content).join("\n");
  if (/\bDeferredRegister\b/.test(blob) || /net\.minecraftforge\.registries/.test(blob)) {
    warnings.push("检测到 Forge DeferredRegister / net.minecraftforge.registries；Fabric/Quilt 不要把它当错误注册方式，也不是本平台推荐");
  }

  return finish(errors, warnings, checks);
}

export function validateNeoForge(query: ValidateQuery): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const checks = [
    "neoforge.mods.toml",
    "@Mod + IEventBus 构造",
    "禁止 RegistryObject 当本档推荐",
    "禁止 SimpleChannel",
  ];
  const javaFiles = query.javaFiles ?? [];
  const toml = (query.neoModsToml ?? query.modsToml ?? "").trim();
  if (!toml) {
    errors.push("缺少 neoforge.mods.toml（或等效 mods.toml）");
  } else {
    if (!toml.includes("modId")) {
      errors.push("neoforge.mods.toml / mods.toml 必须包含 modId");
    }
    if (!toml.includes("[[mods]]")) {
      errors.push("neoforge.mods.toml / mods.toml 必须包含 [[mods]]");
    }
    const id = toml.match(/modId\s*=\s*"([^"]+)"/)?.[1];
    if (id && !/^[a-z][a-z0-9_]*$/.test(id)) {
      errors.push(`modId='${id}' 必须全小写、只能含字母/数字/下划线`);
    }
  }

  const blob = javaFiles.map((f) => f.content).join("\n");
  if (!/@Mod\s*\(/.test(blob)) {
    errors.push("未找到 @Mod 入口注解");
  }
  if (!/\(\s*IEventBus\b/.test(blob) && !/\(\s*[\w.]*IEventBus\b/.test(blob)) {
    errors.push("未找到接受 IEventBus 的模组构造（NeoForge 入口应把 mod bus 传入构造）");
  }
  if (/\bRegistryObject\b/.test(blob)) {
    warnings.push("检测到 RegistryObject：1.20.4+ NeoForge 不要把它当本档推荐（用 DeferredHolder / DeferredItem / DeferredBlock）");
  }
  if (/\bSimpleChannel\b/.test(blob) || /net\.minecraftforge\.network/.test(blob)) {
    if (/net\.minecraftforge\.network/.test(blob) && !/net\.neoforged/.test(blob)) {
      warnings.push(
        "SimpleChannel / net.minecraftforge.network 在 NeoForge 1.20.1（Forge 47 兼容层）是正确形态；1.20.2+ 才用 Payload（RegisterPayloadHandlersEvent），勿照本档改写",
      );
    } else {
      errors.push("禁止 SimpleChannel / Forge network 包名；改用该档 Payload 文档（RegisterPayloadHandlersEvent 等）");
    }
  }

  return finish(errors, warnings, checks);
}
