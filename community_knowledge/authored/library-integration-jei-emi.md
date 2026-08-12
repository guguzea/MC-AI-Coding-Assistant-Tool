---
id: authored/library-integration-jei-emi
title: JEI / EMI / REI 配方查看器软依赖接入要点
tags: [jei, emi, rei, interop, optional, client, datagen, forge, fabric, neoforge]
summary: DataGen 配方常零代码；三查看器软依赖 Gradle；Dist.CLIENT 注册；REI 可与 JEI 同装；1.21.2+ JEI 服务端同步与 EMI 活跃窗口；自定义分类再查官方。
mcHint: 1.20.1+ / 1.21+ / 26.x
modIds: [jei, emi, roughlyenoughitems]
loaders: [fabric, forge, neoforge]
modrinthSlug: jei, emi, roughly-enough-items
role: api
skillId: mc-compat-jei
sourceKind: authored
---

# JEI / EMI / REI 配方查看器接入要点

自写短文。三库版本与注册 API 以**当前 jar 对应官方文档**为准；写插件前先打开：
[JEI](https://github.com/mezz/JustEnoughItems) / [EMI](https://github.com/emilyploszaj/emi) / [REI](https://github.com/shedaniel/RoughlyEnoughItems)。

数据基准（《社区常用库模组全览 2026 版》）：JEI 6900 万，F/Forge/Neo，1.8–26.2，最老牌配方 API；EMI 2600 万，F/Forge/Neo/Quilt，1.18.2–1.21.1，零依赖、API 现代，**1.21+ 才活跃**、1.20.4 以下冻结；REI 2420 万，F/Forge/Neo/**Rift**，1.13–26.2，支持 JEI 插件、可与 JEI 同装。

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

## 版本窗口（与规划中的 `authored/lib-traps-2026` 交叉引用）

- **1.21.2+ / 26.x JEI**：服务端**也需装 JEI** 以同步配方；只装客户端会出现配方缺失。  
- **EMI 活跃窗口**：1.21+ 才活跃，1.20.4 以下冻结；老版本选 EMI 前先确认该 MC 版本是否仍维护。  
- **REI**：1.13–26.2 全程覆盖，老生态兼容最好；Rift 仅限 1.13 旧时代。

## 运行时门闩

```java
// 示例：仅在 JEI 存在时注册客户端兼容
if (ModList.get().isLoaded("jei")) {
    DistExecutor.unsafeRunWhenOn(Dist.CLIENT, () -> () -> JeiClientCompat.init());
}
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
