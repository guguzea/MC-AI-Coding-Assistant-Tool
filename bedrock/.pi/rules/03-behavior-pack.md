---
description: 03 — 行为包
---

# 03 — 行为包

实体/方块/物品 JSON、战利品、合成、spawn。`validate_bp_json` 精简校验，不是 Java `validate_datapack_json`。

## Decision Flow

```
→ 从零 BP → stable/getting-started、stable/behavior-pack
→ 自定义实体行为 → stable/entity-behavior-intro + stable/entity-components
→ 自定义方块逻辑 → stable/custom-block + stable/block-components
→ 自定义物品 → stable/custom-items + stable/item-components
→ JSON 校验 → validate_bp_json（不是数据包 Java 工具）
```

## 已核实约束

- BP `modules[].type`：纯数据用 `data`；脚本用 `script`（可与 data 分 module，uuid 仍不得重复）。
- 方块 JSON：`format_version` 为字符串（Learn 示例 `"1.19.30"` / `"1.21.80"`）+ `minecraft:block.description.identifier`。
- 物品 JSON：Learn 示例 `"format_version": "1.20.30"` + `minecraft:item`；盔甲 trim 要 ≥ `1.20.60`，可染色组件要 ≥ `1.21.30`（均来自 stable/custom-items）。
- 世界实验开关不写在 BP JSON 里（见 07）。
- `min_engine_version` 与 manifest 见 00 / 01。

## 文档

`stable/behavior-pack`、`stable/custom-block`、`stable/custom-items`、`stable/entity-behavior-intro`。
