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
