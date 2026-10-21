/**
 * Minecraft 版本解析与反编译能力分类（T2）。
 *
 * 版本区间语义（与 README 支持矩阵一致）：
 * - 1.14 – 1.21.11：yarn 可用（两步 remap official→intermediary→named）；mojmap 也可用
 * - 26.1+：去混淆时代，仅 mojmap（免 remap，jar 内已是可读名）
 * - 1.13 及更早：不支持（无 yarn / mojmap 反编译管线）
 */

export interface VersionInfo {
  /** 规范化后的版本字符串（trim 后的原样输入） */
  version: string;
  /** 语法上是否是可识别的正式版版本号 */
  valid: boolean;
  /** 不可用/不支持时的解释（valid=false 或 supported=false 时必有） */
  error?: string;
  major: number;
  minor: number;
  patch: number | null;
  /** 1.14–1.21.11：yarn 两步 remap 可用 */
  hasYarn: boolean;
  /** 26.1–26.3（实测已发布的 26.x 正式版）：去混淆，免 remap，仅 mojmap */
  unobfuscated: boolean;
  /** 是否支持反编译管线（1.14–1.21.11 与 26.1–26.3） */
  supported: boolean;
}

const RELEASE_RE = /^(\d+)\.(\d+)(?:\.(\d+))?$/;

/**
 * 1.14–1.21 各 minor 的**已发布正式版最高 patch**（D-22 上界；`:108` 分支用它拒绝
 * `1.21.999` / `1.14.50` 这类语法合法但根本不存在的版本）。
 *
 * 上界全部来自实测，不取整数猜测（两套不同机制，同日测量）：
 * - **LIVE**：GET `https://meta.fabricmc.net/v2/versions/game`，过滤 `stable: true`
 *   的正式版后按 minor 取最大 patch：
 *   `14→4, 15→2, 16→5, 17→1, 18→2, 19→4, 20→6, 21→11`
 *   （1.21.x 实测全集：1.21 / 1.21.1…1.21.11，无 1.21.12+）
 * - **CORPUS**：`list_doc_versions --platform=fabric` 与本仓 `data/*_1.21*` 目录，
 *   1.21 侧最高同为 `1.21.11`（`fabric_1.21.11` / `neoforge_1.21.11` / `quilt_1.21.11`）
 *
 * 本表键集合即 yarn 两步 remap 区间的**已发布** minor；缺键一律不放行，
 * 新 minor 发布后必须重测再补，不允许靠 `minor <= 21` 的开区间默认通过。
 */
const MAX_RELEASED_PATCH_BY_MINOR: Readonly<Record<number, number>> = {
  14: 4,
  15: 2,
  16: 5,
  17: 1,
  18: 2,
  19: 4,
  20: 6,
  21: 11,
};

/**
 * 26.x 去混淆时代**已发布正式版**的 patch 上界（与上面 1.x 的 MAX_RELEASED_PATCH_BY_MINOR 同口径：
 * 实测，不取整数猜测）。上界来自两套机制同日（2026-10-20）测量：
 * - **LIVE**：GET `https://piston-meta.mojang.com/mc/game/version_manifest_v2.json`，
 *   `type === "release"` 的 26.x 全集 = **26.1 / 26.1.1 / 26.1.2 / 26.2 / 26.3**（`latest.release = 26.3`）；
 *   26.4 只到 snapshot（`26.4-snapshot-1…4`），2.x–25.x 与 27.x 根本不存在。
 * - **CORPUS**：`https://meta.fabricmc.net/v2/versions/game` 的 stable 26x 为同一集合。
 * 裸 minor（26.2 / 26.3）记 0 ⇒ 只放行「无 patch」与 `.0` 两种写法（与 1.x 侧对 `1.21.0` 的口径一致）。
 * 新 minor 发布后必须重测再补，不允许用 `minor >= 1` 的开区间默认通过。
 */
const MAX_RELEASED_PATCH_BY_26X_MINOR: Readonly<Record<number, number>> = {
  1: 2,
  2: 0,
  3: 0,
};

export function parseMinecraftVersion(input: string): VersionInfo {
  const version = (input ?? "").trim();
  if (!version) {
    return {
      version,
      valid: false,
      error: "版本不能为空（示例：1.20.1、1.21.11、26.1）",
      major: 0,
      minor: 0,
      patch: null,
      hasYarn: false,
      unobfuscated: false,
      supported: false,
    };
  }

  if (/^\d+w\d+[a-z]?$/.test(version)) {
    return {
      version,
      valid: false,
      error: "快照版本不支持（只支持正式版，如 1.20.1 / 26.1）",
      major: 0,
      minor: 0,
      patch: null,
      hasYarn: false,
      unobfuscated: false,
      supported: false,
    };
  }

  const m = RELEASE_RE.exec(version);
  if (!m) {
    return {
      version,
      valid: false,
      error: `无法解析 MC 版本「${version}」：应形如 1.20.1 / 1.21.11 / 26.1`,
      major: 0,
      minor: 0,
      patch: null,
      hasYarn: false,
      unobfuscated: false,
      supported: false,
    };
  }

  // patch 只做数值化；**上界校验在下面的 1.14–1.21 分支用 MAX_RELEASED_PATCH_BY_MINOR 兜**
  // （D-22：`1.21.999` / `1.14.50` 语法合法但根本不存在，必须 supported:false）
  const major = Number(m[1]);
  const minor = Number(m[2]);
  const patch = m[3] !== undefined ? Number(m[3]) : null;

  // 26.x 去混淆时代（版本号已改到 major>=2）。**只放行实测已发布的正式版**：
  // 旧实现写 `major >= 2 && major <= 27`，把 2.x–25.x / 26.0 / 26.4 / 27.x 一律判成
  // 「合法 + 支持 + 去混淆」——与同仓 `mappings/unobfuscated.ts` 的时代判据、
  // 与官方 manifest（26.x 正式版只有 26.1–26.3）都相反。此处按实测收口。
  if (major === 26) {
    const maxPatch = MAX_RELEASED_PATCH_BY_26X_MINOR[minor];
    if (maxPatch === undefined || (patch !== null && patch > maxPatch)) {
      return {
        version,
        valid: true,
        error:
          `26.${minor}${patch !== null ? `.${patch}` : ""} 不是已发布的正式版：实测 26.x 正式版只有 26.1 / 26.1.1 / 26.1.2 / 26.2 / 26.3（支持区间：1.14–1.21.11 与 26.1–26.3）`,
        major,
        minor,
        patch,
        hasYarn: false,
        unobfuscated: false,
        supported: false,
      };
    }
    return {
      version,
      valid: true,
      major,
      minor,
      patch,
      hasYarn: false,
      unobfuscated: true,
      supported: true,
    };
  }

  if (major !== 1) {
    return {
      version,
      valid: true,
      // 2.x–25.x（从来没有过）与 27.x（未发布）都落这里：语法合法，但不在支持面内。
      error: `无法识别的版本「${version}」（支持区间：1.14–1.21.11 与 26.1–26.3）`,
      major,
      minor,
      patch,
      hasYarn: false,
      unobfuscated: false,
      supported: false,
    };
  }

  // 1.14 – 1.21.11：yarn 两步 remap（patch 必须落在实测的已发布上界内，D-22）
  if (minor >= 14 && minor <= 21) {
    const maxPatch = MAX_RELEASED_PATCH_BY_MINOR[minor];
    if (maxPatch === undefined || (patch !== null && patch > maxPatch)) {
      return {
        version,
        valid: true,
        error:
          maxPatch === undefined
            ? `1.${minor} 不在已发布且具备 yarn/mojmap 映射的 minor 列表内（支持区间：1.14–1.21.11 与 26.1–26.3）`
            : `1.${minor}.${patch} 不是已发布的正式版：实测 1.${minor} 最高只到 1.${minor}.${maxPatch}（支持区间：1.14–1.21.11 与 26.1–26.3）`,
        major,
        minor,
        patch,
        hasYarn: false,
        unobfuscated: false,
        supported: false,
      };
    }
    return {
      version,
      valid: true,
      major,
      minor,
      patch,
      hasYarn: true,
      unobfuscated: false,
      supported: true,
    };
  }

  if (minor < 14) {
    return {
      version,
      valid: true,
      error:
        "1.14 以下版本无 yarn/mojmap 反编译支持（支持区间：1.14–1.21.11 与 26.1–26.3）",
      major,
      minor,
      patch,
      hasYarn: false,
      unobfuscated: false,
      supported: false,
    };
  }

  return {
    version,
    valid: true,
    error: `未知版本区间「${version}」（支持区间：1.14–1.21.11 与 26.1–26.3）`,
    major,
    minor,
    patch,
    hasYarn: false,
    unobfuscated: false,
    supported: false,
  };
}

export type MappingChoice = "yarn" | "mojmap";

export interface MappingDecision {
  mapping?: MappingChoice;
  error?: string;
}

/**
 * 解析用户 mapping 选择：
 * - auto：26.1+ → mojmap；1.14–1.21.11 → yarn
 * - yarn：仅 1.14–1.21.11（26.1+ 报错）
 * - mojmap：全支持区间可用
 */
export function resolveMappingChoice(mapping: string | undefined, vi: VersionInfo): MappingDecision {
  if (mapping !== undefined && mapping !== "" && mapping !== "auto" && mapping !== "yarn" && mapping !== "mojmap") {
    return { error: `未知 mapping「${mapping}」，仅支持 auto / yarn / mojmap` };
  }
  if (mapping === "mojmap") return { mapping: "mojmap" };
  if (mapping === "yarn") {
    if (!vi.hasYarn) {
      return {
        error: `${vi.version} 无 yarn 映射（26.1+ 已去混淆，仅 mojmap，免 remap）`,
      };
    }
    return { mapping: "yarn" };
  }
  // auto / 未传
  if (!vi.hasYarn) return { mapping: "mojmap" };
  return { mapping: "yarn" };
}

/** 缓存 key 辅助：映射目录名（与 mapping 枚举一致） */
export function mappingDirName(mapping: MappingChoice): string {
  return mapping === "yarn" ? "yarn" : "mojmap";
}
