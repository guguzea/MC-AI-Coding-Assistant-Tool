---
id: links/mcmod-dev-tutorials
title: MC百科开发类教程指针（社区+个人双区全量扫描精选）
url: https://www.mcmod.cn/post/3282.html
summary: mcmod.cn 教程区开发类中文教程全集（社区53页+个人271页全量扫描，约6500标题）：Java模组/附属开发、Mixin/AT/Coremod/Cleanroom、Fabric系列、帕秋莉手册、数据组件与资产、KubeJS·CrT·GroovyScript脚本生态、加载器名录。许可逐篇核实，禁转载仅外链。
tags: [index, mcmod, chinese, forge, neoforge, fabric, kubejs, crafttweaker, mixin, datapack, obj, ctm, addon, loaders, link-only]
sourceKind: links
mcHint: 见各条；跨度 1.7.10–26.x，引用前先对版本
---

# MC百科开发类教程指针

> 2026-08-23/24 经浏览器逐篇核实（**社区教程 53 页 + 个人教程 271 页正文级全量读取完成**：社区 1056/1056、个人 5411 篇全部打开正文；入表者另核声明协议）。找开发教程别翻列表页，直接查这里。

## Java 模组 / 附属开发

| 帖子 | 范围 | 协议 | 备注 |
|------|------|------|------|
| [用Java代码开发匠魂3附属模组](https://www.mcmod.cn/post/3282.html) | Forge 1.18.2 + TiC3 全流程 | ❌ 禁转载 | 已提炼 `authored/addon-dev-workflow` |
| [匠魂3附属开发进阶](https://www.mcmod.cn/post/4413.html) | TiC3 附属进阶（配3282） | 显式 BY-NC-SA | 中文 TiC 社区活跃 |
| [如何试着去制作一个CEu的附属模组](https://www.mcmod.cn/post/3414.html) | GTCEu 附属开发（正文声明 CC BY-NC-ND，禁止演绎） | 显式 BY-NC-ND | GT 方向附属实例 |
| [【开发向】Curios API 添加饰品](https://www.mcmod.cn/post/3102.html) | Forge 例：饰品栏 API 接入 | 显式 BY-NC-SA | 配 `lib-curios` |
| [1.18模组开发](https://www.mcmod.cn/post/3853.html) 系列 | IDEA 向 1.18 开发；同作者续篇 [AT访问转换器](https://www.mcmod.cn/post/3921.html)、[ModuleManager与配置](https://www.mcmod.cn/post/3864.html) | 3853 显式 BY-NC-SA（续篇未核） | AT 是进阶必读 |
| [1.18模组制作之Mixin的使用](https://www.mcmod.cn/post/3979.html) | 1.18 Mixin 实战 | 显式 BY-NC-SA | 配 `authored/mixin-practices-crossplatform` |
| [Neoforge 1.21.4 详细教程](https://www.mcmod.cn/post/4971.html) | NeoForge 1.21.4 入门（需 Java 基础） | ❌ 禁转载 | 最新版入门 |
| [Forge Mod制作入门完整教程（极简版）](https://www.mcmod.cn/post/6383.html) | 主流 1.x 从零到第一个 Mod，环境搭建避坑 | 显式 BY-NC-SA | 新手首推 |
| [全民写端01：构建运行与简易功能模块](https://www.mcmod.cn/post/4725.html) | IDEA Minecraft Development 插件生成 **1.21 NeoForge** 项目并实现功能模块（系列首篇） | 显式 BY-NC-SA | 抽样审计发现的新宝石 |
| [Fabric Mod开发教程-01 环境](https://www.mcmod.cn/post/3211.html) | Fabric 系列入门；02 创世之力 ❌禁转载 | 01 显式 BY-NC-SA | Fabric 侧成体系 |
| [基于Cleanroom开发模组（实验）](https://www.mcmod.cn/post/3978.html) ＋ [新人如何用Cleanroom现代化开发](https://www.mcmod.cn/post/5838.html) | **1.7.10 分支 Cleanroom 上的真开发** | 显式 BY-NC-SA | 老版开发独苗，配 `links/legacy-loader-upstreams` |
| [在2025年怎么编写一个Forge Coremod？](https://www.mcmod.cn/post/4861.html) | Coremod/ASMTransformer 编写 | 显式 BY-NC-SA | 高级：字节码改造 |
| [如何搭建带mixin的1.12.2Forge开发环境并为匠魂2编写模组](https://www.mcmod.cn/post/3313.html) | 1.12.2 开发环境 + TiC2 实战 | ❌ 禁转载 | 老版开发环境 |
| [匠魂2源码分析的补充](https://www.mcmod.cn/post/1990.html) | 读宿主源码实践（不适合新手） | 显式 BY-NC-SA | 「读源码写附属」示范 |
| [Ponder——为你的模组添加思索引导](https://www.mcmod.cn/post/5404.html) | 给自己的 mod 加 Create 式 Ponder 引导 | 显式 BY-NC-SA | 文档化体验 |
| [正确修改模组支持版本/加载器/依赖元数据](https://www.mcmod.cn/post/5173.html) | mods.toml/fabric.mod.json 版本互通与依赖调整 | 显式 BY-NC-SA | 维护向干货 |
| [FML 加载模组过程](https://www.mcmod.cn/post/2338.html) | ModLauncher/ASM 加载链路原理 | 默认 BY-NC-SA | 原理视角 |
| [浅谈 Forge 的事件系统和使用](https://www.mcmod.cn/post/2571.html) | Forge 事件系统机制与订阅实战（需 Java 基础）——正文级扫描发现的漏网宝石，标题完全隐蔽 | ⚠️ 未声明（2026-08-24 复核列表行与帖页均无协议声明，此前误记显式 BY-NC-SA） | 已提炼 `authored/forge-event-system-practices`（自写综述，未复制原文表达） |
| [如何在 NeoForge 开发中接入 PlayerAnimator 前置](https://www.mcmod.cn/post/4987.html) | build.gradle 加 KosmX maven + 依赖（NeoForge 1.21.4/1.21.5 实测版本表） | 默认（未声明） | 动画库前置接入示例 |
| [匠魂2、3主要差异参考](https://www.mcmod.cn/post/2012.html) | TiC2→TiC3 迁移：工具类型增删/材料体系变化（配 6123） | 默认（未声明） | 版本迁移知识 |
| [1.12.2 一些可用的 WorldProvider](https://www.mcmod.cn/post/1347.html) | 老版自定义维度 provider 清单：原版/JED/BOP 各世界提供者 | 默认（未声明） | 配 `authored/custom-dimension-and-biomes` 老版侧 |
| [GT魔改入门作者必读（两期）](https://www.mcmod.cn/post/2427.html)＋[第二期](https://www.mcmod.cn/post/2430.html) | GTCE/CEu 的 CrT 魔改：RecipeMap 写法与原版写法差异（源自 CrT 官方 wiki） | 显式 BY-NC-ND | GT 生态脚本化魔改入门 |
| [如何使用 YACL 为 Fabric 模组添加配置](https://www.mcmod.cn/post/3836.html) | YACL（YetAnotherConfigLib）开发向接入 ★个人区全量扫描找回的真身（此前误记 4386，实为 CFB 任务帖） | ❌ 禁转载 | 配 `lib-catalog` Fabric 配置库 |
| [简单易懂的 AccessTransformer 使用方法](https://www.mcmod.cn/post/4679.html) | AT 声明与使用（配 3921 同作者系列） | 默认（未声明） | 进阶：字段/方法访问放宽 |
| [!MixinBooter 使用方法（面向开发者）](https://www.mcmod.cn/post/3142.html) | 老 Forge(1.8–1.12.2) Mixin 开发启用（配 3340 玩家向） | 默认（未声明） | 配 `authored/mixin-practices-crossplatform` 启用方式表 |

## 数据驱动 / 资产开发

| 帖子 | 范围 | 协议 |
|------|------|------|
| [开发自己的数据包！](https://www.mcmod.cn/post/3014.html) | 数据包开发入门 | 显式 BY-NC-SA |
| [Fabric 与 Forge 的游戏内数据包命名与作用](https://www.mcmod.cn/post/4045.html) | 双平台数据包目录差异 ★跨平台 | 显式 BY-NC-SA |
| [战利品表数据包制作](https://www.mcmod.cn/post/3603.html) | loot table 数据包 | 显式 BY-NC-SA |
| [资源包元数据 pack.mcmeta 详细写法](https://www.mcmod.cn/post/6251.html) | 资产元数据 | 显式 BY-NC-SA |
| [OBJ 模型文件制作](https://www.mcmod.cn/post/3814.html) ＋ [OBJ 常见问题解答](https://www.mcmod.cn/post/4163.html) | Blender/Blockbench 出 OBJ、资源包 JSON 引用与排错 | 显式 BY-NC-SA |
| [Athena 连接纹理创作教程](https://www.mcmod.cn/post/6141.html) | CTM 连接纹理绘制 | 显式 BY-NC-SA |
| [自定义模型完整指南](https://www.mcmod.cn/post/2955.html) | 模型开发综合 | 默认 BY-NC-SA |
| [多版本可翻译文本的实现（从简单到硬编码汉化）](https://www.mcmod.cn/post/5167.html) | 本地化实现谱系 | 显式 BY-NC-SA |
| [In Control wiki 搬运（译）](https://www.mcmod.cn/post/2049.html) | spawner/spawn.json 生成控制（新增≠限制） | 默认 BY-NC-SA |
| [IC2C 自定义合成表（官方文档译）](https://www.mcmod.cn/post/1863.html) | customCraftingRecipes.json 数据驱动配方 | 默认 BY-NC-SA |
| [挖矿与砍杀 数据包及资源包制作](https://www.mcmod.cn/post/4155.html) | 新武器类型+自制技能（单模组但方法论通用） | 显式 BY-NC-SA |
| [群系删除或替换](https://www.mcmod.cn/post/3846.html) | 解压 Terralith 等数据包编辑 `dimension/overworld.json` 移除群系（非官方支持但可行） | 默认 BY-NC-SA |
| [TC6 自定义研究](https://www.mcmod.cn/post/549.html) | 神秘时代6 研究数据 JSON 结构（entries/key 等字段写法） | 默认 BY-NC-SA |
| [自定义采矿维度的世界类型](https://www.mcmod.cn/post/1560.html) | 数据包创建自定义世界类型/采矿维度 | 默认 BY-NC-SA |

### 仅外链（禁转载，但内容值得知道存在）

[1.21x 数据组件改堆叠数](https://www.mcmod.cn/post/4654.html) · [数据包改原版矿物生成高度/数量](https://www.mcmod.cn/post/5498.html) · [矿物词典已经"死"了（oredict→tags 迁移）](https://www.mcmod.cn/post/1793.html) · [匠魂3 数据包添加自定义材料](https://www.mcmod.cn/post/1776.html)（仅适用旧版 TiC3）· [批量创建护甲/工具并改属性](https://www.mcmod.cn/post/5636.html) · [反射注册 MEK 物品/流体](https://www.mcmod.cn/post/4565.html) · [NeoForge1.21.4 详细教程](https://www.mcmod.cn/post/4971.html) · [自定义配方类型的 JEI 兼容（持续更新）](https://www.mcmod.cn/post/5531.html) · [带mixin的1.12.2环境+匠魂2](https://www.mcmod.cn/post/3313.html) · [GeckoLib geo 模型导入及偏移排障](https://www.mcmod.cn/post/2622.html)（Blockbench 导出 .geo/贴图/动画与渲染偏移） · [资源包制作教程#1 方块与物品篇](https://www.mcmod.cn/post/4511.html)（1.20.1，纹理/模型/翻译上手） · [仔细搜刮资源包制作指南](https://www.mcmod.cn/post/5987.html) · [匠魂纹理生成器指南](https://www.mcmod.cn/post/4934.html)

## 整合包脚本（KubeJS / CraftTweaker / GroovyScript）

| 帖子 | 范围 | 协议 |
|------|------|------|
| [KubeJS6 面向新手的配方魔改教程](https://www.mcmod.cn/post/3160.html) | KubeJS 6 入门 | 默认 BY-NC-SA |
| [new与函数与类型——KubeJS开发的奇巧方法](https://www.mcmod.cn/post/3887.html) | KubeJS 进阶 | 显式 BY-NC-SA |
| [CraftTweaker和KubeJs配方修改](https://www.mcmod.cn/post/2306.html) | 双体系对照 | 显式 BY-NC-SA |
| [从〇开始的编程逻辑](https://www.mcmod.cn/post/2561.html) | CrT 语境编程入门 | 显式 BY-NC-SA |
| [反射在KubeJS中的用法](https://www.mcmod.cn/post/4093.html) ★ | 反射突破脚本边界 | 显式 BY-NC-SA |
| [ProbeJS 插件及 VSC 实用技巧](https://www.mcmod.cn/post/5939.html) ★ | KubeJS 自动补全工具链 | 显式 BY-NC-SA |
| [KubeJS Wiki 1.21.1 中文翻译（持续更新）](https://www.mcmod.cn/post/6142.html) | 官方 wiki 翻译 | 显式 BY-NC-SA |

### 脚本速查（标题定位明确，未逐篇核正文）

**CrT 系**：3023 1.18+入门 · 3391 最全基础合集 · 503 CT-HELP基础合成 · 532/536/843 CT-HELP扩展/矿辞/高级魔改 · 3924 新版CrT基础(1.20.1) · 3191/4774 从入门到精通(1)(2)-CoT篇 · 3181 事件教学 · 1708 配方函数 · 1701 改几乎所有模组特性 · 3792 跨版本原版配方 · 1956 游戏阶段控制 · 1957 JEI描述 · 2018 游戏事件操作 · 2025 禁用作弊 · 2165 Zen术语解析 · 3307 ZenTraits · 4967 ZU ZenClass继承原生类型★ · 4494 ZU魔改EIO · 4746 zu为无CrT支持的mod增删配方 · 1888 合成表修改基础 · 6093 铁砧配方增删 · 4736 世界合成 · 5103 LootTweaker入门 · 1327 RecipeStages wiki译 · 1015/2257 GameStages介绍/附属 · 1938 GameStages使用 · 3272 [1.7.10]backport模组(Et Futurum Requiem等)CrT魔改
**KubeJS 系**：2294 综合魔改(1.16.5) · 4077 TypeScript写KubeJS · 3418 JS快速入门 · 5939 ProbeJS(已升正式行) · 2023 游戏事件 · 3719 注册按键 · 2773 PAINTER API · 4898 NBT介绍 · 3350 批量物品标签 · 4321 LootJS难度掉落 · 4695 三种通知 · 5427 使用他人代码 · 5500 JSdoc与作用域 · 3458 TYPES参数类型 · 5368 EnumExtenderJS拓展枚举 · 5618 DataComponent实例(1.21.1) · 6574/6575 带保质期方块注册 · 6102 CM多块结构自动生成 · 2089 FTB任务可重复 · 5218 Rhino反射实现类Mixin效果★ · 3110 PktTweaker自定义网络包★ · 6086 纯KubeJS6热编译加载Java类★ · 5395 MantleJS基本书本创建 · 5398 MantleJS Transformer批量书页 · 5080 合成输出直接附魔(Item.of().enchant,1.20.1) · 6566 KubeJS Cuisine菜品注册完整链路 · 2129/3144 KubeJS Mekanism/ArsNouveau相关编译
**单模组脚本实例**：2289 Create · 5139 机械动力kubejs6 · 3822 PonderJS · 5339 Ponder场景 · 6031 KubeJS×GTM · 5463 GTM矿脉/基岩流体 · 3820 GTM自定义 · 4715 匠魂3材料轮子 · 3487 匠魂材料(1.18.2) · 1776(见上禁转载) · 1233 Pewter官方范例译 · 1231 Infini-Tic · 3843 MaterialTweaker · 2298/2605 CoT匠魂/JAOPCA · 3372 CoT新特性 · 1516/1836/1767/3955/2838 CoT方块/物品/特性系列 · 5391 tetra魔改 · 5195 tetra effects数据包 · 4641 Goety仪式 · 4434 自定义法术 · 5351 IronsSpell js · 2484 Interactio配方 · 4665 Thermal机器(TS) · 4105/6298 恶意KubeJS魔改API · 3606 可开采矿脉 · 4620 无中生有(1.20.1) · 4475 CrT仿机械动力使用配方 · 5449 Forge事件改伤害类型 · 2974 @功能 · 2811 Mekatweaker · 6099 /ct hand等价 · 2353 模组作者教程汉化 · 2659 EpicFight数据包适配 · 2709 数据包适配EFM · 1863 IC2C(已升正式行)
**框架课程（Custom Machinery「模块化机械」系列）**：3421 机器基础 · 3422 机器外观 · 2963 Part1机械创建 · 2967 Part2配方创建 · 2994 Part3.1高级配方 · 3140 Part3.3机械事件系统 · 3687 Part4.1并行配方 · 3555 Extra GeckoLib模型动画 · 2300 Multiblocked入门 · 2572/2722 自定义机器事件/快速入门 · 3902 单方块机器 · 4182 多方块结构 · 4629 MBD2+KubeJS · 5540 curios注册饰品栏 · 5760 MBD2支持KubeJS · 6501 MBD2配方流体标签 · 1944 模块化控制器官方文档
**其他工具**：4004 OreTweaker json(1.16矿生成) · 4972 1.7.10自然建筑生成 · 2748/2589 CoFH World自定义矿脉(1.12.2) · 2174 triumph进度 · 6499 TC6可视化研究编辑器 · 6564 SFM可视化编程工具 · 2379 MCreator做匠魂材料 · 5701 IDEA接管MCreator工作区 · 1807 MCreator简易饰品 · 1047/1053 逻辑编程基础/高级篇 · [2875 QωQ Library 国产开发库](https://www.mcmod.cn/post/2875.html)（build.gradle 依赖与配置，抽样审计发现的宝石）· 635 最全kether教程（TabooLib国产脚本语言，❌禁转载）

## 工作流 / 元资源

| 帖子 | 内容 | 协议 |
|------|------|------|
| [站内收录模组加载器汇总](https://www.mcmod.cn/post/4880.html) | 20+ 加载器名录，配 `links/legacy-loader-upstreams` | 默认 BY-NC-SA |
| [如何在 GitHub 提交汉化](https://www.mcmod.cn/post/4473.html) ＋ [简单提交汉化](https://www.mcmod.cn/post/3419.html) | 上游 PR 补汉化流程 | 前者显式 BY-NC-SA |
| [NeoForge 中文文档 [Gpt4o出品]](https://www.mcmod.cn/post/5487.html) ＋ [1.21.x NeoForge 开发文档中文翻译](https://www.mcmod.cn/post/4403.html) | ⚠️ 机翻阅读辅助，权威以英文原文+`search_neoforge_docs` 为准 | 显式 BY-NC-SA |
| [利用创可贴和 Recaf 修改停更模组](https://www.mcmod.cn/post/3012.html) | 字节码打补丁续命；已提炼 `authored/legacy-mod-patching` | 默认 BY-NC-SA |
| [让任务文本使用语言文件](https://www.mcmod.cn/post/2194.html) | FTB Quests snbt 本地化键技巧 | 默认 BY-NC-SA |
| [1.7.10 Intel 核显渲染错误排查](https://www.mcmod.cn/post/4930.html) | 1.7.10 花屏/色块/全黑等 Intel iGPU 渲染问题与对策 | 默认 BY-NC-SA |
| [加速模组/插件构建——Lss233's.Mirror 篇](https://www.mcmod.cn/post/3793.html) | 构建依赖镜像加速 | 待核（默认 BY-NC-SA） |
| [Meddle 手动安装教程](https://www.mcmod.cn/post/4315.html) ＋ [原生打包 Cleanroom 整合包](https://www.mcmod.cn/post/6258.html) | 冷门加载器/1.7.10 生态运维 | 待核（默认 BY-NC-SA） |
| [(译) makamys《List of "Essential" 1.7.10 Mods》](https://www.mcmod.cn/post/3881.html) | 1.7.10 必备优化/修复/移植类模组全清单（含 Mixin 依赖说明），老版开发生态索引 ★回填扫描发现 | 默认（未声明，译作） |
| [Retromod 官方兼容评级](https://www.mcmod.cn/post/6659.html) | 五级评级评估旧模组字节码转换后在目标版本的实际可用度（Diamond≈原生移植…），配 `authored/legacy-mod-patching` | 默认（未声明） |
| [如何让 1.12.2 等于高版本？](https://www.mcmod.cn/post/4392.html) ＋ [我是如何用1.12.2以假乱真高版本的](https://www.mcmod.cn/post/1458.html) | 1.12.2 回搬高版本内容的 backport 模组生态清单对（Et Futurum 系等），配 `links/legacy-loader-upstreams` | ❌ 禁转载 |
| [如何用 spark 找到卡顿的源头](https://www.mcmod.cn/post/2523.html) | spark profiler 实操排查 tick 卡顿，配 `authored/profiling-performance` | 默认（未声明） |

## 已在库内的 mcmod 开发帖（不重复入库）

- `permitted/mcmod-3993-forge-mod-guide` —— Forge 版 mod 制作维护（作者许可提炼全文）
- `links/mcmod-6071-forge-engineering` —— 工程化 Forge 开发指南（1.20.1，禁转载）

## 待核实补充清单（重写时遗漏的候选，2026-08-24 diff 补录）

> 以下 95 个 ID 在扫描笔记中有记录但因条目文件重写时遗漏。按主题分组，**未逐篇核正文/许可**——使用前需自行打开核实。

### 数据驱动 / 框架 / 资产
1593 EasyRetrogen世界生成回填 · 2734 定制配方 · 2750 数据包NBT合成表 · 4155 挖砍数据包资源包(新武器) · 5070 Json Things中文指南(JSON定义物品方块框架) · 5646 数据包自定义结构 · 6251 pack.mcmeta详细写法 · 5559 官方示例test_cave_dragon数据包详解

### Java 模组开发
3936 AnnotationLib快捷注册物品 · 4273 Anno注解库添加新注解和解析器 · 5411 [1.12 Forge]JEI Plugin开发基础教程 · 6077 1.12.2空白模组模板的使用 · 6148 在自己的模组添加配方联动 · 3492 Mod开发的大体思路 · 3257 低版本开发[1.12.2/1.7.10]简述 · 4524 贴图导入至你做的模组 · 5347 NeoForge修改装备属性 · 4936 NeoForge预览调试自制皮肤 · 4068 音频转ogg资源工作流

### 脚本系（CrT/KubeJS/GroovyScript/Tweaker家族）
503 CT-HELP基础合成 · 532/536/843 CT-HELP扩展系列 · 1038 GTTweaker使用细节 · 1184 MTUtils GT6魔改 · 1231 Infini-Tic匠魂材料工具 · 1233 Pewter官方范例译 · 1327 RecipeStages官方wiki译 · 1593 同上已列 · 1701 CrT改几乎所有模组特性 · 1708 CrT配方函数 · 1887 CrT基础中的基础 · 1888 CrT合成表修改基础 · 1938 GameStages使用 · 1956 CrT控制游戏阶段 · 1957 CrT在JEI添加描述 · 2006 KubeJS特殊配方(TaC等) · 2018 CrT游戏事件操作 · 2025 CrT禁用作弊 · 2067 jaopca自定义MOD解决 · 2165 Zen术语解析 · 2174 triumph进度 · 2289 Create魔改 · 2294 KubeJS综合魔改 · 2307 NaturesAuraTweaker · 2313 MBD对CrT支持 · 2353 模组作者汉化 · 2379 MCreator做匠魂材料 · 2480 CC程序发现Catalyst合成 · 2773 PAINTER API · 2811 Mekatweaker · 2838 CoT复杂特性 · 2985 GTCEu版MultiblockTweaker ★ · 3023 CrT入门从0开始 · 3026 事件+数组循环入门 · 3082 FileTweaker · 3110 PktTweaker网络包★ · 3140 CM机械事件系统 · 3181 CrT事件教学 · 3207 低版本开发简述 · 3245 endertweaker教程 · 3307 ZenTraits教程 · 3348 GenCreator使用方法 · 3350 kjs批量标签 · 3391 最全CrT合集 · 3480 Scavenge文档译 · 3555 CM Extra GeckoLib · 3606 kjs可开采矿脉 · 3611 kjs魔改思路 · 3719 kjs注册按键 · 3764 InControl经验分享 · 3792 CrT跨版本配方基改 · 3820 kjs自定义GTM · 3822 PonderJS基础 · 3830 kjs SkillSlot技能 · 3845 IC2 Tweaker+CrT · 3924 新版CrT基础(1.20.1) · 4004 OreTweaker json写法 · 4063 kjs6改模组配方 · 4077 TypeScript写KubeJS · 4108 恶意KubejsAPI · 4125 YSM变量Molang · 4149 geckolib模型发光 · 4211 RenderJS方块实体渲染 · 4235 MysticalCustomization添加作物 · 4321 LootJS难度掉落 · 4333 KJS6进阶实例 · 4393 KJS6 Curios检测 · 4434 KJS自定义法术 · 4475 CrT仿机械动力使用配方 · 4483 InControl阶段教程 · 4620 kjs无中生有 · 4621 kjs+curios装备判定 · 4641 Goety仪式KubeJS · 4665 Thermal机器TS魔改 · 4672 AoA3战利品表概念简介 · 4715 匠魂3材料轮子(KubeJS) · 4736 世界合成(CrT) · 4820 无Java写匠魂内容 · 4896 gtnh蒸馏配方(KJS) · 4898 NBT介绍(KJS新手) · 4967 ZU ZenClass继承原生类型★ · 5007 InControl全方位 · 5103 LootTweaker入门 · 5139 机械动力kubejs6魔改 · 5165 TypeScript CompoundTag自动补全 · 5195 tetra effects数据包 · 5207 炎葬伤害KJS思路 · 5218 Rhino反射类Mixin效果★ · 5257 复刻魔力花(KJS) · 5268 KubeJS创建匠魂材料 · 5284 安卓ProbeJS补全 · 5316 匠魂特性记录 · 5339 Ponder场景(PonderJS) · 5351 IronsSpell js · 5368 EnumExtenderJS拓展枚举 · 5391 kubejs tetra魔改 · 5411 JEI Plugin开发(见Java组) · 5427 使用他人分享的KubeJS代码 · 5449 kjs6 Forge事件改伤害类型 · 5500 JSdoc和包裹作用域 · 5540 curios注册新饰品栏(KJS) · 5618 DataComponent手持终端充电(KJS 1.21.1) · 5624 kjs7+Curios原生集成实例 · 5630 ItemAttributeModifierEvent · 5741 AlmostUnified物品统一(KJS7) · 5845 kjs匠魂升级2兼容 · 5898 TACZ原生KubeJS6事件 · 5921 配方编辑可视化思路 · 5939 ProbeJS+VSC(已升正式行) · 6012 CrT合成继承原书NBT · 6029 classfilter爆破自由使用类 · 6031 KubeJS×GTM新版示范 · 6063 kjs6改模组配方 · 6099 /ct hand等价(KJS) · 6102 CM多块结构自动生成(KJS) · 6142 KubeJS Wiki翻译(已升正式行)

### 工作流 / 运维
3793 加速构建Lss233镜像 · 4315 Meddle安装 · 4931 ServerHibernate休眠工具 · 6222 整合包制作教程2026最新 · 6258 Cleanroom打包 · 6441 NeoForge 26.2移植实践 · 6644 rd-132211 Fabric版考古

### 额外参考
4386 CFB隐藏任务教程 · 4520 AutoHarvest-RE移植实践 · 2554 Fabric个人移植实践 · 3480 TerraBlender辅助实例 · 5090 IDEA修改Clockworkaddition源码修补 · 5316 匠魂特性记录 · 5675 同上族 · 6177 Forge硬编码汉化(标注风险)

### 二次补录（diff 检出的 28 个遗漏 ID）
616 CS3 P11简单事件(CS3系列) · 1038 GTTweaker使用细节(脚本) · 1257 核电工艺CrT配方说明(脚本) · 1358 群峦CrT官方文档英译(脚本) · 1630 Reskillable自定义物品(脚本) · 1820 CS3 P12建GUI(CS3系列) · 2997 ItemStages不止于物品阶段(脚本) · 3681 自定义舞蹈动作(资产/动画) · 3790 为Cleanroom贡献代码(工作流) · 4071 注册ItemDecorator(Java) · 4187 自定义动画(资产) · 4239 数据包/资源包载入顺序指定(数据包) · 4256 CrT改属性+汉化(脚本) · 4259 数据包跨模组流体兼容(数据包) · 4354 CoT+CrT脚本分享(脚本) · 4448 KJS自定义法术里篇(脚本) · 4528 获取已知方块数据api(脚本) · 4551 酒类Tooltip脚本(1.12.2,脚本) · 4606 多方块检测CrT 1.12.2(脚本) · 4616 GTCEu自定义多方块蒸馏(GT) · 4890 NeoForge创建多方块仪式(框架) · 4922 优雅提取NBT(技巧) · 5097 匠魂纹理生成器同族(资产) · 5519 帕秋莉手册模组开发者向❌禁转载(主表已有行但此ID补录) · 5594 PufferfishSkills自定义技能文档(config) · 5623 kubejs物品升级模块变体(脚本) · 5908 OMETweaks+Tooltip(脚本) · 6123 TiC3相对TiC2更新了什么·官方文档翻译(迁移知识) · 6498 MixinExtras使用详解&Wiki翻译★配mixin篇

## 额外参考：模组特定 / 玩家向（仅外链，按需自取）

> 标题已逐条通读（2026-08），多为**单模组配置、魔改、攻略类**，泛化价值有限。URL 规律：`https://www.mcmod.cn/post/<id>.html`。完整单帖清单过长，此处收录代表性条目：

128 添加矿物方块(存疑单模组) · 337 LiteLoader安装 · 3556 Cleanroom安装 · 1924 恐龙自然生成config · 2358 自定义建筑风格 · 2576 自定义建筑生成 · 4067 EpicFight AI配置 · 5466 外部AI API配置 · 84 文件结构 · 85 1.6.X Forge介绍 · 1438 MC1.1加载器考古 · 4315 Meddle(已升正式行) · 1635 Ruins mod 结构模板tml编写(1.12.2，单模组私有格式，勿与现代数据包结构生成混淆) · **运维/JVM调优**：1499 Java8优化JVM参数(显式BY-NC-SA) · 4609 修改JVM参数优化整合包 · 5298 服务端GC选择测试 · 2122/2226/2274 工具品质/词缀/实体配置 · 380 GT5_cfg注释 · 175 拔刀剑NBT · 704/1087/2142 NBT编辑族 · 3066/3069 Ad Astra星球 · 4562/2474/5216/6206 数据包单项 · 2899/3688/4246/4648/4961/5107/5285/6455/6484 KubeJS单项 · 4088 快捷键脚本 · 1894/4078 枪械安装导入 · 953/4999 VMW枪械配件 · 3032/2566 MCAR皮肤 · 2603/3476 资源包模型包 · 587 家具配方 · 4097 匠魂3索引 · 952 Sol:carrot · 及其余攻略类约 800 篇未列。

## 用法提醒

- 各篇按录制时版本写：引用前先过 AGENT_USAGE「用前先对版本」，API 以当档 `search_*_docs` / 官方 wiki 为准。
- 「声明协议」列在 `/post/` 列表页可见；新增 mcmod 条目前先核该列，禁转载只进 `links/`。
- 个人教程区扫描基于 `order=hot` 全量分页；`order=time` 的增量更新可在需要时补扫。
- **正文核查覆盖声明（2026-08-24）**：主表全部行已逐篇读正文复核；脚本速查行为标题级定位；另按每约21篇抽1篇对未收录帖做了 **251 篇正文抽样审计**（ID 108–6680 系统抽样），发现漏网开发内容 2 篇（2875、4725，已补录），其余均为玩法/配置类——据此估算标题级筛选的漏网率约 1%，且漏网者多为单模组脚本实例。
