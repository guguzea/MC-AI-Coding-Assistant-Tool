---
id: authored/lib-trinkets
title: Trinkets 饰品槽集成要点
tags: [trinkets, trinkets-polymer, accessory, slot, fabric, quilt, datadriven, stopped]
summary: Fabric/Quilt 系饰品槽标准（Modrinth API 实测 2344 万下载，上游 F/Quilt 1.17-1.21.1，6 组槽位，数据驱动）。⚠️ 上游分发止于 1.21.1（末次发布 2024-07-15）；1.21.4+ 走分叉 trinkets-polymer（实测 1.19-26.2，全为 beta/rc）或自研。Forge 用户读 lib-curios。
mcHint: 1.17-1.21.1（上游 Modrinth）；分叉 trinkets-polymer 1.19-26.2
minecraftVersions: "1.17-1.21.1"
sourceKind: authored
modIds: [trinkets]
loaders: [fabric, quilt]
modrinthSlug: trinkets
role: api
skillId: mc-trinkets
---

# Trinkets 饰品槽集成要点

自写短文。Trinkets 的 API 与槽位格式以 [官方仓库](https://github.com/emilyploszaj/trinkets) 当前 README 与 wiki 为准。

## 何时用 / 何时不用

用：Fabric / Quilt 模组（1.17-1.21.1）需要饰品栏。Trinkets 是 Fabric 系饰品槽事实标准，**6 组槽位**（头/胸/腿/脚/手/副手类），槽位**数据驱动**（通过数据文件定义槽组与允许的槽位），支持扩展槽组与槽位限制。Artifacts 等大量模组在用。

不用（重要）：

- **⚠️ 上游分发止于 1.21.1。** Modrinth API 实测（2026-09-02）：`trinkets` 共 22 条构建，末次发布 2024-07-15，game_versions 上界 1.21.1，**1.21.4+ / 26.x 构建 0 条**（与全览报告 §五 陷阱 3 一致，但那条是二手转述）。**1.21.4+ / 26.x 不要选上游**
- **1.21.4+ / 26.x 要 Trinkets 接口 → 只有分叉 `trinkets-polymer`**（Modrinth 项目名「Polymer Patch for Trinkets Updated」，实测 19 条构建覆盖 1.19-26.2，末次 2026-08-18；**全部是 beta/rc，无正式版**）。它给 Polymer 服务端方案打补丁：1.x 段沿用上游号段并加 `+polymerport.N` 后缀（实测一直排到 `3.11.0-beta.1+polymerport.4` / 1.21.11），到 26.x 另起 4.x-rc 线。这不是 EmilyPloszaj 上游的延续，用它就要跟随分叉节奏，接口差异自己核对
- **Forge / NeoForge 用户 → 读 `lib-curios`**（Curios 才是 Forge 系标准），禁止把 Trinkets 代码拷到 Forge 工程
- 只要 1-2 个固定槽 → 自研可能更轻（1.21.4+ 新模组多走这条路：组件/NBT 自研或原版机制）

## Decision Flow

```
Decision: 饰品槽方案选择
→ 平台 = Forge / NeoForge → lib-curios（Curios），不要用 Trinkets
→ 平台 = Fabric / Quilt：
   ├─ 目标版本 1.17-1.21.1 → 可用上游 Trinkets（上游已停更，存量可维护）
   ├─ 目标版本 1.21.4+ / 26.x → 上游无构建：
   │    ├─ 要现成饰品栏 API → 分叉 trinkets-polymer（仅 beta/rc，自担跟版风险）
   │    └─ 需求简单 → 自研槽位（组件/NBT）或原版机制
   └─ 已选 Trinkets：
        ├─ 槽位：数据驱动定义（槽组 JSON，6 组默认），以官方格式为准
        ├─ 物品：实现/注册为饰品，别手写渲染
        └─ 依赖：硬依赖 or 软依赖门闩（见下）
```

## 分发窗口（Modrinth API 实测 2026-09-02）

来源级别标注：**实测** = 当日直连 `api.modrinth.com/v2` 翻页取全部构建后统计；**项目级标签** = Modrinth 项目元数据里的 `loaders`/`categories`，可能陈旧；**二手** = 全览报告转述。

| 断言 | 数值 | 来源级别 |
| --- | --- | --- |
| 上游分发区间 | 1.17-rc2 → 1.21.1，22 条构建，末次 2024-07-15 | 实测 |
| 上游 1.21.4+ / 26.x 构建 | 0 条 | 实测（与全览报告 §五 陷阱 3 的二手结论一致） |
| 上游下载量 | 23,439,779 | 实测（项目级 `downloads`，会随时间涨） |
| 分叉 trinkets-polymer 区间 | 1.19 → 26.2，19 条，末次 2026-08-18；26.1.2 最新 `4.0.0-rc.1.0+26.1`，26.2 最新 `4.1.0-rc.1.0+26.2` | 实测 |
| 分叉稳定版 | 0 条（beta/rc/snapshot 全非稳定） | 实测 |
| 分叉是否沿用 modId `trinkets` | **未核实** —— 装之前打开其 `fabric.mod.json` 看 `id` | 无（待核） |

> 注：仓库里早前的审查/计划记录对分叉最新条有两种写法（`4.0.0-beta.1.0+26.1` 与 `4.0.0-rc.1.0+26.1`）。两条都真实存在（beta 2026-05-22、rc 2026-08-18），上表取实测的最新条；引用时以本表日期为准。

## Gradle / 声明文件检查顺序

1. `build.gradle`：官方 README 的 maven（`https://maven.ladysnake.org/releases` 等，以 README 为准）与坐标照抄，Loom `modImplementation`
2. `fabric.mod.json`：`depends` 写 trinkets；软依赖则 `FabricLoader.getInstance().isModLoaded("trinkets")` 门闩（见 `authored/soft-deps-modlist`）
3. 版本核对：**先确认你的 MC 版本 ≤ 1.21.1 且有对应上游构建**；1.21.4+ 走上表的分叉 trinkets-polymer 或自研，别再声明上游
4. 若同时用 CCA（Cardinal Components）：Trinkets 依赖 CCA，版本搭配以官方为准

## 集成要点（伪代码级）

```java
// 类名/包名以官方 README 为准，下面只是流程
// 槽位：在数据目录定义/扩展槽组（6 组默认槽位），或往已有槽组加槽位限制
// 物品：把物品注册为饰品（实现其接口或走注册 API），并声明可放入的槽组
// 生效：饰品属性/效果在服务端计算，渲染与提示在客户端
```

- 槽位是数据驱动的：改槽位定义走数据文件，不写死代码
- 饰品效果（如加属性）走服务端逻辑，客户端只做渲染与 Tooltip
- 停止窗口内仍可维护存量项目，但别给 1.21.4+ 的新项目选上游

## 常见坑

- **给 1.21.4+ / 26.x 项目声明上游 trinkets 依赖** → 没有对应构建，解析或启动即炸，这是停止窗口后最常见的坑
- **把分叉 trinkets-polymer 当「官方复活」** → 它 26.x 只有 beta/rc（实测 0 条稳定版），把它当稳定依赖钉进生产包要自担断更风险
- 把 Trinkets 代码拷到 Forge 工程 → 编译即炸，Forge 用 Curios
- 只 `compileOnly` 却硬依赖 → 未装 Trinkets 时 `NoClassDefFoundError`
- 自定义槽组 ID 与其它模组冲突 → 槽位错乱，命名前查 tag/槽位约定
- 饰品效果写在客户端 → 专用服不生效

## 自检清单

- 项目版本 ≤ 1.21.1，且依赖版本与文件页一致
- 未装 Trinkets（若软依赖）：模组正常进档
- 装了 Trinkets：饰品能放入对应槽组、取出、重启不丢
- 饰品属性在服务端正确生效（攻击/防御等），槽位无重复 ID 警告

## 交叉引用

- MCP：`check_dependencies`、`search_community_docs`
- Skill：`mc-trinkets`；相关：`mc-item`、`mc-capability`
- 全览：§二.4 饰品/装备槽、§四 Fabric 路线、§五 陷阱 3（停更）；`authored/library-catalog-2026`、`authored/lib-curios`、`authored/soft-deps-modlist`
- 官方：https://github.com/emilyploszaj/trinkets
- 不清楚时：打开官方 README / wiki 与示例 mod；Forge 侧问题读 Curios 官方仓库；AGENT_USAGE.md 规则先行

## 核对（2026-08 反编译验证）

- 已对以下版本反编译核对（VineFlower + catalog verifiedApi）：
  - 1.17.1/fabric：顶层 API 包 `dev.emi.trinkets`，入口 dev.emi.trinkets.TrinketsClient
- 版本/包名详情见 `mcp-server/src/diagnostics/library-catalog.ts` 对应条目；细节仍以官方文档为准。
