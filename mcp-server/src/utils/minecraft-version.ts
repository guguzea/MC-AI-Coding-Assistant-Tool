/**
 * 从 gradle.properties / 根 build.gradle 推断 Minecraft 版本。
 * 不能确定时返回 "unknown"，禁止默认 1.20.1。
 */

function stripQuotes(raw: string): string {
  return raw.replace(/^["']|["']$/g, "").trim();
}

function extractDottedVersion(raw: string): string | null {
  const m = stripQuotes(raw).match(/(\d+\.\d+(?:\.\d+)?)/);
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
    props.match(/^\s*minecraft_version\s*=\s*(\S+)/m)?.[1] ??
    props.match(/^\s*mod_minecraft_version\s*=\s*(\S+)/m)?.[1] ??
    props.match(/^\s*mc_version\s*=\s*(\S+)/m)?.[1] ??
    props.match(/^\s*minecraftVersion\s*=\s*(\S+)/m)?.[1] ??
    props.match(/^\s*mcVersion\s*=\s*(\S+)/m)?.[1] ??
    props.match(/^\s*modMinecraftVersion\s*=\s*(\S+)/m)?.[1];
  const neoVerRaw = props.match(/^\s*neo_version\s*=\s*(\S+)/m)?.[1];
  // neo_version 在 MDK 里常是加载器版本（21.1.x），只有写成 1.x / 26.x 才当 MC 版本
  const neoAsMc =
    neoVerRaw && /^(1|26)\.\d/.test(stripQuotes(neoVerRaw)) ? neoVerRaw : undefined;
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

export type McVersionBand =
  | "1.20.1"
  | "1.20.4"
  | "1.20.x"
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
  if (v.startsWith("1.20.")) return "1.20.x";
  if (v.startsWith("1.18.") || v.startsWith("1.19.") || v === "1.18" || v === "1.19") {
    return "1.18-1.19";
  }
  if (v === "1.16.5" || v.startsWith("1.16.")) return "1.16.5";
  if (v === "1.12.2" || v.startsWith("1.12.")) return "1.12.2";
  return "other";
}
