---
description: 02 — 资源包
---

# 02 — 资源包

纹理、`terrain_texture`、`item_texture`、attachables、`sounds.json`、client entity。不要把 Java `assets/<modid>/models` 路径当基岩 RP。

## Decision Flow

```
→ 从零建包 → search_bedrock_docs：stable/getting-started、stable/resource-pack
→ 改纹理/方块外观 → stable/resource-pack；方块几何对照 stable/custom-block、stable/block-components
→ client_entity JSON → 与 BP identifier 成对（见 04）；组件名用 stable/entity-components，不要编 Java EntityType
→ 缺方法/键名 → 打开上述 Learn 页；禁止用 Yarn 模型路径冒充
```

## 已核实约束

- RP `modules[].type` 必须是 `resources`。
- 自定义方块外观：Learn Custom Block 在 RP 放纹理，并与 BP `minecraft:block` 的 `minecraft:geometry` / 材质组件配合。若 BP 已用组件控制外观，`blocks.json` 对视觉可变成可选（Learn 原文），声音仍常走 `blocks.json`。
- `client_entity` 的 identifier 必须与 BP `minecraft:entity` 相同（`namespace:name`）。
- 校验包头：`validate_addon_manifest`。不要 `audit_resources` 当 Java assets 树扫。

## 文档

`stable/resource-pack`、`stable/custom-block`、`stable/getting-started`。
