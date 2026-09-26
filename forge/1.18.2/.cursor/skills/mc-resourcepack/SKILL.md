---
name: mc-resourcepack
description: 资源包格式、pack_format、纹理。触发词：resourcepack、assets
platform: forge
version: "1.18.2"
dependencies: []
mappings: parchment
---

# mc-resourcepack（1.18.2）

> 一手来源：`forge/1.18.2/knowledge/common/resourcepack-format.md`（pack_format 对齐官方 1.18.2-40.3.0 MDK，sha256 钉在 `mcp-server/data/mdk-checksums.json`）。

## Decision Flow

```
→ 方块/物品视觉（blockstate、模型、贴图）→ 本技能
→ 语言/字体/粒子/着色器 → assets/<namespace>/ 对应目录
→ 配方/战利品 JSON → data/（mc-datapack）
→ Java 侧 → mc-registry、01-registry.mdc
```

## pack.mcmeta（已核实）

```json
{ "pack": { "pack_format": 8, "description": "..." } }
```

⚠️ 自 1.18 起**资源包与数据包编号分家**：1.18.x 资源包 = **8**、数据包 = 9（官方 1.18.2 MDK 同时给出 `forge:resource_pack_format: 8` 与 `forge:data_pack_format: 9`）。别再写「数据包同为 8」。

## 目录结构（已核实）

```
assets/<namespace>/
├── blockstates/  fonts/  gui/  lang/{en_us,zh_cn}.json
├── models/{block,item}/  particles/  shaders/
└── textures/{block,entity,item}/
```

## 反模式

- 纹理路径含大写字母（`block/MyBlock.png` → `block/myblock.png`）。
- lang 键分隔符用 `.` 连 namespace（应为 `item.examplemod.my_item`）。
- blockstates 引用不存在的模型路径；模型 JSON 缺 `parent`。
- `pack_format` 错误（1.18.2 资源包用 **8**、数据包用 **9**，都不是 15）。

## 下一步

- 完整速查：`forge/1.18.2/knowledge/common/resourcepack-format.md`。
- 反模式库：`forge/1.18.2/knowledge/antipatterns/`。
