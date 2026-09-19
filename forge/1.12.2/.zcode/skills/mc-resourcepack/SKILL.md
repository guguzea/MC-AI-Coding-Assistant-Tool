---
name: mc-resourcepack
description: 资源包格式、pack_format、纹理。触发词：resourcepack、assets
platform: forge
version: "1.12.2"
dependencies: []
mappings: mcp
---

# mc-resourcepack（1.12.2）

> 一手来源：`forge/1.12.2/knowledge/common/resourcepack-format.md`（pack_format 对齐官方 1.12.2-14.23.5.2860 MDK，sha256 钉在 `mcp-server/data/mdk-checksums.json`）。

## Decision Flow

```
→ 方块/物品的视觉（模型、贴图、blockstate）→ 本技能
→ 语言文件 → 1.12.2 用 .lang（不是 .json！）
→ 配方/战利品 JSON → 本版没有数据包系统，见 mc-datapack
→ Java 侧 → mc-registry、01-registry.mdc
```

## pack.mcmeta（已核实）

```json
{ "pack": { "pack_format": 3, "description": "My Resource Pack" } }
```

⚠️ 不存在「数据包同为 3」：1.12.2 **没有数据包系统**（`data/` 命名空间自 1.13 起）。

## 目录结构（已核实）

```
assets/{modid}/
├── blockstates/     # 方块状态 JSON
├── lang/en_us.lang  # 语言文件（.lang 格式，不是 .json）
├── models/{block,item}/   # 模型 JSON
└── textures/{block,entity,item}/  # 纹理 .png
```

## 反模式

- 语言文件用 .json 格式（1.12.2 必须用 **.lang**）。
- 纹理路径含大写字母（`block/MyBlock.png` → `block/myblock.png`）。
- blockstates 引用不存在的模型路径。
- `pack_format` 填错（1.12.2 资源包 = **3**，不是 4）。

## 下一步

- 完整格式速查（blockstate/模型 JSON 形状）：`forge/1.12.2/knowledge/common/resourcepack-format.md`。
- 反模式库：`forge/1.12.2/knowledge/antipatterns/`。
