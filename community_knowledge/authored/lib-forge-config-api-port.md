---
id: authored/lib-forge-config-api-port
title: Forge Config API Port 集成要点
tags: [forgeconfigapiport, config, fabric, fuzs, puzzles-lib, migration]
summary: 把 Forge 配置系统（ForgeConfigSpec 等）搬到 Fabric 的移植库，Fabric 为主。常见于从 Forge 移植到 Fabric 的模组与 Puzzles Lib 的 Fabric 依赖链。
mcHint: 以官方为准（全览未列版本窗口）
minecraftVersions: ""
sourceKind: authored
modIds: [forgeconfigapiport]
loaders: [fabric]
modrinthSlug: forge-config-api-port
role: api
skillId: mc-config
---

# Forge Config API Port 集成要点

自写短文。下载量与版本窗口未列入全览报告（表中数据为 —），一切以 [Forge Config API Port](https://github.com/Fuzss/forgeconfigapiport) 当前 README 与文件页为准，禁止臆造。

## 何时用 / 何时不用

用：Fabric 项目需要按 Forge 习惯写配置（如 `ForgeConfigSpec` 风格），常见于从 Forge 移植到 Fabric 的模组；Fuzs 系模组（如 Bag of Holding 等，依赖 Puzzles Lib）在 Fabric 端经由此库满足配置依赖。

不用：全新 Fabric 项目没有 Forge 背景时，直接用原生配置方案或 YACL / Fzzy / Cloth 更简单，不必引入 Forge 语义；纯 Forge/Neo 项目本来就有 ForgeConfigSpec，不需要此库。

## Decision Flow

```
Decision: 要不要用 Forge Config API Port
→ 纯 Forge / NeoForge 项目 → 不需要，用原生 ForgeConfigSpec
→ Fabric 新项目无 Forge 移植背景 → 用 YACL / Fzzy / Cloth 更直接
→ Fabric 项目要跑 Forge 风格配置（或移植自 Forge）→ Forge Config API Port
→ Fabric 端依赖 Puzzles Lib 系模组 → 该库会作为其 Fabric 依赖链出现，无需主动引
→ 已选：版本与坐标以官方 README / Modrinth 文件页为准；Fabric 为主
```

## Gradle / 声明文件检查顺序

1. `build.gradle`：官方 README 的仓库与坐标（Loom 环境），`compileOnly` + 开发 `runtimeOnly`；版本以文件页为准
2. `fabric.mod.json`：`depends` / `suggests` 写 `forgeconfigapiport`（modId 以官方 jar 的 `fabric.mod.json` 为准）
3. 若项目依赖 Puzzles Lib 的 Fabric 版：确认其依赖声明里已包含本库，避免重复引入冲突版本
4. 版本核对：目标 MC 版本是否有对应构建，以官方文件页为准

## 集成要点（伪代码级）

```java
// 类名/API 以官方为准：目标是把 Forge 风格配置（ForgeConfigSpec 及其 Builder）在 Fabric 上原样可用
// 典型流程：按 Forge 习惯定义 ConfigSpec → 通过本库入口加载/保存 → 代码里照常用 spec 取值
// 客户端配置屏：仍要自行接 Mod Menu 或自建按钮（本库负责配置语义，不负责 GUI 生态）
```

- 迁移场景：`analyze_porting_path` / `get_migration_guide` 可辅助识别项目是否属于 Forge→Fabric 移植
- 服务端配置修改需同步时，按 Fabric 常规网络方案处理

## 常见坑

- 臆造版本号/坐标：本库未列入全览数据表，任何版本信息必须来自官方 README / 文件页
- 与 Puzzles Lib Fabric 版重复声明本库 → 版本冲突（检查 `check_dependencies` 输出）
- 期待 Forge 侧语义完全一致 → 行为差异以官方 README 说明为准
- 只 `compileOnly` 却当硬依赖用 → 未装时 `NoClassDefFoundError`

## 自检清单

- 未装本库时（若软依赖）：模组正常进档，不加载其类
- 配置按 Forge 风格读写成功，文件落盘位置符合预期
- `runServer` / 客户端两侧都能读同一份配置（同步场景）
- `check_dependencies` 无版本冲突提示

## 交叉引用

- MCP：`generate_config`、`check_dependencies`、`analyze_porting_path`、`get_migration_guide`、`search_community_docs`
- Skill：`mc-config`
- 全览：§二.1 配置库、§三（Puzzles Lib 全家桶）；`authored/library-catalog-2026`、`authored/lib-cloth-config`、`authored/library-integration`、`authored/soft-deps-modlist`
- 官方：https://github.com/Fuzss/forgeconfigapiport
- 不清楚时：打开官方 README + Modrinth 文件页，AGENT_USAGE.md 规则先行（下载量/版本数据未入库，禁止编造）

## 核对（2026-08 反编译验证）

- 已对以下版本反编译核对（VineFlower + catalog verifiedApi）：
  - 1.20.1/fabric：顶层 API 包 `com.electronwill.nightconfig`、`fuzs.forgeconfigapiport`、`net.minecraftforge.common`，入口 `fuzs.forgeconfigapiport.impl.ForgeConfigAPIPortFabric`；`fuzs.forgeconfigapiport.impl.client.ForgeConfigAPIPortFabricClient`
  - 26.2/fabric：顶层 API 包 `fuzs.forgeconfigapiport`、`net.minecraftforge.common`，入口 `fuzs.forgeconfigapiport.fabric.impl.ForgeConfigAPIPortFabric`；`fuzs.forgeconfigapiport.fabric.impl.client.ForgeConfigAPIPortFabricClient`；`fuzs.forgeconfigapiport.fabric.impl.integration.modmenu.ModMenuApiImpl`
  - 1.16/fabric：顶层 API 包 `net.minecraftforge.api`，入口 `net.minecraftforge.ForgeConfigAPIPort`；`net.minecraftforge.client.ForgeConfigAPIPortClient`
- 版本/包名详情见 `mcp-server/src/diagnostics/library-catalog.ts` 对应条目；细节仍以官方文档为准。
