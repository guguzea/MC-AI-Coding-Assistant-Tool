---
id: authored/lib-cloth-config
title: Cloth Config 配置库集成要点
tags: [cloth-config, config, gui, client, modmenu, fabric, forge, neoforge]
summary: 老牌配置 GUI 库（Modrinth API 实测 1.62 亿下载，F/Forge/Neo 1.14-26.2，158 条构建）。功能冻结但**没有停更**：实测仍按 MC/Neo 版本线发版（末次 2026-06-18，最新 v26.2.155）。新项目优先评估 YACL / Fzzy / owo-config；选用 Cloth 时 ConfigBuilder 建屏、Screen 仅客户端、Mod Menu 软依赖。
mcHint: 1.14-26.2
minecraftVersions: "1.14-26.2"
sourceKind: authored
modIds: [cloth-config]
loaders: [fabric, forge, neoforge]
modrinthSlug: cloth-config
role: api
skillId: mc-config
---

# Cloth Config 配置库集成要点

自写短文。版本与 API 细节以 [Cloth Config](https://github.com/shedaniel/cloth-config) 当前 README 与示例 mod 为准。

## 何时用 / 何时不用

用：需要友好配置屏的 Fabric / Forge / NeoForge 模组（实测 1.14 → 26.2，158 条构建 / 148 条稳定版，Modrinth API 2026-09-02）。ConfigBuilder 生成界面是老牌方案，REI、Kiwi 等海量模组依赖。Forge 侧若只要服务端配置，`ForgeConfigSpec`（见 patterns `config-spec`）通常就够；Neo ≥1.20.4（含 26.x）对应 `ModConfigSpec`，不必引 Cloth。

不用（重要）：Cloth 处于**功能冻结**——作者声明不再加新特性（全览报告 §五），但实测**这不是停更**：最近 8 个有发布的月份横跨 2024-10 → 2026-06（2024-10、2024-12、2025-03、2025-06、2025-10、2025-12、2026-03、2026-06 各有构建，末次 2026-06-18 = `v26.2.155`）。所以「按 MC 版本拿到能跑的 Cloth 构建」没问题，「等它加新 API」没有。新项目或要长期维护的项目，优先评估：

- YACL：实测 1.19 → 26.3-snapshot-1、**稳定版上界 26.2**，F/Forge/Neo/Quilt 四端，Builder 式、界面契合原版风格，因 Cloth 功能冻结而生（实测 1.18 亿下载）
- Fzzy Config：1.20.1-26.2，自动 GUI、强校验、服务端-客户端同步
- owo-config（owo-lib 内）：F/Neo/Quilt，注解式 + 自动 GUI + 同步，⚠️ 不支持 Forge

## Decision Flow

```
Decision: 要不要用 Cloth Config
→ 单平台 Forge 且仅服务端配置 → ForgeConfigSpec（patterns config-spec），不引 Cloth
→ 单平台 NeoForge（≥1.20.4，含 26.x）且仅服务端配置 → ModConfigSpec，不引 Cloth
→ 新项目 / 长期维护 → 评估 YACL / Fzzy / owo-config（分支见上表）
→ 已有 Cloth 依赖（REI/Kiwi 生态）或只需现成 API → Cloth，但别期待新特性
→ 已选 Cloth：
   ├─ 版本：1.14-26.2 内与 MC 对齐（Modrinth/CurseForge 文件页）
   ├─ 配置读写路径：由 Cloth 管理，禁止手写冲突路径
   └─ 入口：Fabric 用 Mod Menu 软依赖挂「Config」按钮；Forge/Neo 用自建按钮或 ModMenuPort
```

## 分发窗口（Modrinth API 实测 2026-09-02）

来源级别标注：**实测** = 当日直连 `api.modrinth.com/v2` 翻页取全部构建后统计；**项目级标签** = Modrinth 项目元数据里的 `loaders`/`categories`，可能陈旧。「稳定版」判定：构建的 `name` + `game_versions` + `version_type` 均不含 `snapshot|alpha|beta|rc|pre|dev`。

| 断言 | 数值 | 来源级别 |
| --- | --- | --- |
| 分发区间 | 1.14 → 26.2，158 条构建 / 148 条稳定版 | 实测 |
| 逐端构建数 | fabric 77、forge 50、neoforge 31、**quilt 0** | 实测（按构建 `loaders` 累加） |
| 末次发布 | 2026-06-18：`[Fabric 26.2] v26.2.155` + `[NeoForge 26.2] v26.2.155` | 实测 |
| 26.1 版本线 | `[Fabric 26.1] / [NeoForge 26.1] v26.1.154`（2026-03-26，game_versions 26.1、26.1.1、26.1.2） | 实测 |
| 发版节奏 | 最近 8 个有发布的月份跨 2024-10 → 2026-06，相邻间隔 2-4 个月（非每月） | 实测 |
| 版本号口径 | 26.x 构建号已改为与 MC 对齐（`v26.2.155` / `v26.1.154`）；1.20.1 时代是 `11.1.136` | 实测（构建 `name`） |
| 下载量 | 162,414,346 | 实测（项目级 `downloads`，会随时间涨） |

## Gradle / 声明文件检查顺序

1. `build.gradle`：官方 README 的仓库（maven.shedaniel.me，以 README 为准）与坐标，`compileOnly` + `runtimeOnly` 或 Loom 的 `modImplementation` 照 README 抄
2. `mods.toml`（26.x 为 `neoforge.mods.toml`）：`depends` 写 cloth-config；软依赖则用 `ModList.get().isLoaded("cloth-config")` 门闩（见 `authored/soft-deps-modlist`）
3. `fabric.mod.json`：`depends` 或 `suggests`；Mod Menu 入口单独软依赖（modId 为 `modmenu`），Cloth 与 Mod Menu 解耦
4. 版本核对：功能冻结 ≠ 停更 —— 实测末次发布 2026-06-18（`v26.2.155`），26.x 仍有构建；注意号段口径变了：26.x 构建叫 `v26.2.155`，而我们反编译核对过的 1.20.1 版本叫 `11.1.136`，别拿旧号段套新版本，照文件页抄

## 集成要点（伪代码级）

```java
// 客户端专用：Screen 构建只在客户端触发（Forge/Neo：`Dist.CLIENT`；Fabric/Quilt：client 源集 + `@Environment(EnvType.CLIENT)`）
// 类名以官方为准：me.shedaniel.clothconfig2.api.ConfigBuilder / ConfigEntryBuilder（包名长期稳定）
// 典型流程：ConfigBuilder.create() → 分类/条目 → setSavingRunnable(保存到你的配置持有类) → build()
// 返回的 Screen 塞给 Minecraft 的 setScreen(...) 或 Mod Menu 的配置入口回调
```

- 配置持有：自己管理 POJO + 序列化，Screen 只做读写桥，别把业务逻辑塞进 Builder
- Screen 类一律放 `client` 侧，公共代码只保留「打开配置屏」的客户端门闩

## 常见坑

- Screen 类被公共/服务端代码引用 → 专用服崩溃（Forge/Neo：`Dist.CLIENT` 门闩；Fabric/Quilt：client 源集 + `@Environment(EnvType.CLIENT)`）
- 期待 Cloth「加新特性」→ 功能冻结（实测 26.x 仍在按 MC 版本发版，但没有新 API），需求不满足时换 YACL / Fzzy
- 反过来把「冻结」读成「已死」而拒绝升级到本版构建 → 实测 v26.2.155 就在 26.2，用旧号段/旧版照样是踩坑
- Quilt 工程按 Fabric 坐标直接引 Cloth → 实测 158 条构建中 quilt 0 条；Quilt 侧走 QSL 配置或按 QSL 文档，不要当 Fabric 工程照抄
- 手写配置路径与 Cloth 冲突，或双份配置（ForgeConfigSpec + Cloth 各一份）
- 只 `compileOnly` 却当硬依赖用，未装 Cloth 时 `NoClassDefFoundError`

## 自检清单

- 未装 Cloth 时（若软依赖）：模组正常进档，不加载 Cloth 类
- 仅装 Cloth：客户端配置屏能打开，改动保存后重进保留
- `runServer` 日志无 Cloth 相关类加载
- Mod Menu 列表里能看到你的配置入口（若接了）

## 交叉引用

- MCP：`generate_config`、`check_dependencies`、`search_community_docs`
- Skill：`mc-config`；相关：`mc-gui`
- 全览：§二.1 配置库、§五 陷阱 7（**二手**措辞「Cloth 冷冻」；本文件上表为实测口径 = 功能冻结但仍在按版本发版）；`authored/library-catalog-2026`、`authored/library-integration`
- 官方：https://github.com/shedaniel/cloth-config ；YACL：https://github.com/isXander/YetAnotherConfigLib
- 不清楚时：打开 Cloth README + 示例 mod，或 `search_fabric_docs` / `search_forge_docs` 查配置相关页；AGENT_USAGE.md 规则先行
## 核对

- MC 1.20.1 + Fabric（cloth-config-11.1.136-fabric.jar，2026-08 反编译核对：325 个 java 文件，顶层包 me.shedaniel.clothconfig2 / me.shedaniel.autoconfig）
- 细节仍以官方为准：https://github.com/shedaniel/cloth-config
