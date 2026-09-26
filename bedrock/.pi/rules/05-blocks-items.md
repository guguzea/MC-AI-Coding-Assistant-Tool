---
description: 05 — 方块与物品 JSON
---

# 05 — 方块与物品 JSON

BP `minecraft:block` / `minecraft:item` + RP 纹理引用。identifier 必须 `namespace:name`。

## Decision Flow

```
→ 方块教程 → stable/custom-block
→ 方块组件名 → stable/block-components（表外禁止编 Java BlockBehaviour）
→ 物品教程 → stable/custom-items
→ 物品组件名 → stable/item-components
→ 几何/材质 → RP（02）+ block-components 里的 geometry 等键，以 Learn 为准
```

## 已核实约束（Learn）

方块（`stable/custom-block`）：

```json
{
  "format_version": "1.21.80",
  "minecraft:block": {
    "description": { "identifier": "demo:die" },
    "components": {
      "minecraft:geometry": "minecraft:geometry.full_block",
      "minecraft:material_instances": {
        "*": { "texture": "die_red", "render_method": "opaque" }
      }
    }
  }
}
```

`format_version` **1.21.80+** 的方块模板**必须同时**带 `minecraft:geometry` 与 `minecraft:material_instances`。不要输出空 `components: {}`，也不要只给 geometry 就完事。**这条要求有两层出处，别混称**：

- **成对要求本身 = 外部-only（本仓没有这两页语料）**：Learn 组件参考页 `minecraftblock_geometry` 与 `minecraftblock_material_instances` 各带一条同文 Note，逐字 *From 1.21.80 onward, when using a minecraft:geometry component or minecraft:material_instances component, you must include both.* 本仓 `data/bedrock_stable/**` 对该句 `grep -F` **0 命中**（`block-components.md` 也没有 `1.21.80` 字样）⇒ 引用它须现场打开该参考页，**不得**声称「本档语料逐字」，也**不得**挂到教程页 `stable/custom-block` 名下。同页另注：该组件本身 `format_version` 下限 1.19.40；`isotropic` / `tint_method` 才要 1.21.80+。
- **教程侧旁证 = 本仓语料逐字**：`data/bedrock_stable/bedrock-docs/stable/processed/custom-block.md:309`（1.21.80 起 geometry 必须显式定义）、`:311`、`:335-336`（die 示例里两组件成对出现，逐面 `die_1`…`die_6`）。组件级 `"*"` + `texture` + `render_method` 的写法见上面那张参考页的 Samples；本仓 `:359-362` 给的是 `item_visual` 内的同形写法（`die_red` / `opaque`）。

`description.identifier` 必须带命名空间。组件只从 `stable/block-components` 抄，例如已出现在该页的 `minecraft:collision_box`、`minecraft:geometry`、`minecraft:friction`、`minecraft:light_emission`、`minecraft:destructible_by_mining`、`minecraft:flammable`。标 Legacy / experimental / Upcoming-Creator-Features 的条目未点名实验不要用。

物品：`minecraft:item` + `description.identifier`。组件只从 `stable/item-components` 抄，例如该页已有的 `minecraft:allow_off_hand`、`minecraft:block_placer`、`minecraft:can_destroy_in_creative`。`format_version` 随组件升高（Learn：trim ≥ 1.20.60，dyeable ≥ 1.21.30）。

JSON 校验：`validate_bp_json`。

## 文档

`stable/custom-block`、`stable/block-components`、`stable/custom-items`、`stable/item-components`。
