---
id: authored/lib-cloth-config
title: Cloth Config 配置库集成要点
tags: [cloth-config, config, gui, client, modmenu, fabric, forge, neoforge]
summary: 老牌配置 GUI 库（1.53 亿下载，F/Forge/Neo 1.14-26.2，已冷冻）。新项目优先评估 YACL / Fzzy / owo-config；选用 Cloth 时 ConfigBuilder 建屏、Screen 仅客户端、Mod Menu 软依赖。
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

用：需要友好配置屏的 Fabric / Forge / NeoForge 模组（1.14-26.2）。ConfigBuilder 生成界面是老牌方案，REI、Kiwi 等海量模组依赖。Forge 侧若只要服务端配置，`ForgeConfigSpec`（见 patterns `config-spec`）通常就够，不必引 Cloth。

不用（重要）：Cloth 已**冷冻**，作者声明不再加新特性（全览报告 §五）。新项目或要长期维护的项目，优先评估：

- YACL：1.19-26.3，F/Forge/Neo/Quilt，Builder 式、界面契合原版风格，因 Cloth 停更而生（1.11 亿下载）
- Fzzy Config：1.20.1-26.2，自动 GUI、强校验、服务端-客户端同步
- owo-config（owo-lib 内）：F/Neo/Quilt，注解式 + 自动 GUI + 同步，⚠️ 不支持 Forge

## Decision Flow

```
Decision: 要不要用 Cloth Config
→ 单平台 Forge 且仅服务端配置 → ForgeConfigSpec（patterns config-spec），不引 Cloth
→ 新项目 / 长期维护 → 评估 YACL / Fzzy / owo-config（分支见上表）
→ 已有 Cloth 依赖（REI/Kiwi 生态）或只需现成 API → Cloth，但别期待新特性
→ 已选 Cloth：
   ├─ 版本：1.14-26.2 内与 MC 对齐（Modrinth/CurseForge 文件页）
   ├─ 配置读写路径：由 Cloth 管理，禁止手写冲突路径
   └─ 入口：Fabric 用 Mod Menu 软依赖挂「Config」按钮；Forge/Neo 用自建按钮或 ModMenuPort
```

## Gradle / 声明文件检查顺序

1. `build.gradle`：官方 README 的仓库（maven.shedaniel.me，以 README 为准）与坐标，`compileOnly` + `runtimeOnly` 或 Loom 的 `modImplementation` 照 README 抄
2. `mods.toml`（26.x 为 `neoforge.mods.toml`）：`depends` 写 cloth-config；软依赖则用 `ModList.get().isLoaded("cloth-config")` 门闩（见 `authored/soft-deps-modlist`）
3. `fabric.mod.json`：`depends` 或 `suggests`；Mod Menu 入口单独软依赖（modId 为 `modmenu`），Cloth 与 Mod Menu 解耦
4. 版本核对：冷冻不等于停更，26.x 仍有构建，但坐标以文件页为准

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
- 期待 Cloth「加新特性」→ 已冷冻，需求不满足时换 YACL / Fzzy
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
- 全览：§二.1 配置库、§五（Cloth 冷冻）；`authored/library-catalog-2026`、`authored/library-integration`
- 官方：https://github.com/shedaniel/cloth-config ；YACL：https://github.com/isXander/YetAnotherConfigLib
- 不清楚时：打开 Cloth README + 示例 mod，或 `search_fabric_docs` / `search_forge_docs` 查配置相关页；AGENT_USAGE.md 规则先行
## 核对

- MC 1.20.1 + Fabric（cloth-config-11.1.136-fabric.jar，2026-08 反编译核对：325 个 java 文件，顶层包 me.shedaniel.clothconfig2 / me.shedaniel.autoconfig）
- 细节仍以官方为准：https://github.com/shedaniel/cloth-config
