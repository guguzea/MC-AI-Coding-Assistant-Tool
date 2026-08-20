---
description: 01 — manifest.json
---

# 01 — manifest.json

一份 pack 的身份文件。RP 与 BP **各一份**，uuid 不重复。

## Decision Flow

```
→ 从零写 manifest → generate_addon_manifest 只吐 JSON，不写盘；或对照 stable/pack-manifest
→ 校验已有文件 → validate_addon_manifest（不是 validate_project）
→ 声明脚本 → modules[].type=script + language=javascript + entry；dependencies 加 @minecraft/server
→ 需要 eval → capabilities 写法**未核实**（Learn pack-manifest 无 `script_eval`）
→ 世界 Beta APIs → 07；禁止 experimentalGameplay
```

## 已核实约束（Learn pack-manifest）

顶层键：`format_version`、`header`、`modules`；可选 `dependencies`、`capabilities`、`metadata`。

- `format_version`：资源/行为/世界模板用 **2**。**3** 是 Preview（semver 字符串版本、自定义 pack 设置）；未点名 Preview 不要写 3。皮肤包可用 1。
- `header`：`name` / `description` / `uuid` / `version` / `min_engine_version`。世界模板另有 `base_game_version`、`allow_random_seed`（仅 world template）。
- `modules[].type`：`resources` | `data` | `script` | `world_template`。
- `capabilities` 可选；Learn pack-manifest **未列出** `script_eval`（勿当已核实能力举例）。**不是** 世界「Beta APIs」开关。
- **禁止** `"experimentalGameplay": true`。世界实验见 07 与 `knowledge/common/experiments.md`。

脚本依赖版本以 `data/bedrock-docs-status.json` 的 `scriptApiStable` 为准（抓取时曾为 `2.9.0`），不要用 Yarn/`modImplementation`。

## 文档

`stable/pack-manifest`、`stable/script-api-intro`、`stable/experimental-features-toggle`。
