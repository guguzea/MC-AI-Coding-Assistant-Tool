---
name: mc-datapack
description: 数据包布局、pack.mcmeta、validate_datapack_json。触发词：datapack、data/
platform: forge
version: "1.19.4"
dependencies: []
mappings: parchment
---

# mc-datapack（1.19.4）

> 一手来源：`forge/1.19.4/knowledge/common/datapack-format.md`（pack_format 表逐项对齐官方 MDK，sha256 钉在 `mcp-server/data/mdk-checksums.json`）。本技能不含 Java API——数据包是 JSON 面；Java 侧数据生成走 `mc-datagen`。

## Decision Flow

```
→ 改 Java 行为/注册 → 不是数据包，走 mc-datagen / 01-registry
→ 数据包 JSON（配方/战利品/标签/函数）→ 本技能
→ 版本 → 1.19.3–1.19.4 数据包用 12（资源包是 13）
→ JSON 写完 → validate_datapack_json 校验，再进游戏 /reload
```

## pack.mcmeta（已核实）

```json
{ "pack": { "pack_format": 12, "description": "My Datapack" } }
```

| MC 版本 | pack_format（数据包） |
|---------|------------|
| **1.19.3–1.19.4** | **12**（官方 1.19.4-45.4.0 MDK `forge:server_data_pack_format: 12`；同文件 `pack_format: 13` 是**资源包**号。1.19.3 的单独值本仓无一手证据） |
| 1.20 - 1.20.1 | 15 |
| 1.18.x | 9 |

> 9 是 1.18.x 的数据包号，不是 1.19.4 的；别抄错行。

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

- `pack_format` 版本错（1.19.4 数据包用 12、资源包用 13，不是 9 或 15）。
- namespace 含大写字母；`functions/` 的 .mcfunction 有空行或多余空格。
- `tags/items/` 的值格式错（应 `namespace:item_name`）；`loot_tables` 应在 `data/{namespace}/loot_tables/` 下。
- 手写 JSON 后不跑 `validate_datapack_json` 直接进游戏。

## 下一步

- 校验：`validate_datapack_json`；完整速查：`forge/1.19.4/knowledge/common/datapack-format.md`。
- 反模式库：`forge/1.19.4/knowledge/antipatterns/`。
