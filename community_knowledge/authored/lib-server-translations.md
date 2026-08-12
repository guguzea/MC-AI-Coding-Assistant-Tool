---
id: authored/lib-server-translations
title: Server Translations API 服务端翻译库集成要点
tags: [server-translations-api, server-i18n, translation, text, nucleoid, fabric, forge, neoforge]
summary: 服务端按玩家语言渲染可翻译文本的库（F/Forge/Neo，版本以 GitHub Releases 为准）。Modrinth 页面已下架，分发走 maven.nucleoid.xyz；替代品 Server I18n API。
mcHint: 以 GitHub Releases 为准（目录未标注版本区间）
minecraftVersions: "以 GitHub Releases 为准"
sourceKind: authored
modIds: [server_translations_api]
loaders: [fabric, forge, neoforge]
modrinthSlug: ""
role: api
skillId: mc-server-translations
---

# Server Translations API 服务端翻译库集成要点

自写短文。版本、maven 坐标与 API 细节以 [Server Translations API](https://github.com/NucleoidMC/server-translations-api) 当前 README 为准。

## 何时用 / 何时不用

用：服务端要向**不同语言玩家**发送"按各自语言渲染"的可翻译文本（聊天、命令输出、GUI、书等），而不是统一英文或硬编码单一语言。它把原版 `translatable` 组件在服务端解析成玩家自己的语言（全览 §二.8）。

不用：

- 客户端必然装有你的 mod / 无多语言需求 → 原版 `translatable` 组件即可（客户端自行翻译）
- 只需要服务端发送固定文本 → 普通 Component 就够
- 想用占位符生态 → Text Placeholder API（见 `lib-text-placeholder-api`）

## Decision Flow

```
Decision: 服务端文本要不要按玩家语言渲染
→ 客户端必然装有 mod / 无多语言需求 → 原版 translatable component
→ 需要服务端按玩家语言渲染 → Server Translations API
→ 已选，分发决策：
   ├─ Modrinth 页面已下架：禁止引用其 Modrinth 文件页/下载页（全览陷阱 5）
   ├─ 分发走 maven.nucleoid.xyz：build.gradle 配 maven 仓库 + 坐标（以 README 为准）
   ├─ 平台分支：Fabric / Forge / NeoForge 均有构建（以 GitHub Releases 为准）
   └─ 替代品：Server I18n API（Nucleoid 生态）也可考虑，按维护状态与需求取舍
```

## Gradle / 声明文件检查顺序

1. `build.gradle`：maven.nucleoid.xyz 仓库 + 依赖坐标，照 README 抄（compileOnly / runtimeOnly 或 Loom 的 modImplementation）
2. `fabric.mod.json` / `mods.toml`（26.x 为 `neoforge.mods.toml`）：`depends` / `suggests` 声明（软依赖门闩见 `authored/soft-deps-modlist`）
3. 版本核对：**不看 Modrinth（已下架）**，以 GitHub Releases / maven.nucleoid.xyz 上的版本为准

## 集成要点（伪代码级）

```java
// 把可翻译文本以 translatable 组件交给库，服务端按玩家语言渲染后再发送
// 典型流程：构建组件（key + 参数）→ 交给库的渲染/发送入口 → 各玩家收到自己语言的文本
// 语言资源：确认翻译 key 有对应语言文件，缺语言时回退行为以库文档为准
// 类名、包名与方法签名以官方 README + 示例为准，勿照抄旧版本教程
```

- 文本尽量以组件（component）形式传递，不要把已拼好的字符串交给库
- 服务端渲染逻辑与客户端 UI 解耦，客户端只显示收到的文本

## 常见坑

- 按"Modrinth 依赖解析 / 文件页"方式装 → 页面已下架，改用 maven.nucleoid.xyz + 坐标
- 以为库会翻译"已发送的字符串" → 文本必须以组件形式传递
- 只 `compileOnly` 却当硬依赖用 → 玩家未装时 `NoClassDefFoundError`
- 语言文件只放客户端 → 服务端渲染时可能缺对应语言（回退规则以库文档为准）

## 自检清单

- 中文/英文玩家分别收到各自语言的文本
- 未装库时（若软依赖）：模组正常进档，不加载相关类
- `runServer` 日志无翻译相关报错
- 目标 MC 版本能在 maven.nucleoid.xyz 拉到对应构建

## 交叉引用

- MCP：`check_dependencies`、`search_community_docs`
- Skill：`mc-server-translations`；相关：`mc-command`、`mc-networking`、`mc-config`
- 全览：§二.8 服务端/网络/文本、陷阱 5；`authored/library-catalog-2026`、`authored/library-integration`
- 官方：https://github.com/NucleoidMC/server-translations-api ；替代品 Server I18n API 见 Nucleoid 生态（以官方仓库说明为准）
- 不清楚时：打开 Server Translations API README + 示例；`search_fabric_docs` 查文本/服务端相关页；AGENT_USAGE.md 规则先行

## 核对（2026-08 反编译验证）

- ⚠️ 暂未反编译核对（catalog 无 verifiedApi）；细节以官方文档为准。
