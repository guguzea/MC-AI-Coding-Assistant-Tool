---
id: authored/lib-traps-2026
title: 库模组陷阱专篇（2026 版）
tags: [traps, library, pitfalls, 2026]
summary: 选库依赖前必读的八条陷阱：ChocolateCore 不存在、owo-lib 无 Forge、Trinkets 上游止于 1.21.1（1.21.4+ 只剩分叉 beta/rc）、Bookshelf 重名、LibGui/Server Translations API/SpruceUI 下架、Botarium 停更、Cloth Config 功能冻结（≠停更）、EMI 活跃窗口与 26.x 未跟进。底稿来自《Minecraft 社区常用库模组全览（2026 版）》第五节（二手），Cloth/YACL/Curios/Trinkets 四项已按 2026-09-02 Modrinth API 实测复核。
mcHint: 1.17–26.x；选库依赖前先过这 8 条
minecraftVersions: 1.17–26.x（各条涉及的窗口见正文）
sourceKind: authored
modIds: []
loaders: [fabric, forge, neoforge]
modrinthSlug: ""
role: trap
---

# 库模组陷阱专篇（2026 版）

自写短文，事实全部来自《Minecraft 社区常用库模组全览（2026 版）》第五节"陷阱提醒"（仓库根目录同名文件），共 8 条，不增删。下载量、版本窗口、停更状态原为该报告**二手口径**；2026-09-02 已对 Cloth / YACL / Curios / Trinkets 四项直连 `api.modrinth.com/v2` 复核（各见对应 `lib-*` 短文里的「分发窗口」表），冲突处以实测为准，本篇已在受影响的两条（陷阱 3、7）里标注。本篇只讲"选不选、去哪拿"，不写死 API 细节，接口用法仍以各库官方文档为准。

> 校对（2026-09-02）：下方交叉引用里标过「规划中」的 `lib-*` 短文现已全部入库，标注已删；查这些库直接读对应短文。

## 何时用

在 `build.gradle` / `mods.toml` / `fabric.mod.json` 里声明库依赖之前，或依赖解析日志里出现可疑库名时。与总目录 [library-catalog-2026.md](library-catalog-2026.md) 搭配：总目录负责指路，本篇负责排雷。

## 陷阱 1：ChocolateCore 不存在

**现象**：资料或旧配置里出现 ChocolateCore 这个库名，去 Modrinth / CurseForge 却搜不到，照抄进依赖直接解析失败。

**正确做法**：经 Modrinth / CurseForge 检索确认，社区没有名为 ChocolateCore 的知名库模组，可能是 ApexCore / RadixCore 的混淆记忆。看到这个名字先停下核实来源，不要照抄。

**交叉引用**：总目录 [library-catalog-2026.md](library-catalog-2026.md) 第三节的"全家桶"共享库名单（Collective、Puzzles Lib、Bookshelf 等），对照确认你要找的到底是哪个。

## 陷阱 2：owo-lib 无纯 Forge 支持

**现象**：Forge 开发者看到 owo-lib 的 GUI / 配置 / 网络全能名头想用，结果依赖解析报错，或移植时发现根本不支持。

**正确做法**：owo-lib 只支持 Fabric / NeoForge / Quilt（版本窗口约 1.17–26.1.2），纯 Forge 项目无法使用。Forge 侧配置屏改选 Cloth Config / YACL / Fzzy Config。

**交叉引用**：[lib-owo.md](lib-owo.md)、[lib-cloth-config.md](lib-cloth-config.md)、[lib-yacl.md](lib-yacl.md)、总目录配置 / GUI 分类。

## 陷阱 3：Trinkets 上游停在 1.21.1（1.21.4+ 只剩分叉 beta/rc）

**现象**：Fabric 模组想加饰品槽，按老习惯引 Trinkets，发现 1.21.1 之后没有对应版本，1.21.4+ / 26.x 无从下手。

**正确做法**：上游 Trinkets 实测（2026-09-02 Modrinth API）22 条构建、末次发布 2024-07-15、game_versions 上界 1.21.1，**1.21.4+ / 26.x 构建 0 条**。1.21.4+ 要么自研槽位 / 用原版机制，要么用分叉 `trinkets-polymer`（实测 1.19–26.2，**全部 beta/rc，无正式版**）—— 那是 Polymer 一方的移植，不是上游复活。不要在新版本上等上游更新。

**交叉引用**：[lib-trinkets.md](lib-trinkets.md)、[lib-curios.md](lib-curios.md)（Forge 系对应物，勿混用）、总目录第四节饰品分类。

## 陷阱 4：Bookshelf 重名

**现象**：在 Modrinth 搜 bookshelf 装到了错误的东西，或声明依赖后与预期行为完全不符。

**正确做法**：Modrinth 上的 `bookshelf` 是 Spigot 插件；Darkhax 的库在 Modrinth 上叫 `bookshelf-lib`。认准 `bookshelf-lib` 和作者 Darkhax，别拿错。

**交叉引用**：[lib-bookshelf.md](lib-bookshelf.md)、总目录第三节（Bookshelf 服务 Darkhax 全家桶，Enchantment Descriptions、Botany Pots 等）。

## 陷阱 5：LibGui / Server Translations API / SpruceUI 已下架

**现象**：访问这三个库的 Modrinth 页面返回 404 / 已下架，旧链接全部失效，照着老教程加依赖失败。

**正确做法**：

- **LibGui**：Fabric 老牌声明式 GUI 库，Modrinth 已下架，走 Cotton maven + Jar-in-Jar 分发（GitHub 侧仍活跃）。
- **Server Translations API**：Modrinth 已下架，走 maven.nucleoid.xyz；替代品是 Server I18n API。
- **SpruceUI**：原版已下架，用 ObsidianUI 延续（ObsidianUI 是 Architectury 移植）。

**交叉引用**：[lib-libgui.md](lib-libgui.md)、[lib-spruceui-obsidianui.md](lib-spruceui-obsidianui.md)、[lib-server-translations.md](lib-server-translations.md)、总目录 GUI 分类。

## 陷阱 6：Botarium 停更

**现象**：想在新版本项目里给 Terrarium 全家桶的模组做依赖或移植，Botarium 没有对应版本。

**正确做法**：Botarium 已停更，1.20.4 后无更新，Terrarium 全家桶新模组已转向其他方案，新项目不要再依赖它。需要跨加载器抽象时按总目录的抽象层分类选型（如 Architectury API、Balm）。

**交叉引用**：[lib-architectury.md](lib-architectury.md)、[lib-balm.md](lib-balm.md)、总目录第三节跨加载器抽象层。

## 陷阱 7：Cloth Config 功能冻结（≠ 停更）

**现象**：新模组照惯例用 Cloth Config 的 ConfigBuilder 做配置屏，却被告知这个库不再加新特性；或反过来听说"冷冻"就以为拿不到本版构建。

**正确做法**：Cloth Config 是**功能冻结**——作者声明不再加新特性（二手，报告口径），实测仍在按 MC 版本线发版（Modrinth API 2026-09-02：158 条构建、末次 2026-06-18 = `v26.2.155`）。所以"能不能装到本版"不是问题，"要不要把新特性押在它身上"才是。新模组主流转向 YACL / owo-config / Fzzy Config。

**交叉引用**：[lib-cloth-config.md](lib-cloth-config.md)、[lib-yacl.md](lib-yacl.md)、[lib-owo.md](lib-owo.md)、总目录配置分类。

## 陷阱 8：EMI 活跃窗口与 26.x 未跟进清单

**现象**：在 1.20.4 以下老版本引 EMI 当配方 API 发现停更；或在 26.x 项目里引 Mantle / Botarium / Caelus，找不到对应版本。

**正确做法**：EMI 在 1.21+ 才活跃，1.20.4 以下冻结，老版本要配方显示 API 用 JEI / REI；Mantle、Botarium、Caelus 等未跟进 2026 新版号（26.x），在 26.x 项目里引用前必须核对版本匹配。新模组配方显示优先同时做 JEI + EMI 插件。

**交叉引用**：[lib-mantle.md](lib-mantle.md)、[lib-caelus.md](lib-caelus.md)、[library-integration-jei-emi.md](library-integration-jei-emi.md)、总目录配方分类。

## 选依赖前自检清单

- [ ] ChocolateCore / ApexCore / RadixCore 这类名字：先在 Modrinth / CurseForge 检索确认真的存在
- [ ] owo-lib：纯 Forge 项目直接排除，改选 Cloth / YACL / Fzzy
- [ ] Trinkets：目标版本高于 1.21.1 时不要引**上游**（实测 1.21.4+ 上游 0 条）；要现成饰品栏只剩分叉 `trinkets-polymer`（beta/rc）或自研
- [ ] Bookshelf：确认拿到的是 Darkhax 的 `bookshelf-lib`，不是 Spigot 插件的 `bookshelf`
- [ ] LibGui / Server Translations API / SpruceUI：Modrinth 已下架，按替代路径取件（Cotton maven + JiJ / maven.nucleoid.xyz + Server I18n API / ObsidianUI）
- [ ] Botarium：1.20.4 之后无版本，新项目不要依赖
- [ ] Cloth Config：能用（实测 26.x 仍有构建），但功能冻结，新项目考虑 YACL / owo-config / Fzzy Config
- [ ] EMI / Mantle / Botarium / Caelus：核对目标 MC 版本窗口（EMI 1.21+ 才活跃；后三者未跟进 26.x）

## 不清楚时

- 每条陷阱对应的 `lib-*` 短文（现已全部入库，直接跳转；不再有占位）
- 版本窗口、停更状态：Cloth / YACL / Curios / Trinkets 四项先看各篇「分发窗口」实测表（必要时重跑一次 Modrinth API 翻页），其余回《全览 2026》+ Modrinth / CurseForge 页面并标注二手；不要凭记忆写依赖坐标；API 细节走官方文档，见 [AGENT_USAGE.md](../AGENT_USAGE.md)

## 核对（2026-08 反编译验证）

- ⚠️ 未反编译核对（陷阱类短文，无反编译核对）；细节以官方文档为准。
- 2026-09-02 直连 `api.modrinth.com/v2` 复核过陷阱 3 / 7 涉及的 Cloth、YACL、Curios、Trinkets 四项版本窗口与发版状态（逐条数值见各篇「分发窗口」表）。其余陷阱本次未实测，仍为报告二手口径（陷阱 5 的下架判定早前已有 slug 检索核实记录，本篇未重测）。
