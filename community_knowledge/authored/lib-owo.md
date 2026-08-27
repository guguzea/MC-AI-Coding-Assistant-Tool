---
id: authored/lib-owo
title: owo-config 配置集成要点（owo-lib）
tags: [owo-lib, owo-config, owo-ui, config, gui, client, network, fabric, neoforge, quilt]
summary: owo-lib 内的注解式配置（owo-config）+ 自动 GUI + 配置同步（owo-lib 4380 万下载；F/Neo/Quilt，1.17-26.1.2）。⚠️ 不支持 Forge，纯 Forge 项目不可用。
mcHint: 1.17-26.1.2
minecraftVersions: "1.17-26.1.2"
sourceKind: authored
modIds: [owo-lib]
loaders: [fabric, neoforge, quilt]
modrinthSlug: owo-lib
role: api
skillId: mc-owo
---

# owo-config 配置集成要点（owo-lib）

自写短文。版本与 API 细节以 [owo 文档站](https://docs.wispforest.io/) 为准。

## 何时用 / 何时不用

用：Fabric / NeoForge / Quilt 项目（1.17-26.1.2），想要注解式配置 + 自动 GUI + 配置同步一体方案。owo-config 是 owo-lib（Modrinth 4380 万下载）的组件之一，同库还提供 owo-ui 声明式 GUI 与网络层，配置和界面风格统一。

不用：**纯 Forge 项目不可用**（owo-lib 只支持 Fabric / NeoForge / Quilt，全览 §五 陷阱 2 明确标注）。Forge 用户请用 Cloth / YACL / ForgeConfigSpec；Neo ≥1.20.4 服务端配置用 ModConfigSpec。也不用于：只想要 Builder 式手工配置界面（选 YACL）、版本窗口外（低于 1.17 / 高于 26.1.2）。

## Decision Flow

```
Decision: 要不要用 owo-config
→ Forge 用户 → 停止，用 Cloth / YACL / ForgeConfigSpec（owo 无 Forge 构建）
→ NeoForge 仅服务端配置且不用 owo → ModConfigSpec（≥1.20.4）
→ 版本不在 1.17-26.1.2 → YACL（1.19+）/ Cloth（1.14+）
→ F/Neo/Quilt 且想要注解式 + 自动 GUI + 同步 → owo-config
→ 只想要手工 Builder 界面 → YACL / Cloth
→ 已选 owo-config：
   ├─ 加载器：仅 fabric / neoforge / quilt，按目标端选 artifact
   ├─ 依赖形态：owo-lib 整体引入，或用其拆分构件（以文档为准）
   └─ 同步：服务端为权威，客户端只读下发值
```

## Gradle / 声明文件检查顺序

1. `build.gradle`：以 [docs.wispforest.io](https://docs.wispforest.io/) 的添加依赖章节为准（仓库与坐标在文档里），`compileOnly` + 开发 `runtimeOnly`
2. 确认项目不是纯 Forge：构建脚本里没有 Forge-only artifact 混用（owo 无 Forge 构建）
3. `mods.toml`（NeoForge）：`depends` 写 owo-lib；软依赖用 `ModList.get().isLoaded("owo-lib")` 门闩（见 `authored/soft-deps-modlist`）
4. `fabric.mod.json` / `quilt.mod.json`：`depends` / `suggests` 写 owo-lib
5. 版本核对：26.1.2 上界以官方发布为准，坐标以文件页为准

## 集成要点（伪代码级）

```java
// 注解/类名以官方文档为准：owo-config 用注解标注配置字段（键、范围、默认值）
// 典型流程：定义注解式配置接口 → 初始化 → 库自动生成配置 Screen
// 打开界面：客户端门闩内把库生成的 Screen 交给 setScreen(...)
// 同步：标记字段由服务端权威下发，客户端触发同步请求
// 同库 owo-ui 可做声明式界面；网络层可共用，按文档接入
```

- 配置持有：库管理序列化，业务代码只读配置对象
- owo 家族组件互相独立可用，按需引入

## 常见坑

- **纯 Forge 项目直接引入 → 构建/运行失败**（无 Forge artifact，先确认加载器）
- 抄 Fabric 教程到 NeoForge 但 artifact 混用 → 依赖解析失败
- 同步方向搞反 → 客户端改动被服务端覆盖或静默失效
- 期待 26.1.2 以上新版本 → 以官方发布为准，勿假定滚动跟进

## 自检清单

- 无 owo-lib 时（若软依赖）：模组正常进档，不加载 owo 类
- 配置屏能打开，注解默认值与保存行为符合预期
- 服务端改配置后客户端同步生效
- `runServer` 不加载客户端 GUI 类

## 交叉引用

- MCP：`generate_config`、`check_dependencies`、`search_community_docs`
- Skill：`mc-owo`；相关：`mc-config`、`mc-gui`
- 全览：§二.1 配置库、§二.6 GUI/UI（owo-lib）、§四 Fabric 路线、§五 陷阱 2（**owo-lib 不支持 Forge**）；`authored/library-catalog-2026`、`authored/lib-cloth-config`、`authored/lib-yacl`、`authored/lib-traps-2026`、`authored/library-integration`
- 官方：https://docs.wispforest.io/
- 不清楚时：打开 owo 文档站对应章节，或 `search_fabric_docs` / `search_neoforge_docs`；AGENT_USAGE.md 规则先行

## 核对（2026-08 反编译验证）

- 已对以下版本反编译核对（VineFlower + catalog verifiedApi）：
  - 26.1/fabric：顶层 API 包 `io.wispforest.owo`，入口 `io.wispforest.owo.Owo`；`io.wispforest.owo.client.OwoClient`；`io.wispforest.owo.compat.emi.OwoEmiPlugin`；`io.wispforest.owo.compat.modmenu.OwoModMenuPlugin`；`io.wispforest.owo.compat.rei.OwoReiPlugin`
  - 1.17/fabric：顶层 API 包 `com.glisco.owo`，入口 `com.glisco.owo.Owo`；`com.glisco.owo.client.OwoClient`；`com.glisco.owo.compat.rei.OwoReiPlugin`
- 版本/包名详情见 `mcp-server/src/diagnostics/library-catalog.ts` 对应条目；细节仍以官方文档为准。
