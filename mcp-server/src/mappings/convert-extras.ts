/**
 * S2 + S3：convert_mapping 的两条附加腿（批量名 / AT·AW 条目行）。
 *
 * 单独成模块是为了让 test-core 能直接跑**同一条**代码路径 —— 工具面 handler 只做
 * 「调用 + 序列化」，不夹逻辑，否则门测的是副本。
 */
import { convertMapping, type MappingQuery, type MappingResult } from "./convert.js";
import {
  buildAccessLines,
  preferMappingDb,
  type AccessLinesResult,
  type AccessLoader,
  type AccessLineRequest,
} from "./access-lines.js";

export { preferMappingDb };

/** 附加腿的输出：MappingResult + 可选 accessLines；批量模式再挂 results / batch。 */
export type MappingResultWithExtras = MappingResult & {
  accessLines?: AccessLinesResult;
  results?: MappingResultWithExtras[];
  batch?: { requested: number; found: number; missing: string[] };
};

export interface ConvertExtrasQuery extends MappingQuery {
  /** S2：附 accessLines 条目行 */
  accessLines?: boolean;
  /** 只影响 S2 那条腿 */
  platform?: AccessLoader;
  access?: "public" | "protected" | "private" | "default";
  finalOp?: "add" | "remove";
}

export const BATCH_LIMIT = 50;

/** memberName 里的批量分隔：逗号 / 分号 / 换行（Java 标识符不含这三个字符）。 */
export function splitMemberNames(memberName: string): string[] {
  return String(memberName ?? "")
    .split(/[,;\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function batchTooLarge(query: ConvertExtrasQuery, count: number): MappingResult {
  return {
    found: false,
    original: query.memberName,
    converted: null,
    direction: `${query.from}→${query.to}`,
    confidence: "low",
    mappingType: "class",
    notes: [`批量名 ${count} 个，超过 ${BATCH_LIMIT} 个上限`],
    action: {
      code: "INVALID_INPUT",
      message: `memberName 批量模式上限 ${BATCH_LIMIT} 个`,
      nextSteps: ["拆成多次调用，每次 ≤50 个名字", "只要类名清单就改用 query_api / search_*_docs"],
      relatedTools: ["query_api", "search_docs"],
    },
  };
}

function withAccessLines(
  result: MappingResult,
  query: ConvertExtrasQuery,
  name: string,
): MappingResultWithExtras {
  if (query.accessLines !== true) return result;
  const isClass = (result.memberKind ?? (query.memberKind === "class" ? "class" : undefined)) === "class";
  const converted = typeof result.converted === "string" ? result.converted : null;
  return {
    ...result,
    accessLines: buildAccessLines({
      version: query.version ?? "",
      loader: query.platform,
      memberKind: isClass ? "class" : result.memberKind === "field" ? "field" : "method",
      className: isClass ? (converted ?? name) : (query.ownerClass ?? converted ?? name),
      memberName: isClass ? undefined : (converted ?? name),
      memberNameInput: name,
      descriptor: query.descriptor,
      access: query.access,
      finalOp: query.finalOp,
      // 未命中时名字层未确认 ⇒ 生成器内部回落到 named 头并说明
      // A4d：Linkie 扩展名（不在 AccessLineRequest 支持面）已在 convertMapping 入口 early-return（found=false）
      // ⇒ found=true 时 to 必在支持面，cast 仅收敛类型。
      toLayer: result.found ? (query.to as AccessLineRequest["toLayer"]) : undefined,
    }),
  };
}

/**
 * S2/S3 的唯一入口：单个名字时返回值与 convertMapping 完全一致（除 accessLines 附加键）；
 * 多个名字时顶层仍是第一个名的结果，另挂 results[] 与 batch{}。
 */
export function convertMappingEx(query: ConvertExtrasQuery): MappingResultWithExtras {
  // 归一化一次：批量与单个两条分支都从 q 出发，免得只有一侧带平台改判（形状分叉）。
  const q: ConvertExtrasQuery = {
    ...query,
    mappingDbPreference: query.mappingDbPreference ?? preferMappingDb(query.platform),
  };
  const names = splitMemberNames(q.memberName);
  if (names.length > 1) {
    if (names.length > BATCH_LIMIT) {
      return batchTooLarge(q, names.length);
    }
    const results = names.map((n) =>
      withAccessLines(convertMapping({ ...q, memberName: n }), q, n),
    );
    const foundOf = (r: MappingResultWithExtras) => r.found === true;
    // 口径披露（2026-09-27 用户裁定 ②：**只补 notes，不改 requested/found/missing 的语义与形状** ——
    // 那三条已被 test-core §S3 逐条钉住，而按 missing.length 分支的消费者会拿到换义的数）：
    //  · requested 按输入个数计，重复名不去重（`a,a` 就是 2 个请求）；
    //  · found 数的是「工具答了」，identity／直通路径下映射里未必真有这个名字 ⇒ found 不是「存在」的证明。
    const uniq = new Set(names).size;
    const batchNote =
      `批量口径：requested=${names.length} 按输入个数计（去重后 ${uniq} 个，重复名不去重）；` +
      `found=${results.filter(foundOf).length} 数的是「工具已答」，identity/直通时不表示映射里真有该名字 —— 要证存在请逐名读 results[]`;
    return {
      ...results[0],
      notes: [...(results[0].notes ?? []), batchNote],
      results,
      batch: {
        requested: names.length,
        found: results.filter(foundOf).length,
        missing: names.filter((_, i) => !foundOf(results[i])),
      },
    };
  }

  const single = names[0] ?? q.memberName;
  return withAccessLines(convertMapping({ ...q, memberName: single }), q, single);
}
