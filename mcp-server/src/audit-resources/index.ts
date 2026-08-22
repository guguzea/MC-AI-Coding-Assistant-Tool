import { existsSync, readFileSync } from "fs";
import { join, relative } from "path";
import { walkDirBounded } from "../utils/project-files.js";

export interface AuditResourcesInput {
  resourceRoot: string;
  modId?: string;
}

export interface AuditResourcesResult {
  ok: boolean;
  scannedFiles: number;
  issues: Array<{ severity: "error" | "warn"; path: string; message: string }>;
  referencedTextures: string[];
  orphanTextures: string[];
}

const TEX_EXT = /\.(png|mcmeta)$/i;
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
  const textures = new Set(all.filter((p) => TEX_EXT.test(p)).map(rel));
  const referenced = new Set<string>();

  for (const file of all) {
    const r = rel(file);
    if (!MODEL_EXT.test(file) || !r.includes("/models/")) continue;
    try {
      const json = JSON.parse(readFileSync(file, "utf8")) as unknown;
      collectModelTextures(json, referenced);
    } catch {
      issues.push({ severity: "error", path: r, message: "模型 JSON 解析失败" });
    }
  }

  for (const tex of referenced) {
    const candidates = [
      `textures/${tex}.png`,
      `textures/${tex.replace(/^minecraft:/, "")}.png`,
      `${tex}.png`,
    ];
    const found = candidates.some((c) => textures.has(c) || [...textures].some((t) => t.endsWith(c)));
    if (!found) {
      issues.push({ severity: "warn", path: tex, message: "模型引用的纹理未在资源树中找到对应 .png" });
    }
  }

  const orphanTextures = [...textures].filter((t) => {
    const key = t.replace(/^textures\//, "").replace(/\.png$/i, "");
    return ![...referenced].some((ref) => ref === key || ref.endsWith(key));
  });

  if (input.modId && /[A-Z-]/.test(input.modId)) {
    issues.push({
      severity: "warn",
      path: input.modId,
      message: "modId 含大写或连字符，资源路径应全小写并使用下划线",
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
