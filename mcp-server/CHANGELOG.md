# mcp-server changelog

## Plan 1 — validate_project / diagnose_gradle 返回值

- **权威字段**是 `status`（`"passed"` | `"failed"` | `"skipped"`）与 `skipped`。`passed` 仅在真正跑完检查且无 error 时为 `true`。
- `validate_project` 对 LiteLoader / Rift / ModLoader / 基岩早退：`status: "skipped"`、`passed: null`、`ok: true`。这不是工程损坏，而是本工具未跑检查。旧客户端勿把 skipped 当失败。
- `deprecated_legacy_passed: true` **仅**出现在 Plan 1 的 `validate_project` 早退（旧逻辑曾误报 `passed: true`）。`diagnose_gradle` 早退 **从不带** 此字段。
- **新测试、新 Agent 逻辑禁止把 `deprecated_legacy_passed === true` 当成功条件。** 成功只看 `status` / `skipped` / `passed`。
- Wave C 起删除该过渡字段（含仍 skipped 的 LiteLoader / Rift / ModLoader / 基岩）。
- `diagnose_gradle` 早退同样 `status: "skipped"` + `action`（改口）。`suggestions` 是检查建议，**不得当错误**；`action` **不得当「校验通过」**。新 Agent 只依赖 `status` / `skipped`。
- Review 提示：新增代码不得依赖 `deprecated_legacy_passed`。
