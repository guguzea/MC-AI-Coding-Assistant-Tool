---
id: authored/lib-terrablender
title: TerraBlender 生物群系 API 集成要点
tags: [terrablender, biome, worldgen, region, surface-rule, forge, fabric, neoforge, quilt]
summary: region 机制兼容式添加生物群系的 API（3610 万下载，F/Forge/Neo/Quilt 1.18.1-26.2），1.18+ 地形系统的标准方案。BOP/BYG/Regions Unexplored 等群系模组依赖。
mcHint: 1.18.1-26.2
minecraftVersions: "1.18.1-26.2"
sourceKind: authored
modIds: [terrablender]
loaders: [fabric, forge, neoforge, quilt]
modrinthSlug: terrablender
role: api
skillId: mc-terrablender
---

# TerraBlender 生物群系 API 集成要点

自写短文。TerraBlender 的 API 与版本细节以 [官方仓库](https://github.com/Glitchfiend/TerraBlender) 当前 README 与 wiki 为准。

## 何时用 / 何时不用

用：1.18+ 需要**往现有世界生成里添加自定义生物群系**（全览报告 §二.5）。TerraBlender 的 **region 机制**把群系声明进区域，由它兼容式地把你的群系混入原版（或其它模组）的地形，不替换原版群系提供器。这是 1.18+ 地形系统的**标准方案**：

- 往主世界/下界/末地加新生物群系，与其它群系模组共存
- 自定义地表（Surface Rule）与群系权重
- 3610 万下载，Biomes O' Plenty（BOP）、Oh The Biomes You'll Go（BYG）、Regions Unexplored 等主流群系模组都依赖它

不用：

- 只是想自定义某个生物群系内的结构/装饰 → 用原版数据包与 worldgen 即可，不必引库
- 完全自建维度、不想与其它群系模组共存 → 原版维度/NoiseRouter 方案更直接
- 版本 < 1.18.1（窗口外）

## Decision Flow

```
Decision: 要不要用 TerraBlender
→ 版本 < 1.18.1 → 不用（窗口外）
→ 在现有世界加群系、要与其它群系模组共存 → TerraBlender（标准方案）
→ 自建独立维度/完全掌控地形 → 原版维度方案，或仍可用 TerraBlender 的 region 细分
→ 已选 TerraBlender：
   ├─ 版本：1.18.1-26.2 内与 MC 对齐（文件页为准）
   ├─ region：把你的群系声明进一个 region（主世界/下界/末地对应），权重可调
   ├─ 地表：配 Surface Rule 定义方块层，别手写 BiomeProvider
   └─ 兼容：与 BOP/BYG 等共存时 region 之间靠权重协商，冲突以日志为准
```

## Gradle / 声明文件检查顺序

1. `build.gradle`：官方 README 的 maven 仓库与坐标照抄；Fabric 走 Loom `modImplementation`，Forge/Neo/Quilt 对应配置
2. `mods.toml` / `neoforge.mods.toml` / `fabric.mod.json` / `quilt.mod.json`：`depends` 写 terrablender；软依赖门闩见 `authored/soft-deps-modlist`
3. 版本核对：1.18.1-26.2 内按你的 MC 版本选文件，26.x 用最新构建
4. 若与 BOP/BYG/Regions Unexplored 同时安装：确认各方 TerraBlender 版本兼容，避免 region 冲突

## 集成要点（伪代码级）

```java
// 类名/包名以官方 README 为准，下面只是流程
// 启动阶段：注册你的 region（主世界 region / 下界 region / 末地 region），指定权重
// 群系：把自定义群系绑定到 region 的群系提供器里，附生成条件/权重
// 地表：注册 Surface Rule（顶层方块/下层方块/噪声），加到该 region 的规则列表
// 数据包侧：群系 JSON、生物群系标签照常放 data/<modid>/worldgen/...
```

- region 是「在哪生成」的容器，群系是「生成什么」，两者分开管理
- Surface Rule 优先级敏感，规则顺序错了会被别的模组覆盖
- 客户端服务端都要能拿到群系数据，资源/数据包路径别写错

## 常见坑

- 不声明 region 直接改 BiomeProvider → 与其它模组冲突/世界生成异常
- Surface Rule 顺序或优先级不对 → 地表被覆盖或产生异常地形
- 群系 ID / 数据包路径与 modId 不一致 → 群系不生成或加载失败
- 只 `compileOnly` 却硬依赖 → 未装 TerraBlender 时 `NoClassDefFoundError`
- 权重配得极端（如 99）→ 原版群系几乎不出现，先小权重验证

## 自检清单

- 依赖版本与文件页一致（1.18.1-26.2 内）
- 未装 TerraBlender（若软依赖）：模组正常进档
- 新群系在世界中实际生成，地表方块层符合预期
- 与 BOP/BYG 等共存时无 region 冲突日志，原版群系仍在
- 服务端与客户端加载无 worldgen 相关异常

## 交叉引用

- MCP：`check_dependencies`、`generate_worldgen`、`search_community_docs`
- Skill：`mc-terrablender`；相关：`mc-worldgen`、`mc-datapack`
- 全览：§二.5 世界生成、§四 Forge 路线（TerraBlender 列于群系）；`authored/library-catalog-2026`、`authored/soft-deps-modlist`
- 官方：https://github.com/Glitchfiend/TerraBlender ；依赖方参考：BOP https://github.com/Glitchfiend/BiomesOPlenty
- 不清楚时：打开官方 README + wiki（含示例群系与 region 配置）；AGENT_USAGE.md 规则先行
