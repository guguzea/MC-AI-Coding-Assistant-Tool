import { PROJECT_SCAN_SKIP_DIRS } from "./project-files.js";

/**
 * 从 gradle.properties / 根 build.gradle 推断 Minecraft 版本。
 * 不能确定时返回 "unknown"，禁止默认 1.20.1。
 */

function stripQuotes(raw: string): string {
  return raw.replace(/^["']|["']$/g, "").trim();
}

/**
 * 取第一个点分版本，**必须整段独立**（V-13）：前后不许再粘连数字或点。
 * 旧式 `/(\\d+\\.\\d+(?:\\.\\d+)?)/` 会把污染串静默截成看似合法的 MC 版本
 * （`1.20.1.2`→`1.20.1`、`26.1.2.3`→`26.1.2`）；锚定后这类串返回 null，
 * 交回上层继续走下一级策略（最终可能 unknown），绝不猜版本。
 * 实测（dist detectMinecraftVersion + 19 条真实形态串）：合法档
 * 1.20.1 / 1.20.4 / 1.21.11 / 26.1 / 26.1.1 / 27.0.1 / 1.16.5 / 带引号 / 带空白 /
 * `net.minecraftforge:forge:1.20.1-47.2.0` / `parchment-1.20.1:2023.09.10@zip` /
 * `2024.01.20` / `21.1.113` / `v1.20.1` / `1.20.1-rc1` 全部同值。
 */
function extractDottedVersion(raw: string): string | null {
  const m = stripQuotes(raw).match(/(?<![\d.])(\d+\.\d+(?:\.\d+)?)(?![\d.])/);
  return m?.[1] ?? null;
}

/**
 * 只读传入正文（项目根 gradle.properties / 根 build.gradle），不递归子模块。
 */
export function detectMinecraftVersion(opts: {
  gradleProperties?: string;
  buildGradle?: string;
}): string {
  const props = opts.gradleProperties ?? "";
  const bg = opts.buildGradle ?? "";

  const fromProps =
    props.match(/^\s*minecraft_version\s*=\s*([^\s#]+)/m)?.[1] ??
    props.match(/^\s*mod_minecraft_version\s*=\s*([^\s#]+)/m)?.[1] ??
    props.match(/^\s*mc_version\s*=\s*([^\s#]+)/m)?.[1] ??
    props.match(/^\s*minecraftVersion\s*=\s*([^\s#]+)/m)?.[1] ??
    props.match(/^\s*mcVersion\s*=\s*([^\s#]+)/m)?.[1] ??
    props.match(/^\s*modMinecraftVersion\s*=\s*([^\s#]+)/m)?.[1];
  const neoVerRaw = props.match(/^\s*neo_version\s*=\s*([^\s#]+)/m)?.[1];
  // neo_version 在 MDK 里常是加载器版本（21.1.x），只有本身是合法 MC token 才当 MC 版本。
  // 旧式在这里另写一份 `/^(1|26|27)\.\d/` 字面量（V-8/9/11/14 收口）：先复用 extractDottedVersion
  // 抽段，再交给既有 isExactMcVersionToken 判定，1.20.1 / 1.21.1 / 26.1 / 27.0.1 结论不变，
  // 21.1.192（加载器版本）照旧拒绝。
  const neoCandidate = neoVerRaw ? extractDottedVersion(neoVerRaw) : null;
  const neoAsMc = neoCandidate && isExactMcVersionToken(neoCandidate) ? neoCandidate : undefined;
  const propsHit = fromProps ?? neoAsMc;
  if (propsHit) {
    const v = extractDottedVersion(propsHit);
    if (v) return v;
  }

  const fromBgEq =
    bg.match(/minecraft_version\s*=\s*['"]([^'"]+)['"]/) ??
    bg.match(/minecraft_version\s*=\s*(\d+\.\d+(?:\.\d+)?)/);
  if (fromBgEq) {
    const v = extractDottedVersion(fromBgEq[1]);
    if (v) return v;
  }

  const fromMinecraftCall =
    bg.match(/minecraft\s*\(\s*['"]([^'"]+)['"]/) ??
    bg.match(/minecraft\s+['"]([^'"]+)['"]/);
  if (fromMinecraftCall) {
    const v = extractDottedVersion(fromMinecraftCall[1]);
    if (v) return v;
  }

  const forgeCoord = bg.match(/net\.minecraftforge:forge:(\d+\.\d+(?:\.\d+)?)-/);
  if (forgeCoord) return forgeCoord[1];

  return "unknown";
}

/** 根未命中版本时，只读 settings.gradle 一层 include 子工程的 gradle.properties。 */
export function detectMinecraftVersionFromIncludedSubprojects(opts: {
  settingsGradle?: string;
  readSubprojectProperties: (includeName: string) => string | undefined;
}): string {
  const settings = opts.settingsGradle ?? "";
  const names: string[] = [];
  const re = /include\s*\(?\s*['"]([^'"]+)['"]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(settings))) {
    const name = m[1].replace(/\\/g, "/").split("/")[0]?.trim();
    if (!name || name === "." || name === "..") continue;
    if (PROJECT_SCAN_SKIP_DIRS.has(name)) continue;
    names.push(name);
    if (names.length >= 8) break;
  }
  for (const name of names) {
    const props = opts.readSubprojectProperties(name);
    if (!props?.trim()) continue;
    const v = detectMinecraftVersion({ gradleProperties: props });
    if (v !== "unknown") return v;
  }
  return "unknown";
}

/** 版本段白名单：只允许数字与点。不作 MC 精确 token 判定（勿用 isExactMcVersionToken 当路径门）。 */
export const VERSION_SEGMENT_RE = /^\d+(\.\d+)*$/;

/** 路径安全的版本段：拒绝 `..` 与 `\/`，禁止借 forge_${version} 越出 data 根。 */
export function isSafeVersionSegment(version: string): boolean {
  if (!VERSION_SEGMENT_RE.test(version)) return false;
  if (version.includes("..") || /[\\/]/.test(version)) return false;
  return true;
}

/** 精确 MC 版本 token（禁止 1.20.4-beta / 26.1beta / 前缀误匹配 26.12）。 */
export function isExactMcVersionToken(s: string): boolean {
  const t = s.trim();
  return /^(1|26|27)\.\d+(\.\d+)?$/.test(t);
}

/** input 必须与 pinned 整段相等；前缀匹配一律 false。 */
export function matchesExactMcVersion(input: string, pinned: string): boolean {
  const a = input.trim();
  const b = pinned.trim();
  if (!isExactMcVersionToken(a) || !isExactMcVersionToken(b)) return false;
  return a === b;
}

/**
 * 版本族匹配：`26.1` 命中 `26.1` / `26.1.2`，不命中 `26.12`。
 * `family` 与 `input` 均须通过 isExactMcVersionToken（family 允许缺 patch）。
 */
export function isMcVersionFamily(input: string, family: string): boolean {
  const a = input.trim();
  const b = family.trim();
  if (!isExactMcVersionToken(a) || !isExactMcVersionToken(b)) return false;
  const partsA = a.split(".");
  const partsB = b.split(".");
  if (partsB.length > partsA.length) return false;
  return partsB.every((p, i) => p === partsA[i]);
}

export type McVersionBand =
  | "1.20.1"
  | "1.20.4"
  | "1.20.x"
  | "1.21.x"
  | "26.x"
  | "1.18-1.19"
  | "1.16.5"
  | "1.12.2"
  | "unknown"
  | "other";

export function classifyMinecraftVersion(version: string): McVersionBand {
  const v = version.trim();
  if (!v || v === "unknown") return "unknown";
  if (v === "1.20.1") return "1.20.1";
  if (v === "1.20.4") return "1.20.4";
  if (v === "1.20" || v.startsWith("1.20.")) return "1.20.x";
  if (v === "1.21" || v.startsWith("1.21.")) return "1.21.x";
  if (v === "26" || v.startsWith("26.")) return "26.x";
  if (v.startsWith("1.18.") || v.startsWith("1.19.") || v === "1.18" || v === "1.19") {
    return "1.18-1.19";
  }
  if (v === "1.16.5" || v.startsWith("1.16.")) return "1.16.5";
  if (v === "1.12.2" || v.startsWith("1.12.")) return "1.12.2";
  return "other";
}
