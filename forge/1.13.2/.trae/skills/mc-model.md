---
name: mc-model
description: JSON 模型、blockstate、item model、generate_model。触发词：blockstates、models、cube_all
platform: forge
version: "1.13.2"
dependencies: []
mappings: mcp
---

# mc-model（1.13.2）

> 一手来源：`forge/1.13.2/knowledge/common/resourcepack-format.md`（BlockState/方块模型/物品模型/物品属性覆盖四节）；进一步语料页：`data/forge_1.13.2/forge-docs/1.13.2/processed/blocks_states.md`、`conventions_locations.md`。

## Decision Flow

```
→ 方块外观随属性变 → blockstates/<block>.json 按 属性=值 命中模型
→ 静态方块模型 → models/block/<name>.json（parent + textures）
→ 物品外观随耐久/状态变 → item model 的 overrides 按 predicate 切换
→ 生成骨架代码 → generate_model MCP 工具
```

## 模型 JSON 速写（已核实）

- 方块模型：`parent: "block/cube_all"` + `textures.all = "<modid>:block/<tex>"`。
- blockstate：`variants` 按 `属性=值` 串命中（1.13.2 起 metadata 变体废除——用 `IProperty` 值表达外观变体，速查明令禁止再用 metadata 数字）。
- 物品模型 overrides：按 predicate（如自定义属性）切换子模型，形状见速查「物品属性覆盖」节。

## 反模式（本档专属）

- 模型里写 `modid:block/foo` 但方块注册名是 `bar` → 紫黑块（速查引 `knowledge/patterns/examples/cube-all-resources.md:38`）。
- 用 metadata 数字表达外观变体 → 改 `IProperty` 值 + blockstate 命中。
- blockstate 引用不存在的模型路径 / 模型缺 `parent`。

## 下一步

- 完整 JSON 形状：`forge/1.13.2/knowledge/common/resourcepack-format.md`。
- 骨架生成：`generate_model`；反模式库：`forge/1.13.2/knowledge/antipatterns/`。
