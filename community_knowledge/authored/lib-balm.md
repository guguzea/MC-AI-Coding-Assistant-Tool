---
id: authored/lib-balm
title: Balm 跨平台抽象层集成要点
tags: [balm, cross-platform, abstraction, waystones, comforts, forge, fabric, neoforge]
summary: Blay 的跨加载器抽象层（5420 万下载，F/Forge/Neo 1.18-26.2，零第三方依赖）。Waystones/Comforts 等 Blay 20+ 模组共用；注册/事件/网络/配置/按键等抽象，跟随 Blay 生态的一码多端方案。
mcHint: 1.18-26.2
minecraftVersions: "1.18-26.2"
sourceKind: authored
modIds: [balm]
loaders: [fabric, forge, neoforge]
modrinthSlug: balm
role: api
skillId: mc-balm
---

# Balm 跨平台抽象层集成要点

自写短文。Balm 的模块划分、类名与版本细节以 [Balm 官方仓库](https://github.com/BlayTheNinth/Balm) 当前 README 与示例 mod 为准。

## 何时用 / 何时不用

用：想一码多端（Fabric + Forge + NeoForge）且愿意跟随 Blay 体系。Balm 把注册、事件、网络、配置、按键绑定、模型加载等平台差异收进统一 API，**零第三方依赖**（全览报告 §二.3）。Waystones、Comforts 等 Blay 的 20+ 模组全部共用它，作者长期维护，1.18-26.2 持续出构建。

不用：

- 需要 Quilt 支持：全览报告 loader 列为 F/Forge/Neo，不含 Quilt
- 已有 Architectury 体系（`lib-architectury`）：Balm 与 Architectury 定位重叠，别双引两套抽象层
- 只要个别平台能力（如单独的网络抽象）且版本超窗：单平台直接写平台原生 API 更稳

## Decision Flow

```
Decision: 要不要用 Balm
→ 需要 Quilt → 不用 Balm（Architectury 或自研）
→ 目标 = F/Forge/Neo 一码多端，且跟 Blay 生态（Waystones 等）→ Balm
→ 目标 = 一码多端但已有 Architectury 依赖 → 保持 Architectury，别混用
→ 已选 Balm：
   ├─ 版本：1.18-26.2 内与 MC 对齐（Modrinth/CurseForge 文件页）
   ├─ 平台差异：一律走 Balm 抽象 API，禁止在公共代码里直接调平台类
   └─ 依赖：硬依赖 or 软依赖门闩（见下）
```

## Gradle / 声明文件检查顺序

1. `build.gradle`：官方 README 的仓库与坐标照抄；Fabric 用 Loom 的 `modImplementation`，Forge/Neo 用对应依赖配置，版本以文件页为准
2. `mods.toml`（26.x 为 `neoforge.mods.toml`）：`depends` 写 balm；软依赖则 `ModList.get().isLoaded("balm")` 门闩（见 `authored/soft-deps-modlist`）
3. `fabric.mod.json`：`depends` 或 `suggests` 写 balm
4. 版本核对：Balm 的 API 随 MC 版本演进，1.18 与 26.2 差异大，抄坐标前先看该版本 README 分支

## 集成要点（伪代码级）

```java
// 类名/包名以官方 README 为准，下面只是流程
// 注册：用 Balm 提供的注册入口（类似 DeferredRegister 语义）登记方块/物品/实体
// 事件：监听 Balm 抽象事件，不直接挂平台事件总线
// 网络：用 Balm 网络 API 定义包与处理器，公共代码只写一次
// 配置：用 Balm 配置 API，不手写平台配置（ForgeConfigSpec 等）
// 按键：客户端按键绑定走 Balm 的按键 API，服务端不引用
```

- 客户端专用逻辑（按键、模型加载）仍要守 `Dist.CLIENT` 门闩，Balm 只是帮你包一层
- 公共代码里出现平台类 import（如 `net.minecraftforge...` / `net.fabricmc...`）就是抽象层漏了，自查

## 常见坑

- 公共代码直接 import 平台类 → 换端编译即炸
- 只 `compileOnly` 引 Balm 却当硬依赖用 → 未装 Balm 时 `NoClassDefFoundError`
- 版本与 MC 不匹配（用 1.20.1 的 Balm 配 26.x）→ 启动即崩或 API 缺失
- 与 Architectury 混用两套抽象 → 事件/网络双份注册，行为不可预测

## 自检清单

- 未装 Balm（若软依赖）：模组正常进档，不加载 Balm 类
- 仅装 Balm：注册内容（方块/物品）正常出现，服务端无异常
- 三端（Fabric/Forge/Neo）同一份公共代码都能编译运行
- 配置改动保存后重进保留，网络包双端都能收发

## 交叉引用

- MCP：`check_dependencies`、`analyze_mod_jar`、`search_community_docs`
- Skill：`mc-balm`；相关：`mc-registry`、`mc-networking`、`mc-config`、`mc-events`
- 全览：§二.3 跨加载器抽象层、§四 一码多端路线；`authored/library-catalog-2026`、`authored/lib-architectury`、`authored/soft-deps-modlist`
- 官方：https://github.com/BlayTheNinth/Balm
- 不清楚时：打开 Balm README + 示例 mod（Waystones 源码是现成范例）；AGENT_USAGE.md 规则先行

## 核对（2026-08 反编译验证）

- 已对以下版本反编译核对（VineFlower + catalog verifiedApi）：
  - 26.2/fabric：顶层 API 包 `net.blay09.mods`，入口 `net.blay09.mods.balm.fabric.client.internal.FabricBalmClient`；`net.blay09.mods.balm.fabric.internal.FabricBalm`；`net.blay09.mods.balm.fabric.platform.compatibility.modmenu.internal.ModMenuIntegration`；`net.blay09.mods.balm.platform.compatibility.hudinfo.internal.JadeModIntegration`；`net.blay09.mods.balm.platform.compatibility.recipeviewer.internal.jei.CommonJeiPlugin`
  - 1.18/fabric：顶层 API 包 `net.blay09.mods`，入口 `net.blay09.mods.balm.fabric.FabricBalm`；`net.blay09.mods.balm.fabric.client.FabricBalmClient`
- 版本/包名详情见 `mcp-server/src/diagnostics/library-catalog.ts` 对应条目；细节仍以官方文档为准。
