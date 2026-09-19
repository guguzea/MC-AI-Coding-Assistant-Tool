---
name: mc-datapack
description: 数据包布局、pack.mcmeta、validate_datapack_json。触发词：datapack、data/
platform: fabric
version: "1.21.4"
dependencies: []
mappings: yarn
---

# mc-datapack（1.21.4）

> 一手来源（2026-09-19 核实）：Minecraft Wiki《Pack format》数据包格式表（https://minecraft.wiki/w/Pack_format ，1.21.4 = 61）与《Data pack》目录改名记载（https://minecraft.wiki/w/Data_pack ，1.21 起 recipes/loot_tables 等改单数）。本技能不含 Java API——数据包是 JSON 面；Java 侧数据生成走 `mc-datagen`。

## Decision Flow

```
→ 改 Java 行为/注册 → 不是数据包，走 mc-datagen / 01-registry（Fabric 用 Registry.register）
→ 数据包 JSON（配方/战利品/标签/函数）→ 本技能
→ 版本 → 1.21.4 数据包 pack_format = 61（资源包为 46）
→ JSON 写完 → validate_datapack_json 校验，再进游戏 /reload
```

## pack.mcmeta（已核实，出处见上）

```json
{ "pack": { "pack_format": 61, "description": "My Datapack" } }
```

| MC 版本 | 数据包 pack_format | 资源包 |
|---------|------------------|--------|
| **1.21.4** | **61** | 46 |
| 1.21.7–1.21.8 | 81 | 64 |
| 1.21.9–1.21.10 | 88.0（1.21.9 起 pack_format 引入小版本号） | 69.0 |

## 目录结构（已核实——1.21 起单数）

1.21 开发周期（24w19a/24w21a，pack_format 48）把目录从复数改单数：`recipes→recipe`、`loot_tables→loot_table`、`advancements→advancement`、`predicates→predicate`、`structures→structure`、`functions→function`、`tags/items→tags/item`（block、entity_type、fluid 等 tag 目录同步改单数）。

```
data/<namespace>/
├── advancement/  function/（.mcfunction）  loot_table/
├── predicate/  recipe/  structure/
└── tags/{block,item,entity_type,fluid,...}   # 1.21 起单数
```

Fabric 模组自带的数据 JSON 同形，随 jar 根的 `data/<namespace>/` 分发，进游戏即可被加载。

## 反模式

- `pack_format` 填邻版数字（1.21.4 数据包是 **61**，不是 48/81）。
- 写 1.20.x 时代的复数目录（`recipes/`、`loot_tables/`、`tags/items/`）——1.21 起必须单数。
- 把 Java 类名问题带到本技能：数据包没有类名，类名核实走 `search_fabric_docs(version=1.21.4)`。
- 手写 JSON 后不跑 `validate_datapack_json` 直接进游戏。

## 下一步

- 校验：`validate_datapack_json`；资源包面：`mc-resourcepack`。
- 完整格式细节以两页 wiki 原文为准（出处 URL 见顶部）。
