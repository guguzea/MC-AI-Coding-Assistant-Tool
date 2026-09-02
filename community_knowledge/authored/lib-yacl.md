---
id: authored/lib-yacl
title: YACL 配置库集成要点
tags: [yacl, yet-another-config-lib, config, gui, client, modmenu, fabric, forge, neoforge, quilt]
summary: 新一代配置库（Modrinth API 实测 1.18 亿下载；F/Forge/Neo/Quilt，1.19-26.2 有稳定版，26.3 仅 snapshot）。Builder 式 API、GUI 契合原版风格，因 Cloth Config 功能冻结而生，新项目配置库首选之一。
mcHint: 1.19-26.2 稳定；26.3 仅 snapshot 构建
minecraftVersions: "1.19-26.2"
sourceKind: authored
modIds: [yacl]
loaders: [fabric, forge, neoforge, quilt]
modrinthSlug: yacl
role: api
skillId: mc-yacl
---

# YACL 配置库集成要点

自写短文。版本与 API 细节以 [YACL](https://github.com/isXander/YetAnotherConfigLib) 当前 README 与示例 mod 为准。

## 何时用 / 何时不用

用：新项目需要友好配置屏，且目标为 Fabric / Forge / NeoForge / Quilt。Builder 式 API 生成界面，风格贴近原版。Modrinth API 实测（2026-09-02）：**1.19 → 26.3-snapshot-1 共 294 条构建，其中稳定版上界 26.2**（26.3 只有 snapshot 构建，无正式版）；下载量 1.18 亿。Cloth Config 进入功能冻结后（注意：是功能冻结，不是停更，见 `lib-cloth-config`），YACL 是新配置库的主流替代之一。

不用：仅需服务端配置时，Forge 用 `ForgeConfigSpec`、Neo ≥1.20.4（含 26.x）用 `ModConfigSpec`（patterns `config-spec`）就够；旧项目已用 Cloth 且无新特性需求，不必迁移；目标版本低于 1.19 时 YACL 无对应构建，回退 Cloth。

## Decision Flow

```
Decision: 要不要用 YACL
→ 单平台 Forge 且仅服务端配置 → ForgeConfigSpec（patterns config-spec）
→ 单平台 NeoForge（≥1.20.4，含 26.x）且仅服务端配置 → ModConfigSpec
→ MC 版本在 1.19-26.2 内 → 有稳定版；26.3 只有 snapshot 构建（无正式版），生产包别钉
→ 低于 1.19 → 回退 Cloth（实测 1.14-26.2）
→ 新项目 / 长期维护 → YACL 优先，其次评估 Fzzy Config（自动 GUI/校验/同步）
→ 已选 YACL：
   ├─ 版本：与目标 MC 对齐，取该版本线的稳定版（26.x 稳定版只到 26.2，Modrinth 文件页）
   ├─ 加载器：F/Forge/Neo/Quilt 四端都有构建，按目标端选 artifact
   └─ 入口：Fabric 用 Mod Menu 软依赖挂按钮；Forge/Neo 自建按钮
```

## 分发窗口（Modrinth API 实测 2026-09-02）

来源级别标注：**实测** = 当日直连 `api.modrinth.com/v2` 翻页取全部构建后统计；**项目级标签** = Modrinth 项目元数据里的 `loaders`/`categories`，可能陈旧；**二手** = 全览报告转述。「稳定版」判定：构建的 `name` + `game_versions` + `version_type` 均不含 `snapshot|alpha|beta|rc|pre|dev`。

| 断言 | 数值 | 来源级别 |
| --- | --- | --- |
| 分发区间 | 1.19 → 26.3-snapshot-1（game_versions 上界含 snapshot 名） | 实测 |
| 稳定版上界 | 26.2（294 条中 198 条为稳定版） | 实测 |
| 26.1 版本线 | 14 条构建 / 13 条稳定，game_versions 含 26.1、26.1.1、26.1.2 | 实测 |
| 26.2 版本线 | 8 条 / 2 条稳定（`3.9.5 for fabric/neoforge 26.2`） | 实测 |
| 26.3 版本线 | 2 条 / **0 条稳定**，game_versions 只有 `26.3-snapshot-1/4/5/6/7` | 实测 |
| 逐端构建数 | fabric 174、neoforge 94、quilt 63、forge 33 | 实测（按构建 `loaders` 累加） |
| 下载量 / 末次发布 | 118,278,361 / 2026-07-19 | 实测（项目级 `downloads` 会随时间涨） |

## Gradle / 声明文件检查顺序

1. `build.gradle`：以官方 README 的仓库与坐标为准（不同加载器 artifact 不同），`compileOnly` + 开发时 `runtimeOnly`
2. `mods.toml`（26.x 为 `neoforge.mods.toml`）：硬依赖写 `depends`；软依赖用 `ModList.get().isLoaded("yacl")` 门闩（见 `authored/soft-deps-modlist`）
3. `fabric.mod.json`：`depends` / `suggests` 写 yacl；Mod Menu 入口单独软依赖（modId 为 `modmenu`）
4. 版本核对：上表为 2026-09-02 实测；26.3 只有 snapshot 构建，选版本线时以该线**最新稳定版**为准（26.x 目前到 26.2），坐标照文件页抄

## 集成要点（伪代码级）

```java
// 客户端专用：GUI 构建只在客户端触发（Forge/Neo：`Dist.CLIENT`；Fabric/Quilt：client 源集 + `@Environment(EnvType.CLIENT)`），公共代码留门闩
// 类名以官方为准：YetAnotherConfigLib（YACL）包内 Builder 风格入口
// 典型流程：buildScreen(holder) → 分组/条目 → 保存回调写回你的配置持有类 → 返回 Screen
// Screen 塞给 Minecraft 的 setScreen(...) 或 Mod Menu 配置入口回调
// 配置持有：自己管理 POJO + 序列化，YACL 只做界面桥
```

- Screen 相关类放 `client` 侧；公共代码只留「打开配置屏」的客户端门闩
- 校验逻辑放保存回调里，别塞进条目构造

## 常见坑

- Screen 类被公共/服务端代码引用 → 专用服崩溃（Forge/Neo：`Dist.CLIENT` 门闩；Fabric/Quilt：client 源集 + `@Environment(EnvType.CLIENT)`）
- 只 `compileOnly` 却当硬依赖用，未装 YACL 时 `NoClassDefFoundError`
- 期待 YACL 支持 1.19 以下版本 → 实测下界 1.19，窗口外无构建，换 Cloth
- 给 26.3 工程钉「YACL 稳定版」 → 实测 26.3 只有 snapshot 构建（0 条正式版），要么按 snapshot 跟版，要么留在 26.2
- 手写配置路径与库冲突，或双份配置（ForgeConfigSpec + YACL 各一份）

## 自检清单

- 未装 YACL 时（若软依赖）：模组正常进档，不加载 YACL 类
- 仅装 YACL：客户端配置屏能打开，改动保存后重进保留
- `runServer` 日志无 YACL 相关类加载
- Mod Menu 列表里能看到你的配置入口（若接了）

## 交叉引用

- MCP：`generate_config`、`check_dependencies`、`search_community_docs`
- Skill：`mc-yacl`；相关：`mc-config`、`mc-gui`
- 全览：§二.1 配置库、§五 陷阱 7（Cloth 冷冻，新模组转向 YACL / owo-config / Fzzy）；`authored/library-catalog-2026`、`authored/lib-cloth-config`、`authored/lib-fzzy-config`、`authored/library-integration`
- 官方：https://github.com/isXander/YetAnotherConfigLib ；Cloth：https://github.com/shedaniel/cloth-config
- 不清楚时：打开 YACL README + 示例 mod，或 `search_fabric_docs` / `search_forge_docs`；AGENT_USAGE.md 规则先行

## 核对（2026-08 反编译验证）

- 已对以下版本反编译核对（VineFlower + catalog verifiedApi）：
  - 1.19.3/fabric：顶层 API 包 `dev.isxander.yacl`，无 entrypoint
- 版本/包名详情见 `mcp-server/src/diagnostics/library-catalog.ts` 对应条目；细节仍以官方文档为准。
