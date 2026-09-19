---
name: mc-model
description: JSON 模型、blockstate、item model、generate_model。触发词：blockstates、models、cube_all
platform: forge
version: "1.12.2"
dependencies: []
mappings: mcp
---

# mc-model（1.12.2）

> 一手来源：`forge/1.12.2/knowledge/common/resourcepack-format.md`（方块状态/方块模型 JSON 节）；进一步语料页：`data/forge_1.12.2/forge-docs/1.12.2/processed/blocks_states.md`、`conventions_locations.md`。

## Decision Flow

```
→ 方块外观随方块状态变 → blockstates/<block>.json（variants 按 属性=值 命中）
→ 纯静态方块模型 → models/block/<name>.json（parent + textures）
→ 物品模型 → models/item/<name>.json
→ 生成骨架代码 → generate_model MCP 工具
```

## 模型 JSON 速写（已核实）

- 方块模型：`{ "parent": "block/cube_all", "textures": { "all": "<modid>:blocks/<tex>" } }` 形态（1.12.2 贴图路径习惯带 `blocks/` 前缀，完整形状见速查）。
- blockstate：`{ "variants": { "": { "model": "<modid>:block/<model>" } } }`——变体键是 `属性=值` 串，normal 惯例为空串（细节以速查为准）。
- 引用链：blockstate → model → texture，任一环路径错 = 紫黑块。

## 反模式

- blockstates 引用不存在的模型路径；模型缺 `parent`。
- 纹理路径含大写字母。
- 1.12.2 语言文件是 `.lang` 不是 JSON（见 mc-resourcepack）。

## 下一步

- 完整 JSON 形状：`forge/1.12.2/knowledge/common/resourcepack-format.md`。
- 骨架生成：`generate_model`；反模式库：`forge/1.12.2/knowledge/antipatterns/`。
