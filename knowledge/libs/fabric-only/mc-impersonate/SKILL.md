---
name: mc-impersonate
description: Impersonate 玩家伪装 API。触发词：Impersonate、伪装、换皮肤、改名牌、扮演、disguise、身份、Ladysnake
platforms: [fabric, quilt]
mcVersions: ["1.16.3-1.21.11"]
communityDocId: authored/lib-impersonate
mappings: hint
---

# Impersonate（Fabric/Quilt）

Ladysnake 玩家伪装 API（5.1 万下载，F/Quilt 服务端，1.16.3-1.21.11）：服务端给玩家换皮肤、改名牌、扮演其他玩家/角色，基于 CCA 把伪装数据挂在玩家身上（依赖链：Impersonate → CCA，见 `mc-cca`）。典型场景：角色扮演服、伪装成 NPC 或生物的玩法。**Forge/NeoForge 不可用**（无 Forge/Neo 构建）。

## Decision Flow

```
Decision: 用不用 Impersonate
→ 平台非 Fabric/Quilt → 不用（无对应构建，本 skill 不适用）
→ 只要显示改名（不换皮肤/身份）→ 原版 team / 名牌等轻量方案
→ 需要客户端侧渲染定制 → 客户端 mod 方案（伪装 API 只管服务端身份）
→ 需要皮肤/名牌/身份整体伪装 → Impersonate
→ 已选：
   ├─ 前置：CCA 为硬依赖，需一并声明（见 mc-cca / lib-cca）
   ├─ 调用侧：伪装/取消只在服务端逻辑触发（命令、服务端事件），客户端显示由库同步
   ├─ 数据：伪装状态以 CCA 组件挂在玩家上，跨存档/重进保持行为以 README 为准
   └─ 版本：1.16.3-1.21.11 内与 MC 对齐（GitHub Releases / Modrinth 文件页）
```

## 核心 API 速查

- 顶层 API 包：`io.github.ladysnake`；入口 `io.github.ladysnake.impersonate.Impersonate`（1.16.3/fabric 反编译核对）
- 客户端实现类：`io.github.ladysnake.impersonate.impl.ImpersonateClient`（仅供参考，勿在服务端调用）
- 伪装/取消入口的方法签名：短文未列，**以官方 README + 示例为准**（禁止臆造，勿照抄旧版本教程）
- 触发点：命令执行、服务端事件等服务端逻辑；其他玩家视角的皮肤/名牌同步由库负责

## 软/硬依赖

- 坐标/maven：按官方 README 配 maven 仓库与 `modImplementation` 坐标（Fabric Loom 流程）
- `fabric.mod.json`：`depends` 写 impersonate 与 CCA（cardinal-components 相关模块），版本以 README 为准
- 版本核对：以 GitHub Releases / Modrinth 文件页为准；版本窗口停在 1.21.11，更高版本无构建

## 官方文档

- 仓库：https://github.com/Ladysnake/Impersonate ；CCA：https://github.com/Ladysnake/cardinal-components-api （当前 README + 示例）

## communityDocId 引用

- `authored/lib-impersonate`：完整要点（选型、集成伪代码、自检清单），经 MCP `search_community_docs` 读取

## 常见错误

- 漏声明 CCA 依赖：运行时缺类崩溃
- 在客户端线程触发伪装：服务端 API 需在服务端逻辑中调用
- 与身份/皮肤类 mod 的显示叠加冲突：先查目标 mod 的显示管线，注意显示叠加
- 在 1.21.11+ 找构建：版本窗口已停，以 GitHub Releases 为准
- Forge/NeoForge 项目引入本 skill：无 Forge 构建，勿用

## 自检

- 伪装后其他玩家看到对应的皮肤/名牌
- 取消伪装后恢复原身份
- 仅装 Impersonate + CCA（不含功能 mod）无异常
- `runServer` 日志无伪装相关报错

未核对签名不写死：伪装/取消入口方法以官方 README 示例为准。
