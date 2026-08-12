---
id: authored/lib-polymer
title: Polymer 纯服务端内容库集成要点
tags: [polymer, server-side, virtual-block, autohost, fabric, quilt, patbox]
summary: 纯服务端生成内容的库（356 万下载，F/Quilt 1.18-26.2）：服务端注册虚拟方块/物品/实体，原版客户端免装 mod 即可见；AutoHost 托管自定义模型纹理；适合定制服务器与"客户端零 mod"内容分发。
mcHint: 1.18-26.2
minecraftVersions: "1.18-26.2"
sourceKind: authored
modIds: [polymer]
loaders: [fabric, quilt]
modrinthSlug: polymer
role: api
skillId: mc-polymer
---

# Polymer 纯服务端内容库集成要点

自写短文。版本与 API 细节以 [Polymer](https://github.com/Patbox/polymer) 当前 README 与示例为准。

## 何时用 / 何时不用

用：想在**纯服务端**生成/覆盖内容（虚拟方块、虚拟物品、虚拟实体、覆盖原版物品外观），让**原版客户端免装模组**也能看见。典型场景：定制服务器、小游戏服、不想给客户端分发内容 mod 的玩法服。AutoHost 可把自定义模型/纹理托管到服务器的 HTTP 端口，客户端自动拉取（全览 §二.8）。

不用：

- 非 Fabric/Quilt 平台（无 Forge/Neo 版本）
- 内容需要客户端本地渲染能力或大量客户端逻辑 → 传统双端 mod 分发
- 只想在服务端改数据（配方/tag）→ KubeJS 或数据包更轻（见 `lib-kubejs`）

## Decision Flow

```
Decision: 用不用 Polymer
→ 平台非 Fabric/Quilt → 不用（无对应构建）
→ 内容需要客户端本地渲染/资源包定制 → 传统 mod 分发（客户端也装）
→ 目标是"原版客户端免装可见"的服务端内容 → Polymer
→ 已选 Polymer：
   ├─ 版本：1.18-26.2 内与 MC 对齐（GitHub Releases / Modrinth 文件页）
   ├─ 内容形态：虚拟方块/物品/实体用 Polymer API 注册，客户端以合适的原版组件显示
   ├─ AutoHost：需要自定义模型/纹理时开启，资源走服务器 HTTP 端口下发
   └─ 命名空间：注册 id 遵守原版命名空间规则，避免与既有内容冲突
```

## Gradle / 声明文件检查顺序

1. `build.gradle`：按官方 README 配 maven 仓库与 `modImplementation` 坐标（Fabric Loom 流程）
2. `fabric.mod.json`：`depends` / `suggests` 写 polymer（软依赖门闩见 `authored/soft-deps-modlist`）
3. 版本核对：以 GitHub Releases / Modrinth 文件页为准，选中与目标 MC 匹配的构建

## 集成要点（伪代码级）

```java
// 服务端注册"虚拟"内容，客户端零 mod
// 典型流程：服务端初始化时按 Polymer API 注册虚拟方块/物品/实体（id 符合原版命名空间）
// 覆盖原版物品外观/行为：注册"资源包覆盖 + 服务端拦截"组合
// AutoHost：开启后自定义模型/纹理由 Polymer 托管到自身 HTTP 端口，客户端自动拉取
// 类名、包名与方法签名以官方 README + 示例 mod 为准，勿照抄旧版本教程
```

- 注册逻辑放服务端侧，客户端不需要 Polymer 类引用
- 虚拟内容的行为（交互、掉落、破坏）由服务端逻辑驱动，客户端只负责显示

## 常见坑

- 在无 AutoHost 时用了自定义模型/纹理 → 客户端显示占位/异常，需正确开启与配置 AutoHost
- 注册 id 与原版或其他 mod 冲突 → 虚拟内容串台
- 把 Polymer 当普通内容 mod 双端安装 → 它定位服务端，安装方式以 README 说明为准
- 照抄 1.18 时代旧教程的类名/包名 → 版本跨度大（1.18-26.2）已重构，以当前 README 为准

## 自检清单

- 原版客户端（未装 Polymer）能进服并看见服务端生成的内容
- 服务器启动日志无 Polymer 相关报错，虚拟内容正常注册
- AutoHost（若启用）：模型/纹理在浏览器/客户端能访问
- 目标 MC 版本能拉到对应 Polymer 构建，构建无 API 报错

## 交叉引用

- MCP：`check_dependencies`、`search_community_docs`
- Skill：`mc-polymer`；相关：`mc-registry`、`mc-networking`、`mc-resourcepack`
- 全览：§二.8 服务端/网络/文本；`authored/library-catalog-2026`、`authored/library-integration`
- 官方：https://github.com/Patbox/polymer
- 不清楚时：打开 Polymer README + 示例；`search_fabric_docs` 查服务端/资源相关页；AGENT_USAGE.md 规则先行

## 核对（2026-08 反编译验证）

- 已对以下版本反编译核对（VineFlower + catalog verifiedApi）：
  - 1.18.1/fabric：顶层 API 包 （无独立包），无 entrypoint
- 版本/包名详情见 `mcp-server/src/diagnostics/library-catalog.ts` 对应条目；细节仍以官方文档为准。
