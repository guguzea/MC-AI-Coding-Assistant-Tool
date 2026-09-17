# mcp-server changelog

## Unreleased（2026-09 全仓库审查修复轮；工作树，未发版）

- `search_forge_docs` / `search_docs` 的 `VERSION_NOT_FOUND` 载荷四平台同键：`ok:false` + `platform` + 顶层数值序 `availableVersions` + `error` 对象（旧的字符串 `error` + 顶层 `code`/`hint` 形状废除）。
- 反编译链：TOML 三引号值解析修复（此前整份 `mods.toml` 解析失败）、输出目录身份/清目录与包名归属白名单校验。
- 新增只读一致性门（G1 反编译身份与归属 / G2 解析器可用性 / G3 语料保真 / G4 索引自洽 / `assert-forge-1182-registry-consts` / `assert-legacy-isolation`），均带投毒自测并接入 `test-scripts.mjs`。
- `npm run community:index` 补 `--write`（此前该链是 dry-run，`wrote N entries` 不可复现）。
- `tools/list` 现 80 个工具（`release-smoke` 实跑），CI 步骤名同步。
- 知识包文档面：forge / fabric / quilt / neoforge 各档「本档不存在的 API」、版本分界与第三方库上界按一手语料 + Modrinth/maven 实读更正。
- **当前为 81 个工具**（上方「`tools/list` 现 80 个工具」是当时的记录）：新增 `resolve_lib_skills`（按平台 + 精确 MC 版本解析 `knowledge/libs` 库 skill 源稿；与 CLI `lib resolve` 同一 core，只解析不返回正文）。
- **CLI 双入口提级（2026-09-17）**：工具线 `mc-skill`（= `dist/cli.js`，dispatch 全部工具）+ 仓库线 `mc-skill-scripts`（`bin/mc-skill-scripts.mjs`；`lib` / `corpus` / `cloth` / `gate` 四组共 9 个子命令，薄壳转发既有脚本）。
- **CLI 审计修复（1 高 5 中 4 低）**：`provision-26x-docs.mjs` 收口 write-guard（默认干跑、`--write` 才删、`--data-root` 沙盒）；`--timeout` 超时信封后强制退出；转发失败打印诊断、EPIPE 静默退出、入口崩溃输出 JSON 信封；`fetch-embedding-model.mjs` 下载加超时与重试提示；`gate list` 目录错非 0、帮助用真实入口名、版本读失败不静默。
- **CLI 测试双档**：`assert-cli-quick.mjs`（快档，进默认门链）与 `assert-cli-full.mjs`（81 工具全量档，**不默认跑**；含逐条豁免原因与汇总表）。
- **CLI 审计第二轮修复（NP-1~NP-13，2026-09-17）**：`update --action=apply` 的 npm 调用改走 `cmd.exe /d /s /c`（Node 对 `.bat/.cmd` 的无 shell 加固实测 `EINVAL`，此前 Windows 构建步恒败）并带步骤归因；EPIPE 不再洗白已置的非零退出码；sqlite 边界改**运行期加载**（22.5–22.12 无 `--experimental-sqlite` 时入口横幅真正可达）；`mdk` 解压失败清残树 + 成功落 `.mdk-unpack-ok` 哨兵 + `allowCacheFallback` 强判据；`update --action=apply` 新增 `update-apply` 跨进程锁（`utils/dir-lock.ts`，与反编译缓存锁同源）；`--timeout`/崩溃强退前同步收掉在跑的 java 子进程；`provision-26x-docs.mjs` 的 `--data-root` 覆盖到抓取段（6 个子脚本同一解析器）；`fetch-bedrock-docs.js` 的 fetch 加 30s 超时；`-V`/`-v` 短别名与 `-h/-V/camel` 帮助文案；`argv[1]` 缺失时入口明示 + 非零退出。
- **勘误（计数，不回改历史行）**：上方「CLI 审计修复（1 高 5 中 4 低）」的枚举与计数不对应（枚举 9 条；标题按 1 高 + 5 中 + 4 低 = 10 条，且未含同批的 S1/S2）。该批真实清单以 `temp/ralph-cli-audit-PLAN.md` 为准。另：根 `README.md` 的「MCP 服务名（80 个工具）」当时并未改净，本轮修为 81。

## Plan 1 — validate_project / diagnose_gradle 返回值

- **权威字段**是 `status`（`"passed"` | `"failed"` | `"skipped"`）与 `skipped`。`passed` 仅在真正跑完检查且无 error 时为 `true`。
- `validate_project` 对 LiteLoader / Rift / ModLoader / 基岩早退：`status: "skipped"`、`passed: null`、`ok: true`。这不是工程损坏，而是本工具未跑检查。旧客户端勿把 skipped 当失败。
- `deprecated_legacy_passed: true` **仅**出现在 Plan 1 的 `validate_project` 早退（旧逻辑曾误报 `passed: true`）。`diagnose_gradle` 早退 **从不带** 此字段。
- **新测试、新 Agent 逻辑禁止把 `deprecated_legacy_passed === true` 当成功条件。** 成功只看 `status` / `skipped` / `passed`。
- Wave C 起删除该过渡字段（含仍 skipped 的 LiteLoader / Rift / ModLoader / 基岩）。
- `diagnose_gradle` 早退同样 `status: "skipped"` + `action`（改口）。`suggestions` 是检查建议，**不得当错误**；`action` **不得当「校验通过」**。新 Agent 只依赖 `status` / `skipped`。
- Review 提示：新增代码不得依赖 `deprecated_legacy_passed`。
