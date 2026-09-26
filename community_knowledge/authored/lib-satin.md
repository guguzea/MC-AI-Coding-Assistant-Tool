---
id: authored/lib-satin
title: Satin 后期处理着色器库集成要点
tags: [satin, shader, post-processing, renderer, client, fabric, quilt, ladysnake]
summary: Fabric/Quilt 后期处理着色器包装库（170 万下载；1.18-1.21.4），把原版后期处理管线封装成易用 API。加载器只有 Fabric 与 Quilt（Quilt 复用同一条 Fabric 构件，release 止 1.21.1），Forge/Neo 无构建。
mcHint: 1.18-1.21.4
minecraftVersions: "1.18-1.21.4"
sourceKind: authored
modIds: [satin]
loaders: [fabric, quilt]
modrinthSlug: satin-api
role: api
skillId: mc-satin
---

# Satin 后期处理着色器库集成要点

自写短文。版本与 API 细节以 [Satin](https://github.com/Ladysnake/Satin) 当前 README 为准。

## 何时用 / 何时不用

用：Fabric / Quilt 项目（1.18-1.21.4）要做屏幕后期处理效果（全屏 shader 滤镜、扭曲、调色等），想绕开原版后期处理管线的繁琐接线。Satin 是 Ladysnake 家对后期处理 shader 的封装，Modrinth 170 万下载。

不用：**非 Fabric/Quilt 项目不可用**（loaders = Fabric 与 Quilt，Forge/Neo 无构建）；目标 MC 不在 1.18-1.21.4 内时先确认官方版本；只做方块/实体上的材质 shader（非全屏后期）时，原版 `RenderType` / 自定义 material 路径更合适，不必引 Satin。

## 构件面逐 loader 实测（2026-09-25，本档 `loaders` 由 [fabric] 补成 [fabric, quilt]）

口径 = 2026-09-22 裁定④ + 2026-09-24 延伸：**点名某 loader ⇔ 构件面该 loader 有 `versionType=release` 的文件行**，窗口终点取该 loader 的 release 上界，只有 beta/alpha 撑着的必须在此披露。数据 = `mcp-server/data/lib-manifests/all.json` 的 slug `satin-api`（快照 as-of 2026-09-16；本轮未重抓，欠账挂 `CONTRIBUTING.md` `L42` ①），分母 = 该 slug 46 行：

| loader | 行 | release | 点分 `gameVersion` 上界（数值序） | 判定 |
|---|---|---|---|---|
| fabric | 23 | 20 | 1.21.1 | 原已点名；另有 3 条 `1.21.2/1.21.3/1.21.4` 记 **alpha** |
| **quilt** | 23 | **20** | **1.21.1** | ⇒ 补点名；与 fabric 行**同一批 `satin-*.jar`**（跨 loader fileName 交集 12 = 两边全部 12 个唯一名 ⇒ 不是单独的 Quilt 产物，是 Modrinth 把同一构件同时打 fabric+quilt 标签） |

- ⚠️ 快照里 `1.19-pre1` / `1.19-pre2` / `1.19-pre3` 三行被标 `versionType=release`，那是**预发布快照名**（`22w..`/`pre..` 一类非点分行按字典序还会排到 `1.20.4` 之上）⇒ 上表「release 上界」只在点分行里取，pre 行不参与窗口。
- Quilt 与 Fabric 拿到的是**同一个 jar** ⇒ 「Quilt 能用」成立，但**别去找 Quilt 专用坐标**；26.x 该 slug 两侧都无构件行，本档 `mcVersions` 上界 1.21.4 只由 alpha 支撑（该披露在 `knowledge/libs/fabric-only/mc-satin/SKILL.md` 的头注里已有，本轮未动）。
- 与 `platforms` 的关系：本条只补 `loaders`，**未动** `mc-satin/SKILL.md` 的 `platforms`（那里早已是 `[fabric, quilt]` ⇒ 本轮是让 `loaders` 追上它，不是新裁定）。
- 复核（只读、不落盘）：`node temp/ralph-20260922/_r37-probe-slug-loader.mjs` · `node temp/ralph-20260922/_r37-probe-rows.mjs` （第 37 轮探针脚本落在 `temp/**`，**不入库** ⇒ 只在本机这一轮可跑；持久口径 = 直接按 `mcp-server/data/lib-manifests/all.json` 里该 slug 的 `entries` 数 `loader` × `versionType`，点分 `gameVersion` 按数值序取上界）。


## Decision Flow

```
Decision: 要不要用 Satin
→ 非 Fabric / Quilt 项目 → 不可用（loaders 仅 fabric / quilt），换对应平台方案
→ 目标 MC 不在 1.18-1.21.4 → 查官方仓库最新支持版本后再定
→ Fabric 或 Quilt + 全屏后期处理效果 → Satin
→ 只做局部材质/方块 shader → 原版 RenderType / material 路径
→ 已选 Satin：
   ├─ 版本：与 MC 对齐（Modrinth 文件页）
   ├─ 加载器：fabric / quilt（同一批 jar，无 Quilt 专用构件）
   └─ 客户端渲染侧注册，服务端不涉及
```

## Gradle / 声明文件检查顺序

1. `build.gradle`：官方 README 的仓库与坐标（Loom 环境），`compileOnly` + 开发 `runtimeOnly`
2. `fabric.mod.json`：`depends` / `suggests` 写 `satin`（modId 以官方 jar 的 `fabric.mod.json` 为准）
3. 确认项目是 Fabric 或 Quilt：本库无 Forge/Neo artifact
4. 版本核对：1.21.4 上界以文件页为准，更高版本先确认有无构建

## 集成要点（伪代码级）

```java
// 类名以官方为准：Satin 包装后期处理管线，提供 shader 程序与效果的注册入口
// 典型流程：准备 GLSL shader（含后期处理所需的 uniform）→ 注册效果 → 触发/叠加到渲染循环
// 全部客户端侧：入口与状态放 client 包，公共代码只留门闩
// 资源：shader 文件放正确资源路径，命名与注册名对应
```

- 复用原版后期处理的 uniform/语义时，对照原版管线文档确认字段
- 效果叠加顺序影响最终画面，按需求调整注册顺序

## 常见坑

- 非 Fabric/Quilt 项目引入 → 无 artifact，构建失败（先确认加载器）
- shader 资源路径或 uniform 名写错 → 静默无效果或日志报错（对照官方示例）
- 渲染入口被公共/服务端代码引用 → 专用服或逻辑服崩溃（客户端门闩）
- 期待 1.21.4 以上支持 → 以官方发布为准，勿假定滚动跟进

## 自检清单

- 仅装 Fabric + 你的模组：效果正常触发与关闭
- 未装 Satin 时（若软依赖）：模组正常进档，不加载 Satin 类
- `runServer` 无 shader/渲染相关类加载
- 日志无 shader 编译错误

## 交叉引用

- MCP：`query_api`、`audit_resources`、`check_dependencies`、`search_community_docs`
- Skill：`mc-satin`；相关：`mc-renderer`
- 全览：§二.2 动画库（Satin API 条目）；`authored/library-catalog-2026`、`authored/library-integration`
- 官方：https://github.com/Ladysnake/Satin
- 不清楚时：打开 Satin README + 示例，或 `search_fabric_docs` 查渲染相关页；AGENT_USAGE.md 规则先行

## 核对（2026-08 反编译验证）

- 已对以下版本反编译核对（VineFlower + catalog verifiedApi）：
  - 1.18/fabric：顶层 API 包 `ladysnake.satin`，入口 ladysnake.satin.Satin
- 版本/包名详情见 `mcp-server/src/diagnostics/library-catalog.ts` 对应条目；细节仍以官方文档为准。
