---
name: mc-datapack
description: 数据包布局、pack.mcmeta、validate_datapack_json。触发词：datapack、data/
platform: forge
version: "1.20.1"
dependencies: []
mappings: parchment
---

# mc-datapack（1.20.1）

> 一手来源：`forge/1.20.1/knowledge/common/datapack-format.md`（pack_format 表逐项对齐官方 MDK，sha256 钉在 `mcp-server/data/mdk-checksums.json`）。本技能不含 Java API——数据包是 JSON 面；Java 侧数据生成走 `mc-datagen`。

## Decision Flow

```
→ 改的是 Java 行为/注册 → 不是数据包，走 mc-datagen / 01-registry
→ 数据包 JSON（配方/战利品/标签/函数）→ 本技能
→ 版本 → 1.20–1.20.1 用 pack_format 15（下表）
→ JSON 写完 → validate_datapack_json 校验，再进游戏 /reload
```

## pack.mcmeta（已核实）

```json
{ "pack": { "pack_format": 15, "description": "My Datapack" } }
```

| MC 版本 | pack_format（数据包） |
|---------|------------|
| 1.20–1.20.1 | **15** |
| 1.19.3–1.19.4 | 12 |
| 1.18.x | 9 |
| 1.17.x | 7 |

（出处：官方各版 MDK `pack.mcmeta` / `forge:data_pack_format`，逐项 sha256 可核对。）

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
- 无序：`crafting_shapeless` + `ingredients[]`。熔炉：`smelting` + `ingredient` + `result` + `experience` + `cookingtime`。
- 战利品表：`type: "minecraft:block"` + `pools[].entries[]`；完整形状见一手速查表。

## 反模式

- `pack_format` 填邻版数字（本版是 **15**，不是 12/9/7）。
- 把数据包 JSON 放进 `resources/`（资源包）或反过来。
- 手写 JSON 后不跑 `validate_datapack_json` 直接进游戏。
- 想用 Java 注册表 API 改数据包行为——两条线，别混。

## 下一步

- 校验：`validate_datapack_json`；配方/战利品 JSON 骨架：`generate_*`。
- 完整格式速查（含 Loot 全形）：`forge/1.20.1/knowledge/common/datapack-format.md`。
