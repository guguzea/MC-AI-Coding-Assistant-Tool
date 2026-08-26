export type { MethodInfo, LoaderClassRecord, LoaderApiSummary } from "./types.js";
export { queryLoaderApi, searchLoaderApi } from "./query.js";
export { assertCacheFresh, sha256Buffer, sha256File, readSidecar, sidecarSchemaCompatible } from "./sidecar.js";
export { normalizeMethod, findSummary, listIndexed, invalidateMergedSummariesCache } from "./store.js";
export { candidateKeys, candidateKeysSafe, howToIngestCli, USER_INGEST_KEYS } from "./keys.js";
export type { IngestLoaderApiArgs } from "./ingest.js";

/** 动态加载抽取/ingest，避免 MCP 启动时拉起 java-parser。 */
export async function ingestLoaderApi(args: import("./ingest.js").IngestLoaderApiArgs) {
  const mod = await import("./ingest.js");
  return mod.ingestLoaderApi(args);
}
