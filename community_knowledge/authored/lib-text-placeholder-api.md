---
id: authored/lib-text-placeholder-api
title: Text Placeholder API 占位符库集成要点
tags: [text-placeholder-api, placeholder, simplified-text-format, text, fabric, quilt, patbox]
summary: 占位符解析库（5670 万下载，F/Quilt 1.17-26.2）：注册与消费 %modid:type% 占位符，配合 Simplified Text Format 简化文本构建；适合聊天、名牌、命令输出、GUI 与数据驱动文本。
mcHint: 1.17-26.2
minecraftVersions: "1.17-26.2"
sourceKind: authored
modIds: [text_placeholder_api]
loaders: [fabric, quilt]
modrinthSlug: placeholder-api
role: api
skillId: mc-text-placeholder
---

# Text Placeholder API 占位符库集成要点

自写短文。版本与 API 细节以 [Text Placeholder API](https://github.com/Patbox/text_placeholder_api) 当前 README 与示例为准。

## 何时用 / 何时不用

用：需要**注册自己的占位符**（`%modid:key%`）供玩家、其他 mod 或占位符生态消费；或者想**解析别人注册的占位符**。常见场景：聊天格式化、自定义名牌、命令输出、GUI 文本、数据驱动的显示文本。Simplified Text Format 可用来简化 Component 构建，减少样板代码（全览 §二.8）。

不用：

- 非 Fabric/Quilt 平台（无 Forge/Neo 版本）
- 文本固定、无需运行时替换 → 原版 `Component` / `translatable` 就够
- 只需要原版语言文件本地化 → 见 `authored/localization-lang`

## Decision Flow

```
Decision: 用不用 Text Placeholder API
→ 平台非 Fabric/Quilt → 不用（无对应构建）
→ 文本固定、无运行时替换 → 原版 Component
→ 要暴露/消费 %modid:type% 占位符 → Text Placeholder API
→ 已选：
   ├─ 格式：%modid:key%，modid 用自己模组 id，避免与其他占位符冲突
   ├─ 解析：把含占位符的文本交给库解析（聊天/命令输出等），不要在客户端硬拆字符串
   ├─ Simplified Text Format：能用简写语法构建 Component 时优先（语法以 README 为准）
   └─ 版本：1.17-26.2 内与 MC 对齐（GitHub Releases / Modrinth 文件页）
```

## Gradle / 声明文件检查顺序

1. `build.gradle`：按官方 README 配 maven 仓库与 `modImplementation` 坐标（Fabric Loom 流程）
2. `fabric.mod.json`：`depends` / `suggests` 写 text_placeholder_api（软依赖门闩见 `authored/soft-deps-modlist`）
3. 版本核对：以 GitHub Releases / Modrinth 文件页为准

## 集成要点（伪代码级）

```java
// 注册自己的占位符：为 %modid:key% 注册一个解析处理器，返回组件/文本
// 消费占位符：把含 %modid:key% 的文本交给库的解析入口，得到渲染用的 Component
// Simplified Text Format：字符串简写 → Component，用于快捷构建显示文本
// 类名、包名与方法签名以官方 README + 示例为准，勿照抄旧版本教程
```

- 注册与解析都在服务端逻辑内做，客户端渲染交给原版文本管线
- 占位符 key 命名稳定，改 key 前确认没有外部依赖它

## 常见坑

- 占位符 key 与其他 mod 冲突 → 命名加自己 modId 前缀
- 把 `%modid:key%` 当纯文本直接显示 → 忘了调用库的解析入口
- 期待服务端命令输出自动替换 → 需要显式调用解析 API，不会隐式生效
- 照抄 1.17 时代旧教程的类名 → 版本跨度大已重构，以当前 README 为准

## 自检清单

- 含占位符的文本能被正确解析为替换值（聊天/命令输出验证）
- 未装库时（若软依赖）：模组不加载相关类，不崩
- `runServer` 日志无解析异常
- 目标 MC 版本能拉到对应构建

## 交叉引用

- MCP：`check_dependencies`、`search_community_docs`
- Skill：`mc-text-placeholder`；相关：`mc-command`、`mc-networking`、`mc-gui`
- 全览：§二.8 服务端/网络/文本；`authored/library-catalog-2026`、`authored/library-integration`
- 官方：https://github.com/Patbox/text_placeholder_api
- 不清楚时：打开 Text Placeholder API README + 示例；`search_fabric_docs` 查文本/聊天相关页；AGENT_USAGE.md 规则先行

## 核对（2026-08 反编译验证）

- 已对以下版本反编译核对（VineFlower + catalog verifiedApi）：
  - 1.19/fabric：顶层 API 包 `eu.pb4`，无 entrypoint
- 版本/包名详情见 `mcp-server/src/diagnostics/library-catalog.ts` 对应条目；细节仍以官方文档为准。
