---
name: mc-resourcepack
description: 资源包格式、pack_format、纹理。触发词：resourcepack、assets
platform: fabric
version: "1.21.10"
dependencies: []
mappings: yarn
---

# mc-resourcepack（1.21.10）

> 一手来源（2026-09-19 核实）：Minecraft Wiki《Pack format》资源包格式表（https://minecraft.wiki/w/Pack_format ，1.21.9–1.21.10 = 69.0）与《Resource pack》页（https://minecraft.wiki/w/Resource_pack ）。本技能不含 Java API；客户端渲染类名走 `search_fabric_docs(version=1.21.10)`。

## Decision Flow

```
→ 方块/物品视觉（blockstate、模型、贴图）→ 本技能
→ 物品模型定义 → assets/<ns>/items/<item>.json（1.21.4 起的新制）
→ 数据 JSON（配方/战利品/标签）→ data/（mc-datapack）
→ Java 侧 → mc-registry、01-registry.mdc
```

## pack.mcmeta（已核实，出处见上）

1.21.9 起 **pack_format 引入小版本号**（非破坏性改动递减小版本，wiki 原话见《Pack format》页）：1.21.9–1.21.10 资源包 **69.0**、数据包 88.0。写 `pack.mcmeta` 时以本版 vanilla `pack.mcmeta` 实际写法为准。

| MC 版本 | 资源包 pack_format | 数据包 |
|---------|------------------|--------|
| 1.21.4 | 46 | 61 |
| 1.21.7–1.21.8 | 64 | 81 |
| **1.21.9–1.21.10** | **69.0** | 88.0 |

## 物品模型定义（1.21.4 起新制，已核实）

1.21.4（24w45a）起 `assets/<namespace>/items/` 存放**物品模型定义** JSON（「物品用哪个模型渲染」），与 `models/item/` 的模型本体分离。1.21.10 延续该制。

## 目录结构（要点）

```
assets/<namespace>/
├── blockstates/  lang/  models/{block,item}/
├── items/        # 物品模型定义（1.21.4 起）
└── textures/{block,item,entity}/
```

Fabric 模组自带的资源 JSON 同形，随 jar 根的 `assets/<namespace>/` 分发。

## 反模式

- `pack_format` 填邻版数字（1.21.9–1.21.10 资源包是 **69.0**，不是 64/46；注意小版本号新制）。
- 把 `items/` 定义与 `models/item/` 模型本体混为一谈。
- 纹理路径含大写字母；blockstate 引用不存在的模型。
- Java 类名问题带进本技能（类名核实走 search_fabric_docs）。

## 下一步

- 模型/blockstate JSON 细节以 wiki 原文为准（出处 URL 见顶部）；数据面：`mc-datapack`。
