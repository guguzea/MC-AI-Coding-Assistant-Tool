---
id: links/datapack-vanilla-tutorial-index
title: 原版数据包 / 原版模组教程与工具索引（外链）
url: https://zhangshenxing.github.io/VanillaModTutorial/
summary: 原版数据包（datapack）与原版模组的中文教程与工具入口：香草图书馆文档站、Minecraft 原版模组入门教程、Misode 生成器族、VSCode datapack 语言服务器、MCreator。本仓主面是 Java 模组与基岩 Add-On，数据包只有零散片段，本页补这一层的入口，全部仅外链不入库正文。
tags: [index, datapack, vanilla, zh-cn, misode, tools, link-only]
sourceKind: links
mcHint: 数据包格式随版本变（pack_format 逐版不同）；引用前先确认目标版本的 pack_format
---

# 原版数据包 / 原版模组教程与工具索引（外链）

> **本页补哪个缺口**：本仓 `data/` 下的语料全是**加载器文档**（Forge / Fabric / NeoForge / Quilt / LiteLoader / Rift / ModLoader）与 **Paper 服务端**文档，`community_knowledge/authored/` 里也没有数据包短文——数据包只在 worldgen / 战利品 / 附魔等模组短文里作为**产出格式**被顺带提到。纯原版数据包开发（函数 / 进度 / 谓词 / 战利品表 / 结构 / 维度）本仓没有成体系的入口，本页补这一层。

## 状态约定

本页条目状态只有两种取值：

- **✅ 可用** —— 默认。含反爬主机对脚本返回 403（如 `minecraft.wiki` 的 Cloudflare 挑战页、`mcreator.net`）、本机 DNS 污染/超时——这两类都**不是失效**。
- **❌ 已失效** —— 仅限实测到 **404 / 410 / NXDOMAIN**，逐条列在文末《已失效条目》。

## 教程与文档

| 资源 | 链接 | 状态 |
|------|------|------|
| Minecraft 原版模组入门教程（中文，成体系） | https://zhangshenxing.github.io/VanillaModTutorial/ | ✅ 可用 |
| 香草图书馆 · 数据包文档站 | https://cr-019.github.io/datapack-index/ | ✅ 可用 |
| 香草图书馆国内镜像 | https://vanillalibrary.mcfpp.top/datapack-index/ | ✅ 可用 |
| 数据包 — Minecraft Wiki（中文） | https://zh.minecraft.wiki/w/%E6%95%B0%E6%8D%AE%E5%8C%85 | ✅ 可用 |
| Data pack — Minecraft Wiki（英文） | https://minecraft.wiki/w/Data_pack | ✅ 可用 |

## 工具

| 工具 | 链接 | 状态 | 用途 |
|------|------|------|------|
| Misode 生成器族 | https://misode.github.io/ | ✅ 可用 | 战利品表 / 进度 / 谓词 / 附魔 / 维度等 JSON 可视化生成；本仓 `data/fabric_26.2` 的附魔页也引它 |
| Datapack Language Server（VSCode 插件） | https://marketplace.visualstudio.com/items?itemName=SPGoding.datapack-language-server | ✅ 可用 | 函数文件语法高亮与补全 |
| MCreator | https://mcreator.net/ | ✅ 可用（注意：它是**可视化模组生成器**，产出模组工程不是纯数据包，**不适合**当作数据包教程） |

## 已失效条目

**判据**：2026-10-31 实测 **404 / 410 / NXDOMAIN** 三条硬失效之一。403（反爬）、超时（网络）、5xx（站点故障）都**不计入失效**。

本栏主题（数据包）下**无**已失效条目——原指南该栏 7 条全部可用。下列两条是原指南**其他栏目**的失效项，因与本页提到的映射/着色器话题相关而登记备查：

| 原条目 | 链接 | 读数 |
|--------|------|------|
| `saada2006` 着色器教程站（原指南「着色器包」栏） | https://saada2006.github.io/minecraft-shader-tutorials/ | **404** |
| Linkie 映射表查询（原指南「Fabric 模组」栏） | https://linkie.shedaniel.me/mappings | **404** |

## 用法与边界

- **数据包 ≠ 模组**：数据包走 `data/<namespace>/…` + `pack.mcmeta` 的 `pack_format`，不需要 Java 工程、不需要加载器；本仓的平台判定（第 1–9 步）对它**不适用**，别为数据包去 `activate_platform_pack`。
- **`pack_format` 逐版不同**，且 1.20.5 之后组件化改动大：写数据包前先确认目标版本的 `pack_format` 数值，本仓**没有**该对照表——这个数只能取自该版 Minecraft Wiki 或官方数据包模板，查不到就留 `// TODO(未核实)`。
- 本仓 `authored/` 里的 worldgen / 战利品 / 附魔短文讲的是**模组侧怎么产出**这些 JSON，与纯数据包开发的关注点不同，可作格式参考但不作教程。
- 用 `validate_datapack_json` 可校验数据包 JSON 结构（本仓工具面唯一与数据包直接相关的检查）。
