---
id: authored/lib-fzzy-config
title: Fzzy Config 配置库集成要点
tags: [fzzy-config, fzzy, config, gui, client, validation, sync, fabric, forge, neoforge, quilt]
summary: 自动 GUI、强校验、服务端-客户端同步的配置库（3420 万下载，2024-04 发布增速极快；F/Forge/Neo/Quilt，1.20.1-26.2）。新项目配置库评估选项之一。
mcHint: 1.20.1-26.2
minecraftVersions: "1.20.1-26.2"
sourceKind: authored
modIds: [fzzy-config]
loaders: [fabric, forge, neoforge, quilt]
modrinthSlug: fzzy-config
role: api
skillId: mc-config
---

# Fzzy Config 配置库集成要点

自写短文。版本与 API 细节以 [Fzzy Config](https://github.com/fzzyhmstrs/fzzy_config) 当前 README 与示例为准。

## 何时用 / 何时不用

用：新项目需要自动生成 GUI、带强校验、且要服务端-客户端配置同步的配置方案（1.20.1-26.2，F/Forge/Neo/Quilt）。2024-04 发布，Modrinth 3420 万下载，增速极快，是新配置库三强之一（与 YACL、owo-config 并列评估）。

不用：版本窗口外（低于 1.20.1）无构建，回退 Cloth / YACL；仅需纯服务端配置时 Forge/Neo 的 `ForgeConfigSpec` 更轻；已选定 YACL 且不需要同步/校验能力时不必换。

## Decision Flow

```
Decision: 要不要用 Fzzy Config
→ 单平台 Forge/Neo 且仅服务端配置 → ForgeConfigSpec（patterns config-spec）
→ MC 版本低于 1.20.1 → YACL（1.19+）/ Cloth（1.14+）
→ 需要自动 GUI + 校验 + 配置同步 → Fzzy Config 优先
→ 只想要 Builder 式手工界面 → YACL
→ 已选 Fzzy Config：
   ├─ 版本：在 1.20.1-26.2 内与 MC 对齐（Modrinth 文件页）
   ├─ 加载器：F/Forge/Neo/Quilt 按目标端选 artifact
   └─ 同步：明确哪些字段要同步到客户端，服务端为权威
```

## Gradle / 声明文件检查顺序

1. `build.gradle`：官方 README 的仓库与坐标（不同加载器 artifact 不同），`compileOnly` + 开发时 `runtimeOnly`
2. `mods.toml`（26.x 为 `neoforge.mods.toml`）：`depends` 写 fzzy-config；软依赖则用 `ModList.get().isLoaded(...)` 门闩（见 `authored/soft-deps-modlist`）
3. `fabric.mod.json`：`depends` / `suggests`；modId 以官方 jar 的 `fabric.mod.json` 为准
4. 版本核对：库迭代快，接口变动可能大，锁定版本号而非浮动依赖

## 集成要点（伪代码级）

```java
// 类名/注解以官方为准：Fzzy Config 提供注解驱动的配置定义
// 典型流程：定义配置对象（注解标注字段与范围）→ 初始化/注册 → 库自动生成 Screen 与校验
// 同步：标记需同步的字段，服务端改配置后下发到客户端
// 打开界面：客户端门闩内把库生成的 Screen 交给 setScreen(...)
```

- 配置持有：库管理序列化与 GUI，你的代码只读写配置对象
- 校验规则（范围/枚举）在定义处声明，别在业务代码里重复校验

## 常见坑

- 库迭代快：抄旧版本教程的 API 写法，新版本可能已改（以当前 README 为准）
- 同步字段设错方向 → 客户端值被覆盖或不同步（服务端为权威）
- 期待支持 1.19 及以下 → 版本窗口外，换 YACL / Cloth
- 只 `compileOnly` 却当硬依赖用 → 未装时 `NoClassDefFoundError`

## 自检清单

- 未装库时（若软依赖）：模组正常进档，不加载 Fzzy 类
- 配置屏自动生成且能打开，非法输入被校验拦截
- 服务端改配置后客户端（重进或即时）同步生效
- `runServer` 不加载客户端 GUI 类

## 交叉引用

- MCP：`generate_config`、`check_dependencies`、`search_community_docs`
- Skill：`mc-config`；相关：`mc-gui`
- 全览：§二.1 配置库、§五 陷阱 7；`authored/library-catalog-2026`、`authored/lib-cloth-config`、`authored/lib-yacl`、`authored/library-integration`
- 官方：https://github.com/fzzyhmstrs/fzzy_config
- 不清楚时：打开 Fzzy Config README + 示例，或 `search_fabric_docs` / `search_forge_docs`；AGENT_USAGE.md 规则先行

## 核对（2026-08 反编译验证）

- 已对以下版本反编译核对（VineFlower + catalog verifiedApi）：
  - 1.20.1/fabric：顶层 API 包 `me.fzzyhmstrs`，入口 无 entrypoint
  - 26.2/fabric：顶层 API 包 `me.fzzyhmstrs`，入口 无 entrypoint
- 版本/包名详情见 `mcp-server/src/diagnostics/library-catalog.ts` 对应条目；细节仍以官方文档为准。
