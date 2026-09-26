---
name: mc-model
description: JSON 模型、blockstate、item model、generate_model。触发词：blockstates、models、cube_all
platform: forge
version: "1.19.4"
dependencies: []
mappings: parchment
---

# mc-model（1.19.4）

> 一手来源：`forge/1.19.4/knowledge/common/resourcepack-format.md`（方块状态/方块模型/物品模型节）；进一步语料页：`data/forge_1.19.4/forge-docs/1.19.4/processed/rendering_modelloaders.md`、`items_bewlr.md`、`datagen.md`。

## Decision Flow

```
→ 手写 JSON → blockstates + models（assets/<namespace>/ 下，本技能）
→ 批量生成模型 → data generation（语料 datagen 页）
→ 自定义模型加载（OBJ 等）→ 语料 rendering_modelloaders 页
→ 生成骨架代码 → generate_model MCP 工具
```

## 模型 JSON 速写（已核实）

- 方块模型：`parent`（如 `block/cube_all`）+ `textures`；物品模型：`parent` 指向方块模型或 `item/generated` 系。
- blockstate：`variants` 按 `属性=值` 串命中模型。
- 超出标准 JSON 模型面的加载器（OBJ 等自定义 loader）属独立专题，见语料页，别在本技能混写。

## 反模式

- 纹理路径含大写字母（`block/MyBlock.png` → `block/myblock.png`）。
- lang 键分隔符用 `.` 连 namespace（应 `item.examplemod.my_item`）。
- blockstate 引用不存在的模型路径；模型 JSON 缺 `parent`。

## 下一步

- 完整 JSON 形状：`forge/1.19.4/knowledge/common/resourcepack-format.md`。
- 骨架生成：`generate_model`；反模式库：`forge/1.19.4/knowledge/antipatterns/`。
