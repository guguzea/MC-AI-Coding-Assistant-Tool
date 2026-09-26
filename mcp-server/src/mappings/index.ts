/**
 * 映射表转换模块 — 入口 re-export
 *
 * 实现见 convert.ts / yarn-sqlite.ts
 */
export {
  convertMapping,
  getMethodParams,
  suggestSimilarMethods,
  type MappingQuery,
  type MappingResult,
  type ParamQuery,
  type ParamResult,
} from "./convert.js";
export {
  lookupObfuscated,
  type LookupObfuscatedQuery,
  type LookupObfuscatedResult,
} from "./lookup-obfuscated.js";
export {
  buildAccessLines,
  type AccessLineEntry,
  type AccessLineFormat,
  type AccessLineRequest,
  type AccessLinesResult,
  type AccessLoader,
} from "./access-lines.js";
export {
  convertMappingEx,
  splitMemberNames,
  BATCH_LIMIT,
  type ConvertExtrasQuery,
} from "./convert-extras.js";
