---
id: authored/jigsaw-structure-generation
title: Jigsaw 结构生成（structure / structure_set / template_pool 三件套）
tags: [worldgen, structure, jigsaw, template-pool, structure-set, nbt, datapack, neoforge]
summary: 纯数据包做法：结构 NBT 模板 + worldgen/structure（jigsaw 入口）+ structure_set（random_spread 分布 salt/spacing/separation）+ template_pool（元素池与 fallback）；has_structure 生物群系标签；spawn_overrides；terrain_adaptation；processors 与 projection。
mcHint: 1.19+/1.20+/1.21+/26.x（26.X 课程分支 73/74 核对，纯 JSON 无需 Java）
sourceKind: authored
---

# Jigsaw 结构生成

自写短文。JSON 全部取自 Kaupenjoe NeoForge 26.X 课程分支 `74-jigsaw-structures`（MIT）的 generated 目录。现代做法是**纯数据包驱动**——不需要写 StructureType Java 代码就能生成自定义建筑。

## 四类文件

| 文件 | 路径 | 职责 |
|------|------|------|
| 结构模板 | `data/<ns>/structure[s]/<name>.nbt` | 建筑本体（结构方块导出的 NBT） |
| structure | `data/<ns>/worldgen/structure/<name>.json` | 入口：jigsaw 参数、生物群系标签、地形适配 |
| structure_set | `data/<ns>/worldgen/structure_set/<name>.json` | **分布**：多远出一个、随机种子盐 |
| template_pool | `data/<ns>/worldgen/template_pool/<name>.json` | 拼接元素池（起点/扩展件） |

## structure：jigsaw 入口（核实样例）

```json
{ "type": "minecraft:jigsaw",
  "start_pool": "mccourse:kaupen_castle",
  "size": 2,                          // jigsaw 拼接深度
  "max_distance_from_center": 80,
  "biomes": "#mccourse:has_structure/kaupen_castle_biomes",   // 能出现在哪些群系（标签）
  "step": "surface_structures",
  "terrain_adaptation": "beard_thin", // 地形贴合：beard_thin/beard_box/bury/encapsulate/none
  "start_height": { "absolute": 0 },
  "project_start_to_heightmap": "WORLD_SURFACE_WG",
  "spawn_overrides": {
    "monster": { "bounding_box": "full",
      "spawns": [ { "type": "minecraft:pillager", "weight": 2, "minCount": 1, "maxCount": 4 } ] } } }
```

- `spawn_overrides` 让结构自带刷怪（城堡刷掠夺者这类）；`bounding_box: full`=整个结构范围。
- 高度策略：`project_start_to_heightmap` 贴地表（地表建筑用），配合 `terrain_adaptation` 防悬空/埋土。

## structure_set：分布控制（核实样例）

```json
{ "structures": [ { "structure": "mccourse:kaupen_castle", "weight": 1 } ],
  "placement": { "type": "minecraft:random_spread",
    "salt": 9281875,        // 随机种子盐：换数字=换分布；不同 mod 用同 salt 会重叠
    "spacing": 12,          // 每 12 chunk 一个网格单元
    "separation": 6 } }     // 单元内至少间隔 6 chunk（spacing > separation）
```

- 密度直觉：spacing 32/separation 8 ≈ 原版村庄稀有度；12/6 相当密集。

## template_pool：拼接池（核实样例）

```json
{ "fallback": "minecraft:empty",
  "elements": [
    { "weight": 1,
      "element": { "location": "mccourse:kaupen_castle",     // 指向 structure/*.nbt
                   "processors": "minecraft:empty",
                   "projection": "rigid",
                   "element_type": "minecraft:single_pool_element" } } ] }
```

- 最简形态=单元素池（整栋建筑一个 NBT）；复杂结构用 start_pool + side_pool 多件拼接（jigsaw 方块接口）。
- `projection: rigid` 原样贴地；`terrain_matching` 让各段随地形升降（如栈桥）。
- `processors` 可做风化/战利品替换（引用 processor list JSON）。

## 群系标签与测试

- 给 `data/minecraft/tags/worldgen/biome/<你声明的标签>.json` 填群系列表（或反向：声明在 mod namespace 的 `has_structure/xxx_biomes`）。
- 测试：新世界 `/locate structure <ns>:<name>`；旧区块不回填。
- 常见坑：NBT 放错目录（`structures/` 复数）、标签没建导致永不生成、salt 撞车导致与其他 mod 的结构永远重叠。

## 不清楚时

- 教程源码（分支 `73-structures`、`74-jigsaw-structures`，MIT）：https://github.com/Tutorials-By-Kaupenjoe/NeoForge-Course-26.X
- 原版字段细节：minecraft.wiki 的 structure/template_pool 页面
- API：`search_neoforge_docs`（关键词 structure）
