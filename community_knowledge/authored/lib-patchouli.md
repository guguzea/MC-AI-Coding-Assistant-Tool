---
id: authored/lib-patchouli
title: Patchouli 指南书集成要点
tags: [patchouli, guidebook, documentation, datapack, fabric, forge, neoforge]
summary: 游戏内指南书库，book 资源放 data/<modid>/patchouli_books/，数据包为主、自定义页面类型才写 Java；解锁与进度联动可选；1.21.1 起弃 Forge 转 NeoForge。
mcHint: 1.14.4-26.1
minecraftVersions: "1.14.4-26.1"
sourceKind: authored
modIds: [patchouli]
loaders: [fabric, forge, neoforge]
modrinthSlug: patchouli
role: api
skillId: mc-patchouli
---

# Patchouli 指南书集成要点

自写短文。book.json 格式、页面类型与版本支持以 [Patchouli 官方文档](https://vazkiimods.github.io/Patchouli/) 与 [GitHub](https://github.com/VazkiiMods/Patchouli) Releases 为准。

## 何时用 / 何时不用

用：需要游戏内指南书（分类 + 条目 + 多语言），内容以 JSON 数据为主，少写 Java UI。Forge/NeoForge 模组标配（全览报告 §四 Forge 路线）。

不用：

- 只要少量说明 → 原版物品提示文本（tooltip）或进度就够了
- 需要完全自定义交互/搜索体验 → 自研 GUI（见 `authored/menu-screen-sync`）
- 目标 MC 版本没有 Patchouli 构建（以 Releases 为准；26.1 目前为 beta `release-26.1-94-beta`）

加载器事实（从官方 README 核对，重要）：

- 1.18 起 Fabric 与 Forge 同仓库维护（Fabric 构建为 patchouli-fabric）
- **1.21.1 起弃 MinecraftForge、转向 NeoForge**；1.20.6 及以前才出 Forge 版

## Decision Flow

```
Decision: 指南书方案
→ 平台 = Forge 且 MC ≤ 1.20.6 → Patchouli Forge 构建
→ 平台 = NeoForge（1.21+）→ Patchouli NeoForge 构建
→ 平台 = Fabric / Quilt → patchouli-fabric 构建
→ 仅少量提示文本 → tooltip / 进度，跳过
→ 已选 Patchouli：
   ├─ book 布局：data/<modid>/patchouli_books/<book_id>/
   ├─ 内容：JSON（categories / entries / pages），默认页面类型够用
   ├─ 解锁：条目解锁与 Advancement 联动（可选，配置以文档为准）
   └─ 自定义页面类型才写 Java（接口/基类以官方为准）
```

## Gradle / 声明文件检查顺序

1. `build.gradle`：官方 README 的 maven（`https://maven.blamejared.com`）与坐标（NeoForge：`vazkii.patchouli:patchouli-neoforge:<version>` 的 `:api` + `runtimeOnly`；Fabric：`vazkii.patchouli:patchouli-fabric:<version>`；**以 README 当前文本为准**）
2. `mods.toml`（26.x 为 `neoforge.mods.toml`）/ `fabric.mod.json`：`depends` 写 patchouli；软依赖见 `authored/soft-deps-modlist`
3. 版本核对：Modrinth 主 slug 为 `patchouli`，Fabric 构建走同一 maven

## 集成要点（伪代码级）

```text
data/<modid>/patchouli_books/<book_id>/
├── book.json          # 书名、作者、图标、语言映射（字段以官方 schema 为准）
├── en_us/
│   ├── en_us.json     # 书名/类别/条目的本地化键
│   ├── categories/    # <cat_id>.json
│   └── entries/       # <entry_id>.json + pages 数组（页面类型如 text / crafting / image，以官方为准）
```

- book.json 与语言目录名必须与 `<book_id>` 一致；多语言（zh_cn 等）按 `en_us` 同构复制
- 条目内容纯 JSON；只有自定义页面类型（需要独特交互/渲染）才写 Java
- book 本体在 `data/`（Patchouli 书是数据包的一部分），纹理/图标资源可放 `assets/<modid>/`

## 常见坑

- book id / 语言文件夹名 / en_us.json 内部键不一致 → 书加载失败或显示空白
- 资源放错位置：book JSON 放 `assets/`（或图标放 `data/`）→ 以文档为准核对
- 条目 JSON 语法错误 → 整本书不加载（用 `validate_datapack_json` 预检）
- 1.21.1+ 项目依赖 Forge 版 Patchouli → 不存在，改用 NeoForge 构建
- 解锁/进度联动写错 advancement id → 条目永远锁死

## 自检清单

- 游戏内 `/patchouli open <modid>:<book_id>` 能打开书
- 控制台无 Patchouli 红字（book 加载错误）
- 每个类别/条目在多语言下均有键，缺键条目显示 id 原文
- 自定义页面类型在服务端无类引用（若纯客户端 UI）
- 卸载 Patchouli（软依赖场景）进档不崩

## 交叉引用

- MCP：`validate_datapack_json`、`audit_resources`、`check_dependencies`
- Skill：`mc-patchouli`、`mc-datapack`；汉化见 `authored/localization-lang`
- 全览：§四 Forge 路线；`authored/library-catalog-2026`、`authored/library-integration`
- 官方：https://github.com/VazkiiMods/Patchouli 、https://vazkiimods.github.io/Patchouli/
- 不清楚时：打开官方文档「Getting Started」与示例书；AGENT_USAGE.md 规则先行
