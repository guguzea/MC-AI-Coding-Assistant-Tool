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

/** Strip `#layer0` fragments and `namespace:` prefix; empty after `#` is not a path. */
export function normalizeTextureRef(ref: string): string | null {
  const noHash = ref.split("#")[0]?.trim() ?? "";
  if (!noHash) return null;
  const withoutNs = noHash.includes(":") ? noHash.slice(noHash.indexOf(":") + 1) : noHash;
  return withoutNs.replace(/^\/+/, "").replace(/\\/g, "/");
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
  const textureByKey = new Map<string, string>();
  for (const p of all) {
    const r = rel(p);
    const key = textureKeyFromRel(r);
    if (key) textureByKey.set(key, r);
  }
  const referenced = new Set<string>();
  const referencedKeys = new Set<string>();

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

  for (const tex of referenced) {
    const key = normalizeTextureRef(tex);
    if (!key) continue;
    referencedKeys.add(key);
    if (!textureByKey.has(key) && ![...textureByKey.keys()].some((k) => textureKeysAlign(k, key))) {
      issues.push({ severity: "warn", path: tex, message: "模型引用的纹理未在资源树中找到对应 .png" });
    }
  }

  const orphanTextures = [...textureByKey.entries()]
    .filter(([key]) => !referencedKeys.has(key) && ![...referencedKeys].some((ref) => textureKeysAlign(key, ref)))
    .map(([, path]) => path);

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
