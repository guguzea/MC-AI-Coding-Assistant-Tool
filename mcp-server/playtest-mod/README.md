# `bandd_playtest` 可读 `.java` 单一真值源（`mcp-server/playtest-mod/`）

本目录是 `MC_skill` 仓库内自持的 **`bandd_playtest` 二合一模组可读 Java 单一真值源**（核心 + 适配层 + 纯 JDK 单测），取代原先只能手改单行 JSON 字符串的 `src/generators/playtest-mod-{core,adapters}.ts`。

## 目录结构

- `core/com/bandd/playtest/core/*.java`：版本无关 core（21 个 Java 类，不碰任何 `net.minecraft.*`）。
- `adapters/manifest.json` + `adapters/<platform>-<version>/**/*.java`：逐档适配层与入口（53 档 / 110 个 `.java` 文件；每档是否经过真机验证以 `src/generators/playtest-driver.ts` 的 `PLAYTEST_MOD_VERIFIED_TIER` 与 `PLAYTEST_MOD_GENERATOR_READY` 为准，本目录不替代真机验证分级）。
- `tests/src/com/bandd/playtest/test/*.java`：16 个纯 JDK 离线回归测试源码（无需 Minecraft 即可用 `javac` / `java` 跑离线断言；其中 12 套纯 core 套件直接对本目录零外部依赖全绿，另 2 套源码形态套件 `T20CorrectnessTest` / `T22ActionsTest` 需通过 `-Dbandd.mod.root=<模组工作树>/mod` 指向含 `src/main/java` 布局的模组目录，完整 14 套共 853 条断言）。

## 派生与防漂移（单一真源工作流）

`mcp-server/src/generators/playtest-mod-core.ts` 与 `mcp-server/src/generators/playtest-mod-adapters.ts` 是**派生制品**（供 `tsc` 打包进 `dist/` 与 npm 发布），**不要直接手改那两份 `.ts`**：

1. 修改本目录下的 `.java` 文件（或在 `adapters/manifest.json` 增删条目）；
2. 预览同步（默认 dry-run，不落盘）：
   ```bash
   cd mcp-server
   npm run sync:playtest-mod
   ```
3. 确认后落盘并编译校验：
   ```bash
   cd mcp-server
   npm run sync:playtest-mod -- --write
   npm run build
   npm run assert:playtest-mod-sync
   ```

防漂移门禁 [`scripts/assert-playtest-mod-sync.mjs`](../scripts/assert-playtest-mod-sync.mjs) 已接入 `test-scripts.mjs`（`REAL_RUN_GATES` + `SELFTEST_GATES`）与 `package.json` `test` 链：任何对 `.java` 或派生 `.ts` 的单边修改都会被逐字节比对拦红。
