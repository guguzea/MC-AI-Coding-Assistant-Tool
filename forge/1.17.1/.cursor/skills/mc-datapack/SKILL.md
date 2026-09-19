---
name: mc-datapack
description: 数据包布局、pack.mcmeta、validate_datapack_json。触发词：datapack、data/
platform: forge
version: "1.17.1"
dependencies: []
mappings: official
---

# mc-datapack（1.17.1）

> 一手来源：`forge/1.17.1/knowledge/common/datapack-format.md`（pack_format 表逐项对齐官方 MDK，sha256 钉在 `mcp-server/data/mdk-checksums.json`）。本技能不含 Java API——数据包是 JSON 面；Java 侧数据生成走 `mc-datagen`。

## Decision Flow

```
→ 改 Java 行为/注册 → 不是数据包，走 mc-datagen / 01-registry
→ 数据包 JSON（配方/战利品/标签/函数）→ 本技能
→ 版本 → 1.17.x 用 pack_format 7（下表）
→ JSON 写完 → validate_datapack_json 校验，再进游戏 /reload
```

## pack.mcmeta（已核实）

```json
{ "pack": { "pack_format": 7, "description": "My Datapack" } }
```

| MC 版本 | pack_format（数据包） |
|---------|------------|
| **1.17.x** | **7**（官方 1.17.1-37.1.1 MDK；本包 scaffold `pack.mcmeta` 同为 7） |
| 1.18.x | 9（资源包为 8，1.18 起分家） |
| 1.19.3–1.19.4 | 12（资源包为 13） |

1.18 之前 `pack.mcmeta` 只有一个 `pack_format`，数据包与资源包共用同一号；1.18 起分家（1.18.2 MDK 同时给出 `forge:resource_pack_format` / `forge:data_pack_format` 两个键）。

## 目录结构（已核实）

```
data/<namespace>/
├── advancements/  functions/（.mcfunction）  loot_tables/{blocks,entities,chests}
├── predicates/  recipes/  structures/（.nbt）
├── tags/{blocks,entity_types,fluids,functions,items}
└── dimension/
```

## Recipe / Loot 速写（已核实）

- 有序合成：`type: "minecraft:crafting_shaped"` + `pattern` + `key` + `result{item,count}`。
- 无序：`crafting_shapeless` + `ingredients[]`；熔炉：`smelting` + `ingredient` + `result` + `experience` + `cookingtime`。
- 战利品表：`type: "minecraft:block"` + `pools[].entries[]` + `conditions:["minecraft:survives_explosion"]`。

## 反模式

- `pack_format` 填邻版数字（本版是 **7**，不是 8 或 15）。
- namespace 含大写字母；`functions/` 的 .mcfunction 有空行或多余空格。
- `tags/items/` 的值格式错（应 `namespace:item_name`）；`loot_tables` 放错层。
- 手写 JSON 后不跑 `validate_datapack_json` 直接进游戏。

## 下一步

- 校验：`validate_datapack_json`；完整速查：`forge/1.17.1/knowledge/common/datapack-format.md`。
- 反模式库：`forge/1.17.1/knowledge/antipatterns/`。
