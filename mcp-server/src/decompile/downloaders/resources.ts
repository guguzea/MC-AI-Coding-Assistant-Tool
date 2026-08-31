/**
 * 运行时 Java 工具 jar 定义与按需下载（VineFlower / tiny-remapper）。
 *
 * - 不随包分发、不在构建期下载：仅用户显式调用反编译工具时下载到 $CACHE/resources/。
 * - 版本固定 + SHA256 常量校验（取自 2026-08 官方仓库实测值）。
 * - MC_SKILL_SKIP_DOWNLOAD=1 → 抛 DownloadDisabled（上层转 actionable）。
 *
 * 许可：VineFlower（LGPL-3.0，Maven Central）、tiny-remapper（Apache-2.0，Fabric maven）。
 * 见根目录 THIRD_PARTY_NOTICES.md。
 */

import { existsSync } from "fs";
import { join } from "path";
import { downloadFile, DownloadError, fileSha256 } from "./http.js";
import { ensureCachePaths, openCacheDb, setArtifact } from "../cache.js";
import { skipDownloadsEnabled } from "../java/java-process.js";

export interface ResourceDef {
  id: string;
  version: string;
  url: string;
  sha256: string;
  note: string;
}

/** VineFlower 1.10.1（Maven Central；2026-08 实测 SHA256） */
export const VINEFLOWER_DEF: ResourceDef = {
  id: "vineflower",
  version: "1.10.1",
  url: "https://repo1.maven.org/maven2/org/vineflower/vineflower/1.10.1/vineflower-1.10.1.jar",
  sha256: "b9b208e50793b64657a6b6292067526613f549de7405f9243624b02f4276e409",
  note: "Java 17+ 反编译器（LGPL-3.0）",
};

/** tiny-remapper 0.14.0 fat（含 ASM + mapping-io；0.14.0 已删 --forceLocal） */
export const TINY_REMAPPER_DEF: ResourceDef = {
  id: "tiny-remapper",
  version: "0.14.0-fat",
  url: "https://maven.fabricmc.net/net/fabricmc/tiny-remapper/0.14.0/tiny-remapper-0.14.0-fat.jar",
  sha256: "9dbaf8030981338373abe029cd9c07732bff437887a56de1735ba2c3c76b0acf",
  note: "JAR remapper fat（Apache-2.0；内含 ASM / mapping-io）",
};

export class DownloadDisabledError extends Error {
  code = "DOWNLOAD_DISABLED";
  constructor(detail: string) {
    super(`下载已禁用（MC_SKILL_SKIP_DOWNLOAD=1）: ${detail}`);
  }
}

function resourcePath(root: string, def: ResourceDef): string {
  return join(root, "resources", `${def.id}-${def.version}.jar`);
}

/**
 * 确保资源 jar 存在且哈希正确。返回 jar 绝对路径。
 * 已存在且哈希匹配 → 直接复用；不匹配 → 重下；缺失 → 按需下载（skip 门控）。
 */
export async function ensureResourceJar(
  def: ResourceDef,
  opts: { cacheRoot?: string; force?: boolean } = {},
): Promise<string> {
  const cache = ensureCachePaths(opts.cacheRoot);
  const dest = resourcePath(cache.root, def);
  const db = openCacheDb(cache.root);
  try {
    if (!opts.force && existsSync(dest)) {
      const got = fileSha256(dest);
      if (got === def.sha256) {
        setArtifact(db, `resource:${def.id}`, "resource", dest, {
          version: def.version,
          sha256: got,
        });
        return dest;
      }
      // 哈希不匹配 → 陈旧缓存，重下（不静默复用）
    }

    if (skipDownloadsEnabled()) {
      throw new DownloadDisabledError(`${def.id} ${def.version} 未缓存于 ${dest}`);
    }

    const result = await downloadFile(def.url, dest, {
      expectedSha256: def.sha256,
      label: `${def.id} ${def.version}`,
    });
    setArtifact(db, `resource:${def.id}`, "resource", dest, {
      version: def.version,
      sha256: result.sha256,
    });
    return dest;
  } finally {
    db.close();
  }
}

/** 可操作错误信封（供服务层统一转译） */
export function resourceActionable(err: DownloadError | DownloadDisabledError) {
  if (err instanceof DownloadDisabledError) {
    return {
      code: err.code,
      message: err.message,
      nextSteps: ["取消 MC_SKILL_SKIP_DOWNLOAD=1 后重试，或手动预置 jar 到 $MC_SKILL_CACHE/resources/"],
    };
  }
  if (err instanceof DownloadError) {
    return {
      code: err.code,
      message: err.message,
      nextSteps: ["检查网络后重试", "或手动下载到 $MC_SKILL_CACHE/resources/ 后重试（哈希须匹配）"],
    };
  }
  return { code: "RESOURCE_ERROR", message: String(err), nextSteps: [] };
}
