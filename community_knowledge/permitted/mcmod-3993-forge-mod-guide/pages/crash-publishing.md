---
id: mcmod-3993/crash-publishing
title: 崩溃日志类型与发布渠道（社区）
tags: [crash, publishing, curseforge, modrinth]
mcHint: version-agnostic
---

# 崩溃日志类型与发布渠道

> 提炼自社区教程「游戏崩溃篇 / 发表模组篇」。更完整的自写说明见 `authored/crash-reports.md` 与 `authored/publishing.md`。

## 崩溃文件名后缀（常见）

| 后缀 | 含义 |
|------|------|
| `fml` | Forge 模组加载器相关（最常见） |
| `client` | 客户端崩溃 |
| `server` | 专用服务端崩溃 |
| `integrated-server` | 单人集成服务端 |
| `openGL` / rendering | 渲染 / 显卡相关 |
| `memory` | 内存不足等 |
| `fabric` | Fabric 加载器相关 |
| `java` | JVM 自身问题 |

优先阅读崩溃报告**开头**；叠加问题需结合 `latest.log` / `debug.log`。

## 发布渠道（概览）

- CurseForge、Modrinth、GitHub Releases、MC百科
- 作为前置库时可发布 Maven（如 GitHub raw + `mcmodsrepo`）
