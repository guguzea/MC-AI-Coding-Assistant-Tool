---
id: authored/multi-face-block-models
title: 多面贴图与朝向方块模型
tags: [blockstate, model, facing, blockbench, resources, horizontaldirectional]
summary: cube_all 局限；machine 贴图组织；HorizontalDirectionalBlock 三方法；逻辑朝向 vs JSON 旋转；复杂 BlockItem 用 cube 分面。
mcHint: 1.20.1+
sourceKind: authored
---

# 多面贴图与朝向方块模型

自写短文。

## 资源根与命名

```
src/main/resources/assets/<modid>/
  textures/block/           # 或 block/machine/ 分子目录
  textures/item/
  models/block/
  models/item/
  blockstates/
  lang/
```

- 贴图/模型文件名通常等于**注册名**字符串。  
- 路径：`modid:block/...` 对应 `textures/block/...png`（无 `textures/` 前缀、无 `.png`）。

## 简单 vs 多面

| 场景 | 方块模型 | BlockItem 模型 |
|------|----------|----------------|
| 六面同一张图 | `parent: cube_all`，`textures.all` | 常可 `parent: modid:block/xxx` |
| 每面不同（机器） | 分面 textures 或 Blockbench elements | 常用 `parent: minecraft:block/cube` + 逐面 textures |

`particle` 建议始终指定，避免破坏粒子缺贴图。

## 贴图组织建议（机器）

- 目录：`textures/block/machine/`  
- 通用侧面/顶底：`machine_side`、`machine_top`… 多台机器复用  
- 正面：功能专名，如 `industrial_processing_unit_idle` / `_working`  
- Blockbench：直观看 north 朝向，减少「面贴错」；导出后改 texture 路径前缀为本 modid

## HorizontalDirectionalBlock

水平四向机器/工作台常用：

1. `FACING` 直接复用父类常量（子类可再 `public static final` 声明一次便于阅读）。  
2. `registerDefaultState`：默认 `NORTH`。  
3. `createBlockStateDefinition`：`builder.add(FACING)` — **漏了会崩**。  
4. `getStateForPlacement`：常用 `context.getHorizontalDirection().getOpposite()`，让**正面朝向玩家**。  
5. 父类已处理 `rotate` / `mirror`；一般不必再手写结构空旋转。

不含上下吸附时不要硬上六向 `FACING`，除非真要天花板机器。

## blockstate：逻辑朝向 ≠ 模型角

代码只存 `facing=north|south|east|west`；**外观旋转写在 JSON**：

```json
"facing=north": { "model": "modid:block/machine", "y": 0 },
"facing=east":  { "model": "modid:block/machine", "y": 90 },
"facing=south": { "model": "modid:block/machine", "y": 180 },
"facing=west":  { "model": "modid:block/machine", "y": 270 }
```

`y` 一般为 90° 倍数。组合 `working` 时键写成 `facing=north,working=false` 等；工作态换模型即可，旋转规则与待机相同。

## 复杂 BlockItem 为何不用简单 parent

自定义 block 模型若含多 texture 槽，物品栏只写 `"parent": "modid:block/xxx"` 可能无法正确「上色」。  
实践：`minecraft:block/cube` 作父级，在物品模型里为 north/south/east/west/up/down/particle 赋与方块一致的贴图。

## 自检

- 创造栏缩略图是否三角面正确、无紫黑。  
- 放置后面朝玩家；结构方块旋转/镜像后朝向仍合理。  
- WORKING 切换只换正面贴图时，旋转变体是否齐全。

## 不清楚时

- 机器 WORKING：`authored/machine-be-gui-working`  
- 工程化外链（禁转载，仅浏览）：https://www.mcmod.cn/post/6071.html  
- 资源路径以 wiki / `search_forge_docs` 模型章为准
