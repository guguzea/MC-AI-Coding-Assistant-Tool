---
id: authored/lib-impersonate
title: Impersonate 玩家伪装 API 集成要点
tags: [impersonate, disguise, player, cardinal-components, cca, fabric, quilt, ladysnake]
summary: 玩家伪装 API（5.1 万下载，F/Quilt 服务端 1.16.3-1.21.11）：服务端给玩家换皮肤/名牌/身份，基于 Cardinal Components API 挂玩家数据；适合角色扮演服、NPC 伪装类玩法。
mcHint: 1.16.3-1.21.11
minecraftVersions: "1.16.3-1.21.11"
sourceKind: authored
modIds: [impersonate]
loaders: [fabric, quilt]
modrinthSlug: impersonate
role: api
skillId: mc-impersonate
---

# Impersonate 玩家伪装 API 集成要点

自写短文。版本与 API 细节以 [Impersonate](https://github.com/Ladysnake/Impersonate) 当前 README 与示例为准。

## 何时用 / 何时不用

用：服务端要**伪装玩家身份**：换皮肤、改名牌显示、扮演其他玩家/角色，且基于 CCA 把伪装数据挂在玩家身上。典型场景：角色扮演服务器、伪装成 NPC 或生物的玩法（全览 §二.8）。

不用：

- 非 Fabric/Quilt 平台（F/Quilt 服务端定位，无 Forge/Neo 构建）
- 只想改显示名 → 原版 team / 名牌等轻量方案
- 需要客户端侧渲染定制 → 客户端 mod 方案，伪装 API 只管服务端身份

## Decision Flow

```
Decision: 用不用 Impersonate
→ 平台非 Fabric/Quilt → 不用（无对应构建）
→ 只要显示改名（不换皮肤/身份）→ 原版 team 等轻量方案
→ 需要皮肤/名牌/身份整体伪装 → Impersonate
→ 已选：
   ├─ 前置：Cardinal Components API（CCA）为依赖，需一并声明（见 lib-cca）
   ├─ 调用侧：伪装/取消只在服务端逻辑触发，客户端显示由库同步
   ├─ 数据：伪装状态以 CCA 组件挂在玩家上，跨存档/重进保持行为以 README 为准
   └─ 版本：1.16.3-1.21.11 内与 MC 对齐（GitHub Releases / Modrinth 文件页）
```

## Gradle / 声明文件检查顺序

1. `build.gradle`：按官方 README 配 maven 仓库与 `modImplementation` 坐标（Fabric Loom 流程）
2. `fabric.mod.json`：`depends` 写 impersonate 与 CCA（cardinal-components 相关模块），版本以 README 为准
3. 版本核对：以 GitHub Releases / Modrinth 文件页为准；注意版本窗口停在 1.21.11，更高版本无构建

## 集成要点（伪代码级）

```java
// 服务端：在命令/事件逻辑里调用伪装 API，指定目标玩家与要伪装的身份（如皮肤/名字来源）
// 取消伪装：调用对应取消入口，恢复原身份
// 其他玩家视角：库负责把伪装后的皮肤/名牌同步给他们显示
// 类名、包名与方法签名以官方 README + 示例为准，勿照抄旧版本教程
```

- 伪装触发点放服务端（命令执行、服务端事件），不要在客户端线程直接调用
- 与身份相关的其他 mod（如称号系统）注意显示叠加

## 常见坑

- 漏声明 CCA 依赖 → 运行时缺类崩溃
- 在客户端线程触发伪装 → 服务端 API 需在服务端逻辑中调用
- 与身份/皮肤类 mod 的显示叠加冲突 → 先查目标 mod 的显示管线
- 在 1.21.11+ 找构建 → 版本窗口已停，以 GitHub Releases 为准

## 自检清单

- 伪装后其他玩家看到对应的皮肤/名牌
- 取消伪装后恢复原身份
- 仅装 Impersonate + CCA（不含功能 mod）无异常
- `runServer` 日志无伪装相关报错

## 交叉引用

- MCP：`check_dependencies`、`search_community_docs`
- Skill：`mc-impersonate`；相关：`mc-cca`、`mc-networking`、`mc-command`
- 全览：§二.8 服务端/网络/文本；`authored/library-catalog-2026`、`authored/library-integration`
- 官方：https://github.com/Ladysnake/Impersonate ；CCA：https://github.com/Ladysnake/cardinal-components-api
- 不清楚时：打开 Impersonate README + 示例；`search_fabric_docs` 查玩家/服务端相关页；AGENT_USAGE.md 规则先行
