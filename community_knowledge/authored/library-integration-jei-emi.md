---
id: authored/library-integration-jei-emi
title: JEI / EMI / REI 配方查看器软依赖接入要点
tags: [jei, emi, rei, interop, optional, client, datagen, forge, fabric, neoforge]
summary: DataGen 配方常零代码；三查看器软依赖 Gradle；Forge/Neo Dist.CLIENT / Fabric client 源集注册；REI 可与 JEI 同装；1.21.2+ JEI 服务端同步与 EMI 活跃窗口；自定义分类再查官方。
mcHint: 1.20.1+ / 1.21+ / 26.x
modIds: [jei, emi, roughlyenoughitems]
loaders: [fabric, forge, neoforge]
modrinthSlug: jei, emi, rei
role: api
skillId: mc-compat-jei
sourceKind: authored
---

# JEI / EMI / REI 配方查看器接入要点

自写短文。三库版本与注册 API 以**当前 jar 对应官方文档**为准；写插件前先打开：
[JEI](https://github.com/mezz/JustEnoughItems) / [EMI](https://github.com/emilyploszaj/emi) / [REI](https://github.com/shedaniel/RoughlyEnoughItems)。

数据基准（《社区常用库模组全览 2026 版》）：JEI 6900 万，F/Forge/Neo，1.8–26.2，最老牌配方 API；EMI 2600 万，F/Forge/Neo/Quilt，1.18.2–1.21.1，零依赖、API 现代，**1.21+ 才活跃**、1.20.4 以下冻结；REI 2420 万，F/Forge/Neo/**Rift**，1.13–26.2，支持 JEI 插件、可与 JEI 同装。

## 构件面逐 slug 实测（2026-09-25：判据⑤ 的「少推荐」欠账点名本档 `quilt`，**结论 = 不点名**）

本档是**三库合并行**（本档 `modrinthSlug: jei, emi, rei` ⇒ 生成物里被生产者按字典序归一成 `"emi,jei,rei"`），判据⑤ 腿 B 按 loader **并集**读构件面，于是把 `quilt` 列成 INFO「少推荐」（不判红）。但并集不能当「本档点名的库族支持 quilt」的证据 ⇒ 逐 slug 实测（数据 = `mcp-server/data/lib-manifests/all.json`，快照 as-of 2026-09-16）：

| slug | 在构件面？ | fabric | forge | neoforge | **quilt** |
|---|---|---|---|---|---|
| `emi` | 在（36 行） | 13 行 / 13 release | 6 行 / 6 release | 4 行 / 4 release | **13 行 / 13 release，点分上界 1.21.1** |
| `jei` | 在（73 行） | 19 行 / **0 release**（17 beta + 2 alpha） | 39 行 / 14 release（上界 1.18.2） | 15 行 / **0 release**（全 beta） | **0 行** |
| `rei` | **不在构件面**（快照无该 slug） | — | — | — | — |

⇒ 三条结论：

1. **不给本档 `loaders` 补 `quilt`**：那 13 条 quilt 行**全部**来自 `emi` 一家，且 12 个唯一 fileName 与该 slug 的 fabric 行**完全重合**（`emi-*-+fabric.jar`）⇒ 是「EMI 的 Fabric 构件被同时打了 quilt 标签」，不是三家共有；把 quilt 写进这条**合并行**会让 `check_dependencies` 对只装 JEI 或只装 REI 的 Quilt 工程也报「本档覆盖 quilt」。
2. **反向也要读对**：`jei` 自己那 19 条 fabric 行与 15 条 neoforge 行**一条 release 都没有**（全 beta/alpha），本档之所以能点名 fabric/neoforge 靠的是 `emi` 的 release 行 —— **合并面会让一家替另一家背书**，这是本档 `loaders` 的已知局限（已登记在 `CONTRIBUTING.md` `L45`，不在本轮修）。
3. `rei` 是「**判面缺失**」不是「REI 无构件」：快照里根本没有 `roughlyenoughitems` / `rei` 这两个 slug ⇒ 禁止据「0 行」断言 REI 不支持某 loader（该欠账 = `L42` ①「构件面重抓」）。

至于 EMI 自身的 quilt 事实：**成立**（13 条 release 到 1.21.1）⇒ 需要给 Quilt 工程写 EMI 依赖时，读本节表内 `emi` 行、并按 1.21.1 及以下取版本；26.x 无 quilt 行。

复核（只读、不落盘）：`node temp/ralph-20260922/_r37-probe-slug-loader.mjs`（逐 slug 逐 loader 行数 + versionType 分解 + 数值序上界）· `node temp/ralph-20260922/_r37-probe-rows.mjs`（逐行 fileName 与跨 loader 交集）。

## 集成总决策

- 新模组：**JEI + EMI 双插件**；NeoForge 1.21+ 生态 EMI 渗透率上升，EMI 与 JEI 平级对待。  
- REI：可与 JEI 同装，其 JEI 插件兼容层能直接跑 JEI 插件，通常**不需要**单独写 REI 插件；同装时注意别让插件被两边重复注册。

## 最常见路径：零插件代码

配方已通过 DataGen 写到 `data/<modid>/recipes/*.json` 时，三者在客户端加载数据包都会**自动展示**，通常不需要写分类插件。

检查：1. runData / CI 已生成 JSON；2. 路径与命名空间正确（`modid:path`）；3. 开发环境 `runtimeOnly` 装查看器自测。联动 Skill：`mc-datagen`、`mc-compat-jei`。

## 每库接入要点

### JEI（mezz）

- **坐标示例（compileOnly 软依赖，版本号以官方 README 为准）**：Forge/Neo：`compileOnly fg.deobf("mezz.jei:jei-<mc>-<forge|neoforge>:<version>")`；Fabric：`compileOnly("mezz.jei:jei-<mc>-fabric:<version>")`。开发自测加 `runtimeOnly` 完整 jar。
- **注册要点（伪代码，类名以官方为准）**：实现 `IModPlugin`（`@JeiPlugin` 注解）→ 在注册回调里 `addRecipes` / 注册分类；隐藏、移动分类走客户端插件事件。DataGen 已覆盖的配方不要重复注册。
- **坑**：旧教程的 `IRecipeWrapper` / 旧版 Category API 已废弃，照抄必炸；插件类只放 client。

### EMI（emilyploszaj）

- **坐标示例**：按官方 README，Fabric 与 Forge/Neo 分 artifact；同样 `compileOnly` + 开发 `runtimeOnly`。
- **注册要点（伪代码，接口名以官方为准）**：实现 `EmiPlugin`，在 `register` 回调里向 `EmiRegistry` 添加分类 / 配方；EMI 带 JEI 兼容层，老 JEI 插件可能直接可用。
- **坑**：支持区间 1.18.2–1.21.1 且 **1.20.4 以下冻结**：1.20.1 老版本按冻结版 API 写，别抄 1.21+ 新写法；26.x 现状以官方仓库为准。

### REI（shedaniel）

- **坐标示例**：`me.shedaniel:RoughlyEnoughItems-<loader>:<version>` 形态（按目标加载器选 artifact，版本以官方 README 为准）。
- **注册要点（伪代码，接口名以官方为准）**：客户端实现 `REIClientPlugin`（`registerRecipes` / `registerCategories`）；服务端需同步数据时用 `REIServerPlugin`。Rift 加载器（1.13 旧生态）也有对应版本，写前先确认目标加载器。
- **坑**：**JEI 插件兼容层 + JEI 本体同装**时同一插件可能被两边注册，出现条目重复 / 冲突；同装场景用门闩分环境注册，行为以官方兼容说明为准。

## 版本窗口（与 `authored/lib-traps-2026` 交叉引用）

- **1.21.2+ / 26.x JEI**：服务端**也需装 JEI** 以同步配方；只装客户端会出现配方缺失。  
- **EMI 活跃窗口**：1.21+ 才活跃，1.20.4 以下冻结；老版本选 EMI 前先确认该 MC 版本是否仍维护。  
- **REI**：1.13–26.2 全程覆盖，老生态兼容最好；Rift 仅限 1.13 旧时代。

## 运行时门闩

```java
// ≤1.20.4 Forge：DistExecutor.runWhenOn（非 26.x）
// 26.x：JeiClientCompat 放 client 源集，或 FMLLoader.getDist() == Dist.CLIENT
if (ModList.get().isLoaded("jei")) {
    DistExecutor.runWhenOn(Dist.CLIENT, () -> () -> JeiClientCompat.init());
}
// Fabric/Quilt：JeiClientCompat 放 client 源集；entrypoints client 或 @Environment(EnvType.CLIENT) 门闩内 init()
// if (FabricLoader.getInstance().isModLoaded("jei")) { JeiClientCompat.init(); }
```

`JeiClientCompat` 放 `client` 包，内部才 `import mezz.jei…`。EMI modId 常见为 `emi`、REI 为 `roughlyenoughitems`（以对方 mods.toml / fabric.mod.json 为准）；Fabric 用 `FabricLoader.getInstance().isModLoaded(...)`。

## 常见错误

- 服务端注册查看器类 → 专用服或逻辑服崩溃  
- 配方 JSON 在 `src/main/resources` 但从未 runData，IDE 里「有文件」、游戏里却没有  
- 主类 static 引用查看器类型 → 未装时 `NoClassDefFoundError`（应用 `modlist-compat-gate` 模式）  
- 只 compileOnly 却当硬依赖用，从不 `isLoaded`  
- 1.21.2+ 只在客户端装 JEI（服务端配方同步缺失）  
- REI 与 JEI 同装时插件重复注册

## 自检

- 无任何查看器：模组正常进世界，合成表仍可通过原版书查看数据包配方（若已生成）  
- 有 JEI / EMI / REI：配方出现在对应界面；流体 / 自定义类无红字日志  
- `runServer` 不加载查看器类（1.21.2+ JEI 例外：服务端需装）  
- REI 与 JEI 同装跑一次：无重复条目

## 不清楚时

- 总清单：`authored/library-integration`  
- 官方仓库：文首 JEI / EMI / REI GitHub 链接与 `mc-compat-jei` Skill；`search_forge_docs` 查不到查看器细节时以官方为准  
- `community_knowledge/AGENT_USAGE.md`：短文不能替代 API 查询

## 核对（2026-08 反编译验证）

- 已对以下版本反编译核对（VineFlower + catalog verifiedApi）：
  - 1.20.1/forge：顶层 API 包 `dev.emi.emi`（EMI）
  - 1.20.1/fabric：顶层 API 包 `dev.emi.emi`（EMI）
  - 26.2/fabric：顶层 API 包 `mezz.jei`（JEI）
- 版本/包名详情见 `mcp-server/src/diagnostics/library-catalog.ts` 对应条目；细节仍以官方文档为准。
