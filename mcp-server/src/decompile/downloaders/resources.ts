/**
 * 运行时 Java 工具 jar 定义与按需下载（VineFlower / tiny-remapper）。
 *
 * - 不随包分发、不在构建期下载：仅用户显式调用反编译工具时下载到 $CACHE/resources/。
 * - 版本固定 + SHA256 常量校验。哈希取自本机已缓存工件的实测值（未逐一与远端重新比对）：
 *   因此远端字节若与常量不符，下载会**明确失败**而不是静默采用不同内容。
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

/** tiny-remapper 0.14.0 thin jar（Fabric maven）。**不含** ASM / mapping-io，
 *  必须与 TINY_REMAPPER_CLASSPATH_DEFS 一起用 `java -cp … net.fabricmc.tinyremapper.Main` 运行
 *  （实测 `java -jar` 只够打印 usage，真实 remap → ClassNotFoundException）。
 *  0.14.0 已删 `--forceLocal`，且只读 Tiny **v2**。 */
export const TINY_REMAPPER_DEF: ResourceDef = {
  id: "tiny-remapper",
  version: "0.14.0",
  url: "https://maven.fabricmc.net/net/fabricmc/tiny-remapper/0.14.0/tiny-remapper-0.14.0.jar",
  sha256: "0a86f606ca086bd7f90cededa884d23d014696a7d97a8bedc159f9efc5e6026a",
  note: "JAR remapper（Apache-2.0；thin jar）",
};

const ASM_VERSION = "9.9.1";

/** tiny-remapper 0.14.0 的 ASM 依赖（Maven Central，org.ow2:asm） */
function asmDef(artifact: string, sha256: string): ResourceDef {
  return {
    id: artifact,
    version: ASM_VERSION,
    url: `https://repo1.maven.org/maven2/org/ow2/asm/${artifact}/${ASM_VERSION}/${artifact}-${ASM_VERSION}.jar`,
    sha256,
    note: `tiny-remapper 运行期依赖（ASM ${artifact}）`,
  };
}

/** mapping-io 0.7.1（Fabric maven；tiny-remapper 0.14 的映射读取层） */
export const MAPPING_IO_DEF: ResourceDef = {
  id: "mapping-io",
  version: "0.7.1",
  url: "https://maven.fabricmc.net/net/fabricmc/mapping-io/0.7.1/mapping-io-0.7.1.jar",
  sha256: "1419e8ee795ca3cf86f707a6a2f10e613257e9c1ce91a1101602c07b7cff7a48",
  note: "tiny-remapper 运行期依赖（mapping-io）",
};

/**
 * 运行 `net.fabricmc.tinyremapper.Main` 所需的全部依赖 jar（不含主 jar）。
 * 实测：缺一即 NoClassDefFoundError，全齐才能完成 remap。
 */
export const TINY_REMAPPER_CLASSPATH_DEFS: readonly ResourceDef[] = [
  asmDef("asm", "6f3828a215c920059a5efa2fb55c233d6c54ec5cadca99ce1b1bdd10077c7ddd"),
  asmDef("asm-commons", "c2319e014ce7199f2b7f7d56d6bb991863168c3f4b6cd6c9f542a4937ef7ef88"),
  asmDef("asm-tree", "0f3555096b720b820bbacab0b515589bee0200bee099bda14c561738ae837ba1"),
  asmDef("asm-analysis", "6260bffc8ec008dd1b713702c7994e2c94d188a3da5bef9e87278a16df6a7522"),
  asmDef("asm-util", "c5ebbbeaf68126af094b42fa4800f59bc4413abd02d95b9aefad722cd257e207"),
  MAPPING_IO_DEF,
];

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

/**
 * tiny-remapper 运行所需的**全部** jar（主 jar 在前，依赖在后），可直接拼进 `java -cp`。
 * 主 jar 是 thin jar，单独 `java -jar` 会在真实 remap 时 ClassNotFoundException。
 */
export async function ensureTinyRemapperJars(
  opts: { cacheRoot?: string; force?: boolean } = {},
): Promise<string[]> {
  const jars = [await ensureResourceJar(TINY_REMAPPER_DEF, opts)];
  for (const def of TINY_REMAPPER_CLASSPATH_DEFS) {
    jars.push(await ensureResourceJar(def, opts));
  }
  return jars;
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
