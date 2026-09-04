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
- `modules[].type`：官方属性表**只列** `resources` | `data` | `world_template` | `script`（`stable/pack-manifest` 的 modules.type 行）；同一页官方示例却写 `"type": "client_data"` —— **官方自相矛盾**。`client_data` 按遗留值处理：`validate_addon_manifest` 只给「建议迁移到 data」的 warning，不得当作已核实的枚举成员。`skin` 为皮肤包类型。不要把 SP 当第三种顶层包（脚本模块放在 BP 内）。
- `capabilities` 可选；官方表只列 `chemistry` / `editorExtension` / `experimental_custom_ui` / `raytraced` / `pbr`（同页 capabilities 段）。Learn **未列出** `script_eval`（勿当已核实能力举例）。**不是** 世界「Beta APIs」开关。
- `metadata` 可选；官方 metadata 表列 `authors`(Array) / `license`(String) / `generated_with`(JSON Object) / `product_type`(String) / `url`(String)。`product_type` **语料只点名一个值**：`"addon"`（原文「The only supported value is "addon"」，并写明设为该值也不改变 in-game 行为）；社区流传的其他历史值**未核实**，不要当枚举成员写。`generated_with` 的 `[a-zA-Z0-9_-]` + 32 字符上限管的是**工具名**，与实体/方块 identifier 无关，禁止挪用。
- **禁止** `"experimentalGameplay": true`。依据 = **Learn pack-manifest 从未列出该键**（语料 0 命中），不是「Learn 明令禁止」。世界实验见 07 与 `knowledge/common/experiments.md`。

脚本依赖版本以 `data/bedrock-docs-status.json` 的 `scriptApiStable` 为准（抓取时曾为 `2.9.0`），不要用 Yarn/`modImplementation`。

## 文档

`stable/pack-manifest`、`stable/script-api-intro`、`stable/experimental-features-toggle`。
