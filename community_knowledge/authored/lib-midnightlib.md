---
id: authored/lib-midnightlib
title: MidnightLib 配置库集成要点
tags: [midnightlib, config, gui, client, jar-in-jar, fabric, forge, neoforge, quilt]
summary: 轻量配置库（2510 万下载；F/Forge/Neo/Quilt，1.17-26.2）。API 简单，鼓励以 Jar-in-Jar 方式打包进宿主模组分发。
mcHint: 1.17-26.2
minecraftVersions: "1.17-26.2"
sourceKind: authored
modIds: [midnightlib]
loaders: [fabric, forge, neoforge, quilt]
modrinthSlug: midnightlib
role: api
skillId: mc-config
---

# MidnightLib 配置库集成要点

自写短文。版本与 API 细节以 [MidnightLib](https://github.com/TeamMidnightDust/MidnightLib) 当前 README 为准。

## 何时用 / 何时不用

用：想要轻量配置库、且接受把库以 Jar-in-Jar 方式打包进自己模组分发的小模组（1.17-26.2，F/Forge/Neo/Quilt）。API 简单，配置生成快，Modrinth 2510 万下载，多被中小型模组采用。

不用：需要复杂校验、服务端-客户端同步、或 Builder 式精细界面时，选 Fzzy Config / YACL；仅服务端配置时 Forge/Neo 的 `ForgeConfigSpec` 更轻；不打算 Jar-in-Jar 打包、也不想让用户多装一个依赖时，评估是否自己写简单配置。

## Decision Flow

```
Decision: 要不要用 MidnightLib
→ 需要自动 GUI + 校验 + 同步 → Fzzy Config / YACL
→ 单平台 Forge/Neo 且仅服务端配置 → ForgeConfigSpec（patterns config-spec）
→ 轻量配置 + 接受 JiJ 打包 → MidnightLib
→ 已选 MidnightLib：
   ├─ 版本：在 1.17-26.2 内与 MC 对齐（Modrinth 文件页）
   ├─ 分发：优先 Jar-in-Jar 打包进你的 jar（见官方 README 的 JiJ 章节）
   └─ 无 JiJ 时：作为硬依赖声明，用户需另行安装
```

## Gradle / 声明文件检查顺序

1. `build.gradle`：官方 README 的仓库与坐标（不同加载器 artifact 不同）；做 Jar-in-Jar 时按 README 配置 `jarJar` 依赖（Loom 用 `include` / `jarJar`，Forge 用 `jarJar` 配置，以 README 为准）
2. `mods.toml`（26.x 为 `neoforge.mods.toml`）：JiJ 打包后 `depends` 可写 `midnightlib`（版本来自 JiJ 声明）；软依赖仍用 `ModList.get().isLoaded(...)` 门闩（见 `authored/soft-deps-modlist`）
3. `fabric.mod.json`：JiJ 由 Loom 处理；`depends` / `suggests` 按分发方式决定
4. 版本核对：坐标以文件页为准

## 集成要点（伪代码级）

```java
// 类名以官方为准：MidnightLib 提供简单配置对象与配置界面入口
// 典型流程：定义配置字段与默认值 → 初始化 → 打开配置 Screen（客户端）
// 打开界面：客户端门闩内 setScreen(...)；Forge 侧注意 Dist.CLIENT
// 分发：JiJ 打包后无需用户单独装 MidnightLib，代码里按常规依赖使用
```

- 配置持有：库管理读写，业务代码只读配置对象
- Screen 类放 `client` 侧，公共代码只留门闩

## 常见坑

- 声明了依赖却忘了 JiJ 打包 → 用户必须手动装 MidnightLib，违背轻量初衷
- Screen 类被公共/服务端代码引用 → 专用服崩溃（应用 `Dist.CLIENT` 门闩）
- JiJ 配置写错（Loom `include` 漏写）→ 打包后运行时 `ClassNotFoundException`
- 期待 26.2 以上版本 → 以官方发布为准，勿假定滚动跟进

## 自检清单

- 只装你的模组（JiJ 分发）：配置屏能打开，改动保存后重进保留
- 检查产物 jar：`midnightlib` 被打进 `META-INF/jarjar/` 或等价位置
- `runServer` 日志无配置 GUI 类加载
- 依赖注入的配置对象值与文件内容一致

## 交叉引用

- MCP：`generate_config`、`check_dependencies`、`search_community_docs`
- Skill：`mc-config`；相关：`mc-gui`
- 全览：§二.1 配置库；`authored/library-catalog-2026`、`authored/lib-cloth-config`、`authored/lib-yacl`、`authored/lib-fzzy-config`、`authored/library-integration`
- 官方：https://github.com/TeamMidnightDust/MidnightLib
- 不清楚时：打开 MidnightLib README（尤其 Jar-in-Jar 章节），或 `search_fabric_docs` / `search_forge_docs`；AGENT_USAGE.md 规则先行

## 核对（2026-08 反编译验证）

- 已对以下版本反编译核对（VineFlower + catalog verifiedApi）：
  - 26.2/fabric：顶层 API 包 `eu.midnightdust`，入口 `eu.midnightdust.core.MidnightLib`；`eu.midnightdust.core.MidnightLib$ModMenuInit`；`eu.midnightdust.lib.config.AutoCommand`
  - 1.17-pre1/fabric：顶层 API 包 `eu.midnightdust`，入口 `eu.midnightdust.core.MidnightLibClient`；`eu.midnightdust.hats.config.ModMenuIntegration`
- 版本/包名详情见 `mcp-server/src/diagnostics/library-catalog.ts` 对应条目；细节仍以官方文档为准。
