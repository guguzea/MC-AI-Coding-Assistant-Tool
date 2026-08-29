import { existsSync, readFileSync } from "fs";
import { join, relative } from "path";
import { walkDirBounded } from "../utils/project-files.js";
import { parseJsonUtf8 } from "../utils/json-utf8.js";

export interface AuditResourcesInput {
  resourceRoot: string;
  modId?: string;
}

export interface AuditResourcesResult {
  ok: boolean;
  scannedFiles: number;
  issues: Array<{ severity: "error" | "warn"; path: string; message: string }>;
  referencedTextures: string[] ;
  orphanTextures: string[];
}

const PNG_EXT = /\.png$/i;
const MODEL_EXT = /\.json$/i;

function walkFiles(root: string): string[] {
  if (!existsSync(root)) return [];
  return walkDirBounded(root, { maxDepth: 16, allFiles: true });
}

function collectModelTextures(obj: unknown, out: Set<string>): void {
  if (!obj || typeof obj !== "object") return;
  if (Array.isArray(obj)) {
    for (const x of obj) collectModelTextures(x, out);
    return;
  }
  const rec = obj as Record<string, unknown>;
  if (typeof rec.texture === "string") out.add(rec.texture);
  if (rec.textures && typeof rec.textures === "object") {
    for (const v of Object.values(rec.textures as Record<string, unknown>)) {
      if (typeof v === "string") out.add(v);
    }
  }
  for (const v of Object.values(rec)) collectModelTextures(v, out);
}

/**
 * 拆分纹理引用为「命名空间 + 路径」，保留命名空间信息。
 * 同时剥离 `#layer0` 片段；`#` 之后为空则不视为路径。
 *
 * 保留命名空间是关键：旧实现直接剥掉 `namespace:` 前缀，导致
 * `minecraft:block/stone` 与 `mymod:block/stone` 都塌成 `block/stone`，
 * 跨命名空间互相匹配，孤儿纹理与缺失纹理双双判定错乱。
 */
export function splitTextureRef(ref: string): { ns: string | null; path: string | null } {
  const noHash = ref.split("#")[0]?.trim() ?? "";
  if (!noHash) return { ns: null, path: null };
  const colon = noHash.indexOf(":");
  if (colon === -1) {
    return { ns: null, path: noHash.replace(/^\/+/, "").replace(/\\/g, "/") };
  }
  const ns = noHash.slice(0, colon).trim();
  const p = noHash.slice(colon + 1).replace(/^\/+/, "").replace(/\\/g, "/");
  if (!p) return { ns: null, path: null };
  return { ns: ns || null, path: p };
}

/** Strip `#layer0` fragments and `namespace:` prefix; empty after `#` is not a path. */
export function normalizeTextureRef(ref: string): string | null {
  return splitTextureRef(ref).path;
}

/** `assets/<ns>/...` → `<ns>`；非 assets 布局返回 null。 */
export function textureNamespaceFromRel(rel: string): string | null {
  const n = rel.replace(/\\/g, "/");
  const m = n.match(/(?:^|\/)assets\/([^/]+)\//);
  return m ? m[1] : null;
}

/** Path-segment aligned: `block/foo` matches `foo` only as `.../foo`, never substring `foo` in `food`. */
export function textureKeysAlign(a: string, b: string): boolean {
  if (a === b) return true;
  return a.endsWith("/" + b) || b.endsWith("/" + a);
}

/** `assets/<mod>/textures/block/foo.png` or `textures/block/foo.png` → `block/foo` */
export function textureKeyFromRel(rel: string): string | null {
  const n = rel.replace(/\\/g, "/");
  if (/\.png\.mcmeta$/i.test(n)) return null;
  if (!PNG_EXT.test(n)) return null;
  const m = n.match(/(?:^|\/)textures\/(.+)\.png$/i);
  if (m) return m[1];
  return n.replace(/\.png$/i, "");
}

export function auditResources(input: AuditResourcesInput): AuditResourcesResult {
  const root = input.resourceRoot;
  const issues: AuditResourcesResult["issues"] = [];
  if (!existsSync(root)) {
    return {
      ok: false,
      scannedFiles: 0,
      issues: [{ severity: "error", path: root, message: "资源根目录不存在" }],
      referencedTextures: [],
      orphanTextures: [],
    };
  }

  const all = walkFiles(root);
  const rel = (p: string) => relative(root, p).replace(/\\/g, "/");
  // 命名空间感知索引：ns -> (path -> rel)。
  // ns 为 "" 表示该纹理不在 assets/<ns>/ 布局下（退化为未知命名空间）。
  const texturesByNs = new Map<string, Map<string, string>>();
  for (const p of all) {
    const r = rel(p);
    const key = textureKeyFromRel(r);
    if (!key) continue;
    const ns = textureNamespaceFromRel(r) ?? "";
    if (!texturesByNs.has(ns)) texturesByNs.set(ns, new Map());
    // 旧实现用裸 key，多命名空间同名纹理会互相覆盖——这里按 ns 分桶，不再覆盖
    texturesByNs.get(ns)!.set(key, r);
  }
  const referenced = new Set<string>();

  for (const file of all) {
    const r = rel(file);
    if (!MODEL_EXT.test(file) || !r.includes("/models/")) continue;
    try {
      const json = parseJsonUtf8(readFileSync(file, "utf8")) as unknown;
      collectModelTextures(json, referenced);
    } catch {
      issues.push({ severity: "error", path: r, message: "模型 JSON 解析失败" });
    }
  }

  // 引用侧同样按命名空间分桶：ns -> Set<path>。
  // ns 为 "" 表示引用未写命名空间（"block/foo"），按宽松规则匹配任意命名空间。
  const refsByNs = new Map<string, Set<string>>();
  const recordRef = (ns: string | null, path: string | null): void => {
    if (!path) return;
    const k = ns ?? "";
    if (!refsByNs.has(k)) refsByNs.set(k, new Set());
    refsByNs.get(k)!.add(path);
  };

  for (const tex of referenced) {
    const { ns, path } = splitTextureRef(tex);
    if (!path) continue;
    recordRef(ns, path);

    // 缺失判定：写了命名空间就只在该命名空间内找；未写则宽松匹配任意命名空间。
    const found = ns
      ? [...(texturesByNs.get(ns)?.keys() ?? [])].some((k) => textureKeysAlign(k, path))
      : [...texturesByNs.values()].some((paths) =>
          [...paths.keys()].some((k) => textureKeysAlign(k, path)),
        );
    if (!found) {
      issues.push({
        severity: "warn",
        path: tex,
        message: ns
          ? `模型引用的纹理未在命名空间 ${ns} 下找到对应 .png`
          : "模型引用的纹理未在资源树中找到对应 .png",
      });
    }
  }

  // 孤儿判定：纹理未被「同命名空间引用」或「无命名空间引用」命中即为孤儿
  const orphanTextures: string[] = [];
  for (const [ns, paths] of texturesByNs) {
    for (const [key, relPath] of paths) {
      const sameNs = refsByNs.get(ns);
      const anyNs = refsByNs.get("");
      const isRef =
        (sameNs ? [...sameNs].some((p) => textureKeysAlign(key, p)) : false) ||
        (anyNs ? [...anyNs].some((p) => textureKeysAlign(key, p)) : false);
      if (!isRef) orphanTextures.push(relPath);
    }
  }

  if (input.modId && /[A-Z]/.test(input.modId)) {
    issues.push({
      severity: "warn",
      path: input.modId,
      message: "modId 含大写，资源路径应全小写并使用下划线（Fabric/Quilt 允许连字符）",
    });
  }

  return {
    ok: !issues.some((i) => i.severity === "error"),
    scannedFiles: all.length,
    issues,
    referencedTextures: [...referenced],
    orphanTextures: orphanTextures.slice(0, 50),
  };
}
