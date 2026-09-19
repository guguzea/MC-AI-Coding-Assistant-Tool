---
name: mc-datapack
description: 数据包布局、pack.mcmeta、validate_datapack_json。触发词：datapack、data/
platform: forge
version: "1.18.2"
dependencies: []
mappings: mcp
---

# mc-datapack（1.18.2）

> 一手来源：`forge/1.18.2/knowledge/common/datapack-format.md`（pack_format 表逐项对齐官方 MDK，sha256 钉在 `mcp-server/data/mdk-checksums.json`）。本技能不含 Java API——数据包是 JSON 面；Java 侧数据生成走 `mc-datagen`。

## Decision Flow

```
→ 改 Java 行为/注册 → 不是数据包，走 mc-datagen / 01-registry
→ 数据包 JSON（配方/战利品/标签/函数）→ 本技能
→ 版本 → 1.18.x 数据包用 9（资源包是 8，别混）
→ JSON 写完 → validate_datapack_json 校验，再进游戏 /reload
```

## pack.mcmeta（已核实）

```json
{ "pack": { "pack_format": 9, "description": "My Datapack" } }
```

| MC 版本 | pack_format（数据包） |
|---------|------------|
| **1.18.x** | **9**（官方 1.18.2-40.3.0 MDK 同时给出 `forge:data_pack_format: 9` 与 `forge:resource_pack_format: 8`，外层 `pack_format: 9`） |

⚠️ 自 1.18 起数据包与资源包编号**分家**：1.18.x 数据包 = 9、资源包 = 8。本包 scaffold `src/main/resources/pack.mcmeta` 写的是资源包侧的 8，**不要拿它当数据包号**。

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

- `pack_format` 填邻版数字（数据包 **9**，不是 8 或 15；8 是资源包号）。
- namespace 含大写字母；`functions/` 的 .mcfunction 有空行或多余空格。
- `tags/items/` 的值格式错（应 `namespace:item_name`）。
- 手写 JSON 后不跑 `validate_datapack_json` 直接进游戏。

## 下一步

- 校验：`validate_datapack_json`；完整速查：`forge/1.18.2/knowledge/common/datapack-format.md`。
- 反模式库：`forge/1.18.2/knowledge/antipatterns/`。
