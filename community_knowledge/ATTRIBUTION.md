# Attribution

## MC百科教程（已获作者许可）

- 标题：如何制作并且维护你的mod？（Forge 版，1.18.X–1.20.X）
- 作者：耿悠博
- 原文：https://www.mcmod.cn/post/3993.html
- 许可说明：作者在评论区（约 51 楼）回复「随意吧」，允许本仓库收录提炼内容用于 MCP / 知识库。
- 注意：教程主体偏 **1.18.X**；查当前版本 API 仍以官方文档与 `search_*_docs` 为准。

提炼页位于 `permitted/mcmod-3993-forge-mod-guide/`。

## Kaupenjoe 教程仓库（MIT 许可）

- 作者：Nico Kaupenjoe（Tutorials-By-Kaupenjoe / kaupenjoe）
- 许可：仓库代码 MIT（各仓库含 LICENSE），配套 YouTube 课程。
- 总索引：`links/kaupenjoe-courses-index.md`（覆盖 NeoForge/Fabric/Forge × 1.16–1.21.x 与 26.X 全部课程仓库）。
- 已核对并提炼的分支：
  - https://github.com/Tutorials-By-Kaupenjoe/NeoForge-Tutorial-1.21.X （分支 `34-oreGen`、`39-customMob`）→ `authored/ore-generation-worldgen`、`authored/custom-mob-entity-pipeline`
  - https://github.com/kaupenjoe/Forge-Course-1.20.X （分支 `33-commands`）→ `authored/custom-commands-brigadier`
  - https://github.com/Tutorials-By-Kaupenjoe/NeoForge-Course-26.X （分支 `30-networking-c2s`、`31-data-attachment`、`62-fluids`、`59-enchantments`、`35-global-loot-modifiers`、`77-mob`、`74-jigsaw-structures`/`75-dimensions`、`75-dimensions`/`76-biomes`）→ `authored/neoforge-payload-networking`、`authored/data-attachments-vs-alternatives`、`authored/custom-fluid-neoforge`、`authored/enchantments-datadriven-121`、`authored/global-loot-modifiers`、`authored/custom-mob-entity-pipeline`、`authored/jigsaw-structure-generation`、`authored/custom-dimension-and-biomes`
- 注意：教程代码按其录制版本写（NeoForge 1.21.x / Forge 1.20.1 / NeoForge 26.X）；跨版本使用仍以本档规则与 `search_*_docs` 为准。

## Fabric Wiki / FabricMC 文档

- Fabric Wiki（社区维护，CC BY-NC-SA 类许可，页面各异）→ **仅外链**：`links/fabric-wiki-tutorial-index.md`
- docs.fabricmc.net 官方文档 → 已核对原文用于提炼：`authored/fabric-saveddata-persistent-state`、`authored/fabric-commands-and-oregen`（saved-data / commands/basics / data-generation/features 三页）
- Mixin 系列导论页已核对原文 → `authored/mixin-practices-crossplatform`

## Microsoft Learn 基岩创作者文档

- 《Introduction to Scripting》等页已入库本地 `data/bedrock_stable`；提炼为 `authored/bedrock-script-api-primer`
- 官方样例仓库 microsoft/minecraft-samples → 仅外链：`links/bedrock-script-api-official-samples.md`

## McJty 指南站

- https://mcjty.eu/ 未逐页核实、未入库正文 → 仅外链：`links/mcjty-modding-guide.md`

## 仅外链（禁止转载 / 未授权）

| 条目 | 说明 |
|------|------|
| https://www.mcmod.cn/post/6071.html | Kadar_Visico《工程化 Forge 开发指南》（1.20.1）。文首禁止转载 → 仅 `links/mcmod-6071-forge-engineering.md`；增量实务见 `authored/` 自写短文，不收录原文。 |
| https://www.mcmod.cn/post/3282.html | 《用Java代码开发匠魂3附属模组》（Forge 1.18.2）。作者设定未经允许禁止转载 → 仅 `links/mcmod-dev-tutorials.md` 收录指针（2026-08-23 核实）。 |
| https://www.mcmod.cn/post/3160.html | 《KubeJS6 面向新手的配方魔改教程》（KubeJS 6 / MC 1.19.2–1.21.1）。页面未见显式声明，按站点默认 BY-NC-SA 3.0 处理；保守仅收指针 → `links/mcmod-dev-tutorials.md`。 |
| 3340 / 5442 / 2306 / 3603 / 3887 / 4987 / 4880 / 2500 | 《MixinBooter 的简单使用》《起源开发文档翻译·数据表指南》《CraftTweaker 和 KubeJs 配方修改》《战利品表数据包制作》《KubeJS 开发的奇巧方法》《NeoForge 前置 Json 动画实例》《站内收录模组加载器汇总》《Fabric 模组开发入门（过时）》。除 3340/5442/2306/3603/3887 为**显式 BY-NC-SA**、4987 为**未声明**（与 `links/mcmod-dev-tutorials.md` 一致）、4880/2500 按站点默认 BY-NC-SA 外无特殊声明；全部仅以指针形式收录于 `links/mcmod-dev-tutorials.md`（2026-08-23 逐篇核实，另附约 20 篇未逐篇核实的同主题帖 id 清单）。 |
