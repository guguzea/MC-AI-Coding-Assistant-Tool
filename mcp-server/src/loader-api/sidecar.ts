import { createHash } from "crypto";
import { closeSync, existsSync, openSync, readFileSync, readSync } from "fs";
import { actionable, type ActionEnvelope } from "../utils/actionable.js";

export type SidecarInfo = {
  schemaVersion?: string;
  mappingsVersion?: string;
  mappingsSource?: string;
  sourceJarSha256?: string;
  path?: string;
};

export function sha256Buffer(buf: Buffer): string {
  return createHash("sha256").update(buf).digest("hex");
}

export function sha256File(filePath: string): string {
  const h = createHash("sha256");
  const fd = openSync(filePath, "r");
  try {
    const buf = Buffer.allocUnsafe(64 * 1024);
    let n: number;
    while ((n = readSync(fd, buf, 0, buf.length, null)) > 0) {
      h.update(buf.subarray(0, n));
    }
    return h.digest("hex");
  } finally {
    closeSync(fd);
  }
}

/** 优先 `<jar>.sidecar` JSON，其次 `<jar>.mappings.json`，再次旁边 gradle.properties。 */
export function readSidecar(jarPath: string): SidecarInfo {
  const jsonSide = `${jarPath}.sidecar`;
  if (existsSync(jsonSide)) {
    try {
      const j = JSON.parse(readFileSync(jsonSide, "utf8")) as SidecarInfo;
      if (j.mappingsVersion) {
        return {
          schemaVersion: j.schemaVersion ? String(j.schemaVersion) : undefined,
          mappingsVersion: String(j.mappingsVersion),
          mappingsSource: j.mappingsSource ? String(j.mappingsSource) : "json-sidecar",
          sourceJarSha256: j.sourceJarSha256 ? String(j.sourceJarSha256) : undefined,
          path: jsonSide,
        };
      }
    } catch {
      /* fall through */
    }
  }
  const mappingsJson = `${jarPath}.mappings.json`;
  if (existsSync(mappingsJson)) {
    try {
      const j = JSON.parse(readFileSync(mappingsJson, "utf8")) as {
        mappingsVersion?: string;
        from?: string;
      };
      if (j.mappingsVersion) {
        return {
          mappingsVersion: String(j.mappingsVersion),
          mappingsSource: j.from ? String(j.from) : "gradle.properties-sidecar",
          path: mappingsJson,
        };
      }
    } catch {
      /* fall through */
    }
  }
  return {};
}

export const SIDECAR_SCHEMA_VERSION = "1";

export function sidecarSchemaCompatible(
  schemaVersion?: string,
): { ok: true } | { ok: false; action: ActionEnvelope } {
  if (!schemaVersion) return { ok: true };
  if (schemaVersion === SIDECAR_SCHEMA_VERSION) return { ok: true };
  return {
    ok: false,
    action: actionable(
      "INVALID_INPUT",
      `sidecar schemaVersion=${schemaVersion} 不兼容（需要 ${SIDECAR_SCHEMA_VERSION}）`,
      ["更新 sidecar 或重新 ingest"],
    ),
  };
}

export function assertCacheFresh(opts: {
  jarSha256: string;
  summarySha?: string;
  sidecarMappings?: string;
  targetMappings: string;
}): { ok: true } | { ok: false; code: "CACHE_STALE"; action: ActionEnvelope } {
  if (opts.summarySha && opts.summarySha !== opts.jarSha256) {
    return {
      ok: false,
      code: "CACHE_STALE",
      action: actionable(
        "CACHE_STALE",
        "cache 中 jar 的 sha256 与摘要/sidecar 不一致，禁止用旧源码树写新 mappings 标签。",
        ["传入 force=true 覆盖 overlay 摘要", "或删除 overlay JSON 后再 ingest（不要无 force 循环调用）"],
      ),
    };
  }
  if (opts.sidecarMappings && opts.sidecarMappings !== opts.targetMappings) {
    return {
      ok: false,
      code: "CACHE_STALE",
      action: actionable(
        "CACHE_STALE",
        `sidecar mappingsVersion=${opts.sidecarMappings} 与目标 ${opts.targetMappings} 不一致。`,
        ["更新 sidecar 或重新拉取对应 mappings 的 sources jar"],
      ),
    };
  }
  return { ok: true };
}
