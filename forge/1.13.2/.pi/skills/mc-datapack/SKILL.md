---
name: mc-datapack
description: 数据包布局、pack.mcmeta、validate_datapack_json。触发词：datapack、data/
platform: forge
version: "1.13.2"
dependencies: []
mappings: mcp
---

# mc-datapack（1.13.2）

> 一手来源：`forge/1.13.2/knowledge/common/datapack-format.md`。本技能不含 Java API——数据包是 JSON 面；Java 侧数据生成走 `mc-datagen`。

## Decision Flow

```
→ 改 Java 行为/注册 → 不是数据包，走 mc-datagen / 01-registry
→ 数据包 JSON（配方/战利品）→ 本技能
→ 版本 → 1.13.2 用 pack_format 4（下表）
→ JSON 写完 → validate_datapack_json 校验，再进游戏 /reload
```

## pack.mcmeta（已核实）

```json
{ "pack": { "pack_format": 4, "description": "Example Mod" } }
```

1.18 之前 `pack.mcmeta` 只有一个 `pack_format` 字段，数据包与资源包**共用同一个号**（1.18 起才分家）——别把这条「相同」外推到 1.18+。

## 目录结构（已核实）

```
data/{modid}/
├── recipes/             # 配方 JSON
└── loot_tables/blocks/  # 方块战利品 JSON
```

1.13.2 的 `data/` 面较窄（配方 + 方块战利品表）；模型/贴图/lang 仍在 `assets/{modid}/`（资源包面，走 `mc-resourcepack`）。

## Recipe / Loot 速写（已核实）

- 有序合成：`type: "minecraft:crafting_shaped"` + `pattern` + `key` + `result`；无序：`crafting_shapeless` + `ingredients[]`（1.13 起 `type` 用 `minecraft:` 前缀，与 1.12.2 的 `forge:` 前缀不同）。
- 战利品表：`type: "minecraft:block"` + `pools[].entries[{type:"minecraft:item",...}]`。

## 反模式

- namespace 含大写字母（`ExampleMod:stone` → `examplemod:stone`）。
- 把数据包 JSON 放进 `assets/`（1.13 起在 `data/`），或反过来把模型放 `data/`。
- 手写 JSON 后不跑 `validate_datapack_json` 直接进游戏。

## 下一步

- 校验：`validate_datapack_json`；完整格式速查（含 BlockState/模型/lang JSON）：`forge/1.13.2/knowledge/common/datapack-format.md`。
- 反模式库：`forge/1.13.2/knowledge/antipatterns/`。
