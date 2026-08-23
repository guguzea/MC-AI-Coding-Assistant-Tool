---
id: links/fabric-wiki-tutorial-index
title: Fabric Wiki / Fabric 文档教程总索引（外链）
url: https://wiki.fabricmc.net/tutorial:start
summary: Fabric 社区 Wiki 教程目录 + 新版 docs.fabricmc.net；Mixin 十二篇系列、命令、worldgen、SavedData、发布（Modrinth/CurseForge/GitHub Actions）等全主题指针。
tags: [index, fabric, wiki, mixin, commands, worldgen, publishing, link-only]
sourceKind: links
mcHint: 1.14+（新版教程迁移 docs.fabricmc.net；旧页保留）
---

# Fabric Wiki / Fabric 官方文档教程索引（外链）

- Wiki 教程目录：https://wiki.fabricmc.net/tutorial:start
- 新版官方开发者文档：https://docs.fabricmc.net/develop/ （版本化，优先用）
- 注意：Wiki 是社区维护，部分页面滞后；新主题多已迁往 docs.fabricmc.net，旧页仍可用但 API 名以目标版本映射为准。

## 重点章节（本库核实过目录存在）

| 主题 | 页面 |
|------|------|
| Mixin 系列（12 篇） | `/tutorial:mixin_introduction` 起：glossary / first mixin / registration / @Inject / accessors / redirectors / tips / examples / hotswaps / export / reflection |
| 命令（6 篇） | basics / exceptions / suggestions / redirects / argument types / examples → 新版 `docs.fabricmc.net/develop/commands/*` |
| Worldgen | ores、features、trees、dimensions、portals、chunk generator（DRAFT）、world presets |
| 数据持久化 | `docs.fabricmc.net/develop/saved-data`（旧 `/tutorial:persistent_states`）、Global World Data |
| 事件 | `docs.fabricmc.net/develop/events`（含自定义事件） |
| 实体 | first-entity、spawn egg、projectiles |
| 流体 | `docs.fabricmc.net/develop/fluids/first-fluid` |
| GUI | custom screens（docs）、extended screenhandler 同步（wiki） |
| 发布 | Minotaur→Modrinth、CurseGradle、GitHub Actions（`/tutorial:publishing_mods_using_github_actions`） |
| 服务端/客户端 | `/tutorial:side`（物理端概念） |

## 用法

- 查 API 细节优先 `search_fabric_docs`（本地 versioned 树）；Wiki 页用于**实务讲解与完整示例**。
- 引用某篇写代码但细节不确定时，必须打开原文核对（AGENT_USAGE.md 规则），禁止凭记忆复述。

相关自写短文：`authored/fabric-saveddata-persistent-state`、`authored/fabric-ore-generation`。
