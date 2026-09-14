# mcp-server changelog

## Unreleased（2026-09 全仓库审查修复轮；工作树，未发版）

- `search_forge_docs` / `search_docs` 的 `VERSION_NOT_FOUND` 载荷四平台同键：`ok:false` + `platform` + 顶层数值序 `availableVersions` + `error` 对象（旧的字符串 `error` + 顶层 `code`/`hint` 形状废除）。
- 反编译链：TOML 三引号值解析修复（此前整份 `mods.toml` 解析失败）、输出目录身份/清目录与包名归属白名单校验。
- 新增只读一致性门（G1 反编译身份与归属 / G2 解析器可用性 / G3 语料保真 / G4 索引自洽 / `assert-forge-1182-registry-consts` / `assert-legacy-isolation`），均带投毒自测并接入 `test-scripts.mjs`。
- `npm run community:index` 补 `--write`（此前该链是 dry-run，`wrote N entries` 不可复现）。
- `tools/list` 现 80 个工具（`release-smoke` 实跑），CI 步骤名同步。
- 知识包文档面：forge / fabric / quilt / neoforge 各档「本档不存在的 API」、版本分界与第三方库上界按一手语料 + Modrinth/maven 实读更正。

## Plan 1 — validate_project / diagnose_gradle 返回值

- **权威字段**是 `status`（`"passed"` | `"failed"` | `"skipped"`）与 `skipped`。`passed` 仅在真正跑完检查且无 error 时为 `true`。
- `validate_project` 对 LiteLoader / Rift / ModLoader / 基岩早退：`status: "skipped"`、`passed: null`、`ok: true`。这不是工程损坏，而是本工具未跑检查。旧客户端勿把 skipped 当失败。
- `deprecated_legacy_passed: true` **仅**出现在 Plan 1 的 `validate_project` 早退（旧逻辑曾误报 `passed: true`）。`diagnose_gradle` 早退 **从不带** 此字段。
- **新测试、新 Agent 逻辑禁止把 `deprecated_legacy_passed === true` 当成功条件。** 成功只看 `status` / `skipped` / `passed`。
- Wave C 起删除该过渡字段（含仍 skipped 的 LiteLoader / Rift / ModLoader / 基岩）。
- `diagnose_gradle` 早退同样 `status: "skipped"` + `action`（改口）。`suggestions` 是检查建议，**不得当错误**；`action` **不得当「校验通过」**。新 Agent 只依赖 `status` / `skipped`。
- Review 提示：新增代码不得依赖 `deprecated_legacy_passed`。
