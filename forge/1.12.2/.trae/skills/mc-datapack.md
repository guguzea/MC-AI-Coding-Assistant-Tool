---
name: mc-datapack
description: 数据包布局、pack.mcmeta、validate_datapack_json。触发词：datapack、data/
platform: forge
version: "1.12.2"
dependencies: []
mappings: mcp
---

# mc-datapack（1.12.2）

> 一手来源：`forge/1.12.2/knowledge/common/datapack-format.md`。**本版没有数据包系统**：`data/` 命名空间与 `/datapack` 指令自 1.13 才引入（仓内语料 `data/forge_1.12.2/forge-docs/1.12.2/raw/utilities_recipes.md:10`：1.12.2 的 JSON 配方「will be expanded in Minecraft 1.13 into datapacks」）。本技能只覆盖 1.12.2 实际存在的 JSON 面。

## Decision Flow

```
→ 想用 1.13+ 的 data/ 命名空间 / /datapack 加载 → 本版没有，别写；见下方「迁移提示」
→ 1.12.2 的配方 / 战利品表 JSON → 放 assets/{modid}/ 下，本技能
→ 资源包（材质/模型/音效/lang）→ mc-resourcepack
→ Java 侧行为 → mc-registry、01-registry.mdc
```

## 1.12.2 的 JSON 位置（已核实）

```
assets/{modid}/
├── recipes/           # 配方 JSON
└── loot_tables/       # 战利品表 JSON
```

与资源（模型、贴图、语言）同在 `assets/` 下，**没有** `data/` 目录。

## Recipe JSON 速写（已核实）

- 有序合成：`"type": "forge:ore_shaped"` + `pattern` + `key` + `result{item,count}`——`type` 带 **`forge:` 前缀**，不是 1.13+ 的 `minecraft:crafting_shaped`。
- 无序合成：`"type": "forge:ore_shapeless"` + `ingredients[]`。
- 完整 JSON 形状见一手速查。

## pack_format 说明（已核实）

- 官方 1.12.2 MDK `src/main/resources/pack.mcmeta` 是 `"pack_format": 3`——那是**资源包**号；1.18 之前两包共用一个号，但 1.12.2 没有数据包面，别把工程写成「数据包 pack_format = 3」。

## 反模式

- 给 1.12.2 工程写 `data/<namespace>/` 目录或 `/datapack` 加载说明——1.13+ 才存在。
- 配方 `type` 缺 `forge:` 前缀（写成 `minecraft:crafting_shaped`）。
- namespace 含大写字母（`ExampleMod:stone` → `examplemod:stone`）。

## 迁移提示（1.12.2 → 1.13+）

把 `assets/{modid}/recipes|loot_tables/` 搬到 `data/{modid}/` 下，`type` 换成 `minecraft:` 前缀——两代格式不兼容，逐文件改。

## 下一步

- 完整格式速查（含官方 MDK 出处）：`forge/1.12.2/knowledge/common/datapack-format.md`。
- 反模式库：`forge/1.12.2/knowledge/antipatterns/`；资源包：`mc-resourcepack`。
