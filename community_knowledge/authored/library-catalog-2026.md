---
id: authored/library-catalog-2026
title: 库模组总目录（2026 版）
tags: [library-catalog, cloth-config, yacl, fabric-language-kotlin, architectury, geckolib, collective, puzzles-lib, text-placeholder-api, balm, owo-lib, bookshelf, terrablender, curios, trinkets, cardinal-components, kubejs, jei, emi]
summary: 社区常用库模组总目录与分类导航：Top 12、十大功能分类、作者全家桶共享库、平台推荐路线与八条陷阱，数据源自《Minecraft 社区常用库模组全览（2026 版）》。
sourceKind: authored
modIds: []
loaders: [fabric, forge, neoforge]
modrinthSlug: ""
role: api
skillId: mc-lib-catalog
---

# 库模组总目录（2026 版）

自写短文，数据全部来自《Minecraft 社区常用库模组全览（2026 版）》（仓库根目录同名文件）。库名、下载量、版本窗口与原报告逐字一致；具体 API 用法仍以各库官方文档为准。

## 何时用

查"某个库模组是什么 / 选哪个 / 有没有替代"时。本目录负责指路，每篇 `lib-*` 短文负责单个库的接入要点。

## 收录范围

- 数据口径：下载量为 **Modrinth 单平台累计下载**（CurseForge 数字通常更大，另行标注）；支持版本为该项目发布过的所有 MC 版本（含 2026 年 26.1/26.2 新版号）。加载器：Fabric / Forge / NeoForge / Quilt。
- 内容：真正意义上的"通用库" Top 12（按 Modrinth 下载量排序，排除纯作者个人库）、按功能分类详解（配置 / 动画 / 跨加载器 / 饰品 / 世界生成 / GUI / 数据附加 / 服务端·网络·文本 / 配方 / 脚本）、作者"全家桶"式共享库、平台推荐路线、八条陷阱。
- 下文中 `lib-xxx.md` 为相对路径链接：已建成的可直接读，未建成的（如 `lib-yacl`）先作占位，后续批次补齐。

## 一、通用库 Top 12（按 Modrinth 下载量）

| 排名 | 库（链接） | 下载量 | 核心用途 |
|---|---|---|---|
| 1 | Cloth Config API（[lib-cloth-config.md](lib-cloth-config.md)） | 1.53 亿 | 配置界面 API |
| 2 | YACL（[lib-yacl.md](lib-yacl.md)） | 1.11 亿 | 新一代配置库 |
| 3 | Fabric Language Kotlin（[lib-fabric-language-kotlin.md](lib-fabric-language-kotlin.md)） | 1.07 亿 | Kotlin 语言支持 |
| 4 | Architectury API（[lib-architectury.md](lib-architectury.md)） | 9170 万 | 跨加载器抽象 |
| 5 | GeckoLib（[lib-geckolib.md](lib-geckolib.md)） | 6270 万 | 3D 实体动画引擎 |
| 6 | Collective（[lib-collective.md](lib-collective.md)） | 5980 万 | Serilum 全家桶共享库 |
| 7 | Puzzles Lib（[lib-puzzles-lib.md](lib-puzzles-lib.md)） | 5630 万 | Fuzs 全家桶共享库 |
| 8 | Text Placeholder API（[lib-text-placeholder-api.md](lib-text-placeholder-api.md)） | 5670 万 | 占位符解析 |
| 9 | Balm（[lib-balm.md](lib-balm.md)） | 5420 万 | Blay 跨平台抽象 |
| 10 | owo-lib（[lib-owo-lib.md](lib-owo-lib.md)） | 4380 万 | GUI/配置/网络全能库 |
| 11 | Bookshelf (Darkhax)（[lib-bookshelf.md](lib-bookshelf.md)） | 4230 万 | Darkhax 通用工具库 |
| 12 | TerraBlender（[lib-terra-blender.md](lib-terra-blender.md)） | 3610 万 | 生物群系 API |

## 二、按功能分类导航

### 1. 配置库（Config）

| 库（链接） | 下载 | 加载器 / 版本 | 特点 |
|---|---|---|---|
| Cloth Config API（[lib-cloth-config.md](lib-cloth-config.md)） | 1.53 亿 | F/Forge/Neo，1.14–26.2 | 老牌配置 GUI，ConfigBuilder 生成界面 |
| YACL（[lib-yacl.md](lib-yacl.md)） | 1.11 亿（官网全平台 1.77 亿） | F/Forge/Neo/Quilt，1.19–26.3 | Builder 式、GUI 契合原版风格，因 Cloth 停更而生 |
| Fzzy Config（[lib-fzzy-config.md](lib-fzzy-config.md)） | 3420 万（2024-04 发布，增速极快） | F/Forge/Neo/Quilt，1.20.1–26.2 | 自动 GUI、强校验、服务端-客户端同步 |
| owo-config（owo-lib 内）（[lib-owo-lib.md](lib-owo-lib.md)） | 见 owo-lib | F/Neo/Quilt，1.17–26.1.2 | 注解式配置 + 自动 GUI + 配置同步 |
| MidnightLib（[lib-midnightlib.md](lib-midnightlib.md)） | 2510 万 | F/Forge/Neo/Quilt，1.17–26.2 | 轻量配置，鼓励 Jar-in-Jar 打包 |
| Forge Config API Port（[lib-forge-config-api-port.md](lib-forge-config-api-port.md)） | — | Fabric 为主 | 把 Forge 配置系统搬到 Fabric |

历史配置库（少用）：Auto Config / Fiber / Omega Config / Oro Config / Tweed / Simple Config，见 Fabric Wiki 中文社区库列表。

### 2. 动画库

| 库（链接） | 下载 | 加载器 / 版本 | 特点 |
|---|---|---|---|
| GeckoLib（[lib-geckolib.md](lib-geckolib.md)） | 6270 万（CF 3.87 亿） | F/Forge/Neo/Quilt，1.12.2–26.2 | 3D 骨骼动画引擎，30+ 缓动、并发动画、声音/粒子/事件关键帧，配合 Blockbench；客户端必需、服务端可选 |
| playerAnimator（[lib-player-animator.md](lib-player-animator.md)） | 2480 万 | F/Forge/Neo/Quilt，1.16.4–1.21.7 | 第一人称/第三人称玩家关键帧动画，配套 bendy-lib 弯曲增强 |
| Satin API（[lib-satin-api.md](lib-satin-api.md)） | 170 万 | Fabric，1.18–1.21.4 | 后期处理着色器包装 |

### 3. 跨加载器抽象层（Multi-loader）

| 库（链接） | 下载 | 加载器 / 版本 | 特点 |
|---|---|---|---|
| Architectury API（[lib-architectury.md](lib-architectury.md)） | 9170 万 | F/Forge/Neo/Quilt，1.16.5–26.2 | 90+ 事件钩子、网络/注册抽象、@ExpectPlatform，配合 Architectury Loom/Plugin 一码多端 |
| Balm（[lib-balm.md](lib-balm.md)） | 5420 万 | F/Forge/Neo，1.18–26.2 | Blay 的抽象层，零第三方依赖 |
| Resourceful Lib（[lib-resourceful-lib.md](lib-resourceful-lib.md)） | 3220 万 | F/Forge/Neo，1.19.2–26.2 | 跨平台网络、codec 工具、内存资源包、Highlight API |
| Moonlight Lib（原 Selene）（[lib-moonlight-lib.md](lib-moonlight-lib.md)） | 3690 万（CF 2.33 亿） | F/Forge/Neo，1.16.5–1.21.1 | 动态资源/注册、BlockSetAPI、村民 AI、流体系统 |

### 4. 饰品 / 装备槽

| 库（链接） | 下载 | 加载器 / 版本 | 特点 |
|---|---|---|---|
| Curios API（[lib-curios.md](lib-curios.md)） | 2850 万 | F/Forge/Neo，1.13.2–26.2 | Forge 系饰品槽标准，tag 驱动扩展槽位，自带 GUI |
| Trinkets（[lib-trinkets.md](lib-trinkets.md)） | 2260 万 | F/Quilt，1.17–1.21.1（已停更） | Fabric 系饰品槽（6 组槽位），数据驱动 |
| Caelus API（[lib-caelus-api.md](lib-caelus-api.md)） | 690 万 | F/Forge/Neo，1.13.2–1.21.5 | 将鞘翅飞行抽象为实体属性，自定义飞行能力 |

### 5. 世界生成

| 库（链接） | 下载 | 加载器 / 版本 | 特点 |
|---|---|---|---|
| TerraBlender（[lib-terra-blender.md](lib-terra-blender.md)） | 3610 万 | F/Forge/Neo/Quilt，1.18.1–26.2 | region 机制兼容式添加生物群系，1.18+ 地形系统的标准方案 |

### 6. GUI / UI 库

| 库（链接） | 下载 | 加载器 / 版本 | 特点 |
|---|---|---|---|
| owo-lib（[lib-owo-lib.md](lib-owo-lib.md)） | 4380 万 | F/Neo/Quilt，1.17–26.1.2 | owo-ui 声明式 GUI、owo-config、网络层、自动注册（⚠️ 不支持 Forge） |
| LibGui（[lib-libgui.md](lib-libgui.md)） | — | Fabric（GitHub 活跃至 26.2） | 老牌声明式 GUI 库；Modrinth 已下架(404)，走 Cotton maven + Jar-in-Jar 分发 |
| SpruceUI / ObsidianUI（[lib-spruceui.md](lib-spruceui.md)） | 245 万 | 1.16.4–1.21.5 | GUI 抽象库；原版已下架，ObsidianUI 是 Architectury 移植 |
| Modern UI（[lib-modern-ui.md](lib-modern-ui.md)） | — | F/Forge/Neo | 现代文本排版引擎（中文/Unicode 渲染友好）+ GUI API，中文模组圈使用率高 |

### 7. 数据附加（Data Attachment）

| 库（链接） | 下载 | 加载器 / 版本 | 特点 |
|---|---|---|---|
| Cardinal Components API (CCA)（[lib-cardinal-components.md](lib-cardinal-components.md)） | 1420 万 | F/Quilt，1.18–26.2 | 给实体/方块/区块/世界挂数据的标准方案，ASM 生成扩展 |
| PlayerAbilityLib (PAL)（[lib-player-ability-lib.md](lib-player-ability-lib.md)） | 42 万 | F/Quilt 服务端，1.20–26.1 | 玩家能力（飞行/缩放）兼容性修正 |

生态位变化：1.20.5+ 原版自带 Data Component/Attachment 后，部分新模组直接用原版机制，不再依赖 CCA。

### 8. 服务端 / 网络 / 文本

| 库（链接） | 下载 | 加载器 / 版本 | 特点 |
|---|---|---|---|
| Polymer（[lib-polymer.md](lib-polymer.md)） | 356 万 | F/Quilt，1.18–26.2 | 纯服务端生成内容，原版客户端免装模组可见，含 AutoHost |
| Text Placeholder API（[lib-text-placeholder-api.md](lib-text-placeholder-api.md)） | 5670 万 | F/Quilt，1.17–26.2 | 占位符解析 %modid:type% + Simplified Text Format |
| Server Translations API（[lib-server-translations-api.md](lib-server-translations-api.md)） | — | F/Forge/Neo | 服务端按玩家语言渲染可翻译文本；原 Modrinth 已下架，走 maven.nucleoid.xyz；替代品 Server I18n API |
| Impersonate（[lib-impersonate.md](lib-impersonate.md)） | 5.1 万 | F/Quilt 服务端，1.16.3–1.21.11 | 玩家伪装 API（换皮肤/名牌/身份），基于 CCA |
| Pehkui（[lib-pehkui.md](lib-pehkui.md)） | 920 万 | F/Forge/Neo/Quilt，1.14.4–1.21.1 | 实体缩放 API，20+ 缩放类型带平滑过渡 |

### 9. 配方查看器兼 API（JEI / EMI / REI）

| 库（链接） | 下载 | 加载器 / 版本 | 特点 |
|---|---|---|---|
| JEI（[lib-jei.md](lib-jei.md)） | 6900 万 | F/Forge/Neo，1.8–26.2 | 最老牌，作为"配方显示 API"被最多模组集成（匠魂、Thermal、Create 等无数 JEI 插件）；1.21.2+ 服务端需装以同步配方 |
| EMI（[lib-emi.md](lib-emi.md)） | 2600 万 | F/Forge/Neo/Quilt，1.18.2–1.21.1 | 零依赖、API 现代、支持运行时 JEI 兼容；1.21+ 才活跃，1.20.4 以下冻结 |
| REI（[lib-rei.md](lib-rei.md)） | 2420 万 | F/Forge/Neo/Rift，1.13–26.2 | 支持 JEI 插件，可与 JEI 同装 |

建议：新模组集成配方显示优先同时做 JEI + EMI 插件，NeoForge 1.21+ 生态 EMI 渗透率持续上升。

### 10. 脚本 / 工具

| 库（链接） | 下载 | 加载器 / 版本 | 特点 |
|---|---|---|---|
| KubeJS（[lib-kubejs.md](lib-kubejs.md)） | 1900 万 | F/Forge/Neo/Quilt，1.18.2–26.1.2 | JavaScript 脚本引擎：改配方、注册物品方块、改 tag、热重载；几乎所有大型整合包（ATM、E2E）依赖它 + ProbeJS |
| Kotlin for Forge（[lib-kotlin-for-forge.md](lib-kotlin-for-forge.md)） | 4410 万 | Forge/Neo，1.14–26.2 | 让 Forge 模组用 Kotlin 编写（语言加载器 + 标准库/协程） |
| Fabric Language Kotlin（[lib-fabric-language-kotlin.md](lib-fabric-language-kotlin.md)） | 1.07 亿 | Fabric，1.14–26.2 | 同上，Fabric 版 |

## 三、作者"全家桶"式共享库（第三方采用有限，但被整合包大量依赖）

| 库（链接） | 下载 | 服务于 | 代表模组 |
|---|---|---|---|
| Collective（[lib-collective.md](lib-collective.md)） | 5980 万 | Serilum 100+ 模组 | Villager Names、各类 QoL 小模组 |
| Puzzles Lib（[lib-puzzles-lib.md](lib-puzzles-lib.md)） | 5630 万 | Fuzs 全部模组 | Bag of Holding、Tiny Skeletons、Pick Up Notifier、TrashSlot |
| Bookshelf（[lib-bookshelf.md](lib-bookshelf.md)） | 4230 万（CF 3.94 亿） | Darkhax | Enchantment Descriptions、Botany Pots、Tips、Dark Utilities |
| MaLiLib（[lib-malilib.md](lib-malilib.md)） | 3140 万 | masa 全家桶（客户端专用） | Litematica、MiniHUD、Tweakeroo、Item Scroller、TellMe |
| Kiwi（[lib-kiwi.md](lib-kiwi.md)） | 1970 万 | Snownee | Sculk Horde、Smarter Farmers、Frozen Up |
| Sophisticated Core（[lib-sophisticated-core.md](lib-sophisticated-core.md)） | 1630 万 | P3pp3rF1y | Sophisticated Backpacks、Sophisticated Storage |
| CorgiLib（[lib-corgilib.md](lib-corgilib.md)） | 1370 万 | Corgi Taco | 其全部模组 |
| Necronomicon（[lib-necronomicon.md](lib-necronomicon.md)） | 1230 万 | ElocinDev | 其全部模组 |
| LibZ（[lib-libz.md](lib-libz.md)） | 380 万 | Globox | Village Spawn Point 等（仅 Fabric） |
| Mantle（[lib-mantle.md](lib-mantle.md)） | 320 万 | SlimeKnights（Forge 系） | Tinkers' Construct、Natura、Ceramics；1.21+ 无版本 |
| LibX（[lib-libx.md](lib-libx.md)） | 210 万 | noeppi_noeppi | 其全部模组 |
| Placebo（[lib-placebo.md](lib-placebo.md)） | 57 万 | Shadows_of_Fire | Apotheosis（神化）、Zenith |
| Iceberg（[lib-iceberg.md](lib-iceberg.md)） | CF 2.33 亿 | Grend | Visual Workbench 等 |
| GlitchCore（[lib-glitchcore.md](lib-glitchcore.md)） | CF 4.04 亿 | Glitchfiend | Biomes O' Plenty、Serene Seasons、Tough As Nails |
| CreativeCore（[lib-creativecore.md](lib-creativecore.md)） | CF 5.22 亿 | CreativeMD | LittleTiles、AmbientSounds |

## 四、按平台的推荐路线

**做 Fabric 模组时优先考虑**：Fabric API（必备）→ Cloth Config / YACL（配置）→ CCA（数据附加）→ Trinkets 或自研（饰品）→ GeckoLib（动画）→ Architectury（要跨平台时）→ owo-lib（GUI 且接受无 Forge 支持）。

**做 Forge/NeoForge 模组时优先考虑**：GeckoLib（动画）→ Curios（饰品）→ Cloth Config / YACL（配置）→ TerraBlender（群系）→ Patchouli（指南书，[lib-patchouli.md](lib-patchouli.md)）→ JEI/EMI 插件（配方）→ Kotlin for Forge（要用 Kotlin 时）。

**想做一码多端**：Architectury API + Architectury Loom / Plugin，或 Balm（若跟随 Blay 体系）。

## 五、陷阱摘要（详见 lib-traps-2026）

1. **ChocolateCore 不存在**：经 Modrinth/CurseForge 检索确认，社区没有名为 ChocolateCore 的知名库模组（可能混淆了 ApexCore / RadixCore）。
2. **owo-lib 不支持 Forge**：只支持 Fabric / NeoForge / Quilt，纯 Forge 开发者无法使用。
3. **Trinkets 停在 1.21.1**（2024-07 后停更），1.21.4+ 新模组多自研槽位或用原版机制。
4. **Bookshelf 重名**：Modrinth 的 bookshelf 是 Spigot 插件，Darkhax 的库是 bookshelf-lib。
5. **LibGui / Server Translations API / SpruceUI 的 Modrinth 页面均已下架**：LibGui 走 maven + Jar-in-Jar，Server Translations 走 maven.nucleoid.xyz（替代品 Server I18n API），SpruceUI 用 ObsidianUI 延续。
6. **Botarium 已停更**（1.20.4 后无更新），Terrarium 全家桶新模组已转向其他方案。
7. **Cloth Config 已"冷冻"**（作者声明不再加新特性），新模组主流转向 YACL / owo-config / Fzzy Config。
8. **EMI 在 1.21+ 才活跃**；Mantle、Botarium、Caelus 等未跟进 2026 新版号（26.x），选依赖时注意版本匹配。

完整陷阱逐条解析与排查见 [lib-traps-2026.md](lib-traps-2026.md)。

## 不清楚时

- 单个库的接入细节 → 打开对应 `lib-*.md` 短文 + 该库官方文档。
- 数据与原文有出入 → 回看仓库根《Minecraft 社区常用库模组全览（2026 版）》。
- API / 方法名 / 注册细节 → `search_*_docs` / `query_api`，社区短文不能替代 API 查询（见 `community_knowledge/AGENT_USAGE.md`）。
