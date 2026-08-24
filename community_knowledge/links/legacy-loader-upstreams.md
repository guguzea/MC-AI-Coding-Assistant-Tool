---
id: links/legacy-loader-upstreams
title: 老加载器上游指针（LiteLoader / Rift / ModLoader / MCP）
url: https://www.liteloader.com/
summary: 三个历史加载器的可核实上游：liteloader.com 官方 wiki（教程全文已入库本地版本档）、DimensionalDevelopment/Rift、ModCoderPack 映射档案；标注存活状态。第三方老加载器教程稀少，API 一律以本地版本档核实表为准。
tags: [index, liteloader, rift, modloader, mcp, legacy, link-only]
sourceKind: links
mcHint: LiteLoader 1.8.9/1.10.2/1.12.2；Rift 1.13.2；ModLoader 1.2.5/1.5.2/1.6.4
---

# 老加载器上游指针

> **先看本地**：三个加载器的官方文档正文已经收录在本仓库版本档里（见下），本条只是外部原文指针 + 存活状态记录。写码的 API 依据是各档 `verified-api.md` / `safe-api.md` 核实表，**不是**这些网站。

## LiteLoader（Mumfrey）

| 资源 | URL | 状态（2026-08 核验） |
|------|-----|----------------------|
| 官方站 + 开发 wiki | https://www.liteloader.com/ （dev:tutorial 五步教程、interfaces、litemod.json） | ✅ 200 存活；**全文已入库** `data/liteloader_1.12.2/liteloader-docs/`（另 1.8.9 / 1.10.2 档），`search_docs platform=liteloader` 可查 |
| 安装器源码 | https://github.com/Mumfrey/LiteLoaderInstaller | ✅ GitHub 在 |
| Loader 本体源码 | http://develop.liteloader.com/liteloader/LiteLoader（分支 1.12.2） | ⚠️ 已上登录墙；loader 闭源。方法名以各档 `verified-api.md` 为准 |

## Rift（1.13.2）

| 资源 | URL | 状态 |
|------|-----|------|
| 官方仓库 | https://github.com/DimensionalDevelopment/Rift | ✅ GitHub 在（★124）；本地 `rift_1.13.2/rift-docs/processed/` 已收 upstream-readme、making-mods-wiki、listeners |

## Risugami's ModLoader（1.2.5 / 1.5.2 / 1.6.4）

- 原始论坛帖年代久远、镜像质量参差——**不提供外链**。
- 唯一依据：本地 `data/modloader_<ver>/modloader-docs/1.6.4/processed/safe-api.md` + 社区短文 `authored/modloader-1.6.4`。

## MCP 工具链（老版本映射考古）

- https://github.com/ModCoderPack/MCPMappingsArchive —— 1.7.10/1.12.2 时代 SRG↔MCP 映射档案，配合 `convert_mapping` / `lookup_obfuscated` 用。

## 教程生态现状

LiteLoader/Rift/ModLoader 的**第三方**教程在网上几乎绝迹且多为过时转贴（YouTube 老视频无法核验内容）。维护这三个加载器时：入口走根 AGENTS.md 第一步的平台判定 → 读对应版本档规则树 → API 只用核实表；外部仅在上文列出的站点做原文复核。

**补充**：mcmod 社区帖《站内收录模组加载器汇总》（https://www.mcmod.cn/post/4880.html ，默认 BY-NC-SA，仅外链）收录了 20+ 加载器名录（含 Cleanroom/Babric/Ornithe/NilLoader/Meddle 等本库未建档的历史加载器），做加载器考古时先查它再回本条核上游。
