---
name: mc-datapack
description: 数据包布局、pack.mcmeta、validate_datapack_json。触发词：datapack、data/
platform: forge
version: "1.20.4"
dependencies: []
mappings: parchment
---

# mc-datapack（1.20.4）

> 一手来源：`forge/1.20.4/knowledge/common/datapack-format.md`。本技能不含 Java API——数据包是 JSON 面；Java 侧数据生成走 `mc-datagen`。

## Decision Flow

```
→ 改 Java 行为/注册 → 不是数据包，走 mc-datagen / 01-registry
→ 数据包 JSON（配方/战利品/标签/函数）→ 本技能
→ 版本 → 1.20.3–1.20.4 的数据包号本仓未核实（见下），以实测能加载为准
→ JSON 写完 → validate_datapack_json 校验，再进游戏 /reload
```

## pack.mcmeta（本版数据包号**未核实**，速查原样保留）

| MC 版本 | pack_format（数据包） |
|---------|------------|
| 1.20.3–1.20.4 | **26（未核实）**——官方 1.20.4-49.2.0 MDK `pack.mcmeta` 只给 `"pack_format": 22`（资源包侧），没有数据包键，本仓无一手证据 |
| 1.19.3–1.19.4 | 12（资源包 13） |
| 1.18.x | 9（资源包 8） |

写工程时**以你实测能加载的号为准**（速查原文口径）；不要把 26 当已核实数字抄进正式文档。

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

- namespace 含大写字母；`functions/` 的 .mcfunction 有空行或多余空格。
- `tags/items/` 的值格式错（应 `namespace:item_name`）；`loot_tables` 应在 `data/{namespace}/loot_tables/` 下。
- 把未核实的 pack_format 数字当已核实写进文档或提交。
- 手写 JSON 后不跑 `validate_datapack_json` 直接进游戏。

## 下一步

- 校验：`validate_datapack_json`；完整速查（含未核实标注原文）：`forge/1.20.4/knowledge/common/datapack-format.md`。
- 反模式库：`forge/1.20.4/knowledge/antipatterns/`。
