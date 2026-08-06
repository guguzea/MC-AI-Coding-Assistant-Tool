/**
 * 映射表转换模块
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │  Mojang Official ──── 反混淆表 ────► mcp / srg            │
 * │  (公开正式名)              不完整       (Forge 开发名)        │
 * │  e.g. aqm()                          e.g. getHealth()     │
 * ├─────────────────────────────────────────────────────────────┤
 * │  Parchment = MCP 层 + 人类可读参数名                         │
 * │  类名/方法名与 MCP 一致，参数名是增强                         │
 * │  ✅ 覆盖 5720 个 Vanilla 类                                 │
 * │  ❌ 不含 Forge 特有类（DeferredRegister 等）                │
 * ├─────────────────────────────────────────────────────────────┤
 * │  Yarn = Fabric 专属映射                                     │
 * │  ❌ Forge 项目中不能直接使用                                │
 * │  ✅ Architectury Loom 可构建时 Re-obfuscate                 │
 * └─────────────────────────────────────────────────────────────┘
 *
 * 本模块数据来源（按版本）：
 * - 1.7.10–1.13.2: MCP stable 映射（tsrg/csv 提取的索引）
 * - 1.14.4–1.15.2: MCP stable CSV 提取的索引
 * - 1.16.5–1.20.4: Parchment 映射
 *
 * ⚠️ 重要限制：
 *   - mojang → mcp/parchment 的转换（反向查询）需要 mojang 反混淆表
 *   - yarn ↔ mcp 转换需要专门的跨平台映射表
 *   - 当前实现基于上述数据，主要覆盖 mcp/parchment 层的正向查询
 */

import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { resolveDataDir } from "../utils/path.js";
import { convertYarnMember } from "./yarn-sqlite.js";

const DEFAULT_VERSION = "1.20.1";

/** 解析某个 Minecraft 版本的 extracted 数据目录 */
function resolveVersionDataDir(version: string): string {
  return resolveDataDir(`forge_${version}`, "extracted");
}

export interface MappingQuery {
  from: "mojang" | "mcp" | "yarn" | "parchment";
  to: "mojang" | "mcp" | "yarn" | "parchment";
  memberName: string;
  ownerClass?: string;
  descriptor?: string;
  /** Minecraft 版本（如 "1.20.1"），决定使用哪份 extracted 索引。
   *  未指定时使用 DEFAULT_VERSION (1.20.1)。 */
  version?: string;
}

export interface MappingResult {
  found: boolean;
  original: string;
  converted: string;
  direction: string;
  confidence: "high" | "medium" | "low";
  mappingType: "class" | "method" | "parameter" | "field";
  notes?: string[];
  usage?: string;
  /** Tiny official（混淆短名）；to=mojang 时与 converted 同义说明 */
  official?: string;
  /** 可读 named（mcp/yarn/parchment 层） */
  named?: string;
  intermediary?: string;
  /** 方法名相似建议（高门槛，可能为空） */
  suggestions?: string[];
}

// ── 数据加载 ─────────────────────────────────────────────────────────────

type ParchmentParam = { index: number; name: string };
type ParchmentMethod = {
  name: string;       // mcp/srg 名（混淆名）
  descriptor: string;
  parameters: ParchmentParam[];
  javadoc: string | null;
};
type ParchmentClass = {
  javadoc: string | null;
  methods: ParchmentMethod[];
  fields: unknown[];
};

const _dataCache = new Map<string, { apiIndex: Record<string, ParchmentClass>; classNames: string[] }>();

/** 加载指定版本的数据（按 version 缓存到内存） */
function loadData(version: string): { apiIndex: Record<string, ParchmentClass>; classNames: string[] } {
  const cached = _dataCache.get(version);
  if (cached) return cached;

  const dataDir = resolveVersionDataDir(version);
  const apiIndexPath = join(dataDir, "api-index.json");
  const classNamesPath = join(dataDir, "class-names.json");

  let apiIndex: Record<string, ParchmentClass> = {};
  let classNames: string[] = [];

  if (existsSync(apiIndexPath)) {
    apiIndex = JSON.parse(readFileSync(apiIndexPath, "utf-8"));
  }
  if (existsSync(classNamesPath)) {
    classNames = JSON.parse(readFileSync(classNamesPath, "utf-8"));
  }
  const data = { apiIndex, classNames };
  _dataCache.set(version, data);
  return data;
}

function toSlash(name: string): string {
  return name.replace(/\./g, "/");
}

function descriptorToReturnType(desc: string): string {
  const map: Record<string, string> = {
    "B": "byte", "C": "char", "D": "double", "F": "float",
    "I": "int", "J": "long", "S": "short", "Z": "boolean", "V": "void",
  };
  const last = desc.slice(desc.lastIndexOf(")") + 1);
  return map[last] ?? `Object(${last})`;
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

/** 高门槛方法名相似建议；过短或分数不足则返回 [] */
export function suggestSimilarMethods(
  input: string,
  methodNames: string[],
  limit = 3,
): string[] {
  if (input.length <= 4) return [];
  const lower = input.toLowerCase();
  const scored: Array<{ name: string; score: number }> = [];

  const prefixOf = (s: string) => {
    const m = s.match(/^(get|set|is|has|to|as)/i);
    return m ? m[1].toLowerCase() : "";
  };
  const inputPrefix = prefixOf(input);

  for (const name of methodNames) {
    const n = name.toLowerCase();
    if (n === lower) continue;
    const dist = levenshtein(lower, n);
    const shorter = Math.min(lower.length, n.length);
    const longer = Math.max(lower.length, n.length);
    if (shorter < lower.length * 0.7 && dist > 2) continue;

    let score = 0;
    if (n.startsWith(lower) || lower.startsWith(n.slice(0, Math.min(4, n.length)))) score += 5;
    const namePrefix = prefixOf(name);
    if (inputPrefix && namePrefix && inputPrefix === namePrefix) {
      score += 3;
      // 前缀后词干重叠（getHealth / getMaxHealth）
      const a = lower.slice(inputPrefix.length);
      const b = n.slice(namePrefix.length);
      if (a && b && (b.includes(a) || a.includes(b))) score += 6;
    }
    if (dist <= 2 && shorter >= lower.length * 0.7) score += 4 - dist;
    if (score < 6) continue;
    scored.push({ name, score });
  }

  scored.sort((a, b) => b.score - a.score);
  return [...new Set(scored.map((s) => s.name))].slice(0, limit);
}

function looksLikeNamedFqcn(name: string): boolean {
  return name.includes(".") && /[a-z]/.test(name) && !/^[a-z]{1,3}$/.test(name);
}

// ── 主转换函数 ───────────────────────────────────────────────────────────

/**
 * 映射转换主入口
 *
 * 映射层级关系：
 *   mojang (official) ↔ mcp/srg (Forge 开发名) ↔ parchment (mcp + 参数名)
 *        ↕                      ↕
 *     yarn (Fabric)      不同步，不兼容
 *
 * 重要：Parchment 中的 name = mcp/srg 名，不是 mojang official 名！
 * 查询时应使用 mcp/srg 层名字（如 getHealth），不是 official 名（如 aqm）
 */
export function convertMapping(query: MappingQuery): MappingResult {
  const version = query.version ?? DEFAULT_VERSION;
  const { apiIndex } = loadData(version);
  const { from, to, memberName, ownerClass, descriptor } = query;

  if (from === to) {
    return {
      found: true, original: memberName, converted: memberName,
      direction: `${from}→${to}`, confidence: "high", mappingType: "class",
    };
  }

  // ── mcp ↔ parchment ──────────────────────────────────────────
  // Parchment = MCP 层 + 参数名增强，类名/方法名完全一致
  if ((from === "mcp" || from === "parchment") && (to === "mcp" || to === "parchment")) {
    return {
      found: true, original: memberName, converted: memberName,
      direction: `${from}↔${to}`, confidence: "high", mappingType: "class",
      notes: [
        "Parchment = MCP 层 + 人类可读参数名，类名/方法名完全一致",
        "Parchment 的价值在于提供了 MCP 层缺失的参数名信息",
      ],
      usage: `// ${to} 名：${memberName}
${memberName} instance = new ${memberName}();`,
    };
  }

  // ── mojang → mcp/parchment（反向查询）─────────────────────────
  // ⚠️ Parchment 数据中 name = mcp/srg 名，不含 mojang official 名
  //   需要 mojang → srg 反混淆表才能完成此转换
  if (from === "mojang" && (to === "mcp" || to === "parchment")) {
    // 先尝试精确查询（memberName 本身是 mcp/srg 名的情况）
    if (ownerClass) {
      const classSlash = toSlash(ownerClass);
      const cls = apiIndex[classSlash];
      if (cls) {
        const method = cls.methods.find(
          m => m.name === memberName && (!descriptor || m.descriptor === descriptor)
        );
        if (method) {
          return {
            found: true, original: memberName, converted: memberName,
            direction: `mojang→${to}`, confidence: "high", mappingType: "method",
            notes: [
              `⚠️ 注意：你输入的 ${memberName} 似乎已是 MCP/srg 名（混淆名）`,
              `如果 ${memberName} 是 mojang official 名（如 aqm），则无法从 Parchment 数据反查`,
              "需要 mojang official → srg 反混淆表才能完成此转换",
            ],
            usage: `// 如果 ${memberName} 是 official 名，查询结果仅供参考
// 推荐使用：https://mappings.xhyrom.dev/1.20.1/ 获取 mojang → srg 映射`,
          };
        }
      }
    }
    // 类名查询
    const classSlash = toSlash(memberName);
    if (apiIndex[classSlash]) {
      return {
        found: true, original: memberName, converted: memberName,
        direction: "mojang→mcp (间接匹配)", confidence: "medium", mappingType: "class",
        notes: [
          `⚠️ 类 ${memberName} 在 Parchment 中找到，但无法确认是 mojang official 还是 mcp/srg 名`,
          "建议：使用 mcp/srg 名（如 net.minecraft.world.entity.LivingEntity）而非 official 名",
          "mojang → srg 转换需要：https://mappings.xhyrom.dev/1.20.1/",
        ],
      };
    }
    return {
      found: false, original: memberName, converted: memberName,
      direction: `mojang→${to}`, confidence: "low", mappingType: "class",
      notes: [
        `❌ 无法将 mojang official 名 "${memberName}" 转换为 ${to} 名`,
        "原因：Parchment 数据不含 mojang official → srg 映射",
        ...(looksLikeNamedFqcn(memberName)
          ? ["输入像 Yarn/Mojang named FQCN；可改用 from: \"yarn\" 或 from: \"mcp\" 再试"]
          : []),
        `✅ 解决方案：`,
        `   1. 访问 https://mappings.xhyrom.dev/${version}/ 下载 mojang 反混淆表`,
        `   2. 或使用 MCP 名直接查询（如 getMaxHealth）`,
      ],
    };
  }

  // ── mcp/parchment → mojang（正向查询）─────────────────────────
  // ⚠️ 同理，Parchment 不含 official 名，需要 srg → mojang 反混淆表
  // to=mojang 时 converted 为 Tiny official 短名（若无表则仍为 mcp 名并注明）
  if ((from === "mcp" || from === "parchment") && to === "mojang") {
    if (ownerClass) {
      const classSlash = toSlash(ownerClass);
      const cls = apiIndex[classSlash];
      if (cls) {
        const method = cls.methods.find(
          m => m.name === memberName && (!descriptor || m.descriptor === descriptor)
        );
        if (method) {
          return {
            found: true, original: memberName, converted: memberName,
            named: memberName,
            direction: `${from}→mojang`, confidence: "medium", mappingType: "method",
            notes: [
              `⚠️ ${memberName} 是 mcp/srg 名；本工具的 to=mojang 输出为 Tiny official（混淆短名），不是可读 Mojang FQCN`,
              `当前索引无 srg→official 表，converted 暂回传 mcp 名；请用 https://mappings.xhyrom.dev/${version}/ 查 official`,
            ],
          };
        }
        const suggestions = suggestSimilarMethods(
          memberName,
          cls.methods.map((m) => m.name),
        );
        return {
          found: false, original: memberName, converted: memberName,
          direction: `${from}→mojang`, confidence: "low", mappingType: "method",
          suggestions,
          notes: [
            `在 ${ownerClass} 中未找到方法 ${memberName}`,
            suggestions.length
              ? "suggestions 仅为相似名猜测，非官方别名"
              : "无足够相似的方法名可建议（输入过短或差异过大）",
            "示例可用方法名：getMaxHealth（数据中通常无 getHealth）",
          ],
        };
      }
    }
    const classSlash = toSlash(memberName);
    if (apiIndex[classSlash]) {
      return {
        found: true, original: memberName, converted: memberName,
        named: memberName,
        direction: `${from}→mojang`, confidence: "medium", mappingType: "class",
        notes: [
          `${memberName} 在 Parchment 中找到（mcp/srg 层）`,
          "to=mojang 意为 Tiny official 短名；完整 official 需额外映射表",
          `推荐：https://mappings.xhyrom.dev/${version}/`,
        ],
      };
    }
    return {
      found: false, original: memberName, converted: memberName,
      direction: `${from}→mojang`, confidence: "low",
      mappingType: ownerClass ? "method" : "class",
    };
  }

  // ── yarn ↔ *（仅类级；惰性打开预建 SQLite，禁止全量 JSON）──────────
  if (from === "yarn" || to === "yarn") {
    const yarn = convertYarnMember(version, from, to, memberName);
    const notes = [...(yarn.notes ?? [])];
    if (to === "mojang" && yarn.found) {
      notes.push(
        "to=mojang 时 converted 为 Tiny official（混淆短名），不是可读 Mojang FQCN",
      );
    }
    return {
      found: yarn.found,
      original: memberName,
      converted: yarn.converted,
      direction: `${from}→${to}`,
      confidence: yarn.found ? "high" : "low",
      mappingType: yarn.mappingType,
      official: to === "mojang" && yarn.found ? yarn.converted : undefined,
      named: from === "yarn" ? memberName : undefined,
      notes,
    };
  }

  // ── 方法/参数名查询（提供 Parchment 的核心价值）───────────────
  if (ownerClass && memberName) {
    const classSlash = toSlash(ownerClass);
    const cls = apiIndex[classSlash];

    if (cls) {
      const methods = cls.methods.filter(m => {
        const nameMatch = m.name === memberName;
        const descMatch = descriptor ? m.descriptor === descriptor : true;
        return nameMatch && (descriptor ? descMatch : true);
      });

      if (methods.length > 0) {
        const m = methods[0];
        const returnType = descriptorToReturnType(m.descriptor);
        return {
          found: true, original: memberName, converted: memberName,
          direction: `${from}→${to} (mcp/srg 层查询)`, confidence: "high", mappingType: "method",
          notes: [
            `✅ 在 ${ownerClass} 中找到方法 ${memberName}`,
            `参数（${m.parameters.length} 个）：${m.parameters.map(p => `${p.index}. ${p.name}`).join(", ") || "无参数"}`,
            `返回类型：${returnType}`,
            `JNI 描述符：${m.descriptor}`,
            m.javadoc ? `Javadoc：${m.javadoc}` : "",
            "💡 Parchment 的核心价值：提供 MCP 层缺失的参数名信息",
          ].filter(Boolean),
          usage: `// 方法签名示例
public void ${memberName}(${m.parameters.map(p => `/* ${p.name} */ Object ${p.name}`).join(", ")}) {
    // ${m.parameters.map(p => p.name).join(", ")}
}

# 调用示例
${memberName}(${m.parameters.map(p => p.name).join(", ")})`,
        };
      }

      const suggestions = suggestSimilarMethods(
        memberName,
        cls.methods.map((m) => m.name),
      );
      return {
        found: false, original: memberName, converted: memberName,
        direction: `${from}→${to}`, confidence: "low", mappingType: "method",
        suggestions,
        notes: [
          `在 ${ownerClass} 中未找到方法 ${memberName}`,
          suggestions.length
            ? "suggestions 仅为相似名猜测，非官方别名"
            : "无足够相似的方法名可建议",
        ],
      };
    }
  }

  return {
    found: false, original: memberName, converted: memberName,
    direction: `${from}→${to}`, confidence: "low",
    mappingType: ownerClass ? "method" : "class",
    notes: [
      `未找到 ${memberName}，请检查：`,
      "1. 类名是否使用 mcp/srg 层（点分隔），如 net.minecraft.world.entity.LivingEntity",
      "2. 方法名是否为 mcp/srg 名，如 getMaxHealth",
      `3. 如需 mojang ↔ srg 转换，使用 https://mappings.xhyrom.dev/${version}/`,
      "4. 工具参数 to=mojang 输出为 Tiny official 短名，不是可读 Mojang FQCN",
    ],
  };
}

// ── 参数名查询（独立工具）──────────────────────────────────────────────

export interface ParamQuery {
  className: string;
  methodName: string;
  descriptor?: string;
  /** Minecraft 版本（如 "1.20.1"），决定使用哪份 extracted 索引 */
  version?: string;
}

export interface ParamResult {
  found: boolean;
  className: string;
  methodName: string;
  parameters: Array<{ index: number; name: string }>;
  descriptor: string;
  returnType: string;
  javadoc?: string;
  note?: string;
}

export function getMethodParams(query: ParamQuery): ParamResult {
  const version = query.version ?? DEFAULT_VERSION;
  const { apiIndex, classNames } = loadData(version);
  const { className, methodName, descriptor } = query;
  const slash = toSlash(className);
  const cls = apiIndex[slash];

  if (!cls) {
    return {
      found: false, className, methodName, parameters: [], descriptor: "", returnType: "void",
      note: `类 ${className} 不在 ${version} 索引中（共 ${classNames.length} 个 Vanilla 类，不含 Forge 特有类）`,
    };
  }

  const methods = cls.methods.filter(m => {
    const nameMatch = m.name === methodName;
    const descMatch = descriptor ? m.descriptor === descriptor : true;
    return nameMatch && (descriptor ? descMatch : true);
  });

  if (methods.length === 0) {
    return {
      found: false, className, methodName, parameters: [], descriptor: "", returnType: "void",
      note: `在 ${className} 中未找到方法 ${methodName}，请确认使用了 mcp/srg 名而非 mojang official 名`,
    };
  }

  const m = methods[0];
  return {
    found: true, className, methodName,
    parameters: m.parameters.map(p => ({ index: p.index, name: p.name })),
    descriptor: m.descriptor,
    returnType: descriptorToReturnType(m.descriptor),
    javadoc: m.javadoc ?? undefined,
    note: methods.length > 1
      ? `⚠️ 找到 ${methods.length} 个重载，请使用 descriptor 参数精确定位`
      : undefined,
  };
}
