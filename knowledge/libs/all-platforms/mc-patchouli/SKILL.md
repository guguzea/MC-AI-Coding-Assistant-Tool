---
name: mc-patchouli
description: Patchouli 游戏内指南书。book 资源放 data/<modid>/patchouli_books/，JSON 驱动、自定义页面类型才写 Java。触发词：Patchouli、patchouli、指南书、guidebook、book.json、手册
platforms: [fabric, forge, neoforge]
mcVersions: ["1.14.4-26.1"]
communityDocId: authored/lib-patchouli
mappings: "Forge ≤1.20.6 用 MCP、NeoForge 1.21+/26.x 用 mojmap；Java 代码只在自定义页面类型时出现"
---

# Patchouli 指南书（操作指引）

给 AI 的操作指引：给模组做游戏内指南书（分类 + 条目 + 多语言），JSON 数据为主，少写 Java UI。详细信息用 `search_community_docs` 查 `authored/lib-patchouli`，book.json 格式、页面类型与版本支持以 [官方文档](https://vazkiimods.github.io/Patchouli/) 与 [GitHub Releases](https://github.com/VazkiiMods/Patchouli) 为准。

## 何时用 / 何时不用

- 用：需要游戏内指南书，内容以 JSON 数据为主；Forge/NeoForge 模组标配
- 不用：只要少量说明 → tooltip / 进度就够；需要完全自定义交互/搜索体验 → 自研 GUI（见 `authored/menu-screen-sync`）；目标 MC 无构建（26.1 目前为 beta `release-26.1-94-beta`）

## 加载器事实（先核对再动手）

- 1.18 起 Fabric 与 Forge 同仓库维护（Fabric 构建为 patchouli-fabric）
- **1.21.1 起弃 MinecraftForge、转向 NeoForge**；1.20.6 及以前才出 Forge 版

## Decision Flow

```
Decision: 指南书方案
→ 平台 = forge 且 MC ≤ 1.20.6 → Patchouli Forge 构建
→ 平台 = neoforge（1.21+）→ Patchouli NeoForge 构建
→ 平台 = fabric → patchouli-fabric 构建
→ 仅少量提示文本 → tooltip / 进度，跳过
→ 已选：
   ├─ book 布局：data/<modid>/patchouli_books/<book_id>/
   ├─ 内容：JSON（categories / entries / pages），默认页面类型够用
   ├─ 解锁：条目解锁与 Advancement 联动（可选，配置以文档为准）
   └─ 自定义页面类型才写 Java（接口/基类以官方为准）
```

## 操作步骤

1. 依赖声明：`build.gradle` 配 maven（`https://maven.blamejared.com`）与坐标（NeoForge：`vazkii.patchouli:patchouli-neoforge:<version>` 的 `:api` + `runtimeOnly`；Fabric：`vazkii.patchouli:patchouli-fabric:<version>`；**以 README 当前文本为准**）
2. 声明依赖：`mods.toml`（26.x 为 `neoforge.mods.toml`）/ `fabric.mod.json` 的 `depends` 写 `patchouli`；软依赖门闩见 `authored/soft-deps-modlist`
3. 搭 book 结构：`data/<modid>/patchouli_books/<book_id>/book.json`（书名、作者、图标、语言映射，字段以官方 schema 为准）
4. 写本地化：`en_us/en_us.json` + `categories/<cat_id>.json` + `entries/<entry_id>.json`（pages 数组，页面类型如 text / crafting / image 以官方为准）；多语言（zh_cn 等）按 en_us 同构复制
5. 资源位置：book JSON 在 `data/`（Patchouli 书是数据包的一部分）；纹理/图标资源放 `assets/<modid>/`；book_id / 语言文件夹名 / en_us.json 内部键必须一致
6. 解锁（可选）：条目解锁与 Advancement 联动，advancement id 写错会锁死条目
7. 预检：条目 JSON 语法错误会导致整本书不加载，用 `validate_datapack_json` 先验

## 软 / 硬依赖

- 硬依赖：`depends` 写 patchouli；软依赖则门闩（卸载 Patchouli 进档不崩，但不能引用其类）
- 默认页面类型纯 JSON，不写 Java；只有自定义页面类型（独特交互/渲染）才需要引 `:api` 编译

## 常见错误

- book id / 语言文件夹名 / en_us.json 内部键不一致 → 书加载失败或显示空白
- 资源放错位置：book JSON 放 `assets/`（或图标放 `data/`）→ 以文档为准核对
- 条目 JSON 语法错误 → 整本书不加载
- 1.21.1+ 项目依赖 Forge 版 Patchouli → **不存在**，改用 NeoForge 构建
- 解锁/进度联动写错 advancement id → 条目永远锁死

## 自检清单

- 游戏内 `/patchouli open <modid>:<book_id>` 能打开书
- 控制台无 Patchouli 红字（book 加载错误）
- 每个类别/条目在多语言下均有键，缺键条目显示 id 原文
- 自定义页面类型在服务端无类引用（若纯客户端 UI）
- 卸载 Patchouli（软依赖场景）进档不崩

## 参考

- 官方：https://github.com/VazkiiMods/Patchouli 、https://vazkiimods.github.io/Patchouli/
- 社区：`search_community_docs` → `authored/lib-patchouli`；汉化见 `authored/localization-lang`
- 相关 Skill：`mc-datapack`；MCP：`validate_datapack_json`、`audit_resources`
- 不确定时：打开官方文档「Getting Started」与示例书，未核对前不写死任何接口/基类签名
