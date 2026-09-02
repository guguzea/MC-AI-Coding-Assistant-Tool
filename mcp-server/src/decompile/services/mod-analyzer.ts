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
import { parseJsonUtf8 } from "../../utils/json-utf8.js";
import { readZip, listZipEntries } from "../zip-util.js";
import { parseMinecraftVersion } from "../version-manager.js";
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

/** jar 元数据里声明 MC 版本的一条原始约束（不猜语义，原样回显 + 判定分离） */
export interface McVersionConstraint {
  /** 声明来源，如 fabric.mod.json:depends.minecraft */
  source: string;
  /** jar 里写的原样值，如 "1.20.1"、"[1.20.1,)"、">=1.20"、"1.20.x || 1.21.x" */
  raw: string;
}

export type VersionMatchVerdict = "match" | "mismatch" | "unknown";

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
  mods?: Array<{ modId: string; version?: string; displayName?: string; description?: string }>;
  /** 各 loader 元数据里声明的 MC 版本约束（Fabric/Quilt/Forge/NeoForge/litemod/mcmod/基岩） */
  mcVersionConstraints: McVersionConstraint[];
  /** D-21：调用方传入的 version 原样回显（未传则整个 version* 字段族缺席） */
  requestedVersion?: string;
  versionMatch?: VersionMatchVerdict;
  versionMatchNote?: string;
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
    mcVersionConstraints: [],
  };
}

// ── D-21：MC 版本约束判定（纯函数，宁缺勿猜）───────────────────────────────

/** Fabric / Quilt 依赖值：字符串、{ value }、字符串数组（数组按「或」拼接） */
function rangeTextOf(value: unknown): string | undefined {
  if (typeof value === "string") return value.trim() || undefined;
  if (Array.isArray(value)) {
    const parts = value.map(rangeTextOf).filter((x): x is string => !!x);
    return parts.length > 0 ? parts.join(" || ") : undefined;
  }
  if (value && typeof value === "object") return rangeTextOf((value as { value?: unknown }).value);
  return undefined;
}

/**
 * quilt depends 的 versions：数组多值的语义（AND 还是 OR）未在官方实现核实，
 * 猜成 OR 会把 1.21.1 判进 `[">=1.20","<1.21"]`。单元素取该值；多元素原样拼成
 * `" && "`，由 testConstraint 拒判为 unknown。
 */
function quiltVersionsText(value: unknown): string | undefined {
  if (Array.isArray(value)) {
    const parts = value.map(rangeTextOf).filter((x): x is string => !!x);
    if (parts.length === 1) return parts[0];
    return parts.length > 1 ? parts.join(" && ") : undefined;
  }
  return rangeTextOf(value);
}

type VersionTuple = [number, number, number];
const VER_RE = /^(\d+)\.(\d+)(?:\.(\d+))?$/;

function toTuple(v: string): VersionTuple | null {
  const m = VER_RE.exec(v.trim());
  if (!m) return null;
  return [Number(m[1]), Number(m[2]), m[3] !== undefined ? Number(m[3]) : 0];
}

function cmpTuple(a: VersionTuple, b: VersionTuple): number {
  for (let i = 0; i < 3; i++) {
    if (a[i] !== b[i]) return a[i] < b[i] ? -1 : 1;
  }
  return 0;
}

/**
 * 单条约束是否包含 target。返回 null = 形态不认识（调用方必须落到 unknown，禁止猜成 match/mismatch）。
 * 覆盖：* / any、精确 1.20.1、通配 1.20.x、>= > <= < =、^x.y、~x.y、
 *      Maven 区间 [1.20.1,) (1.20,) [1.20,1.21]、`||` 或、逗号/空格 与。
 *      `" && "`（quilt 多值 versions，语义未核实）→ null。
 */
function testConstraint(raw: string, target: VersionTuple): boolean | null {
  const s = raw.trim();
  if (!s || s === "*" || s === "any") return true;
  if (s.includes("&&")) return null;

  const bracket = /^([\[(])([^,]*),([^,]*)([\])])$/.exec(s);
  if (bracket) {
    const [, lb, lo, hi, ub] = bracket;
    const incLo = lb === "[";
    const incHi = ub === "]";
    if (lo.trim()) {
      const t = toTuple(lo);
      if (!t) return null;
      const c = cmpTuple(target, t);
      if (c < 0 || (c === 0 && !incLo)) return false;
    }
    if (hi.trim()) {
      const t = toTuple(hi);
      if (!t) return null;
      const c = cmpTuple(target, t);
      if (c > 0 || (c === 0 && !incHi)) return false;
    }
    return true;
  }

  if (/\|\|/.test(s)) {
    const results = s.split(/\|\|/).map((p) => testConstraint(p, target));
    if (results.some((r) => r === true)) return true;
    return results.some((r) => r === null) ? null : false;
  }

  const atoms = s.split(/[\s,]+/).filter(Boolean);
  if (atoms.length > 1) {
    const results = atoms.map((a) => testConstraint(a, target));
    if (results.some((r) => r === false)) return false;
    return results.some((r) => r === null) ? null : true;
  }

  const atom = atoms[0] ?? s;
  const op = /^(>=|<=|>|<|=|\^|~)\s*(.+)$/.exec(atom);
  if (op) {
    const t = toTuple(op[2]);
    if (!t) return null;
    const c = cmpTuple(target, t);
    switch (op[1]) {
      case ">=": return c >= 0;
      case ">": return c > 0;
      case "<=": return c <= 0;
      case "<": return c < 0;
      case "=": return c === 0;
      case "^": return c >= 0 && target[0] === t[0];
      case "~": return c >= 0 && target[0] === t[0] && target[1] === t[1];
    }
    return null;
  }

  // 通配（1.20.x / 1.x）：只比对已写出的前导段
  if (/(\.x|\.X|\.\*)$/.test(atom)) {
    const segs = atom.replace(/(\.x|\.X|\.\*)$/, "").split(".").map(Number);
    if (segs.some((n) => !Number.isFinite(n))) return null;
    for (let i = 0; i < segs.length && i < 3; i++) if (target[i] !== segs[i]) return false;
    return true;
  }

  const exact = toTuple(atom);
  if (!exact) return null;
  // 只写到 minor 的声明（"1.20"）按 major+minor 等值；三段式（"1.20.1"）精确相等
  if (atom.split(".").length === 2) return target[0] === exact[0] && target[1] === exact[1];
  return cmpTuple(target, exact) === 0;
}

/**
 * 汇总判定：任一约束含目标 → match；否则有未识别形态 → unknown；全部不含才 mismatch。
 * 只有 parseMinecraftVersion 认得的版本才判定（快照 / 乱码 → unknown + 原因）。
 */
function judgeVersionMatch(
  requested: string,
  constraints: McVersionConstraint[],
): { verdict: VersionMatchVerdict; note: string } {
  const vi = parseMinecraftVersion(requested);
  if (!vi.valid) {
    return { verdict: "unknown", note: `version「${requested}」未参与判定：${vi.error ?? "无法解析的 MC 版本"}` };
  }
  const target: VersionTuple = [vi.major, vi.minor, vi.patch ?? 0];
  if (constraints.length === 0) {
    return { verdict: "unknown", note: `jar 元数据未声明 MC 版本，${vi.version} 无法比对` };
  }
  const results = constraints.map((c) => ({ c, ok: testConstraint(c.raw, target) }));
  const unknownCount = results.filter((r) => r.ok === null).length;
  const verdict: VersionMatchVerdict =
    results.some((r) => r.ok === true) ? "match" : unknownCount > 0 ? "unknown" : "mismatch";
  const bits = results.map((r) => `${r.c.source}="${r.c.raw}"→${r.ok === true ? "含" : r.ok === false ? "不含" : "形态未识别"}`);
  let note = `${vi.version} ${verdict === "match" ? "落在" : verdict === "mismatch" ? "不在" : "无法判定是否落在"}声明范围内：${bits.join("；")}`;
  if (unknownCount > 0) note += "（存在未识别约束形态，不猜结论）";
  if (vi.unobfuscated) note += "；26.1+ 已去混淆，remap 免（与 decompile_mod_jar 同口径）";
  return { verdict, note };
}

/** Quilt / Fabric 入口：string、string[]、{ value }（adapter 包装）。 */
function collectEntrypointValues(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(collectEntrypointValues);
  if (value && typeof value === "object") {
    const inner = (value as { value?: unknown }).value;
    if (typeof inner === "string") return [inner];
  }
  return [];
}

function parseEntrypointsMap(entrypoints: unknown): Record<string, string[]> | undefined {
  if (!entrypoints || typeof entrypoints !== "object") return undefined;
  const eps: Record<string, string[]> = {};
  for (const [side, list] of Object.entries(entrypoints as Record<string, unknown>)) {
    const vals = collectEntrypointValues(list);
    if (vals.length > 0) eps[side] = vals;
  }
  return Object.keys(eps).length > 0 ? eps : undefined;
}

export interface AnalyzeResult extends ModMetadata {}

export function analyzeModJar(jarPath: string, requestedVersion?: string): AnalyzeResult {
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

  const addMcConstraint = (source: string, raw: string | undefined) => {
    const v = raw?.trim();
    if (!v) return;
    if (meta.mcVersionConstraints.some((c) => c.source === source && c.raw === v)) return;
    meta.mcVersionConstraints.push({ source, raw: v });
  };

  // ── quilt.mod.json（优先于 fabric：同时存在时标 quilt）────────────────────
  const quiltJson = entries.get("quilt.mod.json");
  if (quiltJson) {
    try {
      const quilt = parseJsonUtf8(quiltJson.toString("utf8")) as Record<string, unknown>;
      meta.loaders.push("quilt");
      const loader = quilt.quilt_loader as Record<string, unknown> | undefined;
      const qid = loader && typeof loader.id === "string" ? loader.id : typeof quilt.id === "string" ? quilt.id : undefined;
      if (qid) meta.modId = qid;
      const qver = loader && typeof loader.version === "string" ? loader.version : typeof quilt.version === "string" ? quilt.version : undefined;
      if (qver) meta.modVersion = qver;
      const metadata = loader?.metadata as Record<string, unknown> | undefined;
      if (metadata && typeof metadata.name === "string") meta.modName = metadata.name;
      if (metadata && typeof metadata.description === "string") meta.description = metadata.description;
      const entrypoints = loader?.entrypoints ?? quilt.entrypoints;
      const eps = parseEntrypointsMap(entrypoints);
      if (eps) meta.entrypoints = { ...meta.entrypoints, ...eps };
      // quilt depends 三种写法都可能出现："minecraft"、"minecraft@>=1.20"、{id,versions}、{minecraft:">=1.20"}
      const qdeps = loader?.depends ?? quilt.depends;
      if (Array.isArray(qdeps)) {
        for (const dep of qdeps) {
          if (typeof dep === "string") {
            const [id, ...rest] = dep.split("@");
            if (id.trim() === "minecraft") addMcConstraint("quilt.mod.json:quilt_loader.depends", rest.length > 0 ? rest.join("@") : "*");
          } else if (dep && typeof dep === "object") {
            const d = dep as Record<string, unknown>;
            if (d.id === "minecraft") addMcConstraint("quilt.mod.json:quilt_loader.depends", quiltVersionsText(d.versions ?? d.version));
          }
        }
      } else if (qdeps && typeof qdeps === "object") {
        addMcConstraint("quilt.mod.json:quilt_loader.depends", rangeTextOf((qdeps as Record<string, unknown>).minecraft));
      }
    } catch (err) {
      meta.warnings.push(`quilt.mod.json 解析失败: ${(err as Error).message}`);
    }
  }

  // ── fabric.mod.json ─────────────────────────────────────────────────────────
  const fabricJson = entries.get("fabric.mod.json");
  if (fabricJson) {
    try {
      const fabric = parseJsonUtf8(fabricJson.toString("utf8")) as Record<string, unknown>;
      const quiltWins = meta.loaders.includes("quilt");
      if (!quiltWins) {
        meta.loaders.push("fabric");
        if (typeof fabric.id === "string") meta.modId = fabric.id;
        if (typeof fabric.version === "string") meta.modVersion = fabric.version;
        if (typeof fabric.name === "string") meta.modName = fabric.name;
        if (typeof fabric.description === "string") meta.description = fabric.description;
        const eps = parseEntrypointsMap(fabric.entrypoints);
        if (eps) meta.entrypoints = eps;
      } else if (!meta.entrypoints) {
        const eps = parseEntrypointsMap(fabric.entrypoints);
        if (eps) meta.entrypoints = eps;
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
            if (id === "minecraft") addMcConstraint("fabric.mod.json:depends.minecraft", rangeTextOf(range));
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

  // ── META-INF/mods.toml / neoforge.mods.toml（两份都解析，loaders 可含两个）──
  const neoforgeToml = entries.get("META-INF/neoforge.mods.toml");
  const forgeToml = entries.get("META-INF/mods.toml");
  const applyToml = (buf: Buffer | undefined, loader: "neoforge" | "forge", label: string) => {
    if (!buf) return;
    try {
      const toml = parseModsToml(buf.toString("utf8"));
      if (!meta.loaders.includes(loader)) meta.loaders.push(loader);
      const mods = meta.mods ?? (meta.mods = []);
      if (toml.mods.length) {
        const seen = new Set(mods.map((m) => m.modId));
        for (const m of toml.mods) {
          if (!seen.has(m.modId)) {
            mods.push(m);
            seen.add(m.modId);
          }
        }
      }
      if (toml.mods.length > 1) {
        meta.warnings.push(`${label} 含 ${toml.mods.length} 个 [[mods]]，已全部列入 mods[]；主字段取首个 ${toml.mods[0].modId}`);
      }
      if (!meta.modId && toml.mods[0]?.modId) meta.modId = toml.mods[0].modId;
      if (!meta.modVersion && toml.mods[0]?.version) meta.modVersion = toml.mods[0].version;
      if (!meta.modName && toml.mods[0]?.displayName) meta.modName = toml.mods[0].displayName;
      if (!meta.description && toml.mods[0]?.description) meta.description = toml.mods[0].description;
      for (const dep of toml.dependencies) {
        meta.dependencies.push(dep);
        if (dep.id === "minecraft" && dep.versionRange) {
          addMcConstraint(`${label}:[[dependencies.${dep.owner ?? "?"}]] modId=minecraft`, dep.versionRange);
        }
      }
    } catch (err) {
      meta.warnings.push(`${label} 解析失败: ${(err as Error).message}`);
    }
  };
  applyToml(neoforgeToml, "neoforge", "neoforge.mods.toml");
  applyToml(forgeToml, "forge", "mods.toml");

  // ── 旧 Forge mcmod.info（1.12 混合常与 litemod.json 并存）────────────────
  const mcmodInfo = entries.get("mcmod.info");
  if (mcmodInfo && !meta.loaders.includes("forge") && !meta.loaders.includes("neoforge")) {
    try {
      const parsed = parseJsonUtf8(mcmodInfo.toString("utf8")) as unknown;
      const first = Array.isArray(parsed) ? parsed[0] : parsed;
      if (first && typeof first === "object") {
        const rec = first as Record<string, unknown>;
        meta.loaders.push("forge");
        if (!meta.modId && typeof rec.modid === "string") meta.modId = rec.modid;
        if (!meta.modVersion && typeof rec.version === "string") meta.modVersion = rec.version;
        if (!meta.modName && typeof rec.name === "string") meta.modName = rec.name;
        if (typeof rec.mcversion === "string") addMcConstraint("mcmod.info:mcversion", rec.mcversion);
      }
    } catch (err) {
      meta.warnings.push(`mcmod.info 解析失败: ${(err as Error).message}`);
    }
  }

  // ── litemod.json ──────────────────────────────────────────────────────────
  const litemodJson = entries.get("litemod.json");
  if (litemodJson) {
    try {
      const lite = parseJsonUtf8(litemodJson.toString("utf8")) as Record<string, unknown>;
      if (!meta.loaders.includes("liteloader")) meta.loaders.push("liteloader");
      if (!meta.modId && typeof lite.name === "string") meta.modId = lite.name;
      if (!meta.modVersion && typeof lite.version === "string") meta.modVersion = lite.version;
      if (!meta.modName && typeof lite.displayName === "string") meta.modName = lite.displayName;
      if (typeof lite.mcversion === "string") addMcConstraint("litemod.json:mcversion", lite.mcversion);
      if (Array.isArray(lite.mcs)) {
        const mcs = lite.mcs.filter((x): x is string => typeof x === "string" && x.trim() !== "");
        if (mcs.length > 0) addMcConstraint("litemod.json:mcs", mcs.join(" || "));
      }
    } catch (err) {
      meta.warnings.push(`litemod.json 解析失败: ${(err as Error).message}`);
    }
  }

  // ── riftmod.json（官方）/ rift.mod.json（兼容误写）────────────────────────
  const riftJson = entries.get("riftmod.json") ?? entries.get("rift.mod.json");
  if (riftJson) {
    try {
      const rift = parseJsonUtf8(riftJson.toString("utf8")) as Record<string, unknown>;
      meta.loaders.push("rift");
      if (!meta.modId && typeof rift.id === "string") meta.modId = rift.id;
      if (!meta.modName && typeof rift.name === "string") meta.modName = rift.name;
      if (Array.isArray(rift.listeners)) {
        meta.entrypoints = {
          ...meta.entrypoints,
          listeners: rift.listeners.filter((x): x is string => typeof x === "string"),
        };
      }
    } catch (err) {
      meta.warnings.push(`riftmod.json 解析失败: ${(err as Error).message}`);
    }
  }

  // ── 基岩 manifest.json ───────────────────────────────────────────────────
  const addonManifest = entries.get("manifest.json");
  if (addonManifest) {
    try {
      const man = parseJsonUtf8(addonManifest.toString("utf8")) as Record<string, unknown>;
      if (man.format_version != null && Array.isArray(man.modules)) {
        meta.loaders.push("bedrock");
        const header = man.header as Record<string, unknown> | undefined;
        if (header && typeof header.name === "string") meta.modName = header.name;
        if (header && typeof header.uuid === "string") meta.modId = header.uuid;
        if (header && Array.isArray(header.version)) meta.modVersion = header.version.join(".");
        const minEngine = Array.isArray(header?.min_engine_version)
          ? (header!.min_engine_version as unknown[]).join(".")
          : typeof header?.min_engine_version === "string"
            ? header.min_engine_version
            : undefined;
        if (minEngine) addMcConstraint("manifest.json:header.min_engine_version", `>=${minEngine}`);
      }
    } catch (err) {
      meta.warnings.push(`manifest.json 解析失败: ${(err as Error).message}`);
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
    meta.warnings.push(
      "未识别 loader（无 quilt.mod.json / fabric.mod.json / mods.toml / litemod.json / riftmod.json / 基岩 manifest），可能是库 jar 或资源包",
    );
  }
  if (meta.loaders.includes("forge") && meta.loaders.includes("liteloader")) {
    meta.warnings.push("同时存在 Forge 与 LiteLoader 元数据：混合模组 loaders=[\"forge\",\"liteloader\"]");
  }
  const quiltFabricOnly =
    meta.loaders.length === 2 &&
    meta.loaders.includes("quilt") &&
    meta.loaders.includes("fabric");
  if (meta.loaders.length > 1 && !quiltFabricOnly) {
    meta.warnings.push(`同时存在多个 loader 元数据: ${meta.loaders.join(", ")}`);
  }

  const req = requestedVersion?.trim();
  if (req) {
    meta.requestedVersion = req;
    const judged = judgeVersionMatch(req, meta.mcVersionConstraints);
    meta.versionMatch = judged.verdict;
    meta.versionMatchNote = judged.note;
    if (judged.verdict === "mismatch") meta.warnings.push(`version 与 jar 声明不符：${judged.note}`);
  }

  return meta;
}

/** 仅条目名扫描版（快速判断 jar 类型，不展开数据） */
export function listJarEntries(jarPath: string): string[] {
  if (!existsSync(jarPath)) return [];
  return listZipEntries(readFileSync(jarPath));
}
