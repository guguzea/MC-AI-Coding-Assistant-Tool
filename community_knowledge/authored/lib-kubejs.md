---
id: authored/lib-kubejs
title: KubeJS 整合包脚本引擎集成要点
tags: [kubejs, javascript, script, recipe, tag, reload, probejs, fabric, forge, neoforge, quilt]
summary: JavaScript 脚本引擎（1900 万下载，F/Forge/Neo/Quilt 1.18.2-26.1.2）：脚本改配方、注册物品方块、改 tag、热重载；ATM/E2E 等大型整合包依赖它，开发期配 ProbeJS 补全。
mcHint: 1.18.2-26.1.2
minecraftVersions: "1.18.2-26.1.2"
sourceKind: authored
modIds: [kubejs]
loaders: [fabric, forge, neoforge, quilt]
modrinthSlug: kubejs
role: api
skillId: mc-kubejs
---

# KubeJS 整合包脚本引擎集成要点

自写短文。版本与 API 细节以 [KubeJS](https://github.com/KubeJS-Mods/KubeJS) 当前文档（docs.kubejs.com）与示例为准。

## 何时用 / 何时不用

用：整合包**内容定制**：脚本改/删配方、注册简单物品方块、改 tag、写自定义逻辑，**免编译免重启**（支持热重载）。ATM、E2E 等几乎所有大型整合包都用它做内容层，开发期配 ProbeJS 提供补全与文档（全览 §二.10）。

不用：

- 需要自定义渲染、深度注册或性能关键逻辑 → 写 Java 模组，KubeJS 是脚本层不是替代品
- 正式产品级模组内容分发 → Java 模组 + 数据包更可控
- 只想改配方/tag 且无脚本需求 → 数据包可能就够

## Decision Flow

```
Decision: 用不用 KubeJS
→ 需要自定义渲染/复杂注册/性能关键逻辑 → Java mod
→ 整合包内容调整（配方/tag/简单注册/脚本逻辑）→ KubeJS
→ 已选：
   ├─ 平台分支：Fabric / Forge / NeoForge / Quilt 装对应构建
   ├─ 脚本位置：按平台约定放 scripts 目录（server/startup 等，以文档为准）
   ├─ 热重载：改脚本后可热重载，生产环境注意版本行为
   ├─ ProbeJS：开发期启用，提供补全/文档辅助（可选依赖）
   └─ 版本：1.18.2-26.1.2 内与 MC 对齐（GitHub Releases / Modrinth 文件页）
```

## Gradle / 声明文件检查顺序

1. 作为玩家侧内容：整合包直接装 KubeJS，无需 gradle
2. 作为依赖（你的 mod 调用 KubeJS API）：`build.gradle` 照官方文档配 maven 与坐标
3. `fabric.mod.json` / `mods.toml`（26.x 为 `neoforge.mods.toml`）：`depends` / `suggests` 声明 kubejs（软依赖门闩见 `authored/soft-deps-modlist`）
4. 版本核对：以官方文档 / GitHub Releases / Modrinth 文件页为准

## 集成要点（伪代码级）

```js
// startup 脚本：注册简单物品/方块（id、属性以文档 API 为准）
// server 脚本：监听配方相关事件，改/删/加配方；tag 事件改标签
// 热重载：改完脚本按文档方式触发重载，验证改动
// 事件名、脚本目录与 API 名称以 docs.kubejs.com 对应 MC 版本为准，勿照抄旧版本脚本
```

- 脚本按「启动期 / 服务端 / 客户端」分场景，放对目录
- 大改动先小脚本验证，避免一次堆大量脚本难排查

## 常见坑

- 脚本 API 随 MC 版本大改 → 以 docs.kubejs.com 对应版本为准，旧脚本可能失效
- 配方改不动 → 事件名或配方 id 写错，先确认事件与目标配方 id
- 期待"脚本即全功能 mod" → 渲染/复杂注册仍需 Java 模组
- 平台间脚本目录/加载行为有差异 → 换平台时核对文档
- 生产服依赖热重载改内容 → 注意热重载与正式环境的边界（以文档为准）

## 自检清单

- 目标脚本在日志中加载无报错，改动生效（配方/tag/注册验证）
- 热重载后改动立即生效且无残留状态
- 与 ProbeJS（若用）配合能出补全，无版本不匹配告警
- 目标 MC 版本能拉到对应 KubeJS 构建

## 交叉引用

- MCP：`check_dependencies`、`search_community_docs`、`validate_datapack_json`
- Skill：`mc-kubejs`；相关：`mc-recipe`、`mc-registry`、`mc-datapack`
- 全览：§二.10 脚本/工具；`authored/library-catalog-2026`、`authored/library-integration`
- 官方：https://github.com/KubeJS-Mods/KubeJS
- 不清楚时：打开 docs.kubejs.com（对应 MC 版本）+ 官方示例；AGENT_USAGE.md 规则先行
