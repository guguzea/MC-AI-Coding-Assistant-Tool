---
name: mc-model
description: JSON 模型、blockstate、item model、generate_model。触发词：blockstates、models、cube_all
platform: forge
version: "1.18.2"
dependencies: []
mappings: mcp
---

# mc-model（1.18.2）

> 一手来源：`forge/1.18.2/knowledge/common/resourcepack-format.md`（方块状态/方块模型节）；进一步语料页：`data/forge_1.18.2/forge-docs/1.18.2/processed/blocks_states.md`、`rendering_modelloaders.md`、`resources_client.md`。

## Decision Flow

```
→ 手写 JSON → blockstates + models（assets/<namespace>/ 下，本技能）
→ 批量生成模型 → data generation（语料 datagen 页）
→ 自定义模型加载（OBJ 等）→ 语料 rendering_modelloaders 页
→ 生成骨架代码 → generate_model MCP 工具
```

## 模型 JSON 速写（已核实）

- 方块模型：`parent`（如 `block/cube_all`）+ `textures`。
- blockstate：`variants` 按 `属性=值` 串命中模型。
- 引用链：blockstate → model → texture，任一环路径错 = 紫黑块。

## 反模式

- 纹理路径含大写字母（`block/MyBlock.png` → `block/myblock.png`）。
- lang 键分隔符用 `.` 连 namespace（应 `item.examplemod.my_item`）。
- blockstate 引用不存在的模型路径；模型 JSON 缺 `parent`。

## 下一步

- 完整 JSON 形状：`forge/1.18.2/knowledge/common/resourcepack-format.md`。
- 骨架生成：`generate_model`；反模式库：`forge/1.18.2/knowledge/antipatterns/`。
