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

- `format_version`：资源/行为/世界模板用 **2**。**3** 是 Preview（semver 字符串版本、自定义 pack 设置）；未点名 Preview 不要写 3。皮肤包可用 1。`TODO(未核实)`：各内容类型的 `format_version` 具体取值与演进以 Learn pack-manifest 现页为准（本仓语料只到该页快照）。**工具接受面（W5-2 裁定 2026-09-19，维持现状）**：`validate_addon_manifest` / `generate_addon_manifest` 只收整数形与 beta 串；semver 形（如 `"3.0.1"`）被**有意拒绝**——官方逐字语义未核实前不放行。
- `header`：`name` / `description` / `uuid` / `version` / **`min_engine_version`（必填）**。世界模板另有 `base_game_version`、`allow_random_seed`（仅 world template）、**`lock_template_options`（必填：官方逐字「This option is required for any world templates」）**；资源包可选 **`pack_scope`**（`"world"` / `"global"` / `"any"`，缺省视作 `"any"`——官方逐字 only resources pack 语义）。
- `min_engine_version` 的**必填**口径（2026-09-19 更正）：官方 pack-manifest 表格行逐字「**This is a required field for resource and behavior packs.** This helps the game identify whether any backwards compatibility is needed … You should always use the highest version currently available」——上游 `validate_addon_manifest` 判 **error**（缺项即红）。⚠️ 本规则上一版仅列字段名未写必填（据不完整摘录），已更正。
- `modules[].type`：官方属性表**只列** `resources` | `data` | `world_template` | `script`（`stable/pack-manifest` 的 modules.type 行）；同一页官方示例却写 `"type": "client_data"` —— **官方自相矛盾**。`client_data` 按遗留值处理：`validate_addon_manifest` 只给「建议迁移到 data」的 warning，不得当作已核实的枚举成员。`skin` 为皮肤包类型。不要把 SP 当第三种顶层包（脚本模块放在 BP 内）。
- `capabilities` 可选；官方表只列 `chemistry` / `editorExtension` / `experimental_custom_ui` / `raytraced` / `pbr`（同页 capabilities 段）。Learn **未列出** `script_eval`（勿当已核实能力举例）。**不是** 世界「Beta APIs」开关。
- `metadata` 可选；官方 metadata 表列 `authors`(Array) / `license`(String) / `generated_with`(JSON Object) / `product_type`(String) / `url`(String)。`product_type` **语料只点名一个值**：`"addon"`（原文「The only supported value is "addon"」，并写明设为该值也不改变 in-game 行为）；社区流传的其他历史值**未核实**，不要当枚举成员写。`generated_with` 的 `[a-zA-Z0-9_-]` + 32 字符上限管的是**工具名**，与实体/方块 identifier 无关，禁止挪用。
- **`language` / `entry` 的判级口径（2026-09-19 裁定 N9(b) 判真洞/P1，反转前判）**：script 模块**必须** `language="javascript"` 且 `entry` 非空（如 `"scripts/main.js"`）——缺任一 `validate_addon_manifest` 判 **error**。前判（「缓存官方页 `entry` 0 命中、`language` 是条件句 ⇒ 不判错」）已作废：实测缺两者仍 `ok:true` 属真洞。`dependencies` 结构校验同批判 error：条目必须是对象、`module_name` / `version` 必须是非空字符串（`version` 允许 `"beta"`）；版本**值**不是本仓已知真值（模板钉值 / 文档快照）仍只 warning（见下）。一手页面状态（`entry` 全页 0 命中）留痕在台账 `bedrock-script-module-language-entry-not-enforced` —— 重抓 pack-manifest 页后若口径变化须重定判级。
- **禁止** `"experimentalGameplay": true`。依据 = **Learn pack-manifest 从未列出该键**（语料 0 命中），不是「Learn 明令禁止」。世界实验见 07 与 `knowledge/common/experiments.md`。

脚本依赖版本有**两个语义不同的真值**（2026-09-19 裁定；别当同一个数比对）：

- **文档快照值** = `data/bedrock-docs-status.json` 的 `scriptApiStable`（Learn 抓取时刻所载 stable，快照时曾为 `2.9.0`；随抓取更新、天然滞后）——`generate_addon_manifest` 的默认值取它。
- **模板钉值** = `mcp-server/data/bedrock-script-api-pin.json` 的 `scaffoldDependency.version`（本仓给新工程的推荐值，按 npm registry `dist-tags` 一手复核推进；当前 `2.10.0`、as-of 2026-09-18）。

`bedrock/scaffold/BP/manifest.json` 必须与**模板钉值**逐字一致；`validate_addon_manifest` 对既不是钉值也不是快照值的依赖版本回 warning（不判错）。三者由 `mcp-server/scripts/assert-bedrock-script-api-pin.mjs` 看守，单侧改动即红（npm `dist-tags` as-of 2026-09-18：`latest` = `2.10.0`、`beta` = `2.11.0-beta.1.26.51-stable`）。**不要**凭记忆填版本号，也不要用 Yarn/`modImplementation`。两份 scaffold manifest 都带 `min_engine_version`（模板示例口径）；生成器的默认 mev 钉值（`[1,26,44]`）按既有裁定不改，输出附当前 stable 注记。

## 文档

`stable/pack-manifest`、`stable/script-api-intro`、`stable/experimental-features-toggle`。
