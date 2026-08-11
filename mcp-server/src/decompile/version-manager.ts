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
  /** 26.1+（major>=2）：去混淆，免 remap，仅 mojmap */
  unobfuscated: boolean;
  /** 是否支持反编译管线（1.14–1.21.11 与 26.1+） */
  supported: boolean;
}

const RELEASE_RE = /^(\d+)\.(\d+)(?:\.(\d+))?$/;

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

  const major = Number(m[1]);
  const minor = Number(m[2]);
  const patch = m[3] !== undefined ? Number(m[3]) : null;

  // 26.1+ 去混淆时代（版本号已改到 major>=2）
  if (major >= 2) {
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
      error: `无法识别的版本「${version}」`,
      major,
      minor,
      patch,
      hasYarn: false,
      unobfuscated: false,
      supported: false,
    };
  }

  // 1.14 – 1.21.x：yarn 两步 remap
  if (minor >= 14 && minor <= 21) {
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
        "1.14 以下版本无 yarn/mojmap 反编译支持（支持区间：1.14–1.21.11 与 26.1+）",
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
    error: `未知版本区间「${version}」（支持区间：1.14–1.21.11 与 26.1+）`,
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
