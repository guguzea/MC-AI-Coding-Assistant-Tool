#!/usr/bin/env node
/**
 * build-community-index.mjs — 扫描 community_knowledge 生成 indexes/index-l0.json
 * 派生规则在 scripts/_lib/community-index-core.mjs（与 test-core 的 [community-index] 门禁共用）。
 */
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { emit, logDryRunBanner } from "../../scripts/_lib/write-guard.mjs";
import { buildEntries, renderIndex } from "./_lib/community-index-core.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..", "community_knowledge");

const entries = buildEntries(ROOT);
const written = emit(join(ROOT, "indexes", "index-l0.json"), renderIndex(entries));
if (!written) logDryRunBanner("build-community-index");
console.log(
  `[build-community-index] ${written ? "wrote" : "dry-run（未写）"} ${entries.length} entries → indexes/index-l0.json`,
);
