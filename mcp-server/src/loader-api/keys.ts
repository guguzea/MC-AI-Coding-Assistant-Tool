import { existsSync, readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { actionable, type ActionEnvelope } from "../utils/actionable.js";

export const USER_INGEST_KEYS: ReadonlyArray<{
  key: string;
  platform: string;
  minecraftVersion: string;
  reason: string;
}> = [
  { key: "1.12.2-liteloader", platform: "liteloader", minecraftVersion: "1.12.2", reason: "forbidden_redistribute" },
  { key: "1.10.2-liteloader", platform: "liteloader", minecraftVersion: "1.10.2", reason: "forbidden_redistribute" },
  { key: "1.8.9-liteloader", platform: "liteloader", minecraftVersion: "1.8.9", reason: "forbidden_redistribute" },
  { key: "1.13.2-rift", platform: "rift", minecraftVersion: "1.13.2", reason: "Rift-MDK 无 LICENSE，禁止官方代下" },
  { key: "1.6.4-modloader", platform: "modloader", minecraftVersion: "1.6.4", reason: "无官方 Gradle API 坐标" },
  { key: "1.5.2-modloader", platform: "modloader", minecraftVersion: "1.5.2", reason: "无官方 Gradle API 坐标" },
  { key: "1.2.5-modloader", platform: "modloader", minecraftVersion: "1.2.5", reason: "无官方 Gradle API 坐标" },
];

const FORGE_NO_SOURCES = new Set(["1.7.10", "1.8.9", "1.9.4", "1.10.2", "1.11.2"]);

export function mcpServerRoot(): string {
  return join(dirname(fileURLToPath(import.meta.url)), "..", "..");
}

export function officialSummariesDir(): string {
  return join(mcpServerRoot(), "data", "loader-api-summaries");
}

// 平台/版本名会拼进缓存路径（${v}-${p}），字符白名单用于阻断路径分隔符与 DOTDOT 穿越
const KEY_CHAR_PATTERN = /^(?!\.)(?!.*\.\.)[A-Za-z0-9_.-]+$/;

/**
 * loader-api 认识的平台。字符白名单只挡路径穿越，挡不住 `platform=bogus`：
 * 未知平台会拼出 `1.20.1-bogus` 且无命中 ⇒ 落进 LOADER_API_NOT_INDEXED + exit 0，
 * 把「输入写错」伪装成「本档没摘要」。这里补一层枚举，未知平台一律 INVALID_INPUT。
 */
const LOADER_API_PLATFORMS = new Set([
  "forge",
  "neoforge",
  "fabric",
  "quilt",
  "liteloader",
  "rift",
  "modloader",
  "bedrock",
]);

export function candidateKeysSafe(
  platform: string,
  minecraftVersion: string,
): { ok: true; keys: string[] } | { ok: false; action: ActionEnvelope } {
  const p = platform.trim().toLowerCase();
  const v = minecraftVersion.trim();
  if (!KEY_CHAR_PATTERN.test(p) || !KEY_CHAR_PATTERN.test(v)) {
    return {
      ok: false,
      action: actionable("INVALID_INPUT", `非法 platform/minecraftVersion 字符：${JSON.stringify({ platform, minecraftVersion })}`, [
        "只用字母、数字、点、下划线、连字符",
        "不要含路径分隔符或 ..",
      ]),
    };
  }
  if (!LOADER_API_PLATFORMS.has(p)) {
    return {
      ok: false,
      action: actionable("INVALID_INPUT", `未知 platform：${platform}。`, [
        `platform ∈ ${[...LOADER_API_PLATFORMS].join(" | ")}`,
        "基岩版请用 search_bedrock_docs / validate_addon_manifest",
      ]),
    };
  }
  return { ok: true, keys: keysFor(p, v) };
}

/**
 * 内部读路径用的候选键：**不做平台枚举**。
 *
 * 枚举（`LOADER_API_PLATFORMS`）只属于**用户输入边界**（`query_loader_api` / `search_loader_api` /
 * `ingest_loader_api` 的 platform 参数，走 `candidateKeysSafe`）。本函数被 `store.findSummary()` 调用，
 * 键可能来自 `ingest_loader_api` 自备 jar 的任意平台名，也可能来自测试夹具的 probe 平台 ——
 * 用 8 个枚举值卡这里会让**已经合法 ingest 的摘要读不出来**（表现像"没索引"）。
 * 字符白名单与枚举是两件事：前者挡路径穿越（键会拼进缓存路径，必须保留），后者挡用户打错字。
 */
export function candidateKeys(platform: string, minecraftVersion: string): string[] {
  const p = platform.trim().toLowerCase();
  const v = minecraftVersion.trim();
  if (!KEY_CHAR_PATTERN.test(p) || !KEY_CHAR_PATTERN.test(v)) return [];
  return keysFor(p, v);
}

function keysFor(p: string, v: string): string[] {
  if (p === "quilt") return [`${v}-qsl`, `${v}-quilt`];
  if (p === "fabric") return [`${v}-fabric-api`, `${v}-fabric`];
  if (p === "neoforge") {
    const short = v.startsWith("26.") ? v.replace(/^(\d+\.\d+).*/, "$1") : v;
    return [...new Set([`${short}-neoforge`, `${v}-neoforge`])];
  }
  return [`${v}-${p}`];
}

export function parseKey(key: string): { minecraftVersion: string; platform: string } | null {
  const m = key.match(/^(.+)-(neoforge|forge|fabric-api|fabric|qsl|quilt|liteloader|rift|modloader)$/i);
  if (!m) return null;
  const platform = m[2].toLowerCase() === "fabric-api" ? "fabric" : m[2].toLowerCase() === "qsl" ? "quilt" : m[2].toLowerCase();
  return { minecraftVersion: m[1], platform };
}

export function howToIngestCli(platform: string, minecraftVersion: string): string {
  return (
    `node dist/cli.js ingest_loader_api --platform=${platform} --minecraftVersion=${minecraftVersion}` +
    ` --jarPath=<abs> --mappingsVersion=<必填>`
  );
}

export function skippedIngestMeta(platform: string, minecraftVersion: string) {
  const p = platform.trim().toLowerCase();
  const v = minecraftVersion.trim();
  return USER_INGEST_KEYS.find((k) => k.platform === p && k.minecraftVersion === v);
}

export function isNoJavaIngest(platform: string, minecraftVersion: string): boolean {
  const p = platform.trim().toLowerCase();
  const v = minecraftVersion.trim();
  if (p === "bedrock") return true;
  if (p === "forge" && FORGE_NO_SOURCES.has(v)) return true;
  return false;
}

/** 未识别加载器的中性去处：跨平台版本清单工具，不再默认 Forge。 */
const UNKNOWN_LOADER_TOOL = "list_doc_versions";

export function docsToolForPlatform(platform: string): string {
  const p = platform.trim().toLowerCase();
  if (p === "fabric" || p === "quilt") return "search_fabric_docs";
  if (p === "neoforge") return "search_neoforge_docs";
  if (p === "bedrock") return "search_bedrock_docs";
  if (p === "liteloader" || p === "rift" || p === "modloader") return "search_docs";
  if (p === "forge") return "search_forge_docs";
  return UNKNOWN_LOADER_TOOL;
}

export function notIndexedAction(platform: string, minecraftVersion: string): ActionEnvelope {
  const docs = docsToolForPlatform(platform);
  const known = docs !== UNKNOWN_LOADER_TOOL;
  return actionable(
    "LOADER_API_NOT_INDEXED",
    `没有 ${platform} ${minecraftVersion} 的 loader-api 摘要（禁止用邻版冒充）。`,
    known
      ? [`改用 ${docs}`, "确认 platform + minecraftVersion 与知识库档一致"]
      : [
          `platform=${platform} 不在已入库加载器清单里：先 ${UNKNOWN_LOADER_TOOL} 看本仓到底建了哪些平台的档`,
          "先确认工程实际加载器（Quilt / NeoForge / Fabric / Forge / LiteLoader / Rift / ModLoader / 基岩 Add-On），再选对应的 search_*_docs",
          "有合法取得的 jar 就 ingest_loader_api 自备摘要，禁止拿邻版或别家加载器摘要冒充",
        ],
    known ? [docs] : [UNKNOWN_LOADER_TOOL, "query_loader_api"],
  );
}

export function platformSkippedAction(
  platform: string,
  minecraftVersion: string,
  reason: string,
  allowIngest: boolean,
): ActionEnvelope {
  const steps = allowIngest
    ? [
        reason,
        `自备已合法取得的 jar 后：${howToIngestCli(platform, minecraftVersion)}`,
        "先 dryRun，再 --dry-run=false --confirm；jar 用 --jarPath= 绝对路径，不要用 --file",
      ]
    : [reason, `改用 ${docsToolForPlatform(platform)}（本档无 Java loader ingest）`];
  return actionable("PLATFORM_SKIPPED", `官方不代下 ${platform} ${minecraftVersion} 的 loader jar。`, steps, [
    allowIngest ? "ingest_loader_api" : docsToolForPlatform(platform),
  ]);
}

export function readSkippedCatalog(): {
  keys: typeof USER_INGEST_KEYS;
  noIngest: Array<{ platform: string; versions?: string[]; reason: string }>;
  mavenNotIndexed?: Array<{ key: string; platform: string; minecraftVersion: string; reason: string }>;
} {
  const p = join(officialSummariesDir(), "skipped-ingest.json");
  if (!existsSync(p)) {
    return {
      keys: [...USER_INGEST_KEYS],
      noIngest: [
        { platform: "bedrock", reason: "不是 Java loader jar" },
        { platform: "forge", versions: [...FORGE_NO_SOURCES], reason: "仅 javadoc / search_docs，不走 sources 管线" },
      ],
      mavenNotIndexed: [],
    };
  }
  try {
    const parsed = JSON.parse(readFileSync(p, "utf8")) as ReturnType<typeof readSkippedCatalog>;
    return {
      keys: parsed.keys ?? [...USER_INGEST_KEYS],
      noIngest: parsed.noIngest ?? [],
      mavenNotIndexed: parsed.mavenNotIndexed ?? [],
    };
  } catch {
    return { keys: [...USER_INGEST_KEYS], noIngest: [], mavenNotIndexed: [] };
  }
}
