---
name: mc-resourcepack
description: 资源包格式、pack_format、纹理。触发词：resourcepack、assets
platform: forge
version: "1.16.5"
dependencies: []
mappings: mcp
---

# mc-resourcepack（1.16.5）

> 一手来源：`forge/1.16.5/knowledge/common/resourcepack-format.md`（pack_format 对齐官方 1.16.5-36.2.34 MDK，sha256 钉在 `mcp-server/data/mdk-checksums.json`）。

## Decision Flow

```
→ 方块/物品视觉（blockstate、模型、贴图）→ 本技能
→ 语言/字体/粒子 → assets/<namespace>/ 对应目录
→ 配方/战利品 JSON → data/（mc-datapack）
→ Java 侧 → mc-registry、01-registry.mdc
```

## pack.mcmeta（已核实）

```json
{ "pack": { "pack_format": 6, "description": "..." } }
```

1.16.x 的数据包与资源包**共用同一个号 6**（`pack.mcmeta` 只有一个字段）；1.18 起分家（1.18.2 = 资源 8 / 数据 9）。1.16/1.16.1 是否为 5 属 MDK `_comment` 层面的历史问题，以 1.16.2+ = 6 为准。

## 目录结构（已核实）

```
assets/<namespace>/
├── blockstates/  font/  gui/  lang/{en_us,zh_cn}.json
├── models/{block,item}/  particles/
└── textures/{block,entity,item}/
```

Forge 模型层叠见一手速查「Forge 模型层叠」节。

## 反模式

- 纹理路径含大写字母（`block/MyBlock.png` → `block/myblock.png`）。
- lang 键分隔符用 `.` 连 namespace（应为 `item.examplemod.my_item`）。
- blockstates 引用不存在的模型路径；模型 JSON 缺 `parent`。
- 物品模型用 `minecraft:block/my_block` 但没定义 blockstates。
- `pack_format` 填错（1.16.5 = **6**，不是 15）。

## 下一步

- 完整速查：`forge/1.16.5/knowledge/common/resourcepack-format.md`。
- 反模式库：`forge/1.16.5/knowledge/antipatterns/`。
