#!/usr/bin/env node
/**
 * ⚠ 一次性改写器：已执行过，勿再跑（会覆盖已人工修订的 mc-blockentity）。
 * 只写六档 mc-blockentity，不覆盖 00–10。
 */
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { emit } from "../_lib/write-guard.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const VERS = ["1.20.4", "1.21.1", "1.21.3", "1.21.8", "1.21.11", "26.1"];

for (const ver of VERS) {
  const r02 = readFileSync(join(ROOT, "neoforge", ver, ".cursor", "rules", "02-block.mdc"), "utf8");
  const body = `---
name: mc-blockentity
description: NeoForge ${ver} mc-blockentity。类名只来自本档核实表与 search_neoforge_docs。
platform: neoforge
version: "${ver}"
dependencies: []
mappings: mojmap
---

# mc-blockentity（NeoForge ${ver}）

禁止从 Forge 或邻档复制。自定义包走 Payload，禁止 SimpleChannel / RegistryObject / NeoForgeAddonPlugin。

${r02}

触发词：BlockEntity、BlockEntityType、getTicker、getUpdateTag。
`;
  const dir = join(ROOT, "neoforge", ver, ".cursor", "skills", "mc-blockentity");
  emit(join(dir, "SKILL.md"), body);
}
