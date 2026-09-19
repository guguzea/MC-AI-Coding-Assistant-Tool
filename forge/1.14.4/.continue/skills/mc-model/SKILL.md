---
name: mc-model
description: JSON 模型、blockstate、item model、generate_model。触发词：blockstates、models、cube_all
platform: forge
version: "1.14.4"
dependencies: []
mappings: mcp
---

# mc-model（1.14.4）

> 一手来源：`forge/1.14.4/knowledge/common/resourcepack-format.md`（方块状态/方块模型/物品模型节）；进一步语料页：`data/forge_1.14.4/forge-docs/1.14.4/processed/datagen_modelproviders.md`、`datagen_intro.md`、`conventions_locations.md`。

## Decision Flow

```
→ 手写 JSON → blockstates + models（assets/<namespace>/ 下，本技能）
→ 批量生成模型 → data generation（1.14.4 语料有 datagen_modelproviders 页）
→ 引用链排查 → blockstate → model → texture 任一环错 = 紫黑块
→ 生成骨架代码 → generate_model MCP 工具
```

## 模型 JSON 速写（已核实）

- 方块模型：`parent` + `textures`（如 `cube_all` + `all`）；物品模型：`parent` 指向方块模型或 `item/generated` 系。
- blockstate：`variants` 按 `属性=值` 串命中模型。
- 模型文件缺 `parent` 是常见坏形（速查常见错误节）。

## 反模式

- 纹理路径含大写字母（`block/MyBlock.png` → `block/myblock.png`）。
- lang 键分隔符用 `.` 连 namespace（应 `item.examplemod.my_item`）。
- blockstate 引用不存在的模型路径。

## 下一步

- 完整 JSON 形状：`forge/1.14.4/knowledge/common/resourcepack-format.md`。
- data generation 路线（模型批量生成）：同档语料 `datagen_modelproviders` 页 + `generate_model` 工具。
